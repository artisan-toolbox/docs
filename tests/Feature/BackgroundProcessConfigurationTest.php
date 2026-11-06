<?php

use Laravel\Horizon\ProvisioningPlan;
use Symfony\Component\Process\Process;

test('runs only one Horizon master on the documentation server with time to drain its workers', function () {
    $process = new Process([
        'node',
        '-e',
        'process.stdout.write(JSON.stringify(require(process.argv[1])));',
        base_path('pm2.config.cjs'),
    ], base_path());

    $process->mustRun();
    $ecosystem = json_decode($process->getOutput(), true, flags: JSON_THROW_ON_ERROR);

    expect($ecosystem['apps'])->toHaveCount(1);
    $master = $ecosystem['apps'][0];
    expect($master)
        ->name->toBe('Horizon ATB')
        ->script->toBe('artisan')
        ->args->toBe('horizon')
        ->interpreter->toBe('php')
        ->cwd->toBe('/var/www/atb/current')
        ->instances->toBe(1)
        ->autorestart->toBeTrue()
        ->treekill->toBeFalse();

    $plan = ProvisioningPlan::get('docs-process-test');
    foreach ($plan->parsed as $supervisors) {
        foreach ($supervisors as $supervisor) {
            expect($master['kill_timeout'])->toBeGreaterThan($supervisor->timeout * 1000);
        }
    }
});
