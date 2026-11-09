<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CatalogContext from '@/components/docs/front-awesome/catalog/CatalogContext.vue';
import ComponentCatalog from '@/components/docs/front-awesome/catalog/ComponentCatalog.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
const example1 = `<script setup>
import { Button } from '@artisan-toolbox/front-awesome/components';
\x3C/script>

<template>
  <Button variant="brand" type="button">Save changes</Button>
</template>`;
const example2 = `<script setup>
import { Button, ButtonGroup } from '@artisan-toolbox/front-awesome/components';
\x3C/script>

<template>
  <ButtonGroup label="Document actions">
    <Button type="button">Save</Button>
    <Button type="button">Cancel</Button>
  </ButtonGroup>
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
            <ComponentCatalog group="actions" :navigation="navigation" />
        </ProseSection>
        <ProseSection id="button" title="Button">
            <p>
                The wrapper forwards native attributes and registers wa-button when it mounts. Bind
                disabled and loading as booleans.
            </p>
            <CodeExample label="Button basic example" language="vue" :code="example1" />
            <p>
                Expected result. A brand-colored button displays Save changes. This example does not
                submit data.
            </p>
            <p>
                Continue with the
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/button').href"
                    >Button guide</DocsLink
                >
                or consult the
                <DocsLink href="https://webawesome.com/docs/components/button/"
                    >Web Awesome Button reference</DocsLink
                >.
            </p>
        </ProseSection>
        <ProseSection id="button-group" title="Button Group">
            <p>Provide a label for the group. Set orientation="vertical" to stack the buttons.</p>
            <CodeExample label="Button Group basic example" language="vue" :code="example2" />
            <p>
                Expected result. Save and Cancel appear in a horizontal group named Document actions
                for assistive technology.
            </p>
            <p>
                Continue with the
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'front-awesome/button').href +
                        '#group-related-buttons'
                    "
                    >Button Group guide</DocsLink
                >
                or consult the
                <DocsLink href="https://webawesome.com/docs/components/button-group/"
                    >Web Awesome Button Group reference</DocsLink
                >.
            </p>
        </ProseSection>
    </article>
</template>
