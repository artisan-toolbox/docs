<?php

use Symfony\Component\Process\Process;

test('refuses comparison fixture setup before connecting when its opt in is incomplete', function (string $enabled, string $url) {
    $process = new Process([PHP_BINARY, base_path('scripts/setup-dapter-comparisons.php')], base_path(), [
        'DAPTER_COMPARISONS_PGSQL_ENABLED' => $enabled,
        'DAPTER_COMPARISONS_PGSQL_URL' => $url,
    ]);
    $process->run();

    expect($process->isSuccessful())->toBeFalse()
        ->and($process->getOutput().$process->getErrorOutput())
        ->toContain('Enable the comparison demo and configure its dedicated PostgreSQL URL first.')
        ->not->toContain('SQLSTATE');
})->with([
    'disabled with an unreachable server' => ['false', 'pgsql://invalid@127.0.0.1:1/unreachable'],
    'enabled without a URL' => ['true', '(null)'],
    'enabled with an empty URL' => ['true', ''],
]);
