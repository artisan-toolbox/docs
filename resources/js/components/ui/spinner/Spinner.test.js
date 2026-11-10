import { flushPromises, mount } from '@vue/test-utils';
import { afterAll, beforeAll, expect, it } from 'vite-plus/test';
import '@web.awesome.me/webawesome-pro/dist/components/icon/icon.js';
import { getIconLibrary, registerIconLibrary } from '@web.awesome.me/webawesome-pro/dist/components/icon/library.js';
import Spinner from './Spinner.vue';

const defaultLibrary = getIconLibrary('default');
beforeAll(() => registerIconLibrary('default', { resolver: () => '' }));
afterAll(() => registerIconLibrary('default', defaultLibrary));

it('preserves its loading announcement after the native icon initializes', async () => {
    const wrapper = mount(Spinner, { attachTo: document.body, global: { stubs: { SiteIcon: false } } });
    const icon = wrapper.get('wa-icon');
    await icon.element.updateComplete;
    await flushPromises();
    expect(wrapper.get('[role="status"]').text()).toBe('Loading');
    expect(icon.attributes('aria-hidden')).toBe('true');
    wrapper.unmount();
});
