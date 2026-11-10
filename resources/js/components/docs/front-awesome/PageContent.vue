<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `<script setup>
import { Button, Page } from '@artisan-toolbox/front-awesome/components';
\x3C/script>

<template>
  <Page
    class="project-page"
    mobile-breakpoint="48rem"
    disable-navigation-toggle
  >
    <header slot="header" class="flex items-center gap-4">
      <Button data-toggle-nav>Menu</Button>
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
  </Page>
</template>


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
const example2 = `<script setup>
import { Page } from '@artisan-toolbox/front-awesome/components';
\x3C/script>

<template>
  <Page class="reports-page">
    <main class="p-0">
      <section class="p-4">A full-width report with an inner gutter.</section>
    </main>
  </Page>
</template>`;
</script>

<template>
    <ProseSection data-component-reference="page">
        <p>
            Start in the Laravel, Inertia, and Vue application from
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                >Installation</DocsLink
            >. Keep its Vite plugin and Web Awesome styles. This layout example uses the
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/shared-theme').href"
                >shared Tailwind theme</DocsLink
            >. Add the example to a Vue page in that application. The Page wrapper registers
            <code>wa-page</code> after browser mount and adds no classes, styles, theme, or layout
            defaults. It needs no toast plugin.
        </p>
        <DocsCallout variant="caution">
            <template #title>Development preview</template>
            <p>
                This guide describes the current checkout. Confirm that your Composer-installed
                package exports
                <code>components/Page.vue</code>. The published <code>1.0.0-alpha.1</code> archive
                does not include this wrapper. Refresh the frontend package copy after updating
                Composer.
            </p>
        </DocsCallout>
        <h3
            id="render-the-page-and-one-navigation-tree"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Render the page and one navigation tree
        </h3>
        <CodeExample
            label="Render the page and one navigation tree example 1"
            language="vue"
            :code="example1" />
        <p>
            Expected result. The page displays a Project header, Dashboard content, navigation, an
            aside, and a footer. Below 48rem, the same navigation moves into a drawer opened by
            Menu, and the aside is hidden by the example's CSS.
        </p>
        <p>
            Import <code>Page</code> from either
            <code>@artisan-toolbox/front-awesome/components</code> or
            <code>@artisan-toolbox/front-awesome/components/WebAwesome</code>. Direct
            <code>components/Page.vue</code> and <code>components/WebAwesome/Page.vue</code> imports
            are also supported. Pass region elements through Vue's default slot, with native
            <code>slot="header"</code> or <code>slot="navigation"</code> attributes. Vue named
            templates such as <code>#header</code> are not this wrapper's slot API.
        </p>
        <p>
            The main content uses the unnamed slot. There is no
            <code>slot="main"</code>. Supply the semantic <code>main</code>, <code>header</code>,
            <code>footer</code>, and <code>aside</code> elements in your markup. On desktop, Web
            Awesome already wraps navigation content in a navigation landmark, so the example uses a
            <code>div</code> for that slot.
        </p>
        <p>
            The same navigation content appears beside the main content on desktop and inside Web
            Awesome's drawer on mobile. Keep one navigation tree. Do not add a second responsive
            drawer around it.
        </p>
        <p>
            The custom Menu button exists because this example has navigation. Its
            <code>data-toggle-nav</code> attribute uses Web Awesome's toggle behavior and desktop
            visibility helper. <code>disable-navigation-toggle</code> suppresses the default button,
            including the initial markup before custom-toggle detection. For a page without
            navigation, omit the custom button and navigation slots.
        </p>
        <p>
            The wrapper's runtime imports follow the Front Awesome Vite plugin's Core or Pro
            selection. Keep
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/web-awesome').href +
                    '#choose-core-or-pro'
                "
                >edition selection</DocsLink
            >
            consistent across the page.
        </p>
        <h3
            id="preserve-the-upstream-prerequisites"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Preserve the upstream prerequisites
        </h3>
        <p>
            The imported default theme keeps the <code>html</code> and
            <code>body</code> minimum-height and zero-gutter rules for documents containing
            <code>wa-page</code>. The upstream layer stylesheet also keeps fragment scroll offsets,
            custom-toggle visibility, and the <code>wa-mobile-only</code> and
            <code>wa-desktop-only</code> helpers.
        </p>
        <p>
            Keep the
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/shared-theme').href +
                    '#load-the-two-style-entries'
                "
                >two public style entries</DocsLink
            >. Importing only component JavaScript does not install those document rules. Do not add
            <code>native.css</code> to obtain them.
        </p>
        <h3
            id="keep-slot-padding-and-utility-overrides"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Keep slot padding and utility overrides
        </h3>
        <p>
            Tailwind Preflight resets padding on the light-DOM elements assigned to page slots. The
            adapter uses a narrow base-layer
            <code>revert-layer</code> guard to restore upstream padding where the page supplies it.
            The guard excludes toggle and skip-link slots.
        </p>
        <p>Use explicit Tailwind utilities to change padding for a page region:</p>
        <CodeExample
            label="Keep slot padding and utility overrides example 2"
            language="vue"
            :code="example2" />
        <p>
            The <code>p-0</code> main is full bleed only for this page. <code>p-4</code> remains an
            explicit utility override. Do not globally remove padding from every <code>main</code>,
            copy upstream padding dimensions into application CSS, or remove Preflight to fix this
            interaction.
        </p>
        <h3
            id="configure-the-mobile-threshold"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Configure the mobile threshold
        </h3>
        <p>
            All Page options are optional. A page can omit
            <code>nav-open</code>, <code>mobile-breakpoint</code>,
            <code>navigation-placement</code>, and <code>nonce</code>. Web Awesome supplies the
            native defaults; no placeholder attributes are required when registering Page through
            Vue's Options API.
        </p>
        <p>
            Set <code>mobile-breakpoint</code> as the input. Web Awesome reflects the resulting
            layout through <code>view="mobile"</code> or <code>view="desktop"</code>. Do not bind
            <code>view</code> as a competing layout controller.
        </p>
        <p>
            When you customize <code>--menu-width</code>, reset it to <code>auto</code> in the
            mobile rule, as in the example. The mobile drawer owns navigation width. A retained
            desktop width can constrain the page grid after navigation moves.
        </p>
        <p>
            The example hides the aside on mobile and resets its custom width as an application
            choice. Retaining
            <code>--aside-width: 14rem</code> would reserve an empty grid column after hiding its
            content. The adapter does not globally hide, stack, or reposition asides. To retain the
            aside, design a page-specific stacking rule and test its grid placement, width, and
            sticky behavior at your breakpoint.
        </p>
        <p>
            Use bare <code>nav-open</code> or bind <code>:nav-open="isOpen"</code> to set the native
            drawer flag. A bound false removes the boolean attribute. Native menu toggles and
            dismissal still update the element's state; this is not a <code>v-model</code> binding.
            View changes close navigation. Use <code>navigation-placement="end"</code> to place the
            mobile drawer at the end. <code>disable-navigation-toggle</code>
            also supports a bare attribute and bound booleans. When omitted, Web Awesome detects
            custom toggles and navigation content itself.
        </p>
        <p>
            Set <code>disable-sticky="header aside"</code> to disable those sticky regions. Forward
            a CSP <code>nonce</code> when the injected responsive stylesheet requires one. Ordinary
            HTML attributes and listeners fall through to the native element. Import
            <code>PageProps</code> from the package root or either component barrel for native
            option types, including the <code>start</code> and <code>end</code> placement union.
            Internal element references and the computed <code>view</code> are excluded from the
            input type.
        </p>
        <p>
            All native slots remain available, including <code>banner</code>,
            <code>subheader</code>, <code>navigation-footer</code>, <code>main-header</code>,
            <code>main-footer</code>, <code>navigation-toggle</code>,
            <code>navigation-toggle-icon</code>, and <code>skip-to-content</code>. The
            <code>menu</code> slot replaces responsive navigation and leaves that behavior to your
            application. Native <code>showNavigation()</code>, <code>hideNavigation()</code>, and
            <code>toggleNavigation()</code> remain available on the rendered
            <code>wa-page</code> element after
            <code>customElements.whenDefined('wa-page')</code> resolves.
        </p>
        <h3
            id="check-the-complete-layout"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Check the complete layout
        </h3>
        <p>
            Verify the header and other sticky regions while scrolling. Follow a fragment link and
            check that the target stays visible below the header. Use the keyboard to open and close
            mobile navigation and confirm focus returns to its toggle. Check both modes, long
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
