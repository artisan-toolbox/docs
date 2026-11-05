import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import CodeExample from './CodeExample.vue';

afterEach(() => vi.unstubAllGlobals());

describe('CodeExample', () => {
    it('displays markup as escaped code instead of executable elements', () => {
        const code =
            '<script>alert("example")</script><img src=x onerror=alert(1)>';
        const wrapper = mount(CodeExample, {
            props: { code, label: 'HTML example', language: 'html' },
        });

        expect(wrapper.get('code').text()).toBe(code);
        expect(wrapper.find('script').exists()).toBe(false);
        expect(wrapper.find('img').exists()).toBe(false);
        expect(wrapper.get('pre').attributes('tabindex')).toBe('0');
    });

    it('copies the exact code and announces success', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal('navigator', { clipboard: { writeText } });
        const wrapper = mount(CodeExample, {
            props: { code: 'vendor/bin/maintainer', label: 'Open the menu' },
        });

        await wrapper.get('button').trigger('click');
        await flushPromises();

        expect(writeText).toHaveBeenCalledWith('vendor/bin/maintainer');
        expect(wrapper.get('[role="status"]').text()).toBe(
            'Code copied to clipboard.',
        );
        expect(wrapper.get('button').text()).toBe('Copied');
        expect(wrapper.get('button').attributes('aria-label')).toBe(
            'Copy Open the menu',
        );
    });

    it.each([
        [
            'clipboard access is denied',
            {
                clipboard: {
                    writeText: vi
                        .fn()
                        .mockRejectedValue(new Error('Permission denied')),
                },
            },
        ],
        ['the clipboard API is unavailable', {}],
    ])('announces a manual fallback when %s', async (_condition, navigator) => {
        vi.stubGlobal('navigator', navigator);
        const wrapper = mount(CodeExample, {
            props: { code: 'composer install', label: 'Install dependencies' },
        });

        await wrapper.get('button').trigger('click');
        await flushPromises();

        expect(wrapper.get('[role="status"]').text()).toBe(
            'Unable to copy. Select the code and copy it manually.',
        );
        expect(wrapper.get('code').text()).toBe('composer install');
        expect(wrapper.get('button').attributes('disabled')).toBeUndefined();
    });
});
