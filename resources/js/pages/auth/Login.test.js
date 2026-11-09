import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import ziggy from '../../../../tests/Fixtures/ziggy.json';
import Login from './Login.vue';

vi.mock('@inertiajs/vue3', async (importOriginal) => ({
    ...(await importOriginal()),
    Head: { render: () => null },
}));

function renderLogin(props = {}) {
    return mount(Login, {
        props,
    });
}

beforeEach(() => vi.stubGlobal('Ziggy', ziggy));
afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('Passwordless sign in', () => {
    it('follows named routes when the application changes its authentication paths', async () => {
        vi.stubGlobal('Ziggy', {
            ...ziggy,
            routes: {
                ...ziggy.routes,
                'docs.index': { uri: 'guides', methods: ['GET', 'HEAD'] },
                'login.email': { uri: 'staff/code', methods: ['POST'] },
                'login.store': { uri: 'staff/access', methods: ['POST'] },
            },
        });
        const post = vi.spyOn(router, 'post').mockImplementation(() => {});
        const wrapper = renderLogin();
        expect(wrapper.get('header a').attributes('href')).toBe('/guides');
        await wrapper.get('#email').setValue('you@atb.dev.br');
        await wrapper.get('form').trigger('submit');
        expect(post).toHaveBeenLastCalledWith(
            '/staff/code',
            { email: 'you@atb.dev.br' },
            expect.any(Object),
        );
        await wrapper.setProps({ pendingEmail: 'you@atb.dev.br' });
        post.mock.calls[0][2].onSuccess({});
        await wrapper.vm.$nextTick();
        await wrapper.get('#code').setValue('001234');
        await wrapper.get('form').trigger('submit');
        expect(post).toHaveBeenLastCalledWith(
            '/staff/access',
            { code: '001234' },
            expect.any(Object),
        );
    });

    it('requests a code and switches to the pending email returned by the server', async () => {
        const post = vi.spyOn(router, 'post').mockImplementation(() => {});
        const wrapper = renderLogin();

        expect(wrapper.find('input[type="password"]').exists()).toBe(false);
        expect(wrapper.get('#email').attributes('placeholder')).toBe('you@atb.dev.br');
        await wrapper.get('#email').setValue('you@atb.dev.br');
        await wrapper.get('form').trigger('submit');

        expect(post).toHaveBeenCalledWith(
            '/login/email',
            { email: 'you@atb.dev.br' },
            expect.any(Object),
        );
        await wrapper.setProps({
            pendingEmail: 'you@atb.dev.br',
            status: 'Code sent.',
        });
        post.mock.calls[0][2].onSuccess({});
        await wrapper.vm.$nextTick();

        expect(wrapper.get('#code').attributes('inputmode')).toBe('numeric');
        expect(wrapper.get('[role="status"]').text()).toBe('Code sent.');
        expect(wrapper.text()).toContain('you@atb.dev.br');
    });

    it('keeps email errors visible and disables submission during requests', async () => {
        const post = vi.spyOn(router, 'post').mockImplementation(() => {});
        const wrapper = renderLogin();
        await wrapper.get('#email').setValue('you@example.com');
        await wrapper.get('form').trigger('submit');
        const options = post.mock.calls[0][2];
        options.onStart({});
        await wrapper.vm.$nextTick();
        expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined();
        options.onError({ email: 'Use your work email.' });
        options.onFinish({});
        await wrapper.vm.$nextTick();

        expect(wrapper.get('#email-error').text()).toBe('Use your work email.');
        expect(wrapper.get('#email').attributes('aria-invalid')).toBe('true');
        expect(wrapper.find('#code').exists()).toBe(false);
    });

    it('submits all six code digits as text and renders verification errors', async () => {
        const post = vi.spyOn(router, 'post').mockImplementation(() => {});
        const wrapper = renderLogin({ pendingEmail: 'you@atb.dev.br' });
        expect(wrapper.get('#code').attributes('autocomplete')).toBe('one-time-code');
        await wrapper.get('#code').setValue('001234');
        await wrapper.get('form').trigger('submit');

        expect(post).toHaveBeenCalledWith('/login', { code: '001234' }, expect.any(Object));
        post.mock.calls[0][2].onError({ code: 'The code has expired.' });
        await wrapper.vm.$nextTick();
        expect(wrapper.get('#code-error').text()).toBe('The code has expired.');
    });

    it.each(['The code has expired.', 'Too many attempts. Please request a new code.'])(
        'returns to the email form when the pending code is cleared: %s',
        async (message) => {
            const post = vi.spyOn(router, 'post').mockImplementation(() => {});
            const wrapper = renderLogin({ pendingEmail: 'you@atb.dev.br' });
            await wrapper.get('#code').setValue('001234');
            await wrapper.get('form').trigger('submit');
            const verification = post.mock.calls[0][2];

            await wrapper.setProps({ pendingEmail: null });
            verification.onError({ code: message });
            await wrapper.vm.$nextTick();

            expect(wrapper.find('#code').exists()).toBe(false);
            expect(wrapper.get('#email').element.value).toBe('you@atb.dev.br');
            expect(wrapper.get('#code-error').isVisible()).toBe(true);
            expect(wrapper.get('#code-error').text()).toBe(message);

            await wrapper.get('form').trigger('submit');
            expect(post).toHaveBeenLastCalledWith(
                '/login/email',
                { email: 'you@atb.dev.br' },
                expect.any(Object),
            );
            await wrapper.setProps({ pendingEmail: 'you@atb.dev.br' });
            post.mock.calls[1][2].onSuccess({});
            await wrapper.vm.$nextTick();

            expect(wrapper.get('#code').element.value).toBe('');
            expect(wrapper.get('#code-error').text()).toBe('');
        },
    );

    it('ignores a resend click while the pending email is being cleared', async () => {
        const post = vi.spyOn(router, 'post').mockImplementation(() => {});
        const wrapper = renderLogin({ pendingEmail: 'you@atb.dev.br' });
        const resend = wrapper
            .findAll('button')
            .find((button) => button.text() === 'Send a new code');

        await wrapper.setProps({ pendingEmail: null });
        await resend.trigger('click');

        expect(post).not.toHaveBeenCalled();
        expect(wrapper.get('#email').element.value).toBe('you@atb.dev.br');
        expect(wrapper.find('#code').exists()).toBe(false);
    });

    it('resends to the pending email and allows choosing another email', async () => {
        const post = vi.spyOn(router, 'post').mockImplementation(() => {});
        const wrapper = renderLogin({ pendingEmail: 'you@atb.dev.br' });
        const resend = wrapper
            .findAll('button')
            .find((button) => button.text() === 'Send a new code');
        await resend.trigger('click');
        expect(post).toHaveBeenCalledWith(
            '/login/email',
            { email: 'you@atb.dev.br' },
            expect.any(Object),
        );
        post.mock.calls[0][2].onError({
            email: 'Please wait before requesting another code.',
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain('Please wait before requesting another code.');

        await wrapper
            .findAll('button')
            .find((button) => button.text() === 'Change email')
            .trigger('click');
        await wrapper.get('form').trigger('submit');
        post.mock.calls[1][2].onSuccess({});
        await wrapper.vm.$nextTick();
        expect(wrapper.find('#code').exists()).toBe(true);

        await wrapper
            .findAll('button')
            .find((button) => button.text() === 'Change email')
            .trigger('click');
        await wrapper.get('#email').setValue('other@atb.dev.br');
        await wrapper.get('form').trigger('submit');
        expect(post).toHaveBeenLastCalledWith(
            '/login/email',
            { email: 'other@atb.dev.br' },
            expect.any(Object),
        );
    });
});
