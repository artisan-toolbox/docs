<?php

namespace App\Demo\Dapter\SourceBoundaries;

final class FixtureRecords
{
    /** @return list<array{id: int, name: string, studio: string, private_note: string}> */
    public static function all(): array
    {
        return [
            ['id' => 101, 'name' => 'North notebook', 'studio' => 'studio-north', 'private_note' => 'Fixture-only purchasing note'],
            ['id' => 201, 'name' => 'South sketchbook', 'studio' => 'studio-south', 'private_note' => 'Fixture-only inventory note'],
            ['id' => 102, 'name' => 'North pencil', 'studio' => 'studio-north', 'private_note' => 'Fixture-only supplier note'],
        ];
    }
}
