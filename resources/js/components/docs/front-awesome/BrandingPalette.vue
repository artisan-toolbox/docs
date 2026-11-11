<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `@theme {
  --color-brand-50: var(--color-indigo-50);
  --color-brand-100: var(--color-indigo-100);
  --color-brand-200: var(--color-indigo-200);
  --color-brand-300: var(--color-indigo-300);
  --color-brand-400: var(--color-indigo-400);
  --color-brand-500: var(--color-indigo-500);
  --color-brand-600: var(--color-indigo-600);
  --color-brand-700: var(--color-indigo-700);
  --color-brand-800: var(--color-indigo-800);
  --color-brand-900: var(--color-indigo-900);
  --color-brand-950: var(--color-indigo-950);
}`;
const example2 = `@theme {
  --color-project-accent: oklch(0.65 0.16 250);
}`;
</script>

<template>
    <ProseSection>
        <p>
            Start with the
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/shared-theme').href"
                >shared Tailwind theme</DocsLink
            >. Edit the published <code>resources/css/branding.css</code> file to change application
            identity. Shared values belong in Tailwind's <code>@theme</code> block. Web
            Awesome-specific exceptions belong in the separate override section.
        </p>
        <h2
            id="change-the-full-brand-palette"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Change the full brand palette
        </h2>
        <p>
            Replace all eleven brand stops together. This example uses the original Tailwind indigo
            palette:
        </p>
        <CodeExample
            label="Change the full brand palette example 1"
            language="css"
            :code="example1" />
        <p>
            Tailwind utilities such as <code>bg-brand-700</code> and Web Awesome brand components
            now read the same color family. Changing only <code>500</code> leaves hover, active,
            subtle, and dark states on the other stops.
        </p>
        <p>
            The adapter maps ramps and defines semantic foreground and background pairs. Web
            Awesome's ascending lightness stops and Tailwind's shade numbers run in opposite
            directions. Reversing the ramp alone does not preserve contrast.
        </p>
        <p>
            The published template also includes complete commented ramps for neutral, success,
            warning, and danger customization. Web Awesome reads these roles from Tailwind's
            <code>gray</code>, <code>green</code>, <code>yellow</code>, and <code>red</code>
            palettes. Uncomment all eleven stops of the palette you want to replace. The examples
            use slate, emerald, amber, and rose. Leaving them commented preserves the defaults.
        </p>
        <p>
            The expanded template is included in Front Awesome 1.0.0-alpha.2. Older installed
            versions may include only the brand ramp. Compare the package template with your
            application-owned copy when upgrading. Ordinary republishing preserves your existing
            file.
        </p>
        <p>
            These overrides replace physical palettes. Changing
            <code>--color-green-*</code> changes Tailwind's <code>bg-green-*</code> utilities and
            every mapped Web Awesome or PrimeVue value that uses green. Tailwind's native
            <code>--color-neutral-*</code> palette remains separate from Web Awesome's gray-backed
            neutral role.
        </p>
        <p>
            PrimeVue's Aura preset uses orange for warning buttons, badges, and tags, and yellow for
            warning messages and toasts. The template includes an additional commented orange ramp.
            Customize both orange and yellow when you want both warning groups to use the same
            family. Aura keeps its component-specific shade choices.
        </p>
        <p>
            After changing a palette, check normal text, solid and outlined controls, links, hover
            and active states, focus indicators, disabled content, and tooltips in both modes.
            Include inverted and local role scopes that the application uses. A custom ramp does not
            carry an automatic accessibility guarantee.
        </p>
        <h2
            id="add-a-tailwind-only-color"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Add a Tailwind-only color
        </h2>
        <CodeExample label="Add a Tailwind-only color example 2" language="css" :code="example2" />
        <p>
            This adds utilities such as <code>bg-project-accent</code>. It does not create a Web
            Awesome variant or a <code>wa-brand-project-accent</code> class. To use a new family as
            the shared brand, define its complete ramp and assign the eleven
            <code>--color-brand-*</code> values to it.
        </p>
        <p>
            The adapter does not rename existing application tokens such as
            <code>--primary</code> or <code>--background</code>. Keep any application-specific
            utility aliases explicit.
        </p>
    </ProseSection>
</template>
