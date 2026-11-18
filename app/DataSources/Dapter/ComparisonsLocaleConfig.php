<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Comparisons\Records;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

final class ComparisonsLocaleConfig extends Records implements WithOptions
{
    public function options(): StoreOptions
    {
        $previous = config('dapter.declarations');
        try {
            config(['dapter.declarations' => ['fields' => ['name' => ['order' => [
                'sortTypes' => ['string', 'locale'], 'valueType' => 'string',
                'options' => ['locale' => ['locale' => 'pt-BR']],
            ]]]]]);

            return StoreOptions::make()->publicAccess()->pageSize(6)->pageSizeOptions([6]);
        } finally {
            config(['dapter.declarations' => $previous]);
        }
    }
}
