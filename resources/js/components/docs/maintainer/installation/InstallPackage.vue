<script setup>
import InstallCommand from '@/components/docs/InstallCommand.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ page: { type: Object, required: true } });
</script>

<template>
    <ProseSection id="installation" title="Installation">
        <p>Install Maintainer as a development dependency:</p>
        <InstallCommand
            label="Install Maintainer"
            :package="page.package"
            command="composer"
        />
        <p>
            The PHAR bundles Maintainer's CLI dependencies and keeps them
            separate from the project being maintained.
        </p>
    </ProseSection>
</template>
