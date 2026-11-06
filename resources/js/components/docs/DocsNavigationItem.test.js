import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import DocsNavigationItem from './DocsNavigationItem.vue';

function navigationItem() {
    return {
        slug: 'maintainer',
        title: 'Maintainer',
        href: '/docs/maintainer',
        active: false,
        activeAncestor: true,
        children: [
            {
                slug: 'maintainer/ci',
                title: 'Code Quality',
                href: '/docs/maintainer/ci',
                active: false,
                activeAncestor: true,
                children: [
                    {
                        slug: 'maintainer/ci/quality',
                        title: 'Fixes and CI Checks',
                        href: '/docs/maintainer/ci/quality',
                        active: true,
                        activeAncestor: false,
                        children: [],
                    },
                ],
            },
        ],
    };
}

function mountNavigation() {
    return mount(DocsNavigationItem, {
        props: {
            item: navigationItem(),
            currentUrl: '/docs/maintainer/ci/quality',
        },
    });
}

describe('documentation navigation branches', () => {
    it('renders three semantic levels with one current page and open ancestors', () => {
        const wrapper = mountNavigation();
        expect(wrapper.element.tagName).toBe('LI');
        expect(wrapper.get('li > ul > li > ul > li a').text()).toBe(
            'Fixes and CI Checks',
        );
        expect(wrapper.findAll('a[aria-current="page"]')).toHaveLength(1);
        expect(wrapper.get('a[aria-current="page"]').attributes('href')).toBe(
            '/docs/maintainer/ci/quality',
        );
        expect(
            wrapper
                .get('a[href="/docs/maintainer"]')
                .attributes('aria-current'),
        ).toBeUndefined();
        expect(
            wrapper
                .get('a[href="/docs/maintainer/ci"]')
                .attributes('aria-current'),
        ).toBeUndefined();
        expect(
            wrapper.get('a[href="/docs/maintainer"]').classes(),
        ).not.toContain('bg-brand-50');
        const controls = wrapper.findAll('button');
        const ids = controls.map((button) =>
            button.attributes('aria-controls'),
        );
        expect(new Set(ids).size).toBe(2);
        for (const button of controls) {
            expect(button.attributes('type')).toBe('button');
            expect(button.attributes('aria-expanded')).toBe('true');
            expect(button.classes()).toContain('min-w-11');
            expect(button.classes()).toContain('min-h-11');
            expect(
                wrapper.get(`[id="${button.attributes('aria-controls')}"]`)
                    .element.tagName,
            ).toBe('UL');
        }
    });

    it('allows collapsing the active path and reopens it on the next route even when ancestor flags stay true', async () => {
        const wrapper = mountNavigation();
        const controls = wrapper.findAll('button');
        await controls[1].trigger('click');
        await controls[0].trigger('click');
        expect(
            controls.map((button) => button.attributes('aria-expanded')),
        ).toEqual(['false', 'false']);
        expect(
            wrapper.get(`[id="${controls[0].attributes('aria-controls')}"]`)
                .element.style.display,
        ).toBe('none');
        expect(wrapper.emitted('navigate')).toBeUndefined();

        await wrapper.setProps({
            currentUrl: '/docs/maintainer/ci/quality?next=1',
        });
        expect(
            controls.map((button) => button.attributes('aria-expanded')),
        ).toEqual(['true', 'true']);
        expect(
            wrapper.get(`[id="${controls[0].attributes('aria-controls')}"]`)
                .element.style.display,
        ).toBe('');

        await controls[0].trigger('click');
        await wrapper.setProps({ item: navigationItem() });
        expect(controls[0].attributes('aria-expanded')).toBe('true');
    });

    it('emits navigation for nested links and leaves inactive sections closed until toggled', async () => {
        const item = navigationItem();
        item.activeAncestor = false;
        item.children[0].activeAncestor = false;
        item.children[0].children[0].active = false;
        const wrapper = mount(DocsNavigationItem, {
            props: { item, currentUrl: '/docs' },
        });
        const control = wrapper.get(
            'button[aria-label="Expand Maintainer section"]',
        );
        expect(control.attributes('aria-expanded')).toBe('false');
        await control.trigger('click');
        expect(control.attributes('aria-label')).toBe(
            'Collapse Maintainer section',
        );
        await wrapper
            .get('a[href="/docs/maintainer/ci/quality"]')
            .trigger('click', { button: 1 });
        expect(wrapper.emitted('navigate')).toHaveLength(1);
    });

    it('uses different control IDs for slugs whose punctuation could otherwise collide', () => {
        const item = navigationItem();
        item.children.push({ ...navigationItem(), slug: 'a/b' });
        item.children.push({ ...navigationItem(), slug: 'a--b' });
        const wrapper = mount(DocsNavigationItem, {
            props: { item, currentUrl: '/docs' },
        });
        const ids = wrapper
            .findAll('button')
            .map((button) => button.attributes('aria-controls'));
        expect(new Set(ids).size).toBe(ids.length);
    });
});
