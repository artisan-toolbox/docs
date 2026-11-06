<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import BrandingPalette from '@/components/docs/front-awesome/BrandingPalette.vue';
import BrandingDimensions from '@/components/docs/front-awesome/BrandingDimensions.vue';
import BrandingScopes from '@/components/docs/front-awesome/BrandingScopes.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <BrandingPalette :navigation="navigation" />
        <BrandingDimensions :navigation="navigation" />
        <BrandingScopes :navigation="navigation" />
    </article>
</template>
