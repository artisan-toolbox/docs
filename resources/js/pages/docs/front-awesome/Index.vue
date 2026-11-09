<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import IndexContent from '@/components/docs/front-awesome/IndexContent.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <IndexContent :page="page" :navigation="navigation" :requirements="page.requirements" />
    </article>
</template>
