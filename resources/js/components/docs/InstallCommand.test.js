import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import InstallCommand from './InstallCommand.vue';

const metadata = (code) => ({
    installationCommands: { composer: { code } },
});

describe('Installed dependency commands', () => {
    it('renders and delivers exact metadata to the copy control after dependency refreshes', async () => {
        const first = 'composer require --dev artisan-toolbox/maintainer:1.x-dev';
        const wrapper = mount(InstallCommand, {
            props: { package: metadata(first), label: 'Install Maintainer' },
            slots: {
                default: '<p>Run Composer before the frontend package manager.</p>',
            },
        });
        expect(wrapper.get('pre code').text()).toBe(first);
        expect(wrapper.get('wa-copy-button').attributes('value')).toBe(first);
        expect(wrapper.get('wa-button[aria-label="Copy Install Maintainer"]').exists()).toBe(true);
        await wrapper.get('wa-copy-button').trigger('wa-copy');
        expect(wrapper.get('[role="status"]').text()).toBe('Code copied to clipboard.');
        const next = 'composer require --dev artisan-toolbox/maintainer:v1.11.0';
        await wrapper.setProps({
            package: metadata(next),
        });
        expect(wrapper.get('pre code').text()).toBe(next);
        expect(wrapper.get('wa-copy-button').attributes('value')).toBe(next);
        expect(wrapper.text()).toContain('Run Composer before the frontend package manager.');
        await wrapper.get('wa-copy-button').trigger('wa-error');
        expect(wrapper.get('[role="status"]').text()).toBe(
            'Unable to copy. Select the code and copy it manually.',
        );
        await wrapper.get('wa-copy-button').trigger('wa-copy');
        expect(wrapper.get('[role="status"]').text()).toBe('Code copied to clipboard.');
        wrapper.unmount();
    });

    it('explains missing locked dependencies without displaying a fabricated command', () => {
        const wrapper = mount(InstallCommand, {
            props: { package: metadata(null), label: 'Hidden install label' },
            slots: { default: '<p>Hidden installation explanation.</p>' },
        });
        expect(wrapper.find('pre').exists()).toBe(false);
        expect(wrapper.text()).not.toContain('Hidden install label');
        expect(wrapper.text()).not.toContain('Hidden installation explanation.');
        expect(wrapper.get('[role="status"]').text()).toContain('no locked version');
    });
});
