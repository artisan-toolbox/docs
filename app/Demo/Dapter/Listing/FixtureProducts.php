<?php

namespace App\Demo\Dapter\Listing;

final class FixtureProducts
{
    /** @return list<array{id: int, name: string, category: string}> */
    public static function rows(): array
    {
        return array_map(fn (int $id): array => [
            'id' => $id,
            'name' => sprintf('Notebook %02d', $id),
            'category' => $id % 2 === 0 ? 'Squared' : 'Plain',
        ], range(1, 23));
    }
}
