import { describe, expect, it } from 'vite-plus/test';
import ts from 'typescript';
import { resolve } from 'node:path';
import { acknowledge, initialState, policy, transition } from './transitions';
import { decodeSaved } from './actions';

const directory = `${resolve('resources/js/pages/docs/dapter/design/reference')}/`;
function compile(sources) {
    const options = {
        strict: true,
        exactOptionalPropertyTypes: true,
        noUncheckedIndexedAccess: true,
        noEmit: true,
        skipLibCheck: true,
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        types: [],
    };
    const host = ts.createCompilerHost(options);
    const original = host.getSourceFile.bind(host);
    host.getSourceFile = (name, version, onError, newFile) =>
        sources.has(name)
            ? ts.createSourceFile(name, sources.get(name), version, true)
            : original(name, version, onError, newFile);
    return ts
        .getPreEmitDiagnostics(
            ts.createProgram(
                [...sources.keys(), resolve('resources/js/types/vue-shims.d.ts')],
                options,
                host,
            ),
        )
        .map((entry) => ({
            file: entry.file?.fileName,
            message: ts.flattenDiagnosticMessageText(entry.messageText, '\n'),
        }));
}
const source = (name, code) => [`${directory}${name}.ts`, code];
const imports = `import type { ProductSlot, ProductDefinition, PlannedSlot } from './operations';
import type { PlannedPaging, PlannedAcceptedPage } from './paging';
import type { PlannedActions } from './actions';
import type { PlannedOrder } from './transitions';
import { transition, initialState, policy } from './transitions';
declare const slot: ProductSlot; declare const paging: PlannedPaging; declare const actions: PlannedActions;`;

describe('planned documentation contracts', () => {
    it('strictly compiles the exact displayed sources and valid narrowed use', () => {
        expect(
            compile(
                new Map([
                    source(
                        'positive-control',
                        `${imports}
transition(initialState, { kind: 'global-filter', id: 'ids', value: [7, 9] }, policy);
if (slot.ready) {
    slot.fields.user_id?.filters?.new_sales?.call({ value: [7, 9] });
    slot.global.filters?.literal?.call({ value: null });
    slot.global.filters?.literal?.call({ value: false });
    slot.global.filters?.literal?.call({ value: 0 });
    slot.global.filters?.literal?.call({ value: '0' });
    slot.data[0]?.receivedAt.getTime();
}
if (paging.mode === 'offset') { const count: number = paging.total; paging.goToPage(2); }
if (paging.mode === 'simple') { const count: null = paging.total; const page: number = paging.current; }
if (paging.mode === 'cursor') { const page: null = paging.current; const jump: null = paging.goToPage; }
actions.visit('edit', { id: 7 }, { onSuccess: (page) => { const url: string = page.url; } });
actions.http('save', { id: 7, name: 'Lin' }, { onSuccess: (result) => { const value: unknown = result; } });
`,
                    ),
                ]),
            ),
        ).toEqual([]);
    });
    it('rejects independent invalid source controls without suppressions or assertions', () => {
        const invalid = [
            ['not-ready', `slot.global.search.call({ value: 'Notebook' });`],
            [
                'filter-entry',
                `if (slot.ready) slot.fields.user_id.filters.new_sales.call({ value: [7] });`,
            ],
            [
                'undeclared-value',
                `if (slot.ready) slot.fields.user_id?.filters?.new_sales?.call({ value: [11] });`,
            ],
            [
                'single-multiple',
                `if (slot.ready) slot.fields.user_id?.filters?.mine?.call({ value: [7] });`,
            ],
            [
                'global-targets',
                `if (slot.ready) slot.global.search?.call({ value: 'Notebook', targets: ['name'] });`,
            ],
            [
                'preset-direction',
                `if (slot.ready) slot.global.order?.call({ id: 'by_price', direction: 'desc' });`,
            ],
            [
                'invented-priority',
                `if (slot.ready) slot.fields.price?.order?.call({ direction: 'asc', sortType: 'numeric', priority: 1 });`,
            ],
            [
                'readonly-projection',
                `if (slot.ready && slot.global.filters?.only_news) slot.global.filters.only_news.current = null;`,
            ],
            ['readonly-row', `if (slot.ready && slot.data[0]) slot.data[0].displayName = 'Other';`],
            [
                'single-order-permission',
                `type Single = Omit<ProductDefinition, 'global'> & { global: Omit<ProductDefinition['global'], 'multi_order'> & { multi_order: false } }; declare const single: PlannedSlot<unknown, Single>; if (single.ready) single.fields.price?.order?.call({ direction: 'asc', sortType: 'numeric', multiSort: true });`,
            ],
            [
                'coupled-paging',
                `declare const cursor: Extract<PlannedAcceptedPage, { paging: { mode: 'cursor' } }>; const page: PlannedAcceptedPage = { requested: { paging: { mode: 'offset', current: 1, per_page: 25 } }, state: cursor.state, paging: cursor.paging };`,
            ],
            ['empty-order', `const order: PlannedOrder = { kind: 'fields', terms: [] };`],
            [
                'mixed-order',
                `const order: PlannedOrder = { kind: 'preset', id: 'by_price', terms: [] };`,
            ],
            [
                'simple-counts',
                `if (paging.mode === 'simple') { const total: number = paging.total; }`,
            ],
            ['cursor-jump', `if (paging.mode === 'cursor') paging.goToPage(2);`],
            [
                'http-page-callback',
                `actions.http('save', { id: 7, name: 'Lin' }, { onSuccess: (page) => { page.url; } });`,
            ],
            [
                'http-history',
                `actions.http('save', { id: 7, name: 'Lin' }, { preserveScroll: true });`,
            ],
        ];
        const sources = new Map(
            invalid.map(([name, code]) => source(`invalid-${name}`, `${imports}\n${code}`)),
        );
        const diagnostics = compile(sources);
        for (const [file] of sources)
            expect(
                diagnostics.filter((entry) => entry.file === file),
                file,
            ).not.toHaveLength(0);
        expect(diagnostics.filter((entry) => !sources.has(entry.file))).toEqual([]);
    });
    it('decodes action acknowledgements explicitly', () => {
        expect(decodeSaved({ saved: true })).toEqual({ saved: true });
        expect(() => decodeSaved({ name: 'Lin' })).toThrow('Expected a saved acknowledgement');
    });
});
const price = { field: 'price', direction: 'asc', sortType: 'numeric' };
const name = { field: 'name', direction: 'asc', sortType: 'natural' };
function changed(state, command, rules = policy, options = {}) {
    const result = transition(state, command, rules, options);
    expect(result.status).toBe('changed');
    expect(result.request).toBe(true);
    return result.state;
}
describe('planned transitions without transport or driver', () => {
    it('patches only addressed state using latest requested input across pending actions', () => {
        const search = changed(initialState, {
            kind: 'field-search',
            field: 'name',
            value: { value: 'Notebook', matchType: 'contains' },
        });
        const filter = changed(search, { kind: 'global-filter', id: 'only_news', value: false });
        const sorted = changed(filter, { kind: 'field-order', term: price });
        expect(sorted).toEqual({
            ...initialState,
            fields: { name: { search: { value: 'Notebook', matchType: 'contains' } } },
            global: { filters: { only_news: { value: false } } },
            order: { kind: 'fields', terms: [price] },
            paging: { mode: 'offset', current: 1, per_page: 25 },
        });
        expect(
            changed(sorted, { kind: 'global-filter', id: 'only_news', value: undefined }),
        ).toEqual({ ...sorted, global: {} });
    });
    it('retains other selections on the same field and removes only a cleared named filter', () => {
        const search = changed(initialState, {
            kind: 'field-search',
            field: 'name',
            value: { value: 'Notebook', matchType: 'contains' },
        });
        const first = changed(search, {
            kind: 'field-filter',
            field: 'name',
            id: 'catalog',
            value: 'Notebook',
        });
        const second = changed(first, {
            kind: 'field-filter',
            field: 'name',
            id: 'other',
            value: false,
        });
        const cleared = changed(second, {
            kind: 'field-filter',
            field: 'name',
            id: 'catalog',
            value: undefined,
        });
        expect(cleared.fields).toEqual({
            name: {
                filters: { other: { value: false } },
                search: { value: 'Notebook', matchType: 'contains' },
            },
        });
        const reordered = changed(cleared, { kind: 'group', value: 'any' });
        expect(reordered).toEqual({ ...cleared, searchMatch: 'any' });
    });
    it('preserves false, null, zero and string zero as distinct selections', () => {
        for (const value of [false, null, 0, '0'])
            expect(
                changed(initialState, { kind: 'global-filter', id: 'literal', value }).global
                    .filters.literal,
            ).toEqual({ value });
    });
    it('preserves only exact ordinary offset position and rejects other hints atomically', () => {
        const command = { kind: 'global-search', value: 'Notebook' };
        expect(changed(initialState, command, policy, { page: 'preserve' }).paging).toEqual(
            initialState.paging,
        );
        for (const [state, rules] of [
            [{ ...initialState, paging: { mode: 'simple', current: 3, per_page: 25 } }, policy],
            [
                { ...initialState, paging: { mode: 'cursor', cursor: 'opaque', per_page: 25 } },
                policy,
            ],
            [initialState, { ...policy, exactCounts: false }],
            [initialState, { ...policy, infinite: true }],
        ]) {
            const result = transition(state, command, rules, { page: 'preserve' });
            expect(result).toMatchObject({
                status: 'rejected',
                state,
                request: false,
                clearWindow: false,
            });
            expect(result.state).toBe(state);
        }
    });
    it('resets criteria and size changes but keeps criteria and size during navigation', () => {
        const cursor = {
            ...initialState,
            paging: { mode: 'cursor', cursor: 'opaque', per_page: 25 },
        };
        expect(
            transition(cursor, { kind: 'global-search', value: 'Notebook' }, policy),
        ).toMatchObject({
            clearWindow: true,
            state: { paging: { mode: 'cursor', cursor: null, per_page: 25 } },
        });
        const sized = changed(
            {
                ...initialState,
                fields: { name: { search: { value: 'Notebook', matchType: 'contains' } } },
            },
            { kind: 'size', value: 10 },
            policy,
            { page: 'preserve' },
        );
        expect(sized.paging).toEqual({ mode: 'offset', current: 1, per_page: 10 });
        expect(
            changed(sized, {
                kind: 'position',
                value: { mode: 'offset', current: 2, per_page: 10 },
            }),
        ).toEqual({ ...sized, paging: { mode: 'offset', current: 2, per_page: 10 } });
        expect(transition(sized, { kind: 'size', value: 11 }, policy)).toMatchObject({
            status: 'rejected',
            state: sized,
            request: false,
        });
    });
    it('keeps identical calls and inactive clears as no-ops without resetting position', () => {
        for (const command of [
            { kind: 'clear-field-order', field: 'name' },
            { kind: 'global-filter', id: 'only_news', value: undefined },
            { kind: 'field-search', field: 'name', value: undefined },
            { kind: 'size', value: 25 },
        ])
            expect(transition(initialState, command, policy)).toEqual({
                status: 'unchanged',
                state: initialState,
                request: false,
                clearWindow: false,
            });
        const state = { ...initialState, global: { search: { value: 'Notebook' } } };
        expect(transition(state, { kind: 'global-search', value: 'Notebook' }, policy).status).toBe(
            'unchanged',
        );
    });
    it('separates multi_order permission from multiSort intent without a second priority', () => {
        const one = changed(initialState, { kind: 'field-order', term: price });
        const two = changed(one, { kind: 'field-order', term: name, multiSort: true });
        expect(two.order).toEqual({ kind: 'fields', terms: [price, name] });
        expect(
            changed(two, {
                kind: 'field-order',
                term: { ...price, direction: 'desc' },
                multiSort: true,
            }).order.terms,
        ).toEqual([{ ...price, direction: 'desc' }, name]);
        expect(
            transition(
                two,
                {
                    kind: 'field-order',
                    term: { field: 'id', direction: 'asc', sortType: 'numeric' },
                    multiSort: true,
                },
                { ...policy, multi_order_limit: 2 },
            ),
        ).toMatchObject({ status: 'rejected', state: two, request: false });
        expect(
            transition(
                one,
                { kind: 'field-order', term: name, multiSort: true },
                { ...policy, multi_order: false },
            ).status,
        ).toBe('rejected');
        expect(changed(two, { kind: 'field-order', term: price }).order).toEqual({
            kind: 'fields',
            terms: [price],
        });
        expect(
            changed(changed(two, { kind: 'clear-field-order', field: 'price' }), {
                kind: 'clear-field-order',
                field: 'name',
            }).order,
        ).toEqual({ kind: 'default' });
    });
    it('clearing an inactive global preset preserves field order and position without a request', () => {
        const state = { ...initialState, order: { kind: 'fields', terms: [price] } };
        expect(transition(state, { kind: 'preset', id: undefined }, policy)).toEqual({
            status: 'unchanged',
            state,
            request: false,
            clearWindow: false,
        });
    });
    it('replaces presets and rejects additive or cursor combinations atomically', () => {
        const preset = changed(initialState, { kind: 'preset', id: 'by_price' });
        expect(
            transition(preset, { kind: 'field-order', term: price, multiSort: true }, policy),
        ).toMatchObject({ status: 'rejected', state: preset, request: false });
        expect(changed(preset, { kind: 'field-order', term: price }).order).toEqual({
            kind: 'fields',
            terms: [price],
        });
        expect(changed(preset, { kind: 'preset', id: undefined }).order).toEqual({
            kind: 'default',
        });
        expect(
            transition(
                { ...initialState, paging: { mode: 'cursor', cursor: null, per_page: 25 } },
                { kind: 'preset', id: 'by_price' },
                policy,
            ).status,
        ).toBe('rejected');
    });
    it('restores a full snapshot once and resets through absent state', () => {
        const restored = {
            ...initialState,
            global: { search: { value: 'Notebook' } },
            paging: { mode: 'offset', current: 7, per_page: 10 },
        };
        expect(changed(initialState, { kind: 'replace', value: restored })).toEqual(restored);
        expect(transition(restored, { kind: 'reset' }, policy)).toEqual({
            status: 'changed',
            state: null,
            request: true,
            clearWindow: true,
        });
        expect(
            transition(
                restored,
                {
                    kind: 'replace',
                    value: { ...restored, order: { kind: 'fields', terms: [price, price] } },
                },
                policy,
            ),
        ).toMatchObject({ status: 'rejected', state: restored, request: false });
    });
    it('ignores stale acknowledgements and adopts winning clamping without another request', () => {
        const canonical = { ...initialState, paging: { ...initialState.paging, current: 2 } };
        expect(acknowledge(3, 2, initialState, canonical)).toEqual({
            state: initialState,
            request: false,
        });
        expect(acknowledge(3, 3, initialState, canonical)).toEqual({
            state: canonical,
            request: false,
        });
    });
});
