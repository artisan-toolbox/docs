<?php

namespace App\Demo\Dapter\Listing;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

final class SqliteFixture
{
    /** @return Builder<FixtureProduct> */
    public static function query(): Builder
    {
        config(['database.connections.dapter-listing-demo' => [
            'driver' => 'sqlite',
            'database' => ':memory:',
            'prefix' => '',
            'foreign_key_constraints' => true,
        ]]);
        DB::purge('dapter-listing-demo');
        $connection = DB::connection('dapter-listing-demo');
        $connection->getSchemaBuilder()->create('products', function (Blueprint $table): void {
            $table->integer('id')->primary();
            $table->string('name');
            $table->string('category');
        });
        $connection->table('products')->insert(FixtureProducts::rows());

        return FixtureProduct::query();
    }
}
