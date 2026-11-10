import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { highlightCode } from '@/lib/codeHighlighter';
import CodeExample from './CodeExample.vue';

vi.mock('@/lib/codeHighlighter', () => ({ highlightCode: vi.fn() }));

const observerDescriptor = Object.getOwnPropertyDescriptor(window, 'IntersectionObserver');
enableAutoUnmount(afterEach);

beforeEach(() => {
    delete window.IntersectionObserver;
    highlightCode
        .mockReset()
        .mockImplementation(async (code) => [{ content: code, className: 'text-sky-300' }]);
});
afterEach(() => {
    vi.unstubAllGlobals();
    if (observerDescriptor)
        Object.defineProperty(window, 'IntersectionObserver', observerDescriptor);
});

describe('CodeExample', () => {
    it('displays highlighted markup as escaped code instead of executable elements', async () => {
        const code = '<script>alert("example")</script><img src=x onerror=alert(1)>';
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
        expect(wrapper.get('code').element.textContent).toBe('composer install');
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
        expect(wrapper.get('code').element.textContent).toBe('<custom>example</custom>');
        expect(wrapper.find('custom').exists()).toBe(false);
    });

    it('retains readable and copyable source when highlighting fails', async () => {
        highlightCode.mockRejectedValue(new Error('Grammar unavailable'));
        const code = '<?php echo "Still readable";\n';
        const wrapper = mount(CodeExample, {
            props: { code, label: 'PHP example', language: 'php' },
        });
        await flushPromises();
        expect(wrapper.get('code').element.textContent).toBe(code);
        expect(wrapper.text()).toContain('Syntax highlighting is unavailable.');
        expect(wrapper.get('pre').attributes('aria-busy')).toBe('false');
        expect(wrapper.get('wa-copy-button').attributes('value')).toBe(code);
        await wrapper.get('wa-copy-button').trigger('wa-copy');
        expect(wrapper.get('[role="status"][aria-live="polite"]').text()).toBe(
            'Code copied to clipboard.',
        );
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

    it('passes exact source to the public copy control and announces native success', async () => {
        const wrapper = mount(CodeExample, {
            props: { code: 'vendor/bin/maintainer', label: 'Open the menu' },
        });

        expect(wrapper.get('wa-copy-button').attributes('value')).toBe('vendor/bin/maintainer');
        await wrapper.get('wa-copy-button').trigger('wa-copy');
        expect(wrapper.get('[role="status"][aria-live="polite"]').text()).toBe(
            'Code copied to clipboard.',
        );
        expect(wrapper.get('wa-button').text()).toContain('Copied');
        expect(wrapper.get('wa-button').attributes('aria-label')).toBe('Copy Open the menu');
    });

    it('announces the native copy failure and keeps the source available for manual copying', async () => {
        const wrapper = mount(CodeExample, {
            props: { code: 'composer install', label: 'Install dependencies' },
        });

        await wrapper.get('wa-copy-button').trigger('wa-error');

        expect(wrapper.get('[role="status"][aria-live="polite"]').text()).toBe(
            'Unable to copy. Select the code and copy it manually.',
        );
        expect(wrapper.get('code').text()).toBe('composer install');
        expect(wrapper.get('wa-button').attributes('disabled')).toBeUndefined();
    });

    it.each(['wa-copy', 'wa-error'])(
        'clears the previous clipboard result after replacing source following %s',
        async (event) => {
            const wrapper = mount(CodeExample, {
                props: { code: 'composer install', label: 'Install dependencies' },
            });
            await wrapper.get('wa-copy-button').trigger(event);
            expect(wrapper.get('[role="status"][aria-live="polite"]').text()).not.toBe('');

            await wrapper.setProps({ code: 'npm install' });

            expect(wrapper.get('[role="status"][aria-live="polite"]').text()).toBe('');
            expect(wrapper.get('wa-button').text()).not.toContain('Copied');
            expect(wrapper.get('wa-copy-button').attributes('value')).toBe('npm install');
            await wrapper.get('wa-copy-button').trigger('wa-copy');
            expect(wrapper.get('[role="status"][aria-live="polite"]').text()).toBe(
                'Code copied to clipboard.',
            );
        },
    );

    it.each(['wa-copy', 'wa-error'])(
        'ignores an obsolete %s while the new source has not been copied',
        async (event) => {
            const wrapper = mount(CodeExample, {
                props: { code: 'composer install', label: 'Install dependencies' },
            });
            const previousCopy = wrapper.get('wa-copy-button');

            await wrapper.setProps({ code: 'npm install' });
            await previousCopy.trigger(event);

            expect(wrapper.get('[role="status"][aria-live="polite"]').text()).toBe('');
            expect(wrapper.get('wa-button').text()).not.toContain('Copied');
            expect(wrapper.get('wa-copy-button').attributes('value')).toBe('npm install');
        },
    );

    it.each([
        ['wa-copy', 'wa-copy', 'Code copied to clipboard.'],
        ['wa-error', 'wa-copy', 'Code copied to clipboard.'],
        ['wa-copy', 'wa-error', 'Unable to copy. Select the code and copy it manually.'],
        ['wa-error', 'wa-error', 'Unable to copy. Select the code and copy it manually.'],
    ])(
        'ignores obsolete %s after the current source reports %s',
        async (event, currentEvent, expectedStatus) => {
            const wrapper = mount(CodeExample, {
                props: { code: 'composer install', label: 'Install dependencies' },
            });
            const previousCopy = wrapper.get('wa-copy-button');
            await wrapper.setProps({ code: 'npm install' });
            await wrapper.get('wa-copy-button').trigger(currentEvent);

            await previousCopy.trigger(event);

            expect(wrapper.get('[role="status"][aria-live="polite"]').text()).toBe(expectedStatus);
            expect(wrapper.get('wa-button').text().includes('Copied')).toBe(
                currentEvent === 'wa-copy',
            );
        },
    );

    it.each(['wa-copy', 'wa-error'])('does not announce a late %s after unmount', async (event) => {
        const wrapper = mount(CodeExample, {
            props: { code: 'composer install', label: 'Install dependencies' },
        });
        const copy = wrapper.get('wa-copy-button');
        const status = wrapper.get('[role="status"][aria-live="polite"]').element;
        wrapper.unmount();

        await copy.trigger(event);

        expect(status.textContent.trim()).toBe('');
    });
});

describe('CodeExample highlighting admission', () => {
    let observers;

    beforeEach(() => {
        observers = [];
        vi.stubGlobal(
            'IntersectionObserver',
            class {
                constructor(callback, options) {
                    this.callback = callback;
                    this.options = options;
                    this.disconnect = vi.fn();
                    observers.push(this);
                }
                observe(target) {
                    this.target = target;
                }
                emit(isIntersecting) {
                    this.callback([{ target: this.target, isIntersecting, time: 1 }]);
                }
            },
        );
    });

    it('keeps exact source readable and copyable without processing before proximity', async () => {
        const code = '\t<script>example()</script>\r\n\r\n';
        const wrapper = mount(CodeExample, {
            props: { code, label: 'Deferred source', language: 'html' },
        });
        await flushPromises();

        expect(highlightCode).not.toHaveBeenCalled();
        expect(wrapper.get('code').element.textContent).toBe(code);
        expect(wrapper.find('script').exists()).toBe(false);
        expect(wrapper.get('pre').attributes('tabindex')).toBe('0');
        expect(wrapper.get('pre').attributes('aria-busy')).toBe('false');
        expect(wrapper.get('wa-copy-button').attributes('value')).toBe(code);
        await wrapper.get('wa-copy-button').trigger('wa-copy');
        expect(wrapper.get('[role="status"][aria-live="polite"]').text()).toBe(
            'Code copied to clipboard.',
        );
        expect(observers[0].target).toBe(wrapper.element);
        expect(observers[0].options.rootMargin).toBe('200px 0px');
    });

    it('admits only the latest source on first positive entry and keeps its tokens after leaving', async () => {
        const wrapper = mount(CodeExample, {
            props: { code: 'old source', label: 'Source', language: 'js' },
        });
        await flushPromises();
        await wrapper.setProps({
            code: '<?php echo "Current";\r\n',
            language: 'php',
        });
        observers[0].emit(false);
        await flushPromises();
        expect(highlightCode).not.toHaveBeenCalled();
        expect(wrapper.get('code').element.textContent).toBe('<?php echo "Current";\r\n');

        observers[0].emit(true);
        await flushPromises();
        const highlightedNode = wrapper.get('code span').element;
        expect(highlightCode).toHaveBeenCalledExactlyOnceWith('<?php echo "Current";\r\n', 'php');
        expect(observers[0].disconnect).toHaveBeenCalledOnce();
        observers[0].emit(false);
        observers[0].emit(true);
        observers[0].emit(true);
        await flushPromises();
        expect(highlightCode).toHaveBeenCalledOnce();
        expect(wrapper.get('code span').element).toBe(highlightedNode);
        await wrapper.setProps({ code: 'updated source' });
        await flushPromises();
        expect(highlightCode).toHaveBeenLastCalledWith('updated source', 'php');
        expect(wrapper.get('code').element.textContent).toBe('updated source');
    });

    it('shows loading only after admission and ignores results for a superseded source', async () => {
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
        observers[0].emit(true);
        await flushPromises();
        expect(wrapper.get('pre').attributes('aria-busy')).toBe('true');
        expect(wrapper.get('code').element.textContent).toBe('old source');
        await wrapper.setProps({ code: 'current source', language: 'php' });
        await flushPromises();
        finishOld([{ content: 'old source', className: 'text-violet-300' }]);
        await flushPromises();
        expect(wrapper.get('code').element.textContent).toBe('current source');
        expect(wrapper.get('pre').attributes('aria-busy')).toBe('false');
    });

    it('does not process a source superseded before its highlighter import resolves', async () => {
        const wrapper = mount(CodeExample, {
            props: { code: 'old source', label: 'Source', language: 'js' },
        });
        await flushPromises();
        observers[0].emit(true);
        await wrapper.setProps({ code: 'current source', language: 'php' });
        await flushPromises();
        expect(highlightCode).toHaveBeenCalledExactlyOnceWith('current source', 'php');
        expect(wrapper.get('code').element.textContent).toBe('current source');
    });

    it('does not start processing if unmounted before the highlighter import resolves', async () => {
        const wrapper = mount(CodeExample, {
            props: { code: 'source', label: 'Source', language: 'js' },
        });
        await flushPromises();
        observers[0].emit(true);
        await wrapper.vm.$nextTick();
        wrapper.unmount();
        await flushPromises();
        expect(highlightCode).not.toHaveBeenCalled();
    });

    it('disconnects on unmount and ignores queued observer entries', async () => {
        const wrapper = mount(CodeExample, {
            props: { code: 'source', label: 'Source', language: 'js' },
        });
        await flushPromises();
        wrapper.unmount();
        expect(observers[0].disconnect).toHaveBeenCalledOnce();
        observers[0].emit(true);
        await flushPromises();
        expect(highlightCode).not.toHaveBeenCalled();
    });

    it('does not commit a pending highlight after unmount', async () => {
        let finish;
        highlightCode.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    finish = resolve;
                }),
        );
        const wrapper = mount(CodeExample, {
            props: { code: 'source', label: 'Source', language: 'js' },
        });
        await flushPromises();
        observers[0].emit(true);
        await flushPromises();
        const code = wrapper.get('code').element;
        wrapper.unmount();
        finish([{ content: 'unexpected late tokens', className: 'text-sky-300' }]);
        await flushPromises();
        expect(code.textContent).toBe('source');
        expect(code.querySelector('span')).toBeNull();
    });
});
