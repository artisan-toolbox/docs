import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { codeLanguage } from './codeLanguages';
import { highlightCode } from './codeHighlighter';

const examples = [
    ['bash', 'composer require artisan-toolbox/core # Install the package'],
    ['sh', 'export APP_ENV="local"'],
    ['php', '<?php\nfinal class Example { public function name(): string { return "Ada"; } }'],
    ['php', "set('pm2_namespace', 'my-application');"],
    ['js', 'const greeting = "Hello"; console.log(greeting);'],
    ['ts', 'const greeting: string = "Hello";'],
    [
        'vue',
        '<script setup>const greeting = "Hello";</script><template><h1>{{ greeting }}</h1></template>',
    ],
    ['blade', '@if ($ready)\n    <p>{{ $message }}</p>\n@endif'],
    ['html', '<button type="button">Continue</button>'],
    ['css', '.example { color: red; margin: 2rem; }'],
    ['json', '{ "enabled": true, "count": 42 }'],
    ['yaml', 'name: Example\nenabled: true\nsteps:\n  - run: composer install'],
    ['dotenv', 'APP_NAME="Artisan Toolbox"\nAPP_DEBUG=true'],
    ['nginx', 'server { listen 80; server_name example.test; }'],
];

describe('documentation code highlighting', () => {
    it.each(examples)(
        'highlights an authored %s example without changing its source',
        async (language, code) => {
            const tokens = await highlightCode(code, language);

            expect(tokens.map((token) => token.content).join('')).toBe(code);
            expect(tokens.some((token) => token.className !== '')).toBe(true);
            expect(tokens.every((token) => typeof token.className === 'string')).toBe(true);
        },
    );

    it.each(['text', 'plain', 'txt', 'unknown-language', '../../javascript', '__proto__'])(
        'keeps %s readable as plain source',
        async (language) => {
            const code = '<img src=x onerror=alert(1)>\r\n\t\n';

            expect(await highlightCode(code, language)).toEqual([{ content: code, className: '' }]);
            expect(codeLanguage(language)).toMatchObject({
                id: 'text',
                kind: 'plain',
            });
        },
    );

    it.each([
        '',
        '\n\n',
        '\r\n\r\n',
        '\tconst value = "Olá 👋";\r\n\r\n',
        'const value = 1;\rnext();\n',
    ])('preserves whitespace and Unicode in %j', async (code) => {
        const tokens = await highlightCode(code, 'js');

        expect(tokens.map((token) => token.content).join('')).toBe(code);
    });

    it('returns hostile markup as token text', async () => {
        const code = '<script>alert("example")</script><img src=x onerror=alert(1)>';
        const tokens = await highlightCode(code, 'html');

        expect(tokens.map((token) => token.content).join('')).toBe(code);
        expect(tokens.every((token) => !token.className.includes('<'))).toBe(true);
    });

    it('highlights concurrent requests without mixing their source', async () => {
        const source = ['const first = "one";', 'const second = "two";'];
        const results = await Promise.all(source.map((code) => highlightCode(code, 'js')));

        expect(results.map((tokens) => tokens.map((token) => token.content).join(''))).toEqual(
            source,
        );
    });

    it('distinguishes keywords, strings and comments through the grammar', async () => {
        const tokens = await highlightCode('const greeting = "Hello"; // Example', 'js');

        expect(tokens).toEqual(
            expect.arrayContaining([
                { content: 'const', className: 'text-violet-300' },
                { content: '"Hello"', className: 'text-emerald-300' },
                { content: '// Example', className: 'text-slate-400' },
            ]),
        );
    });

    it('classifies shell aliases and source languages for their shared presentation', () => {
        expect(codeLanguage(' BASH ')).toEqual({
            id: 'shellscript',
            label: 'Shell',
            kind: 'terminal',
            icon: 'terminal',
        });
        expect(codeLanguage('ts')).toEqual({
            id: 'typescript',
            label: 'TypeScript',
            kind: 'source',
            icon: 'file-code',
        });
        expect(codeLanguage('yml').id).toBe('yaml');
    });
});

describe('code highlighting recovery', () => {
    afterEach(() => {
        vi.doUnmock('shiki/core');
        vi.resetModules();
    });

    it('allows a later attempt after highlighter initialization fails', async () => {
        vi.resetModules();
        vi.doMock('shiki/core', async (importOriginal) => {
            const original = await importOriginal();

            return {
                ...original,
                createHighlighterCore: vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Initialization failed'))
                    .mockImplementation(original.createHighlighterCore),
            };
        });
        const { highlightCode: highlight } = await import('./codeHighlighter');
        const code = 'const value = "Ready";';

        await expect(highlight(code, 'js')).rejects.toThrow('Initialization failed');
        const tokens = await highlight(code, 'js');

        expect(tokens.map((token) => token.content).join('')).toBe(code);
        expect(tokens.some((token) => token.className !== '')).toBe(true);
    });

    it('allows a later attempt after grammar loading fails', async () => {
        vi.resetModules();
        vi.doMock('shiki/core', async (importOriginal) => {
            const original = await importOriginal();

            return {
                ...original,
                createHighlighterCore: async (options) => {
                    const instance = await original.createHighlighterCore(options);
                    vi.spyOn(instance, 'loadLanguage').mockRejectedValueOnce(
                        new Error('Grammar unavailable'),
                    );

                    return instance;
                },
            };
        });
        const { highlightCode: highlight } = await import('./codeHighlighter');
        const code = 'const value = "Ready";';

        await expect(highlight(code, 'js')).rejects.toThrow('Grammar unavailable');
        const tokens = await highlight(code, 'js');

        expect(tokens.map((token) => token.content).join('')).toBe(code);
        expect(tokens.some((token) => token.className !== '')).toBe(true);
    });
});
