import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import Index from '../../pages/docs/permit/Index.vue';
import Installation from '../../pages/docs/permit/Installation.vue';
import Declarations from '../../pages/docs/permit/Declarations.vue';
import Development from '../../pages/docs/permit/Development.vue';
import Management from '../../pages/docs/permit/Management.vue';
import Operations from '../../pages/docs/permit/Operations.vue';
import CodeExample from './CodeExample.vue';
import { sourceNavigation } from './sourceNavigationFixture';

const page = {
    package: {
        installationCommands: {
            composer: {
                code: 'composer require artisan-toolbox/permit:1.0.0-beta.2',
            },
            frontend: {
                code: "npm pkg set 'dependencies.@artisan-toolbox/permit=file:vendor/artisan-toolbox/permit'\nnpm install --install-links",
            },
        },
    },
    requirements: ['PHP 8.5', 'Laravel 13', 'Inertia Laravel 3.x'],
};

function render(component, props = {}) {
    return mount(component, {
        props: { page, navigation: sourceNavigation('/docs', 'permit'), ...props },
        global: {
            stubs: { PackageGuideHeader: true, CodeExample: true, PermissionEditorDemo: true },
        },
    });
}

describe('Permit beta learning journey', () => {
    it('links the published beta and shows a reproducible Gate decision', () => {
        const wrapper = render(Index);

        expect(wrapper.text()).toContain('Permit is available as a beta');
        expect(
            wrapper
                .find('a[href="https://packagist.org/packages/artisan-toolbox/permit"]')
                .exists(),
        ).toBe(true);
        expect(wrapper.find('a[href="/docs/permit/installation"]').exists()).toBe(true);
        expect(wrapper.find('a[href="/docs/permit/declarations"]').exists()).toBe(true);
        expect(wrapper.find('a[href="/docs/permit/management#try-the-editor"]').exists()).toBe(
            true,
        );
        expect(wrapper.text()).toContain('The first check prints false');
        const samples = wrapper.findAllComponents(CodeExample).map((item) => item.props('code'));
        expect(samples).toContain('composer require artisan-toolbox/permit:1.0.0-beta.2');
        expect(samples).toContain(
            'php artisan vendor:publish --tag=permit-config\nphp artisan vendor:publish --tag=permit-migrations\nphp artisan migrate\nphp artisan make:permission-group Users',
        );
        expect(samples.find((sample) => sample.includes('Gate::forUser'))).toContain(
            "Permit::add($reader, 'users::read');",
        );
    });

    it('starts with backend installation and checks a Gate before optional frontend installation', () => {
        const wrapper = render(Installation);
        const headings = wrapper.findAll('h2').map((item) => item.text());

        expect(headings.indexOf('Install the backend beta')).toBeLessThan(
            headings.indexOf('Prepare a permission group'),
        );
        expect(headings.indexOf('Prepare a permission group')).toBeLessThan(
            headings.indexOf('Check your first Gate'),
        );
        expect(headings.indexOf('Check your first Gate')).toBeLessThan(
            headings.indexOf('Install the optional Vue package'),
        );
        expect(wrapper.text()).toContain('The migration creates user_permissions by default');
        expect(wrapper.find('a[href="/docs/permit/vue"]').exists()).toBe(true);
        expect(
            wrapper.find('a[href="/docs/permit/operations#assignment-migration"]').exists(),
        ).toBe(true);
    });

    it('links the shared demo, editor integration, and command reference', () => {
        const wrapper = render(Management, {
            permissionEditorDemoExport: '/demo/front-awesome/permission-editor/export',
        });

        expect(
            wrapper
                .get('section[aria-labelledby="try-the-editor"]')
                .find('permission-editor-demo-stub')
                .exists(),
        ).toBe(true);
        expect(
            wrapper
                .get('section[aria-labelledby="enable-the-editor"]')
                .find('a[href="/docs/front-awesome/user-permission-editor"]')
                .exists(),
        ).toBe(true);
        expect(wrapper.find('a[href="/docs/permit/operations#artisan-commands"]').exists()).toBe(
            true,
        );
    });

    it('connects the role declaration to its protected editor walkthrough', () => {
        const declarations = render(Declarations).get('section[aria-labelledby="require-a-role"]');
        const management = render(Management, {
            permissionEditorDemoExport: '/demo/front-awesome/permission-editor/export',
        }).get('section[aria-labelledby="restrict-assignment-edits"]');

        expect(declarations.text()).toContain('1.0.0-beta.4 or later');
        expect(management.text()).toContain('1.0.0-beta.4 or later');
        const invoiceGroup = declarations.getComponent(CodeExample).props('code');
        expect(invoiceGroup).toContain("#[WithRole('admin,developer', RoleMatch::Or)]");
        expect(invoiceGroup).toContain("#[ManageableByRoleUser('admin, developer')]");
        expect(declarations.get('a').attributes('href')).toBe(
            '/docs/permit/management#restrict-assignment-edits',
        );
        expect(management.get('a').attributes('href')).toBe(
            '/docs/permit/declarations#require-a-role',
        );
        expect(management.getComponent(CodeExample).props('code')).toContain(
            "#[ManageableByRoleUser('admin')]",
        );
    });

    it('documents a complete migration with reverse operations and a safe preview', () => {
        const wrapper = render(Operations);
        const samples = wrapper.findAllComponents(CodeExample).map((item) => item.props('code'));
        const migration = samples.find((sample) => sample.includes('extends Migration'));

        expect(migration).toContain("renamePermissionGroup('reports', 'analytics')");
        expect(migration).toContain("renamePermissionGroup('analytics', 'reports')");
        expect(migration).toContain("renamePermission('analytics', 'download', 'export')");
        expect(migration).toContain("renameRole('administrator', 'admin')");
        expect(migration).toContain('->transaction(');
        expect(samples.some((sample) => sample.includes('php artisan migrate --pretend'))).toBe(
            true,
        );
    });

    it('keeps contributor commands in the package checkout', () => {
        const wrapper = render(Development);
        const commands = wrapper.findAllComponents(CodeExample).map((item) => item.props('code'));

        expect(wrapper.text()).toContain('Run these commands from the package root');
        expect(commands).toContain(
            'composer install\nnpm ci\ncomposer test\nnpm run release:build\ngit diff --exit-code -- dist',
        );
        expect(commands).toContain('npm run standards:check');
        expect(commands).toContain('php vendor/bin/maintainer readme:update --no-interaction');
    });
});
