import { settleDetachedHostUpdates } from '@/testSetup';
import { mount } from '@vue/test-utils';
import { expect, it } from 'vite-plus/test';
import OtpInputDemo from './OtpInputDemo.vue';

it('submits a leading-zero code and restores the initial state on reset', async () => {
    const wrapper = mount(OtpInputDemo);
    await settleDetachedHostUpdates(wrapper);
    const input = wrapper.get('wa-otp-input');
    Object.defineProperty(input.element, 'value', {
        configurable: true,
        writable: true,
        value: '001234',
    });
    await input.trigger('change');
    expect(wrapper.text()).toContain('Current value: 001234');
    await wrapper.get('form').trigger('submit');
    expect(wrapper.text()).toContain('Submitted code: 001234. No request was sent.');
    await wrapper.get('form').trigger('reset');
    expect(wrapper.get('output').text()).toBe('Current value:');
    expect(wrapper.text()).not.toContain('Submitted code:');
    wrapper.unmount();
});
