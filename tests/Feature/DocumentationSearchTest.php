<?php

use App\Documentation\Documentation;
use App\Documentation\PageSlug;
use App\Documentation\Search\DocumentationSearchIndex;
use App\Documentation\Search\SearchDocument;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

beforeEach(function () {
    $this->searchDirectory = sys_get_temp_dir().'/atb-search-http-'.bin2hex(random_bytes(8));
    mkdir($this->searchDirectory);
    config(['documentation.search_index' => $this->searchDirectory.'/search.sqlite']);
});

afterEach(function () {
    File::deleteDirectory($this->searchDirectory);
});

test('searches prose, code and Unicode with canonical section links and text excerpts', function () {
    resolve(DocumentationSearchIndex::class)->publish([
        new SearchDocument(PageSlug::Core, 'Core', 'Core', 'Conditional arrays', 'conditional-arrays', 'Use arrayWhen with café settings. <script>alert(1)</script> remains literal example text.'),
        new SearchDocument(PageSlug::Index, 'Documentation', null, null, null, 'A directory of packages.'),
    ]);

    $response = $this->getJson(route('docs.search', ['q' => 'arrayWh'], false))
        ->assertOk()
        ->assertHeader('X-Robots-Tag', 'noindex, nofollow')
        ->assertJsonPath('query', 'arrayWh')
        ->assertJsonCount(1, 'results')
        ->assertJsonPath('results.0.id', 'core#conditional-arrays')
        ->assertJsonPath('results.0.pageTitle', 'Core')
        ->assertJsonPath('results.0.sectionTitle', 'Conditional arrays')
        ->assertJsonPath('results.0.packageTitle', 'Core')
        ->assertJsonPath('results.0.href', '/docs/core#conditional-arrays');

    expect($response->headers->get('Cache-Control'))->toContain('no-store');
    expect($response->json('results.0.excerpt'))->toContain('<script>alert(1)</script>');
    $this->getJson('/docs/search?q=cafe')->assertOk()->assertJsonCount(1, 'results');
    $this->getJson('/docs/search?q=directory')->assertOk()->assertJsonPath('results.0.href', '/docs');
});

test('treats punctuation, FTS operators and SQL fragments as literal words', function (string $query, int $count) {
    resolve(DocumentationSearchIndex::class)->publish([
        new SearchDocument(PageSlug::Core, 'Core', 'Core', null, null, 'An array utility.'),
    ]);

    $this->getJson('/docs/search?'.http_build_query(['q' => $query]))->assertOk()->assertJsonCount($count, 'results');
})->with([
    'punctuation only' => ['" * : ( )', 0],
    'quoted prefix' => ['"array"*', 1],
    'FTS operator is a word' => ['array OR absent', 0],
    'SQL is not executed' => ["'; DROP TABLE search_documents; --", 0],
    'unknown term' => ['absent', 0],
]);

test('rejects invalid queries as JSON even without an Accept header', function (mixed $query) {
    $this->get('/docs/search?'.http_build_query(['q' => $query]))
        ->assertStatus(422)
        ->assertHeader('Content-Type', 'application/json')
        ->assertHeader('X-Robots-Tag', 'noindex, nofollow');
})->with(['missing' => [null], 'short' => ['a'], 'long' => [str_repeat('x', 121)], 'array' => [['text']]]);

test('returns a generic unavailable response for missing, corrupt and wrong-schema indexes', function (string $state) {
    if ($state === 'corrupt') {
        file_put_contents(config('documentation.search_index'), 'not a database');
    } elseif ($state === 'schema') {
        $database = new PDO('sqlite:'.config('documentation.search_index'));
        $database->exec('CREATE TABLE search_metadata (schema_version INTEGER); INSERT INTO search_metadata VALUES (999)');
        $database = null;
    }

    $response = $this->getJson('/docs/search?q=array')->assertStatus(503)
        ->assertExactJson(['message' => 'Documentation search is temporarily unavailable. Please try again later.'])
        ->assertHeader('X-Robots-Tag', 'noindex, nofollow');

    expect($response->getContent())->not->toContain($this->searchDirectory, 'SQLSTATE', 'sqlite:');
    expect($response->headers->get('Cache-Control'))->toContain('no-store');
})->with(['missing', 'corrupt', 'schema']);

test('searches only the validated query parameters when a GET request also has a JSON body', function () {
    resolve(DocumentationSearchIndex::class)->publish([
        new SearchDocument(PageSlug::Core, 'Core', 'Core', 'Section', 'section', 'A matching utility.'),
    ]);

    $this->json('GET', '/docs/search?q=matching', ['q' => str_repeat('x', 121)])
        ->assertOk()
        ->assertJsonPath('query', 'matching')
        ->assertJsonCount(1, 'results');
});

test('limits and stably orders matching sections', function () {
    $documents = [];

    for ($number = 0; $number < 18; $number++) {
        $documents[] = new SearchDocument(PageSlug::Core, 'Core', 'Core', 'Section', sprintf('section-%02d', $number), 'A matching utility.');
    }

    foreach ([PageSlug::Maintainer, PageSlug::Mosaicast, PageSlug::QzTray] as $slug) {
        for ($number = 0; $number < 4; $number++) {
            $documents[] = new SearchDocument($slug, 'Page', 'Package', 'Section', 'section-'.$number, 'A matching utility.');
        }
    }

    resolve(DocumentationSearchIndex::class)->publish($documents);
    $first = $this->getJson('/docs/search?q=matching')->assertOk()->assertJsonCount(12, 'results')->json('results');
    $second = $this->getJson('/docs/search?q=matching')->assertOk()->json('results');
    expect($second)->toBe($first);
    expect($first[0]['id'])->toBe('core#section-00');
    expect(array_count_values(array_map(fn (array $result): string => explode('#', $result['id'])[0], $first)))
        ->toBe(['core' => 3, 'maintainer' => 3, 'mosaicast' => 3, 'qztray' => 3]);
});

test('uses named routes and encoded anchors rather than stored or request URLs', function () {
    resolve(DocumentationSearchIndex::class)->publish([
        new SearchDocument(PageSlug::Core, 'Core', 'Core', 'Encoded anchor', 'spaces & unicode ç', 'An encoded example.'),
    ]);
    Route::getRoutes()->getByName('docs.show')->setUri('/reference/{slug}');

    $this->getJson('/docs/search?q=encoded&url=https://untrusted.example')->assertOk()
        ->assertJsonPath('results.0.href', '/reference/core#spaces%20%26%20unicode%20%C3%A7');
    expect(resolve(Documentation::class)->links()['search'])->toBe('/docs/search');
});

test('rate limits public search requests', function () {
    for ($number = 0; $number < 60; $number++) {
        $this->getJson('/docs/search?q=!!')->assertOk();
    }

    $response = $this->getJson('/docs/search?q=!!')->assertStatus(429)
        ->assertHeader('X-Robots-Tag', 'noindex, nofollow');
    expect($response->headers->get('Cache-Control'))->toContain('no-store');
});
