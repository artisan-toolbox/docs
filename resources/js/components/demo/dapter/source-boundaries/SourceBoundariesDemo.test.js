import { http } from '@inertiajs/core';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import CodeExample from '@/components/docs/CodeExample.vue';
import { intent, page, response } from '../listing/testFixtures';
import SourceBoundariesDemo from './SourceBoundariesDemo.vue';
import { decodeRecord } from './records';

const originalClient = http.getClient();
const request = vi.fn();
const rows = [
    { id: 101, name: 'North notebook', studio: 'studio-north', source_calls: 1 },
    { id: 102, name: 'North pencil', studio: 'studio-north', source_calls: 1 },
];
function acceptedPage() {
    return {
        ...page(1, 2, [2]),
        data: rows,
        paging: {
            mode: 'offset',
            current: 1,
            pages: 1,
            per_page: 2,
            total: 2,
            filtered: 2,
            has_previous: false,
            has_next: false,
        },
    };
}
const action = (wrapper, label) =>
    wrapper.findAllComponents(Button).find((item) => item.text() === label);
async function click(wrapper, label) {
    await action(wrapper, label).trigger('click');
    await flushPromises();
}
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

describe('Dapter current source boundaries example', () => {
    it('starts on demand and reloads the fixed source through the public adapter', async () => {
        request.mockResolvedValue(response(acceptedPage()));
        const wrapper = mount(SourceBoundariesDemo);
        expect(request).not.toHaveBeenCalled();
        const disclosure = wrapper.get('details').text();
        for (const file of [
            'SourceBoundariesDemo.vue',
            'ScopedRecords.php',
            'FixtureRecords.php',
            'PublicRecord.php',
            'records.js',
        ]) {
            expect(disclosure).toContain(file);
        }
        expect(disclosure).toContain("->where('studio', 'studio-north')");
        expect(disclosure).toContain('private_note');
        await click(wrapper, 'Start example');
        expect(request.mock.calls[0][0].url).toBe(
            'https://docs.example.test/dapter/data/Dapter.ScopedRecords',
        );
        expect(JSON.parse(request.mock.calls[0][0].data)).toEqual({ version: 1 });
        expect(wrapper.findAll('[data-scoped-records] li').map((item) => item.text())).toEqual([
            'North notebook. Source calls 1.',
            'North pencil. Source calls 1.',
        ]);
        expect(
            JSON.parse(
                wrapper
                    .findAllComponents(CodeExample)
                    .find((block) => block.props('label') === 'Accepted public rows')
                    .props('code'),
            ),
        ).toEqual(rows);
        expect(wrapper.get('[role="status"]').text()).toBe(
            'Loaded 2 scoped records. Each source ran once.',
        );
        await click(wrapper, 'Reload records');
        expect(request).toHaveBeenCalledTimes(2);
        expect(JSON.parse(request.mock.calls[1][0].data)).toEqual({
            version: 1,
            state: intent(1, 2),
        });
        await click(wrapper, 'Reset');
        expect(wrapper.find('[data-scoped-records]').exists()).toBe(false);
        expect(
            wrapper
                .findAllComponents(CodeExample)
                .some((block) => block.props('label') === 'Accepted public rows'),
        ).toBe(false);
        expect(wrapper.get('[role="status"]').text()).toBe(
            'Ready. Start the example to read studio-north.',
        );
        await click(wrapper, 'Start example');
        expect(JSON.parse(request.mock.calls[2][0].data)).toEqual({ version: 1 });
    });

    it('unmounts and cancels pending work on Reset without accepting a stale result', async () => {
        let complete;
        request.mockReturnValueOnce(
            new Promise((resolve) => {
                complete = resolve;
            }),
        );
        const wrapper = mount(SourceBoundariesDemo);
        await click(wrapper, 'Start example');
        expect(wrapper.get('[role="status"]').text()).toBe('Reading the scoped source.');
        expect(action(wrapper, 'Reload records').props('disabled')).toBe(true);
        const signal = request.mock.calls[0][0].signal;
        await click(wrapper, 'Reset');
        expect(signal.aborted).toBe(true);
        complete(response(acceptedPage()));
        await flushPromises();
        expect(wrapper.find('[data-scoped-records]').exists()).toBe(false);
        request.mockResolvedValueOnce(response(acceptedPage()));
        await click(wrapper, 'Start example');
        expect(wrapper.findAll('[data-scoped-records] li')).toHaveLength(2);
    });

    it('shows a transport failure and retries without inventing scoped rows', async () => {
        request
            .mockRejectedValueOnce(new Error('Disconnected'))
            .mockResolvedValueOnce(response(acceptedPage()));
        const wrapper = mount(SourceBoundariesDemo);
        await click(wrapper, 'Start example');
        expect(wrapper.get('[role="alert"]').text()).toContain('Use Reload records to try again.');
        expect(wrapper.find('[data-scoped-records]').exists()).toBe(false);
        await click(wrapper, 'Reload records');
        expect(wrapper.find('[role="alert"]').exists()).toBe(false);
        expect(wrapper.findAll('[data-scoped-records] li')).toHaveLength(2);
    });
});

it('validates the received shape without hiding server scope, projection, or lifecycle errors', () => {
    const unexpected = {
        ...rows[0],
        studio: 'studio-south',
        source_calls: 2,
        private_note: 'Unexpected disclosure',
    };
    expect(decodeRecord(unexpected)).toBe(unexpected);
    for (const invalid of [
        null,
        [],
        {},
        { ...rows[0], id: '101' },
        { ...rows[0], source_calls: '1' },
    ]) {
        expect(() => decodeRecord(invalid)).toThrow();
    }
});

it('rejects the whole page when a received row has an invalid public shape', async () => {
    request.mockResolvedValueOnce(
        response({ ...acceptedPage(), data: [rows[0], { ...rows[1], name: null }] }),
    );
    const wrapper = mount(SourceBoundariesDemo);
    await click(wrapper, 'Start example');
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    expect(wrapper.find('[data-scoped-records]').exists()).toBe(false);
});
