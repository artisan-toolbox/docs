<script setup>
import { computed } from 'vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import catalog from './components.json';

const props = defineProps({ navigation: { type: Array, required: true } });
const groups = computed(() =>
    findNavigationItem(props.navigation, 'front-awesome/web-awesome/components').children.map(
        (item) => {
            const group = catalog.groups.find(
                (group) => item.slug === `front-awesome/web-awesome/components/${group.id}`,
            );
            return {
                ...group,
                href: item.href,
                counts: Object.entries(catalog.statuses)
                    .map(
                        ([state, status]) =>
                            `${group.components.filter((component) => component.implementation.state === state).length} ${status.countLabel}`,
                    )
                    .join(' · '),
            };
        },
    ),
);
</script>

<template>
    <div role="list" class="grid gap-4 sm:grid-cols-2" aria-label="Web Awesome component groups">
        <div
            role="listitem"
            v-for="group in groups"
            :key="group.id"
            class="flex min-w-0 flex-col rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <DocsLink
                :href="group.href"
                class="flex min-h-11 items-center rounded text-sm leading-5 font-semibold text-brand-700 underline decoration-brand-400 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-brand-400"
                >{{ group.title }}</DocsLink
            >
            <p class="text-xs leading-5 text-slate-600 dark:text-slate-300">
                {{ group.help }}
            </p>
            <p class="mt-auto pt-2 text-[10px] leading-4 text-slate-500 dark:text-slate-400">
                {{ group.counts }}
            </p>
        </div>
    </div>
</template>
