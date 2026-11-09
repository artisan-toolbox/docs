// @vitest-environment node
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, expect, test } from 'vite-plus/test';
import { updatePublicContacts } from './update-public-contacts.mjs';

const oldHost = ['artisantoolbox', 'wsssoftware', 'com', 'br'].join('.');
const oldEmail = ['allan', 'wss.group'].join('@');
let workspace;

beforeEach(async () => {
    workspace = await mkdtemp(join(tmpdir(), 'atb-contacts-'));
});
afterEach(async () => {
    await rm(workspace, { recursive: true, force: true });
});

async function fixture(path, content) {
    const target = join(workspace, path);
    await mkdir(join(target, '..'), { recursive: true });
    await writeFile(target, content);
    return target;
}

test('reports stale public references without writing and converges after an explicit update', async () => {
    const readme = await fixture('core/README.md', `https://${oldHost}/packages/core/`);
    const composer = await fixture(
        'core/composer.json',
        JSON.stringify({
            authors: [{ email: oldEmail }],
            require: { php: '^8.5' },
        }),
    );
    expect(await updatePublicContacts(workspace)).toHaveLength(2);
    expect(await readFile(readme, 'utf8')).toContain(oldHost);
    await updatePublicContacts(workspace, { write: true });
    expect(await readFile(readme, 'utf8')).toBe('https://atb.dev.br/packages/core/');
    expect(JSON.parse(await readFile(composer, 'utf8'))).toEqual({
        authors: [{ email: 'contact@atb.dev.br' }],
        require: { php: '^8.5' },
    });
    expect(await updatePublicContacts(workspace)).toEqual([]);
});

test('leaves protected configuration, dependencies, generated files, and authentication identities untouched', async () => {
    const protectedPaths = [
        'docs/.env',
        'docs/.env.example',
        'docs/config/maintainer_secrets.php',
        'docs/deploy.php',
        'docs/vendor/example/README.md',
        'docs/public/build/app.js',
        'docs/storage/logs/example.txt',
        'docs/credentials/settings.json',
    ];
    const contents = `${oldHost} ${oldEmail}`;
    for (const path of protectedPaths) await fixture(path, contents);
    const identities = await fixture(
        'docs/tests/identities.js',
        'person@atb.dev.br noreply@atb.dev.br outsider@example.com',
    );
    expect(await updatePublicContacts(workspace, { write: true })).toEqual([]);
    for (const path of protectedPaths)
        expect(await readFile(join(workspace, path), 'utf8')).toBe(contents);
    expect(await readFile(identities, 'utf8')).toBe(
        'person@atb.dev.br noreply@atb.dev.br outsider@example.com',
    );
});

test('renames the public NGINX template and refuses to overwrite an existing destination', async () => {
    const oldPath = await fixture(
        `docs_old/deploy/nginx/${oldHost}.conf`,
        `server_name ${oldHost};`,
    );
    const newPath = await fixture('docs_old/deploy/nginx/atb.dev.br.conf', 'existing template');
    await expect(updatePublicContacts(workspace, { write: true })).rejects.toThrow(
        'Both NGINX templates exist',
    );
    expect(await readFile(newPath, 'utf8')).toBe('existing template');
    await rm(newPath);
    await updatePublicContacts(workspace, { write: true });
    expect(await readFile(newPath, 'utf8')).toBe('server_name atb.dev.br;');
    await expect(readFile(oldPath)).rejects.toMatchObject({ code: 'ENOENT' });
    expect(await updatePublicContacts(workspace)).toEqual([]);
});
