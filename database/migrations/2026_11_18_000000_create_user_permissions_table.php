<?php

declare(strict_types=1);

use ArtisanToolbox\Permit\Storage\Users;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\ColumnDefinition;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function getConnection(): ?string
    {
        return resolve(Users::class)->model()->getConnectionName();
    }

    public function up(): void
    {
        $user = resolve(Users::class)->model();

        Schema::create(config()->string('permit.table'), function (Blueprint $table) use ($user): void {
            $column = $this->integerKey($table, $user) ?? $table->foreignIdFor($user, 'user_id');
            $column->primary();
            $table->foreign('user_id')
                ->references($user->getKeyName())
                ->on($user->getTable())
                ->cascadeOnDelete();
            $table->json('permissions');
            $table->json('roles');
            $table->uuid('revision');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(config()->string('permit.table'));
    }

    private function integerKey(Blueprint $table, Model $user): ?ColumnDefinition
    {
        if (! in_array($user->getKeyType(), ['int', 'integer'], true)) {
            return null;
        }

        foreach (Schema::getColumns($user->getTable()) as $column) {
            if ($column['name'] !== $user->getKeyName()) {
                continue;
            }
            $unsigned = str_contains(strtolower($column['type']), 'unsigned');

            return match ($column['type_name']) {
                'tinyint' => $table->tinyInteger('user_id', unsigned: $unsigned),
                'smallint', 'int2' => $table->smallInteger('user_id', unsigned: $unsigned),
                'mediumint' => $table->mediumInteger('user_id', unsigned: $unsigned),
                'int', 'integer', 'int4' => $table->integer('user_id', unsigned: $unsigned),
                'bigint', 'int8' => $table->bigInteger('user_id', unsigned: $unsigned),
                default => null,
            };
        }

        return null;
    }
};
