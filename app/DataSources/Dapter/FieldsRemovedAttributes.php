<?php

namespace App\DataSources\Dapter;

use ArtisanToolbox\Dapter\Attributes\WithoutFieldFilter;
use ArtisanToolbox\Dapter\Attributes\WithoutFieldOrder;
use ArtisanToolbox\Dapter\Attributes\WithoutFieldSearch;

#[WithoutFieldSearch('title')]
#[WithoutFieldOrder('title')]
#[WithoutFieldFilter('category', 'category')]
final class FieldsRemovedAttributes extends FieldsAttributes {}
