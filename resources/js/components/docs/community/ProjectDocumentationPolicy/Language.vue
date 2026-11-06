<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="language"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Language
        </h2>
        <p>
            Community-facing documentation is written in clear, inclusive
            English. Additional translations may be introduced later without
            changing the English source documentation.
        </p>
    </ProseSection>
</template>
