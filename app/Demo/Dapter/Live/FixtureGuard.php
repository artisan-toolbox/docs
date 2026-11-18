<?php

namespace App\Demo\Dapter\Live;

use Illuminate\Auth\RequestGuard;
use Illuminate\Contracts\Auth\Authenticatable;

final class FixtureGuard extends RequestGuard
{
    public function user(): ?Authenticatable
    {
        $id = $this->request->hasSession() ? $this->request->session()->get('docs.dapter.live.id') : null;

        return is_string($id) ? $this->getProvider()->retrieveById($id) : null;
    }
}
