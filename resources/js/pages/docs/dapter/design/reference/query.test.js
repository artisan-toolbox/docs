import { describe, expect, it } from 'vite-plus/test';
import {
    matchesLiteralText,
    matchesNumericSearch,
    matchesScalarFilter,
    parseNumericTerm,
    summarizeOffset,
    validateScalarOptions,
} from './query';

const string = { kind: 'string', nulls: 'allow' };
const integer = { kind: 'integer', nulls: 'allow' };
const number = { kind: 'number', nulls: 'reject' };
const boolean = { kind: 'boolean', nulls: 'allow' };

describe('proposed query scalar contracts without a runtime query engine', () => {
    it('keeps false, numeric zero, string zero and null in their declared domains', () => {
        for (const [domain, value, other] of [
            [boolean, false, true],
            [integer, 0, 1],
            [string, '0', '1'],
            [string, null, '0'],
        ]) {
            const input = { domain, options: [value, other], selection: [value], empty: 'clear' };
            expect(matchesScalarFilter({ ...input, row: value })).toBe(true);
            expect(matchesScalarFilter({ ...input, row: other })).toBe(false);
        }
        expect(validateScalarOptions(integer, [0, '0'])).toBeNull();
        expect(validateScalarOptions(integer, [0, false])).toBeNull();
        expect(validateScalarOptions(boolean, [false, 0])).toBeNull();
        expect(validateScalarOptions({ ...integer, nulls: 'reject' }, [null])).toBeNull();
        expect(validateScalarOptions(string, [null])).toEqual([null]);
    });

    it('canonicalizes JSON numeric equality and rejects duplicate or unsafe options', () => {
        expect(validateScalarOptions(integer, [-0, 1.0])).toEqual([0, 1]);
        expect(Object.is(validateScalarOptions(integer, [-0])[0], -0)).toBe(false);
        expect(validateScalarOptions(number, [-0, 1.5])).toEqual([0, 1.5]);
        for (const options of [
            [0, 0.0],
            [-0, 0],
            [1, 1.0],
            [null, null],
        ]) {
            expect(validateScalarOptions(integer, options)).toBeNull();
        }
        for (const value of [NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1]) {
            expect(validateScalarOptions(number, [value])).toBeNull();
            expect(validateScalarOptions(integer, [value])).toBeNull();
        }
        expect(validateScalarOptions(integer, [1.5])).toBeNull();
        expect(
            validateScalarOptions(number, [Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER]),
        ).toEqual([Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER]);
        expect(validateScalarOptions(string, ['\ud800'])).toBeNull();
    });

    it('uses typed membership and distinguishes bad declarations and rows from bad requests', () => {
        const input = { domain: integer, options: [0, 1, null], empty: 'clear' };
        expect(matchesScalarFilter({ ...input, row: 1, selection: [0, 1] })).toBe(true);
        expect(matchesScalarFilter({ ...input, row: 0, selection: [null] })).toBe(false);
        expect(matchesScalarFilter({ ...input, row: null, selection: [null] })).toBe(true);
        for (const selection of [['0'], [false], [2], [0, -0], undefined, {}]) {
            expect(matchesScalarFilter({ ...input, row: 0, selection })).toBeNull();
        }
        expect(() => matchesScalarFilter({ ...input, row: '0', selection: [0] })).toThrow(
            TypeError,
        );
        expect(() =>
            matchesScalarFilter({ ...input, row: 0, options: [false], selection: [0] }),
        ).toThrow(TypeError);
        expect(matchesScalarFilter({ ...input, row: 0, selection: [] })).toBe(true);
        expect(
            matchesScalarFilter({ ...input, row: 0, selection: [], empty: 'reject' }),
        ).toBeNull();
    });

    it('treats only the empty string as a cleared search and retains literal metacharacters', () => {
        for (const term of ['%', '_', '\\', '0', ' ']) {
            expect(matchesLiteralText({ row: `a${term}b`, term, matchType: 'contains' })).toBe(
                true,
            );
            expect(matchesLiteralText({ row: 'abc', term, matchType: 'contains' })).toBe(false);
        }
        expect(matchesLiteralText({ row: null, term: '', matchType: 'equals' })).toBe(true);
        expect(matchesLiteralText({ row: null, term: '0', matchType: 'contains' })).toBe(false);
        expect(
            matchesLiteralText({ row: ' Notebook ', term: ' Notebook ', matchType: 'equals' }),
        ).toBe(true);
        expect(matchesLiteralText({ row: '%Notebook', term: '%', matchType: 'starts_with' })).toBe(
            true,
        );
        expect(matchesLiteralText({ row: 'Notebook_', term: '_', matchType: 'ends_with' })).toBe(
            true,
        );
        expect(matchesLiteralText({ row: 'Notebook', term: 'Note', matchType: 'equals' })).toBe(
            false,
        );
    });

    it('matches raw Unicode literally without case folding, accent folding or normalization', () => {
        for (const [row, term] of [
            ['Notebook', 'notebook'],
            ['café', 'cafe'],
            ['é', 'e\u0301'],
        ]) {
            expect(matchesLiteralText({ row, term, matchType: 'equals' })).toBe(false);
        }
        expect(matchesLiteralText({ row: '😀 café', term: '😀', matchType: 'starts_with' })).toBe(
            true,
        );
        expect(matchesLiteralText({ row: 'café', term: 'é', matchType: 'ends_with' })).toBe(true);
        expect(() =>
            matchesLiteralText({ row: false, term: 'false', matchType: 'equals' }),
        ).toThrow(TypeError);
        expect(() => matchesLiteralText({ row: '\ud800', term: '', matchType: 'equals' })).toThrow(
            TypeError,
        );
    });
});

describe('proposed full-term numeric search', () => {
    it('accepts full JSON numbers and only plain integer tokens for integer targets', () => {
        for (const [term, expected] of [
            ['0', 0],
            ['-0', 0],
            ['-12', -12],
            ['9007199254740991', Number.MAX_SAFE_INTEGER],
        ]) {
            expect(parseNumericTerm({ term, kind: 'integer' })).toBe(expected);
        }
        for (const [term, expected] of [
            ['1.0', 1],
            ['1e2', 100],
            ['-1.25e-2', -0.0125],
            ['0.5', 0.5],
        ]) {
            expect(parseNumericTerm({ term, kind: 'number' })).toBe(expected);
            expect(parseNumericTerm({ term, kind: 'integer' })).toBeNull();
        }
        for (const term of [
            '',
            ' ',
            ' 1',
            '1\n',
            '+1',
            '01',
            '.5',
            '1.',
            '1x',
            '0x10',
            'Infinity',
            'NaN',
            '1e309',
            '1e-999',
            '9007199254740992',
        ]) {
            expect(parseNumericTerm({ term, kind: 'number' }), term).toBeNull();
            expect(parseNumericTerm({ term, kind: 'integer' }), term).toBeNull();
        }
        expect(parseNumericTerm({ term: '0e-999', kind: 'number' })).toBe(0);
        expect(parseNumericTerm({ term: '9007199254740991.1', kind: 'integer' })).toBeNull();
    });

    it('rejects an invalid field term while a global numeric target contributes false', () => {
        const input = { domain: integer, row: 0, term: 'Notebook' };
        expect(matchesNumericSearch({ ...input, scope: 'field' })).toEqual({
            kind: 'validation-error',
        });
        expect(matchesNumericSearch({ ...input, scope: 'global' })).toEqual({
            kind: 'match',
            matches: false,
        });
        expect(matchesNumericSearch({ ...input, term: '0', scope: 'field' })).toEqual({
            kind: 'match',
            matches: true,
        });
        expect(matchesNumericSearch({ ...input, row: null, term: '0', scope: 'field' })).toEqual({
            kind: 'match',
            matches: false,
        });
        expect(matchesNumericSearch({ ...input, term: '', scope: 'field' })).toEqual({
            kind: 'match',
            matches: true,
        });
        expect(() => matchesNumericSearch({ ...input, row: '0', scope: 'global' })).toThrow(
            TypeError,
        );
    });
});

describe('proposed exact offset counts', () => {
    it('counts the authorized base separately from selected and zero-match subsets', () => {
        const rows = [
            { id: 1, studio: 'north', status: 'active', name: 'Notebook' },
            { id: 2, studio: 'north', status: 'pending', name: 'Pencil' },
            { id: 3, studio: 'north', status: 'active', name: 'Sketchbook' },
            { id: 4, studio: 'north', status: 'pending', name: 'Ruler' },
            { id: 5, studio: 'south', status: 'active', name: 'Notebook' },
        ];
        const base = rows.filter((row) => row.studio === 'north');
        const selected = base.filter((row) =>
            matchesScalarFilter({
                domain: string,
                options: ['active', 'pending'],
                selection: ['active'],
                empty: 'clear',
                row: row.status,
            }),
        );
        expect(selected.map((row) => row.id)).toEqual([1, 3]);
        expect(
            summarizeOffset({
                total: base.length,
                filtered: selected.length,
                current: 9,
                per_page: 1,
            }),
        ).toMatchObject({ total: 4, filtered: 2, current: 2, pages: 2 });
        const searched = selected.filter((row) =>
            matchesLiteralText({ row: row.name, term: 'missing', matchType: 'contains' }),
        );
        expect(
            summarizeOffset({
                total: base.length,
                filtered: searched.length,
                current: 9,
                per_page: 1,
            }),
        ).toMatchObject({
            total: 4,
            filtered: 0,
            current: 1,
            pages: 1,
            has_previous: false,
            has_next: false,
        });
    });

    it('preserves authorized total when filtering finds no records and clamps only the page', () => {
        const counts = summarizeOffset({ total: 100, filtered: 0, current: 9, per_page: 10 });
        expect(counts).toEqual({
            mode: 'offset',
            total: 100,
            filtered: 0,
            current: 1,
            pages: 1,
            per_page: 10,
            has_previous: false,
            has_next: false,
        });
        expect(summarizeOffset({ total: 0, filtered: 0, current: 2, per_page: 10 })).toEqual({
            ...counts,
            total: 0,
        });
    });

    it('calculates pages from filtered count and keeps counts independent of page position', () => {
        const input = { total: 100, filtered: 21, current: 99, per_page: 10 };
        expect(summarizeOffset(input)).toEqual({
            mode: 'offset',
            total: 100,
            filtered: 21,
            current: 3,
            pages: 3,
            per_page: 10,
            has_previous: true,
            has_next: false,
        });
        expect(input.current).toBe(99);
        expect(summarizeOffset({ ...input, current: 2 })).toMatchObject({
            current: 2,
            has_previous: true,
            has_next: true,
        });
        expect(summarizeOffset({ ...input, filtered: 20, current: 1 })).toMatchObject({
            pages: 2,
            has_previous: false,
            has_next: true,
        });
        expect(
            summarizeOffset({
                total: Number.MAX_SAFE_INTEGER,
                filtered: Number.MAX_SAFE_INTEGER,
                current: 1,
                per_page: 1,
            }).pages,
        ).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('rejects inexact counts, impossible subsets and unsafe paging values', () => {
        const input = { total: 100, filtered: 20, current: 1, per_page: 10 };
        for (const patch of [
            { total: -1 },
            { total: 1.5 },
            { filtered: 101 },
            { filtered: -1 },
            { filtered: NaN },
            { total: Infinity },
            { total: Number.MAX_SAFE_INTEGER + 1 },
            { current: 0 },
            { current: 1.5 },
            { per_page: 0 },
            { per_page: Number.MAX_SAFE_INTEGER + 1 },
        ]) {
            expect(() => summarizeOffset({ ...input, ...patch })).toThrow(RangeError);
        }
    });
});
