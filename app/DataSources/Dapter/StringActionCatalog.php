<?php

namespace App\DataSources\Dapter;

use ArtisanToolbox\Dapter\Actions\ActionContext;
use ArtisanToolbox\Dapter\Attributes\Action;
use ArtisanToolbox\Dapter\Attributes\ActionAuthorize;
use ArtisanToolbox\Dapter\CollectionDataSource;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\ActionTransport;
use ArtisanToolbox\Dapter\Enums\ValueType;
use ArtisanToolbox\Dapter\Options\RecordTarget;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;

final class StringActionCatalog extends CollectionDataSource implements WithOptions
{
    public const IDS = ['{draft}', 'part/', '..', '%2F', ' key '];

    /** @return Collection<int, array{id: string}> */
    public function source(): Collection
    {
        return collect(self::IDS)->map(fn (string $id): array => ['id' => $id]);
    }

    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(5)->pageSizeOptions([5]);
    }

    #[Action(transports: [ActionTransport::Http])]
    #[ActionAuthorize('docsDapterInspectString', target: new RecordTarget(
        input: 'recordId',
        valueType: ValueType::String,
        target: 'id',
        output: 'id',
    ))]
    private function inspect(ActionContext $context): JsonResponse
    {
        return response()->json(['selected' => $context->record()['id']]);
    }
}
