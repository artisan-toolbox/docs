<?php

namespace App\Demo\Dapter\Fields;

use ArtisanToolbox\Dapter\CollectionDataSource;
use Illuminate\Support\Collection;

abstract class FieldRecords extends CollectionDataSource
{
    /** @return Collection<int, array{id: int, name: string, category: string, active: bool, score: int|float, optional: null}> */
    public function source(): Collection
    {
        return collect([
            ['id' => 1, 'name' => 'Notebook 10', 'category' => 'paper', 'active' => true, 'score' => 10, 'optional' => null],
            ['id' => 2, 'name' => 'Notebook 2', 'category' => 'paper', 'active' => false, 'score' => 2, 'optional' => null],
            ['id' => 3, 'name' => 'Pencil 100%_!', 'category' => 'tools', 'active' => true, 'score' => 1.5, 'optional' => null],
            ['id' => 4, 'name' => 'Pencil case', 'category' => 'tools', 'active' => false, 'score' => 0, 'optional' => null],
        ]);
    }
}
