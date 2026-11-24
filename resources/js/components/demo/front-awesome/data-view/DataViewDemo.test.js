import { http } from '@inertiajs/core';
import {
    Button,
    Checkbox,
    Input,
    Select,
} from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vite-plus/test';
import DataViewDemo from './DataViewDemo.vue';
import * as dataView from '@artisan-toolbox/front-awesome/data-view';
import PressroomDemo from './PressroomDemo.vue';
import TableFeedbackDemo from './TableFeedbackDemo.vue';
import DataViewSession from './DataViewSession.vue';
import ContextOwner from './ContextOwner.vue';
import { supportsDataViewPreview } from './PreviewAvailability.vue';
import CapabilityDemo from './CapabilityDemo.vue';
import ActionDemo from './ActionDemo.vue';
import composed from '../../dapter/composed/wire.json';
import actions from '../../dapter/actions/wire-v2.json';

const { DataView } = dataView;
enableAutoUnmount(afterEach);
const originalClient = http.getClient();
const request = vi.fn();

beforeEach(() => {
    request.mockReset();
    http.setClient({ request });
    globalThis.Ziggy = {
        url: 'https://docs.example.test',
        port: null,
        defaults: {},
        routes: {
            'dapter.data': { uri: 'dapter/data/{source}', methods: ['POST'] },
            'demo.dapter.actions.start': { uri: 'demo/dapter/actions/start', methods: ['POST'] },
        },
    };
});

afterEach(() => {
    http.setClient(originalClient);
    delete globalThis.Ziggy;
});

function json(data, status = 200) {
    return { status, data: JSON.stringify(data), headers: { 'content-type': 'application/json' } };
}

function catalogPage(current, total = 2) {
    const paging = { mode: 'offset', current, per_page: 1 };
    return json({
        version: 1,
        data: total ? [{ id: current, name: `Notebook ${current}`, category: 'Plain' }] : [],
        requested: {
            version: 1,
            fields: {},
            global: {},
            searchMatch: 'all',
            order: { kind: 'default' },
            paging,
        },
        state: { order: { kind: 'source' }, paging },
        paging: {
            ...paging,
            pages: Math.max(1, total),
            total,
            filtered: total,
            has_previous: current > 1,
            has_next: current < total,
        },
        capabilities: {
            fields: {},
            global: {
                multi_order: false,
                multi_order_limit: 1,
                searchMatch: { default: 'all', allowed: ['all'] },
                filters: null,
                search: null,
                order: null,
            },
            paging: { mode: 'offset', per_page: 1, per_page_options: [1] },
        },
    });
}

function mountCatalog() {
    return mount(DataViewDemo, {
        global: { stubs: { DemoFrame: { template: '<section><slot /></section>' } } },
    });
}

async function click(wrapper, label) {
    const button = wrapper.findAll('button, wa-button').find((item) => {
        const visible = item.element.cloneNode(true);
        visible.querySelectorAll('[aria-hidden="true"]').forEach((node) => node.remove());
        return visible.textContent.trim() === label;
    });
    expect(button, `Button ${label}`).toBeDefined();
    await button.trigger('click');
    await flushPromises();
}

it('reads each reactive source through the same context owner', async () => {
    request.mockResolvedValue(json(composed));
    const wrapper = mount(ContextOwner, {
        props: { source: 'FrontAwesome.Notebooks', keys: [1] },
        global: { stubs: { DataView: true } },
    });
    await flushPromises();
    await wrapper.setProps({ source: 'Dapter.Quickstart' });
    await flushPromises();
    expect(request.mock.calls.map(([config]) => new URL(config.url).pathname)).toEqual([
        '/dapter/data/FrontAwesome.Notebooks',
        '/dapter/data/Dapter.Quickstart',
    ]);
});

it('keeps the accepted rows and the pending Dapter request across layout changes', async () => {
    const second = Promise.withResolvers();
    request.mockResolvedValueOnce(catalogPage(1)).mockReturnValueOnce(second.promise);
    const wrapper = mountCatalog();
    expect(request).not.toHaveBeenCalled();

    await click(wrapper, 'Start catalog');
    expect(request.mock.calls[0][0].url).toContain('/dapter/data/Dapter.CollectionFluent');
    expect(wrapper.get('tbody strong').text()).toBe('Notebook 1');
    expect(wrapper.get('tbody wa-tag').text()).toBe('Plain');
    const numbered = wrapper.find('wa-pagination');
    if (numbered.exists()) {
        numbered.element.dispatchEvent(
            new CustomEvent('wa-before-page-change', { detail: { page: 2 }, cancelable: true }),
        );
        await flushPromises();
    } else {
        await click(wrapper, 'Next');
    }
    expect(JSON.parse(request.mock.calls[1][0].data).state.paging.current).toBe(2);
    expect(wrapper.findAll('[role="status"]').map((status) => status.text())).toContainEqual(
        expect.stringContaining('Updating results'),
    );

    await click(wrapper, 'Grid');
    expect(wrapper.get('li strong').text()).toContain('Notebook 1');
    second.resolve(catalogPage(2));
    await flushPromises();
    expect(wrapper.get('li strong').text()).toContain('Notebook 2');
    await click(wrapper, 'List');
    expect(wrapper.get('li').text()).toContain('Plain paper');
    expect(wrapper.get('li strong').text()).toBe('Notebook 2');
    await click(wrapper, 'Table');
    expect(wrapper.get('tbody strong').text()).toBe('Notebook 2');
    expect(wrapper.find('wa-pagination, nav').exists()).toBe(true);
    expect(wrapper.getComponent(DataView).props('adapter').paging.current).toBe(2);
    expect(request).toHaveBeenCalledTimes(2);

    const preset = wrapper
        .findAllComponents(Select)
        .find((item) => item.vm.$attrs.label === 'Configured layouts');
    preset.vm.$emit('update:modelValue', 'table');
    await flushPromises();
    expect(wrapper.find('[aria-label="Results layout"]').exists()).toBe(false);
    expect(wrapper.get('tbody strong').text()).toBe('Notebook 2');
    preset.vm.$emit('update:modelValue', 'grid');
    await flushPromises();
    expect(wrapper.find('table').exists()).toBe(false);
    expect(wrapper.find('[aria-label="Results layout"]').exists()).toBe(false);
    expect(wrapper.get('li strong').text()).toContain('Notebook 2');
    expect(request).toHaveBeenCalledTimes(2);
});

it('reports a denied source and distinguishes an accepted empty catalog after reset', async () => {
    request
        .mockResolvedValueOnce(
            json(
                {
                    version: 1,
                    error: {
                        kind: 'access',
                        code: 'access_denied',
                        message: 'Access to this data source was denied.',
                    },
                },
                403,
            ),
        )
        .mockResolvedValueOnce(catalogPage(1, 0));
    const wrapper = mountCatalog();

    await click(wrapper, 'Try denied source');
    expect(request.mock.calls[0][0].url).toContain('/dapter/data/Dapter.CollectionGateDeny');
    expect(wrapper.get('[role="alert"]').text()).toContain('denied');
    expect(wrapper.find('tbody tr').exists()).toBe(false);
    await click(wrapper, 'Reset');
    expect(wrapper.get('[role="status"]').text()).toBe('No source is running.');
    expect(request).toHaveBeenCalledTimes(1);
    await click(wrapper, 'Start catalog');
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    expect(wrapper.findAll('[role="status"]').map((status) => status.text())).toContainEqual(
        expect.stringMatching(/^No (results\.|records yet)$/),
    );
});

it('shows table feedback and custom placeholder cells through the notebook demo controls', async () => {
    const wrapper = mount(TableFeedbackDemo, {
        global: { stubs: { DemoFrame: { template: '<section><slot /></section>' } } },
    });
    expect(request).not.toHaveBeenCalled();
    const available = Array.isArray(DataView.props)
        ? DataView.props.includes('stateLayout')
        : 'stateLayout' in DataView.props;
    if (!available) {
        expect(wrapper.text()).toContain('Table feedback requires Front Awesome beta.10 or later');
        expect(wrapper.findComponent(Button).exists()).toBe(false);
        return;
    }

    const pending = Promise.withResolvers();
    request.mockReturnValueOnce(pending.promise);
    await click(wrapper, 'Open notebook catalog');
    const feedbackRow = wrapper.get('tbody td');
    expect(feedbackRow.attributes('colspan')).toBe('3');
    expect(feedbackRow.text()).toMatch(/loading/i);
    const layout = wrapper
        .findAllComponents(Select)
        .find((select) => select.vm.$attrs.label === 'Table feedback');
    layout.vm.$emit('update:modelValue', 'replace');
    await flushPromises();
    expect(wrapper.find('table').exists()).toBe(false);

    wrapper.getComponent(Checkbox).vm.$emit('update:modelValue', true);
    await flushPromises();
    expect(wrapper.findAll('thead th')).toHaveLength(3);
    expect(wrapper.findAll('tbody tr')).toHaveLength(2);
    for (const row of wrapper.findAll('tbody tr')) {
        expect(row.findAll('td')).toHaveLength(3);
        expect(row.findAll('wa-skeleton')).toHaveLength(2);
    }
    pending.resolve(json(composed));
    await flushPromises();
    expect(wrapper.findAll('tbody tr')).toHaveLength(4);

    const noMatches = structuredClone(composed);
    noMatches.data = [];
    noMatches.requested.global.search = { value: 'envelope' };
    Object.assign(noMatches.paging, { pages: 1, filtered: 0 });
    request.mockResolvedValueOnce(json(noMatches));
    await click(wrapper, 'Search for envelopes');
    expect(wrapper.findAll('tbody tr')).toHaveLength(4);
    expect(wrapper.findAll('wa-skeleton')).toHaveLength(8);
    await vi.waitFor(() => expect(wrapper.text()).toContain('No matching records'), {
        timeout: 3500,
    });
    expect(wrapper.find('table').exists()).toBe(false);

    layout.vm.$emit('update:modelValue', 'row');
    await flushPromises();
    expect(wrapper.get('tbody td').text()).toContain('No matching records');
    const clear = Promise.withResolvers();
    request.mockReturnValueOnce(clear.promise);
    await click(wrapper, 'Clear search');
    expect(wrapper.findAll('tbody tr')).toHaveLength(2);
    clear.resolve(json(composed));
    await flushPromises();

    const empty = structuredClone(noMatches);
    empty.requested.global = {};
    empty.paging.total = 0;
    request.mockResolvedValueOnce(json(empty));
    await click(wrapper, 'Open empty catalog');
    expect(wrapper.get('tbody td').text()).toBe('No records yet');
    expect(request.mock.calls.at(-1)[0].url).toContain('/dapter/data/FrontAwesome.EmptyNotebooks');
});

it('opens the Pressroom queue on demand and preserves ticket identity across presentations', async () => {
    const tickets = [
        {
            id: 417,
            title: 'Check register',
            client: 'Solstice Editions',
            status: 'Needs action',
            owner: 'Nora Chen',
            due: '09:15',
            note: 'Check the magenta outline.',
        },
        {
            id: 416,
            title: 'Approve foil',
            client: 'Field Notes Studio',
            status: 'Waiting',
            owner: 'Ravi Shah',
            due: '09:45',
            note: 'Compare the proofs.',
        },
    ];
    const page = structuredClone(composed);
    page.data = tickets;
    page.paging.total = tickets.length;
    page.paging.filtered = tickets.length;
    request.mockResolvedValue(json(page));
    const wrapper = mount(PressroomDemo, {
        props: { preview: tickets[0] },
        global: { stubs: { DemoFrame: { template: '<section><slot /></section>' } } },
    });
    expect(wrapper.text()).toContain('Preview of the first ticket');
    expect(request).not.toHaveBeenCalled();
    await click(wrapper, 'Open the support queue');
    expect(request.mock.calls[0][0].url).toContain('/dapter/data/FrontAwesome.Pressroom');
    const ids = () => wrapper.findAll('[data-ticket]').map((row) => row.attributes('data-ticket'));
    const expected = tickets.map((ticket) => String(ticket.id));
    expect(ids()).toEqual(expected);
    await click(wrapper, 'List');
    expect(ids()).toEqual(expected);
    expect(wrapper.get('li').text()).toContain(tickets[0].note);
    await click(wrapper, 'Grid');
    expect(ids()).toEqual(expected);
    expect(wrapper.get('li').text()).toContain('Nora Chen');
    expect(wrapper.get('li').text()).toContain('Due 09:15');
    expect(wrapper.get('li').text()).not.toContain(tickets[0].note);
    expect(request).toHaveBeenCalledTimes(1);
});

it('preserves one owner when the reactive source changes', async () => {
    request.mockResolvedValue(catalogPage(1));
    const wrapper = mount(DataViewSession, { props: { source: 'Dapter.CollectionFluent' } });
    await flushPromises();
    const owner = wrapper.findComponent(DataView).props('adapter');
    await wrapper.setProps({ source: 'Dapter.CollectionConfigured' });
    await flushPromises();
    expect(wrapper.findComponent(DataView).props('adapter')).toBe(owner);
    expect(request.mock.calls[1][0].url).toContain('Dapter.CollectionConfigured');
});

it('uses actual built-in capabilities and the original handle in a custom filter slot', async () => {
    request.mockResolvedValue(json(composed));
    const wrapper = mount(CapabilityDemo, {
        global: {
            stubs: {
                DemoFrame: { template: '<section><slot /></section>' },
                PreviewAvailability: { template: '<slot />' },
            },
        },
    });
    expect(request).not.toHaveBeenCalled();
    await click(wrapper, 'Start capabilities');
    const status = wrapper.findAll('th').find((cell) => cell.text() === 'Status');
    expect(status.find('button, wa-button').exists()).toBe(false);
    expect(wrapper.findAll('th')[0].text()).toContain('↕');
    await vi.dynamicImportSettled();
    await flushPromises();
    const sortIcon = wrapper.findAll('th').at(-1).get('wa-icon').element;
    expect(sortIcon.name).toBe(Object.hasOwn(dataView, 'DataViewStatus') ? 'up-down' : 'sort');
    expect(sortIcon.family).toBe('classic');
    const search = wrapper
        .findAllComponents(Input)
        .find((item) => item.vm.$attrs.label === 'Search results');
    search.vm.$emit('update:modelValue', 'Notebook');
    await flushPromises();
    expect(JSON.parse(request.mock.calls.at(-1)[0].data).state.global.search).toEqual({
        value: 'Notebook',
    });
    await click(wrapper, 'Paused notebooks');
    expect(JSON.parse(request.mock.calls.at(-1)[0].data).state.global.filters.status).toEqual({
        value: 'paused',
    });
    await click(wrapper, 'Notebook');
    expect(JSON.parse(request.mock.calls.at(-1)[0].data).state.order.terms[0].field).toBe('name');
    const options = wrapper.find('button[aria-label="View options"]');
    if (options.exists()) {
        await options.trigger('click');
        await click(wrapper, 'Sort');
    }
    const order = wrapper
        .findAllComponents(Select)
        .find(
            (item) =>
                item.vm.$attrs.label ===
                (supportsDataViewPreview(DataView) ? 'Order preset' : 'Order results'),
        );
    order.vm.$emit('update:modelValue', 'reverse');
    await flushPromises();
    expect(JSON.parse(request.mock.calls.at(-1)[0].data).state.order).toEqual({
        kind: 'preset',
        id: 'reverse',
    });
});

it('passes typed action capabilities to the actions slot without a write on mount', async () => {
    const startup = Promise.withResolvers();
    request
        .mockReturnValueOnce(startup.promise)
        .mockResolvedValueOnce(json(actions))
        .mockResolvedValueOnce(json({ saved: true, count: 1 }));
    const wrapper = mount(ActionDemo, {
        global: { stubs: { DemoFrame: { template: '<section><slot /></section>' } } },
    });
    expect(request).not.toHaveBeenCalled();
    await click(wrapper, 'Start actions');
    expect(request).toHaveBeenCalledTimes(1);
    expect(request.mock.calls[0][0]).toMatchObject({
        method: 'post',
        url: 'https://docs.example.test/demo/dapter/actions/start',
        data: {},
    });
    expect(wrapper.findComponent(DataView).exists()).toBe(false);
    expect(wrapper.get('[role="status"]').text()).toContain('Starting');
    expect(
        wrapper
            .findAllComponents(Button)
            .find((item) => item.text() === 'Start actions')
            .props('disabled'),
    ).toBe(true);
    startup.resolve(json({ count: 0 }));
    await flushPromises();
    expect(request).toHaveBeenCalledTimes(2);
    expect(request.mock.calls[1][0].url).toContain('/dapter/data/FrontAwesome.NotebookActions');
    expect(wrapper.get('[data-action-state]').text()).toContain('Shared handle yes');
    await click(wrapper, 'Save fictional notebook');
    expect(request).toHaveBeenCalledTimes(3);
    expect(wrapper.get('[data-action-outcome]').text()).toContain('Outcome completed');
    await click(wrapper, 'Reset actions');
    expect(wrapper.findComponent(DataView).exists()).toBe(false);
    expect(request).toHaveBeenCalledTimes(3);
});

it('reports a failed session startup without reading actions and allows retry', async () => {
    request.mockRejectedValueOnce(new Error('Unavailable'));
    const wrapper = mount(ActionDemo, {
        global: { stubs: { DemoFrame: { template: '<section><slot /></section>' } } },
    });
    expect(request).not.toHaveBeenCalled();
    await click(wrapper, 'Start actions');
    expect(request).toHaveBeenCalledTimes(1);
    expect(wrapper.get('[role="alert"]').text()).toContain('could not start');
    expect(wrapper.findComponent(DataView).exists()).toBe(false);

    request.mockResolvedValueOnce(json({ count: 0 })).mockResolvedValueOnce(json(actions));
    await click(wrapper, 'Start actions');
    expect(request).toHaveBeenCalledTimes(3);
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    expect(wrapper.get('[data-action-state]').text()).toContain('Shared handle yes');
});

it('rechecks the loaded numeric selector and suppresses a pending response after withdrawal', async () => {
    globalThis.Ziggy.routes['demo.dapter.actions.revoke'] = {
        uri: 'demo/dapter/actions/revoke',
        methods: ['POST'],
    };
    const pending = Promise.withResolvers();
    const withdrawn = structuredClone(actions);
    delete withdrawn.actions;
    request
        .mockResolvedValueOnce(json({ count: 0 }))
        .mockResolvedValueOnce(json(actions))
        .mockReturnValueOnce(pending.promise)
        .mockResolvedValueOnce(json({ count: 0 }))
        .mockResolvedValueOnce(json(withdrawn));
    const wrapper = mount(ActionDemo, {
        global: { stubs: { DemoFrame: { template: '<section><slot /></section>' } } },
    });
    await click(wrapper, 'Start actions');
    expect(wrapper.text()).toContain('Save record 1');
    expect(wrapper.text()).not.toContain('Save record 2');
    await click(wrapper, 'Save record 1');
    const write = request.mock.calls[2][0];
    expect(write.url).toMatch(/\/record\/1$/);
    expect(JSON.parse(write.data)).toEqual({ name: 'DataView reader', recordId: 1 });
    await click(wrapper, 'Revoke permission');
    pending.resolve(json({ saved: true, count: 1 }));
    await flushPromises();
    expect(wrapper.find('[data-action-outcome]').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('Save record 1');
    expect(request).toHaveBeenCalledTimes(5);
});

it('rejects before dispatch and keeps an uncertain result until the reader chooses a later action', async () => {
    request
        .mockResolvedValueOnce(json({ count: 0 }))
        .mockResolvedValueOnce(json(actions))
        .mockRejectedValueOnce(new Error('Lost HTTP response'));
    const wrapper = mount(ActionDemo, {
        global: { stubs: { DemoFrame: { template: '<section><slot /></section>' } } },
    });
    await click(wrapper, 'Start actions');
    await click(wrapper, 'Reject before dispatch');
    expect(wrapper.get('[data-action-outcome]').text()).toContain('rejected. Commit not_started');
    expect(request).toHaveBeenCalledTimes(2);
    await click(wrapper, 'Save fictional notebook');
    expect(wrapper.get('[data-action-outcome]').text()).toContain('failed. Commit unknown');
    expect(request).toHaveBeenCalledTimes(3);
});

it('matches availability to the imported public DataView contract', async () => {
    const { default: QueryDemo } = await import('./QueryDemo.vue');
    const wrapper = mount(QueryDemo, {
        global: { stubs: { DemoFrame: { template: '<div><slot /></div>' }, QuerySession: true } },
    });
    const declared = Array.isArray(DataView.props) ? DataView.props : Object.keys(DataView.props);
    const expected =
        process.env.DATA_VIEW_EXPECT_API ??
        (declared.includes('controlLabel') && declared.includes('selection')
            ? 'candidate'
            : 'base');
    expect(['candidate', 'base']).toContain(expected);
    expect(wrapper.find('[data-data-view-preview-required]').exists()).toBe(expected === 'base');
    expect(wrapper.findAllComponents(Button).some((item) => item.text() === 'Start example')).toBe(
        expected === 'candidate',
    );
    expect(request).not.toHaveBeenCalled();
});

it('preserves the selected projected identity through an authorized replacement or displays the base prerequisite', async () => {
    const { default: LiveSession } = await import('./LiveSession.vue');
    const { default: PreviewAvailability } = await import('./PreviewAvailability.vue');
    const { default: wire } = await import('../../dapter/live/wire.json');
    const { h } = await import('vue');
    let receive;
    const channel = {
        listen(_event, callback) {
            receive = callback;
        },
        stopListening(_event, callback) {
            if (receive === callback) receive = undefined;
        },
        error: vi.fn(),
    };
    const signals = new Map();
    channel.subscription = {
        subscribed: false,
        bind: (event, fn) => signals.set(event, fn),
        unbind: (event) => signals.delete(event),
    };
    const connection = {
        state: 'connected',
        bind: (event, fn) => signals.set(event, fn),
        unbind: (event) => signals.delete(event),
    };
    const echo = { private: () => channel, connector: { pusher: { connection } } };
    request.mockResolvedValue(json(wire.LiveIdentity));
    const wrapper = mount(PreviewAvailability, {
        slots: { default: () => h(LiveSession, { mode: 'push', echo }) },
    });
    await flushPromises();
    if (wrapper.find('[data-data-view-preview-required]').exists()) {
        expect(wrapper.text()).toContain('Front Awesome beta.4 required');
        expect(request).not.toHaveBeenCalled();
        return;
    }
    expect(request).toHaveBeenCalledTimes(1);
    const publish = wrapper
        .findAllComponents(Button)
        .find((item) => item.text() === 'Publish replacement');
    expect(publish.props('disabled')).toBe(true);
    expect(wrapper.get('[data-subscription]').text()).toContain('Waiting');
    const acknowledge = signals.get('pusher:subscription_succeeded');
    acknowledge();
    await flushPromises();
    expect(publish.props('disabled')).toBe(false);
    signals.get('state_change')({ current: 'unavailable' });
    await flushPromises();
    expect(publish.props('disabled')).toBe(true);
    acknowledge();
    await flushPromises();
    expect(wire.LiveIdentity.data[0]).not.toHaveProperty('id');
    await wrapper.find('input[type=radio]').setValue(true);
    expect(wrapper.get('[data-live-selection]').text()).toContain('notebook:1');
    expect(typeof receive).toBe('function');
    receive({
        ...wire.LivePrivateUpdate,
        source: 'Dapter.LiveIdentity',
        channel: wire.LiveIdentity.metadata.channel,
        records: {
            mode: 'revisioned',
            format: 'uint64-decimal',
            rows: [{ id: 'notebook:1', revision: '2' }],
        },
    });
    await flushPromises();
    expect(wrapper.get('[data-live-selection]').text()).toContain('Changed notebook 2');
    expect(wrapper.get('[data-live-selection]').text()).toContain('notebook:1');
    expect(request).toHaveBeenCalledTimes(1);
    wrapper.unmount();
    expect(receive).toBeUndefined();
    expect(signals.size).toBe(0);
    expect(acknowledge).not.toThrow();
});

it('supplies the named recovery routes and clock wiring used by the start controls', async () => {
    const { default: PagingDemo } = await import('./PagingDemo.vue');
    for (const [source, prefix] of [
        ['Dapter.PagingRecovery', 'paging'],
        ['Dapter.InfiniteRecovery', 'infinite'],
    ]) {
        const wrap = mount(PagingDemo, {
            props: { source, title: source },
            global: {
                stubs: {
                    DemoFrame: {
                        name: 'DemoFrame',
                        props: ['sources'],
                        template: '<div><slot /></div>',
                    },
                },
            },
        });
        const sources = wrap.getComponent({ name: 'DemoFrame' }).props('sources');
        const routes = sources.find((entry) => entry.label.includes('routes/web.php')).code;
        expect(routes).toContain('demo.dapter.' + prefix + '.reset');
        expect(routes).toContain('use Illuminate\\Support\\Facades\\Route;');
        if (prefix === 'paging')
            expect(
                sources.find((entry) => entry.label.includes('bootstrap/app.php')).code,
            ).toContain('$middleware->web(append: [DemonstrationClock::class])');
        expect(
            wrap.findAllComponents(Button).some((button) => button.text() === 'Start traversal'),
        ).toBe(true);
    }
});

it('includes its live fixture routes, provider registration, and registered classes in the source panel', async () => {
    const { default: LiveDemo } = await import('./LiveDemo.vue');
    const wrap = mount(LiveDemo, {
        props: { mode: 'push' },
        global: {
            stubs: {
                DemoFrame: {
                    name: 'DemoFrame',
                    props: ['sources'],
                    template: '<div><slot /></div>',
                },
            },
        },
    });
    const sources = wrap.getComponent({ name: 'DemoFrame' }).props('sources');
    expect(sources.find((entry) => entry.label.startsWith('routes/web.php')).code).toContain(
        "->name('demo.dapter.live.')",
    );
    expect(sources.find((entry) => entry.label.startsWith('AppServiceProvider')).code).toContain(
        'Configuration::register()',
    );
    const config = sources.find((entry) => entry.label === 'Configuration.php').code;
    for (const [, name] of config.matchAll(
        /\b(Live[A-Z]\w*|PublicContexts|PublicProjection)::class/g,
    )) {
        expect(sources.some((entry) => entry.label === name + '.php')).toBe(true);
    }
});
