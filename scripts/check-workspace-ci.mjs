import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const workspace = resolve(import.meta.dirname, '../..');
const repositories = readdirSync(workspace, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .filter((name) => existsSync(join(workspace, name, '.github', 'workflows')))
    .sort();

if (repositories.length === 0) {
    console.error('No Actions workflows found in the Artisan Toolbox workspace.');
    process.exitCode = 1;
}

for (const repository of repositories) {
    console.log(`Checking ${repository}`);
    const result = spawnSync('actionlint', [], {
        cwd: join(workspace, repository),
        stdio: 'inherit',
    });

    if (result.error) {
        console.error(`Could not start actionlint: ${result.error.message}`);
        process.exitCode = 1;
        break;
    }

    if (result.status !== 0) {
        process.exitCode = 1;
    }
}
