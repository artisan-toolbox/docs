import { http } from '@inertiajs/core';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { DataGrid } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { page, intent, response } from '../listing/testFixtures';
import SharedAdapterDemo from './SharedAdapterDemo.vue';
import GetterDemo from './GetterDemo.vue';

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
    request.mockImplementation((configuration) => {
        const configuredSize = configuration.url.endsWith('Dapter.CollectionFluent') ? 5 : 10;
        const options = configuredSize === 5 ? [5, 10] : [5, 10, 50, 100];
        const paging = JSON.parse(configuration.data).state?.paging;
        return Promise.resolve(
            response(
                page(
                    paging?.current ?? 1,
                    paging?.per_page ?? configuredSize,
                    options,
                    configuredSize,
                ),
            ),
        );
    });
});
afterEach(() => {
    http.setClient(originalClient);
    delete globalThis.Ziggy;
});
const button = (wrapper, label) =>
    wrapper.findAllComponents(Button).find((item) => item.text() === label);
async function settle() {
    await flushPromises();
    await vi.dynamicImportSettled();
    await flushPromises();
}
async function click(wrapper, label) {
    await button(wrapper, label).trigger('click');
    await settle();
}

describe('Dapter shared adapter examples', () => {
    it('waits for Start and shares one request lifecycle between the host, child, and bound view', async () => {
        const wrapper = mount(SharedAdapterDemo);
        expect(request).not.toHaveBeenCalled();
        await click(wrapper, 'Start example');
        expect(request).toHaveBeenCalledTimes(2);
        expect(wrapper.text()).toContain('Host controls read page 1.');
        expect(wrapper.text()).toContain('Child controls read page 1.');
        expect(wrapper.text()).toContain('Independent store reads page 1 with 5 rows.');
        expect(wrapper.getComponent(DataGrid).vm.$attrs.data).toHaveLength(5);
        await click(wrapper, 'Next from host');
        expect(request).toHaveBeenCalledTimes(3);
        expect(JSON.parse(request.mock.calls[2][0].data)).toEqual({
            version: 1,
            state: intent(2, 5),
        });
        expect(wrapper.text()).toContain('Host controls read page 2.');
        expect(wrapper.text()).toContain('Child controls read page 2.');
        expect(wrapper.text()).toContain('Independent store reads page 1 with 5 rows.');
        expect(wrapper.getComponent(DataGrid).vm.$attrs.data[0].name).toBe('Notebook 06');
        await click(wrapper, 'Reload from child');
        expect(request).toHaveBeenCalledTimes(4);
        expect(JSON.parse(request.mock.calls[3][0].data).state.paging.current).toBe(2);
    });

    it('follows a Ref source and preserves the independent named store', async () => {
        const wrapper = mount(SharedAdapterDemo);
        await click(wrapper, 'Start example');
        await click(wrapper, 'Next independent page');
        expect(wrapper.text()).toContain('Independent store reads page 2 with 5 rows.');
        await click(wrapper, 'Next from host');
        await click(wrapper, 'Use ten-row source');
        expect(request.mock.calls.at(-1)[0].url).toContain('Dapter.CollectionDefaults');
        expect(JSON.parse(request.mock.calls.at(-1)[0].data)).toEqual({ version: 1 });
        expect(wrapper.text()).toContain('Host controls read page 1.');
        expect(wrapper.text()).toContain('Child controls read page 1.');
        expect(wrapper.text()).toContain('Independent store reads page 2 with 5 rows.');
        expect(wrapper.getComponent(DataGrid).vm.$attrs.data).toHaveLength(10);
        await click(wrapper, 'Use five-row source');
        expect(wrapper.getComponent(DataGrid).vm.$attrs.data).toHaveLength(5);
        expect(wrapper.text()).toContain('Independent store reads page 2 with 5 rows.');
    });

    it('disposes both active owners on Reset and ignores late responses', async () => {
        const pending = [];
        request.mockImplementation(() => new Promise((resolve) => pending.push(resolve)));
        const wrapper = mount(SharedAdapterDemo);
        await click(wrapper, 'Start example');
        expect(request).toHaveBeenCalledTimes(2);
        expect(wrapper.text()).toContain('Loading independent catalog...');
        const signals = request.mock.calls.map(([configuration]) => configuration.signal);
        await click(wrapper, 'Reset');
        expect(signals.every((signal) => signal.aborted)).toBe(true);
        for (const resolve of pending) resolve(response(page(1, 5, [5, 10])));
        await settle();
        expect(wrapper.findComponent(DataGrid).exists()).toBe(false);
        expect(wrapper.text()).toContain('Ready. Start the example');
        expect(request).toHaveBeenCalledTimes(2);
    });

    it('announces a pending getter request and cancels it on Reset', async () => {
        let resolve;
        request.mockReturnValueOnce(
            new Promise((done) => {
                resolve = done;
            }),
        );
        const wrapper = mount(GetterDemo);
        await click(wrapper, 'Start example');
        expect(wrapper.text()).toContain('Loading getter source...');
        const signal = request.mock.calls[0][0].signal;
        await click(wrapper, 'Reset');
        expect(signal.aborted).toBe(true);
        resolve(response(page()));
        await settle();
        expect(wrapper.text()).toContain('Ready. Start the example');
        expect(wrapper.text()).not.toContain('Page 1 with 10 rows.');
    });

    it('follows a getter source without a decoder and resets its accepted page', async () => {
        const wrapper = mount(GetterDemo);
        expect(request).not.toHaveBeenCalled();
        await click(wrapper, 'Start example');
        expect(request).toHaveBeenCalledTimes(1);
        expect(wrapper.text()).toContain('Page 1 with 10 rows.');
        await click(wrapper, 'Next getter page');
        expect(wrapper.text()).toContain('Page 2 with 10 rows.');
        await click(wrapper, 'Use five-row source');
        expect(wrapper.text()).toContain(
            'Getter source Dapter.CollectionFluent. Page 1 with 5 rows.',
        );
        expect(JSON.parse(request.mock.calls.at(-1)[0].data)).toEqual({ version: 1 });
        await click(wrapper, 'Reset');
        expect(request).toHaveBeenCalledTimes(3);
    });
});
