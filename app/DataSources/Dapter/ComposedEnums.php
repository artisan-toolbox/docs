<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Composed\Mode;
use App\Demo\Dapter\Composed\ModeFilter;
use App\Demo\Dapter\Composed\Records;
use App\Demo\Dapter\Composed\Status;
use App\Demo\Dapter\Composed\StatusFilter;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Options\FieldOptions;
use ArtisanToolbox\Dapter\StoreOptions;

final class ComposedEnums extends Records implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(4)->pageSizeOptions([4])
            ->filterableField('status', 'enum', Status::class, options: new FieldOptions('status'))
            ->filterableField('status', 'subset', [Status::Active], options: new FieldOptions('status'))
            ->filterableField('status', 'mixed', [Status::Active, 'paused'], options: new FieldOptions('status'))
            ->globalFilterable('mode', [Mode::Open], ModeFilter::class)
            ->globalFilterable('nullable', [null, Status::Active], StatusFilter::class);
    }
}
