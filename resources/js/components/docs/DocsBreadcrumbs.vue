<script setup>
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue';
import BreadcrumbItem from '@/components/ui/breadcrumb/BreadcrumbItem.vue';
import BreadcrumbList from '@/components/ui/breadcrumb/BreadcrumbList.vue';
import BreadcrumbSeparator from '@/components/ui/breadcrumb/BreadcrumbSeparator.vue';
import DocsLink from './DocsLink.vue';

defineProps({
    items: { type: Array, default: () => [] },
});
</script>

<template>
    <Breadcrumb
        v-if="items.length"
        aria-label="Breadcrumb"
        tabindex="0"
        class="min-w-0 [scrollbar-width:thin] [scrollbar-color:var(--color-slate-300)_transparent] overflow-x-auto rounded-sm pb-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:[scrollbar-color:var(--color-slate-700)_transparent]"
        data-search-exclude
    >
        <BreadcrumbList
            class="w-max flex-nowrap text-slate-500 dark:text-slate-400"
        >
            <template v-for="(item, index) in items" :key="item.href">
                <BreadcrumbSeparator v-if="index > 0" />
                <BreadcrumbItem>
                    <span
                        v-if="item.current"
                        aria-current="page"
                        class="font-medium text-slate-700 dark:text-slate-200"
                        >{{ item.label }}</span
                    >
                    <DocsLink
                        v-else
                        :href="item.href"
                        class="rounded-sm hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:hover:text-brand-400"
                        >{{ item.label }}</DocsLink
                    >
                </BreadcrumbItem>
            </template>
        </BreadcrumbList>
    </Breadcrumb>
</template>
