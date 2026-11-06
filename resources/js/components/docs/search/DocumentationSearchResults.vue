<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import SiteIcon from '@/components/site/SiteIcon.vue';

defineProps({ results: { type: Array, required: true } });
defineEmits(['select']);
</script>

<template>
    <ul
        aria-label="Search results"
        class="min-h-0 overflow-y-auto overscroll-contain px-3 pb-3"
    >
        <li v-for="result in results" :key="result.id">
            <DocsLink
                :href="result.href"
                class="group my-1 flex min-h-11 gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-brand-200 hover:bg-brand-50 focus-visible:bg-brand-50 focus-visible:outline-2 focus-visible:outline-brand-600 dark:hover:border-brand-800 dark:hover:bg-brand-950/40 dark:focus-visible:bg-brand-950/40"
                @click="$emit('select')"
            >
                <span class="min-w-0 flex-1">
                    <span
                        v-if="result.packageTitle"
                        class="mb-1 block text-xs font-medium text-brand-700 dark:text-brand-400"
                        >{{ result.packageTitle }}</span
                    >
                    <span
                        class="block text-sm font-semibold text-slate-900 dark:text-slate-100"
                        >{{ result.pageTitle
                        }}<span
                            v-if="result.sectionTitle"
                            class="font-normal text-slate-500 dark:text-slate-400"
                        >
                            · {{ result.sectionTitle }}</span
                        ></span
                    >
                    <span
                        class="mt-1 line-clamp-3 block text-sm leading-relaxed break-words text-slate-600 dark:text-slate-400"
                        >{{ result.excerpt }}</span
                    >
                </span>
                <SiteIcon
                    name="arrow-up-right"
                    class="mt-1 shrink-0 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400"
                />
            </DocsLink>
        </li>
    </ul>
</template>
