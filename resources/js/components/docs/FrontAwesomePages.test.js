import { mount } from '@vue/test-utils';
import { sourceNavigation } from './sourceNavigationFixture';
import Setup from '../../pages/docs/front-awesome/Setup.vue';
import Styling from '../../pages/docs/front-awesome/Styling.vue';
import Toasts from '../../pages/docs/front-awesome/Toasts.vue';
import { describe, expect, it } from 'vite-plus/test';
import fixtures from './front-awesome/legacy-parity.json';
import { installationCommands } from './installationFixture';
import { verifyLegacyPages } from './front-awesome/legacyParity';
import Guide0 from '../../pages/docs/front-awesome/Branding.vue';
import Actions from '../../pages/docs/front-awesome/web-awesome/components/Actions.vue';
import Guide2 from '../../pages/docs/front-awesome/Configuration.vue';
import Guide3 from '../../pages/docs/front-awesome/Development.vue';
import Guide4 from '../../pages/docs/front-awesome/Index.vue';
import Guide5 from '../../pages/docs/front-awesome/Installation.vue';
import Layout from '../../pages/docs/front-awesome/web-awesome/components/Layout.vue';
import Guide7 from '../../pages/docs/front-awesome/Primevue.vue';
import Guide8 from '../../pages/docs/front-awesome/SharedTheme.vue';
import Guide9 from '../../pages/docs/front-awesome/ThemeMaintenance.vue';
import Guide10 from '../../pages/docs/front-awesome/toasts/Laravel.vue';
import Guide11 from '../../pages/docs/front-awesome/toasts/Vue.vue';
import Guide12 from '../../pages/docs/front-awesome/VuePlugin.vue';
import Guide13 from '../../pages/docs/front-awesome/WebAwesome.vue';

const components = {
    'front-awesome/branding': Guide0,
    'front-awesome/configuration': Guide2,
    'front-awesome/development': Guide3,
    'front-awesome': Guide4,
    'front-awesome/installation': Guide5,
    'front-awesome/primevue': Guide7,
    'front-awesome/shared-theme': Guide8,
    'front-awesome/theme-maintenance': Guide9,
    'front-awesome/toasts/laravel': Guide10,
    'front-awesome/toasts/vue': Guide11,
    'front-awesome/vue-plugin': Guide12,
    'front-awesome/web-awesome': Guide13,
};

const publishedInstallationParagraphs = new Map([
    [
        'Start in an existing Laravel application with Inertia, Vue, and Vite. Check the requirements before installing the development branch.',
        'Start in an existing Laravel application with Inertia, Vue, and Vite. Check the requirements before installing the published preview.',
    ],
    [
        "Clone the Front Awesome repository and check out 1.x. In the application root, point Composer to that checkout. Replace the example path with your checkout's path.",
        'Install the published preview from the application root. The Front Awesome repository contains the package source.',
    ],
    [
        'With install-links=true, npm packs and copies each local dependency into node_modules. If Composer links vendor/artisan-toolbox/front-awesome to your checkout, edits reach vendor immediately. Run npm ci in the consuming application to refresh the copy in node_modules, then restart the running Vite server.',
        'With install-links=true, npm packs and copies each file: dependency into node_modules. After Composer installs a new package version, rerun the frontend installation command above and commit the updated package-lock.json. For source edits that keep the same package version, run npm ci to refresh node_modules. Then restart the running Vite server. If you use an optional Composer path repository for package development, repeat this refresh after editing the checkout.',
    ],
    [
        'This first example uses the bundled Web Awesome Core edition. It needs no Pro package or credentials. Front Awesome remains an unpublished development preview, so the local checkout above is required.',
        'This first example uses the bundled Web Awesome Core edition. It needs no Pro package or credentials. Front Awesome is a published preview. Its API can change before the first stable release.',
    ],
]);

const canonicalReferences = {
    'front-awesome/button': {
        slug: 'front-awesome/web-awesome/components/actions',
        hash: '#button',
    },
    'front-awesome/page': { slug: 'front-awesome/web-awesome/components/layout', hash: '#page' },
    'front-awesome/icon': { slug: 'front-awesome/web-awesome/components/media', hash: '#icon' },
};

const publishedFixtures = fixtures.map((source) => {
    const guide = {
        ...source,
        links: source.links.map((link) =>
            canonicalReferences[link.slug]
                ? {
                      ...link,
                      ...canonicalReferences[link.slug],
                      hash: link.hash || canonicalReferences[link.slug].hash,
                  }
                : link,
        ),
    };
    if (guide.slug === 'front-awesome/shared-theme') {
        const index = guide.headings.findIndex((heading) => heading.id === 'check-the-result') + 1;
        return {
            ...guide,
            headings: [
                ...guide.headings.slice(0, index),
                { level: 3, id: undefined, text: 'Shared branding preview' },
                ...guide.headings.slice(index),
            ],
        };
    }
    if (guide.slug === 'front-awesome/web-awesome') {
        return { ...guide, title: 'Web Awesome' };
    }
    if (guide.slug === 'front-awesome') {
        return {
            ...guide,
            examples: [
                {
                    language: 'bash',
                    code: installationCommands('front-awesome').composer.code,
                },
                ...guide.examples,
            ],
        };
    }
    return guide.slug === 'front-awesome/installation'
        ? {
              ...guide,
              paragraphs: guide.paragraphs.map(
                  (paragraph) => publishedInstallationParagraphs.get(paragraph) ?? paragraph,
              ),
          }
        : guide;
});

describe('Front Awesome documentation migration', () => {
    const { render } = verifyLegacyPages({
        fixtures: publishedFixtures.filter((guide) => !canonicalReferences[guide.slug]),
        components,
        packageTitle: 'Front Awesome',
        version: '1.x development branch',
        stability: 'Work in progress',
        allowedExtraLinks: {
            'front-awesome': [
                {
                    slug: 'front-awesome/web-awesome/components',
                    text: 'Vue components catalog',
                },
                {
                    slug: 'front-awesome/web-awesome/components/forms',
                    hash: '#input',
                    text: 'Bind input values and form errors',
                },
                {
                    slug: 'front-awesome/web-awesome/components/media',
                    hash: '#icon',
                    text: 'Render icons with Web Awesome',
                },
            ],
            'front-awesome/web-awesome': [
                {
                    slug: 'front-awesome/web-awesome/components',
                    text: 'Vue components catalog',
                },
            ],
            'front-awesome/installation': [
                {
                    slug: 'front-awesome/web-awesome/components',
                    text: 'Vue components catalog',
                },
                {
                    slug: 'front-awesome/web-awesome/components/forms',
                    hash: '#input',
                    text: 'Bind input values and form errors',
                },
            ],
        },
        installation: {
            installedVersion: '1.x-dev',
            installationStatus: 'installed',
            installationSource: 'local-path',
        },
    });
    it('keeps the development status explicit and preserves compatibility scope', () => {
        for (const guide of publishedFixtures.filter((guide) => !canonicalReferences[guide.slug])) {
            const wrapper = render(guide);
            expect(wrapper.text()).toContain('Work in progress');
            wrapper.unmount();
        }
        const overview = render(fixtures.find((guide) => guide.slug === 'front-awesome'));
        expect(overview.get('aside[aria-label="Caution"]').text()).toContain(
            'Front Awesome has no stable Composer release.',
        );
        expect(overview.findAll('span[id]')).toHaveLength(15);
        overview.unmount();
    });
});

describe('Front Awesome task hubs', () => {
    it.each([
        [
            Setup,
            'Vue integration',
            [
                'front-awesome/installation',
                'front-awesome/vue-plugin',
                'front-awesome/configuration',
            ],
        ],
        [
            Styling,
            'Appearance and branding',
            [
                'front-awesome/shared-theme',
                'front-awesome/branding',
                'front-awesome/primevue',
                'front-awesome/theme-maintenance',
            ],
        ],
        [
            Toasts,
            'Toasts',
            [
                'front-awesome/vue-plugin',
                'front-awesome/toasts/laravel',
                'front-awesome/toasts/vue',
            ],
        ],
    ])(
        'links from %s to prerequisite and task guides through the shared registry',
        async (component, title, destinations) => {
            const wrapper = mount(component, {
                props: {
                    navigation: sourceNavigation(),
                    page: {
                        title,
                        description: title,
                        package: {
                            title: 'Front Awesome',
                            documentedVersion: '1.x-dev',
                            installedVersion: '1.x-dev',
                            installationStatus: 'installed',
                            stability: 'Work in progress',
                        },
                    },
                },
            });
            expect(wrapper.get('h1').text()).toBe(title);
            expect(wrapper.findAll('h2[id]')).toHaveLength(destinations.length);
            expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual(
                destinations.map((slug) => `/docs/${slug}`),
            );
            await wrapper.setProps({
                navigation: sourceNavigation('/reference'),
            });
            expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual(
                destinations.map((slug) => `/reference/${slug}`),
            );
            wrapper.unmount();
        },
    );
});

describe('consolidated Front Awesome references', () => {
    it.each([
        ['front-awesome/button', Actions, ['button', 'button-group']],
        ['front-awesome/page', Layout, ['page']],
    ])(
        'preserves every reviewed source contract and anchor from %s in its category',
        async (oldSlug, component, references) => {
            const guide = publishedFixtures.find((fixture) => fixture.slug === oldSlug);
            const wrapper = mount(component, {
                props: {
                    page: {
                        title: oldSlug === 'front-awesome/button' ? 'Actions' : 'Layout',
                        description: 'Component reference',
                        package: {
                            title: 'Front Awesome',
                            documentedVersion: '1.x-dev',
                            installedVersion: '1.x-dev',
                            installationStatus: 'installed',
                            stability: 'Work in progress',
                        },
                    },
                    navigation: sourceNavigation(),
                },
                global: { stubs: { DemoFrame: true, ComponentCatalog: true } },
            });
            expect(wrapper.get('h1').text()).toBe(
                oldSlug === 'front-awesome/button' ? 'Actions' : 'Layout',
            );
            expect(wrapper.find('dl').exists()).toBe(false);
            expect(
                wrapper
                    .get('[aria-label="Package details"]')
                    .findAll('wa-tag')
                    .map((tag) => tag.text()),
            ).toEqual(['Front Awesome', 'Documented version 1.x-dev', 'Work in progress']);
            const scopes = references.map((name) =>
                wrapper.get(`[data-component-reference="${name}"]`),
            );
            const elements = (selector) => scopes.flatMap((scope) => scope.findAll(selector));
            const normalize = (text) => text.replace(/\s+/g, ' ').trim();
            const text = normalize(scopes.map((scope) => scope.text()).join(' '));

            expect(
                elements('h3').map((heading) => ({
                    level: 2,
                    id: heading.attributes('id'),
                    text: heading.text(),
                })),
            ).toEqual(guide.headings);
            expect(elements('pre code').map((code) => code.element.textContent)).toEqual(
                guide.examples.map((example) => example.code),
            );
            expect(
                elements('pre code').map((code) =>
                    code.classes().find((name) => name.startsWith('language-')),
                ),
            ).toEqual(guide.examples.map((example) => `language-${example.language}`));
            expect(
                elements('table').map((table) =>
                    table
                        .findAll('tr')
                        .map((row) => row.findAll('th, td').map((cell) => normalize(cell.text()))),
                ),
            ).toEqual(guide.tables.map((table) => table.map((row) => row.map(normalize))));
            let paragraphEnd = 0;
            for (const paragraph of guide.paragraphs) {
                const expected = normalize(paragraph);
                const start = text.indexOf(expected, paragraphEnd);
                expect(start, expected).toBeGreaterThanOrEqual(paragraphEnd);
                paragraphEnd = start + expected.length;
            }
            for (const anchor of guide.anchors) {
                expect(wrapper.findAll(`[id="${anchor}"]`)).toHaveLength(1);
            }
            expect(elements('wa-button[aria-label^="Copy "]')).toHaveLength(guide.examples.length);
            const expectedLinks = (prefix) =>
                guide.links.map((link) =>
                    link.slug ? `${prefix}/${link.slug}${link.hash ?? ''}` : link.href,
                );
            expect(elements('a').map((link) => link.attributes('href'))).toEqual(
                expectedLinks('/docs'),
            );
            for (const link of elements('a').filter((link) =>
                /^https?:\/\//.test(link.attributes('href')),
            )) {
                expect(link.attributes('target')).toBe('_blank');
                expect(link.attributes('rel')).toBe('noopener noreferrer');
            }
            await wrapper.setProps({ navigation: sourceNavigation('/reference') });
            expect(elements('a').map((link) => link.attributes('href'))).toEqual(
                expectedLinks('/reference'),
            );
            wrapper.unmount();
        },
    );
});
