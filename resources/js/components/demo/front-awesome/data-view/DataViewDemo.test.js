import { http } from '@inertiajs/core';
import { Button, Select } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vite-plus/test';
import DataViewDemo from './DataViewDemo.vue';
import DataViewPreview from './DataViewPreview.vue';

enableAutoUnmount(afterEach);
const originalClient = http.getClient();
const request = vi.fn();

beforeEach(() => {
    request.mockReset();
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

function json(data, status = 200) {
    return { status, data: JSON.stringify(data), headers: { 'content-type': 'application/json' } };
}

function catalogPage(current, total = 2) {
    const paging = { mode: 'offset', current, per_page: 1 };
    return json({
        version: 1,
        data: total ? [{ id: current, name: `Notebook ${current}`, category: 'Plain' }] : [],
        requested: {
            version: 1,
            fields: {},
            global: {},
            searchMatch: 'all',
            order: { kind: 'default' },
            paging,
        },
        state: { order: { kind: 'source' }, paging },
        paging: {
            ...paging,
            pages: Math.max(1, total),
            total,
            filtered: total,
            has_previous: current > 1,
            has_next: current < total,
        },
        capabilities: {
            fields: {},
            global: {
                multi_order: false,
                multi_order_limit: 1,
                searchMatch: { default: 'all', allowed: ['all'] },
                filters: null,
                search: null,
                order: null,
            },
            paging: { mode: 'offset', per_page: 1, per_page_options: [1] },
        },
    });
}

function mountCatalog() {
    return mount(DataViewDemo, {
        global: { stubs: { DemoFrame: { template: '<section><slot /></section>' } } },
    });
}

async function click(wrapper, label) {
    const button = wrapper.findAllComponents(Button).find((item) => item.text() === label);
    await button.trigger('click');
    await flushPromises();
}

it('keeps the accepted rows and the pending Dapter request across layout changes', async () => {
    const second = Promise.withResolvers();
    request.mockResolvedValueOnce(catalogPage(1)).mockReturnValueOnce(second.promise);
    const wrapper = mountCatalog();
    expect(request).not.toHaveBeenCalled();

    await click(wrapper, 'Start catalog');
    expect(request.mock.calls[0][0].url).toContain('/dapter/data/Dapter.CollectionFluent');
    expect(wrapper.get('tbody strong').text()).toBe('Notebook 1');
    expect(wrapper.get('tbody wa-tag').text()).toBe('Plain');
    await click(wrapper, 'Next');
    expect(JSON.parse(request.mock.calls[1][0].data).state.paging.current).toBe(2);
    expect(wrapper.get('[role="status"]').text()).toContain('Showing the last accepted page');

    await click(wrapper, 'Cards');
    expect(wrapper.get('li wa-card').text()).toContain('Notebook 1');
    second.resolve(catalogPage(2));
    await flushPromises();
    expect(wrapper.get('li wa-card').text()).toContain('Notebook 2');
    await click(wrapper, 'List');
    expect(wrapper.get('li').text()).toContain('Plain paper');
    expect(wrapper.get('li strong').text()).toBe('Notebook 2');
    await click(wrapper, 'Table');
    expect(wrapper.get('tbody strong').text()).toBe('Notebook 2');
    expect(wrapper.get('[role="status"]').text()).toContain('Page 2 of 2');
    expect(request).toHaveBeenCalledTimes(2);

    const preset = wrapper
        .findAllComponents(Select)
        .find((item) => item.attributes('label') === 'Configured layouts');
    preset.vm.$emit('update:modelValue', 'table');
    await flushPromises();
    expect(wrapper.find('[aria-label="Catalog layout"]').exists()).toBe(false);
    expect(wrapper.get('tbody strong').text()).toBe('Notebook 2');
    preset.vm.$emit('update:modelValue', 'cards');
    await flushPromises();
    expect(wrapper.find('table').exists()).toBe(false);
    expect(wrapper.find('[aria-label="Catalog layout"]').exists()).toBe(false);
    expect(wrapper.get('wa-card').text()).toContain('Notebook 2');
    expect(request).toHaveBeenCalledTimes(2);
});

it('reports a denied source and distinguishes an accepted empty catalog after reset', async () => {
    request
        .mockResolvedValueOnce(
            json(
                {
                    version: 1,
                    error: {
                        kind: 'access',
                        code: 'access_denied',
                        message: 'Access to this data source was denied.',
                    },
                },
                403,
            ),
        )
        .mockResolvedValueOnce(catalogPage(1, 0));
    const wrapper = mountCatalog();

    await click(wrapper, 'Try denied source');
    expect(request.mock.calls[0][0].url).toContain('/dapter/data/Dapter.CollectionGateDeny');
    expect(wrapper.get('[role="alert"]').text()).toContain('denied');
    expect(wrapper.findComponent(DataViewPreview).exists()).toBe(false);
    await click(wrapper, 'Reset');
    expect(wrapper.get('[role="status"]').text()).toBe('No source is running.');
    expect(request).toHaveBeenCalledTimes(1);
    await click(wrapper, 'Start catalog');
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    expect(wrapper.get('[role="status"]').text()).toContain('No notebooks match.');
});

it('offers only configured layouts that can render a record', async () => {
    const wrapper = mount(DataViewPreview, {
        props: { views: ['table', 'cards', 'list'], rows: [{ id: 8, name: 'Sketchbook' }] },
        slots: { cards: ({ record }) => record.name },
    });
    expect(wrapper.get('li').text()).toBe('Sketchbook');
    expect(wrapper.find('[aria-label="Catalog layout"]').exists()).toBe(false);
    await wrapper.setProps({ views: ['table', 'list'] });
    expect(wrapper.find('li').exists()).toBe(false);
    expect(wrapper.get('[role="status"]').text()).toContain('Configure table columns');
});
