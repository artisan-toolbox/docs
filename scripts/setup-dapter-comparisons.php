<?php

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\DB;

require dirname(__DIR__).'/vendor/autoload.php';
$app = require dirname(__DIR__).'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$url = config('database.connections.dapter_comparisons_pgsql.url');

if (! config('docs-dapter-comparisons.enabled') || ! is_string($url) || trim($url) === '') {
    fwrite(STDERR, "Enable the comparison demo and configure its dedicated PostgreSQL URL first.\n");
    exit(1);
}

$pdo = null;

try {
    $pdo = DB::connection('dapter_comparisons_pgsql')->getPdo();
    $pdo->beginTransaction();
    $pdo->exec("SELECT pg_advisory_xact_lock(hashtext('docs.dapter.comparisons.fixture'))");
    $exists = $pdo->query("SELECT to_regclass('public.docs_dapter_comparison_documents') IS NOT NULL")->fetchColumn();

    if ($exists) {
        $owner = $pdo->query("SELECT obj_description('public.docs_dapter_comparison_documents'::regclass, 'pg_class')")->fetchColumn();

        if ($owner !== 'Artisan Toolbox isolated Dapter comparison fixture v1') {
            throw new RuntimeException('Refusing to change an existing table without the comparison fixture ownership marker.');
        }
    } else {
        $pdo->exec('CREATE TABLE public.docs_dapter_comparison_documents (id integer PRIMARY KEY, tenant_key text NOT NULL, title text NULL, active boolean NOT NULL)');
        $pdo->exec("COMMENT ON TABLE public.docs_dapter_comparison_documents IS 'Artisan Toolbox isolated Dapter comparison fixture v1'");
    }

    $expected = [
        [1, 'docs-comparisons', 'Running fox', true],
        [2, 'docs-comparisons', 'Quiet library', true],
        [3, 'docs-comparisons', 'Runner notes', true],
        [4, 'docs-comparisons', null, true],
        [99, 'other', 'Running fox', true],
    ];
    $extra = $pdo->query('SELECT count(*) FROM public.docs_dapter_comparison_documents WHERE id NOT IN (1, 2, 3, 4, 99)')->fetchColumn();

    if ((int) $extra !== 0) {
        throw new RuntimeException('Refusing to reset a comparison fixture containing unexpected rows.');
    }

    $insert = $pdo->prepare('INSERT INTO public.docs_dapter_comparison_documents (id, tenant_key, title, active) VALUES (?, ?, ?, ?) ON CONFLICT (id) DO UPDATE SET tenant_key = excluded.tenant_key, title = excluded.title, active = excluded.active');

    foreach ($expected as $row) {
        $insert->execute($row);
    }

    $pdo->commit();
    fwrite(STDOUT, "Prepared five fictional PostgreSQL documents; four belong to the visible demo scope.\n");
} catch (Throwable $error) {
    if ($pdo?->inTransaction()) {
        $pdo->rollBack();
    }

    fwrite(STDERR, $error->getMessage()."\n");
    exit(1);
}
