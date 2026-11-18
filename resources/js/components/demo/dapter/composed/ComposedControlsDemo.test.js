import { http } from '@inertiajs/core';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vite-plus/test';
import ComposedControlsDemo from './ComposedControlsDemo.vue';
import wire from './wire.json';
const client = http.getClient(),
    request = vi.fn();
const button = (wrapper, label) =>
    wrapper.findAllComponents(Button).find((item) => item.text() === label);
enableAutoUnmount(afterEach);
beforeEach(() => {
    request.mockReset().mockResolvedValue({ status: 200, data: JSON.stringify(wire), headers: {} });
    http.setClient({ request });
    globalThis.Ziggy = {
        url: 'https://atb.test',
        port: null,
        defaults: {},
        routes: { 'dapter.data': { uri: 'dapter/data/{source}', methods: ['POST'] } },
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
it('starts composed controls only on reader action and emits actual public global and additive calls', async () => {
    const wrapper = mount(ComposedControlsDemo);
    expect(request).not.toHaveBeenCalled();
    await button(wrapper, 'Start composed controls').trigger('click');
    await settle();
    expect(request).toHaveBeenCalledTimes(1);
    expect(wrapper.findAll('[data-composed-row]')).toHaveLength(4);
    await button(wrapper, 'Paused only').trigger('click');
    await settle();
    expect(JSON.parse(request.mock.calls.at(-1)[0].data).state.global.filters.status.value).toBe(
        'paused',
    );
    await button(wrapper, 'Order by name').trigger('click');
    await settle();
    expect(JSON.parse(request.mock.calls.at(-1)[0].data).state.order.terms).toEqual([
        { field: 'name', direction: 'asc', sortType: 'natural' },
    ]);
    await button(wrapper, 'Reset composed controls').trigger('click');
    await settle();
    expect(wrapper.find('[data-composed-session]').exists()).toBe(false);
});
