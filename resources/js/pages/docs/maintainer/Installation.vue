<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import InstallationContent from '@/components/docs/maintainer/installation/Content.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <InstallationContent :page="page" :navigation="navigation" />
    </article>
</template>
