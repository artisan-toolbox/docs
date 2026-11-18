<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Composed\ManyStatuses;
use App\Demo\Dapter\Composed\Records;
use App\Demo\Dapter\Composed\ReverseOrder;
use App\Demo\Dapter\Composed\Status;
use App\Demo\Dapter\Composed\StatusFilter;
use ArtisanToolbox\Dapter\Contracts\CollectionSource;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\EmptySelectionPolicy;
use ArtisanToolbox\Dapter\Enums\MatchType;
use ArtisanToolbox\Dapter\Enums\SearchMatch;
use ArtisanToolbox\Dapter\Enums\SortType;
use ArtisanToolbox\Dapter\Enums\ValueType;
use ArtisanToolbox\Dapter\Options\EnumBinding;
use ArtisanToolbox\Dapter\Options\FieldOptions;
use ArtisanToolbox\Dapter\Options\FixedOrderTerm;
use ArtisanToolbox\Dapter\Options\HandlerOptions;
use ArtisanToolbox\Dapter\Options\HandlerRequirements;
use ArtisanToolbox\Dapter\Options\IdentityColumn;
use ArtisanToolbox\Dapter\Options\QueryOptions;
use ArtisanToolbox\Dapter\Options\ResultIdentity;
use ArtisanToolbox\Dapter\Options\SearchTarget;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Support\Collection;

class ComposedCatalog extends Records implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(4)->pageSizeOptions([2, 4])
            ->searchableField('name', [MatchType::Contains, MatchType::Equals], options: new FieldOptions('name'))
            ->globalSearchable(['name' => new SearchTarget('name'), 'quantity' => new SearchTarget('quantity', ValueType::Integer, MatchType::Equals)])
            ->globalFilterable('status', Status::class, StatusFilter::class, options: new HandlerOptions(requires: new HandlerRequirements(sourceType: CollectionSource::class)))
            ->globalFilterable('many', Status::cases(), ManyStatuses::class, multiple: true, empty: EmptySelectionPolicy::Reject, options: new HandlerOptions(binding: new EnumBinding(Status::class, elements: true)))
            ->globalFilterable('mixed', [null, false, 0, '0', ''], static fn (Collection $source, mixed $value): Collection => $source)
            ->globalOrderable('reverse', 'Newest first', ReverseOrder::class)
            ->orderableField('rank', valueType: ValueType::Integer)->orderableField('quantity', [SortType::Native, SortType::Numeric], valueType: ValueType::Integer)->orderableField('name', [SortType::Native, SortType::Natural], options: new FieldOptions('name'))
            ->multiOrder(true, max: 2)->searchMatch(SearchMatch::All, [SearchMatch::All, SearchMatch::Any])
            ->query(new QueryOptions(identity: new ResultIdentity([new IdentityColumn('id', 'id', ValueType::Integer)]), fixedOrder: [new FixedOrderTerm('rank')]));
    }
}
