<script setup>
import InstallCommand from '@/components/docs/InstallCommand.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const example3 = `import { frontAwesome } from "@artisan-toolbox/front-awesome/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // Keep your existing Laravel, Inertia, Tailwind, and Vue plugins here.
    frontAwesome({ webAwesome: "core" }),
  ],
});`;
const example4 = `@import "tailwindcss";
@import "@artisan-toolbox/front-awesome/styles.css";`;
const example5 = `import "../css/app.css";
import "@artisan-toolbox/front-awesome/web-awesome.css";`;
const example6 = `import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

const resolvePage = (name) =>
  resolvePageComponent(
    \`./pages/\${name}.vue\`,
    import.meta.glob("./pages/**/*.vue"),
  );`;
const example7 = `<script setup>
import Button from "@artisan-toolbox/front-awesome/components/Button.vue";
\x3C/script>

<template>
  <main class="p-8">
    <Button variant="brand">Hello from Front Awesome</Button>
  </main>
</template>`;
const example8 = `use Illuminate\\Support\\Facades\\Route;
use Inertia\\Inertia;

Route::get('/front-awesome-welcome', fn () => Inertia::render('FrontAwesomeWelcome'));`;
const example9 = `npm run build`;
</script>

<template>
    <ProseSection>
        <p>
            Start in an existing Laravel application with Inertia, Vue, and Vite. Check the
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome').href + '#requirements'"
                >requirements</DocsLink
            >
            before installing the published preview.
        </p>
        <h2
            id="install-the-composer-package"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Install the Composer package
        </h2>
        <p>
            Install the published preview from the application root. The
            <DocsLink href="https://github.com/artisan-toolbox/front-awesome"
                >Front Awesome repository</DocsLink
            >
            contains the package source.
        </p>
        <InstallCommand
            label="Install the Composer package example 1"
            language="sh"
            :package="page.package"
            command="composer" />
        <p>
            Composer installs Front Awesome and Mosaicast under
            <code>vendor/artisan-toolbox</code>. Laravel discovers the Front Awesome service
            provider automatically.
        </p>
        <h2
            id="install-the-frontend-packages"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Install the frontend packages
        </h2>
        <p>
            From the application root, run the npm command after Composer has installed both
            packages.
        </p>
        <InstallCommand
            label="Install the frontend packages example 2"
            language="sh"
            :package="page.package"
            command="frontend" />
        <p>
            The command records both packages as <code>file:</code> dependencies in the
            application's <code>package.json</code>. Keep both entries. Front Awesome declares the
            Mosaicast JavaScript client as a peer dependency, even though Composer installs
            Mosaicast for PHP.
        </p>
        <p>
            Set <code>install-links=true</code> in the application's <code>.npmrc</code> so
            <code>npm ci</code> uses the same install mode. Run Composer before npm in development,
            CI, and deployments. The application's Vite build compiles the installed Front Awesome
            sources.
        </p>
        <h2
            id="refresh-a-local-package-copy"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Refresh a local package copy
        </h2>
        <p>
            With <code>install-links=true</code>, npm packs and copies each
            <code>file:</code> dependency into <code>node_modules</code>. After Composer installs a
            new package version, rerun the frontend installation command above and commit the
            updated <code>package-lock.json</code>. For source edits that keep the same package
            version, run <code>npm ci</code> to refresh <code>node_modules</code>. Then restart the
            running Vite server. If you use an optional Composer path repository for package
            development, repeat this refresh after editing the checkout.
        </p>
        <p>
            Reload the page without the browser cache after replacing the local copy. Vite serves
            dependency URLs with long-lived cache headers. If the package version stays the same, an
            open tab can load an older plugin alongside a newer Vue component.
        </p>
        <h2
            id="set-up-the-application"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Set up the application
        </h2>
        <p>
            Follow
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/web-awesome').href"
                >Web Awesome setup</DocsLink
            >
            to configure Vite and choose how to load styles. Choose the
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/shared-theme').href"
                >shared Tailwind theme</DocsLink
            >
            to use one branding file for Tailwind and Web Awesome. PrimeVue remains an
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/primevue').href"
                >optional styled integration</DocsLink
            >.
        </p>
        <p>
            For toast notifications,
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/vue-plugin').href"
                >register the Vue plugin</DocsLink
            >
            before sending your first toast.
        </p>
        <h2
            id="configure-vite-and-styles"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Configure Vite and styles
        </h2>
        <p>
            This first example uses the bundled Web Awesome Core edition. It needs no Pro package or
            credentials. Front Awesome is a published preview. Its API can change before the first
            stable release.
        </p>
        <p>
            In the application's existing <code>vite.config.js</code> or
            <code>vite.config.ts</code>, add the public plugin import and the
            <code>frontAwesome</code> entry shown below. Keep all existing configuration and
            Laravel, Inertia, Tailwind, and Vue plugin entries. Keep one Vue plugin instance.
        </p>
        <CodeExample label="Configure Vite and styles example 3" language="js" :code="example3" />
        <p>
            In <code>resources/css/app.css</code>, keep Tailwind and add the package stylesheet
            after it. This public entry lets Tailwind scan Front Awesome's Vue sources.
        </p>
        <CodeExample label="Configure Vite and styles example 4" language="css" :code="example4" />
        <p>
            In the existing <code>resources/js/app.js</code> or
            <code>resources/js/app.ts</code> entry, keep the application CSS import and add the
            standard Web Awesome stylesheet. Import each stylesheet once. This example uses the
            default Web Awesome theme. The shared Tailwind theme linked above is an optional next
            step.
        </p>
        <CodeExample label="Configure Vite and styles example 5" language="js" :code="example5" />
        <h2
            id="render-your-first-button"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Render your first button
        </h2>
        <p>
            The example uses lowercase <code>resources/js/pages</code> and an Inertia page name of
            <code>FrontAwesomeWelcome</code>. In the existing JavaScript entry, add the resolver
            below. Set <code>resolve: resolvePage</code> in the existing
            <code>createInertiaApp</code> options, and preserve its existing <code>setup</code>,
            <code>withApp(...)</code> wrapper, plugins, and other options. If the application uses
            another pages directory, change both paths below and save the page in that directory.
        </p>
        <CodeExample label="Render your first button example 6" language="js" :code="example6" />
        <p>
            Create <code>resources/js/pages/FrontAwesomeWelcome.vue</code>. The public Button export
            registers its Web Awesome custom element when the page mounts. This button needs no
            Front Awesome Vue plugin or toast configuration.
        </p>
        <CodeExample label="Render your first button example 7" language="vue" :code="example7" />
        <p>
            Add this public route to <code>routes/web.php</code>, outside authentication middleware.
            Reuse existing <code>Route</code> and <code>Inertia</code> imports instead of adding
            duplicate imports. The page name matches the resolver and file above.
        </p>
        <CodeExample label="Render your first button example 8" language="php" :code="example8" />
        <h2
            id="build-and-check-the-result"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Build and check the result
        </h2>
        <p>From the application root, compile the frontend after the setup above.</p>
        <CodeExample label="Build and check the result example 9" language="sh" :code="example9" />
        <p>
            Open <code>/front-awesome-welcome</code> on your running Laravel application's local
            URL. You see a styled button labeled <strong>Hello from Front Awesome</strong>. If a
            Vite development server was already running, restart it after changing its
            configuration.
        </p>
        <p>
            Continue with the
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/button').href"
                >Button guide</DocsLink
            >
            to add links, loading states, and button groups.
        </p>
        <p>
            Continue with
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/input').href"
                >Bind input values and form errors</DocsLink
            >
            when you need v-model or an Inertia form field in a compatible local preview.
        </p>
        <p>
            Browse the
            <DocsLink
                :href="findNavigationItem(navigation, 'front-awesome/web-awesome/components').href"
                >Vue components catalog</DocsLink
            >
            to find available wrappers, basic examples, and components marked In future.
        </p>
    </ProseSection>
</template>
