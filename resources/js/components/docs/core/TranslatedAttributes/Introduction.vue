<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <p>
            <code>Translated</code> keeps a stable string such as
            <code>plans.starter</code> in the database and returns its
            translation whenever Eloquent reads the attribute. This is useful
            for labels that belong to application language files rather than
            user-authored content.
        </p>
    </ProseSection>
</template>
