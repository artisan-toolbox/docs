<?php

namespace App\Demo\Dapter\Composed;

use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

#[Table(name: 'demo_dapter_records')]
#[WithoutTimestamps]
final class SqliteRecords extends Model
{
    /** @return HasMany<SqliteLine, $this> */
    public function lines(): HasMany
    {
        return $this->hasMany(SqliteLine::class, 'record_id');
    }

    /** @return Builder<self> */
    public static function fixture(): Builder
    {
        config(['database.connections.docs_dapter_composed' => ['driver' => 'sqlite', 'database' => ':memory:', 'prefix' => '', 'foreign_key_constraints' => true]]);
        DB::purge('docs_dapter_composed');
        $db = DB::connection('docs_dapter_composed');
        $db->getSchemaBuilder()->create('demo_dapter_records', function ($table): void {
            $table->integer('id');
            $table->string('name');
            $table->integer('tenant');
        });
        $db->getSchemaBuilder()->create('demo_dapter_lines', function ($table): void {
            $table->integer('id');
            $table->integer('record_id');
            $table->integer('amount');
        });
        $db->table('demo_dapter_records')->insert([['id' => 1, 'name' => 'Notebook', 'tenant' => 1], ['id' => 2, 'name' => 'Pencil', 'tenant' => 1], ['id' => 3, 'name' => 'Hidden', 'tenant' => 2]]);
        $db->table('demo_dapter_lines')->insert([['id' => 11, 'record_id' => 1, 'amount' => 4], ['id' => 12, 'record_id' => 1, 'amount' => 6], ['id' => 21, 'record_id' => 2, 'amount' => 7], ['id' => 31, 'record_id' => 3, 'amount' => 99]]);

        return (new self)->setConnection('docs_dapter_composed')->newQuery()->where('demo_dapter_records.tenant', 1);
    }
}
