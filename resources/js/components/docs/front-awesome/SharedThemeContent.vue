<script setup>
import SharedBrandingDemo from '@/components/demo/front-awesome/SharedBrandingDemo.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `php artisan vendor:publish --tag=front-awesome-branding`;
const example2 = `/* resources/css/app.css */
@import "@artisan-toolbox/front-awesome/tailwind.css";
@import "./branding.css";`;
const example3 = `import "../css/app.css";
import "@artisan-toolbox/front-awesome/web-awesome-tailwind";`;
const example4 = `<template>
  <div class="flex items-center gap-4 font-sans">
    <span class="rounded-md bg-brand-700 px-4 py-2 text-white">Tailwind</span>
    <Button variant="brand">Web Awesome</Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@artisan-toolbox/front-awesome/components";
\x3C/script>`;
</script>

<template>
    <ProseSection>
        <p>
            Use this opt-in setup to share Tailwind colors, typography, spacing, radius, and shadows
            with Web Awesome. Front Awesome imports the selected edition's original default theme
            and utilities, then applies its token adapter. Tailwind remains the source of shared
            design values.
        </p>
        <p>
            This guide covers the WIP <code>1.x</code> branch. Check the
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/theme-maintenance').href +
                    '#compatibility-record'
                "
                >compatibility record</DocsLink
            >
            before upgrading frontend dependencies.
        </p>
        <h2
            id="configure-vite-first"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Configure Vite first
        </h2>
        <p>
            Complete
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                >installation</DocsLink
            >
            and
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/web-awesome').href +
                    '#configure-vite'
                "
                >Vite configuration</DocsLink
            >. Keep the Tailwind Vite plugin. The <code>frontAwesome()</code> Vite plugin selects
            the Web Awesome edition for the adapter's upstream imports.
        </p>
        <p>
            Use one Web Awesome edition per page. Direct component imports still need to match that
            edition.
        </p>
        <h2
            id="publish-the-branding-file"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Publish the branding file
        </h2>
        <p>Run this command in the Laravel application:</p>
        <CodeExample label="Publish the branding file example 1" language="sh" :code="example1" />
        <p>
            Laravel copies the editable template to
            <code>resources/css/branding.css</code>. This tag publishes only that file. The adapters
            remain in the package and receive package updates.
        </p>
        <p>
            Keep the application file under version control. During upgrades, compare the new
            package template with your copy. Do not use
            <code>--force</code> over edited branding.
        </p>
        <h2
            id="load-the-two-style-entries"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Load the two style entries
        </h2>
        <p>
            Replace the application's direct Tailwind import and Front Awesome
            <code>styles.css</code> import with the package Tailwind entry:
        </p>
        <CodeExample label="Load the two style entries example 2" language="css" :code="example2" />
        <p>
            Keep any application source directives and plugins that your project requires. The
            wrapper imports the original Tailwind stylesheet, including its default theme and
            Preflight. It registers Front Awesome's component sources, declares the complete cascade
            layer order, and defines class-based <code>dark:*</code> utilities.
        </p>
        <p>
            In the application JavaScript entry, load application CSS before the Web Awesome
            side-effect entry:
        </p>
        <CodeExample label="Load the two style entries example 3" language="js" :code="example3" />
        <p>
            The second import loads the selected edition's upstream default theme, layers, and
            utilities. It excludes <code>native.css</code>, so ordinary headings and controls retain
            Tailwind's native-element baseline. The wrapper sets the body background and text from
            Web Awesome's semantic surface and text tokens in Tailwind's base layer. Tailwind
            utilities can override those body colors.
        </p>
        <p>
            The current development preview also restores the native
            <code>wa-tag</code> padding and border that Tailwind Preflight resets on the
            custom-element host. Tags retain their upstream spacing and appearance, while
            application padding and border utilities still take precedence. The Tag wrapper itself
            adds no styling.
        </p>
        <p>
            Keep the split CSS and JavaScript imports. They are part of the public Vite integration
            contract.
        </p>
        <p>
            Remove
            <code>@artisan-toolbox/front-awesome/web-awesome.css</code> and other imports of Web
            Awesome's standard stylesheet from this setup. Loading both paths reintroduces
            native-element styles and makes the result depend on competing theme imports.
        </p>
        <h2
            id="check-the-result"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Check the result
        </h2>
        <p>
            After
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/vue-plugin').href"
                >registering the Vue plugin</DocsLink
            >, render a Tailwind element beside a Front Awesome button:
        </p>
        <CodeExample label="Check the result example 4" language="vue" :code="example4" />
        <p>
            Both elements use the shared brand family and font. Their component shapes and
            interaction details remain library-specific. Follow
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/branding').href"
                >Customize branding</DocsLink
            >
            to change shared values.
        </p>
        <SharedBrandingDemo />
        <h2
            id="choose-the-color-mode-owner"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Choose the color-mode owner
        </h2>
        <p>
            For Front Awesome to manage the document's preference, enable
            <code>createFrontAwesome(&#123; appearance: true &#125;)</code>. The
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/vue-plugin').href +
                    '#add-a-theme-selector'
                "
                >Vue plugin guide</DocsLink
            >
            describes persistence, system changes, and cleanup.
        </p>
        <p>
            If the application already manages appearance, retain that controller. Apply
            <code>dark</code> and <code>wa-dark</code> to <code>&lt;html&gt;</code> for dark mode,
            or <code>wa-light</code> for light mode. Remove the opposite mode classes when
            switching. The Tailwind dark variant follows <code>dark</code>. Web Awesome follows
            <code>wa-dark</code> and <code>wa-light</code>.
        </p>
        <p>
            SSR applications can apply these classes in the document head before the first paint.
            Use the same preference and fallback as the browser controller. The theme stylesheet
            does not read storage, set an SSR cookie, or add an appearance controller.
        </p>
        <h2
            id="keep-an-existing-theme"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Keep an existing theme
        </h2>
        <p>
            The existing <code>styles.css</code>, <code>web-awesome.css</code>, and
            <code>appearance: true</code> APIs retain their behavior. Existing applications opt in
            by changing their style imports. To return to an application-owned theme, restore the
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/web-awesome').href +
                    '#load-application-owned-styles'
                "
                >original setup</DocsLink
            >
            and remove the adapter imports.
        </p>
        <p>
            For page layouts, follow
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/page').href"
                >Build a page layout</DocsLink
            >. For PrimeVue 4 styled components, add the
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/primevue').href"
                >optional preset</DocsLink
            >.
        </p>
    </ProseSection>
</template>
