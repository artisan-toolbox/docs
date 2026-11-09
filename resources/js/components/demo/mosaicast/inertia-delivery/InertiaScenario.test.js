import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { createMosaicast, mosaicast } from '@artisan-toolbox/mosaicast';
import { router } from '@inertiajs/vue3';
import DemoAction from '@/components/demo/DemoAction.vue';
import InertiaScenario from './InertiaScenario.vue';

const boundary = { post: vi.fn(), handlers: new Map() };

enableAutoUnmount(afterEach);
beforeEach(() => {
    boundary.post.mockReset();
    boundary.handlers.clear();
    vi.spyOn(router, 'post').mockImplementation(boundary.post);
    vi.spyOn(router, 'on').mockImplementation((name, handler) => {
        boundary.handlers.set(name, handler);
        return () => boundary.handlers.delete(name);
    });
});
afterEach(() => vi.restoreAllMocks());

function mountScenario(props = {}) {
    return mount(InertiaScenario, {
        props: {
            scenario: 'string',
            title: 'A named event',
            description: 'Compare both response paths.',
            endpoint: '/demo/mosaicast/delivery',
            eventNames: ['demo.orders.updated'],
            sources: [],
            ...props,
        },
        global: { plugins: [createMosaicast()] },
    });
}

function finishResponse(events) {
    const [, input, options] = boundary.post.mock.calls.at(-1);
    const envelopes = events.map((name, index) => ({
        name,
        payload: {
            runId: input.runId,
            orderId: 42,
            message: input.message,
            sequence: index + 1,
        },
    }));
    const page = {
        props: {
            mosaicast: { sessionIdentifier: null, events: envelopes },
            mosaicastHasEvents: true,
            demoResult: {
                runId: input.runId,
                nativeDispatched: events.length,
                manualEvents: envelopes,
            },
        },
    };
    boundary.handlers.get('beforeUpdate')({ detail: { page } });
    boundary.handlers.get('success')();
    options.onSuccess(page);
    options.onFinish();
}

describe('interactive Inertia delivery scenario', () => {
    it('does no work until the reader acts and receives the real plugin output', async () => {
        const wrapper = mountScenario();
        expect(boundary.post).not.toHaveBeenCalled();
        expect(wrapper.text()).toContain('No request has started.');
        await wrapper.get('input').setValue('The same message.');
        await wrapper.findAllComponents(DemoAction)[0].trigger('click');
        const [url, input, options] = boundary.post.mock.calls[0];
        expect(url).toBe('/demo/mosaicast/delivery');
        expect(input).toMatchObject({
            scenario: 'string',
            message: 'The same message.',
        });
        expect(options).toMatchObject({
            only: ['mosaicast', 'demoResult'],
            preserveState: true,
            preserveUrl: true,
        });
        finishResponse(['demo.orders.updated']);
        await wrapper.vm.$nextTick();
        expect(wrapper.get('[role="status"]').text()).toContain(
            'Mosaicast listeners received 1 of 1',
        );
        expect(wrapper.text()).toContain('Source: inertia');
        expect(wrapper.text()).toContain('The same message.');
    });

    it('keeps distinct event types in their delivered order and resets the display', async () => {
        const names = [
            'demo.orders.accepted',
            'demo.reports.prepared',
            'demo.notifications.created',
        ];
        const wrapper = mountScenario({
            scenario: 'multiple',
            eventNames: names,
        });
        await wrapper.findAllComponents(DemoAction)[0].trigger('click');
        finishResponse(names);
        await wrapper.vm.$nextTick();
        expect(wrapper.get('[role="status"]').text()).toContain(
            'Mosaicast listeners received 3 of 3',
        );
        const logs = wrapper.findAll('ol');
        expect(logs[1].findAll('li').map((item) => item.find('p').text())).toEqual(names);
        await wrapper.findAllComponents(DemoAction)[1].trigger('click');
        expect(wrapper.findAll('ol')).toHaveLength(0);
        expect(wrapper.get('[role="status"]').text()).toContain('No request has started.');
        expect(boundary.post).toHaveBeenCalledTimes(1);
    });

    it('reports validation and canceled visits without inventing a delivery', async () => {
        const wrapper = mountScenario();
        await wrapper.findAllComponents(DemoAction)[0].trigger('click');
        const first = boundary.post.mock.calls[0][2];
        first.onError({ message: 'The message is too long.' });
        first.onFinish();
        await wrapper.vm.$nextTick();
        expect(wrapper.get('[role="status"]').text()).toBe('The message is too long.');
        expect(wrapper.findAll('ol')).toHaveLength(0);
        await wrapper.findAllComponents(DemoAction)[0].trigger('click');
        const second = boundary.post.mock.calls[1][2];
        second.onCancel();
        second.onFinish();
        await wrapper.vm.$nextTick();
        expect(wrapper.get('[role="status"]').text()).toContain('The visit was canceled');
    });

    it('removes its listener when the reader leaves before the response', async () => {
        const off = vi.spyOn(mosaicast(), 'off');
        const wrapper = mountScenario();
        await wrapper.findAllComponents(DemoAction)[0].trigger('click');
        wrapper.unmount();
        expect(off).toHaveBeenCalledWith('demo.orders.updated', expect.any(Function));
    });
});
