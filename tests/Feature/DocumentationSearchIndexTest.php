<?php

use App\Documentation\PageSlug;
use App\Documentation\Search\DocumentationSearchIndex;
use App\Documentation\Search\SearchCatalog;
use App\Documentation\Search\SearchDocument;
use App\Documentation\Search\SearchExtractor;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;

beforeEach(function () {
    $this->searchDirectory = sys_get_temp_dir().'/atb-search-index-'.bin2hex(random_bytes(8));
    mkdir($this->searchDirectory);
    config(['documentation.search_index' => $this->searchDirectory.'/search.sqlite']);
});

afterEach(function () {
    File::deleteDirectory($this->searchDirectory);
});

test('publishes a real FTS index and leaves an identical artifact untouched', function () {
    $index = resolve(DocumentationSearchIndex::class);
    $documents = [new SearchDocument(PageSlug::Core, 'Core', 'Core', null, null, 'A searchable utility.')];

    expect($index->publish($documents))->toBeTrue();
    $bytes = file_get_contents(config('documentation.search_index'));
    $inode = fileinode(config('documentation.search_index'));
    expect($index->publish($documents))->toBeFalse();
    expect($index->publish($documents, check: true))->toBeFalse();
    expect(file_get_contents(config('documentation.search_index')))->toBe($bytes);
    expect(fileinode(config('documentation.search_index')))->toBe($inode);
    expect(fileperms(config('documentation.search_index')) & 0777)->toBe(0644);
    expect($index->search('searchable')[0]['href'])->toBe('/docs/core');
    expect(glob($this->searchDirectory.'/.documentation-search-*'))->toBe([]);
});

test('recovers an artifact whose metadata is current but whose search table is invalid', function (bool $incompleteTable) {
    $index = resolve(DocumentationSearchIndex::class);
    $documents = [new SearchDocument(PageSlug::Core, 'Core', 'Core', null, null, 'Original')];
    $index->publish($documents);
    $database = new PDO('sqlite:'.config('documentation.search_index'));
    $database->exec('DROP TABLE search_documents');

    if ($incompleteTable) {
        $database->exec('CREATE TABLE search_documents (id TEXT, slug TEXT)');
    }

    $database = null;
    expect(fn () => $index->publish($documents, check: true))->toThrow(RuntimeException::class, 'invalid');
    expect($index->publish($documents))->toBeTrue();
    expect($index->search('Original'))->toHaveCount(1);
})->with(['missing table' => [false], 'missing columns' => [true]]);

test('a full rebuild replaces changed text and removes deleted sections', function () {
    $index = resolve(DocumentationSearchIndex::class);
    $index->publish([
        new SearchDocument(PageSlug::Core, 'Core', 'Core', null, null, 'Oldword'),
        new SearchDocument(PageSlug::Core, 'Core', 'Core', 'Deleted', 'deleted', 'Removedword'),
    ]);
    $index->publish([new SearchDocument(PageSlug::Core, 'Core', 'Core', null, null, 'Newword')]);

    expect($index->search('Oldword'))->toBe([]);
    expect($index->search('Removedword'))->toBe([]);
    expect($index->search('Newword'))->toHaveCount(1);
});

test('freshness checking never writes a missing or stale index', function () {
    $index = resolve(DocumentationSearchIndex::class);
    $documents = [new SearchDocument(PageSlug::Core, 'Core', 'Core', null, null, 'Original')];
    expect(fn () => $index->publish($documents, check: true))->toThrow(RuntimeException::class, 'stale');
    expect(config('documentation.search_index'))->not->toBeFile();
    $index->publish($documents);
    $bytes = file_get_contents(config('documentation.search_index'));
    expect(fn () => $index->publish([new SearchDocument(PageSlug::Core, 'Core', 'Core', null, null, 'Changed')], check: true))
        ->toThrow(RuntimeException::class, 'stale');
    expect(file_get_contents(config('documentation.search_index')))->toBe($bytes);
});

test('a failed command preserves the last good index', function () {
    $index = resolve(DocumentationSearchIndex::class);
    $index->publish([new SearchDocument(PageSlug::Core, 'Core', 'Core', null, null, 'Original')]);
    $bytes = file_get_contents(config('documentation.search_index'));
    Process::fake(['*' => Process::result(errorOutput: 'A source expression is unsupported.', exitCode: 1)]);

    $this->artisan('docs:search:index')->expectsOutputToContain('A source expression is unsupported.')->assertFailed();
    expect(file_get_contents(config('documentation.search_index')))->toBe($bytes);
    expect($index->search('Original'))->toHaveCount(1);
    expect(glob($this->searchDirectory.'/.documentation-search-*'))->toBe([]);
});

test('validates extractor output rather than publishing incomplete or malformed data', function (string $output) {
    Process::fake(['*' => Process::result(output: $output)]);
    $this->artisan('docs:search:index')->assertFailed();
    expect(config('documentation.search_index'))->not->toBeFile();
})->with([
    'invalid JSON' => ['{'],
    'empty list' => ['[]'],
    'unknown route' => ['[{"slug":"unregistered","title":"Title","body":"Body","heading":null,"anchor":null,"packageTitle":null}]'],
    'missing pages' => ['[{"slug":"core","title":"Core","body":"Body","heading":null,"anchor":null,"packageTitle":"Core"}]'],
    'missing metadata' => ['[{"slug":"core","title":"Core","body":"Body"}]'],
]);

test('exports all pages in registry order with canonical source metadata', function () {
    $catalog = resolve(SearchCatalog::class)->pages();
    expect(array_column($catalog, 'slug'))->toBe(array_map(fn (PageSlug $slug): string => $slug->value, PageSlug::cases()));

    foreach ($catalog as $record) {
        expect(base_path($record['sourcePath']))->toBeFile();
        expect($record)->toHaveKeys(['title', 'description', 'requirements', 'packageTitle']);
    }
});

test('indexes and checks the real registered Vue corpus through the deployment command', function () {
    $this->artisan('docs:search:index')->expectsOutput('Documentation search index published.')->assertSuccessful();
    $index = resolve(DocumentationSearchIndex::class);
    expect(array_column($index->search('maintainer_ssh_key'), 'href'))->toContain('/docs/maintainer/configuration/ssh-keys#use-the-helpers');
    expect(array_column($index->search('phpstan.dist.neon'), 'href'))->toContain('/docs/maintainer/ci/quality#requirements-and-skipped-commands');
    expect($index->search('installation'))->not->toBeEmpty();
    $documents = resolve(SearchExtractor::class)->extract(resolve(SearchCatalog::class));
    expect(count(array_filter($documents, fn (SearchDocument $document): bool => $document->anchor === null)))->toBe(count(PageSlug::cases()));
    $bytes = file_get_contents(config('documentation.search_index'));
    $this->artisan('docs:search:index --check')->expectsOutput('Documentation search index is current.')->assertSuccessful();
    $this->artisan('docs:search:index')->expectsOutput('Documentation search index is current.')->assertSuccessful();
    expect(file_get_contents(config('documentation.search_index')))->toBe($bytes);
});
