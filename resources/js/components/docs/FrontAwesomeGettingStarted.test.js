import { sourceNavigation } from './sourceNavigationFixture';
import { installationCommands } from './installationFixture';
import { parse, compileScript } from '@vue/compiler-sfc';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import Installation from '../../pages/docs/front-awesome/Installation.vue';

const navigation = sourceNavigation;

function render() {
    const commands = installationCommands('front-awesome');
    const installedVersion = commands.composer.code.split(':').at(-1);

    return mount(Installation, {
        props: {
            navigation: navigation(),
            page: {
                title: 'Install Front Awesome',
                description: 'Install and verify the published preview.',
                package: {
                    installationCommands: commands,
                    title: 'Front Awesome',
                    composerName: 'artisan-toolbox/front-awesome',
                    documentedVersion: installedVersion,
                    stability: 'Work in progress',
                    installedVersion,
                    installationSource: 'distribution',
                },
            },
        },
    });
}

describe('Front Awesome first success', () => {
    it('teaches the ordered Composer, frontend, Core styling, page, route, and build setup', () => {
        const wrapper = render();
        const examples = wrapper.findAll('pre code').map((code) => code.text());

        expect(examples).toHaveLength(9);
        expect(examples[0]).toBe(
            `composer require artisan-toolbox/front-awesome:${wrapper.props('page').package.installedVersion}`,
        );
        expect(examples[1]).toContain(
            'npm install --install-links ./vendor/artisan-toolbox/front-awesome',
        );
        expect(examples[1]).toContain('./vendor/artisan-toolbox/mosaicast');
        expect(examples[2]).toContain('@artisan-toolbox/front-awesome/vite');
        expect(examples[2]).toContain('frontAwesome({ webAwesome: "core" })');
        expect(examples[3]).toContain(
            '@import "tailwindcss";\n@import "@artisan-toolbox/front-awesome/styles.css";',
        );
        expect(examples[4]).toContain('@artisan-toolbox/front-awesome/web-awesome.css');
        expect(examples[5]).toContain('resolvePageComponent');
        expect(examples[6]).toContain('<Button variant="brand">Hello from Front Awesome</Button>');
        expect(examples[7]).toContain("Route::get('/front-awesome-welcome'");
        expect(examples[8]).toBe('npm run build');
        expect(wrapper.text()).toContain('Front Awesome is a published preview.');
        expect(wrapper.text()).toContain('Its API can change before the first stable release.');
        expect(wrapper.text()).toContain(
            'After Composer installs a new package version, rerun the frontend installation command above and commit the updated package-lock.json.',
        );
        expect(wrapper.text()).toContain(
            'For source edits that keep the same package version, run npm ci to refresh node_modules.',
        );
        expect(wrapper.text()).toContain('optional Composer path repository');
        expect(wrapper.text()).toContain('It needs no Pro package or credentials.');
        expect(wrapper.text()).toContain(
            'preserve its existing setup, withApp(...) wrapper, plugins, and other options',
        );
        expect(wrapper.text()).toContain(
            'You see a styled button labeled Hello from Front Awesome.',
        );
        wrapper.unmount();
    });

    it('provides a valid JavaScript Vue page with matching resolver and route names', async () => {
        const wrapper = render();
        const examples = wrapper.findAll('pre code').map((code) => code.text());
        const { descriptor, errors } = parse(examples[6]);

        expect(errors).toEqual([]);
        expect(descriptor.scriptSetup.lang).toBeUndefined();
        expect(() => compileScript(descriptor, { id: 'first-button' })).not.toThrow();
        expect(descriptor.scriptSetup.content).toContain(
            'import Button from "@artisan-toolbox/front-awesome/components/Button.vue"',
        );
        expect(examples[5]).toContain('`./pages/${name}.vue`');
        expect(examples[5]).toContain('import.meta.glob("./pages/**/*.vue")');
        expect(examples[7]).toContain("Inertia::render('FrontAwesomeWelcome')");
        expect(wrapper.text()).toContain('resources/js/pages/FrontAwesomeWelcome.vue');
        expect(wrapper.text()).toContain(
            'Set resolve: resolvePage in the existing createInertiaApp options',
        );
        expect(wrapper.get('a[href="/docs/front-awesome/button"]').text()).toBe('Button guide');

        await wrapper.setProps({ navigation: navigation('/reference') });

        expect(wrapper.get('a[href="/reference/front-awesome/button"]').text()).toBe(
            'Button guide',
        );
        wrapper.unmount();
    });
});
