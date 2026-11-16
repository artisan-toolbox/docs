<?php

declare(strict_types=1);

namespace App\DataSources\SharedFixtures;

use App\Demo\Dapter\Listing\FixtureProduct;
use ArtisanToolbox\Dapter\Attributes\PageSize;
use ArtisanToolbox\Dapter\Attributes\PageSizeOptions;
use ArtisanToolbox\Dapter\Attributes\PublicAccess;
use ArtisanToolbox\Dapter\CollectionDataSource;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\EloquentDataSource;
use ArtisanToolbox\Dapter\Enums\ErrorKind;
use ArtisanToolbox\Dapter\Http\DapterException;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

final class Context
{
    public static ?StoreOptions $options = null;

    public static array $rows = [];

    public static string $tenant = 'north';

    public static string $driver = 'sqlite';

    public static ?int $limit = null;

    public static ?string $callback = null;

    public static int $callbackCalls = 0;

    public static ?string $failure = null;

    public static int $hooks = 0;

    public static int $reads = 0;

    public static function projected(): array
    {
        return collect(self::$rows)->where('tenant', self::$tenant)
            ->sortBy([['name', 'asc'], ['id', 'asc']])
            ->map(static fn (array $row): array => array_intersect_key($row, array_flip(['id', 'name', 'tenant'])))
            ->values()->all();
    }
}

#[PublicAccess]
class SourceOnly extends CollectionDataSource
{
    public function source(): array
    {
        Context::$reads++;

        return Context::projected();
    }
}

#[PageSize(3)]
#[PageSizeOptions([3])]
class AttributeOnly extends SourceOnly {}

class Options extends SourceOnly implements WithOptions
{
    public function options(): StoreOptions
    {
        Context::$hooks++;

        return Context::$options ?? StoreOptions::make();
    }
}

#[PageSize(3)]
#[PageSizeOptions([3])]
class ParentAttributes extends Options {}

final class Inherited extends ParentAttributes {}

#[PageSize(1)]
#[PageSize(3)]
final class Duplicate extends SourceOnly {}

final class UndeclaredHook extends SourceOnly
{
    public function options(): StoreOptions
    {
        Context::$hooks++;

        return StoreOptions::make();
    }
}

final class ArrayRows extends Options {}

#[PublicAccess]
final class CollectionRows extends CollectionDataSource implements WithOptions
{
    public function source(): Collection
    {
        Context::$reads++;

        return collect(Context::projected());
    }

    public function options(): StoreOptions
    {
        Context::$hooks++;

        return Context::$options ?? StoreOptions::make();
    }
}

#[PublicAccess]
final class EloquentRows extends EloquentDataSource implements WithOptions
{
    public function source(): Builder
    {
        Context::$reads++;
        $model = (new FixtureProduct)->setTable('dapter_shared_rows');
        $model->setConnection(Context::$driver === 'sqlite' ? config('database.default') : 'dapter-shared-'.Context::$driver);
        $query = $model->newQuery()->where('tenant', Context::$tenant)->orderBy('name');
        $query->afterQuery(static fn (Collection $rows): Collection => $rows->each(
            static fn (FixtureProduct $row): FixtureProduct => $row->setVisible(['id', 'name', 'tenant'])
        ));

        if (Context::$limit !== null) {
            $query->limit(Context::$limit);
        }

        if (Context::$callback === 'before-window') {
            $query->beforeQuery(function (\Illuminate\Database\Query\Builder $query): void {
                Context::$callbackCalls++;
                $query->limit(1);
            });
        } elseif (Context::$callback === 'count-negative') {
            $query->getQuery()->afterQuery(function (Collection $rows): Collection {
                Context::$callbackCalls++;
                foreach ($rows as $row) {
                    if (isset($row->aggregate)) {
                        $row->aggregate = -1;
                    }
                }

                return $rows;
            });
        } elseif (Context::$callback !== null) {
            $query->afterQuery(function (Collection $rows): Collection {
                Context::$callbackCalls++;

                return Context::$callback === 'after-drop' ? $rows->take(1) : $rows->concat($rows);
            });
        }

        return $query;
    }

    public function options(): StoreOptions
    {
        Context::$hooks++;

        return Context::$options ?? StoreOptions::make();
    }
}

final class ProtocolRows extends Options
{
    public function source(): array
    {
        Context::$reads++;

        if (Context::$failure !== null) {
            throw Context::$failure === 'custom422'
                ? new DapterException(ErrorKind::Server, 'custom/source:unavailable', 422)
                : DapterException::configuration();
        }

        return Context::$rows;
    }
}
