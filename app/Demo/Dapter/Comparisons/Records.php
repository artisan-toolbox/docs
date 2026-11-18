<?php

namespace App\Demo\Dapter\Comparisons;

use ArtisanToolbox\Dapter\CollectionDataSource;

abstract class Records extends CollectionDataSource
{
    /** @return list<array{id: int, name: ?string, score: int, active: bool}> */
    public function source(): array
    {
        return [
            ['id' => 1, 'name' => 'café', 'score' => 10, 'active' => true],
            ['id' => 2, 'name' => "cafe\u{0301}", 'score' => 2, 'active' => true],
            ['id' => 3, 'name' => 'cafe', 'score' => 0, 'active' => true],
            ['id' => 4, 'name' => null, 'score' => -1, 'active' => true],
            ['id' => 5, 'name' => 'item 2', 'score' => 2, 'active' => false],
            ['id' => 6, 'name' => 'item 10', 'score' => 10, 'active' => false],
        ];
    }
}
