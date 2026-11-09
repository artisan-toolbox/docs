<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `import { createFrontAwesome } from "@artisan-toolbox/front-awesome";

// In the options passed to createInertiaApp:
withApp(app) {
  app.use(createFrontAwesome());
}`;
const example2 = `app.use(createFrontAwesome({ appearance: true }));`;
const example3 = `<template>
  <Appearance v-slot="{ appearance, toggle, system, dark, light }">
    <button type="button" :aria-pressed="appearance === 'system'" @click="system">
      System
    </button>
    <button type="button" :aria-pressed="appearance === 'dark'" @click="dark">
      Dark
    </button>
    <button type="button" :aria-pressed="appearance === 'light'" @click="light">
      Light
    </button>
    <button type="button" @click="toggle">Toggle appearance</button>
  </Appearance>
</template>

<script setup lang="ts">
import { Appearance } from "@artisan-toolbox/front-awesome/components";
\x3C/script>`;
const example4 = `@custom-variant dark (&:where(.dark, .dark *));`;
const example5 = `app.use(
  createFrontAwesome({
    flashToast: { placement: "bottom-end" },
  }),
);`;
const example6 = `import { createFrontAwesome } from "@artisan-toolbox/front-awesome";
import { echo } from "@laravel/echo-vue";

// In the options passed to createInertiaApp:
withApp(app, { ssr }) {
  app.use(
    createFrontAwesome({
      mosaicast: ssr ? undefined : { echo: echo<"reverb">() },
    }),
  );
}`;
</script>

<template>
    <ProseSection>
        <p>
            After
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                >installation</DocsLink
            >
            and
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/web-awesome').href"
                >Web Awesome setup</DocsLink
            >, add <code>createFrontAwesome()</code> to the existing <code>withApp</code> hook in
            your Inertia entry point.
        </p>
        <CodeExample label="Vue plugin example 1" language="ts" :code="example1" />
        <p>
            The plugin provides the Vue toast service and starts the browser listeners for Inertia
            flash and Mosaicast events. It adds one Web Awesome toast stack to
            <code>document.body</code>. The stack stays in place as Inertia changes pages. If
            several Vue apps share a document, the plugin removes the stack and its listeners when
            the last app unmounts. Server rendering has access to the service.
        </p>
        <h2
            id="add-a-theme-selector"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Add an appearance selector
        </h2>
        <p>
            Pass <code>appearance: true</code> to let the plugin manage the page's color mode. Apps
            that already manage color mode can omit this option.
        </p>
        <p>
            This option controls light, dark, and system preferences. It does not install a visual
            theme. Choose
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/web-awesome').href +
                    '#load-application-owned-styles'
                "
                >application-owned Web Awesome styles</DocsLink
            >
            or the
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/shared-theme').href"
                >shared Tailwind theme</DocsLink
            >
            separately.
        </p>
        <CodeExample label="Add an appearance selector example 2" language="ts" :code="example2" />
        <p>
            Import <code>Appearance</code> from
            <code>@artisan-toolbox/front-awesome/components</code> and put your controls in its
            default slot. The component adds no wrapper element.
        </p>
        <CodeExample label="Add an appearance selector example 3" language="vue" :code="example3" />
        <p>
            The current development preview renames <code>Theme.vue</code> to
            <code>Appearance.vue</code>. Replace named <code>Theme</code> imports and component tags
            with <code>Appearance</code>. Replace direct imports ending in
            <code>/components/Theme.vue</code> with <code>/components/Appearance.vue</code>. The old
            component exports are removed. Rename the <code>ThemePreference</code> type to
            <code>AppearancePreference</code>, the plugin option from <code>theme: true</code> to
            <code>appearance: true</code>, and the slot property from <code>theme</code> to
            <code>appearance</code>. These are breaking naming changes in the development preview.
            The preference values, slot actions, storage, and lifecycle behavior remain unchanged.
        </p>
        <p>
            <code>appearance</code> is the selected preference: <code>system</code>,
            <code>dark</code>, or <code>light</code>. Each matching action selects that preference.
            <code>toggle()</code> selects the opposite of the color mode currently in use. For
            example, if <code>system</code> resolves to dark, <code>toggle()</code> selects
            <code>light</code> and stops following system changes. All selectors in the same
            document share the preference.
        </p>
        <p>
            If you wrap the selector in your own component, import the
            <code>AppearancePreference</code> type from <code>@artisan-toolbox/front-awesome</code>.
        </p>
        <p>
            The plugin reads the <code>appearance</code> preference from browser storage and applies
            the color mode before Vue mounts. It follows the system preference if no valid choice is
            saved. If storage is unavailable, the controls still work for the current page. During
            server rendering and hydration, the slot starts at <code>system</code> and reads the
            browser preference after mount. The plugin stops listening for system changes when the
            last app with appearance support unmounts.
        </p>
        <p>
            The manager sets <code>dark</code> and <code>wa-dark</code> on
            <code>&lt;html&gt;</code> in dark mode, or <code>wa-light</code> in light mode. The
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/shared-theme').href +
                    '#load-the-two-style-entries'
                "
                >shared Tailwind entry</DocsLink
            >
            already defines the matching <code>dark:*</code> variant. With a direct Tailwind import,
            add this variant after that import:
        </p>
        <CodeExample label="Add an appearance selector example 4" language="css" :code="example4" />
        <p>
            Inertia resolves the initial page before it installs the plugin. If your app must apply
            the preference before the first paint, use an inline script in the document head that
            reads the same
            <code>appearance</code> key, defaults to <code>system</code>, and applies the same root
            classes.
        </p>
        <h2
            id="set-placement"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Set placement
        </h2>
        <p>
            The default placement is <code>top-end</code>. Set <code>flashToast.placement</code> to
            <code>top-start</code>, <code>top-center</code>, <code>top-end</code>,
            <code>bottom-start</code>, <code>bottom-center</code>, or <code>bottom-end</code>. The
            first app to start the stack sets its placement.
        </p>
        <CodeExample label="Set placement example 5" language="ts" :code="example5" />
        <h2
            id="configure-private-broadcasts"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Configure private broadcasts
        </h2>
        <p>
            If your application registers
            <code>createMosaicast()</code> separately, replace that registration with
            <code>createFrontAwesome()</code> and move its options under <code>mosaicast</code>. The
            plugin accepts the Mosaicast options <code>echo</code>, <code>channelPrefix</code>,
            <code>debug</code>, and <code>logger</code>. The first registration supplies these
            options for the lifetime of the document.
        </p>
        <p>
            To receive private broadcasts, follow the
            <DocsLink :href="findNavigationItem(navigation, 'mosaicast/vue-plugin').href"
                >Mosaicast Vue plugin setup</DocsLink
            >
            for your broadcaster. Pass the configured Echo instance in the browser. The example uses
            Reverb.
        </p>
        <CodeExample
            label="Configure private broadcasts example 6"
            language="ts"
            :code="example6" />
        <p>
            Without Echo, the plugin still receives Inertia flash and Mosaicast events delivered in
            Inertia responses. See
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/toasts/laravel').href"
                >Toasts from Laravel</DocsLink
            >
            to choose a delivery method.
        </p>
        <h2
            id="start-only-the-toast-listener"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Start only the toast listener
        </h2>
        <p>
            If you manage Mosaicast registration and app startup yourself, import
            <code>initializeFlashToast()</code> from
            <code>@artisan-toolbox/front-awesome/WebAwesome/flashToast</code>. Call it before
            starting Inertia. The initializer accepts the same placement option as
            <code>flashToast</code> and returns a cleanup function. If several callers start the
            stack, it stays active until all of them run their cleanup functions. Use the Vue plugin
            if you also need <code>useToast()</code> or <code>$frontAwesome</code>.
        </p>
        <p>
            The same entry point exports
            <code>showToast(message, options)</code>. It uses the active stack and the same
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/toasts/vue').href +
                    '#toast-options'
                "
                >toast options</DocsLink
            >
            as the Vue service.
        </p>
        <p>
            The root package exports the <code>FrontAwesomeOptions</code> and
            <code>FlashToastOptions</code> types.
        </p>
    </ProseSection>
</template>
