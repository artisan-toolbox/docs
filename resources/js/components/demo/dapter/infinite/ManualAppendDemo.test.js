import { http } from '@inertiajs/core';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, expect, it, vi } from 'vite-plus/test';
import ManualAppendDemo from './ManualAppendDemo.vue';
import { page, response } from '../listing/testFixtures';

const originalClient = http.getClient();
const button = (wrapper, label) =>
    wrapper.findAllComponents(Button).find((item) => item.text() === label);
enableAutoUnmount(afterEach);
afterEach(() => {
    http.setClient(originalClient);
    delete globalThis.Ziggy;
});
it('appends ordinary offset pages to the existing notebooks and stops at the last row', async () => {
    const request = vi.fn((config) => {
        const body = JSON.parse(config.data);
        const accepted = page(body.state?.paging.current ?? 1);
        accepted.version = 2;
        accepted.requested.version = 2;
        accepted.metadata = { records: { mode: 'unidentified' }, channel: null };
        return Promise.resolve(response(accepted));
    });
    http.setClient({ request });
    globalThis.Ziggy = {
        url: 'https://docs.example.test',
        port: null,
        defaults: {},
        routes: { 'dapter.data': { uri: 'dapter/data/{source}', methods: ['POST'] } },
    };
    const wrapper = mount(ManualAppendDemo);
    expect(request).not.toHaveBeenCalled();
    await button(wrapper, 'Start example').trigger('click');
    await flushPromises();
    expect(request.mock.lastCall[0].url).toMatch(/Dapter\.Quickstart$/);
    expect(JSON.parse(request.mock.lastCall[0].data)).toEqual({ version: 2 });
    for (const current of [2, 3]) {
        await button(wrapper, 'Load more').trigger('click');
        await flushPromises();
        expect(JSON.parse(request.mock.lastCall[0].data).state.paging).toEqual({
            mode: 'offset',
            current,
            per_page: 10,
        });
        const names = wrapper.findAll('ul li').map((item) => item.text());
        expect(names).toHaveLength(current === 2 ? 20 : 23);
        expect(names[0]).toBe('Notebook 01');
        expect(names.at(-1)).toBe(current === 2 ? 'Notebook 20' : 'Notebook 23');
    }
    expect(button(wrapper, 'Load more').props('disabled')).toBe(true);
    await button(wrapper, 'Reset example').trigger('click');
    expect(wrapper.find('ul').exists()).toBe(false);
});
