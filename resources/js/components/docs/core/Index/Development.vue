<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="development"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Development
        </h2>
        <p>
            On Windows, Core's CI requires PHPStan 2.2.8 or later in the 2.x series. This version
            fixes a Turbo parser bug that can drop PHPDoc comments during static analysis.
        </p>
    </ProseSection>
</template>
