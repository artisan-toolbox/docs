<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Actions\ActionParent;
use App\Demo\Dapter\Actions\SaveRequest;
use App\Demo\Dapter\Actions\State;
use ArtisanToolbox\Dapter\Actions\ActionContext;
use ArtisanToolbox\Dapter\Attributes\Action;
use ArtisanToolbox\Dapter\Attributes\ActionAuthorize;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\ActionTransport;
use ArtisanToolbox\Dapter\Enums\ValueType;
use ArtisanToolbox\Dapter\Options\RecordTarget;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Collection;

class ActionCatalog extends ActionParent implements WithOptions
{
    public function source(): Collection
    {
        return collect([['id' => 1, 'tenant' => 1, 'name' => 'Fictional notebook', 'writes' => State::count()], ['id' => 2, 'tenant' => 1, 'name' => 'Read-only pencil', 'writes' => State::count()]]);
    }

    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(2)->pageSizeOptions([2]);
    }

    #[Action(transports: [ActionTransport::Visit, ActionTransport::Http])]
    #[ActionAuthorize('docsDapterWrite')]
    private function save(SaveRequest $request): JsonResponse|RedirectResponse
    {
        return State::write($request);
    }

    #[Action(transports: [ActionTransport::Http])]
    #[ActionAuthorize('docsDapterRecord', arguments: ['fictional'], target: new RecordTarget(input: 'recordId', valueType: ValueType::Integer, target: 'id', output: 'id'))]
    private function record(SaveRequest $request, ActionContext $context): JsonResponse
    {
        abort_unless($context->record()['id'] === 1 && $context->source()->count() === 2, 403);

        return State::writeJson($request);
    }

    #[Action(transports: [ActionTransport::Http])]
    #[ActionAuthorize('docsDapterWrite')]
    private function uncertain(SaveRequest $request): JsonResponse
    {
        State::write($request);

        return response()->json(['message' => 'The demo wrote before returning validation.', 'errors' => ['name' => ['The response does not establish rollback.']]], 422);
    }

    #[Action(transports: [ActionTransport::Http])]
    private function formOnly(SaveRequest $request): JsonResponse
    {
        return State::writeJson($request);
    }
}
