<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Actions\ExternalActions;
use ArtisanToolbox\Dapter\Attributes\ActionAuthorize;
use ArtisanToolbox\Dapter\Attributes\Actions;

#[Actions(ExternalActions::class)]
#[ActionAuthorize('docsDapterWrite', arguments: [], id: 'replace')]
final class ActionAttributes extends ActionCatalog {}
