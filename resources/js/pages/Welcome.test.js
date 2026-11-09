import { enableAutoUnmount, mount } from '@vue/test-utils';
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
        expect(wrapper.get('a[href="#main-content"]').text()).toBe('Skip to content');
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
        expect(wrapper.findAll('select')).toHaveLength(1);
        expect(wrapper.get('header a[href="/logs"]').text()).toBe('Logs');
        expect(wrapper.get('header button').text()).toBe('Sign out');
        await wrapper.get('select').setValue('dark');
        expect(localStorage.getItem('appearance')).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        wrapper.unmount();
        const remounted = mount(Welcome, {
            props: { packages, links, source },
        });
        expect(remounted.get('select').element.value).toBe('dark');
    });
});
