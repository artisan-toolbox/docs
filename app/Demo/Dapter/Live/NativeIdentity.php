<?php

namespace App\Demo\Dapter\Live;

use ArtisanToolbox\Dapter\Contracts\RowIdentityProvider;
use ArtisanToolbox\Dapter\Drivers\SqlIdentitySelector;

final class NativeIdentity implements RowIdentityProvider
{
    public function identify(mixed $rawRow): string
    {
        return 'notebook:'.$rawRow['id'];
    }

    public function selector(): SqlIdentitySelector
    {
        return new SqlIdentitySelector('demo_live_notebooks.id', 'id');
    }

    public function lookup(int|string $publicIdentifier): ?int
    {
        return is_string($publicIdentifier) && preg_match('/^notebook:([12])$/D', $publicIdentifier, $matches) === 1 ? (int) $matches[1] : null;
    }
}
