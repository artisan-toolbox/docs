<?php

namespace App\Demo\Dapter\Live;

use ArtisanToolbox\Dapter\Contracts\PublicRowProjection;

final class PublicProjection implements PublicRowProjection
{
    /** @return array{name: string} */
    public function project(mixed $rawRow): array
    {
        return ['name' => $rawRow['name']];
    }
}
