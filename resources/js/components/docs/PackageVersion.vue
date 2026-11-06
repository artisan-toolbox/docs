<script setup>
import { computed } from 'vue';

const props = defineProps({
    package: { type: Object, required: true },
    showLabel: { type: Boolean, default: true },
});

const version = computed(
    () =>
        props.package.installedVersion ??
        (props.package.installationStatus === 'version-unavailable'
            ? 'Version unavailable'
            : 'Not installed'),
);
</script>

<template>
    <span>
        {{ showLabel ? `Documented version ${version}` : version }}
    </span>
</template>
