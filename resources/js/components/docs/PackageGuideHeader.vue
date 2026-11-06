<script setup>
import { computed } from 'vue';
import PackageBadges from '@/components/docs/PackageBadges.vue';
import PackageSpecs from '@/components/docs/PackageSpecs.vue';
import PageHeader from '@/components/docs/PageHeader.vue';

const props = defineProps({
    page: { type: Object, required: true },
});

const isOverview = computed(
    () =>
        Boolean(props.page.package.id) &&
        props.page.slug === props.page.package.id,
);
</script>

<template>
    <PageHeader
        :title="page.title"
        :description="page.description"
        eyebrow="Package documentation"
        :artwork="isOverview ? page.package.artwork : null"
    >
        <template v-if="!isOverview" #eyebrow>
            <PackageBadges :package="page.package" />
        </template>
        <PackageSpecs v-if="isOverview" :package="page.package" />
    </PageHeader>
</template>
