<?php

namespace App\Demo\Dapter\Live;

use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

#[Table(name: 'demo_live_notebooks')]
#[WithoutTimestamps]
final class NativeNotebook extends Model
{
    /** @return Builder<self> */
    public static function fixture(string $id): Builder
    {
        config(['database.connections.docs_dapter_live' => ['driver' => 'sqlite', 'database' => ':memory:', 'prefix' => '', 'foreign_key_constraints' => true]]);
        DB::purge('docs_dapter_live');
        $db = DB::connection('docs_dapter_live');
        $db->getSchemaBuilder()->create('demo_live_notebooks', function ($table): void {
            $table->integer('id')->primary();
            $table->string('name');
            $table->string('revision');
            $table->integer('tenant');
            $table->string('secret');
        });
        $db->table('demo_live_notebooks')->insert([...Fixtures::rows($id), ['id' => 999, 'name' => 'Another tenant', 'revision' => '1', 'tenant' => 99, 'secret' => 'server-only']]);

        return (new self)->setConnection('docs_dapter_live')->newQuery()->where('tenant', Fixtures::state($id)['tenant']);
    }
}
