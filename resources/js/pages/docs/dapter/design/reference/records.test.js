import { describe, expect, it } from 'vite-plus/test';
import {
    compareRecordVersions,
    compareRevisions,
    isResponseMetadata,
    isRowId,
    isSafeChannel,
    parseRecordPage,
    parseRevision,
    projectedPage,
} from './records';

const channel = { type: 'private', name: 'dapter.web.products.opaque', event: '.dapter.updated' };
const sparseRows = [];
sparseRows.length = 1;
const identified = (rows) => ({ records: { mode: 'identified', rows }, channel: null });
const revisioned = (rows) => ({
    records: { mode: 'revisioned', format: 'uint64-decimal', rows },
    channel,
});
const decodeName = (value) => {
    if (typeof value !== 'object' || value === null || typeof value.name !== 'string') {
        throw new Error('Expected a projected name');
    }
    return { displayName: value.name };
};

describe('planned record metadata boundary without SQL or Echo', () => {
    it('keeps projected data and typed identity independent and passes only data to the decoder', () => {
        const seen = [];
        const accepted = parseRecordPage(projectedPage, (row) => {
            seen.push(row);
            return decodeName(row);
        });
        expect(seen).toEqual([{ name: 'Notebook' }, { name: 'Pencil' }]);
        expect(accepted.data).toEqual([{ displayName: 'Notebook' }, { displayName: 'Pencil' }]);
        expect(accepted.metadata.records.rows).toEqual([{ id: 1 }, { id: '1' }]);
        expect(accepted.metadata).not.toBe(projectedPage.metadata);
        expect(accepted.metadata.records.rows).not.toBe(projectedPage.metadata.records.rows);
    });

    it('detaches accepted metadata before a custom decoder runs', () => {
        const page = structuredClone(projectedPage);
        const accepted = parseRecordPage(page, (row) => {
            page.metadata.records.rows[0].id = 'changed';
            return decodeName(row);
        });
        expect(accepted.metadata.records.rows).toEqual([{ id: 1 }, { id: '1' }]);
    });

    it('accepts a complete aligned page when a decoder truncates the original data array', () => {
        const page = structuredClone(projectedPage);
        const accepted = parseRecordPage(page, (row) => {
            page.data.length = 1;
            return decodeName(row);
        });
        expect(accepted).toEqual({
            data: [{ displayName: 'Notebook' }, { displayName: 'Pencil' }],
            metadata: identified([{ id: 1 }, { id: '1' }]),
        });
        expect(isResponseMetadata(accepted.metadata, accepted.data)).toBe(true);
    });

    it('retains scalar unidentified rows and each explicit mode on an empty page', () => {
        const metadata = { records: { mode: 'unidentified' }, channel: null };
        expect(parseRecordPage({ data: [null, false, 0, '0'], metadata }, (row) => row)).toEqual({
            data: [null, false, 0, '0'],
            metadata,
        });
        for (const value of [metadata, identified([]), revisioned([])]) {
            expect(parseRecordPage({ data: [], metadata: value }, decodeName)).toEqual({
                data: [],
                metadata: value,
            });
        }
    });

    it('accepts safe integer and valid nonempty Unicode identities without string coercion', () => {
        for (const id of [0, -0, -1, Number.MAX_SAFE_INTEGER, '0', 'é', '😀', '\n']) {
            expect(isRowId(id), String(id)).toBe(true);
        }
        for (const id of [
            null,
            false,
            {},
            [],
            1.5,
            Infinity,
            NaN,
            Number.MAX_SAFE_INTEGER + 1,
            '',
            '\ud800',
        ]) {
            expect(isRowId(id)).toBe(false);
            expect(isResponseMetadata(identified([{ id }]), [{}])).toBe(false);
        }
        expect(isResponseMetadata(identified([{ id: 1 }, { id: '1' }]), [{}, {}])).toBe(true);
        expect(isResponseMetadata(identified([{ id: 0 }, { id: -0 }]), [{}, {}])).toBe(false);
    });

    it('rejects missing, unknown, extra, sparse and misaligned metadata before decoding any row', () => {
        const invalid = [
            undefined,
            null,
            [],
            {},
            { records: { mode: 'unidentified' } },
            { records: { mode: 'anonymous' }, channel: null },
            { records: { mode: 'unidentified', rows: [] }, channel: null },
            { records: { mode: 'unidentified' }, channel },
            { ...identified([{ id: 1 }]), extra: true },
            {
                records: { mode: 'identified', rows: [{ id: 1 }], format: 'uint64-decimal' },
                channel: null,
            },
            identified([]),
            identified([{ id: 1 }, { id: 2 }]),
            identified([{}]),
            identified([{ id: 1, private: 'hidden' }]),
            identified(sparseRows),
            revisioned([{ id: 1 }]),
            {
                records: { mode: 'revisioned', format: 'number', rows: [{ id: 1, revision: '1' }] },
                channel,
            },
            revisioned([{ id: 1, revision: '01' }]),
        ];
        let calls = 0;
        for (const metadata of invalid) {
            expect(
                parseRecordPage({ data: [{ name: 'Notebook' }], metadata }, () => calls++),
            ).toBeNull();
        }
        expect(calls).toBe(0);
        for (const value of [
            { data: [], metadata: identified([]), extra: true },
            { metadata: identified([]) },
            { data: sparseRows, metadata: identified([{ id: 1 }]) },
        ])
            expect(parseRecordPage(value, decodeName)).toBeNull();
        const duplicate = { data: [{}, {}], metadata: identified([{ id: 'x' }, { id: 'x' }]) };
        expect(parseRecordPage(duplicate, decodeName)).toBeNull();
    });

    it('rejects the complete page when any projected row decoder fails', () => {
        let accepted = parseRecordPage(projectedPage, decodeName);
        const previous = accepted;
        const next = parseRecordPage(
            {
                data: [{ name: 'Updated' }, { wrong: true }],
                metadata: identified([{ id: 1 }, { id: 2 }]),
            },
            decodeName,
        );
        if (next !== null) accepted = next;
        expect(next).toBeNull();
        expect(accepted).toBe(previous);
    });

    it('allows only safe materialized channel descriptors and requires identities for channels', () => {
        expect(isSafeChannel(channel)).toBe(true);
        expect(isSafeChannel({ ...channel, type: 'public' })).toBe(true);
        expect(isResponseMetadata({ ...identified([{ id: 1 }]), channel }, [{}])).toBe(true);
        for (const name of [
            '',
            '.x',
            'x.',
            'x..y',
            'a/b',
            'a:b',
            'x\n',
            'private-x',
            'presence-x',
            '{context}',
            'x'.repeat(129),
        ]) {
            expect(isSafeChannel({ ...channel, name }), name).toBe(false);
        }
        for (const value of [
            { ...channel, event: 'dapter.updated' },
            { ...channel, type: 'presence' },
            { ...channel, authorize: 'view' },
            { type: 'private', name: 'x' },
        ])
            expect(isSafeChannel(value)).toBe(false);
    });
});

describe('planned canonical uint64 revisions', () => {
    it('validates the full unsigned range without a JavaScript number conversion', () => {
        for (const value of ['0', '9', '10', '9007199254740993', '18446744073709551615']) {
            expect(parseRevision(value)).toBe(value);
        }
        for (const value of [
            0,
            null,
            '',
            '00',
            '09',
            '-1',
            '+1',
            '1.0',
            '1e3',
            ' 1',
            '1\n',
            '18446744073709551616',
            '9'.repeat(21),
        ]) {
            expect(parseRevision(value)).toBeNull();
        }
        expect(compareRevisions(parseRevision('10'), parseRevision('9'))).toBe(1);
        expect(
            compareRevisions(parseRevision('9007199254740993'), parseRevision('9007199254740992')),
        ).toBe(1);
        expect(
            compareRevisions(
                parseRevision('18446744073709551615'),
                parseRevision('18446744073709551614'),
            ),
        ).toBe(1);
    });

    it('compares versions only within the same context and strictly typed identity', () => {
        const current = { context: 'scope-a', id: 1, revision: '10' };
        expect(compareRecordVersions({ ...current, revision: '9' }, current)).toBe('stale');
        expect(compareRecordVersions(current, current)).toBe('duplicate');
        expect(compareRecordVersions({ ...current, revision: '11' }, current)).toBe('newer');
        expect(
            compareRecordVersions({ ...current, context: 'scope-b', revision: '11' }, current),
        ).toBe('other-context');
        expect(compareRecordVersions({ ...current, id: '1', revision: '11' }, current)).toBe(
            'other-record',
        );
        expect(compareRecordVersions({ ...current, revision: '01' }, current)).toBe('invalid');
        expect(compareRecordVersions({ ...current, id: null }, current)).toBe('invalid');
    });
});
