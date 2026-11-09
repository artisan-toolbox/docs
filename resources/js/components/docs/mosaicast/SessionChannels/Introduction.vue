<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <p>
            Mosaicast registers a private broadcast channel for each Laravel session. The channel is
            available to guests as well as signed-in users; authorization checks the current Laravel
            session, including for visitors who have never signed in.
        </p>
    </ProseSection>
</template>
