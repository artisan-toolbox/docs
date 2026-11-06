<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ConfigurationContent from '@/components/docs/front-awesome/ConfigurationContent.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ConfigurationContent :navigation="navigation" />
    </article>
</template>
