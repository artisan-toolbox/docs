import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { renderZpl } from '@artisan-toolbox/qztray';
import DemoAction from '@/components/demo/DemoAction.vue';
import ZplPreviewDemo from './ZplPreviewDemo.vue';

vi.mock('@artisan-toolbox/qztray', () => ({ renderZpl: vi.fn() }));
enableAutoUnmount(afterEach);
beforeEach(() => renderZpl.mockReset());
const actions = (wrapper) => wrapper.findAllComponents(DemoAction);
const deferred = () => {
    let resolve;
    const promise = new Promise((done) => {
        resolve = done;
    });
    return { promise, resolve };
};

describe('local ZPL preview', () => {
    it('waits for the reader, renders the public API result, and clears it', async () => {
        const pending = deferred();
        renderZpl.mockReturnValueOnce(pending.promise);
        const wrapper = mount(ZplPreviewDemo);
        expect(renderZpl).not.toHaveBeenCalled();
        expect(wrapper.find('img').exists()).toBe(false);
        expect(wrapper.get('[data-docs-outline-exclude]').exists()).toBe(true);
        expect(wrapper.get('[data-search-exclude]').exists()).toBe(true);
        expect(wrapper.get('details code').text()).toContain(
            "await import('@artisan-toolbox/qztray')",
        );
        await actions(wrapper)[0].trigger('click');
        await flushPromises();
        expect(wrapper.get('[role="status"]').text()).toBe('Rendering label…');
        expect(renderZpl).toHaveBeenCalledExactlyOnceWith('^XA^FO20,20^A0N,30,30^FDHello^FS^XZ', {
            widthMm: 100,
            heightMm: 150,
            dpmm: 8,
        });
        pending.resolve('data:image/png;base64,first');
        await flushPromises();
        expect(wrapper.get('img').attributes('src')).toBe('data:image/png;base64,first');
        expect(wrapper.get('img').attributes('alt')).toBe('Label containing Hello');
        await actions(wrapper)[1].trigger('click');
        expect(wrapper.find('img').exists()).toBe(false);
        expect(renderZpl).toHaveBeenCalledTimes(1);
    });

    it('reports a renderer failure and lets the reader retry', async () => {
        renderZpl
            .mockRejectedValueOnce(new Error('Renderer unavailable.'))
            .mockResolvedValueOnce('data:image/png;base64,retry');
        const wrapper = mount(ZplPreviewDemo);
        await actions(wrapper)[0].trigger('click');
        await flushPromises();
        expect(wrapper.get('[role="alert"]').text()).toBe('Renderer unavailable.');
        await actions(wrapper)[0].trigger('click');
        await flushPromises();
        expect(wrapper.find('[role="alert"]').exists()).toBe(false);
        expect(wrapper.get('img').attributes('src')).toBe('data:image/png;base64,retry');
    });

    it('keeps a newer preview when a cleared request finishes later', async () => {
        const older = deferred();
        renderZpl
            .mockReturnValueOnce(older.promise)
            .mockResolvedValueOnce('data:image/png;base64,new');
        const wrapper = mount(ZplPreviewDemo);
        await actions(wrapper)[0].trigger('click');
        await flushPromises();
        await actions(wrapper)[1].trigger('click');
        await actions(wrapper)[0].trigger('click');
        await flushPromises();
        older.resolve('data:image/png;base64,stale');
        await flushPromises();
        expect(wrapper.get('img').attributes('src')).toBe('data:image/png;base64,new');
        expect(wrapper.get('[role="status"]').text()).toBe('Label preview ready.');
    });
});
