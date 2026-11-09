import { execFileSync } from 'node:child_process';

const cache = new Map();

export function sourceNavigation(prefix = '/docs', current = '') {
    const key = JSON.stringify([prefix, current]);
    if (!cache.has(key)) {
        const code = `require 'vendor/autoload.php'; $app = require 'bootstrap/app.php'; $app->make(Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap(); $app->make('router')->getRoutes()->getByName('docs.index')->setUri($argv[1]); $app->make('router')->getRoutes()->getByName('docs.show')->setUri($argv[1].'/{slug}'); echo json_encode($app->make(App\\Documentation\\Documentation::class)->navigation(App\\Documentation\\PageSlug::from($argv[2])), JSON_THROW_ON_ERROR);`;
        cache.set(
            key,
            JSON.parse(
                execFileSync('php', ['-r', code, prefix.replace(/^\//, ''), current], {
                    cwd: process.cwd(),
                    encoding: 'utf8',
                }),
            ),
        );
    }
    return structuredClone(cache.get(key));
}
