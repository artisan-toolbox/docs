<?php

use App\Documentation\Package;
use App\Http\Resources\Documentation\PackageResource;
use Composer\InstalledVersions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

pest()->extend(TestCase::class);

test('reports Composer versions independently from the documented compatibility version', function (?array $installation, ?string $expectedVersion, string $expectedStatus) {
    $original = InstalledVersions::getRawData();
    $fixture = $original;
    $name = 'artisan-toolbox/metadata-fixture';

    if ($installation !== null) {
        $fixture['versions'][$name] = $installation;
    }

    InstalledVersions::reload($fixture);

    try {
        $package = new readonly class extends Package
        {
            public function __construct()
            {
                parent::__construct(
                    id: 'metadata-fixture',
                    title: 'Metadata fixture',
                    summary: 'Package metadata fixture.',
                    version: '1.x',
                    documentedVersion: '1.10',
                    stability: 'Stable',
                );
            }
        };
        $metadata = (new PackageResource($package))->resolve(Request::create('/docs/metadata-fixture'));

        expect($metadata['documentedVersion'])->toBe('1.10')
            ->and($metadata['installedVersion'])->toBe($expectedVersion)
            ->and($metadata['installationStatus'])->toBe($expectedStatus)
            ->and($metadata)->not->toHaveKey('installPath');
    } finally {
        InstalledVersions::reload($original);
    }
})->with([
    'a tagged release' => [['pretty_version' => 'v1.10.7', 'version' => '1.10.7.0', 'install_path' => __DIR__], 'v1.10.7', 'installed'],
    'another high patch release' => [['pretty_version' => '1.999.998', 'version' => '1.999.998.0', 'install_path' => __DIR__], '1.999.998', 'installed'],
    'a nearby high patch release' => [['pretty_version' => '1.99.98', 'version' => '1.99.98.0', 'install_path' => __DIR__], '1.99.98', 'installed'],
    'another major version' => [['pretty_version' => '2.999.999', 'version' => '2.999.999.0', 'install_path' => __DIR__], '2.999.999', 'installed'],
    'a development branch' => [['pretty_version' => 'dev-1.x', 'version' => 'dev-1.x', 'install_path' => __DIR__], 'dev-1.x', 'installed'],
    'a local compatibility version' => [['pretty_version' => '1.999.999', 'version' => '1.999.999.0', 'install_path' => __DIR__], '1.x-dev', 'installed'],
    'a local development alias' => [['pretty_version' => '1.99.99', 'version' => '1.99.99.0', 'install_path' => __DIR__], '1.x-dev', 'installed'],
    'an absent package' => [null, null, 'not-installed'],
    'a provided package without its own version' => [['provided' => ['1.10']], null, 'version-unavailable'],
]);

test('identifies a Composer symlink installation as a local preview without exposing its path', function () {
    $original = InstalledVersions::getRawData();
    $fixture = $original;
    $installationPath = sys_get_temp_dir().'/artisan-toolbox-package-metadata-'.bin2hex(random_bytes(8));
    symlink(__DIR__, $installationPath);
    $fixture['versions']['artisan-toolbox/metadata-fixture'] = [
        'pretty_version' => '1.999.999',
        'version' => '1.999.999.0',
        'install_path' => $installationPath,
    ];
    InstalledVersions::reload($fixture);

    try {
        $package = new readonly class extends Package
        {
            public function __construct()
            {
                parent::__construct('metadata-fixture', 'Metadata fixture', 'Package metadata fixture.', '1.x');
            }
        };
        $metadata = (new PackageResource($package))->resolve(Request::create('/docs/metadata-fixture'));

        expect($metadata['installedVersion'])->toBe('1.x-dev')
            ->and($metadata['installationSource'])->toBe('local-path')
            ->and(json_encode($metadata, JSON_THROW_ON_ERROR))->not->toContain($installationPath);
    } finally {
        InstalledVersions::reload($original);
        File::delete($installationPath);
    }
});
