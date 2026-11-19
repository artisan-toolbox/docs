<?php

namespace App\DataSources\FrontAwesome;

use ArtisanToolbox\Dapter\CollectionDataSource;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\EmptySelectionPolicy;
use ArtisanToolbox\Dapter\Enums\MatchType;
use ArtisanToolbox\Dapter\Enums\SearchMatch;
use ArtisanToolbox\Dapter\Enums\SortType;
use ArtisanToolbox\Dapter\Enums\ValueType;
use ArtisanToolbox\Dapter\Options\SearchTarget;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Support\Collection;

final class Notebooks extends CollectionDataSource implements WithOptions
{
    private const MARKS = [null, false, 0, '0', '', ' '];

    /** @return list<array{id: int, name: string, shelf: string, sheets: int, mark: mixed}> */
    public function source(): array
    {
        $shelves = ['A', 'A', 'B', 'A', 'C', 'C'];
        $sheets = [100, 24, 48, 50, 12, 80];

        return array_map(fn (int $i): array => [
            'id' => $i + 1,
            'name' => 'Notebook '.([10, 2, 7, 3, 9, 4][$i]),
            'shelf' => $shelves[$i],
            'sheets' => $sheets[$i],
            'mark' => self::MARKS[$i],
        ], array_keys(self::MARKS));
    }

    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(4)->pageSizeOptions([2, 4, 6])
            ->searchableField('name', [MatchType::Contains, MatchType::Equals, MatchType::StartsWith])
            ->searchableField('sheets', [MatchType::Equals], valueType: ValueType::Integer)
            ->globalSearchable(['name' => new SearchTarget('name'), 'shelf' => new SearchTarget('shelf')])
            ->searchMatch(SearchMatch::All, [SearchMatch::All, SearchMatch::Any])
            ->filterableField('shelf', 'shelves', ['A', 'B', 'C'], multiple: true)
            ->globalFilterable('mark', self::MARKS, static fn (Collection $rows, mixed $mark): Collection => $rows->filter(fn (array $row): bool => $row['mark'] === $mark)->values())
            ->globalFilterable('marks', self::MARKS, static fn (Collection $rows, array $marks): Collection => $rows->filter(fn (array $row): bool => in_array($row['mark'], $marks, true))->values(), multiple: true, empty: EmptySelectionPolicy::Reject)
            ->orderableField('name', [SortType::Native, SortType::Natural])
            ->orderableField('sheets', [SortType::Native, SortType::Numeric], valueType: ValueType::Integer)
            ->orderableField('shelf')->multiOrder(true, max: 2)
            ->globalOrderable('thickest', 'Most sheets first', static fn (Collection $rows): Collection => $rows->sortByDesc('sheets')->values());
    }
}
