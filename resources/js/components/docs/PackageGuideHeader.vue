<script setup>
import { computed } from 'vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { dataViewSlug } from '@/lib/navigationIcons';
import PackageBadges from '@/components/docs/PackageBadges.vue';
import PackageSpecs from '@/components/docs/PackageSpecs.vue';
import PageHeader from '@/components/docs/PageHeader.vue';

const props = defineProps({
    page: { type: Object, required: true },
});

const isOverview = computed(
    () => Boolean(props.page.package.id) && props.page.slug === props.page.package.id,
);
const dataViewHome = computed(() => {
    if (!props.page.slug?.startsWith(`${dataViewSlug}/`)) return null;
    return props.page.breadcrumbs?.find(({ href }) => href?.endsWith(`/${dataViewSlug}`))?.href;
});
</script>

<template>
    <PageHeader
        :title="page.title"
        :description="page.description"
        eyebrow="Package documentation"
        :artwork="isOverview ? page.package.artwork : null">
        <template v-if="!isOverview" #eyebrow>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
                <PackageBadges :package="page.package" />
                <DocsLink
                    v-if="dataViewHome"
                    :href="dataViewHome"
                    class="text-sm font-medium text-brand-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-brand-400">
                    DataView
                </DocsLink>
            </div>
        </template>
        <PackageSpecs v-if="isOverview" :package="page.package" />
    </PageHeader>
</template>
