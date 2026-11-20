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
const routeCheck = `import { route } from 'ziggy-js';

console.log(route().has('dapter.data'));`;
const bladeRoutes = `@routes
@vite('resources/js/app.ts')`;
const generatedRoutes = `import { Ziggy } from './ziggy.js';

globalThis.Ziggy = Ziggy;`;
const backend = `use ArtisanToolbox\\Dapter\\Dapter;

dump(Dapter::VERSION); // "1.0.0-beta.4"`;
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
            <ProseSection id="starting-environment" title="Prepare your Laravel application">
                <p>
                    Start in the root of a Laravel application that serves a Vue page through
                    Inertia and builds it with Vite. Keep Laravel's web session and CSRF middleware
                    enabled.
                </p>
            </ProseSection>
            <ProseSection id="backend" title="Install the backend first">
                <p>Install Dapter’s published beta from the application root.</p>
                <InstallCommand :package="page.package" label="Install Dapter with Composer" />
                <p>
                    The Vue adapter uses Ziggy to find Laravel's read route. If your application
                    does not already include a compatible <code>tightenco/ziggy</code> 2.x release,
                    install it now.
                </p>
                <InstallCommand
                    :package="page.package"
                    command="ziggy"
                    label="Install Ziggy for Laravel" />
                <p>
                    Laravel discovers the provider automatically. Composer also installs the
                    normalizer polyfill used by default literal search. PHP intl is optional for
                    literal folding and required only for explicit ICU locale ordering. Check the
                    installed identity:
                </p>
                <CodeExample language="php" label="Check the backend identity" :code="backend" />
                <p>The dump displays <code>1.0.0-beta.4</code>.</p>
            </ProseSection>
            <ProseSection id="frontend" title="Connect the Composer-delivered frontend">
                <p>After Composer completes, run these commands from the same application root:</p>
                <InstallCommand
                    :package="page.package"
                    command="frontend"
                    label="Install the frontend from vendor" />
                <p>
                    The first command records the Composer-installed directory in
                    <code>package.json</code>. The second installs its JavaScript package and peer
                    dependencies.
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
                    the HTTP exception callback used to classify failed reads. After refreshing the
                    copied Composer-delivered frontend package, restart the Vite development process
                    before checking updated APIs or public contract resources. An active module
                    cache can keep older package bytes after the files have changed.
                </p>
            </ProseSection>
            <ProseSection id="read-route" title="Connect the read route">
                <p>
                    Keep Laravel's web middleware group, session, and CSRF protection active. The
                    Vue adapter posts to <code>dapter.data</code> through Ziggy. If you filter Ziggy
                    routes with <code>only</code> or groups, include that name in the routes exposed
                    to the page. Keep it out of any <code>except</code> list.
                </p>
                <p>
                    In the Inertia root view, usually <code>resources/views/app.blade.php</code>,
                    add <code>@routes</code> before the existing Vite entry. Keep your own entry
                    path. This makes the route map available to Dapter's imported Ziggy helper.
                </p>
                <CodeExample
                    language="blade"
                    label="Expose Laravel routes before Vite"
                    :code="bladeRoutes" />
                <p>
                    If you already generate <code>resources/js/ziggy.js</code> with
                    <code>php artisan ziggy:generate</code>, you can use that file instead of the
                    Blade directive. Regenerate it after a route change and set the global map in
                    your Vue entry before mounting the application.
                </p>
                <CodeExample
                    language="js"
                    label="Use an existing generated route map"
                    :code="generatedRoutes" />
                <CodeExample language="js" label="Check the named read route" :code="routeCheck" />
                <p>
                    Run the check after configuring Ziggy. It prints <code>true</code> when Dapter
                    can resolve the read route. Actions use server-generated URLs from authorized
                    metadata. The <code>dapter.action</code> name does not need to be exposed
                    through Ziggy.
                </p>
            </ProseSection>
            <ProseSection id="frontend-check" title="Check the installed frontend version">
                <p>
                    Add this example to the application entry that mounts its existing
                    <code>#app</code> element, then run the application's Vite build:
                </p>
                <CodeExample language="ts" label="Check the frontend identity" :code="frontend" />
                <p>
                    Inspect the mounted element. Its <code>data-dapter-version</code> attribute is
                    <code>1.0.0-beta.4</code>.
                </p>
            </ProseSection>
            <ProseSection id="next-steps" title="Read your first source">
                <p>
                    Open
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter').href + '#first-example'"
                        >Read the first page</DocsLink
                    >
                    to create a public Collection and display the first ten notebooks. This listing
                    needs no account, broadcaster, or queue worker.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
