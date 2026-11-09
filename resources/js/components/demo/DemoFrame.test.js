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

        expect(wrapper.get('details').element.open).toBe(false);
        expect(wrapper.get('summary').text()).toBe('View the running source');
        expect(wrapper.findAll('code').map((code) => code.element.textContent)).toEqual([
            '\tconst first = "<example>";\r\n',
            '<?php echo "Second";\n',
        ]);
        expect(wrapper.find('example').exists()).toBe(false);
        expect(highlightCode).not.toHaveBeenCalled();
        expect(observers).toHaveLength(0);
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
