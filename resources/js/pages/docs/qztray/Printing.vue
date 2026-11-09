<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import PrintingContent from '@/components/docs/qztray/Printing.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection id="before-you-start" title="Before you start">
            <p>
                Complete
                <DocsLink :href="findNavigationItem(navigation, 'qztray/installation').href"
                    >installation</DocsLink
                >
                and
                <DocsLink :href="findNavigationItem(navigation, 'qztray/security').href"
                    >credential and Ziggy configuration</DocsLink
                >. Open an authenticated application page with its session and CSRF cookie, and
                start QZ Tray on the user's computer.
            </p>
        </ProseSection>
        <PrintingContent :navigation="navigation" />
    </article>
</template>
