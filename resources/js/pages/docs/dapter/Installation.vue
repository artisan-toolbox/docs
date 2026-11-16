<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import Requirements from '@/components/docs/Requirements.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import InstallCommand from '@/components/docs/InstallCommand.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const backend = `use ArtisanToolbox\\Dapter\\Dapter;

dump(Dapter::VERSION); // "1.0.0-alpha.1"`;
const frontend = `import { version } from '@artisan-toolbox/dapter';

document.querySelector<HTMLElement>('#app')?.setAttribute('data-dapter-version', version);`;
const viteConfiguration = `import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    optimizeDeps: {
        exclude: ['@artisan-toolbox/dapter'],
    },
});`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <Requirements :items="page.requirements" />
            <ProseSection id="starting-environment" title="Prepare the local checkout">
                <p>
                    Use an existing Laravel application with Inertia and a TypeScript-capable Vite
                    build. Place Dapter on its <code>1.x</code> branch in a sibling directory named
                    <code>dapter</code>. This procedure installs unpublished source for local
                    development. Collection and ordinary SQLite offset listing are implemented in
                    this checkout. Other database drivers and query operations remain planned.
                </p>
            </ProseSection>
            <ProseSection id="backend" title="Install the backend first">
                <p>Run these commands from the consuming Laravel application root:</p>
                <InstallCommand
                    :package="page.package"
                    command="local-preview"
                    label="Connect the local Composer package" />
                <p>Laravel discovers the provider automatically. Check the installed identity:</p>
                <CodeExample language="php" label="Check the backend identity" :code="backend" />
                <p>The dump displays <code>1.0.0-alpha.1</code>.</p>
            </ProseSection>
            <ProseSection id="frontend" title="Connect the Composer-delivered frontend">
                <p>After Composer completes, run these commands from the same application root:</p>
                <InstallCommand
                    :package="page.package"
                    command="frontend"
                    label="Install the frontend from vendor" />
                <p>
                    Recording the vendor path first keeps the dependency attached to Composer's
                    installed directory. A direct npm directory argument can otherwise save the
                    sibling checkout path when Composer uses a local symlink.
                </p>
            </ProseSection>
            <ProseSection id="vite-config" title="Configure the required Vue source integration">
                <p>
                    In your application's Vite configuration, include
                    <code>@vitejs/plugin-vue</code> and exclude
                    <code>@artisan-toolbox/dapter</code> from dependency prebundling. Keep your
                    existing Laravel and Inertia plugins. Merge these required Vue settings into
                    that configuration:
                </p>
                <CodeExample
                    language="js"
                    label="Required Vite source configuration"
                    :code="viteConfiguration" />
                <p>
                    Dapter's public entry ships TypeScript and a Vue component. Dependency
                    prebundling can give the composable and component separate copies of their
                    private owner registry. The exclusion keeps both public APIs in the same source
                    module graph during development.
                </p>
                <p>
                    Use <code>resolveJsonModule: true</code> and Vue-aware TypeScript checking. The
                    frontend peers are Vue 3.5.40 or later within 3.x, Inertia Vue and Core 3.0.3 or
                    later within 3.x, and Ziggy 2.6.5 or later within 2.x. Inertia 3.0.3 supplies
                    the HTTP exception callback used to classify failed reads. After refreshing
                    copied frontend dependency types, restart the Vite development process before
                    checking the updated APIs.
                </p>
            </ProseSection>
            <ProseSection id="frontend-check" title="Verify the frontend identity">
                <p>
                    Add this example to the application entry that mounts its existing
                    <code>#app</code> element, then run the application's Vite build:
                </p>
                <CodeExample language="ts" label="Check the frontend identity" :code="frontend" />
                <p>
                    Inspect the mounted element. Its <code>data-dapter-version</code> attribute is
                    <code>1.0.0-alpha.1</code>.
                </p>
            </ProseSection>
            <ProseSection id="next-steps" title="Read your first source">
                <p>
                    These identity examples need no published Dapter configuration, authentication,
                    sessions, workers, or broadcaster. To use the listing API, keep the web session
                    and CSRF middleware enabled, expose
                    <code>dapter.data</code>
                    through Ziggy, and continue with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/sources').href"
                        >Declare a data source</DocsLink
                    >.
                </p>
                <p>
                    Boost is optional development tooling. See
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/development').href"
                        >Develop Dapter</DocsLink
                    >
                    for contributor checks.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
