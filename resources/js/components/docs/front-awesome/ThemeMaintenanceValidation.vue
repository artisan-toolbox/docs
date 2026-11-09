<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `npm run theme:check
npm run test:theme`;
const example2 = `npm run theme:generate`;
const example3 = `node scripts/check-theme-compatibility.mjs --record`;
</script>

<template>
    <ProseSection>
        <h2
            id="run-the-maintenance-commands"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Run the maintenance commands
        </h2>
        <p>Run these commands from the Front Awesome checkout:</p>
        <CodeExample
            label="Run the maintenance commands example 1"
            language="sh"
            :code="example1" />
        <p>
            <code>theme:check</code> checks generated CSS and compares installed versions, upstream
            hashes, and the derived token inventory with
            <code>tests/theme-compatibility.json</code>. <code>test:theme</code> builds the public
            base and optional PrimeVue consumers, then checks computed values in Chromium. It also
            checks that the base import graph does not import optional PrimeVue packages.
        </p>
        <p>
            The browser command uses <code>CHROMIUM_EXECUTABLE</code> when set. On macOS it can use
            the installed Chromium application. Otherwise, install Playwright's Chromium as
            described in
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/development').href +
                    '#validate-a-checkout'
                "
                >Development</DocsLink
            >.
        </p>
        <p>
            To change the mapping registry or generator, edit
            <code>scripts/theme-tokens.mjs</code> or <code>scripts/generate-theme.mjs</code>, then
            regenerate the adapter:
        </p>
        <CodeExample
            label="Run the maintenance commands example 2"
            language="sh"
            :code="example2" />
        <p>
            Do not edit the generated
            <code>resources/js/theme/tokens.css</code> file by hand. After reviewing upstream
            changes and passing the complete validation suite, refresh the compatibility record
            explicitly:
        </p>
        <CodeExample
            label="Run the maintenance commands example 3"
            language="sh"
            :code="example3" />
        <p>
            Inspect the record diff before accepting it. Recording new hashes is the last step of
            the review, not a fix for an unexplained check failure.
        </p>
        <h2
            id="validate-the-public-entries"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Validate the public entries
        </h2>
        <p>
            Exercise the published <code>tailwind.css</code>, <code>web-awesome-tailwind</code>, and
            optional <code>primevue</code> entries in real consuming builds. Test the base entries
            with optional PrimeVue peers absent. When Pro is available, test the same contracts
            using the selected Pro edition.
        </p>
        <p>
            Check that Tailwind emits tokens referenced by adapters even when the application does
            not use their corresponding utilities. A build can succeed while a computed Web Awesome
            color remains empty.
        </p>
        <p>
            Test light and dark document modes, manual mode opposite the operating-system
            preference, inverted scopes, local role classes, and changed branding. Measure
            foreground and background pairs on their actual backing surfaces. Numeric ramp
            correspondence does not prove contrast.
        </p>
        <p>
            For <code>wa-page</code>, cover slot padding with and without <code>p-0</code> and
            <code>p-4</code>, mobile width resets, sticky regions, fragment targets, drawer focus,
            and navigation-free layouts. Keep mobile aside recipes application-owned.
        </p>
        <p>
            For PrimeVue, cover the official styled preset, its named layer, document mode selector,
            shared token changes, and teleported overlays used by the fixture. Do not extend a test
            of a few components into a claim about every PrimeVue component.
        </p>
        <p>
            Run the commands in
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/development').href +
                    '#validate-a-checkout'
                "
                >Development</DocsLink
            >
            before completing an update. Keep implementation, tests, the inventory, changelog, and
            canonical guides synchronized.
        </p>
    </ProseSection>
</template>
