<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <p>
            This repository is the source of truth for complete, user-facing
            Artisan Toolbox documentation.
        </p>
    </ProseSection>
</template>
