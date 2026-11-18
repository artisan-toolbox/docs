import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { http, HttpNetworkError } from '@inertiajs/core';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import CodeExample from '@/components/docs/CodeExample.vue';
import cases from '../../../../../../app/Demo/Dapter/Comparisons/cases.json';
import ComparisonDemo from './ComparisonDemo.vue';

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

describe('source-specific comparison demos', () => {
    it.each(cases)(
        'starts the fixed $id request only after reader action and resets',
        async (example) => {
            const body = JSON.stringify({ data: example.expected.ids });
            request.mockResolvedValueOnce({
                status: example.expected.status,
                data: body,
                headers: {},
            });
            const wrapper = mount(ComparisonDemo, {
                props: { scenario: example.id, postgresEnabled: true },
            });
            expect(request).not.toHaveBeenCalled();
            expect(wrapper.get('details').text()).toContain(
                example.source.split('.').at(-1) + '.php',
            );
            await button(wrapper, 'Start').trigger('click');
            await flushPromises();
            expect(JSON.parse(request.mock.calls[0][0].data)).toEqual(example.request);
            expect(request.mock.calls[0][0].url).toContain(example.source);
            expect(responseBlock(wrapper).props('code')).toBe(body);
            await button(wrapper, 'Reset').trigger('click');
            expect(responseBlock(wrapper)).toBeUndefined();
        },
    );
    it('explains unavailable PostgreSQL without a network request', async () => {
        const wrapper = mount(ComparisonDemo, { props: { scenario: 'PostgresField' } });
        expect(wrapper.get('[role="status"]').text()).toContain('unavailable');
        expect(button(wrapper, 'Start').props('disabled')).toBe(true);
        expect(request).not.toHaveBeenCalled();
    });
    it('cancels a pending read and ignores a late response after Reset', async () => {
        let complete;
        request.mockReturnValueOnce(
            new Promise((resolve) => {
                complete = resolve;
            }),
        );
        const wrapper = mount(ComparisonDemo, { props: { scenario: 'LocaleFluent' } });
        await button(wrapper, 'Start').trigger('click');
        const signal = request.mock.calls[0][0].signal;
        expect(button(wrapper, 'Start').props('disabled')).toBe(true);
        await button(wrapper, 'Reset').trigger('click');
        expect(signal.aborted).toBe(true);
        complete({ status: 200, data: '{}', headers: {} });
        await flushPromises();
        expect(responseBlock(wrapper)).toBeUndefined();
    });
    it('shows a failed transport and allows an explicit retry', async () => {
        request.mockRejectedValueOnce(new HttpNetworkError('Disconnected'));
        request.mockResolvedValueOnce({ status: 200, data: '{}', headers: {} });
        const wrapper = mount(ComparisonDemo, { props: { scenario: 'LocaleFluent' } });
        await button(wrapper, 'Start').trigger('click');
        await flushPromises();
        expect(wrapper.get('[role="alert"]').text()).toContain('try Start again');
        await button(wrapper, 'Start').trigger('click');
        await flushPromises();
        expect(responseBlock(wrapper).props('code')).toBe('{}');
    });
});
