<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CatalogContext from '@/components/docs/front-awesome/catalog/CatalogContext.vue';
import ComponentCatalog from '@/components/docs/front-awesome/catalog/ComponentCatalog.vue';

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
            <ComponentCatalog group="navigation" :navigation="navigation" />
        </ProseSection>
        <ProseSection id="wrapper-availability" title="Wrapper availability">
            <p>
                No Front Awesome Vue wrappers in this group are implemented in the current source
                checkout. Open a tag's component details to review native behavior and
                prerequisites. In future carries no release date.
            </p>
        </ProseSection>
    </article>
</template>
