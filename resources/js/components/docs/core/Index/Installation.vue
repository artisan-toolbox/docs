<script setup>
import InstallCommand from '@/components/docs/InstallCommand.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <ProseSection>
        <h2
            id="installation"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Installation
        </h2>
        <InstallCommand
            label="Installation example 1"
            language="bash"
            :package="page.package"
            command="composer" />
        <p>Laravel discovers Core's service provider and registers the Sift macros.</p>
    </ProseSection>
</template>
