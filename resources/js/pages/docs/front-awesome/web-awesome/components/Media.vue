<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CatalogContext from '@/components/docs/front-awesome/catalog/CatalogContext.vue';
import ComponentCatalog from '@/components/docs/front-awesome/catalog/ComponentCatalog.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
const example1 = `<script setup>
import { Icon } from '@artisan-toolbox/front-awesome/components';
\x3C/script>

<template>
  <button type="button">
    <Icon name="download" />
    Download
  </button>
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
            <ComponentCatalog group="media" :navigation="navigation" />
        </ProseSection>
        <ProseSection id="icon" title="Icon">
            <p>
                Allow the configured icon source to load over the network. Standalone informative
                icons need a label. Custom Font Awesome kit icons require the kit setup described in
                the complete guide.
            </p>
            <CodeExample label="Icon basic example" language="vue" :code="example1" />
            <p>
                Expected result. A Download button displays an icon beside its visible text after
                the SVG loads. The icon is decorative because the button already has a name.
            </p>
            <p>
                Continue with the
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/icon').href"
                    >Icon accessibility and source guide</DocsLink
                >
                or consult the
                <DocsLink href="https://webawesome.com/docs/components/icon/"
                    >Web Awesome Icon reference</DocsLink
                >.
            </p>
        </ProseSection>
    </article>
</template>
