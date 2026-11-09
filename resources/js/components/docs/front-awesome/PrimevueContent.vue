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
const example2 = `import { frontAwesomePrimeVueTheme } from "@artisan-toolbox/front-awesome/primevue";
import PrimeVue from "primevue/config";

app.use(PrimeVue, {
  theme: frontAwesomePrimeVueTheme,
});`;
</script>

<template>
    <ProseSection>
        <p>
            The optional PrimeVue entry extends the official Aura preset through
            <code>definePreset</code>. It supplies shared branding to PrimeVue 4 styled components
            while PrimeVue keeps its component styles. Install the
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/shared-theme').href"
                >shared Tailwind theme</DocsLink
            >
            first.
        </p>
        <h2
            id="install-the-optional-packages"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Install the optional packages
        </h2>
        <p>
            Install PrimeVue 4 and its compatible official theme package in the consuming
            application. The base Front Awesome entries do not import PrimeVue or its theme package.
            Applications without PrimeVue do not need either package.
        </p>
        <InstallCommand
            label="Install the optional packages example 1"
            language="sh"
            :package="page.package"
            command="primevue" />
        <p>
            These are the integration's initial dependency pair. Check the
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/theme-maintenance').href +
                    '#compatibility-record'
                "
                >compatibility record</DocsLink
            >
            when updating them. Do not substitute another major theme-package version based only on
            its package name.
        </p>
        <p>
            The base package does not enforce a PrimeVue version. Its optional theme peer accepts
            existing installations so applications can adopt the base entries without changing an
            older PrimeVue setup. This installation flexibility does not extend the adapter's
            verified compatibility beyond the recorded pair. Install that pair when enabling this
            preset.
        </p>
        <p>
            This integration targets styled mode. It does not supply the component styles required
            by unstyled mode.
        </p>
        <h2
            id="register-the-theme"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Register the theme
        </h2>
        <p>
            Use <code>frontAwesomePrimeVueTheme</code> from the optional
            <code>@artisan-toolbox/front-awesome/primevue</code> entry:
        </p>
        <CodeExample label="Register the theme example 2" language="ts" :code="example2" />
        <p>
            Keep PrimeVue component registration and all other application options in the
            application. The export is the theme configuration object, not a Vue plugin or a
            replacement for
            <code>createFrontAwesome()</code>.
        </p>
        <p>
            The adapter sets <code>options.darkModeSelector</code> to <code>.wa-dark</code> and
            <code>options.cssLayer.name</code> to <code>primevue</code>. Both its layer options and
            the shared Tailwind wrapper declare the complete layer order. PrimeVue can prepend its
            style declaration before the application's stylesheet, so a layer name alone can place
            its component styles below Preflight. Tailwind utilities remain above PrimeVue component
            styles. No extra PrimeVue CSS adapter import is required.
        </p>
        <p>
            The preset does not add a second color-mode controller. Use the same
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/shared-theme').href +
                    '#choose-the-color-mode-owner'
                "
                >document preference owner</DocsLink
            >
            for all libraries.
        </p>
        <h2
            id="keep-branding-at-the-document-root"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Keep branding at the document root
        </h2>
        <p>
            Change shared values in <code>resources/css/branding.css</code>. PrimeVue's primary role
            uses the shared brand family. Mapped common dimensions and semantic values follow the
            adapter's
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/theme-maintenance').href +
                    '#token-ownership'
                "
                >ownership reference</DocsLink
            >. Aura continues to define component-specific behavior and values outside that mapping.
        </p>
        <p>
            Shared foundations do not make every PrimeVue component visually identical to Web
            Awesome. Validate the actual PrimeVue controls used by the application after changing
            the palette, fonts, spacing, or radius.
        </p>
        <p>
            The updated development preview connects all 22 Aura color palettes to their Tailwind
            inputs, including emerald, sky, zinc, and slate. Changing a physical ramp in the
            published branding file therefore reaches PrimeVue components that use that ramp.
            Neutral surfaces continue to read gray. Success reads green and danger reads red.
        </p>
        <p>
            Aura uses orange for warning buttons, badges, and tags, and yellow for warning messages
            and toasts. The branding template provides complete commented ramps for both. Replace
            both ramps to give these warning groups the same color family. The preset retains Aura's
            shade, hover, active, and transparency choices.
        </p>
        <p>
            Overlays can teleport outside a component's subtree. A local dark class or branding
            override on that subtree may therefore miss the overlay. Prefer root mode and branding.
            If you change an overlay's append target, test its focus handling, clipping, stacking,
            and theme inheritance.
        </p>
        <p>
            This preset does not promise arbitrary nested light, dark, inverted, or local Web
            Awesome role scopes for PrimeVue components.
        </p>
        <p>
            Use the
            <DocsLink href="https://v4.primevue.org/theming/styled/"
                >PrimeVue 4 styled-mode reference</DocsLink
            >
            for the upstream configuration API. Use the
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/theme-maintenance').href +
                    '#compatibility-record'
                "
                >compatibility record</DocsLink
            >
            for the exact package pair exercised by Front Awesome.
        </p>
    </ProseSection>
</template>
