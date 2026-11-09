<script setup>
import DemoAction from '@/components/demo/DemoAction.vue';
</script>

<template>
    <div
        class="w-full max-w-full min-w-48 resize-x overflow-auto rounded-xl border border-slate-200 p-5 dark:border-slate-800">
        <p class="text-sm font-medium text-slate-700 dark:text-slate-300">
            Live preview with this documentation site's branding
        </p>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Drag the lower-right corner to resize this preview.
        </p>
        <div
            role="group"
            aria-label="Shared branding preview"
            class="mt-4 flex flex-wrap items-center gap-4 font-sans">
            <span class="rounded-md bg-brand-700 px-4 py-2 text-white"> Tailwind </span>
            <DemoAction>Web Awesome</DemoAction>
        </div>
    </div>
</template>
