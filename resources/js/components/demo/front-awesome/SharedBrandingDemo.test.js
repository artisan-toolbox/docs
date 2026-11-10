import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import Button from '@artisan-toolbox/front-awesome/components/Button.vue';
import SharedBrandingDemo from './SharedBrandingDemo.vue';

enableAutoUnmount(afterEach);

describe('shared branding preview', () => {
    it('renders the public package button beside the Tailwind brand sample', () => {
        const wrapper = mount(SharedBrandingDemo);
        expect(wrapper.get('[role="group"]').attributes('aria-label')).toBe(
            'Shared branding preview',
        );
        expect(wrapper.get('.bg-brand-700').text()).toBe('Tailwind');
        expect(wrapper.getComponent(Button).text()).toBe('Web Awesome');
        expect(wrapper.get('wa-button').attributes('variant')).toBe('brand');
        expect(wrapper.find('[class*="resize-"]').exists()).toBe(false);
    });
});
