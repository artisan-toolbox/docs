import { Page } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { router } from '@inertiajs/vue3';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import ziggy from '../../../../tests/Fixtures/ziggy.json';
import Login from './Login.vue';

// Happy DOM has no ElementInternals. Browser coverage verifies the native controls.
vi.mock('@web.awesome.me/webawesome-pro/dist/components/input/input.js', () => ({}));
vi.mock('@web.awesome.me/webawesome-pro/dist/components/button/button.js', () => ({}));
vi.mock('@web.awesome.me/webawesome-pro/dist/components/page/page.js', () => ({}));

enableAutoUnmount(afterEach);

async function setField(wrapper, selector, value) {
    await flushPromises();
    const field = wrapper.get(selector);
    field.element.value = value;
    await field.trigger('input');
}

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
    it('provides the native Page skip destination inside the isolated sign-in canvas', () => {
        const wrapper = renderLogin();
        const page = wrapper.getComponent(Page);

        expect(page.get('wa-page').attributes('disable-navigation-toggle')).toBeDefined();
        expect(page.get('wa-page').attributes('disable-sticky')).toBe('header menu aside');
        expect(page.get('main').attributes('id')).toBe('main-content');
        expect(page.get('main').attributes('tabindex')).toBe('-1');
        expect(page.findAll('#main-content')).toHaveLength(1);
        expect(page.find('a[href="#main-content"]').exists()).toBe(false);
        expect(page.get('header').attributes('slot')).toBeUndefined();
        expect(Login.layout).toEqual([]);
    });

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
        await setField(wrapper, '#email', 'you@atb.dev.br');
        await wrapper.get('form').trigger('submit');
        expect(post).toHaveBeenLastCalledWith(
            '/staff/code',
            { email: 'you@atb.dev.br' },
            expect.any(Object),
        );
        await wrapper.setProps({ pendingEmail: 'you@atb.dev.br' });
        post.mock.calls[0][2].onSuccess({});
        await wrapper.vm.$nextTick();
        await setField(wrapper, '#code', '001234');
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

        expect(wrapper.find('wa-input[type="password"]').exists()).toBe(false);
        await flushPromises();
        expect(
            wrapper.get('#email').element.placeholder ??
                wrapper.get('#email').attributes('placeholder'),
        ).toBe('you@atb.dev.br');
        await setField(wrapper, '#email', 'you@atb.dev.br');
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
        await setField(wrapper, '#email', 'you@example.com');
        await wrapper.get('form').trigger('submit');
        const options = post.mock.calls[0][2];
        options.onStart({});
        await wrapper.vm.$nextTick();
        expect(wrapper.get('wa-button').attributes('disabled')).toBeDefined();
        options.onError({ email: 'Use your work email.' });
        options.onFinish({});
        await wrapper.vm.$nextTick();

        expect(wrapper.get('#email [role="alert"]').text()).toBe('Use your work email.');
        expect(wrapper.get('#email').attributes('aria-invalid')).toBe('true');
        expect(wrapper.find('#code').exists()).toBe(false);
    });

    it('submits all six code digits as text and renders verification errors', async () => {
        const post = vi.spyOn(router, 'post').mockImplementation(() => {});
        const wrapper = renderLogin({ pendingEmail: 'you@atb.dev.br' });
        await flushPromises();
        expect(
            wrapper.get('#code').element.autocomplete ??
                wrapper.get('#code').attributes('autocomplete'),
        ).toBe('one-time-code');
        await setField(wrapper, '#code', '001234');
        await wrapper.get('form').trigger('submit');

        expect(post).toHaveBeenCalledWith('/login', { code: '001234' }, expect.any(Object));
        post.mock.calls[0][2].onError({ code: 'The code has expired.' });
        await wrapper.vm.$nextTick();
        expect(wrapper.get('#code [role="alert"]').text()).toBe('The code has expired.');
    });

    it('disables the code field and all actions while verification is processing', async () => {
        const post = vi.spyOn(router, 'post').mockImplementation(() => {});
        const wrapper = renderLogin({ pendingEmail: 'you@atb.dev.br' });
        await setField(wrapper, '#code', '001234');
        await wrapper.get('form').trigger('submit');
        const options = post.mock.calls[0][2];
        options.onStart({});
        await wrapper.vm.$nextTick();

        expect(wrapper.get('#code').attributes('disabled')).toBeDefined();
        for (const button of wrapper.findAll('wa-button')) {
            expect(button.attributes('disabled')).toBeDefined();
        }
        expect(wrapper.text()).toContain('Signing in...');

        options.onFinish({});
        await wrapper.vm.$nextTick();
        expect(wrapper.get('#code').attributes('disabled')).toBeUndefined();
        for (const button of wrapper.findAll('wa-button')) {
            expect(button.attributes('disabled')).toBeUndefined();
        }
        expect(wrapper.get('#code').element.value).toBe('001234');
    });

    it.each(['The code has expired.', 'Too many attempts. Please request a new code.'])(
        'returns to the email form when the pending code is cleared: %s',
        async (message) => {
            const post = vi.spyOn(router, 'post').mockImplementation(() => {});
            const wrapper = renderLogin({ pendingEmail: 'you@atb.dev.br' });
            await setField(wrapper, '#code', '001234');
            await wrapper.get('form').trigger('submit');
            const verification = post.mock.calls[0][2];

            await wrapper.setProps({ pendingEmail: null });
            verification.onError({ code: message });
            await wrapper.vm.$nextTick();

            expect(wrapper.find('#code').exists()).toBe(false);
            await flushPromises();
            await vi.waitFor(() =>
                expect(wrapper.get('#email').element.value).toBe('you@atb.dev.br'),
            );
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

            await flushPromises();
            expect(wrapper.get('#code').element.value).toBe('');
            expect(wrapper.find('#code [role="alert"]').exists()).toBe(false);
        },
    );

    it('ignores a resend click while the pending email is being cleared', async () => {
        const post = vi.spyOn(router, 'post').mockImplementation(() => {});
        const wrapper = renderLogin({ pendingEmail: 'you@atb.dev.br' });
        const resend = wrapper
            .findAll('wa-button')
            .find((button) => button.text() === 'Send a new code');

        await wrapper.setProps({ pendingEmail: null });
        await resend.trigger('click');

        expect(post).not.toHaveBeenCalled();
        await flushPromises();
        await vi.waitFor(() => expect(wrapper.get('#email').element.value).toBe('you@atb.dev.br'));
        expect(wrapper.find('#code').exists()).toBe(false);
    });

    it('resends to the pending email and allows choosing another email', async () => {
        const post = vi.spyOn(router, 'post').mockImplementation(() => {});
        const wrapper = renderLogin({ pendingEmail: 'you@atb.dev.br' });
        const resend = wrapper
            .findAll('wa-button')
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
            .findAll('wa-button')
            .find((button) => button.text() === 'Change email')
            .trigger('click');
        await wrapper.get('form').trigger('submit');
        post.mock.calls[1][2].onSuccess({});
        await wrapper.vm.$nextTick();
        expect(wrapper.find('#code').exists()).toBe(true);

        await wrapper
            .findAll('wa-button')
            .find((button) => button.text() === 'Change email')
            .trigger('click');
        await setField(wrapper, '#email', 'other@atb.dev.br');
        await wrapper.get('form').trigger('submit');
        expect(post).toHaveBeenLastCalledWith(
            '/login/email',
            { email: 'other@atb.dev.br' },
            expect.any(Object),
        );
    });
});
