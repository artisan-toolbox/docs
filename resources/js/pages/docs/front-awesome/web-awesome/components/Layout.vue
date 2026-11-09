<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CatalogContext from '@/components/docs/front-awesome/catalog/CatalogContext.vue';
import ComponentCatalog from '@/components/docs/front-awesome/catalog/ComponentCatalog.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

const pageExample = `<script setup>
import { Page } from '@artisan-toolbox/front-awesome/components';
\x3C/script>

<template>
  <Page mobile-breakpoint="600px">
    <header slot="header">
      <button type="button" data-toggle-nav>Menu</button>
      Project
    </header>
    <div slot="navigation"><a href="#content">Dashboard</a></div>
    <main id="content"><h1>Dashboard</h1></main>
    <footer slot="footer">Project footer</footer>
  </Page>
</template>`;

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <CatalogContext :navigation="navigation" />
        <ProseSection id="components" title="Component status" :prose="false">
            <ComponentCatalog group="layout" :navigation="navigation" />
        </ProseSection>
        <ProseSection id="page" title="Page">
            <span id="native-page-layout" class="scroll-mt-28" />
            <CodeExample label="Arrange page regions" language="vue" :code="pageExample" />
            <p>
                Expected result. A Project header, navigation, Dashboard content, and footer share
                one layout. Below 600px of page width, Menu opens the same navigation in a drawer.
                The wrapper preserves native slot attributes and adds no styles or theme defaults.
            </p>
            <p>
                Continue with the
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'front-awesome/page').href +
                        '#render-the-page-and-one-navigation-tree'
                    "
                    >Page layout guide</DocsLink
                >
                for installation prerequisites, shared theme spacing, boolean bindings, and
                responsive widths, or consult the
                <DocsLink href="https://webawesome.com/docs/components/page/"
                    >Web Awesome Page reference</DocsLink
                >
                for its upstream contract.
            </p>
        </ProseSection>
    </article>
</template>
