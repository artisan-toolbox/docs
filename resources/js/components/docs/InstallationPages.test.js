import { installationCommands } from './installationFixture';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import Maintainer from '../../pages/docs/maintainer/Installation.vue';
import Core from '../../pages/docs/core/Installation.vue';
import DumpToConsole from '../../pages/docs/dump-to-console/Installation.vue';
import Mosaicast from '../../pages/docs/mosaicast/Installation.vue';
import QzTray from '../../pages/docs/qztray/Installation.vue';

const slugs = [
    'maintainer/configuration/publishing',
    'maintainer/versioning/project-integration',
    'maintainer/ci',
    'maintainer/commands',
    'core',
    'core/conditional-arrays',
    'dump-to-console/usage',
    'mosaicast/vue-plugin',
    'mosaicast/installation',
    'mosaicast/inertia-delivery',
    'mosaicast/session-channels',
    'qztray',
    'qztray/compatibility',
    'qztray/security',
    'qztray/connection',
    'qztray/printing',
];
const navigation = (prefix = '/docs') =>
    slugs.map((slug) => ({ slug, href: `${prefix}/${slug}`, children: [] }));
const guides = [
    [
        Maintainer,
        'Install Maintainer',
        installationCommands('maintainer').composer.code,
        'config:publish',
    ],
    [Core, 'Install Core', installationCommands('core').composer.code, "['name' => 'Ada']"],
    [
        DumpToConsole,
        'Install Dump to Console',
        installationCommands('dump-to-console').composer.code,
        'Response unchanged',
    ],
    [Mosaicast, 'Install Mosaicast', installationCommands('mosaicast').composer.code, 'inertia'],
    [QzTray, 'Install QZ Tray Connector', installationCommands('qztray').composer.code, 'Hello'],
];

function render(component, title) {
    return mount(component, {
        props: {
            navigation: navigation(),
            page: {
                title,
                description: 'Install and verify the package.',
                requirements: ['PHP 8.5', 'Composer'],
                package: {
                    installationCommands: installationCommands(
                        {
                            'Install Maintainer': 'maintainer',
                            'Install Core': 'core',
                            'Install Dump to Console': 'dump-to-console',
                            'Install Mosaicast': 'mosaicast',
                            'Install QZ Tray Connector': 'qztray',
                        }[title],
                    ),
                    title: title.replace('Install ', ''),
                    composerName: 'artisan-toolbox/example',
                    documentedVersion: '1.x',
                    stability: 'Stable',
                },
            },
        },
    });
}

describe('Package installation journeys', () => {
    it.each(guides)(
        'renders setup with prerequisites, a result, and reactive next steps',
        async (component, title, install, result) => {
            const wrapper = render(component, title);

            expect(wrapper.get('h1').text()).toBe(title);
            expect(wrapper.get('#requirements').element.parentElement.textContent).toContain(
                'PHP 8.5',
            );
            const content = wrapper.get('[data-document-content]').text();
            expect(content.indexOf('Requirements')).toBeLessThan(content.indexOf(install));
            expect(content).toContain(result);
            expect(
                wrapper.get('#next-steps').element.parentElement.querySelectorAll('a').length,
            ).toBeGreaterThan(0);
            const links = wrapper.findAll('a').map((link) => link.attributes('href'));
            expect(links.every((href) => href.startsWith('/docs/'))).toBe(true);

            await wrapper.setProps({ navigation: navigation('/reference') });

            expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual(
                links.map((href) => href.replace('/docs/', '/reference/')),
            );
            wrapper.unmount();
        },
    );

    it('teaches Inertia delivery before optional broadcast setup', () => {
        const wrapper = render(Mosaicast, 'Install Mosaicast');
        const examples = wrapper.findAll('pre code').map((code) => code.text());

        expect(examples[0]).toContain('composer require');
        expect(examples[1]).toContain('./vendor/artisan-toolbox/mosaicast');
        expect(examples[2]).toContain('withApp(app, { ssr })');
        expect(examples[2]).toContain('app.use(createMosaicast())');
        expect(examples[3]).toContain("Mosaicast::dispatch('orders.updated', ['orderId' => 42])");
        expect(examples[3]).toContain("Inertia::render('MosaicastExample')");
        expect(examples[4]).toContain('/mosaicast-example?send=1');
        expect(wrapper.text()).toContain(
            'Reverb, Echo, queues, and a broadcast server are optional',
        );
        expect(wrapper.text()).toContain('mosaicast.events');
        wrapper.unmount();
    });

    it('starts QZ with a local preview and explicit print actions', () => {
        const wrapper = render(QzTray, 'Install QZ Tray Connector');
        const examples = wrapper.findAll('pre code').map((code) => code.text());

        expect(examples[1]).toContain('import { renderZpl }');
        expect(examples[1]).toContain('@click="previewLabel"');
        expect(examples[1]).toContain(':src="previewUrl"');
        expect(examples[2]).toContain('qztray.getPrinters()');
        expect(examples[2]).toContain('qztray.printZpl(selectedPrinter.value');
        expect(examples[2]).toContain('@click="printLabel"');
        expect(wrapper.text()).toContain('Keep the private key on the server');
        expect(wrapper.text()).toContain('not physical print completion');
        wrapper.unmount();
    });
});
