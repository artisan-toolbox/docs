import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import AccountLinks from './AccountLinks.vue';

const { page } = vi.hoisted(() => ({ page: { props: {} } }));

vi.mock('@inertiajs/vue3', async (importOriginal) => ({
    ...(await importOriginal()),
    usePage: () => page,
}));

afterEach(() => {
    page.props = {};
});

describe('Account links', () => {
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
