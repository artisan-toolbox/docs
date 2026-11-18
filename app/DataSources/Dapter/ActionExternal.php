<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Actions\ExternalActions;
use ArtisanToolbox\Dapter\StoreOptions;

final class ActionExternal extends ActionCatalog
{
    public function options(): StoreOptions
    {
        return parent::options()->withActions(ExternalActions::class)->actionAuthorize('replace', 'docsDapterWrite');
    }
}
