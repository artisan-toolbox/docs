import { http } from '@inertiajs/core';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vite-plus/test';
import QuickstartUsageDemo from './QuickstartUsageDemo.vue';
import { page, response } from './testFixtures';

const originalClient = http.getClient();
const request = vi.fn();
const button = (wrapper, label) =>
    wrapper.findAllComponents(Button).find((item) => item.text() === label);
const names = (wrapper) =>
    wrapper.findAll('ul[aria-label="Notebooks"] li').map((row) => row.text());
enableAutoUnmount(afterEach);
beforeEach(() => {
    request
        .mockReset()
        .mockImplementation((config) =>
            response(page(JSON.parse(config.data).state?.paging.current ?? 1)),
        );
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
it('reads and pages the notebook list only after Start', async () => {
    const wrapper = mount(QuickstartUsageDemo);
    expect(request).not.toHaveBeenCalled();
    await button(wrapper, 'Start example').trigger('click');
    await flushPromises();
    expect(request.mock.calls[0][0].url).toMatch(/Dapter\.Quickstart$/);
    expect(JSON.parse(request.mock.calls[0][0].data)).toEqual({ version: 1 });
    expect(names(wrapper)).toEqual(page().data.map((row) => row.name));
    await button(wrapper, 'Next').trigger('click');
    await flushPromises();
    expect(names(wrapper)).toEqual(page(2).data.map((row) => row.name));
    await button(wrapper, 'Previous').trigger('click');
    await flushPromises();
    expect(names(wrapper)[0]).toBe('Notebook 01');
    await button(wrapper, 'Reset example').trigger('click');
    expect(names(wrapper)).toEqual([]);
});
