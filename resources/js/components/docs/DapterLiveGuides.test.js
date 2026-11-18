import { mount } from '@vue/test-utils';
import { expect, it } from 'vite-plus/test';
import Resources from '../../pages/docs/dapter/Resources.vue';
import Authorization from '../../pages/docs/dapter/LiveAuthorization.vue';
import Updates from '../../pages/docs/dapter/LiveUpdates.vue';
import Races from '../../pages/docs/dapter/RevisionRaces.vue';
import Polling from '../../pages/docs/dapter/Polling.vue';
import { sourceNavigation } from './sourceNavigationFixture';
import { extractDocumentation } from '../../../../scripts/documentation-search.mjs';
it.each([
    [
        Resources,
        'resources',
        'Resources',
        ['ResourceFluent', 'ResourceAttributes'],
        ['sources', 'installation'],
        ['web session', 'CSRF middleware', 'dapter.data'],
        'live-authorization',
    ],
    [
        Authorization,
        'live-authorization',
        'LiveAuthorization',
        ['LiveAttributes', 'LiveShorthand', 'LivePublic'],
        ['installation', 'access/gates'],
        ['retrieveById', 'application encryption key', 'Laravel broadcasting', 'Echo instance'],
        'live-updates#bound-producer',
    ],
    [
        Updates,
        'live-updates',
        'LiveUpdates',
        ['LivePrivate'],
        ['live-authorization'],
        ['Echo instance', 'protocol: 2', 'configured broadcaster', 'queue worker'],
        'revision-races',
    ],
    [
        Races,
        'revision-races',
        'RevisionRaces',
        ['LiveIdentity', 'LiveArrival', 'LiveNative'],
        [],
        [
            'Publish committed row replacements',
            'guard, cache, broadcaster, Echo instance, and delivery worker',
        ],
        'polling',
    ],
    [
        Polling,
        'polling',
        'Polling',
        ['LivePolling', 'LivePollingProps'],
        ['listing'],
        ['web session', 'CSRF middleware', 'dapter.data', 'protocol: 2'],
        'live-updates',
    ],
])(
    'keeps the focused %s guide prerequisites, executable demos, and searchable anchors',
    (component, slug, filename, scenarios, requiredLinks, requirements, nextSlug) => {
        const wrapper = mount(component, {
            props: {
                page: { slug: `dapter/${slug}`, title: filename },
                navigation: sourceNavigation(),
            },
            global: {
                stubs: {
                    PackageGuideHeader: true,
                    LiveDemo: {
                        props: ['scenario'],
                        template: '<div :data-scenario="scenario" />',
                    },
                    ResourceDemo: {
                        props: ['scenario'],
                        template: '<div :data-scenario="scenario" />',
                    },
                },
            },
        });
        expect(
            wrapper.findAll('[data-scenario]').map((node) => node.attributes('data-scenario')),
        ).toEqual(scenarios);
        const start = wrapper.get('section[aria-labelledby="starting-environment"]');
        for (const path of requiredLinks) {
            expect(start.get(`a[href="/docs/dapter/${path}"]`).text()).not.toBe('');
        }
        for (const requirement of requirements) {
            expect(start.text()).toContain(requirement);
        }
        expect(wrapper.get('section[aria-labelledby="next-guide"] a').attributes('href')).toBe(
            `/docs/dapter/${nextSlug}`,
        );
        const extracted = extractDocumentation([
            {
                slug: `dapter/${slug}`,
                title: filename,
                description: 'Unpublished live preview.',
                packageTitle: 'Dapter',
                sourcePath: `resources/js/pages/docs/dapter/${filename}.vue`,
            },
        ]);
        expect(extracted.some((section) => section.anchor === 'starting-environment')).toBe(true);
        expect(extracted.some((section) => section.anchor === 'next-guide')).toBe(true);
    },
);
