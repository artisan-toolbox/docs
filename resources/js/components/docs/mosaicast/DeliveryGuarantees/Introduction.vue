<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <p>
            Mosaicast 1.x provides an event-delivery contract through its PHP facade, Inertia shared
            props, private session channel, explicit job target, and Vue listener plugin. The
            <DocsLink :href="findNavigationItem(navigation, 'mosaicast/inertia-delivery').href"
                >Inertia delivery</DocsLink
            >,
            <DocsLink :href="findNavigationItem(navigation, 'mosaicast/session-channels').href"
                >session channel</DocsLink
            >, and
            <DocsLink :href="findNavigationItem(navigation, 'mosaicast/vue-plugin').href"
                >Vue plugin</DocsLink
            >
            guides describe each part of that contract.
        </p>
    </ProseSection>
</template>
