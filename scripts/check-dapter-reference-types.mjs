import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import ts from 'typescript';

const directory = resolve('resources/js/pages/docs/dapter/design/reference').replaceAll('\\', '/');
const imports = `import type { ProductSlot, ProductDefinition, PlannedSlot } from './operations';
import type { PlannedPaging, PlannedAcceptedPage } from './paging';
import type { PlannedActions } from './actions';
import type { PlannedOrder } from './transitions';
import { transition, initialState, policy } from './transitions';
declare const slot: ProductSlot; declare const paging: PlannedPaging; declare const actions: PlannedActions;`;

const valid = `${imports}
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
if (paging.mode === 'simple') { const page: number = paging.current; if (paging.counts === 'unknown') { const count: null = paging.total; } else { const count: number = paging.total; } }
if (paging.mode === 'cursor') { const page: null = paging.current; const jump: null = paging.goToPage; }
actions.visit('edit', { id: 7 }, { onSuccess: (page) => { const url: string = page.url; } });
actions.http('save', { id: 7, name: 'Lin' }, { onSuccess: (result) => { const value: unknown = result; } });
`;

const invalid = [
    ['not-ready', `slot.global.search.call({ value: 'Notebook' });`],
    ['filter-entry', `if (slot.ready) slot.fields.user_id.filters.new_sales.call({ value: [7] });`],
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
    ['mixed-order', `const order: PlannedOrder = { kind: 'preset', id: 'by_price', terms: [] };`],
    ['simple-counts', `if (paging.mode === 'simple') { const total: number = paging.total; }`],
    ['cursor-jump', `if (paging.mode === 'cursor') paging.goToPage(2);`],
    [
        'http-page-callback',
        `actions.http('save', { id: 7, name: 'Lin' }, { onSuccess: (page) => { page.url; } });`,
    ],
    ['http-history', `actions.http('save', { id: 7, name: 'Lin' }, { preserveScroll: true });`],
];

const invalidSources = new Map(
    invalid.map(([name, code]) => [`${directory}/invalid-${name}.ts`, `${imports}\n${code}`]),
);
const sources = new Map([[`${directory}/positive-control.ts`, valid], ...invalidSources]);

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
const program = ts.createProgram(
    [...sources.keys(), resolve('resources/js/types/vue-shims.d.ts')],
    options,
    host,
);
const diagnostics = ts.getPreEmitDiagnostics(program);
const rejected = new Set();
const unexpected = [];
for (const diagnostic of diagnostics) {
    const file = diagnostic.file?.fileName;
    if (invalidSources.has(file) && diagnostic.start > imports.length) {
        rejected.add(file);
    } else {
        unexpected.push(ts.formatDiagnostic(diagnostic, host));
    }
}
assert.deepEqual(unexpected, [], 'Unexpected TypeScript diagnostics');
for (const file of invalidSources.keys()) {
    assert(rejected.has(file), `Expected TypeScript to reject ${file}`);
}
console.log(
    `Checked the Dapter reference and rejected all ${invalidSources.size} invalid examples.`,
);
