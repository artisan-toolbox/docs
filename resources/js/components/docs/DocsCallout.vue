<script setup>
import SiteIcon from '@/components/site/SiteIcon.vue';

const variants = {
    info: {
        title: 'Information',
        icon: 'circle-info',
        style: 'border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40',
    },
    note: {
        title: 'Note',
        icon: 'note-sticky',
        style: 'border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60',
    },
    tip: {
        title: 'Tip',
        icon: 'lightbulb',
        style: 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40',
    },
    caution: {
        title: 'Caution',
        icon: 'triangle-exclamation',
        style: 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40',
    },
    danger: {
        title: 'Danger',
        icon: 'circle-exclamation',
        style: 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/40',
    },
};

defineProps({
    variant: {
        type: String,
        default: 'note',
        validator: (value) =>
            ['info', 'note', 'tip', 'caution', 'danger'].includes(value),
    },
});
</script>

<template>
    <aside
        :aria-label="variants[variant].title"
        class="flex flex-col gap-3 rounded-xl border-l-4 p-5 text-slate-700 dark:text-slate-200"
        :class="variants[variant].style"
    >
        <p
            class="flex items-center gap-2.5 font-semibold text-slate-950 dark:text-white"
        >
            <SiteIcon :name="variants[variant].icon" class="opacity-75" />
            <slot name="title">{{ variants[variant].title }}</slot>
        </p>
        <slot />
    </aside>
</template>
