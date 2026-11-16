<?php

namespace App\Demo\Dapter\Listing;

use Illuminate\Database\Eloquent\Attributes\Connection;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\Unguarded;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Connection('dapter-listing-demo')]
#[Unguarded]
#[Table(name: 'products')]
#[WithoutTimestamps]
final class FixtureProduct extends Model
{
    /** @use HasFactory<Factory<self>> */
    use HasFactory;
}
