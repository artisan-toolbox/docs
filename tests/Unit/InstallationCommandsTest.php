<?php

use App\Documentation\InstallationCommands;
use Composer\InstalledVersions;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

pest()->extend(TestCase::class);

test('installation instructions follow installed versions without rewriting Composer metadata', function () {
    $original = InstalledVersions::getRawData();
    $fixture = $original;
    $fixture['versions']['artisan-toolbox/version-fixture']['pretty_version'] = '1.99.99';
    InstalledVersions::reload($fixture);

    try {
        expect(resolve(InstallationCommands::class)->forPackage('version-fixture')['composer']['code'])
            ->toBe('composer require artisan-toolbox/version-fixture:1.x-dev');
        expect(InstalledVersions::getPrettyVersion('artisan-toolbox/version-fixture'))->toBe('1.99.99');
        $fixture['versions']['artisan-toolbox/version-fixture']['pretty_version'] = 'v1.8.7';
        InstalledVersions::reload($fixture);
        expect(resolve(InstallationCommands::class)->forPackage('version-fixture')['composer']['code'])
            ->toBe('composer require artisan-toolbox/version-fixture:v1.8.7');
        $fixture['versions']['artisan-toolbox/version-fixture']['pretty_version'] = '1.0.0-alpha.1';
        InstalledVersions::reload($fixture);
        expect(resolve(InstallationCommands::class)->forPackage('version-fixture')['composer']['code'])
            ->toBe('composer require artisan-toolbox/version-fixture:1.0.0-alpha.1');
        expect(resolve(InstallationCommands::class)->forPackage('maintainer')['composer']['code'])
            ->toStartWith('composer require --dev artisan-toolbox/maintainer:');
    } finally {
        InstalledVersions::reload($original);
    }
});

test('QZ instructions use the locked Ziggy versions and preserve backend before frontend installation', function () {
    $commands = resolve(InstallationCommands::class)->forPackage('qztray');
    $lock = json_decode(file_get_contents(base_path('package-lock.json')), true, flags: JSON_THROW_ON_ERROR);
    $ziggy = InstalledVersions::getPrettyVersion('tightenco/ziggy');

    expect($commands['security']['code'])->toBe('composer require tightenco/ziggy:'.$ziggy."\nnpm install ziggy-js@".$lock['packages']['node_modules/ziggy-js']['version'])
        ->and($commands['setup']['code'])->toContain(' tightenco/ziggy:'.$ziggy."\nnpm install ./vendor/artisan-toolbox/qztray\nphp artisan vendor:publish --tag=qztray-config");
});

test('uninstalled packages never produce an invented installation version', function () {
    expect(resolve(InstallationCommands::class)->forPackage('missing-package')['composer']['code'])->toBeNull();
});

test('Filoquent installs its locked alpha from Packagist without a local checkout or frontend', function () {
    $commands = resolve(InstallationCommands::class)->forPackage('filoquent');

    expect($commands['composer']['code'])->toBe('composer require artisan-toolbox/filoquent:1.0.0-alpha.1');
    expect($commands)->not->toHaveKey('preview')->not->toHaveKey('frontend');
});

test('Front Awesome installs directly from Composer without a local checkout', function () {
    $version = InstallationCommands::composerVersion('artisan-toolbox/front-awesome');

    $commands = resolve(InstallationCommands::class)->forPackage('front-awesome');

    expect($commands['composer']['code'])->toBe('composer require artisan-toolbox/front-awesome:'.$version);
    expect($commands['frontend']['code'])->toBe('npm install --install-links ./vendor/artisan-toolbox/front-awesome ./vendor/artisan-toolbox/mosaicast');
});

test('frontend instructions immediately follow lockfile changes without authored version updates', function () {
    $originalPath = base_path();
    $temporaryPath = sys_get_temp_dir().'/atb-installation-lock-'.bin2hex(random_bytes(8));
    mkdir($temporaryPath);
    app()->setBasePath($temporaryPath);

    try {
        file_put_contents($temporaryPath.'/package-lock.json', json_encode(['packages' => ['node_modules/ziggy-js' => ['version' => '2.6.5']]], JSON_THROW_ON_ERROR));
        $first = resolve(InstallationCommands::class)->forPackage('qztray')['security']['code'];
        expect($first)->toEndWith('npm install ziggy-js@2.6.5');
        file_put_contents($temporaryPath.'/package-lock.json', json_encode(['packages' => ['node_modules/ziggy-js' => ['version' => '2.7.1']]], JSON_THROW_ON_ERROR));
        expect(resolve(InstallationCommands::class)->forPackage('qztray')['security']['code'])
            ->toBe(str_replace('ziggy-js@2.6.5', 'ziggy-js@2.7.1', $first));
    } finally {
        app()->setBasePath($originalPath);
        File::delete($temporaryPath.'/package-lock.json');
        rmdir($temporaryPath);
    }
});

test('optional integration pins use the documentation lockfile', function () {
    $instruction = resolve(InstallationCommands::class)->forPackage('front-awesome')['primevue'];
    $lock = json_decode(file_get_contents(base_path('package-lock.json')), true, flags: JSON_THROW_ON_ERROR);

    expect($instruction['code'])->toBe('npm install primevue@'.$lock['packages']['node_modules/primevue']['version'].' @primeuix/themes@'.$lock['packages']['node_modules/@primeuix/themes']['version']);
});
