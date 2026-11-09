<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="frontend-installation-guides"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Frontend installation guides
        </h2>
        <p>
            Document how to install Artisan Toolbox JavaScript packages from their
            Composer-installed directories using
            <code>file:vendor/artisan-toolbox/&lt;package&gt;</code>
            dependencies. Run Composer before the frontend package manager. Explain whether the
            application builds the source or imports an existing build.
        </p>
    </ProseSection>
</template>
