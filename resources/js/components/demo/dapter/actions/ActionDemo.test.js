import { http, HttpResponseError, HttpNetworkError } from '@inertiajs/core';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vite-plus/test';
import ActionDemo from './ActionDemo.vue';
import v1 from './wire-v1.json';
import v2 from './wire-v2.json';
const client = http.getClient(),
    request = vi.fn();
const button = (wrapper, label) =>
    wrapper.findAllComponents(Button).find((item) => item.text() === label);
const response = (data, status = 200) => ({ status, data: JSON.stringify(data), headers: {} });
let count = 0;
enableAutoUnmount(afterEach);
beforeEach(() => {
    count = 0;
    request.mockReset().mockImplementation(async (config) => {
        if (config.url.includes('/start')) return response({ count: 0 });
        if (config.url.includes('/dapter/data/')) {
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
            const wire = structuredClone(body.version === 2 ? v2 : v1);
            wire.data.forEach((row) => (row.writes = count));
            return response(wire);
        }
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        if (config.url.includes('/uncertain')) {
            count++;
            throw new HttpResponseError(
                'Rejected',
                response({ errors: { name: ['May have committed.'] } }, 422),
            );
        }
        if (body.name === '')
            throw new HttpResponseError(
                'Rejected',
                response({ errors: { name: ['A name is required.'] } }, 422),
            );
        count++;
        return response({ saved: true, count });
    });
    http.setClient({ request });
    globalThis.Ziggy = {
        url: 'https://atb.test',
        port: null,
        defaults: {},
        routes: {
            'dapter.data': { uri: 'dapter/data/{source}', methods: ['POST'] },
            'demo.dapter.actions.start': { uri: 'demo/dapter/actions/start', methods: ['POST'] },
            'demo.dapter.actions.revoke': { uri: 'demo/dapter/actions/revoke', methods: ['POST'] },
        },
    };
});
afterEach(() => {
    http.setClient(client);
    delete globalThis.Ziggy;
});
async function settle() {
    await flushPromises();
    await vi.dynamicImportSettled();
    await flushPromises();
}
it.each([1, 2])(
    'consumes real backend protocol %i action metadata and reloads only on reader action',
    async (protocol) => {
        const wrapper = mount(ActionDemo, { props: { protocol } });
        expect(wrapper.get('[data-action-demo]').attributes('data-action-demo')).toBe(
            String(protocol),
        );
        expect(request).not.toHaveBeenCalled();
        await button(wrapper, 'Start action demo').trigger('click');
        await settle();
        expect(request).toHaveBeenCalledTimes(2);
        await button(wrapper, 'Reject validation').trigger('click');
        await settle();
        expect(count).toBe(0);
        expect(wrapper.get('[data-action-outcome]').text()).toContain('validation. Commit unknown');
        await button(wrapper, 'Save JSON').trigger('click');
        await settle();
        expect(count).toBe(1);
        expect(request).toHaveBeenCalledTimes(4);
        expect(wrapper.get('[data-action-outcome]').text()).toContain(
            'completed. Commit confirmed',
        );
        expect(wrapper.get('[data-borrowed-counter]').text()).toContain('0');
        const sent = request.mock.calls[3][0];
        expect(sent.method).toBe('post');
        expect(sent.headers['X-Dapter-Transport']).toBe('http');
        expect(sent.headers['X-Dapter-Action']).toBe('1');
        await button(wrapper, 'Reject string record ID').trigger('click');
        await settle();
        expect(request).toHaveBeenCalledTimes(4);
        expect(count).toBe(1);
        expect(wrapper.get('[data-action-outcome]').text()).toContain(
            'rejected. Commit not_started',
        );
        await button(wrapper, 'Toggle independent owner').trigger('click');
        await settle();
        expect(wrapper.get('[data-independent-counter]').text()).toContain('1');
        expect(wrapper.get('[data-borrowed-counter]').text()).toContain('0');
        await button(wrapper, 'Toggle independent owner').trigger('click');
        await settle();
        await button(wrapper, 'Explicitly reload rows').trigger('click');
        await settle();
        expect(wrapper.get('[data-borrowed-counter]').text()).toContain('1');
        await button(wrapper, 'Write then return 422').trigger('click');
        await settle();
        expect(count).toBe(2);
        expect(wrapper.get('[data-action-outcome]').text()).toContain('validation. Commit unknown');
        expect(wrapper.text()).toContain('never retries a write automatically');
        await button(wrapper, 'Dispose action owner').trigger('click');
        await settle();
        expect(wrapper.find('[data-action-session]').exists()).toBe(false);
    },
);
it('reports a lost response as unknown without retry or listing navigation', async () => {
    const wrapper = mount(ActionDemo);
    await button(wrapper, 'Start action demo').trigger('click');
    await settle();
    request.mockRejectedValueOnce(new HttpNetworkError('Lost response'));
    await button(wrapper, 'Save JSON').trigger('click');
    await settle();
    expect(request).toHaveBeenCalledTimes(3);
    expect(wrapper.get('[data-action-outcome]').text()).toContain('failed. Commit unknown');
});
