<?php

namespace App\Demo\Dapter\Live;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;

final class FixtureProvider implements UserProvider
{
    public function retrieveById($identifier): ?Authenticatable
    {
        return is_string($identifier) ? Fixtures::principal($identifier) : null;
    }

    public function retrieveByToken($identifier, #[\SensitiveParameter] $token): ?Authenticatable
    {
        return null;
    }

    public function updateRememberToken(Authenticatable $user, #[\SensitiveParameter] $token): void {}

    /** @param array<string, mixed> $credentials */
    public function retrieveByCredentials(#[\SensitiveParameter] array $credentials): ?Authenticatable
    {
        return null;
    }

    /** @param array<string, mixed> $credentials */
    public function validateCredentials(Authenticatable $user, #[\SensitiveParameter] array $credentials): bool
    {
        return false;
    }

    /** @param array<string, mixed> $credentials */
    public function rehashPasswordIfRequired(Authenticatable $user, #[\SensitiveParameter] array $credentials, bool $force = false): void {}
}
