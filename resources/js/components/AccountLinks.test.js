import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import ziggy from '../../../tests/Fixtures/ziggy.json';
import AccountLinks from './AccountLinks.vue';

const { page } = vi.hoisted(() => ({ page: { props: {} } }));

vi.mock('@inertiajs/vue3', async (importOriginal) => ({
    ...(await importOriginal()),
    usePage: () => page,
}));

beforeEach(() => vi.stubGlobal('Ziggy', ziggy));
afterEach(() => {
    page.props = {};
    vi.unstubAllGlobals();
});

describe('Account links', () => {
    it('follows renamed log and logout paths while preserving their visit methods', () => {
        vi.stubGlobal('Ziggy', {
            ...ziggy,
            routes: {
                ...ziggy.routes,
                'log-viewer.index': {
                    uri: 'staff/logs/{view?}',
                    methods: ['GET', 'HEAD'],
                },
                logout: { uri: 'staff/sign-out', methods: ['POST'] },
            },
        });
        page.props = { auth: { user: { id: 1 } } };
        const wrapper = mount(AccountLinks);
        expect(wrapper.get('a').attributes('href')).toBe('/staff/logs');
        expect(wrapper.getComponent({ name: 'Link' }).props()).toMatchObject({
            href: '/staff/sign-out',
            method: 'post',
            as: 'button',
        });
    });

    it('keeps the sign-in entry point absent from public headers', () => {
        expect(mount(AccountLinks).find('nav').exists()).toBe(false);
        page.props = { auth: { user: null } };
        expect(mount(AccountLinks).find('nav').exists()).toBe(false);
    });

    it('uses a full document visit for logs and a POST button for sign out', () => {
        page.props = { auth: { user: { id: 1 } } };
        const wrapper = mount(AccountLinks);
        expect(wrapper.get('a[href="/logs"]').text()).toBe('Logs');
        expect(wrapper.findAll('a')).toHaveLength(1);
        const signOut = wrapper.getComponent({ name: 'Link' });
        expect(signOut.props()).toMatchObject({
            href: '/logout',
            method: 'post',
            as: 'button',
        });
        expect(wrapper.get('button').text()).toBe('Sign out');
    });
});
