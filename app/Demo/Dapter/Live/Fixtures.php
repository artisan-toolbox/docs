<?php

namespace App\Demo\Dapter\Live;

use Illuminate\Auth\GenericUser;
use Illuminate\Support\Facades\Cache;

final class Fixtures
{
    public static function principal(string $id): ?GenericUser
    {
        $state = Cache::get('docs.dapter.live.'.$id);

        return is_array($state) && $state['allowed'] === true
            ? new GenericUser(['id' => $id, 'tenant' => $state['tenant'], 'name' => 'Fictional reader']) : null;
    }

    /** @return array{allowed: bool, tenant: int, revision: int, name: string} */
    public static function state(string $id): array
    {
        return Cache::get('docs.dapter.live.'.$id, ['allowed' => false, 'tenant' => 1, 'revision' => 1, 'name' => 'Notebook 01']);
    }

    /** @param array{allowed: bool, tenant: int, revision: int, name: string} $state */
    public static function put(string $id, array $state): void
    {
        Cache::put('docs.dapter.live.'.$id, $state, now()->addHour());
    }

    /** @return list<array{id: int, name: string, revision: string, tenant: int, secret: string}> */
    public static function rows(string $id): array
    {
        $state = self::state($id);

        return [
            ['id' => 1, 'name' => $state['name'], 'revision' => (string) $state['revision'], 'tenant' => $state['tenant'], 'secret' => 'server-only'],
            ['id' => 2, 'name' => 'Notebook 02', 'revision' => '1', 'tenant' => $state['tenant'], 'secret' => 'server-only'],
        ];
    }
}
