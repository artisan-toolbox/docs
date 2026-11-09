import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import PublicSiteHeader from './PublicSiteHeader.vue';

enableAutoUnmount(afterEach);
afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

const links = {
    home: '/',
    docs: '/docs',
    github: 'https://github.com/artisan-toolbox',
};

describe('PublicSiteHeader', () => {
    it('renders one responsive brand image with reserved dimensions', () => {
        const wrapper = mount(PublicSiteHeader, {
            props: { links },
            global: { stubs: { AccountLinks: true } },
        });

        expect(wrapper.findAll('img[alt="Artisan Toolbox"]')).toHaveLength(1);
        expect(wrapper.get('img').attributes()).toMatchObject({
            width: '1456',
            height: '500',
            sizes: '(min-width: 640px) 192px, 160px',
        });
        expect(wrapper.get('img').attributes('src')).toContain('.webp');
    });

    it('offers search whenever the server provides its endpoint', () => {
        const wrapper = mount(PublicSiteHeader, {
            props: { links: { ...links, search: '/docs/search' } },
            global: { stubs: { AccountLinks: true } },
        });

        expect(wrapper.get('button[aria-label="Search documentation"]').exists()).toBe(true);
    });

    it('does not offer search when an endpoint is unavailable', () => {
        const wrapper = mount(PublicSiteHeader, {
            props: { links },
            global: { stubs: { AccountLinks: true } },
        });

        expect(wrapper.find('button[aria-label="Search documentation"]').exists()).toBe(false);
    });

    it('reports its rendered height when controls wrap or resize, then releases observation', () => {
        let height = 148;
        let notify;
        const disconnect = vi.fn();
        const onResize = vi.fn();
        vi.stubGlobal(
            'ResizeObserver',
            class {
                constructor(callback) {
                    notify = callback;
                }
                observe() {}
                disconnect = disconnect;
            },
        );
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
            () => new DOMRect(0, 0, 320, height),
        );
        const wrapper = mount(PublicSiteHeader, {
            props: { links, onResize },
            global: { stubs: { AccountLinks: true } },
        });

        expect(wrapper.emitted('resize')).toEqual([[148]]);
        height = 88;
        notify();
        expect(onResize.mock.calls).toEqual([[148], [88]]);

        wrapper.unmount();
        expect(disconnect).toHaveBeenCalledOnce();
        expect(() => notify()).not.toThrow();
        expect(onResize.mock.calls).toEqual([[148], [88]]);
    });
});
