<script setup>
import ProseSection from './ProseSection.vue';

defineProps({
    items: { type: Array, required: true },
    id: { type: String, default: 'requirements' },
    title: { type: String, default: 'Requirements' },
});
</script>

<template>
    <ProseSection :id="id" :title="title">
        <slot />
        <ul>
            <li v-for="item in items" :key="item">{{ item }}</li>
        </ul>
    </ProseSection>
</template>
