import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vite-plus/test';
import InstallCommand from './InstallCommand.vue';

const metadata = (code) => ({
    installationCommands: { composer: { code } },
});

describe('Installed dependency commands', () => {
    it('renders and copies the exact current metadata and reacts to dependency refreshes', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal('navigator', { clipboard: { writeText } });
        const first =
            'composer require --dev artisan-toolbox/maintainer:1.x-dev';
        const wrapper = mount(InstallCommand, {
            props: { package: metadata(first), label: 'Install Maintainer' },
            slots: {
                default:
                    '<p>Run Composer before the frontend package manager.</p>',
            },
        });
        expect(wrapper.get('pre code').text()).toBe(first);
        await wrapper.get('button').trigger('click');
        expect(writeText).toHaveBeenLastCalledWith(first);
        const next =
            'composer require --dev artisan-toolbox/maintainer:v1.11.0';
        await wrapper.setProps({
            package: metadata(next),
        });
        expect(wrapper.get('pre code').text()).toBe(next);
        expect(wrapper.text()).toContain(
            'Run Composer before the frontend package manager.',
        );
        await wrapper.get('button').trigger('click');
        expect(writeText).toHaveBeenLastCalledWith(next);
        wrapper.unmount();
        vi.unstubAllGlobals();
    });

    it('explains missing locked dependencies without displaying a fabricated command', () => {
        const wrapper = mount(InstallCommand, {
            props: { package: metadata(null), label: 'Hidden install label' },
            slots: { default: '<p>Hidden installation explanation.</p>' },
        });
        expect(wrapper.find('pre').exists()).toBe(false);
        expect(wrapper.text()).not.toContain('Hidden install label');
        expect(wrapper.text()).not.toContain(
            'Hidden installation explanation.',
        );
        expect(wrapper.get('[role="status"]').text()).toContain(
            'no locked version',
        );
    });
});
