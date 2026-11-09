import { runInNewContext } from 'node:vm';
import { mount } from '@vue/test-utils';
import { compileScript, parse } from '@vue/compiler-sfc';
import * as Vue from 'vue';
import { describe, expect, it, vi } from 'vite-plus/test';
import * as Mosaicast from '@artisan-toolbox/mosaicast';
import Overview from '../../pages/docs/mosaicast/Index.vue';
import Installation from '../../pages/docs/mosaicast/Installation.vue';
import { sourceNavigation } from './sourceNavigationFixture';

const { visits } = vi.hoisted(() => ({ visits: [] }));
vi.mock('@inertiajs/vue3', async () => {
    const { defineComponent, h } = await import('vue');
    return {
        ...(await vi.importActual('@inertiajs/vue3')),
        Link: defineComponent({
            props: {
                href: { type: String, required: true },
                preserveState: Boolean,
            },
            setup(props, { slots }) {
                return () =>
                    h(
                        'a',
                        {
                            href: props.href,
                            onClick: (event) => {
                                event.preventDefault();
                                visits.push({
                                    href: props.href,
                                    preserveState: props.preserveState,
                                });
                                const page = {
                                    props: {
                                        mosaicast: {
                                            sessionIdentifier: null,
                                            events: [
                                                {
                                                    name: 'orders.updated',
                                                    payload: { orderId: 42 },
                                                },
                                            ],
                                        },
                                    },
                                };
                                document.dispatchEvent(
                                    new CustomEvent('inertia:beforeUpdate', {
                                        detail: { page },
                                    }),
                                );
                                document.dispatchEvent(
                                    new CustomEvent('inertia:success', {
                                        detail: { page },
                                    }),
                                );
                            },
                        },
                        slots.default?.(),
                    );
            },
        }),
    };
});
import { Link } from '@inertiajs/vue3';

function render(component, slug) {
    return mount(component, {
        props: {
            navigation: sourceNavigation(),
            page: {
                slug,
                description: 'Deliver a first Mosaicast event.',
                title: slug === 'mosaicast' ? 'Mosaicast' : 'Install Mosaicast',
                requirements: ['PHP 8.5', 'Laravel 13'],
                package: {
                    id: 'mosaicast',
                    title: 'Mosaicast',
                    documentedVersion: '1.2',
                    stability: 'Stable',
                },
            },
        },
    });
}
function compileExample(source) {
    const compiled = compileScript(parse(source).descriptor, {
        id: 'mosaicast-quickstart',
        inlineTemplate: true,
    });
    const code = compiled.content
        .replace(/import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/g, (_, names, module) => {
            const bindings = names.trim().replace(/\s+as\s+/g, ': ');
            return `const { ${bindings} } = modules[${JSON.stringify(module)}];`;
        })
        .replace('export default', 'return');
    return runInNewContext(`(() => { ${code} })()`, {
        console,
        modules: {
            vue: Vue,
            '@inertiajs/vue3': { Link },
            '@artisan-toolbox/mosaicast': Mosaicast,
        },
    });
}

describe('Mosaicast first successful Inertia event', () => {
    it('offers the same complete route and listener on the overview and installation journey', () => {
        const overview = render(Overview, 'mosaicast');
        const installation = render(Installation, 'mosaicast/installation');
        const examples = (wrapper) =>
            [...wrapper.get('#first-event').element.parentElement.querySelectorAll('pre code')].map(
                (node) => node.textContent,
            );
        const overviewCode = examples(overview);

        expect(overviewCode).toEqual(examples(installation));
        expect(overviewCode[0]).toContain(
            "Mosaicast::dispatch('orders.updated', ['orderId' => 42])",
        );
        expect(overviewCode[0]).toContain("return Inertia::render('MosaicastExample')");
        expect(overviewCode.join('\n')).not.toContain('$order');
        expect(overview.get('#first-event').element.parentElement.textContent).toContain(
            'once for that visit',
        );
        expect(
            overview.find('a[href="/docs/mosaicast/installation#register-the-client"]').exists(),
        ).toBe(true);
        expect(installation.find('#send-your-first-event').exists()).toBe(true);
        overview.unmount();
        installation.unmount();
    });

    it('runs the copied Vue sample only after the visit and removes its listener on unmount', async () => {
        const documentation = render(Overview, 'mosaicast');
        const source = documentation
            .findAll('pre code')
            .find((block) => block.text().includes('<script setup>'))
            .text();
        const log = vi.spyOn(console, 'log').mockImplementation(() => {});
        visits.length = 0;
        const sample = mount(compileExample(source), {
            global: { plugins: [Mosaicast.createMosaicast()] },
        });

        expect(log).not.toHaveBeenCalled();
        await sample.get('a').trigger('click');
        expect(visits).toEqual([{ href: '/mosaicast-example?send=1', preserveState: true }]);
        expect(log).toHaveBeenCalledExactlyOnceWith(42, 'inertia');
        sample.unmount();
        Mosaicast.mosaicast().emit('orders.updated', { orderId: 43 }, 'inertia');
        expect(log).toHaveBeenCalledTimes(1);
        documentation.unmount();
        log.mockRestore();
    });
});
