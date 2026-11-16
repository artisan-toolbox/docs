import { runInNewContext } from 'node:vm';
import * as vite from 'vite';
import * as vuePlugin from '@vitejs/plugin-vue';
import { compileScript, parse } from '@vue/compiler-sfc';
import * as vue from 'vue';
import { http } from '@inertiajs/core';
import { DataAdapter, useDataAdapter } from '@artisan-toolbox/dapter';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import ts from 'typescript';
import Installation from '../../pages/docs/dapter/Installation.vue';
import Composable from '../../pages/docs/dapter/Composable.vue';
import CodeExample from './CodeExample.vue';
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
const navigation = [
    'dapter/installation',
    'dapter/listing',
    'dapter/sources',
    'dapter/development',
].map((slug) => ({ slug, href: `/docs/${slug}`, children: [] }));
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
function executeConfiguration(code) {
    const compiled = ts.transpileModule(code, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
        reportDiagnostics: true,
    });
    expect(compiled.diagnostics).toEqual([]);
    const configurationModule = { exports: {} };
    runInNewContext(
        compiled.outputText,
        {
            exports: configurationModule.exports,
            require(specifier) {
                if (specifier === 'vite') return vite;
                if (specifier === '@vitejs/plugin-vue') return vuePlugin;
                if (specifier === 'vue') return vue;
                if (specifier === '@artisan-toolbox/dapter') return { DataAdapter, useDataAdapter };
                throw new Error(`Unexpected configuration dependency ${specifier}.`);
            },
        },
        { timeout: 1000 },
    );
    return configurationModule.exports.default;
}

describe('Dapter required source-Vue installation', () => {
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
    });

    it('compiles and runs the displayed bound consumer through the installed public APIs', async () => {
        const wrapper = render(Composable);
        const code = example(wrapper, 'Bind the headless component');
        const { descriptor, errors } = parse(code);
        expect(errors).toEqual([]);
        const script = compileScript(descriptor, {
            id: 'documented-shared-consumer',
            inlineTemplate: true,
        });
        const consumer = mount(executeConfiguration(script.content));
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
