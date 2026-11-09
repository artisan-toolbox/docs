<script setup>
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue';
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue';
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue';
import SiteIcon from '@/components/site/SiteIcon.vue';
import DocsLink from './DocsLink.vue';

defineProps({
    items: { type: Array, default: () => [] },
});
</script>

<template>
    <Breadcrumb v-if="items.length" aria-label="Breadcrumb" class="min-w-0" data-search-exclude>
        <BreadcrumbList class="items-start gap-y-2 text-slate-500 dark:text-slate-400">
            <BreadcrumbItem
                v-for="(item, index) in items"
                :key="item.href"
                class="max-w-full min-w-0 items-start sm:gap-2.5">
                <span
                    v-if="index > 0"
                    data-slot="breadcrumb-separator"
                    aria-hidden="true"
                    class="inline-flex h-5 shrink-0 items-center">
                    <SiteIcon name="chevron-right" size="sm" />
                </span>
                <span
                    v-if="item.current"
                    aria-current="page"
                    class="min-w-0 font-medium [overflow-wrap:anywhere] text-slate-700 dark:text-slate-200"
                    >{{ item.label }}</span
                >
                <DocsLink
                    v-else
                    :href="item.href"
                    class="min-w-0 rounded-sm [overflow-wrap:anywhere] hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:hover:text-brand-400"
                    >{{ item.label }}</DocsLink
                >
            </BreadcrumbItem>
        </BreadcrumbList>
    </Breadcrumb>
</template>
