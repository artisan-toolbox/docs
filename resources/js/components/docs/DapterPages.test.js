import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import Index from '../../pages/docs/dapter/Index.vue';
import Installation from '../../pages/docs/dapter/Installation.vue';
import Development from '../../pages/docs/dapter/Development.vue';
import { sourceNavigation } from './sourceNavigationFixture';
import { installationCommands } from './installationFixture';

function render(component, slug) {
    return mount(component, {
        props: {
            page: {
                slug,
                title: slug === 'dapter' ? 'Dapter' : 'Install the Dapter preview',
                description: 'Unreleased data adapter foundation.',
                requirements: ['PHP ^8.5', 'Laravel 13', 'Inertia 3', 'Node.js >=24.11.0'],
                package: {
                    id: 'dapter',
                    title: 'Dapter',
                    composerName: 'artisan-toolbox/dapter',
                    stability: 'Work in progress',
                    installedVersion: null,
                    installationStatus: 'not-installed',
                    installationCommands: installationCommands('dapter'),
                    artwork: { icon: '/images/packages/dapter/dapter-icon.svg' },
                },
            },
            navigation: sourceNavigation(),
        },
    });
}

describe('Dapter preview learning journey', () => {
    it('states the preview limits and links the overview to installation and development', () => {
        const wrapper = render(Index, 'dapter');
        expect(wrapper.text()).toContain('not implemented yet');
        expect(wrapper.text()).toContain('Not installed');
        expect(wrapper.get('a[href="/docs/dapter/installation"]').text()).toContain('Install');
        expect(wrapper.get('a[href="/docs/dapter/development"]').text()).toContain('Develop');
        expect(wrapper.text()).toContain('Dapter::VERSION');
        wrapper.unmount();
    });

    it('places requirements and Composer before frontend installation with observable results', () => {
        const wrapper = render(Installation, 'dapter/installation');
        const text = wrapper.text();
        expect(text.indexOf('PHP ^8.5')).toBeLessThan(text.indexOf('composer config'));
        expect(text.indexOf('composer require')).toBeLessThan(text.indexOf('npm install'));
        expect(text).toContain('1.x-dev@dev');
        expect(text).toContain('./vendor/artisan-toolbox/dapter');
        expect(text).toContain('data-dapter-version');
        expect(text).toContain('1.0.0-alpha.1');
        wrapper.unmount();
    });

    it('documents the actual checks and separates direct npm minima from transitive dependencies', () => {
        const wrapper = render(Development, 'dapter/development');
        expect(wrapper.text()).toContain('composer quality:check');
        expect(wrapper.text()).toContain('npm run release:build');
        expect(wrapper.text()).toContain('NodeNext');
        expect(wrapper.text()).toContain('does not claim a transitive npm dependency minimum');
        wrapper.unmount();
    });
});
