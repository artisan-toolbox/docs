import contract from '@artisan-toolbox/dapter/contracts/read-v1.json';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { http, HttpNetworkError, HttpResponseError } from '@inertiajs/core';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import CodeExample from '@/components/docs/CodeExample.vue';
import ErrorDemo from './ErrorDemo.vue';
import ReadDemo from './ReadDemo.vue';

const originalClient = http.getClient();
const request = vi.fn();
const example = (id) => contract.requests.find((item) => item.id === id);
const response = (item) => ({
    status: item.status,
    data: JSON.stringify(item.response),
    headers: {},
});
const button = (wrapper, label) =>
    wrapper.findAllComponents(Button).find((item) => item.text() === label);
const block = (wrapper, label) =>
    wrapper.findAllComponents(CodeExample).find((item) => item.props('label') === label);
const click = async (wrapper, label) => {
    await button(wrapper, label).trigger('click');
    await flushPromises();
};
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

describe('current Dapter raw protocol examples', () => {
    it.each([
        ['Read source defaults', 'defaults'],
        ['Request allowed size 3', 'selected-size'],
        ['Request page 999', 'page-999'],
    ])('sends %s as public corpus bytes and shows the full acknowledgement', async (label, id) => {
        const item = example(id);
        request.mockResolvedValueOnce(response(item));
        const wrapper = mount(ReadDemo);
        expect(request).not.toHaveBeenCalled();
        const disclosure = wrapper.get('details').text();
        expect(disclosure).toContain('ProtocolRecords.php');
        expect(disclosure).toContain('ProtocolFixture.php');
        expect(disclosure).toContain('Public protocol fixture input');
        expect(disclosure).toContain('http.getClient().request');
        await click(wrapper, label);
        const config = request.mock.calls[0][0];
        expect(config.url).toBe('https://docs.example.test/dapter/data/Dapter.ProtocolRecords');
        expect(config.method).toBe('post');
        expect(config.headers).toEqual({
            Accept: 'application/json',
            'Content-Type': 'application/json',
        });
        expect(config.data).toBe(item.request_json);
        expect(block(wrapper, 'Actual outgoing request bytes').props('code')).toBe(
            item.request_json,
        );
        expect(block(wrapper, 'Actual server response bytes').props('code')).toBe(
            JSON.stringify(item.response),
        );
        expect(wrapper.get('[role="status"]').text()).toContain('Received HTTP 200');
    });

    it.each([
        ['Send malformed JSON', 'malformed-json', 'ProtocolRecords'],
        ['Send version 3', 'future-version', 'ProtocolRecords'],
        ['Send a list envelope', 'list-envelope', 'ProtocolRecords'],
        ['Request a missing source', 'missing-source', 'ProtocolMissing'],
        ['Read an invalid definition', 'server-failure', 'ProtocolInvalidRecords'],
    ])('preserves the complete failure response for %s', async (label, id, source) => {
        const item = example(id);
        request.mockRejectedValueOnce(new HttpResponseError('Rejected', response(item)));
        const wrapper = mount(ErrorDemo);
        expect(request).not.toHaveBeenCalled();
        expect(wrapper.get('details').text()).toContain('ProtocolInvalidRecords.php');
        await click(wrapper, label);
        const config = request.mock.calls[0][0];
        expect(config.data).toBe(item.request_json);
        expect(config.url).toBe(`https://docs.example.test/dapter/data/Dapter.${source}`);
        expect(block(wrapper, 'Actual outgoing request bytes').props('code')).toBe(
            item.request_json,
        );
        expect(block(wrapper, 'Actual server response bytes').props('code')).toBe(
            JSON.stringify(item.response),
        );
        expect(wrapper.get('[role="status"]').text()).toContain(`Received HTTP ${item.status}`);
        if (item.status === 422) {
            expect(
                JSON.parse(block(wrapper, 'Actual server response bytes').props('code')),
            ).toHaveProperty('error.kind', 'validation');
        }
    });

    it('aborts Reset, prevents a second pending request, and ignores stale responses', async () => {
        let complete;
        request.mockReturnValueOnce(
            new Promise((resolve) => {
                complete = resolve;
            }),
        );
        const wrapper = mount(ReadDemo);
        await click(wrapper, 'Read source defaults');
        const signal = request.mock.calls[0][0].signal;
        expect(wrapper.get('[role="status"]').text()).toContain('Waiting for the server');
        expect(button(wrapper, 'Request page 999').props('disabled')).toBe(true);
        await click(wrapper, 'Request page 999');
        expect(request).toHaveBeenCalledTimes(1);
        await click(wrapper, 'Reset');
        expect(signal.aborted).toBe(true);
        expect(wrapper.get('[role="status"]').text()).toBe('Ready. Choose a request to start.');
        request.mockResolvedValueOnce(response(example('page-999')));
        await click(wrapper, 'Request page 999');
        complete(response(example('defaults')));
        await flushPromises();
        expect(block(wrapper, 'Actual server response bytes').props('code')).toBe(
            JSON.stringify(example('page-999').response),
        );
        await click(wrapper, 'Reset');
        expect(block(wrapper, 'Actual server response bytes')).toBeUndefined();
    });

    it.each([ReadDemo, ErrorDemo])(
        'shows network failure without inventing an HTTP response and can retry',
        async (component) => {
            request.mockRejectedValueOnce(new HttpNetworkError('Disconnected'));
            if (component === ReadDemo) {
                request.mockResolvedValueOnce(response(example('defaults')));
            } else {
                request.mockRejectedValueOnce(
                    new HttpResponseError('Rejected', response(example('malformed-json'))),
                );
            }
            const wrapper = mount(component);
            const label = component === ReadDemo ? 'Read source defaults' : 'Send malformed JSON';
            await click(wrapper, label);
            expect(wrapper.get('[role="alert"]').text()).toContain('Check the connection');
            expect(block(wrapper, 'Actual server response bytes')).toBeUndefined();
            await click(wrapper, label);
            expect(wrapper.find('[role="alert"]').exists()).toBe(false);
            expect(wrapper.get('[role="status"]').text()).toContain(
                `Received HTTP ${component === ReadDemo ? 200 : 400}`,
            );
        },
    );

    it.each([ReadDemo, ErrorDemo])(
        'aborts a pending request when the example unmounts',
        async (component) => {
            let complete;
            request.mockReturnValueOnce(
                new Promise((resolve) => {
                    complete = resolve;
                }),
            );
            const wrapper = mount(component);
            await click(
                wrapper,
                component === ReadDemo ? 'Read source defaults' : 'Send malformed JSON',
            );
            const signal = request.mock.calls[0][0].signal;
            wrapper.unmount();
            expect(signal.aborted).toBe(true);
            complete(response(example('defaults')));
            await flushPromises();
            expect(request).toHaveBeenCalledTimes(1);
        },
    );
});
