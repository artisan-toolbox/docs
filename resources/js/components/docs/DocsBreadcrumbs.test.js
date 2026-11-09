import { Link } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import DocsBreadcrumbs from './DocsBreadcrumbs.vue';

const items = [
    { label: 'Home', href: '/', current: false },
    { label: 'Documentation', href: '/docs', current: false },
    { label: 'Maintainer', href: '/docs/maintainer', current: false },
    { label: 'Code Quality', href: '/docs/maintainer/ci', current: false },
    {
        label: 'Fixes and CI Checks',
        href: '/docs/maintainer/ci/quality',
        current: true,
    },
];

describe('DocsBreadcrumbs', () => {
    it('renders an ordered trail with Inertia links and a native current-page label', () => {
        const wrapper = mount(DocsBreadcrumbs, { props: { items } });
        const navigation = wrapper.get('nav[aria-label="Breadcrumb"]');

        expect(
            navigation.findAll('ol > li:not([role="presentation"])').map((item) => item.text()),
        ).toEqual(items.map((item) => item.label));
        expect(wrapper.findAllComponents(Link)).toHaveLength(items.length - 1);
        expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual(
            items.slice(0, -1).map((item) => item.href),
        );
        expect(wrapper.findAll('[aria-current="page"]')).toHaveLength(1);
        const current = wrapper.get('[aria-current="page"]');
        expect(current.element.tagName).toBe('SPAN');
        expect(current.attributes('role')).toBeUndefined();
        expect(current.attributes('href')).toBeUndefined();
        expect(current.text()).toBe('Fixes and CI Checks');
        expect(wrapper.findAll('[data-slot="breadcrumb-separator"]')).toHaveLength(4);
        for (const separator of wrapper.findAll('[data-slot="breadcrumb-separator"]')) {
            expect(separator.attributes('aria-hidden')).toBe('true');
        }
        expect(navigation.attributes('tabindex')).toBeUndefined();
        expect(navigation.attributes('data-search-exclude')).toBeDefined();
    });

    it('keeps each separator with its destination when the trail wraps', () => {
        const wrapper = mount(DocsBreadcrumbs, { props: { items } });
        const entries = wrapper.findAll('ol > li');

        expect(entries).toHaveLength(items.length);
        expect(entries[0].find('[data-slot="breadcrumb-separator"]').exists()).toBe(false);
        for (const entry of entries.slice(1)) {
            expect(entry.findAll('[data-slot="breadcrumb-separator"]')).toHaveLength(1);
        }
        expect(entries.at(-1).get('[aria-current="page"]').text()).toBe(items.at(-1).label);
    });

    it('updates labels and destinations when the backend supplies the next trail', async () => {
        const wrapper = mount(DocsBreadcrumbs, { props: { items } });

        await wrapper.setProps({
            items: [
                { label: 'Home', href: '/welcome', current: false },
                { label: 'Documentation', href: '/guides', current: true },
            ],
        });

        expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual(['/welcome']);
        expect(wrapper.get('[aria-current="page"]').text()).toBe('Documentation');
        expect(wrapper.text()).not.toContain('Maintainer');
    });

    it('omits an empty navigation landmark', () => {
        expect(mount(DocsBreadcrumbs).find('nav').exists()).toBe(false);
    });
});
