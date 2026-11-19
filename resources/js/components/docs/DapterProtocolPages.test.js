import contract from '@artisan-toolbox/dapter/contracts/read-v1.json';
import { describe, expect, it } from 'vite-plus/test';
import { extractDocumentation } from '../../../../scripts/documentation-search.mjs';

describe('current Dapter protocol references', () => {
    it.each([
        ['Protocol', 'dapter/protocol', 'explicit-state', 'request_json'],
        ['Errors', 'dapter/protocol/errors', 'future-version', 'response'],
    ])(
        'keeps the searchable %s example equal to the executable public corpus',
        (name, slug, id, key) => {
            const documents = extractDocumentation([
                {
                    slug,
                    title: name,
                    description: 'Current read protocol v1.',
                    packageTitle: 'Dapter',
                    sourcePath: `resources/js/pages/docs/dapter/${name}.vue`,
                },
            ]);
            const sample = contract.requests.find((item) => item.id === id)[key];
            const expected = JSON.stringify(
                key === 'request_json' ? JSON.parse(sample) : sample,
                null,
                2,
            ).replace(/\s+/g, ' ');
            expect(documents.some((document) => document.body.includes(expected))).toBe(true);
            expect(documents.find((document) => document.anchor === 'scope')?.body).toContain(
                '1.0.0-beta.2',
            );
        },
    );
});

it('documents the authorized version check for negotiated browser state', () => {
    const documents = extractDocumentation([
        {
            slug: 'dapter/protocol/v2',
            title: 'Version 2 field reads',
            description: 'Current read protocol v2.',
            packageTitle: 'Dapter',
            sourcePath: 'resources/js/pages/docs/dapter/ProtocolV2.vue',
        },
    ]);
    const section = documents.find((document) => document.anchor === 'browser-state-policy');
    expect(section.body).toContain('X-Dapter-Browser-State: 1');
    expect(section.body).toContain('X-Dapter-State-Version');
    expect(section.body).toContain('After authorization and before applying the selection');
    expect(section.body).toContain('returns current defaults and policy');
});
