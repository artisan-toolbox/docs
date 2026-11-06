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
        class="flex min-w-0 flex-col gap-5 text-base leading-7 text-slate-600 dark:text-slate-300 [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-slate-100 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.85em] [&_:not(pre)>code]:break-words [&_:not(pre)>code]:text-slate-800 dark:[&_:not(pre)>code]:bg-slate-800 dark:[&_:not(pre)>code]:text-slate-200 [&_a]:rounded-sm [&_a]:font-medium [&_a]:text-brand-700 [&_a]:underline [&_a]:decoration-brand-700/30 [&_a]:underline-offset-4 [&_a]:hover:decoration-brand-700 [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-4 [&_a]:focus-visible:outline-brand-600 dark:[&_a]:text-brand-400 [&_li]:pl-1 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-3 [&_ul]:pl-5"
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
