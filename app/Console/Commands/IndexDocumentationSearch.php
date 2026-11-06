<?php

namespace App\Console\Commands;

use App\Documentation\Search\DocumentationSearchIndex;
use App\Documentation\Search\SearchCatalog;
use App\Documentation\Search\SearchExtractor;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Throwable;

#[Description('Build the documentation full-text search index from registered Vue pages')]
#[Signature('docs:search:index {--check : Check index freshness without writing}')]
final class IndexDocumentationSearch extends Command
{
    public function handle(SearchCatalog $catalog, SearchExtractor $extractor, DocumentationSearchIndex $index): int
    {
        try {
            $documents = $extractor->extract($catalog);
            $changed = $index->publish($documents, (bool) $this->option('check'));
            $this->info($changed ? 'Documentation search index published.' : 'Documentation search index is current.');

            return self::SUCCESS;
        } catch (Throwable $exception) {
            $this->error($exception->getMessage());

            return self::FAILURE;
        }
    }
}
