<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import GettingStarted from '@/components/docs/qztray/GettingStarted.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <GettingStarted :page="page" :navigation="navigation" />
    </article>
</template>
