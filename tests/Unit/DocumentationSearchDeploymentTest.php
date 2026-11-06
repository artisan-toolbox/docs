<?php

use Illuminate\Filesystem\Filesystem;
use Symfony\Component\Process\Process;

beforeEach(function () {
    $this->deploymentDirectory = realpath(sys_get_temp_dir()).'/atb-search-deployment-'.bin2hex(random_bytes(8));
    $this->candidateRelease = $this->deploymentDirectory.'/candidate release';
    $this->currentRelease = $this->deploymentDirectory.'/previous release';
    $files = new Filesystem;
    $files->makeDirectory($this->candidateRelease, recursive: true);
    $files->makeDirectory($this->currentRelease);
    $files->put($this->deploymentDirectory.'/events.jsonl', '');
    $files->put($this->currentRelease.'/search.sqlite', 'previous search artifact');
    $files->put($this->currentRelease.'/artisan', '<?php file_put_contents(__DIR__."/unexpected-command", "called"); exit(91);');
    symlink($this->currentRelease, $this->deploymentDirectory.'/current');

    $files->put($this->candidateRelease.'/artisan', <<<'PHP'
<?php
$directory = dirname(__DIR__);
$arguments = array_slice($argv, 1);
file_put_contents($directory.'/events.jsonl', json_encode([
    'task' => 'search',
    'file' => __FILE__,
    'cwd' => getcwd(),
    'arguments' => $arguments,
])."\n", FILE_APPEND);
$stage = in_array('--check', $arguments, true) ? 'check' : 'build';
if (is_file($directory.'/fail-'.$stage)) {
    fwrite(STDERR, "Search $stage failed.\n");
    exit(23);
}
if ($stage === 'build') {
    file_put_contents(__DIR__.'/search.sqlite', 'candidate search artifact');
}
exit(is_file(__DIR__.'/search.sqlite') ? 0 : 24);
PHP);

    $root = dirname(__DIR__, 2);
    $autoload = var_export($root.'/vendor/autoload.php', true);
    $deployer = var_export($root.'/vendor/deployer/deployer', true);
    $recipe = var_export($root.'/resources/deployer/search.php', true);
    $directory = var_export($this->deploymentDirectory, true);
    $php = var_export(escapeshellarg(PHP_BINARY), true);
    $files->put($this->deploymentDirectory.'/deploy.php', <<<PHP
<?php
namespace Deployer;
require 'recipe/common.php';
import($recipe);
localhost('fixture')
    ->set('release_path', $directory.'/candidate release')
    ->set('release_or_current_path', $directory.'/current')
    ->set('bin/php', $php)
    ->set('dotenv', false);
foreach (['dependencies', 'assets', 'optimize', 'migrate', 'publish', 'pm2', 'reload'] as \$stage) {
    task('fixture:'.\$stage, function () use (\$stage): void {
        file_put_contents($directory.'/events.jsonl', json_encode(['task' => \$stage])."\n", FILE_APPEND);
        if (\$stage === 'publish') {
            unlink($directory.'/current');
            symlink($directory.'/candidate release', $directory.'/current');
        }
    });
}
task('fixture:deploy', [
    'fixture:dependencies',
    'fixture:assets',
    'fixture:optimize',
    'docs:search',
    'fixture:migrate',
    'fixture:publish',
    'fixture:pm2',
    'fixture:reload',
]);
PHP);

    $files->put($this->deploymentDirectory.'/run.php', <<<PHP
<?php
require $autoload;
set_include_path($deployer.PATH_SEPARATOR.get_include_path());
\$deployer = new Deployer\Deployer(new Symfony\Component\Console\Application);
\$deployer['input'] = new Symfony\Component\Console\Input\ArrayInput([]);
\$deployer['input']->setInteractive(false);
\$deployer['output'] = new Symfony\Component\Console\Output\ConsoleOutput;
require __DIR__.'/deploy.php';
\$deployer->scriptManager->setHooksEnabled(false);
foreach (\$deployer->scriptManager->getTasks('fixture:deploy') as \$task) {
    \$task->run(new Deployer\Task\Context(\$deployer->hosts->get('fixture')));
}
PHP);

    $this->deployment = new Process([
        PHP_BINARY,
        $this->deploymentDirectory.'/run.php',
    ], $this->deploymentDirectory);
    $this->deployment->setTimeout(30);
});

afterEach(function () {
    (new Filesystem)->deleteDirectory($this->deploymentDirectory);
});

test('builds and checks the candidate release before publication even without hooks', function () {
    for ($attempt = 0; $attempt < 2; $attempt++) {
        $this->deployment->mustRun();
        $events = array_map(json_decode(...), file($this->deploymentDirectory.'/events.jsonl', FILE_IGNORE_NEW_LINES));
        $run = array_slice($events, $attempt * 9, 9);

        expect(array_column($run, 'task'))->toBe([
            'dependencies', 'assets', 'optimize', 'search', 'search', 'migrate', 'publish', 'pm2', 'reload',
        ]);
        foreach (array_slice($run, 3, 2) as $event) {
            expect($event->file)->toBe($this->candidateRelease.'/artisan');
            expect($event->cwd)->toBe($this->candidateRelease);
        }
        expect($run[3]->arguments)->toBe(['docs:search:index', '--no-interaction']);
        expect($run[4]->arguments)->toBe(['docs:search:index', '--check', '--no-interaction']);
        expect(readlink($this->deploymentDirectory.'/current'))->toBe($this->candidateRelease);
        expect(file_get_contents($this->candidateRelease.'/search.sqlite'))->toBe('candidate search artifact');
        expect(file_get_contents($this->currentRelease.'/search.sqlite'))->toBe('previous search artifact');
        expect($this->currentRelease.'/unexpected-command')->not->toBeFile();
    }
});

test('stops deployment before migration and publication when search fails', function (string $stage, array $arguments) {
    touch($this->deploymentDirectory.'/fail-'.$stage);
    $this->deployment->run();
    $events = array_map(json_decode(...), file($this->deploymentDirectory.'/events.jsonl', FILE_IGNORE_NEW_LINES));
    $searchEvents = array_slice($events, 3);

    expect($this->deployment->isSuccessful())->toBeFalse();
    expect(array_column($events, 'task'))->toBe(array_merge(['dependencies', 'assets', 'optimize'], array_fill(0, count($arguments), 'search')));
    expect(array_column($searchEvents, 'arguments'))->toBe($arguments);
    foreach ($searchEvents as $event) {
        expect($event->file)->toBe($this->candidateRelease.'/artisan');
        expect($event->cwd)->toBe($this->candidateRelease);
    }
    expect(readlink($this->deploymentDirectory.'/current'))->toBe($this->currentRelease);
    expect(file_get_contents($this->currentRelease.'/search.sqlite'))->toBe('previous search artifact');
    expect($this->currentRelease.'/unexpected-command')->not->toBeFile();
})->with([
    'build failure' => ['build', [['docs:search:index', '--no-interaction']]],
    'freshness check failure' => ['check', [
        ['docs:search:index', '--no-interaction'],
        ['docs:search:index', '--check', '--no-interaction'],
    ]],
]);
