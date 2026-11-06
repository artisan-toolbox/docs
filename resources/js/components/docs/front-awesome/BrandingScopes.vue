<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `@layer app-branding {
  :root {
    --wa-focus-ring-width: 0.1875rem;
    --wa-space-scale: 1.125;
  }
}`;
const example2 = `@layer app-branding {
  .editorial-theme {
    --font-sans: Georgia, serif;
  }
}`;
const example3 = `<section class="fa-theme editorial-theme font-sans">
  <wa-button>Editorial action</wa-button>
</section>`;
</script>

<template>
    <ProseSection>
        <h2
            id="make-a-web-awesome-only-exception"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Make a Web Awesome-only exception
        </h2>
        <p>
            Use the override section in the published template for a Web
            Awesome-specific setting:
        </p>
        <CodeExample
            label="Make a Web Awesome-only exception example 1"
            language="css"
            :code="example1"
        />
        <p>
            These values affect Web Awesome only. Shared values flow from
            Tailwind to adapters. Do not alias a Tailwind input back to its Web
            Awesome output. A circular variable dependency makes both
            declarations invalid.
        </p>
        <p>
            Some upstream physical hue foreground declarations are unlayered.
            The adapter replaces the affected hue key and foreground pairs with
            its own unlayered policy. An advanced direct override of those pairs
            must also be unlayered and appear after the adapter. A later named
            layer cannot override an unlayered declaration. Keep foreground and
            background changes paired and validate their contrast.
        </p>
        <h2
            id="respect-scope-boundaries"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Respect scope boundaries
        </h2>
        <p>
            Set shared branding on the document by default. CSS aliases resolve
            in the element where they are declared. An inherited alias does not
            automatically recompute when a descendant changes only its source
            variable.
        </p>
        <p>
            The adapter rebinds its semantic policy at the mode, inversion, and
            supported Web Awesome role boundaries. Use the
            <DocsLink
                :href="
                    findNavigationItem(
                        navigation,
                        'front-awesome/theme-maintenance',
                    ).href + '#token-ownership'
                "
                >ownership and scope reference</DocsLink
            >
            when composing local themes. An arbitrary subtree with custom
            Tailwind font or palette variables is not automatically a separate
            complete theme.
        </p>
        <p>
            To rebind shared inputs inside an intentional Web Awesome theme
            scope, add <code>fa-theme</code> to the same element that defines
            the input overrides:
        </p>
        <CodeExample
            label="Respect scope boundaries example 2"
            language="css"
            :code="example2"
        />
        <CodeExample
            label="Respect scope boundaries example 3"
            language="html"
            :code="example3"
        />
        <p>
            The font change reaches that scope's Web Awesome body font and
            Tailwind <code>font-sans</code> utility. Use
            <code>wa-brand-yellow</code> to select the supported yellow family
            for a local Web Awesome brand role. That class does not change
            Tailwind's <code>bg-brand-*</code> utilities or PrimeVue's primary
            palette.
        </p>
        <p>
            PrimeVue overlays can leave a component's subtree through
            teleportation. Prefer root branding for
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/primevue')
                        .href
                "
                >the optional PrimeVue integration</DocsLink
            >.
        </p>
        <p>
            See
            <DocsLink href="https://tailwindcss.com/docs/theme"
                >Tailwind theme variables</DocsLink
            >
            for the original token namespaces.
        </p>
    </ProseSection>
</template>
