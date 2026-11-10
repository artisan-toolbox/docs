import { http } from '@inertiajs/core';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { renderPrintRequest } from '@artisan-toolbox/qztray';
import { PrintDrawer } from '@artisan-toolbox/front-awesome/printing';
import PrintingDemo from './PrintingDemo.vue';
import { settleDetachedHostUpdates } from '@/testSetup';

vi.mock('@artisan-toolbox/qztray', () => ({
    preparePrintDocument: vi.fn(async (document) => document),
    renderPrintRequest: vi.fn(async () => ['data:image/png;base64,cHJldmlldw==']),
}));

const originalClient = http.getClient();
const request = vi.fn();
const wrappers = [];
afterEach(async () => {
    for (const wrapper of wrappers.splice(0)) await settleDetachedHostUpdates(wrapper);
});
enableAutoUnmount(afterEach);
beforeEach(() => {
    request.mockReset();
    vi.mocked(renderPrintRequest).mockClear();
    http.setClient({ request });
    globalThis.Ziggy = {
        url: 'https://docs.example.test',
        port: null,
        defaults: {},
        routes: {
            'demo.front-awesome.printing.documents': {
                uri: 'examples/printing/documents',
                methods: ['POST'],
            },
        },
    };
});
afterEach(() => {
    http.setClient(originalClient);
    delete globalThis.Ziggy;
});

const action = (wrapper, text) =>
    wrapper.findAllComponents(Button).find((button) => button.text().includes(text));
function mountDemo() {
    const wrapper = mount(PrintingDemo, { global: { stubs: { PrintDrawer: true } } });
    wrappers.push(wrapper);
    return wrapper;
}

describe('Printing documentation demonstration', () => {
    it('waits for reader action and previews the real server result through the public adapter', async () => {
        const documents = {
            receipt: 'G0BSZWNlaXB0Cg==',
            invoice: 'JVBERi0xLjQ=',
            labels: '^XA^FDHello^FS^XZ',
        };
        request.mockResolvedValue({ status: 200, data: JSON.stringify(documents), headers: {} });
        const wrapper = mountDemo();
        await flushPromises();
        expect(request).not.toHaveBeenCalled();
        expect(renderPrintRequest).not.toHaveBeenCalled();

        action(wrapper, 'Open print demonstration').vm.$emit('click');
        await flushPromises();
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                method: 'post',
                url: 'https://docs.example.test/examples/printing/documents',
            }),
        );
        expect(renderPrintRequest).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'escpos',
                flavor: 'base64',
                payload: documents.receipt,
            }),
            expect.objectContaining({ escpos: { widthDots: 576 } }),
        );
        expect(wrapper.text()).toContain('0 simulated submissions. No physical printing.');
        action(wrapper, 'Open print demonstration').vm.$emit('click');
        await flushPromises();
        expect(request).toHaveBeenCalledTimes(1);
    });

    it('shows failed preparation without a submission when the document request fails', async () => {
        request.mockRejectedValue(new Error('Offline'));
        const wrapper = mountDemo();
        action(wrapper, 'Open print demonstration').vm.$emit('click');
        await flushPromises();
        expect(wrapper.findComponent(PrintDrawer).props('service').currentStep.value.status).toBe(
            'failed',
        );
        expect(wrapper.find('[aria-label="Demonstration results"]').exists()).toBe(false);
        expect(wrapper.text()).toContain('0 simulated submissions. No physical printing.');
        expect(renderPrintRequest).not.toHaveBeenCalled();
    });
});
