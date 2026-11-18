<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Actions\ExternalActions;
use ArtisanToolbox\Dapter\StoreOptions;

final class ActionConfigured extends ActionCatalog
{
    public function options(): StoreOptions
    {
        $before = config('dapter.declarations');
        try {
            config(['dapter.declarations' => ['actions_class' => ExternalActions::class, 'action_policies' => ['replace' => ['ability' => 'docsDapterRecord', 'arguments' => ['fictional'], 'target' => ['input' => 'recordId', 'valueType' => 'integer', 'target' => 'id', 'output' => 'id']]]]]);

            return StoreOptions::make()->publicAccess()->pageSize(2)->pageSizeOptions([2]);
        } finally {
            config(['dapter.declarations' => $before]);
        }
    }
}
