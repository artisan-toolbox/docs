<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import InstallCommand from '@/components/docs/InstallCommand.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import FirstGate from '@/components/docs/permit/FirstGate.vue';
import IdentityExample from '@/components/docs/permit/IdentityExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import Requirements from '@/components/docs/Requirements.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection>
                <p>
                    Install the Permit beta in an existing Laravel application, then assign and
                    check your first permission.
                </p>
            </ProseSection>
            <Requirements :items="page.requirements">
                <p>
                    Use a Laravel 13 application with Composer, Laravel Tinker, and a development
                    database. Use a session guard backed by an Eloquent user provider. The example
                    below uses Laravel's default user model and user table.
                </p>
            </Requirements>
            <ProseSection id="install-backend" title="Install the backend beta">
                <p>Run this command in the application directory beside <code>artisan</code>.</p>
                <InstallCommand :package="page.package" label="Install Permit with Composer" />
                <p>Composer automatically discovers <code>PermitServiceProvider</code>.</p>
            </ProseSection>
            <FirstGate />
            <p>
                See the
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'permit/operations').href +
                        '#assignment-migration'
                    "
                    >assignment schema and migration guide</DocsLink
                >
                for custom user connections, key renames, and rollback.
            </p>
            <IdentityExample />
            <ProseSection id="optional-frontend" title="Install the optional Vue package">
                <p>
                    Use this step in an Inertia 3 and Vue 3.5 application with Vite. Install the PHP
                    package first. Then run these commands from your Laravel application root to
                    install the compiled JavaScript files from Composer's vendor directory.
                </p>
                <InstallCommand
                    :package="page.package"
                    command="frontend"
                    label="Install Composer-delivered Vue helpers" />
                <p>
                    Follow
                    <DocsLink :href="findNavigationItem(navigation, 'permit/vue').href"
                        >Show authorized actions in Vue</DocsLink
                    >
                    to register the plugin and render the results of your application's Gates.
                </p>
            </ProseSection>
            <ProseSection id="next-steps" title="Next steps">
                <p>
                    Continue with
                    <DocsLink :href="findNavigationItem(navigation, 'permit/declarations').href"
                        >Declare permissions and roles</DocsLink
                    >
                    to add your own permission group.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
