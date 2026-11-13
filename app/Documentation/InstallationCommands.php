<?php

namespace App\Documentation;

use Composer\InstalledVersions;
use Illuminate\Support\Facades\File;

final class InstallationCommands
{
    public static function composerVersion(string $name): ?string
    {
        $version = InstalledVersions::isInstalled($name) ? InstalledVersions::getPrettyVersion($name) : null;

        return in_array($version, ['1.99.99', '1.999.999'], true) ? '1.x-dev' : $version;
    }

    /** @return array<string, array{code: ?string}> */
    public function forPackage(string $id): array
    {
        $name = 'artisan-toolbox/'.$id;
        $version = self::composerVersion($name);
        $composer = $version === null ? null : 'composer require '.($id === 'maintainer' ? '--dev ' : '').$name.':'.$version;
        $commands = ['composer' => $this->command($composer)];
        $frontend = 'npm install '.($id === 'qztray' ? '' : '--install-links ').'./vendor/'.$name.($id === 'front-awesome' ? ' ./vendor/artisan-toolbox/mosaicast' : '');

        if (in_array($id, ['front-awesome', 'mosaicast', 'qztray'], true)) {
            $commands['frontend'] = $this->command($frontend);
        }

        if ($id === 'front-awesome') {
            $commands['primevue'] = $this->npm(['primevue', '@primeuix/themes']);
            $qztray = self::composerVersion('artisan-toolbox/qztray');
            $ziggy = self::composerVersion('tightenco/ziggy');
            $commands['printing'] = $this->command($qztray === null || $ziggy === null ? null : 'composer require artisan-toolbox/qztray:'.$qztray.' tightenco/ziggy:'.$ziggy."\n".'npm install --install-links ./vendor/artisan-toolbox/front-awesome ./vendor/artisan-toolbox/mosaicast ./vendor/artisan-toolbox/qztray');
        }

        if ($id === 'mosaicast') {
            $commands['broadcast'] = $this->npm(['@laravel/echo-vue', 'laravel-echo', 'pusher-js'], '--save-dev');
        }

        if ($id === 'qztray') {
            $escpos = self::composerVersion('mike42/escpos-php');
            $commands['escpos'] = $this->command($escpos === null ? null : 'composer require mike42/escpos-php:'.$escpos);
            $ziggy = self::composerVersion('tightenco/ziggy');
            $commands['composer'] = $this->command($composer === null || $ziggy === null ? null : $composer.' tightenco/ziggy:'.$ziggy);
            $commands['setup'] = $this->command($commands['composer']['code'] === null ? null : $commands['composer']['code']."\n".$frontend."\nphp artisan vendor:publish --tag=qztray-config");
            $npm = $this->npm(['ziggy-js']);
            $commands['security'] = $this->command($ziggy === null || $npm['code'] === null ? null : 'composer require tightenco/ziggy:'.$ziggy."\n".$npm['code']);
        }

        return $commands;
    }

    /** @return array{code: ?string} */
    private function command(?string $code): array
    {
        return ['code' => $code];
    }

    /**
     * @param  list<string>  $packages
     * @return array{code: ?string}
     */
    private function npm(array $packages, string $options = ''): array
    {
        $lock = $this->lock(base_path('package-lock.json'));
        $arguments = [];

        foreach ($packages as $package) {
            $version = $lock['packages']['node_modules/'.$package]['version'] ?? null;

            if (! is_string($version) || $version === '') {
                return $this->command(null);
            }

            $arguments[] = $package.'@'.$version;
        }

        return $this->command('npm install '.($options === '' ? '' : $options.' ').implode(' ', $arguments));
    }

    /** @return array<string, mixed> */
    private function lock(string $path): array
    {
        return is_file($path) ? json_decode(File::get($path), true, flags: JSON_THROW_ON_ERROR) : [];
    }
}
