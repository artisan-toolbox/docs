<script setup>
import PageHeader from '@/components/docs/PageHeader.vue';
import Content from '@/components/docs/community/ProjectVersioning/Content.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PageHeader :title="page.title" :description="page.description" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <Content :navigation="navigation" />
        </div>
    </article>
</template>
