<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <p>
            The Mosaicast Vue plugin delivers Inertia prop events and private broadcasts through the
            same <code>mosaicast().on()</code> API. The callback receives the event payload and its
            source (<code>"inertia"</code> or <code>"broadcast"</code>). Diagnostics are disabled by
            default.
        </p>
    </ProseSection>
</template>
