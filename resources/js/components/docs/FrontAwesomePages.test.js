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
import Guide1 from '../../pages/docs/front-awesome/Button.vue';
import Guide2 from '../../pages/docs/front-awesome/Configuration.vue';
import Guide3 from '../../pages/docs/front-awesome/Development.vue';
import Guide4 from '../../pages/docs/front-awesome/Index.vue';
import Guide5 from '../../pages/docs/front-awesome/Installation.vue';
import Guide6 from '../../pages/docs/front-awesome/Page.vue';
import Guide7 from '../../pages/docs/front-awesome/Primevue.vue';
import Guide8 from '../../pages/docs/front-awesome/SharedTheme.vue';
import Guide9 from '../../pages/docs/front-awesome/ThemeMaintenance.vue';
import Guide10 from '../../pages/docs/front-awesome/toasts/Laravel.vue';
import Guide11 from '../../pages/docs/front-awesome/toasts/Vue.vue';
import Guide12 from '../../pages/docs/front-awesome/VuePlugin.vue';
import Guide13 from '../../pages/docs/front-awesome/WebAwesome.vue';

const components = {
    'front-awesome/branding': Guide0,
    'front-awesome/button': Guide1,
    'front-awesome/configuration': Guide2,
    'front-awesome/development': Guide3,
    'front-awesome': Guide4,
    'front-awesome/installation': Guide5,
    'front-awesome/page': Guide6,
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

const publishedFixtures = fixtures.map((guide) => {
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
        fixtures: publishedFixtures,
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
                    slug: 'front-awesome/input',
                    text: 'Bind input values and form errors',
                },
                {
                    slug: 'front-awesome/icon',
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
                    slug: 'front-awesome/input',
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
        for (const guide of fixtures) {
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
