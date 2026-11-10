import { http } from '@inertiajs/core';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { settleDetachedHostUpdates } from '@/testSetup';
import DemoAction from '@/components/demo/DemoAction.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import ConditionalArraysDemo from './ConditionalArraysDemo.vue';

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
        routes: {
            'demo.core.conditional-arrays': {
                uri: 'examples/core/conditional-arrays',
                methods: ['POST'],
            },
        },
    };
});
afterEach(() => {
    http.setClient(originalClient);
    delete globalThis.Ziggy;
});
const actions = (wrapper) => wrapper.findAllComponents(DemoAction);
const response = (data, status = 200) => ({
    status,
    data: JSON.stringify(data),
    headers: {},
});
const result = (options = { includeContact: false, includeExtraItem: false }) => ({
    options,
    payload: {
        profile: {
            name: 'Alex Example',
            active: false,
            nickname: null,
            visits: 0,
            note: '',
        },
        items: { 0: 'Core', 2: 'Mosaicast' },
    },
    contactEvaluated: options.includeContact,
});
const deferred = () => {
    let resolve;
    const promise = new Promise((done) => {
        resolve = done;
    });
    return { promise, resolve };
};
const output = (wrapper) =>
    wrapper
        .findAllComponents(CodeExample)
        .find((block) => block.props('label') === 'Actual server response');

describe('Core conditional arrays', () => {
    it('waits for a click, sends named-route options, and shows the actual response without reindexing', async () => {
        const pending = deferred();
        request.mockReturnValueOnce(pending.promise);
        const wrapper = mount(ConditionalArraysDemo);
        expect(request).not.toHaveBeenCalled();
        expect(wrapper.get('[data-search-exclude]').exists()).toBe(true);
        expect(wrapper.get('[data-docs-outline-exclude]').exists()).toBe(true);
        const sources = wrapper.get('details').text();
        expect(sources).toContain('ConditionalArraysController.php');
        expect(sources).toContain('ConditionalArraysRequest.php');
        expect(sources).toContain('ConditionalArraysDemo.vue');
        expect(sources).toContain('Arr::sift');
        expect(sources).toContain('useHttp');
        expect(sources).toContain("'includeContact' => ['required', 'boolean']");
        await actions(wrapper)[0].trigger('click');
        await actions(wrapper)[0].trigger('click');
        expect(request).toHaveBeenCalledTimes(1);
        const configuration = request.mock.calls[0][0];
        expect(configuration.method).toBe('post');
        expect(configuration.url).toBe(
            'https://docs.example.test/examples/core/conditional-arrays',
        );
        expect(JSON.parse(configuration.data)).toEqual({
            includeContact: false,
            includeExtraItem: false,
        });
        expect(configuration.headers.Accept).toBe('application/json');
        expect(wrapper.get('fieldset').attributes()).toHaveProperty('disabled');
        expect(wrapper.findAll('wa-checkbox')).toHaveLength(2);
        expect(
            wrapper
                .findAll('wa-checkbox')
                .every((input) => input.attributes('disabled') !== undefined),
        ).toBe(true);
        expect(actions(wrapper)[0].props('busy')).toBe(true);
        expect(wrapper.get('[role="status"]').text()).toBe('Running the Core helper…');
        const actual = result();
        pending.resolve(response(actual));
        await flushPromises();
        expect(output(wrapper).props('code')).toBe(JSON.stringify(actual, null, 2));
        expect(wrapper.text()).toContain('Contact closure not evaluated.');
        const contact = wrapper.findAll('wa-checkbox')[0];
        contact.element.checked = true;
        await contact.trigger('change');
        expect(wrapper.text()).toContain('Last run inputs. Contact omitted;');
        expect(request).toHaveBeenCalledTimes(1);
    });

    it('resets to the original options after a successful run changes native form defaults', async () => {
        request.mockResolvedValueOnce(
            response(result({ includeContact: true, includeExtraItem: true })),
        );
        const wrapper = mount(ConditionalArraysDemo);
        await settleDetachedHostUpdates(wrapper);
        for (const input of wrapper.findAll('wa-checkbox')) {
            input.element.checked = true;
            await input.trigger('change');
        }
        expect(request).not.toHaveBeenCalled();
        await actions(wrapper)[0].trigger('click');
        await flushPromises();
        expect(JSON.parse(request.mock.calls[0][0].data)).toEqual({
            includeContact: true,
            includeExtraItem: true,
        });
        expect(wrapper.text()).toContain('Contact closure evaluated.');
        await actions(wrapper)[1].trigger('click');
        await flushPromises();
        expect(wrapper.findAll('wa-checkbox').every((input) => !input.element.checked)).toBe(true);
        expect(output(wrapper)).toBeUndefined();
        expect(wrapper.get('[role="status"]').text()).toBe(
            'Ready. Choose options and run the example.',
        );
        expect(request).toHaveBeenCalledTimes(1);
    });

    it('handles native 422 validation without treating an undefined response as success, then retries', async () => {
        request
            .mockResolvedValueOnce(
                response(
                    {
                        errors: {
                            includeContact: ['The contact option must be true or false.'],
                        },
                    },
                    422,
                ),
            )
            .mockResolvedValueOnce(response(result()));
        const wrapper = mount(ConditionalArraysDemo);
        await actions(wrapper)[0].trigger('click');
        await flushPromises();
        expect(wrapper.get('[role="alert"]').text()).toBe(
            'The contact option must be true or false.',
        );
        expect(output(wrapper)).toBeUndefined();
        expect(actions(wrapper)[0].props('busy')).toBe(false);
        await actions(wrapper)[1].trigger('click');
        expect(wrapper.find('[role="alert"]').exists()).toBe(false);
        expect(request).toHaveBeenCalledTimes(1);
        await actions(wrapper)[0].trigger('click');
        await flushPromises();
        expect(wrapper.find('[role="alert"]').exists()).toBe(false);
        expect(output(wrapper).props('code')).toBe(JSON.stringify(result(), null, 2));
    });

    it('reports server and network failures and clears them on reset', async () => {
        request
            .mockResolvedValueOnce(response({ message: 'Internal details' }, 500))
            .mockRejectedValueOnce(new Error('Connection unavailable'));
        const wrapper = mount(ConditionalArraysDemo);
        for (let attempt = 0; attempt < 2; attempt++) {
            await actions(wrapper)[0].trigger('click');
            await flushPromises();
            expect(wrapper.get('[role="alert"]').text()).toContain('The example could not run.');
            expect(wrapper.get('[role="alert"]').text()).not.toContain('Internal details');
            expect(actions(wrapper)[0].props('busy')).toBe(false);
        }
        await actions(wrapper)[1].trigger('click');
        expect(wrapper.find('[role="alert"]').exists()).toBe(false);
        expect(request).toHaveBeenCalledTimes(2);
    });

    it.each([200, 422])(
        'cancels reset work and ignores a late %i response while a new run is pending',
        async (status) => {
            const older = deferred();
            const newer = deferred();
            request.mockReturnValueOnce(older.promise).mockReturnValueOnce(newer.promise);
            const wrapper = mount(ConditionalArraysDemo);
            await actions(wrapper)[0].trigger('click');
            const signal = request.mock.calls[0][0].signal;
            await actions(wrapper)[1].trigger('click');
            expect(signal.aborted).toBe(true);
            expect(output(wrapper)).toBeUndefined();
            await actions(wrapper)[0].trigger('click');
            older.resolve(
                response(
                    status === 200 ? result() : { errors: { includeContact: ['Stale error'] } },
                    status,
                ),
            );
            await flushPromises();
            expect(wrapper.get('[role="status"]').text()).toBe('Running the Core helper…');
            expect(actions(wrapper)[0].props('busy')).toBe(true);
            expect(wrapper.find('[role="alert"]').exists()).toBe(false);
            expect(output(wrapper)).toBeUndefined();
            await actions(wrapper)[0].trigger('click');
            expect(request).toHaveBeenCalledTimes(2);
            const actual = result({
                includeContact: false,
                includeExtraItem: true,
            });
            newer.resolve(response(actual));
            await flushPromises();
            expect(output(wrapper).props('code')).toBe(JSON.stringify(actual, null, 2));
        },
    );

    it('aborts an active request when the demo unmounts', async () => {
        const pending = deferred();
        request.mockReturnValueOnce(pending.promise);
        const wrapper = mount(ConditionalArraysDemo);
        await actions(wrapper)[0].trigger('click');
        const signal = request.mock.calls[0][0].signal;
        wrapper.unmount();
        expect(signal.aborted).toBe(true);
        pending.resolve(response(result()));
        await flushPromises();
        expect(request).toHaveBeenCalledTimes(1);
    });
});
