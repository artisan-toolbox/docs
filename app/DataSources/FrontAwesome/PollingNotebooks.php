<?php

namespace App\DataSources\FrontAwesome;

use App\Demo\Dapter\Live\Fixtures;
use ArtisanToolbox\Dapter\CollectionDataSource;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Http\Request;

final class PollingNotebooks extends CollectionDataSource implements WithOptions
{
    public function __construct(private readonly Request $request) {}

    public function options(): StoreOptions
    {
        return StoreOptions::make()->guard('docs-dapter')->pageSize(2)->pageSizeOptions([2]);
    }

    /** @return list<array{id: int, name: string}> */
    public function source(): array
    {
        $reader = (string) $this->request->user()?->getAuthIdentifier();

        return array_map(fn (array $row): array => ['id' => $row['id'], 'name' => $row['name']], Fixtures::rows($reader));
    }
}
