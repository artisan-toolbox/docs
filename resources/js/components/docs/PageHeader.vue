<script setup>
defineProps({
    title: { type: String, required: true },
    description: { type: String, required: true },
    eyebrow: { type: String, default: 'Documentation' },
    artwork: { type: Object, default: null },
});
</script>

<template>
    <header class="flex flex-col gap-5 border-b border-slate-200 pb-9 dark:border-slate-800">
        <slot name="eyebrow">
            <p
                class="text-xs font-semibold tracking-[0.16em] text-brand-700 uppercase dark:text-brand-400">
                {{ eyebrow }}
            </p>
        </slot>
        <h1
            class="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
            <template v-if="artwork">
                <span class="sr-only">{{ title }}</span>
                <img
                    :src="artwork.light"
                    alt=""
                    class="h-14 w-auto max-w-full object-contain object-left sm:h-16 dark:hidden" />
                <img
                    :src="artwork.dark"
                    alt=""
                    class="hidden h-14 w-auto max-w-full object-contain object-left sm:h-16 dark:block" />
            </template>
            <template v-else>{{ title }}</template>
        </h1>
        <p class="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {{ description }}
        </p>
        <slot />
    </header>
</template>
