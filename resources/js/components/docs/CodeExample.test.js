import { flushPromises, mount } from '@vue/test-utils';
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vite-plus/test';
import { highlightCode } from '@/lib/codeHighlighter';
import CodeExample from './CodeExample.vue';

vi.mock('@/lib/codeHighlighter', () => ({ highlightCode: vi.fn() }));

beforeEach(() => {
    highlightCode
        .mockReset()
        .mockImplementation(async (code) => [
            { content: code, className: 'text-sky-300' },
        ]);
});
afterEach(() => vi.unstubAllGlobals());

describe('CodeExample', () => {
    it('displays highlighted markup as escaped code instead of executable elements', async () => {
        const code =
            '<script>alert("example")</script><img src=x onerror=alert(1)>';
        const wrapper = mount(CodeExample, {
            props: { code, label: 'HTML example', language: 'html' },
        });

        await flushPromises();

        expect(wrapper.get('code').text()).toBe(code);
        expect(wrapper.find('script').exists()).toBe(false);
        expect(wrapper.find('img').exists()).toBe(false);
        expect(wrapper.get('pre').attributes('tabindex')).toBe('0');
        expect(wrapper.get('code span').classes()).toContain('text-sky-300');
    });

    it('identifies shell and source blocks while preserving exact whitespace', async () => {
        const code = '\tconst message = "Hello";\r\n\r\n';
        const wrapper = mount(CodeExample, {
            props: { code, label: 'Example script', language: 'ts' },
        });
        await flushPromises();
        expect(wrapper.attributes('data-code-language')).toBe('typescript');
        expect(wrapper.get('figcaption').text()).toContain('TypeScript');
        expect(wrapper.get('code').element.textContent).toBe(code);
        await wrapper.setProps({ code: 'composer install', language: 'bash' });
        await flushPromises();
        expect(wrapper.attributes('data-code-language')).toBe('shellscript');
        expect(wrapper.get('figcaption').text()).toContain('Shell');
        expect(wrapper.get('code').element.textContent).toBe(
            'composer install',
        );
    });

    it('keeps unknown languages readable without guessing a grammar', async () => {
        const wrapper = mount(CodeExample, {
            props: {
                code: '<custom>example</custom>',
                label: 'Custom data',
                language: 'unknown-language',
            },
        });
        await flushPromises();
        expect(highlightCode).not.toHaveBeenCalled();
        expect(wrapper.get('figcaption').text()).toContain('Plain text');
        expect(wrapper.get('code').element.textContent).toBe(
            '<custom>example</custom>',
        );
        expect(wrapper.find('custom').exists()).toBe(false);
    });

    it('retains readable and copyable source when highlighting fails', async () => {
        highlightCode.mockRejectedValue(new Error('Grammar unavailable'));
        const writeText = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal('navigator', { clipboard: { writeText } });
        const code = '<?php echo "Still readable";\n';
        const wrapper = mount(CodeExample, {
            props: { code, label: 'PHP example', language: 'php' },
        });
        await flushPromises();
        expect(wrapper.get('code').element.textContent).toBe(code);
        expect(wrapper.text()).toContain('Syntax highlighting is unavailable.');
        expect(wrapper.get('pre').attributes('aria-busy')).toBe('false');
        await wrapper.get('button').trigger('click');
        await flushPromises();
        expect(writeText).toHaveBeenCalledWith(code);
    });

    it('ignores a late highlight result after the source changes', async () => {
        let finishOld;
        highlightCode.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    finishOld = resolve;
                }),
        );
        const wrapper = mount(CodeExample, {
            props: { code: 'old source', label: 'Source', language: 'js' },
        });
        await flushPromises();
        await wrapper.setProps({ code: 'current source', language: 'php' });
        await flushPromises();
        finishOld([{ content: 'old source', className: 'text-violet-300' }]);
        await flushPromises();
        expect(wrapper.get('code').element.textContent).toBe('current source');
        expect(wrapper.get('figcaption').text()).toContain('PHP');
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
