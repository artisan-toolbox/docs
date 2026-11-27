import { http } from '@inertiajs/core';
import { Button, Input, Select } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vite-plus/test';
import PagingDemo from './PagingDemo.vue';
import wire from './wire.json';
import cases from '../../../../../../app/Demo/Dapter/Paging/cases.json';
const client = http.getClient();
const request = vi.fn();
const button = (wrapper, label) =>
    wrapper.findAllComponents(Button).find((item) => item.text() === label);
enableAutoUnmount(afterEach);
beforeEach(() => {
    request.mockReset();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    http.setClient({ request });
    globalThis.Ziggy = {
        url: 'https://atb.test',
        port: null,
        defaults: {},
        routes: { 'dapter.data': { uri: 'dapter/data/{source}', methods: ['POST'] } },
    };
});
afterEach(() => {
    vi.unstubAllGlobals();
    http.setClient(client);
    delete globalThis.Ziggy;
});
async function settle() {
    await flushPromises();
    await vi.dynamicImportSettled();
    await new Promise((resolve) => setTimeout(resolve, 20));
    await flushPromises();
}
it.each(cases)(
    'starts $id on reader action and renders the real public response',
    async (example) => {
        request.mockResolvedValue({
            status: 200,
            data: JSON.stringify(wire[example.id]),
            headers: {},
        });
        const wrapper = mount(PagingDemo, { props: { scenario: example.id } });
        expect(request).not.toHaveBeenCalled();
        await button(wrapper, 'Start example').trigger('click');
        await settle();
        expect(request).toHaveBeenCalledTimes(1);
        expect(
            wrapper
                .findAll('[data-paging-row]')
                .map((row) => Number(row.attributes('data-paging-row'))),
        ).toEqual(example.expected.ids);
        expect(wrapper.get('[data-paging-null-actions]').text()).toBe(
            'Numbered action null. Last action null.',
        );
        expect(wrapper.get('[data-paging-status]').text()).toContain(example.expected.mode);
        expect(wrapper.get('[data-paging-status]').text()).toContain(
            example.expected.counts === 'exact'
                ? '7 authorized. 7 matching.'
                : 'Exact counts omitted.',
        );
        await button(wrapper, 'Reset example').trigger('click');
        await settle();
        expect(wrapper.find('[data-paging-session]').exists()).toBe(false);
    },
);
it('rejects preserve locally and uses the actual accepted next token without invented positions', async () => {
    request.mockResolvedValue({
        status: 200,
        data: JSON.stringify(wire.PagingCursor),
        headers: {},
    });
    const wrapper = mount(PagingDemo, { props: { scenario: 'PagingCursor' } });
    await button(wrapper, 'Start example').trigger('click');
    await settle();
    await button(wrapper, 'Reject page preservation').trigger('click');
    await settle();
    expect(request).toHaveBeenCalledTimes(1);
    expect(wrapper.get('[data-local-outcome]').text()).toBe('validation');
    await button(wrapper, 'Reject order preset').trigger('click');
    await settle();
    expect(request).toHaveBeenCalledTimes(1);
    expect(wrapper.get('[data-local-outcome]').text()).toBe('validation');
    await button(wrapper, 'Next').trigger('click');
    await settle();
    expect(JSON.parse(request.mock.calls.at(-1)[0].data).state.paging.cursor).toBe(
        wire.PagingCursor.paging.next_cursor,
    );
});
it('resets cursor position on the public search, mixed order, and size operations', async () => {
    for (const body of [wire.PagingCursor, wire.PagingCursorSearch, wire.PagingCursorSearchSize])
        request.mockResolvedValueOnce({ status: 200, data: JSON.stringify(body), headers: {} });
    const wrapper = mount(PagingDemo, { props: { scenario: 'PagingCursor' } });
    await button(wrapper, 'Start example').trigger('click');
    await settle();
    const search = wrapper.findAllComponents(Input)[0];
    search.vm.$emit('update:modelValue', 'Notebook 03');
    await settle();
    expect(JSON.parse(request.mock.calls.at(-1)[0].data).state.paging.cursor).toBeNull();
    expect(JSON.parse(request.mock.calls.at(-1)[0].data).state.fields.name.search.value).toBe(
        'Notebook 03',
    );
    wrapper.find('[data-paging-session]').findComponent(Select).vm.$emit('update:modelValue', 3);
    await settle();
    expect(JSON.parse(request.mock.calls.at(-1)[0].data).state.paging).toEqual({
        mode: 'cursor',
        cursor: null,
        per_page: 3,
    });
});

it('accepts real cursor next and previous responses through shared and bound public handles', async () => {
    for (const body of [wire.PagingCursor, wire.PagingCursorNext, wire.PagingCursorPrevious])
        request.mockResolvedValueOnce({ status: 200, data: JSON.stringify(body), headers: {} });
    const wrapper = mount(PagingDemo, { props: { scenario: 'PagingCursor' } });
    await button(wrapper, 'Start example').trigger('click');
    await settle();
    await button(wrapper, 'Next').trigger('click');
    await settle();
    expect(
        wrapper
            .findAll('[data-paging-row]')
            .map((row) => Number(row.attributes('data-paging-row'))),
    ).toEqual([3, 4]);
    await button(wrapper, 'Previous').trigger('click');
    await settle();
    expect(
        wrapper
            .findAll('[data-paging-row]')
            .map((row) => Number(row.attributes('data-paging-row'))),
    ).toEqual([1, 2]);
});

it.each([
    ['PagingRecoveryExpired', 409, [1, 2]],
    ['PagingRecoveryInvalid', 422, []],
])(
    'handles %s without automatic restart and reauthorizes on explicit First',
    async (name, status, acceptedIds) => {
        for (const [body, code] of [
            [wire.PagingRecovery, 200],
            [wire[name], status],
            [
                name === 'PagingRecoveryExpired'
                    ? wire.PagingRecoveryExpiredRestart
                    : wire.PagingRecoveryRestart,
                200,
            ],
        ])
            request.mockResolvedValueOnce({
                status: code,
                data: JSON.stringify(body),
                headers: {},
            });
        const wrapper = mount(PagingDemo, { props: { scenario: 'PagingRecovery' } });
        await button(wrapper, 'Start example').trigger('click');
        await settle();
        await button(
            wrapper,
            name === 'PagingRecoveryExpired'
                ? 'Advance demonstration time'
                : 'Change fictional scope',
        ).trigger('click');
        await settle();
        expect(request).toHaveBeenCalledTimes(1);
        await button(wrapper, 'Next').trigger('click');
        await settle();
        expect(request).toHaveBeenCalledTimes(2);
        expect(
            wrapper
                .findAll('[data-paging-row]')
                .map((row) => Number(row.attributes('data-paging-row'))),
        ).toEqual(acceptedIds);
        await button(wrapper, 'Restart pagination').trigger('click');
        await settle();
        expect(request).toHaveBeenCalledTimes(3);
        expect(JSON.parse(request.mock.calls[2][0].data).state.paging.cursor).toBeNull();
        expect(
            wrapper
                .findAll('[data-paging-row]')
                .map((row) => Number(row.attributes('data-paging-row'))),
        ).toEqual(status === 409 ? [1, 2] : [101, 102]);
    },
);
