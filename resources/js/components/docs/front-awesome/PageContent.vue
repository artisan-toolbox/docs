<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `<template>
  <wa-page
    class="project-page"
    mobile-breakpoint="48rem"
    disable-navigation-toggle
  >
    <header slot="header" class="flex items-center gap-4">
      <wa-button data-toggle-nav>Menu</wa-button>
      <a href="/">Project</a>
    </header>
    <div slot="navigation-header">Project navigation</div>
    <div slot="navigation" class="flex flex-col gap-2">
      <a href="/dashboard">Dashboard</a>
      <a href="/reports">Reports</a>
    </div>
    <main id="content">
      <h1 class="text-2xl font-semibold">Dashboard</h1>
      <p class="mt-4">Your application content.</p>
    </main>
    <aside slot="aside" aria-label="On this page">
      <a href="#content">Dashboard</a>
    </aside>
    <footer slot="footer">Project footer</footer>
  </wa-page>
</template>

<script setup lang="ts">
import "@awesome.me/webawesome/dist/components/page/page.js";
import "@awesome.me/webawesome/dist/components/button/button.js";
\x3C/script>

<style>
.project-page {
  --menu-width: 16rem;
  --aside-width: 14rem;
}

.project-page[view="mobile"] {
  --menu-width: auto;
  --aside-width: auto;
}

.project-page[view="mobile"] > [slot="aside"] {
  display: none;
}
</style>`;
const example2 = `<wa-page class="reports-page">
  <main class="p-0">
    <section class="p-4">A full-width report with an inner gutter.</section>
  </main>
</wa-page>`;
</script>

<template>
    <ProseSection>
        <p>
            Use <code>wa-page</code> after installing the
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/shared-theme')
                        .href
                "
                >shared Tailwind theme</DocsLink
            >. Register the page element from the same Web Awesome edition used
            by Front Awesome. The example below uses Core.
        </p>
        <h2
            id="render-the-page-and-one-navigation-tree"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Render the page and one navigation tree
        </h2>
        <CodeExample
            label="Render the page and one navigation tree example 1"
            language="vue"
            :code="example1"
        />
        <p>
            The main content uses the unnamed slot. There is no
            <code>slot="main"</code>. Supply the semantic <code>main</code>,
            <code>header</code>, <code>footer</code>, and
            <code>aside</code> elements in your markup. On desktop, Web Awesome
            already wraps navigation content in a navigation landmark, so the
            example uses a <code>div</code> for that slot.
        </p>
        <p>
            The same navigation content appears beside the main content on
            desktop and inside Web Awesome's drawer on mobile. Keep one
            navigation tree. Do not add a second responsive drawer around it.
        </p>
        <p>
            The custom Menu button exists because this example has navigation.
            Its <code>data-toggle-nav</code> attribute uses Web Awesome's toggle
            behavior and desktop visibility helper.
            <code>disable-navigation-toggle</code> suppresses the default
            button, including the initial markup before custom-toggle detection.
            For a page without navigation, omit the custom button and navigation
            slots.
        </p>
        <p>
            For Pro, replace both component import prefixes with
            <code>@web.awesome.me/webawesome-pro</code>. Keep
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/web-awesome')
                        .href + '#choose-core-or-pro'
                "
                >edition selection</DocsLink
            >
            consistent across the page.
        </p>
        <h2
            id="preserve-the-upstream-prerequisites"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Preserve the upstream prerequisites
        </h2>
        <p>
            The imported default theme keeps the <code>html</code> and
            <code>body</code> minimum-height and zero-gutter rules for documents
            containing <code>wa-page</code>. The upstream layer stylesheet also
            keeps fragment scroll offsets, custom-toggle visibility, and the
            <code>wa-mobile-only</code> and
            <code>wa-desktop-only</code> helpers.
        </p>
        <p>
            Keep the
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/shared-theme')
                        .href + '#load-the-two-style-entries'
                "
                >two public style entries</DocsLink
            >. Importing only component JavaScript does not install those
            document rules. Do not add <code>native.css</code> to obtain them.
        </p>
        <h2
            id="keep-slot-padding-and-utility-overrides"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Keep slot padding and utility overrides
        </h2>
        <p>
            Tailwind Preflight resets padding on the light-DOM elements assigned
            to page slots. The adapter uses a narrow base-layer
            <code>revert-layer</code> guard to restore upstream padding where
            the page supplies it. The guard excludes toggle and skip-link slots.
        </p>
        <p>
            Use explicit Tailwind utilities to change padding for a page region:
        </p>
        <CodeExample
            label="Keep slot padding and utility overrides example 2"
            language="html"
            :code="example2"
        />
        <p>
            The <code>p-0</code> main is full bleed only for this page.
            <code>p-4</code> remains an explicit utility override. Do not
            globally remove padding from every <code>main</code>, copy upstream
            padding dimensions into application CSS, or remove Preflight to fix
            this interaction.
        </p>
        <h2
            id="configure-the-mobile-threshold"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Configure the mobile threshold
        </h2>
        <p>
            Set <code>mobile-breakpoint</code> as the input. Web Awesome
            reflects the resulting layout through <code>view="mobile"</code> or
            <code>view="desktop"</code>. Do not bind <code>view</code> as a
            competing layout controller.
        </p>
        <p>
            When you customize <code>--menu-width</code>, reset it to
            <code>auto</code> in the mobile rule, as in the example. The mobile
            drawer owns navigation width. A retained desktop width can constrain
            the page grid after navigation moves.
        </p>
        <p>
            The example hides the aside on mobile and resets its custom width as
            an application choice. Retaining
            <code>--aside-width: 14rem</code> would reserve an empty grid column
            after hiding its content. The adapter does not globally hide, stack,
            or reposition asides. To retain the aside, design a page-specific
            stacking rule and test its grid placement, width, and sticky
            behavior at your breakpoint.
        </p>
        <h2
            id="check-the-complete-layout"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Check the complete layout
        </h2>
        <p>
            Verify the header and other sticky regions while scrolling. Follow a
            fragment link and check that the target stays visible below the
            header. Use the keyboard to open and close mobile navigation and
            confirm focus returns to its toggle. Check both modes, long
            navigation labels, and pages without navigation.
        </p>
        <p>
            See the
            <DocsLink href="https://webawesome.com/docs/components/page/"
                >Web Awesome Page reference</DocsLink
            >
            for all slots, properties, methods, and CSS parts.
        </p>
    </ProseSection>
</template>
