import { mount } from '@vue/test-utils';
import { expect, it } from 'vite-plus/test';
import Vertical from '../../pages/docs/dapter/InfiniteLoading.vue';
import Horizontal from '../../pages/docs/dapter/HorizontalInfiniteLoading.vue';
import Recovery from '../../pages/docs/dapter/InfiniteRecovery.vue';
import { sourceNavigation } from './sourceNavigationFixture';
import { extractDocumentation } from '../../../../scripts/documentation-search.mjs';
const pages = [
    [
        Vertical,
        'InfiniteLoading',
        'infinite-loading',
        ['InfiniteSimple', 'InfiniteJoined'],
        'horizontal-infinite-loading',
    ],
    [
        Horizontal,
        'HorizontalInfiniteLoading',
        'horizontal-infinite-loading',
        ['InfiniteCursor'],
        'infinite-recovery',
    ],
    [
        Recovery,
        'InfiniteRecovery',
        'infinite-recovery',
        ['InfiniteRecovery', 'InfiniteFill'],
        'horizontal-infinite-loading',
    ],
];
it.each(pages)(
    'registers focused %s prerequisites and executable scenarios',
    (component, filename, slug, scenarios, nextSlug) => {
        const wrapper = mount(component, {
            props: {
                page: { slug: `dapter/${slug}`, title: filename },
                navigation: sourceNavigation(),
            },
            global: {
                stubs: {
                    PackageGuideHeader: true,
                    InfiniteDemo: {
                        props: ['scenario'],
                        template: '<div :data-scenario="scenario" />',
                    },
                },
            },
        });
        expect(
            wrapper.findAll('[data-scenario]').map((node) => node.attributes('data-scenario')),
        ).toEqual(scenarios);
        expect(wrapper.get('section[aria-labelledby="starting-environment"]').text()).toContain(
            'Composer dependencies before npm',
        );
        expect(wrapper.text()).toContain('1.0.0-beta.2');
        const nextLinks = wrapper.findAll('section[aria-labelledby="next-guide"] a');
        expect(nextLinks.map((link) => link.attributes('href'))).toEqual([
            '/docs/dapter/installation',
            `/docs/dapter/${nextSlug}`,
        ]);
        if (slug === 'infinite-loading') {
            const examples = wrapper.findAll('[data-manual-append], [data-scenario]');
            expect(examples).toHaveLength(3);
            expect(examples[0].attributes()).toHaveProperty('data-manual-append');
            expect(examples[0].text()).toContain('Start example');
            expect(wrapper.get('section[aria-labelledby="enable-append"]').text()).toContain(
                'default offset pages',
            );
            expect(wrapper.get('section[aria-labelledby="observe-vertical"]').text()).toContain(
                "paging: 'source'",
            );
        }
        const sections = extractDocumentation([
            {
                slug: `dapter/${slug}`,
                title: filename,
                description: 'Guarded infinite loading.',
                packageTitle: 'Dapter',
                sourcePath: `resources/js/pages/docs/dapter/${filename}.vue`,
            },
        ]);
        expect(sections.some((section) => section.anchor === 'starting-environment')).toBe(true);
        expect(sections.some((section) => section.anchor === 'next-guide')).toBe(true);
    },
);
it('states bounded fill, explicit recovery, and start-only URL restoration without snapshot promises', () => {
    const wrapper = mount(Recovery, {
        props: {
            page: { slug: 'dapter/infinite-recovery', title: 'Recover windows' },
            navigation: sourceNavigation(),
        },
        global: { stubs: { PackageGuideHeader: true, InfiniteDemo: true } },
    });
    expect(wrapper.text()).toContain('two appends per continuous visibility episode');
    expect(wrapper.text()).toContain('HTTP 500');
    expect(wrapper.text()).toContain('Click Allow retry, then Retry append');
    expect(wrapper.text()).toContain(
        'does not store all accumulated pages or the exact visible item',
    );
    expect(wrapper.text()).toContain('Scroll memory stores coordinates');
});
