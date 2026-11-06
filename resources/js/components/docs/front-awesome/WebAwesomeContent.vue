<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `import { frontAwesome } from "@artisan-toolbox/front-awesome/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // Keep your existing Laravel, Inertia, and Tailwind plugins here.
    frontAwesome(),
    vue(),
  ],
});`;
const example2 = `@import "tailwindcss";
@import "@artisan-toolbox/front-awesome/styles.css";`;
const example3 = `import "@artisan-toolbox/front-awesome/web-awesome.css";`;
</script>

<template>
    <ProseSection>
        <p>
            Front Awesome wraps Web Awesome custom elements. It includes Web
            Awesome Core and VueUse. The application supplies Vue, Inertia, and
            Tailwind CSS.
        </p>
        <h2
            id="configure-vite"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Configure Vite
        </h2>
        <p>
            Add <code>frontAwesome()</code> from
            <code>@artisan-toolbox/front-awesome/vite</code> to your existing
            Vite plugins. Keep the Laravel, Inertia, Tailwind, and Vue plugins
            in place. Front Awesome automatically configures
            <code>@vitejs/plugin-vue</code> to recognize <code>wa-</code> tags
            as custom elements.
        </p>
        <CodeExample
            label="Configure Vite example 1"
            language="ts"
            :code="example1"
        />
        <p>
            Keep your existing Vue plugin options. Front Awesome extends
            <code>template.compilerOptions.isCustomElement</code> so both
            <code>wa-</code> tags and your existing custom elements remain
            recognized. Other template and compiler options are preserved. An
            existing matcher for <code>wa-</code> tags can stay in place, but is
            no longer required.
        </p>
        <p>
            You can place <code>frontAwesome()</code> before or after the Vue
            plugin. The automatic configuration applies to development, client
            builds, and SSR builds. If you build an Inertia SSR bundle, add
            <code>"@artisan-toolbox/front-awesome"</code> to Vite's
            <code>ssr.noExternal</code> list so Vite compiles the package's Vue
            files.
        </p>
        <h2
            id="choose-a-styling-setup"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Choose a styling setup
        </h2>
        <p>
            Use the
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/shared-theme')
                        .href
                "
                >shared Tailwind theme</DocsLink
            >
            to make Tailwind tokens control common Web Awesome design choices.
            That setup replaces the imports below with its own public entries.
            It keeps Tailwind Preflight and excludes Web Awesome's global
            native-element styling.
        </p>
        <p>
            For an existing application-owned theme, keep the following setup.
        </p>
        <h2
            id="load-application-owned-styles"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Load application-owned styles
        </h2>
        <p>
            Import the package's Tailwind source stylesheet after Tailwind in
            the application CSS entry. Tailwind uses the source directive to
            scan the package's Vue components for utility classes.
        </p>
        <CodeExample
            label="Load application-owned styles example 2"
            language="css"
            :code="example2"
        />
        <p>
            If the application already loads Web Awesome styles, keep its
            existing setup. To load the standard Web Awesome stylesheet, import
            the optional stylesheet in the JavaScript entry. Vite can then
            resolve the nested CSS imports.
        </p>
        <CodeExample
            label="Load application-owned styles example 3"
            language="ts"
            :code="example3"
        />
        <p>
            Front Awesome components inherit the active Web Awesome theme and
            the application's <code>--wa-*</code> tokens. Set colors,
            typography, and spacing in the application. To manage light and dark
            mode with Front Awesome,
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/vue-plugin')
                        .href + '#add-a-theme-selector'
                "
                >add a theme selector</DocsLink
            >.
        </p>
        <h2
            id="choose-core-or-pro"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Choose Core or Pro
        </h2>
        <p>
            The Vite plugin prefers the application's installed
            <code>@web.awesome.me/webawesome-pro</code> package. It otherwise
            uses the application's Core installation or the Core copy supplied
            by Front Awesome. The plugin selects the edition for Front Awesome's
            button, button group, toast, and optional Web Awesome stylesheet
            entries.
        </p>
        <DocsTable caption="Choose Core or Pro reference 1"
            ><thead>
                <tr>
                    <th scope="col">Vite option</th>
                    <th scope="col">Edition</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>frontAwesome()</code></td>
                    <td>Pro when installed. Core otherwise.</td>
                </tr>
                <tr>
                    <td>
                        <code
                            >frontAwesome(&#123; webAwesome: "core"
                            &#125;)</code
                        >
                    </td>
                    <td>Core.</td>
                </tr>
                <tr>
                    <td>
                        <code
                            >frontAwesome(&#123; webAwesome: "pro" &#125;)</code
                        >
                    </td>
                    <td>
                        Pro. Install Pro in the application before building.
                    </td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            Import native components directly from the edition your application
            uses. For example, a Pro app can import
            <code
                >@web.awesome.me/webawesome-pro/dist/components/icon/icon.js</code
            >. The Vite plugin only changes Front Awesome's internal imports.
            Use one edition on each page because both editions register the same
            custom element names. If you previously added an alias for the
            entire Core package, remove it and rebuild.
        </p>
        <p>
            Edition selection does not establish theme compatibility for an
            untested Pro release. See the
            <DocsLink
                :href="
                    findNavigationItem(
                        navigation,
                        'front-awesome/theme-maintenance',
                    ).href + '#compatibility-record'
                "
                >shared-theme compatibility record</DocsLink
            >
            before adopting the adapter.
        </p>
    </ProseSection>
</template>
