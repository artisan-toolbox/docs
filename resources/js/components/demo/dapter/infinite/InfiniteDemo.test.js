import { http } from '@inertiajs/core';
import { Button, Input } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vite-plus/test';
import InfiniteDemo from './InfiniteDemo.vue';
import wire from './wire.json';
import cases from '../../../../../../app/Demo/Dapter/Infinite/cases.json';
const originalClient = http.getClient();
const request = vi.fn();
const button = (wrapper, label) =>
    wrapper.findAllComponents(Button).find((item) => item.text() === label);
const rows = (wrapper) =>
    wrapper.findAll('[data-infinite-row]').map((row) => row.attributes('data-infinite-row'));
const response = (name, status = 200) => ({
    status,
    data: JSON.stringify(wire[name]),
    headers: {},
});
function queue(...names) {
    for (const name of names) request.mockResolvedValueOnce(response(name));
}
async function settle() {
    await flushPromises();
    await vi.dynamicImportSettled();
    await new Promise((resolve) => setTimeout(resolve, 20));
    await flushPromises();
}
async function start(scenario) {
    const wrapper = mount(InfiniteDemo, { props: { scenario } });
    expect(request).not.toHaveBeenCalled();
    await button(wrapper, 'Start example').trigger('click');
    await settle();
    return wrapper;
}
enableAutoUnmount(afterEach);
beforeEach(() => {
    request.mockReset();
    vi.stubGlobal(
        'IntersectionObserver',
        class {
            observe() {}
            unobserve() {}
            disconnect() {}
        },
    );
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    http.setClient({ request });
    globalThis.Ziggy = {
        url: 'https://atb.test',
        port: null,
        defaults: {},
        routes: {
            'dapter.data': { uri: 'dapter/data/{source}', methods: ['POST'] },
            ...Object.fromEntries(
                ['fail', 'reset'].map((action) => [
                    `demo.dapter.infinite.${action}`,
                    { uri: `demo/dapter/infinite/${action}`, methods: ['POST'] },
                ]),
            ),
        },
    };
});
afterEach(() => {
    vi.unstubAllGlobals();
    http.setClient(originalClient);
    delete globalThis.Ziggy;
});
it.each(cases)(
    'starts $id only on reader consent through the actual public creator',
    async (example) => {
        queue(example.source.split('.').at(-1));
        const wrapper = await start(example.id);
        expect(request).toHaveBeenCalledTimes(1);
        expect(rows(wrapper)).toEqual(
            example.expected.ids?.map(String) ??
                example.expected.tuples.map((tuple) => tuple.join(':')),
        );
        expect(wrapper.get('[data-infinite-status]').text()).toContain('idle');
        await button(wrapper, 'Reset example').trigger('click');
        await settle();
        expect(wrapper.find('[data-infinite-session]').exists()).toBe(false);
        expect(request).toHaveBeenCalledTimes(1);
    },
);
it('appends simple pages losslessly and stops at exhaustion without another read', async () => {
    queue('InfiniteSimple', 'InfiniteSimple2', 'InfiniteSimple3', 'InfiniteSimple4');
    const wrapper = await start('InfiniteSimple');
    for (let index = 0; index < 3; index++) {
        await button(wrapper, 'Load more').trigger('click');
        await settle();
    }
    expect(rows(wrapper)).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    expect(wrapper.get('[data-infinite-status]').text()).toContain('exhausted');
    expect(button(wrapper, 'Load more').props('disabled')).toBe(true);
    expect(request).toHaveBeenCalledTimes(4);
});
it('keeps joined tuples with repeated base IDs through the public component creator', async () => {
    queue('InfiniteJoined', 'InfiniteJoined2', 'InfiniteJoined3');
    const wrapper = await start('InfiniteJoined');
    for (let index = 0; index < 2; index++) {
        await button(wrapper, 'Load more').trigger('click');
        await settle();
    }
    expect(rows(wrapper)).toEqual(['1:11', '1:12', '2:21']);
    expect(wrapper.get('[data-infinite-status]').text()).toContain('exhausted');
    expect(request).toHaveBeenCalledTimes(3);
});
it('follows the actual accepted cursor and shares rows with its bound and acquired views', async () => {
    queue('InfiniteCursor', 'InfiniteCursor2');
    const wrapper = await start('InfiniteCursor');
    await button(wrapper, 'Load more').trigger('click');
    await settle();
    expect(JSON.parse(request.mock.calls.at(-1)[0].data).state.paging.cursor).toBe(
        wire.InfiniteCursor.paging.next_cursor,
    );
    expect(rows(wrapper)).toEqual(['1', '2', '3', '4']);
    expect(wrapper.get('[data-infinite-status]').text()).toContain('4 loaded');
});
it('keeps the accepted window and retries the failed boundary only after an explicit action', async () => {
    queue('InfiniteRecovery');
    request.mockResolvedValueOnce(response('InfiniteRecoveryFailure', 500));
    queue('InfiniteRecovery2');
    const wrapper = await start('InfiniteRecovery');
    await button(wrapper, 'Fail next read').trigger('click');
    await settle();
    expect(request).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
    await button(wrapper, 'Load more').trigger('click');
    await settle();
    expect(rows(wrapper)).toEqual(['1', '2']);
    expect(wrapper.get('[data-infinite-status]').text()).toContain('paused');
    expect(wrapper.get('[data-infinite-error]').text()).not.toBe('');
    expect(button(wrapper, 'Load more').props('disabled')).toBe(true);
    const failed = JSON.parse(request.mock.calls[1][0].data);
    await button(wrapper, 'Allow retry').trigger('click');
    await settle();
    expect(request).toHaveBeenCalledTimes(2);
    await button(wrapper, 'Retry append').trigger('click');
    await settle();
    expect(JSON.parse(request.mock.calls[2][0].data)).toEqual(failed);
    expect(rows(wrapper)).toEqual(['1', '2', '3', '4']);
    expect(wrapper.get('[data-infinite-status]').text()).toContain('idle');
});
it('rejects preserve locally without clearing rows or starting another read', async () => {
    queue('InfiniteSimple', 'InfiniteSimple2');
    const wrapper = await start('InfiniteSimple');
    await button(wrapper, 'Load more').trigger('click');
    await settle();
    await button(wrapper, 'Reject page preservation').trigger('click');
    await settle();
    expect(request).toHaveBeenCalledTimes(2);
    expect(wrapper.get('[data-infinite-local-outcome]').text()).toBe('validation');
    expect(rows(wrapper)).toEqual(['1', '2', '3', '4']);
});
it.each([
    ['InfiniteSimpleSearch', 'search', ['3']],
    ['InfiniteSimpleOrder', 'order', ['7', '6']],
    ['InfiniteSimpleSize', 'size', ['1', '2', '3']],
])(
    'clears the accumulated window on %s through its public control',
    async (fixture, action, expected) => {
        queue('InfiniteSimple', 'InfiniteSimple2', fixture);
        const wrapper = await start('InfiniteSimple');
        await button(wrapper, 'Load more').trigger('click');
        await settle();
        if (action === 'search')
            wrapper.findComponent(Input).vm.$emit('update:modelValue', 'Notebook 03');
        else
            await button(
                wrapper,
                action === 'order' ? 'Name descending' : 'Set page size 3',
            ).trigger('click');
        await settle();
        expect(rows(wrapper)).toEqual(expected);
        const sent = JSON.parse(request.mock.calls.at(-1)[0].data).state;
        expect(sent.paging.current).toBe(1);
        if (action === 'size') expect(sent.paging.per_page).toBe(3);
    },
);
it('refreshes the first page after an append and preserves rows when replacing DOM refs', async () => {
    queue('InfiniteSimple', 'InfiniteSimple2', 'InfiniteSimple');
    const wrapper = await start('InfiniteSimple');
    await button(wrapper, 'Load more').trigger('click');
    await settle();
    const oldRoot = wrapper.get('[data-infinite-root]').element;
    const oldSentinel = wrapper.get('[data-infinite-sentinel]').element;
    await button(wrapper, 'Replace scroll root').trigger('click');
    await settle();
    expect(wrapper.get('[data-infinite-root]').element).not.toBe(oldRoot);
    await button(wrapper, 'Replace sentinel').trigger('click');
    await settle();
    expect(wrapper.get('[data-infinite-sentinel]').element).not.toBe(oldSentinel);
    expect(rows(wrapper)).toEqual(['1', '2', '3', '4']);
    expect(request).toHaveBeenCalledTimes(2);
    await button(wrapper, 'Refresh first page').trigger('click');
    await settle();
    expect(rows(wrapper)).toEqual(['1', '2']);
    expect(JSON.parse(request.mock.calls.at(-1)[0].data).state.paging.current).toBe(1);
});
it('keeps one slow append and discards its eventual response after reset', async () => {
    queue('InfiniteSimple');
    let accept;
    request.mockImplementationOnce(
        () =>
            new Promise((resolve) => {
                accept = resolve;
            }),
    );
    const wrapper = await start('InfiniteSimple');
    const more = button(wrapper, 'Load more');
    await more.trigger('click');
    await settle();
    await more.trigger('click');
    await settle();
    expect(request).toHaveBeenCalledTimes(2);
    expect(wrapper.get('[data-infinite-status]').text()).toContain('loading');
    await button(wrapper, 'Reset example').trigger('click');
    await settle();
    accept(response('InfiniteSimple2'));
    await settle();
    expect(wrapper.find('[data-infinite-session]').exists()).toBe(false);
    expect(rows(wrapper)).toEqual([]);
    expect(request).toHaveBeenCalledTimes(2);
});

it('clears old rows immediately when new criteria supersede a pending append', async () => {
    queue('InfiniteSimple');
    let acceptAppend;
    request.mockImplementationOnce(
        () =>
            new Promise((resolve) => {
                acceptAppend = resolve;
            }),
    );
    queue('InfiniteSimpleSearch');
    const wrapper = await start('InfiniteSimple');
    await button(wrapper, 'Load more').trigger('click');
    await settle();
    expect(rows(wrapper)).toEqual(['1', '2']);
    wrapper.findComponent(Input).vm.$emit('update:modelValue', 'Notebook 03');
    await settle();
    expect(rows(wrapper)).toEqual(['3']);
    acceptAppend(response('InfiniteSimple2'));
    await settle();
    expect(rows(wrapper)).toEqual(['3']);
    expect(request).toHaveBeenCalledTimes(3);
});

it('shows an empty replacement window while a criterion read is unresolved', async () => {
    queue('InfiniteSimple', 'InfiniteSimple2');
    let acceptCriteria;
    request.mockImplementationOnce(
        () =>
            new Promise((resolve) => {
                acceptCriteria = resolve;
            }),
    );
    const wrapper = await start('InfiniteSimple');
    await button(wrapper, 'Load more').trigger('click');
    await settle();
    expect(rows(wrapper)).toEqual(['1', '2', '3', '4']);
    wrapper.findComponent(Input).vm.$emit('update:modelValue', 'Notebook 03');
    await settle();
    expect(rows(wrapper)).toEqual([]);
    acceptCriteria(response('InfiniteSimpleSearch'));
    await settle();
    expect(rows(wrapper)).toEqual(['3']);
});
