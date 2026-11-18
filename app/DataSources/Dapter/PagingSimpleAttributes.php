<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Paging\Records;
use ArtisanToolbox\Dapter\Attributes\ExactCounts;
use ArtisanToolbox\Dapter\Attributes\PageSize;
use ArtisanToolbox\Dapter\Attributes\PageSizeOptions;
use ArtisanToolbox\Dapter\Attributes\Paging;
use ArtisanToolbox\Dapter\Attributes\PublicAccess;
use ArtisanToolbox\Dapter\Enums\PagingMode;

#[PublicAccess]
#[PageSize(2)]
#[PageSizeOptions([2, 3])]
#[Paging(PagingMode::Simple)]
#[ExactCounts(false)]
final class PagingSimpleAttributes extends Records {}
