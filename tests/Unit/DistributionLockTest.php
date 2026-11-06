<?php

use Illuminate\Filesystem\Filesystem;
use Symfony\Component\Process\Process;

beforeEach(function () {
    $this->distributionDirectory = sys_get_temp_dir().'/atb-distribution-'.bin2hex(random_bytes(8));
    mkdir($this->distributionDirectory);
    $this->distributionLock = $this->distributionDirectory.'/composer.lock';
    $this->distributionCheck = new Process([
        PHP_BINARY,
        dirname(__DIR__, 2).'/scripts/check-distribution.php',
        $this->distributionLock,
    ], $this->distributionDirectory);
});

afterEach(function () {
    (new Filesystem)->deleteDirectory($this->distributionDirectory);
});

test('accepts remote packages without changing the lock bytes', function (array $package) {
    $contents = json_encode(['packages' => [$package], 'packages-dev' => []], JSON_PRETTY_PRINT)."\n";
    file_put_contents($this->distributionLock, $contents);

    $this->distributionCheck->run();

    expect($this->distributionCheck->getExitCode())->toBe(0);
    expect(file_get_contents($this->distributionLock))->toBe($contents);
})->with([
    'remote archive' => [['name' => 'example/package', 'dist' => ['type' => 'zip', 'url' => 'https://example.org/package.zip']]],
    'source only' => [['name' => 'example/package', 'source' => ['type' => 'git', 'url' => 'https://example.org/package.git', 'reference' => '1.x']]],
    'SSH source' => [['name' => 'example/package', 'source' => ['type' => 'git', 'url' => 'ssh://git@example.org/package.git']]],
    'SCP source' => [['name' => 'example/package', 'source' => ['type' => 'git', 'url' => 'git@example.org:package.git']]],
    'local alias with remote archive' => [['name' => 'example/package', 'version' => '1.999.999', 'dist' => ['type' => 'zip', 'url' => 'https://example.org/package.zip']]],
    'development branch with remote archive' => [['name' => 'example/package', 'version' => '1.x-dev', 'dist' => ['type' => 'zip', 'url' => 'https://example.org/package.zip']]],
    'metapackage' => [['name' => 'example/package', 'type' => 'metapackage']],
]);

test('rejects local package locations with a safe actionable diagnostic', function (string $section, string $transport, string $type, string $url) {
    $package = [
        'name' => 'example/local-package',
        'dist' => ['type' => 'zip', 'url' => 'https://example.org/package.zip'],
        'source' => ['type' => 'git', 'url' => 'https://example.org/package.git'],
        $transport => ['type' => $type, 'url' => $url],
    ];
    $contents = json_encode(['packages' => [], 'packages-dev' => [], $section => [$package]]);
    file_put_contents($this->distributionLock, $contents);

    $this->distributionCheck->run();

    expect($this->distributionCheck->getExitCode())->not->toBe(0);
    expect($this->distributionCheck->getErrorOutput())
        ->toContain('example/local-package', 'isolated public resolution', 'Local development aliases may remain')
        ->not->toContain($url);
    expect(file_get_contents($this->distributionLock))->toBe($contents);
})->with([
    'path distribution' => ['packages', 'dist', 'path', 'https://example.org/local-package'],
    'file URL' => ['packages', 'dist', 'zip', 'file:///private/secret/package.zip'],
    'credential-bearing local URL' => ['packages', 'dist', 'zip', 'file://private-token@example.org/package.zip'],
    'absolute source' => ['packages', 'source', 'git', '/private/secret/package'],
    'relative archive' => ['packages', 'dist', 'zip', '../secret/package.zip'],
    'current directory source' => ['packages', 'source', 'git', './secret/package'],
    'bare filename' => ['packages', 'dist', 'zip', 'secret-package.zip'],
    'Windows drive' => ['packages', 'dist', 'zip', 'C:\\secret\\package.zip'],
    'Windows forward slash drive' => ['packages', 'source', 'git', 'C:/secret/package'],
    'Windows UNC' => ['packages', 'dist', 'zip', '\\\\server\\secret\\package.zip'],
    'development dependency' => ['packages-dev', 'dist', 'zip', '../secret/package.zip'],
    'development path dependency' => ['packages-dev', 'dist', 'path', 'https://example.org/local-package'],
    'local source despite remote archive' => ['packages-dev', 'source', 'git', '/private/secret/package'],
]);

test('rejects malformed lock data without echoing its contents', function (string $contents) {
    file_put_contents($this->distributionLock, $contents);

    $this->distributionCheck->run();

    expect($this->distributionCheck->getExitCode())->not->toBe(0);
    expect($this->distributionCheck->getErrorOutput())->toContain('Invalid Composer lock')->not->toContain('secret');
    expect(file_get_contents($this->distributionLock))->toBe($contents);
})->with([
    'invalid JSON' => ['{"secret":'],
    'scalar JSON' => ['"secret"'],
    'missing package collections' => ['{}'],
    'object collection' => ['{"packages":{},"packages-dev":[]}'],
    'invalid development collection' => ['{"packages":[],"packages-dev":"secret"}'],
    'scalar package' => ['{"packages":["secret"],"packages-dev":[]}'],
    'missing package name' => ['{"packages":[{}],"packages-dev":[]}'],
    'unsafe package name' => ['{"packages":[{"name":"https://secret@example.org/package"}],"packages-dev":[]}'],
    'invalid transport' => ['{"packages":[{"name":"example/package","dist":"secret"}],"packages-dev":[]}'],
    'invalid URL' => ['{"packages":[{"name":"example/package","dist":{"type":"zip","url":42}}],"packages-dev":[]}'],
]);

test('fails clearly when the lock is missing', function () {
    $this->distributionCheck->run();

    expect($this->distributionCheck->getExitCode())->not->toBe(0);
    expect($this->distributionCheck->getErrorOutput())->toContain('Cannot read Composer lock');
    expect($this->distributionLock)->not->toBeFile();
});

test('rejects extra command arguments', function () {
    $command = new Process([
        PHP_BINARY,
        dirname(__DIR__, 2).'/scripts/check-distribution.php',
        $this->distributionLock,
        'unexpected',
    ], $this->distributionDirectory);

    $command->run();

    expect($command->getExitCode())->not->toBe(0);
    expect($command->getErrorOutput())->toContain('Usage:');
});

test('runs before dependencies exist and finds the lock relative to the script', function () {
    mkdir($this->distributionDirectory.'/scripts');
    copy(dirname(__DIR__, 2).'/scripts/check-distribution.php', $this->distributionDirectory.'/scripts/check-distribution.php');
    file_put_contents($this->distributionLock, '{"packages":[],"packages-dev":[]}');
    $command = new Process([PHP_BINARY, $this->distributionDirectory.'/scripts/check-distribution.php'], sys_get_temp_dir());

    $command->run();

    expect($command->getExitCode())->toBe(0);
    expect($this->distributionDirectory.'/vendor')->not->toBeDirectory();
    expect($this->distributionDirectory.'/artisan')->not->toBeFile();
});
