import { http } from '@inertiajs/core';
import { Button, Input } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import VueControlsDemo from './VueControlsDemo.vue';
import VueDefinitionDemo from './VueDefinitionDemo.vue';
import initial from './response.json';

const originalClient = http.getClient();
const request = vi.fn();
const button = (wrapper, label) =>
    wrapper.findAllComponents(Button).find((item) => item.text() === label);
const payload = (index = request.mock.calls.length - 1) =>
    JSON.parse(request.mock.calls[index][0].data);
const response = (data) => ({ status: 200, data: JSON.stringify(data), headers: {} });
function acceptRequested(configuration) {
    const body = JSON.parse(configuration.data);
    const value = structuredClone(initial);
    if (body.state) {
        value.requested = body.state;
        value.state.paging = body.state.paging;
        value.paging = { ...value.paging, ...body.state.paging };
        if (body.state.paging.per_page === 4) {
            value.paging.filtered = 2;
            value.paging.pages = 1;
            value.paging.has_next = false;
        }
        value.paging.has_previous = value.paging.current > 1;
        value.paging.has_next = value.paging.current < value.paging.pages;
        value.state.order =
            body.state.order.kind === 'fields'
                ? { kind: 'terms', terms: body.state.order.terms }
                : { kind: 'source' };
    }
    return Promise.resolve(response(value));
}
enableAutoUnmount(afterEach);
beforeEach(() => {
    request.mockReset().mockImplementation(acceptRequested);
    http.setClient({ request });
    globalThis.Ziggy = {
        url: 'https://docs.example.test',
        port: null,
        defaults: {},
        routes: { 'dapter.data': { uri: 'dapter/data/{source}', methods: ['POST'] } },
    };
});
afterEach(() => {
    http.setClient(originalClient);
    delete globalThis.Ziggy;
});
async function settle() {
    await flushPromises();
    await vi.dynamicImportSettled();
    await flushPromises();
}

describe('Dapter Vue public consumer demos', () => {
    it('starts one protocol 2 owner only on action and shares its accepted rows with table and grid', async () => {
        const wrapper = mount(VueControlsDemo);
        expect(request).not.toHaveBeenCalled();
        await button(wrapper, 'Start controls').trigger('click');
        await settle();
        expect(request).toHaveBeenCalledTimes(1);
        expect(payload()).toEqual({ version: 2 });
        expect(
            wrapper
                .findAll('[data-vue-rows="table"] [data-row-id]')
                .map((row) => row.attributes('data-row-id')),
        ).toEqual(['1', '2']);
        expect(
            wrapper
                .findAll('[data-vue-rows="grid"] [data-row-id]')
                .map((row) => row.attributes('data-row-id')),
        ).toEqual(['1', '2']);
        expect(wrapper.text()).toContain('Available matches contains.');
        await button(wrapper, 'Reset controls').trigger('click');
        expect(wrapper.find('[data-vue-session]').exists()).toBe(false);
    });

    it('flushes debounced intent into sort and preserves independent false zero and null filter values', async () => {
        const wrapper = mount(VueControlsDemo);
        await button(wrapper, 'Start controls').trigger('click');
        await settle();
        wrapper.getComponent(Input).vm.$emit('update:modelValue', 'Pencil');
        await wrapper.vm.$nextTick();
        expect(request).toHaveBeenCalledTimes(1);
        await button(wrapper, 'Name descending').trigger('click');
        await settle();
        expect(payload().state.fields.name.search).toEqual({
            value: 'Pencil',
            matchType: 'contains',
        });
        expect(payload().state.order).toEqual({
            kind: 'fields',
            terms: [{ field: 'name', direction: 'desc', sortType: 'natural' }],
        });
        for (const label of ['Inactive false', 'Score zero', 'Selected null']) {
            await button(wrapper, label).trigger('click');
            await settle();
        }
        expect(payload().state.fields.active.filters.active).toEqual({ value: false });
        expect(payload().state.fields.score.filters.score).toEqual({ value: 0 });
        expect(payload().state.fields.optional.filters.optional).toEqual({ value: null });
        await button(wrapper, 'Clear search').trigger('click');
        await button(wrapper, 'Reload catalog').trigger('click');
        await settle();
        expect(payload().state.fields.name).toBeUndefined();
        expect(payload().state.fields.score.filters.score.value).toBe(0);
    });

    it('preserves an offset page only when the reader selects the explicit page policy', async () => {
        const wrapper = mount(VueControlsDemo);
        await button(wrapper, 'Start controls').trigger('click');
        await settle();
        await button(wrapper, 'Next catalog page').trigger('click');
        await settle();
        await button(wrapper, 'Name descending, keep page').trigger('click');
        await settle();
        expect(payload().state.paging.current).toBe(2);
        expect(payload().state.order.terms[0].direction).toBe('desc');
        await button(wrapper, 'Clear order').trigger('click');
        await settle();
        expect(payload().state.paging.current).toBe(1);
    });

    it('replaces the complete snapshot and resets with a source-only request', async () => {
        const wrapper = mount(VueControlsDemo);
        await button(wrapper, 'Start controls').trigger('click');
        await settle();
        await button(wrapper, 'Inactive false').trigger('click');
        await settle();
        await button(wrapper, 'Replace with paper snapshot').trigger('click');
        await settle();
        expect(payload().state.fields).toEqual({
            category: { filters: { category: { value: 'paper' } } },
        });
        expect(payload().state.paging.per_page).toBe(4);
        await button(wrapper, 'Restore server defaults').trigger('click');
        await settle();
        expect(payload()).toEqual({ version: 2 });
    });

    it('uses source-owned props and independent definition decoding to hide undeclared controls', async () => {
        const wrapper = mount(VueDefinitionDemo);
        expect(request).not.toHaveBeenCalled();
        await button(wrapper, 'Start definition').trigger('click');
        await settle();
        expect(payload()).toEqual({ version: 2 });
        expect(wrapper.text()).toContain('Available matches contains.');
        expect(button(wrapper, 'Tools only')).toBeUndefined();
        expect(wrapper.text()).toContain('paper');
        expect(wrapper.text()).toContain('unidentified');
        await button(wrapper, 'Name descending').trigger('click');
        await settle();
        expect(payload().state.order.terms[0].field).toBe('name');
    });

    it('cancels pending work when the reader resets and ignores a late response', async () => {
        let complete;
        request.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    complete = resolve;
                }),
        );
        const wrapper = mount(VueControlsDemo);
        await button(wrapper, 'Start controls').trigger('click');
        const signal = request.mock.calls[0][0].signal;
        await button(wrapper, 'Reset controls').trigger('click');
        expect(signal.aborted).toBe(true);
        complete(response(initial));
        await settle();
        expect(wrapper.find('[data-vue-session]').exists()).toBe(false);
        expect(wrapper.text()).toContain('Ready.');
    });
});
