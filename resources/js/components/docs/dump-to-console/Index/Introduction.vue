<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <p>
            Dump to Console sends Laravel dumps to a local console listener without stopping the
            application or changing its response, stream, download, or command output.
        </p>
        <p>
            Dump to Console 1.1 installs Maintainer as a runtime dependency so its versioning
            contracts remain available after
            <code>composer install --no-dev</code>.
        </p>
    </ProseSection>
</template>
