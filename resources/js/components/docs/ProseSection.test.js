import { mount } from '@vue/test-utils';
import { expect, test } from 'vite-plus/test';
import ProseSection from './ProseSection.vue';

test('gives a titled section an accessible heading and stable anchor', () => {
    const wrapper = mount(ProseSection, {
        props: { id: 'installation', title: 'Installation' },
        slots: { default: '<p>Install the package.</p>' },
    });

    expect(wrapper.element.tagName).toBe('SECTION');
    expect(wrapper.attributes('aria-labelledby')).toBe('installation');
    expect(wrapper.get('h2').text()).toBe('Installation');
    expect(wrapper.get('h2').attributes('id')).toBe('installation');
    expect(wrapper.get('p').text()).toBe('Install the package.');
});

test('renders introductory prose without adding an empty heading or landmark', () => {
    const wrapper = mount(ProseSection, {
        slots: { default: '<p>Introductory documentation.</p>' },
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.find('h2').exists()).toBe(false);
    expect(wrapper.attributes('aria-labelledby')).toBeUndefined();
    expect(wrapper.get('p').text()).toBe('Introductory documentation.');
});
