<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Literal\Declaration;
use App\Demo\Dapter\Literal\Records;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

final class LiteralConfigured extends Records implements WithOptions
{
    public function options(): StoreOptions
    {
        $previous = config('dapter.declarations.strict_literal_search');
        try {
            config(['dapter.declarations.strict_literal_search' => true]);

            return Declaration::options();
        } finally {
            config(['dapter.declarations.strict_literal_search' => $previous]);
        }
    }
}
