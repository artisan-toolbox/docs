import { compileFunction } from 'node:vm';
import * as vite from 'vite';
import * as vuePlugin from '@vitejs/plugin-vue';
import { compileScript, parse } from '@vue/compiler-sfc';
import * as vue from 'vue';
import { http } from '@inertiajs/core';
import { DataAdapter, useDataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { DataGrid } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { route } from 'ziggy-js';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import ts from 'typescript';
import Installation from '../../pages/docs/dapter/Installation.vue';
import Composable from '../../pages/docs/dapter/Composable.vue';
import Listing from '../../pages/docs/dapter/Listing.vue';
import Actions from '../../pages/docs/dapter/Actions.vue';
import InfiniteLoading from '../../pages/docs/dapter/InfiniteLoading.vue';
import actionPage from '../demo/dapter/actions/wire-v1.json';
import CodeExample from './CodeExample.vue';
import { sourceNavigation } from './sourceNavigationFixture';
import { page, response } from '../demo/dapter/listing/testFixtures';

enableAutoUnmount(afterEach);
const originalClient = http.getClient();
const request = vi.fn();
beforeEach(() => {
    request.mockReset().mockResolvedValue(response(page()));
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
const navigation = sourceNavigation();
function render(component) {
    return mount(component, {
        props: { page: { package: {}, requirements: [] }, navigation },
        global: {
            stubs: {
                PackageGuideHeader: true,
                Requirements: true,
                InstallCommand: true,
                SharedAdapterDemo: true,
                GetterDemo: true,
                ListingDemo: true,
                ActionDemo: true,
                InfiniteDemo: true,
                ManualAppendDemo: true,
            },
        },
    });
}
function example(wrapper, label) {
    const component = wrapper
        .findAllComponents(CodeExample)
        .find((item) => item.props('label') === label);
    expect(component, label).toBeDefined();
    return component.props('code');
}
function executeConfiguration(code, bindings = {}) {
    const compiled = ts.transpileModule(code, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
        reportDiagnostics: true,
    });
    expect(compiled.diagnostics).toEqual([]);
    const configurationModule = { exports: {} };
    const scope = {
        ...bindings,
        exports: configurationModule.exports,
        require(specifier) {
            if (specifier === 'vite') return vite;
            if (specifier === '@vitejs/plugin-vue') return vuePlugin;
            if (specifier === 'vue') return vue;
            if (specifier === '@artisan-toolbox/dapter') return { DataAdapter, useDataAdapter };
            if (specifier === '@artisan-toolbox/front-awesome/components/WebAwesome')
                return { Button };
            if (specifier === '@artisan-toolbox/front-awesome/components/WebAwesome/Pro')
                return { DataGrid };
            if (specifier === '@inertiajs/core') return { http };
            if (specifier === 'ziggy-js') return { route };
            if (specifier === './ziggy.js') return { Ziggy: bindings.routeMap };
            throw new Error(`Unexpected configuration dependency ${specifier}.`);
        },
    };
    // Realms have distinct Object prototypes. Dapter checks action payloads for plain objects.
    compileFunction(compiled.outputText, Object.keys(scope))(...Object.values(scope));
    return configurationModule.exports.default;
}
function mountExample(wrapper, label) {
    const { descriptor, errors } = parse(example(wrapper, label));
    expect(errors).toEqual([]);
    const script = compileScript(descriptor, { id: label, inlineTemplate: true });
    return mount(executeConfiguration(script.content));
}

describe('Dapter required source-Vue installation', () => {
    it('configures the server before npm and exposes the route map before the first client read', () => {
        const wrapper = render(Installation);
        expect(
            wrapper.findAll('install-command-stub').map((item) => item.attributes('command')),
        ).toEqual(['composer', 'ziggy', 'frontend']);
        expect(example(wrapper, 'Expose Laravel routes before Vite').split('\n')[0]).toBe(
            '@routes',
        );
        expect(example(wrapper, 'Expose Laravel routes before Vite')).toContain('@vite(');
        const routeMap = globalThis.Ziggy;
        delete globalThis.Ziggy;
        executeConfiguration(example(wrapper, 'Use an existing generated route map'), {
            globalThis,
            routeMap,
        });
        const log = vi.fn();
        executeConfiguration(example(wrapper, 'Check the named read route'), { console: { log } });
        expect(log).toHaveBeenCalledWith(true);
        expect(route('dapter.data', { source: 'Dapter.Quickstart' })).toBe(
            'https://docs.example.test/dapter/data/Dapter.Quickstart',
        );
    });
    it('executes the exact displayed Vite config through the real public tooling APIs', () => {
        const wrapper = render(Installation);
        const configuration = executeConfiguration(
            example(wrapper, 'Required Vite source configuration'),
        );
        expect(configuration.plugins.some((plugin) => plugin.name === 'vite:vue')).toBe(true);
        expect(configuration.optimizeDeps.exclude).toContain('@artisan-toolbox/dapter');
        const text = wrapper.text();
        expect(text.indexOf('Required Vite source configuration')).toBeLessThan(
            text.indexOf('Check the frontend identity'),
        );
        expect(text).toContain('Keep your existing Laravel and Inertia plugins');
        expect(text).toContain('restart the Vite development process');
        expect(text).toContain('Actions use server-generated URLs from authorized metadata');
        expect(text).toContain('does not need to be exposed through Ziggy');
        expect(text).not.toContain('also expose dapter.action');
    });

    it('compiles and runs the displayed bound consumer through the installed public APIs', async () => {
        const wrapper = render(Composable);
        const consumer = mountExample(wrapper, 'Bind the headless component');
        await flushPromises();
        expect(request).toHaveBeenCalledTimes(1);
        expect(request.mock.calls[0][0].url).toBe(
            'https://docs.example.test/dapter/data/Dapter.Quickstart',
        );
        expect(consumer.get('pre').text()).toContain('Notebook 01');
        expect(consumer.get('pre').text()).toContain('Notebook 10');
        expect(wrapper.get('a[href="/docs/dapter/installation#vite-config"]').text()).toBe(
            'required Vue source configuration',
        );
    });
});

describe('Standalone Dapter guide examples', () => {
    it('supplies the Pro grid with the current page and the three advertised columns', async () => {
        request
            .mockResolvedValueOnce(response(page(1, 5)))
            .mockResolvedValueOnce(response(page(2, 5)));
        const consumer = mountExample(render(Listing), 'Source-only Vue adapter');
        await flushPromises();
        const grid = consumer.getComponent(DataGrid);
        expect(grid.vm.$attrs.data).toEqual(page(1, 5).data);
        expect(grid.vm.$attrs).toMatchObject({ server: true, paginate: false, total: 23 });
        expect(grid.vm.$attrs.columns.map((column) => column.field)).toEqual([
            'id',
            'name',
            'category',
        ]);
        expect(
            grid.vm.$attrs.columns.every((column) => !column.sortable && !column.filterable),
        ).toBe(true);
        await consumer.getComponent(Button).trigger('click');
        await flushPromises();
        expect(grid.vm.$attrs.data).toEqual(page(2, 5).data);
    });

    it('appends two offset pages in the copied quickstart and disables Load more at 23 notebooks', async () => {
        for (const current of [1, 2, 3]) {
            const wire = page(current);
            wire.version = wire.requested.version = 2;
            wire.metadata = { records: { mode: 'unidentified' }, channel: null };
            request.mockResolvedValueOnce(response(wire));
        }
        const consumer = mountExample(render(InfiniteLoading), 'Append the next page of notebooks');
        await flushPromises();
        expect(JSON.parse(request.mock.calls[0][0].data)).toEqual({ version: 2 });
        expect(consumer.findAll('li')).toHaveLength(10);
        for (const size of [20, 23]) {
            await consumer.get('button').trigger('click');
            await flushPromises();
            const rows = consumer.findAll('li');
            expect(rows).toHaveLength(size);
            expect(rows[0].text()).toBe('Notebook 01');
            expect(rows.at(-1).text()).toBe(`Notebook ${size}`);
        }
        expect(consumer.get('button').element.disabled).toBe(true);
    });

    it('starts the fictional session before reading the action, then saves and reloads explicitly', async () => {
        globalThis.Ziggy.routes['demo.dapter.actions.start'] = {
            uri: 'demo/dapter/actions/start',
            methods: ['POST'],
        };
        const reloaded = structuredClone(actionPage);
        reloaded.data.forEach((row) => (row.writes = 1));
        request
            .mockResolvedValueOnce(response({ count: 0 }))
            .mockResolvedValueOnce(response(actionPage))
            .mockResolvedValueOnce(response({ saved: true, count: 1 }))
            .mockResolvedValueOnce(response(reloaded));
        const consumer = mountExample(render(Actions), 'Save JSON and read back the counter');
        const button = (label) =>
            consumer.findAllComponents(Button).find((item) => item.text() === label);
        expect(request).not.toHaveBeenCalled();
        await button('Start action demo').trigger('click');
        await flushPromises();
        expect(request.mock.calls.map(([config]) => new URL(config.url).pathname)).toEqual([
            '/demo/dapter/actions/start',
            '/dapter/data/Dapter.ActionCatalog',
        ]);
        await button('Save JSON').trigger('click');
        await flushPromises();
        expect(request.mock.lastCall[0].url).toBe(actionPage.actions.save.url);
        expect(consumer.text()).toContain('Confirmed counter 1');
        expect(consumer.text()).toContain('Visible write counter 0');
        await button('Explicitly reload rows').trigger('click');
        await flushPromises();
        expect(consumer.text()).toContain('Visible write counter 1');
    });
});
