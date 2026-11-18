<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Fields\FieldRecords;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

final class FieldsDriver extends FieldRecords implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(2)->driver('docs_fields');
    }
}
