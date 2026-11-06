<?php

namespace Deployer;

desc('Build and verify the documentation search index in the candidate release');
task('docs:search', function (): void {
    writeln(run('{{bin/php}} artisan docs:search:index --no-interaction', cwd: get('release_path')));
    writeln(run('{{bin/php}} artisan docs:search:index --check --no-interaction', cwd: get('release_path')));
});
