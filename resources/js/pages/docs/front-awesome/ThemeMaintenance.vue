<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ThemeMaintenanceOwnership from '@/components/docs/front-awesome/ThemeMaintenanceOwnership.vue';
import ThemeMaintenanceCompatibility from '@/components/docs/front-awesome/ThemeMaintenanceCompatibility.vue';
import ThemeMaintenanceValidation from '@/components/docs/front-awesome/ThemeMaintenanceValidation.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ThemeMaintenanceOwnership :navigation="navigation" />
        <ThemeMaintenanceCompatibility :navigation="navigation" />
        <ThemeMaintenanceValidation :navigation="navigation" />
    </article>
</template>
