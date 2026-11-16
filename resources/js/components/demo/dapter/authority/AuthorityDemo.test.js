import { http } from '@inertiajs/core';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import CodeExample from '@/components/docs/CodeExample.vue';
import { intent, page, response } from '../listing/testFixtures';
import AuthorityDemo from './AuthorityDemo.vue';

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
});
afterEach(() => {
    http.setClient(originalClient);
    delete globalThis.Ziggy;
});
const action = (wrapper, label) =>
    wrapper.findAllComponents(Button).find((item) => item.text() === label);
const block = (wrapper, label) =>
    wrapper.findAllComponents(CodeExample).find((item) => item.props('label') === label);
async function click(wrapper, label) {
    await action(wrapper, label).trigger('click');
    await flushPromises();
}

describe('Dapter server authority example', () => {
    it('waits for an action and sends the allowed request to the named public route', async () => {
        const actual = page(1, 10, [5, 10], 5);
        request.mockResolvedValue(response(actual));
        const wrapper = mount(AuthorityDemo);
        expect(request).not.toHaveBeenCalled();
        const disclosure = wrapper.get('details').text();
        expect(disclosure).toContain('CollectionFluent.php');
        expect(disclosure).toContain('CollectionFixture.php');
        expect(disclosure).toContain('FixtureProducts.php');
        expect(disclosure).toContain('pageSizeOptions([5, 10])');
        await click(wrapper, 'Request allowed size 10');
        const configuration = request.mock.calls[0][0];
        expect(configuration.url).toBe(
            'https://docs.example.test/dapter/data/Dapter.CollectionFluent',
        );
        expect(configuration.method).toBe('post');
        expect(configuration.headers.Accept).toBe('application/json');
        expect(JSON.parse(configuration.data)).toEqual({ version: 1, state: intent(1, 10) });
        expect(block(wrapper, 'Actual outgoing request').props('code')).toBe(
            JSON.stringify({ version: 1, state: intent(1, 10) }, null, 2),
        );
        expect(block(wrapper, 'Actual server response').props('code')).toBe(
            JSON.stringify(actual, null, 2),
        );
        expect(wrapper.get('[role="status"]').text()).toContain('Default size remains 5.');
    });

    it.each([
        ['Request disallowed size 7', 'validation', intent(1, 7)],
        [
            'Request undeclared field',
            'unsupported_operation',
            { ...intent(1, 5), fields: { name: { search: 'Notebook' } } },
        ],
    ])(
        'shows real validation feedback for %s and recovers with an allowed request',
        async (label, kind, state) => {
            request
                .mockResolvedValueOnce(response({ errors: { _dapter_kind: [kind] } }, 422))
                .mockResolvedValueOnce(response(page(1, 10, [5, 10], 5)));
            const wrapper = mount(AuthorityDemo);
            await click(wrapper, label);
            expect(JSON.parse(request.mock.calls[0][0].data)).toEqual({ version: 1, state });
            expect(wrapper.get('[role="alert"]').text()).toContain('HTTP 422');
            expect(block(wrapper, 'Actual server response')).toBeUndefined();
            expect(block(wrapper, 'Actual Inertia validation feedback').props('code')).toBe(
                JSON.stringify({ _dapter_kind: kind }, null, 2),
            );
            await click(wrapper, 'Request allowed size 10');
            expect(wrapper.find('[role="alert"]').exists()).toBe(false);
            expect(block(wrapper, 'Actual Inertia validation feedback')).toBeUndefined();
            expect(wrapper.get('[role="status"]').text()).toContain(
                'Accepted page 1 with 10 rows.',
            );
        },
    );

    it('preserves outgoing page 999 beside the canonical page 3 acknowledgement', async () => {
        const actual = page(3, 10, [5, 10], 5);
        request.mockResolvedValue(response(actual));
        const wrapper = mount(AuthorityDemo);
        await click(wrapper, 'Request page 999');
        expect(JSON.parse(request.mock.calls[0][0].data).state.paging.current).toBe(999);
        expect(
            JSON.parse(block(wrapper, 'Actual outgoing request').props('code')).state.paging
                .current,
        ).toBe(999);
        expect(
            JSON.parse(block(wrapper, 'Actual server response').props('code')).requested.paging
                .current,
        ).toBe(3);
        expect(wrapper.get('[role="status"]').text()).toContain('Accepted page 3 with 3 rows.');
    });

    it('cancels pending work on Reset and ignores its response after a new request', async () => {
        let complete;
        request.mockReturnValueOnce(
            new Promise((resolve) => {
                complete = resolve;
            }),
        );
        const wrapper = mount(AuthorityDemo);
        await click(wrapper, 'Request allowed size 10');
        expect(wrapper.get('[role="status"]').text()).toContain('Waiting for the server.');
        expect(action(wrapper, 'Request disallowed size 7').props('disabled')).toBe(true);
        await click(wrapper, 'Request page 999');
        expect(request).toHaveBeenCalledTimes(1);
        const signal = request.mock.calls[0][0].signal;
        await click(wrapper, 'Reset');
        expect(signal.aborted).toBe(true);
        request.mockResolvedValueOnce(response(page(3, 10, [5, 10], 5)));
        await click(wrapper, 'Request page 999');
        complete(response(page(1, 10, [5, 10], 5)));
        await flushPromises();
        expect(wrapper.get('[role="status"]').text()).toContain('Accepted page 3 with 3 rows.');
        await click(wrapper, 'Reset');
        expect(wrapper.get('[role="status"]').text()).toBe('Ready. Choose a request to start.');
        expect(block(wrapper, 'Actual server response')).toBeUndefined();
    });

    it('reports transport failure without displaying a successful result and retries', async () => {
        request
            .mockRejectedValueOnce(new Error('Disconnected'))
            .mockResolvedValueOnce(response(page(1, 10, [5, 10], 5)));
        const wrapper = mount(AuthorityDemo);
        await click(wrapper, 'Request allowed size 10');
        expect(wrapper.get('[role="alert"]').text()).toContain('Check the connection');
        expect(block(wrapper, 'Actual server response')).toBeUndefined();
        await click(wrapper, 'Request allowed size 10');
        expect(wrapper.find('[role="alert"]').exists()).toBe(false);
        expect(wrapper.get('[role="status"]').text()).toContain('Accepted page 1');
    });

    it('cancels a pending request when the example unmounts', async () => {
        let complete;
        request.mockReturnValueOnce(
            new Promise((resolve) => {
                complete = resolve;
            }),
        );
        const wrapper = mount(AuthorityDemo);
        await click(wrapper, 'Request allowed size 10');
        const signal = request.mock.calls[0][0].signal;
        wrapper.unmount();
        expect(signal.aborted).toBe(true);
        complete(response(page(1, 10, [5, 10], 5)));
        await flushPromises();
        expect(request).toHaveBeenCalledTimes(1);
    });
});
