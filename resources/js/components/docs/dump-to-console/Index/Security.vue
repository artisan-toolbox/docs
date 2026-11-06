<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="security"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Security
        </h2>
        <p>
            The dump protocol has no authentication or encryption. Keep the
            listener bound to a trusted local interface and handle dumped values
            with the same care as local logs.
        </p>
    </ProseSection>
</template>
