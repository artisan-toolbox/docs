<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Composed\Records;
use App\Demo\Dapter\Composed\ReverseOrder;
use App\Demo\Dapter\Composed\Status;
use App\Demo\Dapter\Composed\StatusFilter;
use ArtisanToolbox\Dapter\Attributes\GlobalFilter;
use ArtisanToolbox\Dapter\Attributes\GlobalOrder;
use ArtisanToolbox\Dapter\Attributes\GlobalSearch;
use ArtisanToolbox\Dapter\Attributes\MultiOrder;
use ArtisanToolbox\Dapter\Attributes\OrderableField;
use ArtisanToolbox\Dapter\Attributes\PageSize;
use ArtisanToolbox\Dapter\Attributes\PageSizeOptions;
use ArtisanToolbox\Dapter\Attributes\PublicAccess;
use ArtisanToolbox\Dapter\Attributes\Query;
use ArtisanToolbox\Dapter\Attributes\SearchableField;
use ArtisanToolbox\Dapter\Attributes\SearchGrouping;
use ArtisanToolbox\Dapter\Enums\SearchMatch;
use ArtisanToolbox\Dapter\Enums\ValueType;
use ArtisanToolbox\Dapter\Options\IdentityColumn;
use ArtisanToolbox\Dapter\Options\QueryOptions;
use ArtisanToolbox\Dapter\Options\ResultIdentity;
use ArtisanToolbox\Dapter\Options\SearchTarget;
use Illuminate\Support\Collection;

#[PublicAccess]
#[PageSize(4)]
#[PageSizeOptions([4])]
#[GlobalSearch(['name' => new SearchTarget('name')])]
#[SearchableField('name')]
#[OrderableField('name')]
#[MultiOrder(true, 2)]
#[SearchGrouping(SearchMatch::All, [SearchMatch::All, SearchMatch::Any])]
#[Query(new QueryOptions(new ResultIdentity([new IdentityColumn('id', 'id', ValueType::Integer)])))]
#[GlobalFilter(values: [Status::Active], id: 'external', apply: StatusFilter::class)]
#[GlobalOrder(id: 'closure', label: 'Ascending closure', apply: static function (Collection $source): Collection {
    return $source->sortBy('id')->values();
})]
#[GlobalOrder(id: 'external', label: 'Newest first', apply: ReverseOrder::class)]
class ComposedAttributes extends Records
{
    /**
     * @param  Collection<int, array{id: int, name: string, quantity: int, status: string, rank: int}>  $source
     * @return Collection<int, array{id: int, name: string, quantity: int, status: string, rank: int}>
     */
    #[GlobalFilter(values: Status::class)]
    private function status(Collection $source, Status $value): Collection
    {
        return $source->where('status', $value->value)->values();
    }

    /**
     * @param  Collection<int, array{id: int, name: string, quantity: int, status: string, rank: int}>  $source
     * @return Collection<int, array{id: int, name: string, quantity: int, status: string, rank: int}>
     */
    #[GlobalOrder(label: 'Reverse private method')]
    private function reverse(Collection $source): Collection
    {
        return $source->sortByDesc('id')->values();
    }
}
