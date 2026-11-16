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
            expect(documents.some((document) => document.body.includes('unpublished local'))).toBe(
                true,
            );
        },
    );
});
