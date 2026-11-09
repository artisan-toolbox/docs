<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <p>
            Mosaicast sends events to a selected browser session through private broadcasting,
            independently of the normal HTTP response. A worker can notify that session after the
            original request has finished. In an Inertia request, Mosaicast can instead include the
            event in the response. Both paths use one event contract and the same Vue listener API.
        </p>
        <p>
            This guide covers Mosaicast 1.2. When upgrading from 1.1, review the
            <DocsLink href="#dispatcher-class">dispatcher, frontend, and session changes</DocsLink>.
        </p>
    </ProseSection>
</template>
