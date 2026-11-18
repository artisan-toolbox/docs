<?php

namespace App\Demo\Dapter\Fields;

use App\DataSources\Dapter\FieldsDriver;
use ArtisanToolbox\Dapter\Contracts\CollectionSource;
use ArtisanToolbox\Dapter\Contracts\DataSource;
use ArtisanToolbox\Dapter\Contracts\StoreDriver;
use ArtisanToolbox\Dapter\Drivers\CollectionStoreDriver;
use ArtisanToolbox\Dapter\Drivers\DriverRegistry;
use ArtisanToolbox\Dapter\Support\SourceRegistry;
use Illuminate\Support\Collection;
use LogicException;

final class FieldConfiguration
{
    public static function register(): void
    {
        resolve(SourceRegistry::class)->register('Dapter.AliasedFields', FieldsDriver::class);
        resolve(DriverRegistry::class)->register('docs_fields', static function (DataSource $source): StoreDriver {
            throw_unless($source instanceof CollectionSource, LogicException::class, 'The documentation field driver requires a Collection source.');

            return new CollectionStoreDriver((new Collection($source->source()))->map(
                static fn (array $row): array => [...$row, 'driver' => 'docs_fields'],
            ));
        });
    }
}
