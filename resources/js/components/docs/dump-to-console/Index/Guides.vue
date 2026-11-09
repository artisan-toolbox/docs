<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="guides"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Guides
        </h2>
        <p>
            Continue with the
            <DocsLink :href="findNavigationItem(navigation, 'dump-to-console/usage').href"
                >usage and configuration guide</DocsLink
            >
            for listener options, named values, fluent dumps, benchmarks, and configuration.
        </p>
    </ProseSection>
</template>
