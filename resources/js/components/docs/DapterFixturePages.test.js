import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import Fixtures from '../../pages/docs/dapter/design/Fixtures.vue';
import corpus from '../../pages/docs/dapter/design/reference/fixtures.json';
import { extractDocumentation } from '../../../../scripts/documentation-search.mjs';
import { sourceNavigation } from './sourceNavigationFixture';

describe('Dapter shared fixture reference', () => {
    it('distinguishes current execution from reference checks and future native acceptance', () => {
        const wrapper = mount(Fixtures, {
            props: {
                page: {
                    slug: 'dapter/design/fixtures',
                    title: 'Shared contract fixtures',
                    description: 'Finite acceptance examples.',
                    package: {
                        id: 'dapter',
                        title: 'Dapter',
                        stability: 'Work in progress',
                        installedVersion: '1.x-dev',
                    },
                },
                navigation: sourceNavigation(),
            },
        });
        expect(wrapper.get('h1').text()).toBe('Shared contract fixtures');
        expect(wrapper.get('table').text()).toContain('current-runtime');
        expect(wrapper.get('table').text()).toContain('reference');
        expect(wrapper.get('table').text()).toContain('specification');
        expect(wrapper.text()).toContain('does not enable an operation');
        for (const profile of corpus.drivers) {
            if (profile.targetVersion !== null)
                expect(wrapper.text()).toContain(profile.targetVersion);
        }
        expect(wrapper.text()).toContain('not a support matrix');
        expect(wrapper.text()).toContain('remains the shared current protocol corpus');
        expect(wrapper.get('a[href="/docs/dapter/roadmap#todo-0-7"]').text()).toBe(
            'next contract review',
        );
        wrapper.unmount();
    });

    it('indexes fixture ownership, native target limits and executable check commands', () => {
        const documents = extractDocumentation([
            {
                slug: 'dapter/roadmap',
                title: 'Dapter roadmap',
                description: 'Delivery gates.',
                packageTitle: 'Dapter',
                sourcePath: 'resources/js/pages/docs/dapter/Roadmap.vue',
            },
            {
                slug: 'dapter/design/fixtures',
                title: 'Shared contract fixtures',
                description: 'Finite acceptance examples.',
                packageTitle: 'Dapter',
                sourcePath: 'resources/js/pages/docs/dapter/design/Fixtures.vue',
            },
        ]);
        const body = (anchor) => documents.find((entry) => entry.anchor === anchor).body;
        expect(body('fixture-scope')).toContain('fixtures.json');
        expect(body('fixture-scope')).toContain('read-v1.json');
        expect(body('native-fixture-targets')).toContain('Native planned-plan execution pending');
        expect(body('verify-shared-fixtures')).toContain('DapterSharedFixturesTest.php');
        expect(body('verify-shared-fixtures')).toContain('ProtocolConformanceTest.php');
        expect(body('todo-0-6')).toMatch(/^Completed /);
        expect(body('todo-0-7')).toMatch(/^WIP /);
    });
});
