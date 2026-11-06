<?php

namespace App\Documentation\Search;

use Illuminate\Support\Facades\Process;
use RuntimeException;

final class SearchExtractor
{
    /** @return list<SearchDocument> */
    public function extract(SearchCatalog $catalog): array
    {
        $result = Process::path(base_path())
            ->input(json_encode($catalog->pages(), JSON_THROW_ON_ERROR))
            ->timeout(120)
            ->run(['node', base_path('scripts/documentation-search.mjs')]);

        if ($result->failed()) {
            throw new RuntimeException('Documentation extraction failed. '.trim($result->errorOutput()));
        }

        $records = json_decode($result->output(), true, flags: JSON_THROW_ON_ERROR);

        throw_if(! is_array($records) || ! array_is_list($records) || $records === [], RuntimeException::class, 'The search extractor returned no document list.');

        $documents = array_map(SearchDocument::fromExtracted(...), $records);
        $ids = array_map(fn (SearchDocument $document): string => $document->id(), $documents);

        throw_if(count(array_unique($ids)) !== count($ids), RuntimeException::class, 'The search extractor returned duplicate section anchors.');

        $roots = array_map(fn (SearchDocument $document): string => $document->slug->value, array_filter($documents, fn (SearchDocument $document): bool => $document->anchor === null));
        $expected = array_column($catalog->pages(), 'slug');
        sort($roots);
        sort($expected);

        throw_if($roots !== $expected, RuntimeException::class, 'The search extractor did not return every registered page.');

        return $documents;
    }
}
