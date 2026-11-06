<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import VuePluginContent from '@/components/docs/front-awesome/VuePluginContent.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <VuePluginContent :navigation="navigation" />
    </article>
</template>
