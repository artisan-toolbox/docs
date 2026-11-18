<?php

namespace App\Demo\Dapter\Literal;

use Illuminate\Database\Eloquent\Attributes\Connection;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Connection('dapter_literal_demo')]
#[Table(name: 'literal_search_records')]
#[WithoutTimestamps]
final class SqliteRecord extends Model
{
    /** @use HasFactory<Factory<self>> */
    use HasFactory;
}
