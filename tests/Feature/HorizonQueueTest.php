<?php

use Laravel\Horizon\ProvisioningPlan;
use Laravel\Horizon\SupervisorOptions;

test('provisions separate bounded workers for application jobs and public demos', function (string $environment, int $applicationProcesses) {
    $plan = ProvisioningPlan::get('docs-test');
    $application = $plan->optionsFor($environment, 'supervisor-app');
    $demos = $plan->optionsFor($environment, 'supervisor-demos');

    expect($application)->toBeInstanceOf(SupervisorOptions::class)
        ->connection->toBe('redis')
        ->queue->toBe('default')
        ->maxProcesses->toBe($applicationProcesses);
    expect($demos)->toBeInstanceOf(SupervisorOptions::class)
        ->connection->toBe('redis')
        ->queue->toBe('demos')
        ->maxProcesses->toBe(1)
        ->maxTries->toBe(1)
        ->timeout->toBe(30);
    expect($application->timeout)->toBeLessThan(config('queue.connections.redis.retry_after'));
    expect($demos->timeout)->toBeLessThan(config('queue.connections.redis.retry_after'));
})->with([
    'local' => ['local', 1],
    'production' => ['production', 2],
    'other environments' => ['*', 1],
]);
