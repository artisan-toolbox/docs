<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CatalogContext from '@/components/docs/front-awesome/catalog/CatalogContext.vue';
import CatalogOverview from '@/components/docs/front-awesome/catalog/CatalogOverview.vue';
import CatalogSources from '@/components/docs/front-awesome/catalog/CatalogSources.vue';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <CatalogContext :navigation="navigation" />
        <ProseSection id="component-groups" title="Component groups">
            <p>
                Browse Web Awesome's official groups. Implemented tags link to basic examples on
                their group page. Existing full guides remain linked from those examples. Open the
                information button beside an implemented tag for details and links. In progress and
                In future tags open the same rich panel directly. Use Escape or click outside to
                dismiss it.
            </p>
            <CatalogOverview :navigation="navigation" />
        </ProseSection>
        <CatalogSources />
    </article>
</template>
