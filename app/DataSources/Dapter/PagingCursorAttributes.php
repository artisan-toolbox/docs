<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Paging\Records;
use ArtisanToolbox\Dapter\Attributes\PageSize;
use ArtisanToolbox\Dapter\Attributes\PageSizeOptions;
use ArtisanToolbox\Dapter\Attributes\Paging;
use ArtisanToolbox\Dapter\Attributes\PublicAccess;
use ArtisanToolbox\Dapter\Attributes\Query;
use ArtisanToolbox\Dapter\Contracts\WithCursorScope;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use ArtisanToolbox\Dapter\Enums\ValueType;
use ArtisanToolbox\Dapter\Options\IdentityColumn;
use ArtisanToolbox\Dapter\Options\QueryOptions;
use ArtisanToolbox\Dapter\Options\ResultIdentity;

#[PublicAccess]
#[PageSize(2)]
#[PageSizeOptions([2, 3])]
#[Paging(PagingMode::Cursor)]
#[Query(new QueryOptions(new ResultIdentity([new IdentityColumn('id', 'id', ValueType::Integer)])))]
final class PagingCursorAttributes extends Records implements WithCursorScope
{
    public function cursorScope(): string
    {
        return 'fictional-notebooks:public-policy-v1:query-v1';
    }
}
