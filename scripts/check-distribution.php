<?php

declare(strict_types=1);

function distributionFailure(string $message): never
{
    fwrite(STDERR, $message."\n");
    exit(1);
}

if ($argc > 2) {
    distributionFailure('Usage: php scripts/check-distribution.php [composer.lock]');
}

$contents = @file_get_contents($argv[1] ?? __DIR__.'/../composer.lock');

if ($contents === false) {
    distributionFailure('Cannot read Composer lock. Resolve and commit a portable composer.lock before distribution.');
}

try {
    $lock = json_decode($contents, flags: JSON_THROW_ON_ERROR);
} catch (JsonException) {
    distributionFailure('Invalid Composer lock JSON. Resolve and commit a valid composer.lock before distribution.');
}

if (! $lock instanceof stdClass) {
    distributionFailure('Invalid Composer lock: expected an object with package collections.');
}

foreach (['packages', 'packages-dev'] as $section) {
    if (! isset($lock->{$section}) || ! is_array($lock->{$section})) {
        distributionFailure('Invalid Composer lock: expected packages and packages-dev arrays.');
    }

    foreach ($lock->{$section} as $package) {
        if (! $package instanceof stdClass || ! isset($package->name) || ! is_string($package->name)
            || preg_match('~^[a-z0-9_.-]+/[a-z0-9_.-]+$~i', $package->name) !== 1) {
            distributionFailure('Invalid Composer lock: expected a named package object.');
        }

        foreach (['dist', 'source'] as $transport) {
            if (! property_exists($package, $transport)) {
                continue;
            }

            $location = $package->{$transport};

            if (! $location instanceof stdClass || ! isset($location->type, $location->url)
                || ! is_string($location->type) || $location->type === ''
                || ! is_string($location->url) || $location->url === '') {
                distributionFailure("Invalid Composer lock: {$package->name} has invalid {$transport} metadata.");
            }

            $remote = preg_match('~^(?:https?|ssh|git|svn|svn\+ssh|git\+ssh)://[^/\s]+(?:/|$)~i', $location->url) === 1
                || preg_match('~^[^/@:\s]+@[^/:\s]+:[^\s]+$~', $location->url) === 1;

            if (strtolower($location->type) === 'path' || ! $remote) {
                distributionFailure("Non-portable Composer lock: {$package->name} has local {$transport} metadata. "
                    .'Use an isolated public resolution before committing the lock. Local development aliases may remain.');
            }
        }
    }
}

fwrite(STDOUT, "Composer lock uses portable package locations.\n");
