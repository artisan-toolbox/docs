<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import CredentialsContent from '@/components/docs/qztray/Credentials.vue';
import ErrorBoundariesContent from '@/components/docs/qztray/ErrorBoundaries.vue';
import SecurityContent from '@/components/docs/qztray/Security.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <CredentialsContent :navigation="navigation" />
        <ErrorBoundariesContent :navigation="navigation" />
        <SecurityContent :page="page" :navigation="navigation" />
    </article>
</template>
