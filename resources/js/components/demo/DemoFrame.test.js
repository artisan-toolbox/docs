import { nextTick } from 'vue';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { highlightCode } from '@/lib/codeHighlighter';
import DemoFrame from './DemoFrame.vue';

vi.mock('@/lib/codeHighlighter', () => ({ highlightCode: vi.fn() }));

const observerDescriptor = Object.getOwnPropertyDescriptor(window, 'IntersectionObserver');
enableAutoUnmount(afterEach);
let observers;

beforeEach(() => {
    observers = [];
    highlightCode
        .mockReset()
        .mockImplementation(async (code) => [{ content: code, className: 'text-sky-300' }]);
    vi.stubGlobal(
        'IntersectionObserver',
        class {
            constructor(callback) {
                this.callback = callback;
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
afterEach(() => {
    vi.unstubAllGlobals();
    if (observerDescriptor)
        Object.defineProperty(window, 'IntersectionObserver', observerDescriptor);
});

function mountDemo() {
    return mount(DemoFrame, {
        props: {
            title: 'Example demo',
            description: 'Try this example.',
            sources: [
                {
                    label: 'First source',
                    language: 'js',
                    code: '\tconst first = "<example>";\r\n',
                },
                {
                    label: 'Second source',
                    language: 'php',
                    code: '<?php echo "Second";\n',
                },
            ],
        },
        slots: { default: '<button>Run demo</button>' },
    });
}

async function toggleSource(wrapper, open) {
    const details = wrapper.get('details');
    details.element.open = open;
    await details.trigger('toggle');
    await flushPromises();
}

describe('DemoFrame source activation', () => {
    it('keeps closed sources mounted and exact without processing or observing them', async () => {
        const wrapper = mountDemo();
        await flushPromises();

        expect(wrapper.get('details').attributes('open')).toBeUndefined();
        expect(wrapper.get('summary').text()).toBe('View source');
        expect(wrapper.findAll('code').map((code) => code.element.textContent)).toEqual([
            '\tconst first = "<example>";\r\n',
            '<?php echo "Second";\n',
        ]);
        expect(wrapper.find('example').exists()).toBe(false);
        expect(highlightCode).not.toHaveBeenCalled();
        expect(observers).toHaveLength(0);
    });

    it('ignores disclosure events from nested controls', async () => {
        const wrapper = mountDemo();
        await flushPromises();
        await wrapper.get('code').trigger('toggle');
        expect(highlightCode).not.toHaveBeenCalled();
        expect(observers).toHaveLength(0);
        await toggleSource(wrapper, true);
        expect(observers).toHaveLength(2);
    });

    it('admits nearby sources after first opening and retains tokens across close and reopen', async () => {
        let finishFirst;
        highlightCode.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    finishFirst = resolve;
                }),
        );
        const wrapper = mountDemo();
        await flushPromises();
        const originalCode = wrapper.findAll('code')[0].element;
        await toggleSource(wrapper, true);
        expect(highlightCode).not.toHaveBeenCalled();
        expect(observers).toHaveLength(2);
        observers[0].emit(true);
        await flushPromises();
        expect(highlightCode).toHaveBeenCalledExactlyOnceWith(
            '\tconst first = "<example>";\r\n',
            'javascript',
        );
        await toggleSource(wrapper, false);
        finishFirst([
            {
                content: '\tconst first = "<example>";\r\n',
                className: 'text-sky-300',
            },
        ]);
        await flushPromises();
        const token = wrapper.get('code span').element;
        await toggleSource(wrapper, true);
        expect(wrapper.findAll('code')[0].element).toBe(originalCode);
        expect(wrapper.get('code span').element).toBe(token);
        expect(highlightCode).toHaveBeenCalledOnce();
        expect(wrapper.findAll('code')[1].find('span').exists()).toBe(false);
    });

    it('keeps closed sources idle without observer support and highlights only after opening', async () => {
        delete window.IntersectionObserver;
        const wrapper = mountDemo();
        await flushPromises();
        expect(highlightCode).not.toHaveBeenCalled();
        expect(wrapper.findAll('pre').every((pre) => pre.attributes('aria-busy') === 'false')).toBe(
            true,
        );
        await wrapper.setProps({
            sources: [
                {
                    label: 'First source',
                    language: 'php',
                    code: '<?php echo "Latest";\r\n',
                },
            ],
        });
        expect(wrapper.get('code').element.textContent).toBe('<?php echo "Latest";\r\n');
        expect(highlightCode).not.toHaveBeenCalled();
        await toggleSource(wrapper, true);
        expect(highlightCode).toHaveBeenCalledExactlyOnceWith('<?php echo "Latest";\r\n', 'php');
        const token = wrapper.get('code span').element;
        await toggleSource(wrapper, false);
        await toggleSource(wrapper, true);
        expect(wrapper.get('code span').element).toBe(token);
        expect(highlightCode).toHaveBeenCalledOnce();
    });
});

async function resizableDemo() {
    let notify;
    const disconnect = vi.fn();
    vi.stubGlobal(
        'ResizeObserver',
        class {
            constructor(callback) {
                notify = callback;
            }
            observe() {}
            unobserve() {}
            disconnect = disconnect;
        },
    );
    const wrapper = mountDemo();
    await flushPromises();
    async function available(width) {
        notify([{ contentRect: { width, height: 100 } }]);
        await nextTick();
    }
    await available(800);
    return { wrapper, available, disconnect };
}

describe('DemoFrame responsive viewport', () => {
    it('resizes with presets, preserves mounted demo state, and clamps to the containing page', async () => {
        const { wrapper, available, disconnect } = await resizableDemo();
        const viewport = wrapper.get('[data-demo-viewport]');
        const demoButton = wrapper
            .findAll('button')
            .find((button) => button.text() === 'Run demo').element;
        expect(viewport.attributes('style')).toContain('width: 800px');
        await wrapper
            .findAll('button')
            .find((button) => button.text() === 'Compact')
            .trigger('click');
        expect(viewport.attributes('style')).toContain('width: 320px');
        expect(
            wrapper.findAll('button').find((button) => button.text() === 'Run demo').element,
        ).toBe(demoButton);
        await available(220);
        expect(viewport.attributes('style')).toContain('width: 220px');
        expect(wrapper.find('[role="separator"]').exists()).toBe(false);
        await available(900);
        expect(viewport.attributes('style')).toContain('width: 320px');
        await wrapper
            .findAll('button')
            .find((button) => button.text() === 'Full')
            .trigger('click');
        expect(viewport.attributes('style')).toContain('width: 900px');
        wrapper.unmount();
        expect(disconnect).toHaveBeenCalled();
    });

    it('supports keyboard adjustment and announces the actual width', async () => {
        const { wrapper } = await resizableDemo();
        const handle = wrapper.get('[role="separator"]');
        expect(handle.attributes('aria-valuenow')).toBe('800');
        expect(handle.attributes('aria-orientation')).toBe('vertical');
        await handle.trigger('keydown', { key: 'ArrowLeft' });
        expect(handle.attributes('aria-valuenow')).toBe('790');
        await handle.trigger('keydown', { key: 'ArrowLeft', shiftKey: true });
        expect(handle.attributes('aria-valuenow')).toBe('750');
        await handle.trigger('keydown', { key: 'Home' });
        expect(handle.attributes('aria-valuenow')).toBe('280');
        await handle.trigger('keydown', { key: 'End' });
        expect(handle.attributes('aria-valuenow')).toBe('800');
        expect(wrapper.get('output').text()).toBe('800 px');
    });

    it('keeps pointer dragging captured by its own handle and ends it on release', async () => {
        const { wrapper } = await resizableDemo();
        const handle = wrapper.get('[role="separator"]');
        const capture = vi.fn();
        const release = vi.fn();
        handle.element.setPointerCapture = capture;
        handle.element.hasPointerCapture = () => true;
        handle.element.releasePointerCapture = release;
        await handle.trigger('pointerdown', { button: 0, pointerId: 7, clientX: 800 });
        await handle.trigger('pointermove', { pointerId: 7, clientX: 650 });
        expect(handle.attributes('aria-valuenow')).toBe('500');
        await handle.trigger('pointerup', { pointerId: 7 });
        await handle.trigger('pointermove', { pointerId: 7, clientX: 700 });
        expect(handle.attributes('aria-valuenow')).toBe('500');
        expect(capture).toHaveBeenCalledWith(7);
        expect(release).toHaveBeenCalledWith(7);
    });

    it.each(['pointercancel', 'lostpointercapture'])(
        'ends resizing after %s and ignores unrelated pointer events',
        async (endEvent) => {
            const { wrapper } = await resizableDemo();
            const handle = wrapper.get('[role="separator"]');
            const capture = vi.fn();
            handle.element.setPointerCapture = capture;
            handle.element.hasPointerCapture = () => true;
            handle.element.releasePointerCapture = vi.fn();

            await handle.trigger('pointerdown', { button: 2, pointerId: 1, clientX: 800 });
            await handle.trigger('pointermove', { pointerId: 1, clientX: 600 });
            expect(handle.attributes('aria-valuenow')).toBe('800');
            expect(capture).not.toHaveBeenCalled();

            await handle.trigger('pointerdown', { button: 0, pointerId: 7, clientX: 800 });
            await handle.trigger('pointermove', { pointerId: 8, clientX: 650 });
            await handle.trigger('pointerup', { pointerId: 8 });
            expect(handle.attributes('aria-valuenow')).toBe('800');
            await handle.trigger('pointermove', { pointerId: 7, clientX: 650 });
            expect(handle.attributes('aria-valuenow')).toBe('500');

            await handle.trigger(endEvent, { pointerId: 7 });
            await handle.trigger('pointermove', { pointerId: 7, clientX: 700 });
            expect(handle.attributes('aria-valuenow')).toBe('500');

            await handle.trigger('pointerdown', { button: 0, pointerId: 9, clientX: 650 });
            await handle.trigger('pointermove', { pointerId: 9, clientX: 700 });
            expect(handle.attributes('aria-valuenow')).toBe('600');
        },
    );

    it('clamps pointer and keyboard adjustments to the accessible width range', async () => {
        const { wrapper } = await resizableDemo();
        const handle = wrapper.get('[role="separator"]');
        handle.element.setPointerCapture = vi.fn();
        handle.element.hasPointerCapture = () => false;
        await handle.trigger('pointerdown', { button: 0, pointerId: 7, clientX: 800 });
        await handle.trigger('pointermove', { pointerId: 7, clientX: 100 });
        expect(handle.attributes('aria-valuenow')).toBe('280');
        await handle.trigger('keydown', { key: 'ArrowLeft', shiftKey: true });
        expect(handle.attributes('aria-valuenow')).toBe('280');
        await handle.trigger('pointermove', { pointerId: 7, clientX: 1000 });
        expect(handle.attributes('aria-valuenow')).toBe('800');
        await handle.trigger('keydown', { key: 'ArrowRight', shiftKey: true });
        expect(handle.attributes('aria-valuenow')).toBe('800');
        expect(handle.attributes('aria-valuemin')).toBe('280');
        expect(handle.attributes('aria-valuemax')).toBe('800');
        expect(wrapper.get('output').text()).toBe('800 px');
    });
});
