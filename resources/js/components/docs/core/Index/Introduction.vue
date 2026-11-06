<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <p>
            Core collects useful, focused Laravel helpers that do not need a
            separate package of their own. Use it for conditional arrays,
            translated model attributes, and cross-domain Inertia visits.
            Applications can install Core directly or receive it through another
            Artisan Toolbox package.
        </p>
        <p>
            Core 1.1 added Sift. Core 1.2 installs Maintainer as a runtime
            dependency because Core's production-autoloaded identity class
            implements its versioning and README contracts. Maintainer supports
            the package's maintenance, quality, and release workflows. It is not
            the implementation of Core's application helpers.
        </p>
    </ProseSection>
</template>
