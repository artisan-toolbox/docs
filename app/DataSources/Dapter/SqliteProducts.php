<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Listing\FixtureProduct;
use App\Demo\Dapter\Listing\SqliteFixture;
use ArtisanToolbox\Dapter\Attributes\PageSize;
use ArtisanToolbox\Dapter\Attributes\PageSizeOptions;
use ArtisanToolbox\Dapter\Attributes\PublicAccess;
use ArtisanToolbox\Dapter\EloquentDataSource;
use Illuminate\Database\Eloquent\Builder;

/** @extends EloquentDataSource<FixtureProduct> */
#[PublicAccess]
#[PageSize(5)]
#[PageSizeOptions([5, 10])]
final class SqliteProducts extends EloquentDataSource
{
    /** @return Builder<FixtureProduct> */
    public function source(): Builder
    {
        return SqliteFixture::query();
    }
}
