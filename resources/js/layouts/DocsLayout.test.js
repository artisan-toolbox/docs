import { Page } from '@artisan-toolbox/front-awesome/components/WebAwesome';
vi.mock('@web.awesome.me/webawesome-pro/dist/components/select/select.js', () => ({}));
// Page imports native form controls that need ElementInternals. Browser tests cover its skip link.
vi.mock('@web.awesome.me/webawesome-pro/dist/components/page/page.js', () => ({}));
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { h, nextTick, reactive } from 'vue';
import DocsLayout from './DocsLayout.vue';

const { page } = vi.hoisted(() => ({
    page: {
        url: '/docs',
        props: {
            links: {
                home: '/',
                docs: '/docs',
                github: 'https://github.com/artisan-toolbox',
                contact: 'mailto:contact@atb.dev.br',
            },
            page: {
                breadcrumbs: [
                    { label: 'Home', href: '/', current: false },
                    { label: 'Documentation', href: '/docs', current: true },
                ],
                sourceUrl:
                    'https://github.com/artisan-toolbox/docs/blob/1.x/resources/js/pages/docs/Index.vue',
                sourceLabel: 'View page source on GitHub',
            },
            navigation: [
                {
                    slug: '',
                    title: 'Introduction',
                    href: '/docs',
                    active: true,
                    activeAncestor: false,
                    children: [],
                },
                {
                    slug: 'maintainer',
                    title: 'Maintainer',
                    href: '/docs/maintainer',
                    active: false,
                    activeAncestor: false,
                    children: [
                        {
                            slug: 'maintainer/ci',
                            title: 'Code Quality',
                            href: '/docs/maintainer/ci',
                            active: false,
                            activeAncestor: false,
                            children: [],
                        },
                    ],
                },
                {
                    slug: 'core',
                    title: 'Core',
                    href: 'https://atb.dev.br/packages/core/',
                    active: false,
                    activeAncestor: false,
                    children: [],
                },
            ],
        },
    },
}));

vi.mock('@inertiajs/vue3', async (importOriginal) => {
    const { reactive } = await import('vue');

    return { ...(await importOriginal()), usePage: () => reactive(page) };
});

import { preferencesFixture } from '../../../tests/Fixtures/preferences';

const preferencesContext = vi.hoisted(() => ({ fixture: undefined }));
vi.mock('@artisan-toolbox/front-awesome', async (importOriginal) => ({
    ...(await importOriginal()),
    usePreferences: () => preferencesContext.fixture.service,
}));
beforeEach(() => {
    preferencesContext.fixture = preferencesFixture();
});

enableAutoUnmount(afterEach);

afterEach(() => {
    vi.restoreAllMocks();
    reactive(page).url = '/docs';
    page.props.navigation[0].active = true;
    page.props.navigation[1].activeAncestor = false;
    page.props.navigation[1].children[0].active = false;
    page.props.page.breadcrumbs = [
        { label: 'Home', href: '/', current: false },
        { label: 'Documentation', href: '/docs', current: true },
    ];
    document.documentElement.classList.remove('dark');
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
});

function sidebarGeometry({ top = 1054, bottom = 1098, position = 'sticky', height = 640 } = {}) {
    const getComputedStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
        const style = getComputedStyle(element);

        if (element.id === 'docs-navigation') {
            return new Proxy(style, {
                get(target, property) {
                    if (property === 'position') {
                        return position;
                    }

                    if (property === 'paddingTop' || property === 'paddingBottom') {
                        return '32px';
                    }

                    return Reflect.get(target, property);
                },
            });
        }

        return style;
    });
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
        if (this.id === 'docs-navigation') {
            return new DOMRect(0, 98, 288, height);
        }

        if (this.getAttribute('aria-current') === 'page') {
            if (this.closest('ul[style*="display: none"]')) {
                return new DOMRect();
            }

            return new DOMRect(0, top, 240, bottom - top);
        }

        return new DOMRect();
    });
}

describe('DocsLayout', () => {
    it('refreshes the breadcrumb trail outside the authored article after navigation', async () => {
        const currentPage = reactive(page);
        const wrapper = mount(DocsLayout, {
            slots: { default: '<h1>Documentation</h1><h2>Installation</h2>' },
        });
        const breadcrumb = () => wrapper.get('main nav[aria-label="Breadcrumb"]');

        expect(breadcrumb().get('[aria-current="page"]').text()).toBe('Documentation');
        expect(breadcrumb().element.parentElement.querySelector('h1').textContent).toBe(
            'Documentation',
        );
        expect(breadcrumb().element.nextElementSibling.querySelector('h1')).not.toBeNull();

        currentPage.props.page.breadcrumbs = [
            { label: 'Home', href: '/', current: false },
            { label: 'Documentation', href: '/docs', current: false },
            { label: 'Maintainer', href: '/docs/maintainer', current: true },
        ];
        currentPage.url = '/docs/maintainer';
        await nextTick();

        expect(breadcrumb().get('[aria-current="page"]').text()).toBe('Maintainer');
        expect(
            breadcrumb()
                .findAll('a')
                .map((link) => link.attributes('href')),
        ).toEqual(['/', '/docs']);
        expect(wrapper.findAll('main h1')).toHaveLength(1);
    });

    it('uses the rendered header height for navigation and anchor clearance', async () => {
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
            return new DOMRect(0, 0, 320, this.tagName === 'HEADER' ? 148 : 0);
        });
        const wrapper = mount(DocsLayout);
        await nextTick();

        expect(wrapper.element.style.getPropertyValue('--site-header-height')).toBe('148px');
    });

    it('derives the page outline from article headings and refreshes it after navigation', async () => {
        const currentPage = reactive(page);
        const wrapper = mount(DocsLayout, {
            slots: {
                default: () =>
                    currentPage.url === '/docs'
                        ? h('article', [
                              h('h1', 'Introduction'),
                              h('h2', { id: 'installation' }, 'Installation'),
                              h('h3', { id: 'requirements' }, 'Requirements'),
                          ])
                        : h('article', [
                              h('h1', 'Another guide'),
                              h('h2', { id: 'configuration' }, 'Configuration'),
                          ]),
            },
            global: {
                stubs: {
                    PublicSiteFooter: {
                        template: '<footer><h2 id="footer-heading">Footer section</h2></footer>',
                    },
                },
            },
        });
        await flushPromises();
        const outline = wrapper.get('nav[aria-label="On this page"]');

        expect(outline.findAll('a').map((link) => link.text())).toEqual([
            'Installation',
            'Requirements',
        ]);
        expect(outline.find('a[href="#footer-heading"]').exists()).toBe(false);
        expect(outline.get('li ul a').attributes('href')).toBe('#requirements');
        await outline.get('button').trigger('click');
        currentPage.url = '/docs/another-guide';
        await flushPromises();
        const refreshedOutline = wrapper.get('nav[aria-label="On this page"]');

        expect(refreshedOutline.findAll('a').map((link) => link.text())).toEqual(['Configuration']);
        expect(refreshedOutline.get('button').attributes('aria-expanded')).toBe('false');
    });

    it('returns to the supplied home destination through the logo, sidebar, and footer', async () => {
        const originalHome = page.props.links.home;
        const currentPage = reactive(page);
        currentPage.props.links.home = '/welcome';

        try {
            const wrapper = mount(DocsLayout);

            expect(
                wrapper.get('header a[aria-label="Artisan Toolbox home"]').attributes('href'),
            ).toBe('/welcome');
            expect(wrapper.get('footer a[href="/welcome"]').text()).toBe('Home');
            const menu = wrapper.get('button[aria-controls="docs-navigation"]');
            await menu.trigger('click');
            const home = wrapper.get('#docs-navigation a[href="/welcome"]');
            expect(home.text()).toContain('Back to home');
            await home.trigger('click', { button: 1 });
            expect(menu.attributes('aria-expanded')).toBe('false');
        } finally {
            currentPage.props.links.home = originalHome;
        }
    });

    it('reveals an offscreen current link inside the desktop sidebar on initial load without moving focus or the page', async () => {
        sidebarGeometry();
        const wrapper = mount(DocsLayout, { attachTo: document.body });
        const menu = wrapper.get('button[aria-controls="docs-navigation"]');
        menu.element.focus();
        document.documentElement.scrollTop = 210;
        document.body.scrollTop = 210;

        await nextTick();

        expect(wrapper.get('#docs-navigation').element.scrollTop).toBe(392);
        expect(document.activeElement).toBe(menu.element);
        expect(document.documentElement.scrollTop).toBe(210);
        expect(document.body.scrollTop).toBe(210);
    });

    it('reveals the new current child after navigation expands its section and closes the mobile menu', async () => {
        sidebarGeometry({ top: 20, bottom: 64 });
        const wrapper = mount(DocsLayout);
        await nextTick();
        const sidebar = wrapper.get('#docs-navigation').element;
        sidebar.scrollTop = 500;
        const menu = wrapper.get('button[aria-controls="docs-navigation"]');
        await menu.trigger('click');
        const currentPage = reactive(page);
        currentPage.props.navigation[0].active = false;
        currentPage.props.navigation[1].activeAncestor = true;
        currentPage.props.navigation[1].children[0].active = true;

        currentPage.url = '/docs/maintainer/ci';
        await nextTick();
        await nextTick();

        expect(wrapper.get('a[aria-current="page"]').text()).toBe('Code Quality');
        expect(
            wrapper
                .get('button[aria-label="Collapse Maintainer section"]')
                .attributes('aria-expanded'),
        ).toBe('true');
        expect(sidebar.scrollTop).toBe(390);
        expect(menu.attributes('aria-expanded')).toBe('false');
    });

    it('leaves the sidebar scroll position unchanged when the current link is already visible', async () => {
        sidebarGeometry({ top: 200, bottom: 244 });
        const wrapper = mount(DocsLayout);
        const sidebar = wrapper.get('#docs-navigation').element;
        sidebar.scrollTop = 120;

        await nextTick();

        expect(sidebar.scrollTop).toBe(120);
    });

    it('leaves the mobile navigation panel scroll position unchanged', async () => {
        sidebarGeometry({ position: 'fixed' });
        const wrapper = mount(DocsLayout);
        const sidebar = wrapper.get('#docs-navigation').element;

        await nextTick();

        expect(sidebar.scrollTop).toBe(0);
        await wrapper.get('button[aria-controls="docs-navigation"]').trigger('click');
        reactive(page).url = '/docs?section=toolbox';
        await nextTick();
        await nextTick();
        expect(sidebar.scrollTop).toBe(0);
    });

    it('leaves the sidebar scroll position unchanged when its panel is hidden', async () => {
        sidebarGeometry({ height: 0 });
        const wrapper = mount(DocsLayout);
        const sidebar = wrapper.get('#docs-navigation').element;
        sidebar.scrollTop = 120;

        await nextTick();

        expect(sidebar.scrollTop).toBe(120);
    });

    it('toggles the mobile navigation and exposes the active page', async () => {
        const wrapper = mount(DocsLayout, {
            slots: { default: '<h1>Introduction</h1>' },
        });
        const menu = wrapper.get('button[aria-controls="docs-navigation"]');

        expect(menu.attributes('aria-expanded')).toBe('false');
        await menu.trigger('click');

        expect(menu.attributes('aria-expanded')).toBe('true');
        expect(wrapper.get('#docs-navigation').classes()).not.toContain('hidden');
        expect(wrapper.get('a[aria-current="page"]').text()).toBe('Introduction');
        expect(wrapper.get('a[href="https://atb.dev.br/packages/core/"]').text()).toBe('Core');

        await menu.trigger('click');

        expect(menu.attributes('aria-expanded')).toBe('false');
        expect(wrapper.get('#docs-navigation').classes()).toContain('hidden');
    });

    it('dismisses mobile navigation with Escape and returns focus to its toggle', async () => {
        const wrapper = mount(DocsLayout, { attachTo: document.body });
        const menu = wrapper.get('button[aria-controls="docs-navigation"]');
        await menu.trigger('click');
        const home = wrapper.get('#docs-navigation a');
        home.element.focus();

        await home.trigger('keydown', { key: 'Escape' });

        expect(menu.attributes('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(menu.element);
    });

    it('keeps the mobile menu open for disclosure and closes it only when a destination is selected', async () => {
        const wrapper = mount(DocsLayout);
        const menu = wrapper.get('button[aria-controls="docs-navigation"]');
        await menu.trigger('click');
        const disclosure = wrapper.get('button[aria-label="Expand Maintainer section"]');
        await disclosure.trigger('click');
        expect(menu.attributes('aria-expanded')).toBe('true');
        expect(disclosure.attributes('aria-expanded')).toBe('true');
        await wrapper.get('nav a[href="/docs/maintainer/ci"]').trigger('click', { button: 1 });
        expect(menu.attributes('aria-expanded')).toBe('false');
    });

    it('delegates theme changes to package persistence and renders confirmed state', async () => {
        const wrapper = mount(DocsLayout);
        await flushPromises();
        wrapper.get('wa-select').element.value = 'dark';
        await wrapper.get('wa-select').trigger('change');
        expect(preferencesContext.fixture.service.setAppearance).toHaveBeenCalledExactlyOnceWith(
            'dark',
        );
        expect(preferencesContext.fixture.service.appearance.value).toBe('system');
        preferencesContext.fixture.confirm({ appearance: 'dark', resolvedAppearance: 'dark' });
        await flushPromises();
        expect(wrapper.get('wa-select').element.value).toBe('dark');
        preferencesContext.fixture.setPending(true);
        preferencesContext.fixture.setError('Preferences could not be confirmed.');
        await flushPromises();
        expect(wrapper.get('wa-select').attributes('disabled')).toBeDefined();
        expect(wrapper.get('[role="alert"]').text()).toBe('Preferences could not be confirmed.');
    });

    it('renders the public brand, native Page skip destination, and page source link', () => {
        const wrapper = mount(DocsLayout, {
            slots: { default: '<h1>Introduction</h1>' },
        });

        expect(wrapper.get('main h1').text()).toBe('Introduction');
        const nativePage = wrapper.getComponent(Page);
        expect(nativePage.get('wa-page').attributes('disable-navigation-toggle')).toBeDefined();
        expect(nativePage.get('wa-page').attributes('disable-sticky')).toBe('menu aside');
        expect(nativePage.get('header').attributes('slot')).toBe('header');
        expect(nativePage.findAll('#main-content')).toHaveLength(1);
        expect(nativePage.get('main').attributes('tabindex')).toBe('-1');
        expect(nativePage.find('a[href="#main-content"]').exists()).toBe(false);
        expect(wrapper.findAll('header img').map((image) => image.attributes('alt'))).toEqual([
            'Artisan Toolbox',
        ]);
        expect(wrapper.get('footer a').text()).toContain('View page source on GitHub');
        expect(wrapper.get('footer a').attributes('href')).toBe(page.props.page.sourceUrl);
        const outboundLinks = wrapper.findAll('a[href^="https://"]');

        expect(outboundLinks).toHaveLength(5);
        for (const link of outboundLinks) {
            expect(link.attributes('target')).toBe('_blank');
            expect(link.attributes('rel')).toBe('noopener noreferrer');
        }
    });
});
