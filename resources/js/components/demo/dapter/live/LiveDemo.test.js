import { http } from '@inertiajs/core';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vite-plus/test';
import LiveDemo from './LiveDemo.vue';
import ResourceDemo from '../resources/ResourceDemo.vue';
import wire from './wire.json';
const channels = vi.hoisted(() => new Map());
vi.mock('@/components/demo/mosaicast/inertia-delivery/broadcast', () => ({
    demoEcho: {
        private: (name) => channel(name),
        channel: (name) => channel(name),
    },
}));
function channel(name) {
    if (!channels.has(name))
        channels.set(name, {
            callbacks: new Set(),
            listen: vi.fn(function (_event, callback) {
                this.callbacks.add(callback);
            }),
            stopListening: vi.fn(function (_event, callback) {
                this.callbacks.delete(callback);
            }),
            error: vi.fn(),
        });
    return channels.get(name);
}
const client = http.getClient(),
    request = vi.fn();
const button = (wrapper, label) =>
    wrapper.findAllComponents(Button).find((item) => item.text() === label);
enableAutoUnmount(afterEach);
beforeEach(() => {
    channels.clear();
    request.mockReset();
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ready: true, revision: '2' }) }),
    );
    http.setClient({ request });
    globalThis.Ziggy = {
        url: 'https://atb.test',
        port: null,
        defaults: {},
        routes: {
            'dapter.data': { uri: 'dapter/data/{source}', methods: ['POST'] },
            ...Object.fromEntries(
                ['start', 'reset', 'change'].map((action) => [
                    `demo.dapter.live.${action}`,
                    { uri: `demo/dapter/live/${action}`, methods: ['POST'] },
                ]),
            ),
        },
    };
});
afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    http.setClient(client);
    delete globalThis.Ziggy;
});
async function settle() {
    await flushPromises();
    await vi.dynamicImportSettled();
    await new Promise((resolve) => setTimeout(resolve, 20));
    await flushPromises();
}
function respond(source) {
    request.mockResolvedValue({ status: 200, data: JSON.stringify(wire[source]), headers: {} });
}
it.each(['ResourceFluent', 'ResourceAttributes'])(
    'starts %s with the actual default version 1 projected envelope',
    async (scenario) => {
        respond(scenario);
        const wrapper = mount(ResourceDemo, { props: { scenario } });
        expect(request).not.toHaveBeenCalled();
        await button(wrapper, 'Start example').trigger('click');
        await settle();
        expect(wrapper.get('[data-resource-row]').text()).toContain(
            'Notebook 01. Reader guest. Nested guest.',
        );
        expect(request).toHaveBeenCalledTimes(1);
        await button(wrapper, 'Reset example').trigger('click');
        await settle();
        expect(wrapper.find('[data-resource-row]').exists()).toBe(false);
    },
);
it.each([
    'LivePrivate',
    'LiveAttributes',
    'LiveShorthand',
    'LiveIdentity',
    'LiveArrival',
    'LiveNative',
    'LivePublic',
    'LivePolling',
    'LivePollingProps',
])('runs focused %s only after consent', async (scenario) => {
    respond(scenario);
    const wrapper = mount(LiveDemo, { props: { scenario } });
    expect(request).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
    await button(wrapper, 'Start example').trigger('click');
    await settle();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(wrapper.findAll('[data-live-row]')).toHaveLength(wire[scenario].data.length);
    expect(wrapper.get('[data-live-row="0"]').text()).toContain(wire[scenario].data[0].name);
    await button(wrapper, 'Reset example').trigger('click');
    await settle();
    expect(wrapper.find('[data-live-session]').exists()).toBe(false);
    expect([...channels.values()].every((item) => item.callbacks.size === 0)).toBe(true);
});
it('receives the actual queued event without another read or metadata change and ignores its duplicate', async () => {
    respond('LivePrivate');
    const wrapper = mount(LiveDemo, { props: { scenario: 'LivePrivate' } });
    await button(wrapper, 'Start example').trigger('click');
    await settle();
    const metadata = wrapper.get('[data-live-metadata]').text();
    const active = channels.get(wire.LivePrivate.metadata.channel.name);
    for (const callback of active.callbacks) callback(wire.LivePrivateUpdate);
    await settle();
    expect(wrapper.get('[data-live-row="0"]').text()).toContain('Changed notebook 2');
    expect(wrapper.get('[data-live-row="1"]').text()).toContain('Notebook 02');
    expect(wrapper.get('[data-live-metadata]').text()).toBe(metadata);
    expect(request).toHaveBeenCalledTimes(1);
    for (const callback of active.callbacks) callback(wire.LivePrivateUpdate);
    await settle();
    expect(request).toHaveBeenCalledTimes(1);
    for (const callback of active.callbacks)
        callback({
            ...wire.LivePrivateUpdate,
            eventId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            records: {
                mode: 'revisioned',
                format: 'uint64-decimal',
                rows: [{ id: 1, revision: '01' }],
            },
        });
    await settle();
    expect(wrapper.get('[data-live-integration-error]').text()).toContain('invalid_event');
    expect(wrapper.get('[data-live-row="0"]').text()).toContain('Changed notebook 2');
});
it('polls after a future interval and stops after reset', async () => {
    respond('LivePolling');
    const wrapper = mount(LiveDemo, { props: { scenario: 'LivePolling' } });
    await button(wrapper, 'Start example').trigger('click');
    await settle();
    expect(request).toHaveBeenCalledTimes(1);
    await new Promise((resolve) => setTimeout(resolve, 1600));
    await flushPromises();
    expect(request).toHaveBeenCalledTimes(2);
    await button(wrapper, 'Reset example').trigger('click');
    await settle();
    await new Promise((resolve) => setTimeout(resolve, 1600));
    expect(request).toHaveBeenCalledTimes(2);
});
it('replays a real event after the winning pending read renders through the same decoder', async () => {
    respond('LivePrivate');
    const wrapper = mount(LiveDemo, { props: { scenario: 'LivePrivate' } });
    await button(wrapper, 'Start example').trigger('click');
    await settle();
    let resolveRead;
    request.mockImplementationOnce(
        () =>
            new Promise((resolve) => {
                resolveRead = resolve;
            }),
    );
    await button(wrapper, 'Reload explicitly').trigger('click');
    await flushPromises();
    for (const callback of channels.get(wire.LivePrivate.metadata.channel.name).callbacks)
        callback(wire.LivePrivateUpdate);
    await flushPromises();
    expect(wrapper.get('[data-live-row="0"]').text()).toContain('Notebook 01');
    resolveRead({ status: 200, data: JSON.stringify(wire.LivePrivate), headers: {} });
    await settle();
    expect(wrapper.get('[data-live-row="0"]').text()).toContain('Changed notebook 2');
    expect(wrapper.get('[data-decoded-label]').text()).toBe('CHANGED NOTEBOOK 2');
    expect(request).toHaveBeenCalledTimes(2);
});
it('retains the accepted row when the shared row decoder rejects a valid JSON replacement', async () => {
    respond('LivePrivate');
    const wrapper = mount(LiveDemo, { props: { scenario: 'LivePrivate' } });
    await button(wrapper, 'Start example').trigger('click');
    await settle();
    for (const callback of channels.get(wire.LivePrivate.metadata.channel.name).callbacks)
        callback({ ...wire.LivePrivateUpdate, data: [{ name: 42 }] });
    await settle();
    expect(wrapper.get('[data-live-integration-error]').text()).toContain('decoder_failed');
    expect(wrapper.get('[data-live-row="0"]').text()).toContain('Notebook 01');
    expect(request).toHaveBeenCalledTimes(1);
});
it('disposes the prior owner before another Start rotates the fictional identity', async () => {
    request.mockImplementation((url) => ({
        status: 200,
        data: JSON.stringify(
            wire[
                String(url.url ?? url).includes('LiveAttributes') ? 'LiveAttributes' : 'LivePrivate'
            ],
        ),
        headers: {},
    }));
    const wrapper = mount({
        components: { LiveDemo },
        template:
            '<div><LiveDemo scenario="LivePrivate" /><LiveDemo scenario="LiveAttributes" /></div>',
    });
    const [first, second] = wrapper.findAllComponents(LiveDemo);
    await button(first, 'Start example').trigger('click');
    await settle();
    expect(first.find('[data-live-session]').exists()).toBe(true);
    let acceptStart;
    fetch.mockImplementationOnce(
        () =>
            new Promise((resolve) => {
                acceptStart = resolve;
            }),
    );
    await button(second, 'Start example').trigger('click');
    await flushPromises();
    expect(first.find('[data-live-session]').exists()).toBe(false);
    expect([...channels.values()].every((item) => item.callbacks.size === 0)).toBe(true);
    acceptStart({ ok: true, json: async () => ({ ready: true }) });
    await settle();
    expect(second.find('[data-live-session]').exists()).toBe(true);
});
