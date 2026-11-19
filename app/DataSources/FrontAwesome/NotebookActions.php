<?php

namespace App\DataSources\FrontAwesome;

use App\DataSources\Dapter\ActionCatalog;
use App\Demo\Dapter\Actions\SaveRequest;
use App\Demo\Dapter\Actions\State;
use ArtisanToolbox\Dapter\Attributes\Action;
use ArtisanToolbox\Dapter\Attributes\ActionAuthorize;
use ArtisanToolbox\Dapter\Enums\ActionTransport;
use Illuminate\Http\JsonResponse;

final class NotebookActions extends ActionCatalog
{
    #[Action(transports: [ActionTransport::Http])]
    #[ActionAuthorize('docsDapterWrite')]
    private function interrupted(SaveRequest $request): JsonResponse
    {
        State::writeJson($request);

        return response()->json(['message' => 'The fictional service stopped after saving.'], 503);
    }
}
