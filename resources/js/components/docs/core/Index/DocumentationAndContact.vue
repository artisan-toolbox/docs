<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="documentation-and-contact"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Documentation and contact
        </h2>
        <p>
            The canonical documentation is available at
            <DocsLink :href="findNavigationItem(navigation, 'core').href">atb.dev.br</DocsLink>.
            Contact the project at
            <DocsLink href="mailto:contact@atb.dev.br">contact@atb.dev.br</DocsLink>.
        </p>
    </ProseSection>
</template>
