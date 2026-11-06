<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import EscposPreviewsContent from '@/components/docs/qztray/EscposPreviews.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <EscposPreviewsContent :navigation="navigation" />
    </article>
</template>
