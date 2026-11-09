import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import { parse } from 'vue/compiler-sfc';

function vueFiles(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = resolve(directory, entry.name);
        return entry.isDirectory() ? vueFiles(path) : entry.name.endsWith('.vue') ? [path] : [];
    });
}

function authoredRegistryInstall(source) {
    const composer =
        /composer\s+require\s+(?:--[\w-]+\s+)*["']?[a-z0-9][a-z0-9_-]*\/[a-z0-9][a-z0-9_-]*/gu;
    const npm =
        /npm\s+install\s+(?:--[\w-]+\s+)*(?:@[a-z0-9_-]+\/)?[a-z0-9][a-z0-9_-]*(?:@[^\s`"'<>]+)?/gu;
    return [...source.matchAll(composer), ...source.matchAll(npm)].map((match) => match[0]);
}

function instructionsInVue(source) {
    const { descriptor } = parse(source);
    const content = [descriptor.script?.content ?? '', descriptor.scriptSetup?.content ?? ''];
    function visit(node) {
        if (node.type === 1 && node.tag === 'code')
            content.push(
                node.children
                    .filter((child) => child.type === 2)
                    .map((child) => child.content)
                    .join(''),
            );
        for (const prop of node.props ?? []) {
            if (prop.type === 6 && prop.name === 'code') content.push(prop.value?.content ?? '');
        }
        for (const child of node.children ?? []) visit(child);
    }
    if (descriptor.template?.ast) visit(descriptor.template.ast);
    return content.flatMap(authoredRegistryInstall);
}

describe('Installation instruction ownership', () => {
    it('keeps named dependency installs in the lock-backed catalog rather than authored Vue snippets', () => {
        const violations = vueFiles(resolve('resources/js')).flatMap((path) =>
            instructionsInVue(readFileSync(path, 'utf8')).map((command) => `${path}: ${command}`),
        );
        expect(
            violations,
            'Use InstallCommand and the lock-backed InstallationCommands catalog for named registry dependencies.',
        ).toEqual([]);
    });

    it('detects stale Composer and npm instructions while allowing generic selection and vendor file distribution', () => {
        expect(
            authoredRegistryInstall('composer require --dev artisan-toolbox/maintainer:^1.10'),
        ).toEqual(['composer require --dev artisan-toolbox/maintainer']);
        expect(authoredRegistryInstall('composer require "tightenco/ziggy:^2.0"')).toEqual([
            'composer require "tightenco/ziggy',
        ]);
        expect(
            authoredRegistryInstall('npm install --save-dev @laravel/echo-vue@2.6.3 laravel-echo'),
        ).toEqual(['npm install --save-dev @laravel/echo-vue@2.6.3']);
        expect(
            instructionsInVue(
                '<template><p>Composer and npm install the dependencies.</p><code>npm install</code> again.</template>',
            ),
        ).toEqual([]);
        expect(
            authoredRegistryInstall(
                'composer require artisan-toolbox/<package>\nnpm install --install-links ./vendor/artisan-toolbox/mosaicast\nnpm install ./vendor/artisan-toolbox/qztray',
            ),
        ).toEqual([]);
    });
});
