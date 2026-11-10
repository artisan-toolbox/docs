import { config, flushPromises } from '@vue/test-utils';
import { vi } from 'vite-plus/test';

config.global.stubs.SiteIcon = true;

// Detached hosts cannot finish Lit's first update, and this DOM environment lacks native form internals.
export async function settleDetachedHostUpdates(wrapper) {
    for (const node of wrapper.findAll('*')) {
        if (node.element.localName.startsWith('wa-')) {
            Object.defineProperty(node.element, 'updateComplete', {
                configurable: true,
                value: Promise.resolve(true),
            });
        }
    }
    await vi.dynamicImportSettled();
    await flushPromises();
}
