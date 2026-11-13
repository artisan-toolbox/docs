import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import '@web.awesome.me/webawesome-pro/dist/components/icon/icon.js';
import { getIconLibrary } from '@web.awesome.me/webawesome-pro/dist/components/icon/library.js';
import { setKitCode } from '@web.awesome.me/webawesome-pro/dist/utilities/base-path.js';
import SiteIcon from './SiteIcon.vue';

enableAutoUnmount(afterEach);

afterEach(() => {
    document.documentElement.removeAttribute('data-fa-kit-code');
    setKitCode('');
});

function render(props) {
    return mount(SiteIcon, { props, global: { stubs: { SiteIcon: false } } });
}

describe('shared site icons', () => {
    it.each([
        ['pest', 'kit', 'fa-kit'],
        ['inertia', 'kit', 'fa-kit'],
        ['atb-core', 'kit-duotone', 'fa-kit-duotone'],
        ['atb-dapter', 'kit-duotone', 'fa-kit-duotone'],
        ['atb-filoquent', 'kit-duotone', 'fa-kit-duotone'],
    ])('uses the published kit markup for %s', (name, family, prefix) => {
        const wrapper = render({ name, family });
        expect(wrapper.element.tagName).toBe('SPAN');
        expect(wrapper.get('i').classes()).toEqual([prefix, `fa-${name}`]);
        expect(wrapper.attributes('aria-hidden')).toBe('true');
        expect(wrapper.get('i').attributes('aria-hidden')).toBe('true');
        expect(wrapper.attributes()).toHaveProperty('data-search-exclude');
    });

    it('updates the wrapper without touching kit-owned SVG nodes and replaces the container when identity changes', async () => {
        const wrapper = render({
            name: 'pest',
            family: 'kit',
            label: 'Pest',
            size: 'sm',
        });
        const ownedContainer = wrapper.get('[data-kit-icon]').element;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        wrapper.get('i').element.replaceWith(svg);

        await wrapper.setProps({ label: 'Pest framework', size: 'lg' });
        expect(wrapper.attributes('role')).toBe('img');
        expect(wrapper.attributes('aria-label')).toBe('Pest framework');
        expect(wrapper.classes()).toContain('text-base');
        expect(wrapper.get('svg').element).toBe(svg);

        await wrapper.setProps({
            name: 'atb-mosaicast',
            family: 'kit-duotone',
            label: '',
        });
        expect(wrapper.get('[data-kit-icon]').element).not.toBe(ownedContainer);
        expect(wrapper.find('svg').exists()).toBe(false);
        expect(wrapper.get('i').classes()).toEqual(['fa-kit-duotone', 'fa-atb-mosaicast']);
        expect(wrapper.attributes('aria-hidden')).toBe('true');
        expect(wrapper.attributes('aria-label')).toBeUndefined();
    });

    it('switches between replaced kit icons and native WA icons without stale nodes', async () => {
        const wrapper = render({ name: 'atb-core', family: 'kit-duotone' });
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        wrapper.get('i').element.replaceWith(svg);
        await wrapper.setProps({ name: 'house', family: 'classic' });
        expect(wrapper.element.tagName).toBe('WA-ICON');
        expect(wrapper.find('svg').exists()).toBe(false);
        await wrapper.setProps({ name: 'inertia', family: 'kit' });
        expect(wrapper.get('i').classes()).toEqual(['fa-kit', 'fa-inertia']);
        wrapper.unmount();
    });

    it('renders a decorative native Web Awesome icon with consistent defaults', async () => {
        const wrapper = render({ name: 'book-open' });
        expect(wrapper.element.tagName).toBe('WA-ICON');
        await flushPromises();
        expect(wrapper.element).toMatchObject({
            name: 'book-open',
            family: 'classic',
            variant: 'solid',
        });
        expect(wrapper.attributes('aria-hidden')).toBe('true');
        expect(wrapper.text()).toBe('');
    });

    it('forwards meaningful labels and icon families reactively', async () => {
        const wrapper = render({
            name: 'github',
            family: 'brands',
            label: 'GitHub',
        });
        await flushPromises();
        expect(wrapper.element.label).toBe('GitHub');
        expect(wrapper.element.family).toBe('brands');
        expect(wrapper.attributes('aria-hidden')).toBeUndefined();
        await wrapper.setProps({
            name: 'check',
            family: 'classic',
            variant: 'regular',
            label: '',
        });
        await flushPromises();
        expect(wrapper.element).toMatchObject({
            name: 'check',
            family: 'classic',
            variant: 'regular',
        });
        expect(wrapper.attributes('aria-hidden')).toBe('true');
    });

    it('lets the installed WA default library resolve the public kit identifier without a custom resolver', () => {
        setKitCode('');
        document.documentElement.setAttribute('data-fa-kit-code', 'public-kit-example');
        const url = getIconLibrary('default').resolver('book-open', 'classic', 'solid');
        expect(url).toMatch(
            /^https:\/\/ka-p\.fontawesome\.com\/releases\/v[\d.]+\/svgs\/solid\/book-open\.svg\?token=public-kit-example$/,
        );
    });
});
