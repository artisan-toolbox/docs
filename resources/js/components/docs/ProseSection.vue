<script setup>
defineProps({
    id: { type: String, default: undefined },
    title: { type: String, default: undefined },
});
</script>

<template>
    <component
        :is="title ? 'section' : 'div'"
        :aria-labelledby="title ? id : undefined"
        class="flex min-w-0 flex-col gap-5 text-base leading-7 text-slate-600 dark:text-slate-300 [&_a]:rounded-sm [&_a]:font-medium [&_a]:text-teal-700 [&_a]:underline [&_a]:decoration-teal-700/30 [&_a]:underline-offset-4 [&_a]:hover:decoration-teal-700 [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-4 [&_a]:focus-visible:outline-teal-600 dark:[&_a]:text-teal-400 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:break-words [&_code]:text-slate-800 dark:[&_code]:bg-slate-800 dark:[&_code]:text-slate-200 [&_li]:pl-1 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-3 [&_ul]:pl-5"
    >
        <h2
            v-if="title"
            :id="id"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            {{ title }}
        </h2>
        <slot />
    </component>
</template>
