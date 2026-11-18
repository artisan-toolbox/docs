<?php

namespace App\Demo\Dapter\Composed;

use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Model;

#[Table(name: 'demo_dapter_lines')]
#[WithoutTimestamps]
final class SqliteLine extends Model {}
