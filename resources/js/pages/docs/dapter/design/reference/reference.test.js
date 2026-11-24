import { describe, expect, it } from 'vite-plus/test';
import { acknowledge, initialState, policy, transition } from './transitions';
import { decodeSaved } from './actions';

describe('planned documentation contracts', () => {
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
