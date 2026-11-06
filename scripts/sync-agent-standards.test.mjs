// @vitest-environment node
import { execFileSync, spawnSync } from 'node:child_process';
import {
    mkdirSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    statSync,
    symlinkSync,
    writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, expect, test } from 'vite-plus/test';
import { releaseStandards, syncStandards } from './sync-agent-standards.mjs';

let directory;
let source;
let target;
const script = path.resolve('scripts/sync-agent-standards.mjs');
const skill = 'skills/atb-example/SKILL.md';
const entry =
    '---\nname: atb-example\ndescription: Document example package APIs.\n---\n\n# Example\n';
const read = (relative) => readFileSync(path.join(target, relative), 'utf8');
function put(root, relative, content) {
    const filename = path.join(root, relative);
    mkdirSync(path.dirname(filename), { recursive: true });
    writeFileSync(filename, content);
}
const sync = (options = {}) => syncStandards({ source, target, ...options });

beforeEach(() => {
    directory = mkdtempSync(path.join(tmpdir(), 'atb-standards-'));
    source = path.join(directory, 'source');
    target = path.join(directory, 'consumer');
    mkdirSync(target);
    put(
        source,
        'manifest.json',
        JSON.stringify({
            schemaVersion: 1,
            version: '0.0.0',
            skills: ['atb-example'],
            sha256: '',
        }),
    );
    put(source, skill, entry);
    put(
        source,
        'sync.mjs',
        readFileSync('documentation/agent-standards/sync.mjs'),
    );
    put(
        source,
        'skills/atb-example/references/example.md',
        '# Example reference\n',
    );
    releaseStandards(source, '1.0.0');
});

afterEach(() => rmSync(directory, { recursive: true, force: true }));

test('checks without writing, installs pinned skills for Codex and Boost, and converges without rewrites', () => {
    expect(sync().changes).toContain(`.agents/${skill}`);
    expect(() => read(`.agents/${skill}`)).toThrow();
    sync({ write: true, version: '1.0.0' });
    expect(read(`.agents/${skill}`)).toBe(entry);
    expect(read(`.ai/${skill}`)).toBe(entry);
    expect(read('.agents/skills/atb-example/references/example.md')).toBe(
        '# Example reference\n',
    );
    const lock = JSON.parse(read('.ai/standards.lock.json'));
    expect(lock.version).toBe('1.0.0');
    expect(lock.files).toHaveProperty(`.agents/${skill}`);
    const modified = statSync(path.join(target, `.agents/${skill}`)).mtimeMs;
    expect(sync({ write: true, version: '1.0.0' }).changes).toEqual([]);
    expect(statSync(path.join(target, `.agents/${skill}`)).mtimeMs).toBe(
        modified,
    );
    expect(sync().changes).toEqual([]);
});

test('requires an explicit matching version before installation or upgrades', () => {
    expect(() => sync({ write: true })).toThrow('Pin the source version');
    expect(() => sync({ write: true, version: '2.0.0' })).toThrow(
        'Pin the source version',
    );
    expect(() => read('.ai/standards.lock.json')).toThrow();
    expect(() => releaseStandards(source, '01.0.1')).toThrow(
        'major.minor.patch',
    );
});

test('detects consumer drift and preserves local edits before making any writes', () => {
    sync({ write: true, version: '1.0.0' });
    put(target, `.agents/${skill}`, 'Local edits');
    const original = read(`.ai/${skill}`);
    put(source, skill, entry + 'A new recommendation.\n');
    releaseStandards(source, '1.0.1');
    expect(sync().changes).toContain(`.agents/${skill}`);
    expect(() => sync({ write: true, version: '1.0.1' })).toThrow(
        'Preserve local edits',
    );
    expect(read(`.agents/${skill}`)).toBe('Local edits');
    expect(read(`.ai/${skill}`)).toBe(original);
    expect(JSON.parse(read('.ai/standards.lock.json')).version).toBe('1.0.0');
});

test('preserves unrelated skills and rejects a colliding unmanaged file', () => {
    put(target, '.agents/skills/personal/SKILL.md', 'Personal skill');
    put(target, `.agents/${skill}`, 'Existing instruction');
    expect(() => sync({ write: true, version: '1.0.0' })).toThrow(
        'Preserve local edits',
    );
    expect(read('.agents/skills/personal/SKILL.md')).toBe('Personal skill');
    expect(() => read(`.ai/${skill}`)).toThrow();
});

test('requires a new release for changed source and rejects version reuse and downgrades', () => {
    put(source, skill, entry + 'Changed source.\n');
    expect(() => sync()).toThrow('Release a new standards version');
    expect(() => releaseStandards(source, '1.0.0')).toThrow('higher version');
    expect(() => releaseStandards(source, '0.9.0')).toThrow('higher version');
    releaseStandards(source, '1.0.1');
    releaseStandards(source, '1.0.1');
    sync({ write: true, version: '1.0.1' });
    expect(read(`.agents/${skill}`)).toContain('Changed source.');
});

test('preserves the source manifest formatting when installing a selected release', () => {
    const filename = path.join(source, 'manifest.json');
    const manifest = JSON.stringify(JSON.parse(readFileSync(filename))) + '\n';
    writeFileSync(filename, manifest);
    sync({ write: true, version: '1.0.0' });
    expect(read('.ai/manifest.json')).toBe(manifest);
    expect(sync().changes).toEqual([]);
});

test('removes obsolete managed resources during upgrades while retaining unrelated content', () => {
    sync({ write: true, version: '1.0.0' });
    put(target, '.agents/skills/personal/SKILL.md', 'Personal skill');
    rmSync(path.join(source, 'skills/atb-example/references/example.md'));
    releaseStandards(source, '1.1.0');
    sync({ write: true, version: '1.1.0' });
    expect(() =>
        read('.agents/skills/atb-example/references/example.md'),
    ).toThrow();
    expect(() =>
        read('.ai/skills/atb-example/references/example.md'),
    ).toThrow();
    expect(read('.agents/skills/personal/SKILL.md')).toBe('Personal skill');
    expect(sync().changes).toEqual([]);
});

test('rejects traversal and unrelated lock entries before modifying the consumer', () => {
    for (const relative of [
        '../../outside.txt',
        '.agents/skills/personal/SKILL.md',
        '.ai/skills/atb-example/../../outside.txt',
    ]) {
        put(
            target,
            '.ai/standards.lock.json',
            JSON.stringify({ files: { [relative]: 'old' } }),
        );
        expect(() => sync({ write: true, version: '1.0.0' })).toThrow(
            /Unsafe|Unmanaged/,
        );
        expect(() => read(`.agents/${skill}`)).toThrow();
    }
});

test('rejects symlinked destinations including dangling file links', () => {
    mkdirSync(path.join(target, '.agents'), { recursive: true });
    symlinkSync(
        path.join(directory, 'outside'),
        path.join(target, '.agents/skills'),
    );
    expect(() => sync({ write: true, version: '1.0.0' })).toThrow('symlinks');
    rmSync(path.join(target, '.agents/skills'));
    mkdirSync(path.join(target, '.agents/skills/atb-example'), {
        recursive: true,
    });
    symlinkSync(
        path.join(directory, 'missing.md'),
        path.join(target, `.agents/${skill}`),
    );
    expect(() => sync({ write: true, version: '1.0.0' })).toThrow('symlinks');
});

test('supports Boost links from a Codex skill to the matching canonical skill during checks and upgrades', () => {
    sync({ write: true, version: '1.0.0' });
    const link = path.join(target, '.agents/skills/atb-example');
    rmSync(link, { recursive: true });
    symlinkSync('../../.ai/skills/atb-example', link);
    expect(sync().changes).toEqual([]);
    put(source, skill, entry + 'Updated public workflow.\n');
    releaseStandards(source, '1.0.1');
    sync({ write: true, version: '1.0.1' });
    expect(read(`.agents/${skill}`)).toBe(read(`.ai/${skill}`));
    expect(read(`.agents/${skill}`)).toContain('Updated public workflow.');
    expect(sync().changes).toEqual([]);
    rmSync(path.join(source, 'skills/atb-example/references/example.md'));
    releaseStandards(source, '1.0.2');
    sync({ write: true, version: '1.0.2' });
    expect(() =>
        read('.ai/skills/atb-example/references/example.md'),
    ).toThrow();
    expect(sync().changes).toEqual([]);
    rmSync(link);
    symlinkSync(path.join(directory, 'unrelated'), link);
    expect(() => sync()).toThrow('symlinks');
});

test('rejects a skill missing discovery metadata before it can be released', () => {
    put(source, skill, '# No metadata\n');
    expect(() => releaseStandards(source, '1.0.1')).toThrow('skill metadata');
});

test('the CLI reports drift with a failing exit status and supports explicit pinned installation', () => {
    const args = [script, '--source', source, '--target', target];
    const before = spawnSync(process.execPath, [...args, '--check'], {
        encoding: 'utf8',
    });
    expect(before.status).toBe(1);
    expect(before.stdout).toContain('pending files');
    execFileSync(process.execPath, [...args, '--write', '--version', '1.0.0']);
    const after = spawnSync(process.execPath, [...args, '--check'], {
        encoding: 'utf8',
    });
    expect(after.status).toBe(0);
    expect(after.stdout).toContain('0 pending files');
    const standalone = spawnSync(
        process.execPath,
        ['.ai/sync.mjs', '--check'],
        { cwd: target, encoding: 'utf8' },
    );
    expect(standalone.status).toBe(0);
    put(target, `.agents/${skill}`, 'Consumer drift');
    const drift = spawnSync(process.execPath, ['.ai/sync.mjs', '--check'], {
        cwd: target,
        encoding: 'utf8',
    });
    expect(drift.status).toBe(1);
});

test('installs the real standards bundle with readable references and a working standalone check', () => {
    const manifest = JSON.parse(
        readFileSync('documentation/agent-standards/manifest.json'),
    );
    syncStandards({ target, write: true, version: manifest.version });
    for (const name of manifest.skills) {
        const filename = path.join(target, '.agents/skills', name, 'SKILL.md');
        const contents = readFileSync(filename, 'utf8');
        for (const match of contents.matchAll(/\]\(([^)]+)\)/g)) {
            if (/^https?:|^#/.test(match[1])) continue;
            expect(
                statSync(
                    path.resolve(path.dirname(filename), match[1]),
                ).isFile(),
            ).toBe(true);
        }
    }
    const result = spawnSync(process.execPath, ['.ai/sync.mjs', '--check'], {
        cwd: target,
        encoding: 'utf8',
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('0 pending files');
});
