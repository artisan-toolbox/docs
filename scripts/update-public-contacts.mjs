import { readFile, readdir, rename, stat, writeFile } from 'node:fs/promises';
import { basename, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

const projects = [
    'core',
    'front-awesome',
    'dump-to-console',
    'qztray',
    'mosaicast',
    'maintainer',
    'docs',
    'docs_old',
    'application',
];
const excluded = new Set([
    '.git',
    'vendor',
    'node_modules',
    'dist',
    '.astro',
    'storage',
    'builds',
    'coverage',
    '.ai',
    '.agents',
    '.codex',
    'cache',
    '.vite',
    '.box_dump',
]);
const suffixes = new Set([
    '.md',
    '.php',
    '.js',
    '.mjs',
    '.cjs',
    '.vue',
    '.css',
    '.json',
    '.lock',
    '.conf',
    '.ts',
    '.yml',
    '.yaml',
    '.html',
    '.astro',
    '.txt',
]);
const oldHost = ['artisantoolbox', 'wsssoftware', 'com', 'br'].join('.');
const oldEmail = ['allan', 'wss.group'].join('@');

async function exists(path) {
    try {
        await stat(path);
        return true;
    } catch (error) {
        if (error.code === 'ENOENT') return false;
        throw error;
    }
}

async function sourceFiles(directory) {
    if (!(await exists(directory))) return [];
    const files = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        if (entry.isSymbolicLink()) continue;
        const path = join(directory, entry.name);
        if (entry.isDirectory()) {
            if (
                excluded.has(entry.name) ||
                /secret|credential|keys/i.test(entry.name) ||
                (basename(directory) === 'public' && entry.name === 'build')
            )
                continue;
            files.push(...(await sourceFiles(path)));
        } else if (
            entry.isFile() &&
            suffixes.has(extname(entry.name)) &&
            !entry.name.startsWith('.env') &&
            entry.name !== 'deploy.php' &&
            !/secret|credential|token|private|keys|public_key/i.test(entry.name)
        ) {
            files.push(path);
        }
    }
    return files;
}

export async function updatePublicContacts(workspace, { write = false } = {}) {
    const oldNginx = join(workspace, 'docs_old/deploy/nginx', `${oldHost}.conf`);
    const newNginx = join(workspace, 'docs_old/deploy/nginx/atb.dev.br.conf');
    const renameNginx = await exists(oldNginx);
    if (renameNginx && (await exists(newNginx)))
        throw new Error('Both NGINX templates exist; reconcile them before updating contacts.');
    const files = (
        await Promise.all(projects.map((project) => sourceFiles(join(workspace, project))))
    ).flat();
    const guidance = join(workspace, 'AGENTS.md');
    if (await exists(guidance)) files.push(guidance);
    const changed = [];
    for (const path of files) {
        const bytes = await readFile(path);
        const before = bytes.toString('utf8');
        if (!Buffer.from(before).equals(bytes)) continue;
        let after = before.replaceAll(oldHost, 'atb.dev.br');
        if (['composer.json', 'composer.lock', 'SECURITY.md'].includes(basename(path)))
            after = after.replaceAll(oldEmail, 'contact@atb.dev.br');
        if (before === after) continue;
        changed.push(relative(workspace, path));
        if (write) await writeFile(path, after);
    }
    if (renameNginx) {
        changed.push(`${relative(workspace, oldNginx)} -> atb.dev.br.conf`);
        if (write) await rename(oldNginx, newNginx);
    }
    return changed;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    const { values } = parseArgs({
        options: {
            check: { type: 'boolean' },
            write: { type: 'boolean' },
            workspace: {
                type: 'string',
                default: fileURLToPath(new URL('../../', import.meta.url)),
            },
        },
    });
    if (values.check && values.write) throw new Error('Choose --check or --write.');
    const changed = await updatePublicContacts(values.workspace, {
        write: values.write,
    });
    for (const path of changed) process.stdout.write(`${path}\n`);
    process.stdout.write(
        `${values.write ? 'Updated' : 'Pending'} public contact files: ${changed.length}\n`,
    );
    if (!values.write && changed.length) process.exitCode = 1;
}
