import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vite-plus/test';
import { createMosaicast } from '@artisan-toolbox/mosaicast';
import { router } from '@inertiajs/vue3';
import DemoAction from '@/components/demo/DemoAction.vue';
import QueuedDeliveryDemo from './QueuedDeliveryDemo.vue';
import { connectDemoBroadcast, hasDemoBroadcast } from './broadcast';

vi.mock('./broadcast', () => ({
    hasDemoBroadcast: vi.fn(),
    connectDemoBroadcast: vi.fn(),
}));
vi.mock('@inertiajs/vue3', async (importOriginal) => ({
    ...(await importOriginal()),
    usePage: () => ({ props: { mosaicastSessionIdentifier: 'a'.repeat(64) } }),
}));

enableAutoUnmount(afterEach);
let post;
let broadcast;

beforeEach(() => {
    hasDemoBroadcast.mockReset().mockReturnValue(true);
    connectDemoBroadcast.mockReset().mockResolvedValue(undefined);
    const handlers = new Map();
    vi.spyOn(router, 'on').mockImplementation((name, callback) => {
        handlers.set(name, callback);
        return () => handlers.delete(name);
    });
    post = vi.spyOn(router, 'post').mockImplementation(() => {});
    broadcast = { handlers, event: null };
});
afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
});

function mountQueue(configuration = {}) {
    const channel = {
        subscribed() {
            return this;
        },
        error() {
            return this;
        },
        listenToAll(callback) {
            broadcast.event = callback;
            return this;
        },
    };
    const wrapper = mount(QueuedDeliveryDemo, {
        props: {
            configuration: {
                queueUrl: '/demo/mosaicast/queue',
                queueAllowed: true,
                queueConfigured: true,
                channelPrefix: 'mosaicast.sessions',
                ...configuration,
            },
            sources: [],
        },
        global: {
            plugins: [
                createMosaicast({
                    echo: { private: () => channel, leave() {} },
                }),
            ],
        },
    });
    broadcast.handlers.get('navigate')({
        detail: {
            page: {
                props: {
                    mosaicastSessionIdentifier: 'a'.repeat(64),
                    mosaicastHasEvents: false,
                },
            },
        },
    });
    return wrapper;
}

describe('queued delivery example', () => {
    it('waits for the user and private subscription before submitting a real queue request', async () => {
        const wrapper = mountQueue();
        expect(post).not.toHaveBeenCalled();
        expect(connectDemoBroadcast).not.toHaveBeenCalled();
        await wrapper.findAllComponents(DemoAction)[0].trigger('click');
        await flushPromises();
        expect(connectDemoBroadcast).toHaveBeenCalledWith(
            'a'.repeat(64),
            'mosaicast.sessions',
        );
        expect(post).toHaveBeenCalledOnce();
        const [, input, options] = post.mock.calls[0];
        options.onSuccess();
        await wrapper.vm.$nextTick();
        expect(wrapper.get('[role="status"]').text()).toContain(
            'Waiting for the actual queued completion',
        );
        broadcast.event('demo.jobs.completed', {
            runId: input.runId,
            orderId: 42,
            message: input.message,
            sequence: 1,
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.get('[role="status"]').text()).toContain(
            'arrived through broadcast',
        );
        expect(wrapper.text()).toContain('Source: broadcast');
    });

    it('keeps the queue unavailable to public visitors', async () => {
        const wrapper = mountQueue({ queueAllowed: false });
        await wrapper.findAllComponents(DemoAction)[0].trigger('click');
        expect(post).not.toHaveBeenCalled();
        expect(wrapper.text()).toContain(
            'Sign in with a verified staff account',
        );
    });

    it.each([
        [
            'staff access',
            { queueAllowed: false },
            true,
            'Staff access is required',
        ],
        [
            'server configuration',
            { queueConfigured: false },
            true,
            'Server configuration is missing',
        ],
        [
            'browser configuration',
            {},
            false,
            'Browser configuration is missing',
        ],
    ])(
        'identifies missing %s before any connection or job starts',
        async (_name, configuration, browserConfigured, message) => {
            hasDemoBroadcast.mockReturnValue(browserConfigured);
            const wrapper = mountQueue(configuration);

            expect(wrapper.text()).toContain(message);
            expect(
                wrapper.findAllComponents(DemoAction)[0].props('disabled'),
            ).toBe(true);
            await wrapper.findAllComponents(DemoAction)[0].trigger('click');
            expect(connectDemoBroadcast).not.toHaveBeenCalled();
            expect(post).not.toHaveBeenCalled();
        },
    );

    it('requests staff access before reporting operator configuration to a public visitor', () => {
        hasDemoBroadcast.mockReturnValue(false);
        const wrapper = mountQueue({
            queueAllowed: false,
            queueConfigured: false,
        });

        expect(wrapper.text()).toContain('Staff access is required');
        expect(wrapper.text()).not.toContain('Server configuration is missing');
        expect(wrapper.text()).not.toContain(
            'Browser configuration is missing',
        );
        expect(wrapper.text()).not.toContain('Configuration is present');
    });

    it.each([
        ['onSuccess', [{ props: { demoResult: { status: 'queued' } } }]],
        ['onError', [{ queue: 'The earlier request failed.' }]],
        ['onCancel', []],
        [
            'onFinish',
            [{ completed: true, cancelled: false, interrupted: false }],
        ],
    ])(
        'keeps a newer run subscribed when an earlier request calls %s after early completion',
        async (callback, parameters) => {
            const wrapper = mountQueue();
            await wrapper.findAllComponents(DemoAction)[0].trigger('click');
            await flushPromises();
            const [, firstInput, firstOptions] = post.mock.calls[0];
            broadcast.event('demo.jobs.completed', { runId: firstInput.runId });
            await wrapper.vm.$nextTick();
            expect(wrapper.get('[role="status"]').text()).toContain(
                'arrived through broadcast',
            );
            await wrapper.findAllComponents(DemoAction)[1].trigger('click');
            await wrapper.findAllComponents(DemoAction)[0].trigger('click');
            await flushPromises();
            const [, nextInput] = post.mock.calls[1];
            expect(nextInput.runId).not.toBe(firstInput.runId);

            firstOptions[callback](...parameters);
            await wrapper.vm.$nextTick();

            expect(wrapper.get('[role="status"]').text()).toContain(
                'Submitting one job to Redis',
            );
            broadcast.event('demo.jobs.completed', { runId: firstInput.runId });
            await wrapper.vm.$nextTick();
            expect(wrapper.get('[role="status"]').text()).toContain(
                'Submitting one job to Redis',
            );
            broadcast.event('demo.jobs.completed', { runId: nextInput.runId });
            await wrapper.vm.$nextTick();
            expect(wrapper.get('[role="status"]').text()).toContain(
                'arrived through broadcast',
            );
        },
    );

    it.each([
        ['onError', [{ queue: 'The request failed after delivery.' }]],
        ['onCancel', []],
    ])(
        'keeps an early completion visible when its request later calls %s',
        async (callback, parameters) => {
            const wrapper = mountQueue();
            await wrapper.findAllComponents(DemoAction)[0].trigger('click');
            await flushPromises();
            const [, input, options] = post.mock.calls[0];
            broadcast.event('demo.jobs.completed', { runId: input.runId });
            await wrapper.vm.$nextTick();

            options[callback](...parameters);
            await wrapper.vm.$nextTick();

            expect(wrapper.get('[role="status"]').text()).toContain(
                'arrived through broadcast',
            );
        },
    );

    it('reports subscription failure without submitting a job', async () => {
        connectDemoBroadcast.mockRejectedValueOnce(new Error('Unavailable'));
        const wrapper = mountQueue();
        await wrapper.findAllComponents(DemoAction)[0].trigger('click');
        await flushPromises();
        expect(post).not.toHaveBeenCalled();
        expect(wrapper.get('[role="status"]').text()).toContain(
            'could not connect',
        );
    });

    it('does not submit a job if the reader leaves while connecting', async () => {
        let subscribed;
        connectDemoBroadcast.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    subscribed = resolve;
                }),
        );
        const wrapper = mountQueue();
        await wrapper.findAllComponents(DemoAction)[0].trigger('click');
        wrapper.unmount();
        subscribed();
        await flushPromises();
        expect(post).not.toHaveBeenCalled();
    });

    it('reports missing completion honestly and does not poll or submit another job', async () => {
        vi.useFakeTimers();
        const wrapper = mountQueue();
        await wrapper.findAllComponents(DemoAction)[0].trigger('click');
        await vi.advanceTimersByTimeAsync(0);
        post.mock.calls[0][2].onSuccess();
        await vi.advanceTimersByTimeAsync(20000);
        expect(wrapper.get('[role="status"]').text()).toContain(
            'The job may still be queued',
        );
        expect(post).toHaveBeenCalledOnce();
    });
});
