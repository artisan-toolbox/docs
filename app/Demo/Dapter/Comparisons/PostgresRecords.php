<?php

namespace App\Demo\Dapter\Comparisons;

use ArtisanToolbox\Dapter\EloquentDataSource;
use Illuminate\Database\Eloquent\Builder;

/** @extends EloquentDataSource<Document> */
abstract class PostgresRecords extends EloquentDataSource
{
    /** @return Builder<Document> */
    public function source(): Builder
    {
        abort_unless(config('docs-dapter-comparisons.enabled') === true, 503, 'The isolated PostgreSQL comparison demo is not configured.');

        return Document::query()->where('tenant_key', 'docs-comparisons')->where('active', true);
    }
}
