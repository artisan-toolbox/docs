<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Comparisons\PostgresRecords;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

final class ComparisonsPostgresConfig extends PostgresRecords implements WithOptions
{
    public function options(): StoreOptions
    {
        $previous = config('dapter.declarations');
        try {
            config(['dapter.declarations' => [
                'fields' => ['title' => ['search' => [
                    'matchTypes' => ['contains', 'full_text'],
                    'options' => ['fullText' => ['configuration' => 'pg_catalog.english']],
                ]]],
                'global' => ['search' => ['document' => [
                    'target' => 'title', 'matchType' => 'full_text',
                    'fullText' => ['configuration' => 'pg_catalog.english'],
                ]]],
            ]]);

            return StoreOptions::make()->publicAccess()->pageSize(4)->pageSizeOptions([4]);
        } finally {
            config(['dapter.declarations' => $previous]);
        }
    }
}
