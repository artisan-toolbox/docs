<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CatalogContext from '@/components/docs/front-awesome/catalog/CatalogContext.vue';
import ComponentCatalog from '@/components/docs/front-awesome/catalog/ComponentCatalog.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
const example1 = `<script setup>
import { ref } from 'vue';
import { Input } from '@artisan-toolbox/front-awesome/components';

const name = ref('Ada');
\x3C/script>

<template>
  <Input v-model="name" label="Name" />
  <output>{{ name }}</output>
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
            <ComponentCatalog group="forms" :navigation="navigation" />
        </ProseSection>
        <ProseSection id="input" title="Input">
            <p>
                Use either v-model or the Inertia form and field-name binding. Combining both modes,
                or providing neither mode, throws an error. The toast plugin is not required.
            </p>
            <CodeExample label="Input basic example" language="vue" :code="example1" />
            <p>
                Expected result. The Name input and output begin with Ada. Editing the input updates
                the output.
            </p>
            <p>
                Continue with the
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/input').href"
                    >Input binding and errors guide</DocsLink
                >
                or consult the
                <DocsLink href="https://webawesome.com/docs/components/input/"
                    >Web Awesome Input reference</DocsLink
                >.
            </p>
        </ProseSection>
    </article>
</template>
