<?php

namespace App\Demo\Dapter\Actions;

use ArtisanToolbox\Dapter\Attributes\Action;
use ArtisanToolbox\Dapter\Attributes\ActionAuthorize;
use ArtisanToolbox\Dapter\Enums\ActionMethod;
use ArtisanToolbox\Dapter\Enums\ActionTransport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

final class ExternalActions
{
    #[ActionAuthorize('docsDapterWrite')]
    public function defaultVisit(SaveRequest $request): RedirectResponse
    {
        return State::writeVisit();
    }

    #[Action(method: ActionMethod::Put, transports: [ActionTransport::Http])]
    public function replace(SaveRequest $request): JsonResponse
    {
        return State::writeJson($request);
    }

    #[Action(method: ActionMethod::Patch, transports: [ActionTransport::Http])]
    #[ActionAuthorize('docsDapterWrite')]
    public function amend(SaveRequest $request): JsonResponse
    {
        return State::writeJson($request);
    }

    #[Action(method: ActionMethod::Delete, transports: [ActionTransport::Http])]
    #[ActionAuthorize('docsDapterWrite')]
    public function remove(SaveRequest $request): JsonResponse
    {
        return State::writeJson($request);
    }
}
