import { http } from '@inertiajs/core';
import { Button, Select } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { DataGrid } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { enableAutoUnmount, flushPromises, mount as mountComponent } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import coverage from '../../../../../../app/Demo/Dapter/Listing/coverage.json';
import ListingDemo from './ListingDemo.vue';
import { page, intent, response } from './testFixtures';

const mount = (component, options = {}) =>
    mountComponent(component, {
        ...options,
        props: { scenario: 'CollectionDefaults', ...options.props },
    });
const originalClient = http.getClient();
const request = vi.fn();
enableAutoUnmount(afterEach);
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
const button = (wrapper, label) =>
    wrapper.findAllComponents(Button).find((item) => item.text() === label);
const deferred = () => {
    let resolve;
    const promise = new Promise((done) => {
        resolve = done;
    });
    return { promise, resolve };
};

async function settle() {
    await flushPromises();
    await vi.dynamicImportSettled();
    await flushPromises();
}

describe('Dapter public listing demo', () => {
    it('waits for Start, uses the package named route, and renders accepted rows in the public grid', async () => {
        const pending = deferred();
        request.mockReturnValueOnce(pending.promise);
        const wrapper = mount(ListingDemo);
        expect(request).not.toHaveBeenCalled();
        expect(wrapper.get('[data-search-exclude]').exists()).toBe(true);
        expect(wrapper.get('[data-docs-outline-exclude]').exists()).toBe(true);
        expect(wrapper.get('details').text()).toContain('StoreOptions::make()');
        await button(wrapper, 'Start example').trigger('click');
        expect(request).toHaveBeenCalledTimes(1);
        const configuration = request.mock.calls[0][0];
        expect(configuration.url).toBe(
            'https://docs.example.test/dapter/data/Dapter.CollectionDefaults',
        );
        expect(configuration.method).toBe('post');
        expect(JSON.parse(configuration.data)).toEqual({ version: 1 });
        expect(wrapper.text()).toContain('Loading the requested page');
        expect(wrapper.findComponent(DataGrid).exists()).toBe(false);
        pending.resolve(response(page()));
        await settle();
        expect(wrapper.text()).toContain('Page 1 of 3. 23 total, 23 matching.');
        const grid = wrapper.getComponent(DataGrid).vm.$attrs;
        expect(grid.data).toEqual(page().data);
        expect(grid.server).toBe(true);
        expect(grid.paginate).toBe(false);
        expect(grid.columns.every((column) => !column.sortable && !column.filterable)).toBe(true);
    });

    it.each(coverage.cases)(
        'runs the $id declaration and exposes its actual success or access failure',
        async (scenario) => {
            request.mockResolvedValueOnce(
                scenario.expected.status === 200
                    ? response(page(1, scenario.expected.per_page, scenario.expected.options))
                    : response(
                          {
                              version: 1,
                              error: {
                                  kind: 'access',
                                  code: 'access_denied',
                                  message: 'Access to this data source was denied.',
                              },
                          },
                          scenario.expected.status,
                      ),
            );
            const wrapper = mount(ListingDemo, { props: { scenario: scenario.id } });
            expect(request).not.toHaveBeenCalled();
            await button(wrapper, 'Start example').trigger('click');
            await settle();
            expect(request.mock.calls[0][0].url).toContain(scenario.source);
            expect(wrapper.get('details').text()).toContain(`${scenario.id}.php`);
            if (scenario.expected.status === 200) {
                expect(wrapper.getComponent(DataGrid).vm.$attrs.data).toHaveLength(
                    scenario.expected.per_page,
                );
                expect(wrapper.findAllComponents(Select)[0].props('modelValue')).toBe(
                    String(scenario.expected.per_page),
                );
                expect(wrapper.find('[role="alert"]').exists()).toBe(false);
            } else {
                expect(wrapper.get('[role="alert"]').text()).toContain('access');
                expect(wrapper.findComponent(DataGrid).exists()).toBe(false);
                expect(wrapper.text()).not.toContain('23 total, 23 matching.');
            }
        },
    );

    it('sends actual paging intent and resets to page one when the size changes', async () => {
        request
            .mockResolvedValueOnce(response(page()))
            .mockResolvedValueOnce(response(page(2)))
            .mockResolvedValueOnce(response(page(1, 5, [5, 10, 50, 100], 10)));
        const wrapper = mount(ListingDemo);
        await button(wrapper, 'Start example').trigger('click');
        await settle();
        await button(wrapper, 'Next').trigger('click');
        await settle();
        expect(JSON.parse(request.mock.calls[1][0].data)).toEqual({
            version: 1,
            state: intent(2, 10),
        });
        expect(wrapper.getComponent(DataGrid).vm.$attrs.data[0].name).toBe('Notebook 11');
        wrapper.findAllComponents(Select)[0].vm.$emit('update:modelValue', '5');
        await settle();
        expect(JSON.parse(request.mock.calls[2][0].data)).toEqual({
            version: 1,
            state: intent(1, 5),
        });
        expect(wrapper.text()).toContain('Page 1 of 5.');
    });

    it('cancels Reset without committing a late response', async () => {
        const older = deferred();
        const newer = deferred();
        request.mockReturnValueOnce(older.promise).mockReturnValueOnce(newer.promise);
        const wrapper = mount(ListingDemo);
        await button(wrapper, 'Start example').trigger('click');
        const signal = request.mock.calls[0][0].signal;
        await button(wrapper, 'Reset').trigger('click');
        expect(signal.aborted).toBe(true);
        expect(wrapper.text()).toContain('Ready. Start the example');
        await button(wrapper, 'Start example').trigger('click');
        older.resolve(response(page()));
        await settle();
        expect(wrapper.findComponent(DataGrid).exists()).toBe(false);
        newer.resolve(response(page()));
        await settle();
        expect(wrapper.getComponent(DataGrid).vm.$attrs.data).toHaveLength(10);
        expect(request).toHaveBeenCalledTimes(2);
    });

    it('fixes each scenario at the guide and discloses only its relevant helpers', () => {
        const quickstart = mount(ListingDemo, { props: { scenario: 'Quickstart' } });
        expect(quickstart.findAllComponents(Select)).toHaveLength(0);
        expect(quickstart.get('details').text()).not.toContain('FixtureProducts.php');
        expect(quickstart.get('details').text()).not.toContain('DemoConfiguration.php');
        expect(quickstart.get('details').text()).not.toContain('SqliteFixture.php');
        expect(quickstart.attributes('data-dapter-scenario')).toBe('Quickstart');
        expect(quickstart.text()).not.toContain('Source declaration');
    });

    it('validates every decoded row atomically and recovers through Reload', async () => {
        const invalid = page();
        invalid.data[1].category = 12;
        request.mockResolvedValueOnce(response(invalid)).mockResolvedValueOnce(response(page()));
        const wrapper = mount(ListingDemo);
        await button(wrapper, 'Start example').trigger('click');
        await settle();
        expect(wrapper.get('[role="alert"]').text()).toContain('protocol');
        expect(wrapper.findComponent(DataGrid).exists()).toBe(false);
        await button(wrapper, 'Reload').trigger('click');
        await settle();
        expect(wrapper.find('[role="alert"]').exists()).toBe(false);
        expect(wrapper.getComponent(DataGrid).vm.$attrs.data).toHaveLength(10);
    });

    it('aborts its active public adapter request when the demo unmounts', async () => {
        const pending = deferred();
        request.mockReturnValueOnce(pending.promise);
        const wrapper = mount(ListingDemo);
        await button(wrapper, 'Start example').trigger('click');
        const signal = request.mock.calls[0][0].signal;
        wrapper.unmount();
        expect(signal.aborted).toBe(true);
        pending.resolve(response(page()));
        await flushPromises();
    });
});
