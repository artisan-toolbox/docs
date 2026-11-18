<?php

namespace App\Demo\Dapter\Live;

use ArtisanToolbox\Dapter\Contracts\RowRevisionProvider;

final class Revision implements RowRevisionProvider
{
    public function revision(mixed $rawRow): string
    {
        return $rawRow['revision'];
    }
}
