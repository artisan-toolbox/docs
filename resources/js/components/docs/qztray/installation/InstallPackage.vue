<script setup>
import InstallCommand from '@/components/docs/InstallCommand.vue';
const props = defineProps({ package: { type: Object, required: true } });
</script>

<template>
    <InstallCommand
        :package="props.package"
        command="setup"
        label="Install QZ Tray Connector"
    />
</template>
