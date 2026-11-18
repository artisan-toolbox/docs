import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { http, HttpNetworkError } from '@inertiajs/core';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import CodeExample from '@/components/docs/CodeExample.vue';
import cases from '../../../../../../app/Demo/Dapter/Fields/cases.json';
import FieldDemo from './FieldDemo.vue';

const originalClient = http.getClient();
const request = vi.fn();
const button = (wrapper, label) =>
    wrapper.findAllComponents(Button).find((item) => item.text() === label);
const responseBlock = (wrapper) =>
    wrapper
        .findAllComponents(CodeExample)
        .find((item) => item.props('label') === 'Actual version 2 response');
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

describe('backend field examples', () => {
    it.each(cases)(
        'sends the complete fixed v2 request for $id only after reader action',
        async (example) => {
            const body = JSON.stringify({ example: example.id, data: [] });
            request.mockResolvedValueOnce({
                status: example.expected.status,
                data: body,
                headers: {},
            });
            const wrapper = mount(FieldDemo, { props: { scenario: example.id } });
            expect(request).not.toHaveBeenCalled();
            expect(wrapper.get('details').text()).toContain(
                (example.source_class ?? example.source).split('.').at(-1) + '.php',
            );
            expect(wrapper.get('details').text()).toContain('FieldRecords.php');
            await button(wrapper, 'Send request').trigger('click');
            await flushPromises();
            expect(request.mock.calls[0][0].url).toBe(
                `https://docs.example.test/dapter/data/${example.source}`,
            );
            expect(JSON.parse(request.mock.calls[0][0].data)).toEqual(example.request);
            expect(responseBlock(wrapper).props('code')).toBe(body);
            expect(wrapper.get('[role="status"]').text()).toContain(
                `Received HTTP ${example.expected.status}`,
            );
            await button(wrapper, 'Reset').trigger('click');
            expect(responseBlock(wrapper)).toBeUndefined();
        },
    );

    it('sends the documented empty multiple list without replacing it with null', async () => {
        const example = cases.find((item) => item.id === 'FilterNull');
        request.mockResolvedValueOnce({
            status: 422,
            data: '{"error":{"kind":"validation"}}',
            headers: {},
        });
        const wrapper = mount(FieldDemo, { props: { scenario: example.id } });
        await button(wrapper, 'Reject empty selection').trigger('click');
        await flushPromises();
        expect(JSON.parse(request.mock.calls[0][0].data)).toEqual(example.empty_request);
        expect(wrapper.get('[role="status"]').text()).toContain('Received HTTP 422');
    });

    it('cancels a pending read and ignores its late response after reset', async () => {
        let complete;
        request.mockReturnValueOnce(
            new Promise((resolve) => {
                complete = resolve;
            }),
        );
        const wrapper = mount(FieldDemo, { props: { scenario: cases[0].id } });
        await button(wrapper, 'Send request').trigger('click');
        expect(button(wrapper, 'Send request').props('disabled')).toBe(true);
        const signal = request.mock.calls[0][0].signal;
        await button(wrapper, 'Reset').trigger('click');
        expect(signal.aborted).toBe(true);
        complete({ status: 200, data: '{}', headers: {} });
        await flushPromises();
        expect(responseBlock(wrapper)).toBeUndefined();
        expect(wrapper.get('[role="status"]').text()).toContain('Ready.');
    });

    it('shows transport failure and permits retry', async () => {
        request.mockRejectedValueOnce(new HttpNetworkError('Disconnected'));
        request.mockResolvedValueOnce({ status: 200, data: '{}', headers: {} });
        const wrapper = mount(FieldDemo, { props: { scenario: cases[0].id } });
        await button(wrapper, 'Send request').trigger('click');
        await flushPromises();
        expect(wrapper.get('[role="alert"]').text()).toContain('Check the connection');
        await button(wrapper, 'Send request').trigger('click');
        await flushPromises();
        expect(wrapper.find('[role="alert"]').exists()).toBe(false);
        expect(responseBlock(wrapper).props('code')).toBe('{}');
    });
});
