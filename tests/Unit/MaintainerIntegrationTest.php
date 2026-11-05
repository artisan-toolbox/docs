<?php

use App\ArtisanToolbox;
use Illuminate\Filesystem\Filesystem;
use Symfony\Component\Process\Process;

test('keeps the README head synchronized through the installed Maintainer command', function () {
    $root = dirname(__DIR__, 2);
    $files = new Filesystem;
    $project = sys_get_temp_dir().'/artisan-docs-maintainer-'.bin2hex(random_bytes(8));
    $files->makeDirectory($project);

    try {
        $files->copy($root.'/composer.json', $project.'/composer.json');
        $files->copyDirectory($root.'/app', $project.'/app');
        $sourceReadme = $files->get($root.'/README.md');
        $readme = $sourceReadme."\n## Integration content\n\nKeep this unmanaged content.\n";
        $files->put($project.'/README.md', preg_replace(
            '/\A<!-- MAINTAINER:README_HEAD:START -->.*?<!-- MAINTAINER:README_HEAD:END -->\r?\n\r?\n/s',
            '',
            $readme,
            1,
        ));

        $command = new Process([
            PHP_BINARY,
            $root.'/vendor/artisan-toolbox/maintainer/builds/maintainer',
            'readme:update',
            '--no-interaction',
            '--no-ansi',
        ], $project);
        $command->setTimeout(30);
        $command->mustRun();

        expect($files->get($project.'/README.md'))
            ->toBe($readme)
            ->toContain('<!-- MAINTAINER:README_HEAD:START -->', '<h1>Artisan Toolbox documentation</h1>', 'branch=1.x');
        expect(ArtisanToolbox::VERSION)->toBeString()->not->toBeEmpty();

        $command->mustRun();

        expect($files->get($project.'/README.md'))->toBe($readme);
        expect($files->get($root.'/README.md'))->toBe($sourceReadme);
    } finally {
        $files->deleteDirectory($project);
    }
});
