<?php

namespace App\Demo\Dapter\Actions;

use ArtisanToolbox\Dapter\Attributes\Action;
use ArtisanToolbox\Dapter\Attributes\ActionAuthorize;
use ArtisanToolbox\Dapter\Enums\ActionTransport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

trait ParentActions
{
    #[Action(id: 'rename', transports: [ActionTransport::Visit, ActionTransport::Http])]
    #[ActionAuthorize('docsDapterWrite')]
    private function inheritedRename(SaveRequest $request): JsonResponse|RedirectResponse
    {
        return State::write($request);
    }
}
