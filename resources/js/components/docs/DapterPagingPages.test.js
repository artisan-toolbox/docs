import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import Simple from '../../pages/docs/dapter/SimplePaging.vue';
import Cursor from '../../pages/docs/dapter/CursorPaging.vue';
import Recovery from '../../pages/docs/dapter/CursorRecovery.vue';
import Counts from '../../pages/docs/dapter/PagingCounts.vue';
import { sourceNavigation } from './sourceNavigationFixture';
import { extractDocumentation } from '../../../../scripts/documentation-search.mjs';

const pages = [
    [
        Simple,
        'simple-paging',
        'SimplePaging',
        ['PagingSimple', 'PagingSimpleAttributes', 'PagingDriver'],
        [],
        [
            'Read and paginate a source',
            'backend commands at the application root before npm',
            'web session',
            'CSRF middleware',
            'dapter.data',
        ],
        'cursor-paging',
    ],
    [
        Cursor,
        'cursor-paging',
        'CursorPaging',
        ['PagingCursor', 'PagingCursorAttributes', 'PagingNative'],
        ['listing'],
        ['protocol: 2', "paging: 'source'", 'application encryption key'],
        'cursor-recovery',
    ],
    [
        Recovery,
        'cursor-recovery',
        'CursorRecovery',
        ['PagingRecovery'],
        [],
        ['Traverse a cursor source', 'app encryption service'],
        'paging-counts',
    ],
    [
        Counts,
        'paging-counts',
        'PagingCounts',
        ['PagingCounts', 'PagingCountsAttributes', 'PagingCountsConfig', 'PagingCountsOff'],
        ['simple-paging', 'cursor-paging'],
        ['protocol 2', 'paging: source'],
        'field-search',
    ],
];
describe('focused working paging guides', () => {
    it.each(pages)(
        'renders stable prerequisites and fixed source examples for %s',
        (component, slug, filename, scenarios, requiredLinks, requirements, nextSlug) => {
            const wrapper = mount(component, {
                props: {
                    page: { slug: `dapter/${slug}`, title: filename },
                    navigation: sourceNavigation(),
                },
                global: {
                    stubs: {
                        PackageGuideHeader: true,
                        PagingDemo: {
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
            const sections = extractDocumentation([
                {
                    slug: `dapter/${slug}`,
                    title: filename,
                    description: 'Working preview pagination.',
                    packageTitle: 'Dapter',
                    sourcePath: `resources/js/pages/docs/dapter/${filename}.vue`,
                },
            ]);
            expect(sections.some((section) => section.anchor === 'starting-environment')).toBe(
                true,
            );
            expect(sections.some((section) => section.anchor === 'next-guide')).toBe(true);
        },
    );
    it('documents trusted scope and real expiry isolation separately from snapshot promises', () => {
        const wrapper = mount(Recovery, {
            props: {
                page: { slug: 'dapter/cursor-recovery', title: 'Recover cursors' },
                navigation: sourceNavigation(),
            },
            global: { stubs: { PackageGuideHeader: true, PagingDemo: true } },
        });
        expect(wrapper.text()).toContain('901 seconds');
        expect(wrapper.text()).toContain('finally');
        expect(wrapper.text()).toContain('No automatic restart');
        expect(wrapper.text()).toContain('clears stale rows and action metadata');
    });
});
