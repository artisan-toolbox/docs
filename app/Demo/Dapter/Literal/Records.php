<?php

namespace App\Demo\Dapter\Literal;

use ArtisanToolbox\Dapter\CollectionDataSource;
use Illuminate\Support\Facades\File;

abstract class Records extends CollectionDataSource
{
    /** @return list<array{id: int, name: string, tenant: int}> */
    public function source(): array
    {
        $rows = json_decode(File::get(__DIR__.'/records.json'), true, flags: JSON_THROW_ON_ERROR);

        return array_values(array_filter($rows, static fn (array $row): bool => $row['tenant'] === 1));
    }
}
