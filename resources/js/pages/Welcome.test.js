import { Page } from '@artisan-toolbox/front-awesome/components/WebAwesome';
vi.mock('@web.awesome.me/webawesome-pro/dist/components/select/select.js', () => ({}));
// Page imports native form controls that need ElementInternals. Browser tests cover its skip link.
vi.mock('@web.awesome.me/webawesome-pro/dist/components/page/page.js', () => ({}));
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import ziggy from '../../../tests/Fixtures/ziggy.json';
import PackageCard from '@/components/docs/PackageCard.vue';
import Welcome from './Welcome.vue';

const { page } = vi.hoisted(() => ({ page: { props: {} } }));
vi.mock('@inertiajs/vue3', async (importOriginal) => ({
    ...(await importOriginal()),
    usePage: () => page,
}));

enableAutoUnmount(afterEach);
beforeEach(() => vi.stubGlobal('Ziggy', ziggy));
afterEach(() => {
    page.props = {};
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    vi.unstubAllGlobals();
});

const links = {
    home: '/start',
    docs: '/reference',
    github: 'https://github.com/artisan-toolbox',
    contact: 'mailto:contact@atb.dev.br',
};
const source = {
    sourceUrl: 'https://github.com/artisan-toolbox/docs/blob/1.x/resources/js/pages/Welcome.vue',
    sourceLabel: 'View page source on GitHub',
};
const packages = [
    'core',
    'dump-to-console',
    'front-awesome',
    'maintainer',
    'mosaicast',
    'qztray',
].map((id) => ({
    id,
    title: id,
    summary: `Documentation for ${id}.`,
    version: id === 'front-awesome' ? null : '1.0',
    stability: id === 'front-awesome' ? 'Work in progress' : 'Stable',
    href: `/reference/${id}`,
    migrated: true,
    artwork: { icon: `/images/packages/${id}/${id}-icon.svg` },
}));

describe('Welcome', () => {
    it('shows every package equally with its documentation destination and explicit stability', () => {
        const wrapper = mount(Welcome, { props: { packages, links, source } });
        expect(wrapper.findAllComponents(PackageCard)).toHaveLength(6);
        for (const item of packages) {
            const card = wrapper.get(`a[href="${item.href}"]`);
            expect(card.text()).toContain(item.title);
            expect(card.text()).toContain(item.stability);
        }
        expect(wrapper.get('a[href="/reference/front-awesome"]').text()).toContain(
            'Documented version Not installed',
        );
        expect(wrapper.findAll('h1')).toHaveLength(1);
        expect(wrapper.get(`footer a[href="${source.sourceUrl}"]`).text()).toContain(
            source.sourceLabel,
        );
        const nativePage = wrapper.getComponent(Page);
        expect(nativePage.get('wa-page').attributes('disable-navigation-toggle')).toBeDefined();
        expect(nativePage.get('wa-page').attributes('disable-sticky')).toBe('menu aside');
        expect(nativePage.get('header').attributes('slot')).toBe('header');
        expect(nativePage.findAll('#main-content')).toHaveLength(1);
        expect(nativePage.get('main').attributes('tabindex')).toBe('-1');
        expect(nativePage.find('a[href="#main-content"]').exists()).toBe(false);
        expect(wrapper.get('main').attributes('id')).toBe('main-content');
        expect(wrapper.get('main').text()).toContain(
            'This documentation application uses Laravel, Vue, and Inertia',
        );
    });

    it('uses supplied destinations and updates navigation when props change', async () => {
        const wrapper = mount(Welcome, { props: { packages, links, source } });
        expect(wrapper.get('a[aria-label="Artisan Toolbox home"]').attributes('href')).toBe(
            '/start',
        );
        expect(wrapper.get('footer a[href="/reference"]').text()).toBe('Documentation');
        expect(wrapper.get('footer a[href="mailto:contact@atb.dev.br"]').text()).toBe('Contact');
        expect(wrapper.find('a[href="/docs"]').exists()).toBe(false);
        for (const link of wrapper.findAll('a[href^="https://"]')) {
            expect(link.attributes('target')).toBe('_blank');
            expect(link.attributes('rel')).toBe('noopener noreferrer');
        }
        await wrapper.setProps({
            links: { ...links, home: '/new-home', docs: '/new-docs' },
            packages: packages.slice(0, 1),
        });
        expect(wrapper.get('a[aria-label="Artisan Toolbox home"]').attributes('href')).toBe(
            '/new-home',
        );
        expect(wrapper.get('footer a[href="/new-docs"]').exists()).toBe(true);
        expect(wrapper.findAllComponents(PackageCard)).toHaveLength(1);
    });

    it('keeps one persistent theme control and staff account actions in the shared header', async () => {
        page.props = { auth: { user: { id: 1 } } };
        const wrapper = mount(Welcome, { props: { packages, links, source } });
        expect(wrapper.findAll('wa-select')).toHaveLength(1);
        expect(wrapper.get('header a[href="/logs"]').text()).toBe('Logs');
        expect(wrapper.get('header button').text()).toBe('Sign out');
        await flushPromises();
        wrapper.get('wa-select').element.value = 'dark';
        await wrapper.get('wa-select').trigger('change');
        expect(localStorage.getItem('appearance')).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        wrapper.unmount();
        const remounted = mount(Welcome, {
            props: { packages, links, source },
        });
        await flushPromises();
        expect(remounted.get('wa-select').element.value).toBe('dark');
    });
});
