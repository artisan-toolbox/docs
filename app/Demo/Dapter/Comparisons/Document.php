<?php

namespace App\Demo\Dapter\Comparisons;

use Illuminate\Database\Eloquent\Attributes\Connection;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Connection('dapter_comparisons_pgsql')]
#[Table(name: 'docs_dapter_comparison_documents')]
#[WithoutTimestamps]
final class Document extends Model
{
    /** @use HasFactory<Factory<self>> */
    use HasFactory;
}
