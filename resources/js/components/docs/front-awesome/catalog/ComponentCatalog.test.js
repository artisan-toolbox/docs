import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { compileScript, parse } from '@vue/compiler-sfc';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import catalog from './components.json';
import ComponentCatalog from './ComponentCatalog.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const pages = import.meta.glob(
    '../../../../pages/docs/front-awesome/web-awesome/components/*.vue',
    { eager: true, import: 'default' },
);
const groupNames = {
    actions: 'Actions',
    forms: 'Forms',
    layout: 'Layout',
    navigation: 'Navigation',
    feedback: 'Feedback',
    media: 'Media',
    'data-viz': 'DataViz',
    helpers: 'Helpers',
};
const slugs = [
    'front-awesome/installation',
    'front-awesome/web-awesome',
    'front-awesome/button',
    'front-awesome/input',
    'front-awesome/icon',
    'front-awesome/page',
    'front-awesome/toasts/laravel',
    'front-awesome/toasts/vue',
    ...catalog.groups.map((group) => `front-awesome/web-awesome/components/${group.id}`),
];
const navigation = (prefix = '/docs') => [
    ...slugs
        .filter((slug) => !slug.startsWith('front-awesome/web-awesome/components/'))
        .map((slug) => ({ slug, href: `${prefix}/${slug}`, children: [] })),
    {
        slug: 'front-awesome/web-awesome/components',
        href: `${prefix}/front-awesome/web-awesome/components`,
        children: catalog.groups.map((group) => ({
            slug: `front-awesome/web-awesome/components/${group.id}`,
            href: `${prefix}/front-awesome/web-awesome/components/${group.id}`,
            children: [],
        })),
    },
];
function render(name) {
    const component = Object.entries(pages).find(([path]) => path.endsWith(`/${name}.vue`))[1];
    return mount(component, {
        props: {
            navigation: navigation(),
            page: {
                title: name,
                description: 'Component wrapper catalog.',
                package: {
                    title: 'Front Awesome',
                    documentedVersion: '1.x-dev',
                    stability: 'Work in progress',
                },
            },
        },
    });
}

function nativeValue(control, name) {
    return control.element[name] ?? control.attributes(name);
}

describe('Front Awesome wrapper catalog', () => {
    it('covers every installed Core element once with distinct, explicit Pro and newer upstream entries', () => {
        const manifest = JSON.parse(
            readFileSync(
                resolve(
                    process.cwd(),
                    'node_modules/@awesome.me/webawesome/dist/custom-elements.json',
                ),
                'utf8',
            ),
        );
        const core = manifest.modules
            .flatMap((module) => module.declarations ?? [])
            .flatMap((item) => (item.tagName ? [item.tagName] : []))
            .sort();
        const components = catalog.groups.flatMap((group) => group.components);
        expect(catalog.groups.map((group) => group.title)).toEqual([
            'Actions',
            'Forms',
            'Layout',
            'Navigation',
            'Feedback',
            'Media',
            'Data Viz',
            'Helpers',
        ]);
        expect(components).toHaveLength(91);
        expect(new Set(components.map((item) => item.tag)).size).toBe(91);
        expect(
            components
                .filter((item) => item.edition === 'Core' && !item.since)
                .map((item) => item.tag)
                .sort(),
        ).toEqual(core);
        expect(components.filter((item) => item.edition === 'Pro')).toHaveLength(17);
        expect(
            components
                .filter((item) => item.implementation.state === 'implemented')
                .map((item) => item.implementation.export),
        ).toEqual(['Button', 'ButtonGroup', 'Input', 'Page', 'Tag', 'Tooltip', 'Icon', 'Popover']);
        expect(components.find((item) => item.name === 'Chart')).toMatchObject({
            tag: 'wa-chart',
            edition: 'Pro',
            since: '3.3',
            reference: 'https://webawesome.com/docs/components/chart/',
        });
        expect(components.find((item) => item.name === 'Code Highlighter')).toMatchObject({
            tag: 'wa-code-highlighter',
            edition: 'Core',
            since: '3.15',
            implementation: { state: 'planned' },
        });
        for (const component of components) {
            expect(component.reference).toBe(
                `https://webawesome.com/docs/components/${component.tag.slice(3)}/`,
            );
            expect(component.help.length).toBeGreaterThan(10);
            if (component.implementation.state === 'planned')
                expect(Object.keys(component.implementation)).toEqual(['state']);
        }
    });

    for (const group of catalog.groups) {
        it(`renders ${group.title} controls with real local examples and honest future references`, async () => {
            const wrapper = render(groupNames[group.id]);
            const cards = wrapper.findAll('[data-component]');
            expect(cards).toHaveLength(group.components.length);
            expect(wrapper.text()).toContain('Source preview');
            expect(wrapper.text()).toContain(
                'published 1.0.0-alpha.1 archive lacks Input, Page, Icon',
            );
            for (const component of group.components) {
                const card = wrapper.get(`[data-component="${component.tag}"]`);
                expect(card.text()).toContain(component.name);
                expect(card.text()).toContain(component.help);
                expect(card.text()).toContain(component.edition);
                const reference = wrapper.get(`a[href="${component.reference}"]`);
                expect(reference.attributes('target')).toBe('_blank');
                if (component.implementation.state === 'implemented') {
                    const { anchor, guide, guideFragment } = component.implementation;
                    expect(card.get('wa-button').text()).toContain('Implemented');
                    expect(card.get(`wa-popover a[href="#${anchor}"]`).text()).toBe(
                        'Basic example',
                    );
                    expect(wrapper.findAll(`[id="${anchor}"]`)).toHaveLength(1);
                    if (guide !== `front-awesome/web-awesome/components/${group.id}`) {
                        expect(
                            wrapper.find(`a[href="/docs/${guide}${guideFragment}"]`).exists(),
                        ).toBe(true);
                    }
                } else {
                    expect(card.text()).toContain('In future');
                    expect(card.find('a[href^="#"], [disabled], [aria-disabled]').exists()).toBe(
                        false,
                    );
                }
            }
            const examples = wrapper.findAll('pre code').map((block) => block.text());
            expect(examples).toHaveLength(
                group.components.filter((item) => item.implementation.state === 'implemented')
                    .length,
            );
            for (const [index, code] of examples.entries()) {
                const { descriptor, errors } = parse(code);
                expect(errors).toEqual([]);
                expect(descriptor.scriptSetup.lang).toBeUndefined();
                expect(() =>
                    compileScript(descriptor, { id: `${group.id}-${index}` }),
                ).not.toThrow();
                expect(descriptor.scriptSetup.content).toContain(
                    '@artisan-toolbox/front-awesome/components',
                );
            }
            if (examples.length) expect(wrapper.text()).toContain('Expected result.');
            await wrapper.setProps({ navigation: navigation('/reference') });
            expect(wrapper.find('a[href="/reference/front-awesome/installation"]').exists()).toBe(
                true,
            );
            wrapper.unmount();
        });
    }

    it('uses one native WA status button per component with rich Popover links', async () => {
        const wrapper = render('Actions');
        expect(wrapper.get('[aria-label="Component wrapper status"]').classes()).toContain(
            'flex-wrap',
        );
        expect(wrapper.find('wa-tooltip').exists()).toBe(false);
        for (const item of wrapper.findAll('[data-component]')) {
            const control = item.get('wa-button');
            const trigger = item.get('wa-button[id]');
            const panel = item.get('wa-popover');
            expect(item.findAll('wa-button')).toHaveLength(1);
            expect(nativeValue(control, 'size')).toBe('xs');
            expect(nativeValue(control, 'href')).toBeFalsy();
            expect(control.text()).toContain(item.get('h3').text());
            expect(control.attributes('pill')).toBe('');
            expect(nativeValue(trigger, 'type')).toBe('button');
            expect(trigger.classes()).toContain('min-h-11');
            expect(trigger.attributes('aria-label')).toContain('Component details');
            expect(trigger.attributes('aria-haspopup')).toBe('dialog');
            expect(trigger.attributes('aria-controls')).toBe(panel.attributes('id'));
            expect(trigger.attributes('aria-expanded')).toBe('false');
            expect(panel.attributes('for')).toBe(trigger.attributes('id'));
            expect(panel.attributes('role')).toBeUndefined();
            expect(panel.get('h3').text()).toBeTruthy();
            expect(panel.findAll('dt').map((term) => term.text())).toContain('Reviewed baseline');
            expect(panel.findAll('dd').map((value) => value.text())).toContain('3.14.0');
            expect(panel.get('a[href^="https://webawesome.com/"]').attributes('data-popover')).toBe(
                'close',
            );
            expect(trigger.find('a').exists()).toBe(false);
        }
        const implemented = wrapper.get('[data-component="wa-button"]');
        expect(nativeValue(implemented.get('wa-button'), 'variant')).toBe('success');
        expect(nativeValue(implemented.get('wa-button'), 'appearance')).toBe('accent');
        expect(implemented.get('wa-popover a[href="#button"]').text()).toBe('Basic example');
        expect(implemented.get('wa-popover a[href="/docs/front-awesome/button"]').text()).toBe(
            'Full guide',
        );
        const future = wrapper.get('[data-component="wa-copy-button"]');
        expect(nativeValue(future.get('wa-button'), 'variant')).toBe('neutral');
        expect(nativeValue(future.get('wa-button'), 'appearance')).toBe('filled');
        expect(future.find('a[href^="#"]').exists()).toBe(false);
        const panel = implemented.get('wa-popover');
        panel.element.open = true;
        await panel.trigger('wa-after-show');
        expect(implemented.get('wa-button[id]').attributes('aria-expanded')).toBe('true');
        expect(future.get('wa-button[id]').attributes('aria-expanded')).toBe('false');
        panel.element.open = false;
        await panel.trigger('wa-after-hide');
        expect(implemented.get('wa-button[id]').attributes('aria-expanded')).toBe('false');
        await wrapper.setProps({ navigation: navigation('/reference') });
        expect(
            implemented.get('wa-popover a[href="/reference/front-awesome/button"]').exists(),
        ).toBe(true);
        wrapper.unmount();
    });

    it('keeps prose link formatting out of status controls and preserves default prose styling', () => {
        const wrapper = render('Actions');
        const section = wrapper.get('section[aria-labelledby="components"]');
        expect(section.get('h2').text()).toBe('Component status');
        expect(section.classes()).not.toContain('[&_a]:underline');
        const prose = mount(ProseSection, {
            slots: { default: '<a href="/guide">Guide</a>' },
        });
        expect(prose.classes()).toContain('[&_a]:underline');
        expect(wrapper.find('section[aria-labelledby="button"]').classes()).toContain(
            '[&_a]:underline',
        );
        prose.unmount();
        wrapper.unmount();
    });

    it('does not repeat a full-guide link when the component example is already that guide', () => {
        const wrapper = render('Helpers');
        const item = wrapper.get('[data-component="wa-popover"]');
        expect(item.get('wa-popover a[href="#popover"]').text()).toBe('Basic example');
        expect(
            item
                .find(
                    'wa-popover a[href="/docs/front-awesome/web-awesome/components/helpers#popover"]',
                )
                .exists(),
        ).toBe(false);
        expect(item.text()).not.toContain('Full guide');
        wrapper.unmount();
        const popover = catalog.groups
            .find((group) => group.id === 'helpers')
            .components.find((component) => component.tag === 'wa-popover');
        const fragment = popover.implementation.guideFragment;
        popover.implementation.guideFragment = '#wrapper-availability';
        try {
            const distinct = render('Helpers');
            expect(
                distinct
                    .get(
                        '[data-component="wa-popover"] wa-popover a[href="/docs/front-awesome/web-awesome/components/helpers#wrapper-availability"]',
                    )
                    .text(),
            ).toBe('Full guide');
            distinct.unmount();
        } finally {
            popover.implementation.guideFragment = fragment;
        }
    });

    it('uses distinct progress styling without inventing an implementation destination', async () => {
        const component = catalog.groups[0].components[2];
        const previous = component.implementation;
        component.implementation = { state: 'in-progress' };
        try {
            const wrapper = mount(ComponentCatalog, {
                props: { group: 'actions' },
            });
            const item = wrapper.get('[data-component="wa-copy-button"]');
            expect(item.text()).toContain('In progress');
            expect(nativeValue(item.get('wa-button'), 'variant')).toBe('warning');
            expect(item.get('a').attributes('href')).toBe(component.reference);
            expect(item.find('a[href^="#"]').exists()).toBe(false);
            wrapper.unmount();
        } finally {
            component.implementation = previous;
        }
    });

    it('keeps trigger and panel IDs unique when a catalog is repeated', () => {
        const wrapper = mount({
            components: { ComponentCatalog },
            template:
                '<div><ComponentCatalog group="actions" /><ComponentCatalog group="actions" /></div>',
        });
        const ids = wrapper
            .findAll('[data-component] > wa-button[id], [data-component] > wa-popover[id]')
            .map((link) => link.attributes('id'));
        expect(new Set(ids).size).toBe(ids.length);
        wrapper.unmount();
    });

    it('links the Page wrapper to its layout guide while toast remains a service', () => {
        const layout = render('Layout');
        const feedback = render('Feedback');
        expect(
            layout
                .get(
                    'section[aria-labelledby="page"] a[href="/docs/front-awesome/page#render-the-page-and-one-navigation-tree"]',
                )
                .text(),
        ).toBe('Page layout guide');
        expect(layout.get('[data-component="wa-page"]').text()).toContain('Implemented');
        expect(feedback.get('[data-component="wa-toast"]').text()).toContain('In future');
        expect(feedback.findAll('a[href^="/docs/front-awesome/toasts/"]')).toHaveLength(2);
        layout.unmount();
        feedback.unmount();
    });

    it('derives overview counts and group destinations from the visible catalog', async () => {
        const wrapper = render('Index');
        for (const group of catalog.groups) {
            const link = wrapper.get(
                `a[href="/docs/front-awesome/web-awesome/components/${group.id}"]`,
            );
            expect(link.text()).toBe(group.title);
            const implemented = group.components.filter(
                (item) => item.implementation.state === 'implemented',
            ).length;
            expect(link.element.parentElement.textContent).toContain(
                `${implemented} implemented · 0 in progress · ${group.components.length - implemented} in future`,
            );
        }
        expect(wrapper.text()).toContain('2026-11-09');
        expect(wrapper.text()).toContain('73 Core elements');
        const reordered = navigation();
        reordered.at(-1).children.reverse();
        await wrapper.setProps({ navigation: reordered });
        expect(wrapper.findAll('[role="listitem"] a').map((link) => link.text())).toEqual(
            catalog.groups.map((group) => group.title).reverse(),
        );
        await wrapper.setProps({ navigation: navigation('/reference') });
        expect(
            wrapper
                .find('a[href="/reference/front-awesome/web-awesome/components/actions"]')
                .exists(),
        ).toBe(true);
        wrapper.unmount();
    });
});
