import contract from '@artisan-toolbox/dapter/contracts/read-v1.json';
import { DataAdapter } from '@artisan-toolbox/dapter';
import { http } from '@inertiajs/core';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import fixtures from './fixtures.json';
import { privateAdmission, publicDescriptor } from './channels';
import { parseRecordPage } from './records';
import { acknowledge, transition } from './transitions';
import {
    matchesLiteralText,
    matchesNumericSearch,
    matchesScalarFilter,
    parseNumericTerm,
    summarizeOffset,
    validateScalarOptions,
} from './query';

const requiredGroups = {
    declarations: 22,
    drivers: 25,
    scalars: 11,
    search: 20,
    transforms: 15,
    transitions: 16,
    records: 3,
    channels: 8,
    runtime: 14,
};
const requiredCases = {
    declarations:
        'declaration-source-only declaration-attribute-only declaration-with-options-once declaration-undeclared-hook declaration-baseline-make declaration-baseline-without-defaults declaration-explicit-patch declaration-inherited-attributes declaration-same-layer-duplicate declaration-invalid-size declaration-invalid-size-list declaration-setter-size-first declaration-setter-options-first declaration-uncalled-default declaration-explicit-default declaration-missing-guard declaration-missing-pagingMode declaration-missing-pageSize declaration-isolation declaration-config-cache declaration-capability-removal declaration-named-duplicate',
    drivers:
        'driver-array-allowed driver-array-forbidden-final-clause driver-array-preset-alone driver-array-cursor-alone driver-array-incompatible-pair driver-collection-allowed driver-collection-forbidden-final-clause driver-collection-preset-alone driver-collection-cursor-alone driver-collection-incompatible-pair driver-sqlite-allowed driver-sqlite-forbidden-final-clause driver-sqlite-preset-alone driver-sqlite-cursor-alone driver-sqlite-incompatible-pair driver-mysql-allowed driver-mysql-forbidden-final-clause driver-mysql-preset-alone driver-mysql-cursor-alone driver-mysql-incompatible-pair driver-pgsql-allowed driver-pgsql-forbidden-final-clause driver-pgsql-preset-alone driver-pgsql-cursor-alone driver-pgsql-incompatible-pair',
    scalars:
        'scalar-string-none scalar-boolean-false scalar-integer-0 scalar-string-0 scalar-empty-clear scalar-empty-reject scalar-strict-options scalar-duplicate-options scalar-null-capability scalar-scoped-filter-ids scalar-merged-field-nodes',
    search: 'numeric-integer-0 numeric-integer-1dot0 numeric-integer-01 numeric-integer-space1 numeric-number-1e2 numeric-number-1e-999 numeric-number-9007199254740992 numeric-invalid-field numeric-invalid-global literal-percent literal-underscore literal-backslash literal-space literal-zero search-match-all search-match-any global-fixed-targets global-browser-target-override counts-filtered-empty counts-filtered-clamp',
    transforms:
        'transform-source-first-value-second transform-source-only-order transform-enum-subset transform-enum-forbidden transform-enum-wrong-type transform-enum-mixed transform-enum-multiple transform-enum-unknown transform-enum-pure-name transform-enum-null transform-enum-duplicate-wire transform-enum-domain-mismatch transform-enum-ambiguous-union transform-enum-array-unbound transform-enum-multiple-invalid',
    transitions:
        'transition-replace-order transition-additive-order transition-order-limit transition-preset-to-fields transition-fields-to-preset transition-preset-additive-rejected transition-inactive-preset-clear transition-inactive-field-clear transition-unchanged-criteria transition-preserve-page transition-replace-snapshot transition-selected-null transition-selected-false transition-selected-zero transition-selected-string-zero transition-server-clamp',
    records: 'resource-no-identity resource-unidentified resource-misaligned',
    channels:
        'channel-private-allowed channel-private-wrong-guard channel-private-source-denied channel-private-no-auth channel-public-explicit channel-public-not-opted-in channel-public-reader-projection channel-public-unsafe-projection',
    runtime:
        'runtime-array-first runtime-array-clamp runtime-array-empty runtime-collection-first runtime-collection-clamp runtime-collection-empty runtime-sqlite-first runtime-sqlite-clamp runtime-sqlite-empty runtime-mysql-unsupported runtime-pgsql-unsupported runtime-sqlite-forbidden-limit runtime-cloaked-denial runtime-missing-source',
};
const reference = {
    'scalar-options': (input) => ({ value: validateScalarOptions(input.domain, input.options) }),
    'scalar-filter': (input) => {
        const matches = input.rows.map((row) => matchesScalarFilter({ ...input, row }));
        if (matches.some((value) => value === null))
            return { error: 'validation', rows: [], total: input.rows.length, filtered: 0 };
        const rows = input.rows.filter((_, index) => matches[index]);
        return { rows, total: input.rows.length, filtered: rows.length };
    },
    'numeric-term': (input) => ({ value: parseNumericTerm(input) }),
    'numeric-search': (input) => ({ value: matchesNumericSearch(input) }),
    'text-search': (input) => ({ value: matchesLiteralText(input) }),
    'offset-summary': (input) => ({ value: summarizeOffset(input) }),
    transition: ({ state, command, policy, options }) => {
        const result = transition(state, command, policy, options);
        if (result.status !== 'rejected') return result;
        const { error, ...rest } = result;
        return { ...rest, errorCode: error.code };
    },
    acknowledge: ({ latest, responseGeneration, requested, canonical }) =>
        acknowledge(latest, responseGeneration, requested, canonical),
    'record-page': (input) => parseRecordPage(input, (row) => row) ?? { value: null },
    'private-channel': (input) => ({ value: privateAdmission(input) }),
    'public-channel': (input) => ({ value: publicDescriptor(input) }),
};

function checkCorpus(corpus) {
    expect(Object.keys(corpus.groups).sort()).toEqual(Object.keys(requiredGroups).sort());
    const ids = new Set();
    for (const [group, size] of Object.entries(requiredGroups)) {
        expect(corpus.groups[group], group).toHaveLength(size);
        for (const fixture of corpus.groups[group]) {
            expect(fixture.id).toMatch(/^[a-z][a-zA-Z0-9-]+$/);
            expect(ids.has(fixture.id), `Duplicate ${fixture.id}`).toBe(false);
            ids.add(fixture.id);
            expect(['current-runtime', 'reference', 'specification']).toContain(fixture.evidence);
            const evidence = reference[fixture.operation]
                ? 'reference'
                : ['declaration', 'isolation', 'config-cache', 'read', 'access'].includes(
                        fixture.operation,
                    )
                  ? 'current-runtime'
                  : [
                          'definition',
                          'driver-plan',
                          'selection',
                          'search-group',
                          'global-search',
                          'transform',
                      ].includes(fixture.operation)
                    ? 'specification'
                    : null;
            expect(fixture.evidence, fixture.id).toBe(evidence);
            expect(fixture.input, fixture.id).toBeTypeOf('object');
            expect(fixture.expected, fixture.id).toBeTypeOf('object');
            const expected = fixture.expected;
            if (
                fixture.evidence === 'specification' &&
                fixture.input.scope &&
                Array.isArray(expected.rows)
            ) {
                const authorized = corpus.rows.filter((row) =>
                    Object.entries(fixture.input.scope).every(([key, value]) => row[key] === value),
                );
                for (const id of expected.rows)
                    expect(
                        authorized.some((row) => row.id === id),
                        fixture.id,
                    ).toBe(true);
                if (Number.isInteger(expected.total))
                    expect(expected.total, fixture.id).toBe(authorized.length);
                if (!fixture.input.paging)
                    expect(expected.filtered, fixture.id).toBe(expected.rows.length);
            }
            if (Number.isInteger(expected.total) && Number.isInteger(expected.filtered)) {
                expect(expected.filtered, fixture.id).toBeGreaterThanOrEqual(0);
                expect(expected.filtered, fixture.id).toBeLessThanOrEqual(expected.total);
                if (Array.isArray(expected.rows))
                    expect(expected.rows.length, fixture.id).toBeLessThanOrEqual(expected.filtered);
            }
        }
    }
    for (const names of Object.values(requiredCases)) {
        for (const name of names.split(' ')) {
            expect(ids.has(name), `Missing ${name}`).toBe(true);
        }
    }
    expect(corpus.drivers.map(({ id }) => id)).toEqual([
        'array',
        'collection',
        'sqlite',
        'mysql',
        'pgsql',
    ]);
    for (const profile of corpus.drivers) {
        expect(profile.observedVersion).toBeNull();
        expect(profile.nativeExecuted).toBe(false);
        for (const suffix of [
            'allowed',
            'forbidden-final-clause',
            'preset-alone',
            'cursor-alone',
            'incompatible-pair',
        ]) {
            const fixture = corpus.groups.drivers.find(
                ({ id }) => id === `driver-${profile.id}-${suffix}`,
            );
            expect(fixture?.input.driver).toBe(profile.id);
            expect(fixture?.evidence).toBe('specification');
            expect(fixture.input.identity).toEqual({ field: 'id', unique: true });
            expect(fixture.input.independentlySupportedPair).toEqual([
                'global-order-preset',
                'cursor',
            ]);
            if (suffix === 'incompatible-pair' || suffix === 'forbidden-final-clause') {
                expect(fixture.expected).toEqual({
                    status: 422,
                    error: { kind: 'unsupported_operation', code: 'unsupported_operation' },
                    data: null,
                    total: null,
                    filtered: null,
                    managedTransforms: 0,
                    driverListingReads: 0,
                    handlerCalls: 0,
                    handlerConstructions: 0,
                    sqlStatements: 0,
                });
                if (suffix === 'incompatible-pair') {
                    expect(fixture.input.order.kind).toBe('preset');
                    expect(fixture.input.paging.mode).toBe('cursor');
                } else {
                    expect(fixture.input.request.fields.status.filters.state.value).toBe('active');
                    expect(fixture.input.capabilities.fields.private_note).toBeNull();
                    expect(fixture.input.capabilities.fields.status.filters.state).toEqual({
                        values: ['active', 'pending'],
                        multiple: false,
                    });
                }
            } else {
                expect(fixture.expected.plan).toBe('accepted');
                expect(fixture.expected.error).toBeUndefined();
            }
        }
    }
}

describe('supplementary shared fixture integrity, separate from behavior evidence', () => {
    it('requires each finite group, category, driver cell and coherent expected counts', () => {
        checkCorpus(fixtures);
        expect(fixtures.drivers.map(({ targetVersion }) => targetVersion)).toEqual([
            null,
            null,
            '3.45.2',
            '8.4.11',
            '18.6',
        ]);
    });
    it.each([
        [
            'renamed required case',
            (copy) => {
                copy.groups.search.find(({ id }) => id === 'literal-percent').id =
                    'replacement-percent';
            },
        ],
        [
            'unknown shared row',
            (copy) => {
                copy.groups.drivers[0].expected.rows[0] = 999;
            },
        ],
        [
            'row outside scope',
            (copy) => {
                copy.groups.drivers[0].expected.rows[0] = 4;
            },
        ],
        [
            'incorrect authorized base',
            (copy) => {
                copy.groups.drivers[0].expected.total = 999;
            },
        ],
        [
            'missing group',
            (copy) => {
                delete copy.groups.records;
            },
        ],
        [
            'missing case',
            (copy) => {
                copy.groups.declarations.pop();
            },
        ],
        [
            'duplicate id',
            (copy) => {
                copy.groups.records[1].id = copy.groups.records[0].id;
            },
        ],
        [
            'inconsistent count',
            (copy) => {
                copy.groups.runtime[0].expected.filtered = 1;
            },
        ],
        [
            'accepted incompatible plan',
            (copy) => {
                copy.groups.drivers[4].expected = { plan: 'accepted' };
            },
        ],
        [
            'incorrect forbidden-clause error',
            (copy) => {
                copy.groups.drivers[1].expected.error = 'validation';
            },
        ],
    ])('rejects negative control %s', (_, mutate) => {
        const copy = structuredClone(fixtures);
        mutate(copy);
        expect(() => checkCorpus(copy)).toThrow();
    });
    it('keeps specifications distinct from executable reference and runtime evidence', () => {
        for (const fixture of Object.values(fixtures.groups).flat()) {
            if (fixture.evidence === 'reference')
                expect(reference[fixture.operation]).toBeTypeOf('function');
            if (fixture.operation === 'transform' || fixture.operation === 'driver-plan')
                expect(fixture.evidence).toBe('specification');
            if (fixture.operation === 'read' || fixture.operation === 'declaration')
                expect(fixture.evidence).toBe('current-runtime');
        }
    });
});

describe('executable proposed references, after operand validation and without an operation engine', () => {
    it.each(
        Object.values(fixtures.groups)
            .flat()
            .filter(({ evidence }) => evidence === 'reference'),
    )('$id', ({ operation, input, expected }) => {
        expect(reference[operation](input)).toEqual(expected);
    });
});

describe('unchanged public v1 corpus through the installed public DataAdapter', () => {
    it.each([
        ...contract.successes.map((entry) => ({ ...entry, kind: 'success' })),
        ...contract.failures.map((entry) => ({ ...entry, kind: 'failure' })),
        ...contract.invalid_successes.map((entry) => ({ ...entry, kind: 'invalid-success' })),
        ...contract.invalid_failures.map((entry) => ({ ...entry, kind: 'invalid-failure' })),
    ])('$kind $id', async ({ response, kind, status }) => {
        const client = http.getClient();
        const ziggy = globalThis.Ziggy;
        let accepted;
        const reply = { status: status ?? 200, data: JSON.stringify(response), headers: {} };
        http.setClient({ request: () => Promise.resolve(reply) });
        globalThis.Ziggy = {
            url: 'https://fixtures.example.test',
            port: null,
            defaults: {},
            routes: { 'dapter.data': { uri: 'dapter/data/{source}', methods: ['POST'] } },
        };
        const wrapper = mount(DataAdapter, {
            props: { source: 'Fixtures' },
            slots: {
                default: (slot) => {
                    accepted = slot;
                    return [];
                },
            },
        });
        try {
            await flushPromises();
            if (kind === 'success') {
                expect(accepted.ready).toBe(true);
                expect(accepted.data).toEqual(response.data);
                expect(accepted.requested).toEqual(response.requested);
                expect(accepted.paging.total).toBe(response.paging.total);
            } else {
                expect(accepted.ready).toBe(false);
                expect(accepted.error.kind).toBe(
                    kind === 'failure' ? response.error.kind : 'protocol',
                );
                expect(accepted.data).toEqual([]);
                expect(accepted.accepted).toBeNull();
            }
        } finally {
            wrapper.unmount();
            http.setClient(client);
            globalThis.Ziggy = ziggy;
        }
    });
});
