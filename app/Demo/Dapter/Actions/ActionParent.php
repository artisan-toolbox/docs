<?php

namespace App\Demo\Dapter\Actions;

use ArtisanToolbox\Dapter\CollectionDataSource;

abstract class ActionParent extends CollectionDataSource
{
    use ParentActions;
}
