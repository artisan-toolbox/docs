<?php

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel;

require dirname(__DIR__).'/vendor/autoload.php';
$app = require dirname(__DIR__).'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();
$pdo = null;

try {
    $path = config('database.connections.dapter_literal_demo.database');
    if (config('database.connections.dapter_literal_demo.driver') !== 'sqlite' || $path !== storage_path('app/dapter-literal-demo.sqlite')) {
        throw new RuntimeException('The dedicated literal demo SQLite path is required.');
    }
    $existing = is_file($path);
    $pdo = new PDO('sqlite:'.$path, options: [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $pdo->beginTransaction();
    if ($existing) {
        $table = $pdo->query("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'dapter_fixture_metadata'")->fetchColumn();
        if ($table === false || $pdo->query("SELECT value FROM dapter_fixture_metadata WHERE name = 'owner'")->fetchColumn() !== 'Artisan Toolbox literal fixture v1') {
            throw new RuntimeException('Refusing to modify an unowned SQLite fixture.');
        }
    } else {
        $pdo->exec('CREATE TABLE dapter_fixture_metadata (name TEXT PRIMARY KEY, value TEXT NOT NULL)');
        $pdo->exec("INSERT INTO dapter_fixture_metadata VALUES ('owner', 'Artisan Toolbox literal fixture v1')");
        $pdo->exec('CREATE TABLE literal_search_records (id INTEGER PRIMARY KEY, name TEXT NOT NULL, tenant INTEGER NOT NULL)');
    }
    $rows = json_decode(file_get_contents(dirname(__DIR__).'/app/Demo/Dapter/Literal/records.json'), true, flags: JSON_THROW_ON_ERROR);
    $ids = array_column($rows, 'id');
    $existingIds = $pdo->query('SELECT id FROM literal_search_records')->fetchAll(PDO::FETCH_COLUMN);
    if (array_diff($existingIds, $ids) !== []) {
        throw new RuntimeException('Refusing to reset a literal fixture containing unexpected rows.');
    }
    $insert = $pdo->prepare('INSERT INTO literal_search_records (id, name, tenant) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, tenant = excluded.tenant');
    foreach ($rows as $row) {
        $insert->execute([$row['id'], $row['name'], $row['tenant']]);
    }
    $pdo->commit();
    fwrite(STDOUT, "Prepared eight fictional literal-search records; seven belong to the visible scope.\n");
} catch (Throwable $error) {
    if ($pdo?->inTransaction()) {
        $pdo->rollBack();
    }
    fwrite(STDERR, $error->getMessage()."\n");
    exit(1);
}
