<script setup>
import DemoAction from '@/components/demo/DemoAction.vue';
</script>

<template>
    <div class="min-w-0">
        <p class="text-sm font-medium text-slate-700 dark:text-slate-300">
            Live preview with this documentation site's branding
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
