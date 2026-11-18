import { http } from '@inertiajs/core';
import { Button, Input, Select } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import FieldUsageDemo from './FieldUsageDemo.vue';
import initial from '../vue/response.json';
import { response } from '../listing/testFixtures';

const originalClient = http.getClient();
const request = vi.fn();
const tools = [
    { id: 3, name: 'Pencil 100%_!', category: 'tools' },
    { id: 4, name: 'Pencil case', category: 'tools' },
];
const button = (wrapper, label) =>
    wrapper.findAllComponents(Button).find((item) => item.text() === label);
const visibleIds = (wrapper) =>
    wrapper.findAll('tbody tr').map((row) => Number(row.attributes('data-row-id')));
const payload = () => JSON.parse(request.mock.lastCall[0].data);

function acceptSelection(config) {
    const { state } = JSON.parse(config.data);
    const page = structuredClone(initial);
    if (state) {
        page.requested = state;
        if (state.fields.name?.search || state.fields.category?.filters) {
            page.data = state.fields.name?.search?.value === 'Eraser' ? [] : tools;
            Object.assign(page.paging, { pages: 1, filtered: page.data.length, has_next: false });
        }
        if (state.order.kind === 'fields') {
            page.state.order = { kind: 'terms', terms: state.order.terms };
            page.data.reverse();
        }
    }
    return Promise.resolve(response(page));
}

enableAutoUnmount(afterEach);
beforeEach(() => {
    request.mockReset().mockImplementation(acceptSelection);
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
describe('focused catalog controls', () => {
    it.each([
        ['search', Input, 'Pencil', 'Clear search', [3, 4]],
        ['filter', Select, 'tools', 'Clear category', [3, 4]],
        ['sort', Select, 'asc', 'Clear order', [2, 1]],
    ])(
        'runs only the %s task and clears its selection',
        async (task, control, input, clear, ids) => {
            const wrapper = mount(FieldUsageDemo, { props: { task } });
            expect(request).not.toHaveBeenCalled();
            await button(wrapper, 'Start example').trigger('click');
            await settle();
            expect(payload()).toEqual({ version: 2 });
            expect(request.mock.lastCall[0].url).toMatch(/Dapter\.VueCatalog$/);
            expect(visibleIds(wrapper)).toEqual([1, 2]);
            expect(
                wrapper.findAllComponents(Input).length + wrapper.findAllComponents(Select).length,
            ).toBe(1);
            wrapper.getComponent(control).vm.$emit('update:modelValue', input);
            await settle();
            const { fields, order } = payload().state;
            if (task === 'search')
                expect(fields.name.search).toEqual({ matchType: 'contains', value: 'Pencil' });
            if (task === 'filter')
                expect(fields.category.filters.category).toEqual({ value: 'tools' });
            if (task === 'sort')
                expect(order.terms).toEqual([
                    { field: 'name', direction: 'asc', sortType: 'natural' },
                ]);
            expect(visibleIds(wrapper)).toEqual(ids);
            if (task === 'search') {
                wrapper.getComponent(Input).vm.$emit('update:modelValue', 'Eraser');
                await settle();
                expect(wrapper.get('[data-vue-rows]').text()).toContain('No matching records.');
            }
            await button(wrapper, clear).trigger('click');
            await settle();
            expect(payload().state.fields).toEqual({});
            expect(payload().state.order.kind).toBe('default');
            expect(visibleIds(wrapper)).toEqual([1, 2]);
            await button(wrapper, 'Reset example').trigger('click');
            expect(wrapper.find('tbody').exists()).toBe(false);
        },
    );

    it('omits the control when the server does not advertise its field', async () => {
        const page = structuredClone(initial);
        delete page.capabilities.fields.name;
        request.mockResolvedValueOnce(response(page));
        const wrapper = mount(FieldUsageDemo, { props: { task: 'search' } });
        await button(wrapper, 'Start example').trigger('click');
        await settle();
        expect(wrapper.findComponent(Input).exists()).toBe(false);
        expect(visibleIds(wrapper)).toEqual([1, 2]);
    });
});
