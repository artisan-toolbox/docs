<?php

namespace App\Demo\Dapter\Paging;

use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

#[Table(name: 'demo_paging_notebooks')]
#[WithoutTimestamps]
final class SqliteNotebook extends Model
{
    /** @return Builder<self> */
    public static function fixture(): Builder
    {
        config(['database.connections.docs_dapter_paging' => ['driver' => 'sqlite', 'database' => ':memory:', 'prefix' => '', 'foreign_key_constraints' => true]]);
        DB::purge('docs_dapter_paging');
        $db = DB::connection('docs_dapter_paging');
        $db->getSchemaBuilder()->create('demo_paging_notebooks', function ($table): void {
            $table->integer('id')->primary();
            $table->string('name');
            $table->integer('rank');
            $table->integer('tenant');
        });
        $rows = array_map(fn (int $id): array => ['id' => $id, 'name' => sprintf('Notebook %02d', $id), 'rank' => intdiv($id - 1, 2), 'tenant' => 1], range(1, 7));
        $db->table('demo_paging_notebooks')->insert([...$rows, ['id' => 99, 'name' => 'Hidden tenant', 'rank' => 0, 'tenant' => 2]]);

        return (new self)->setConnection('docs_dapter_paging')->newQuery()->where('tenant', 1);
    }
}
