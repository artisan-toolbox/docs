<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import WebAwesomeContent from '@/components/docs/front-awesome/WebAwesomeContent.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection>
            <p>
                Browse the
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'front-awesome/web-awesome/components').href
                    "
                    >Vue components catalog</DocsLink
                >
                for available wrappers, basic examples, and planned Web Awesome components. Complete
                the setup below before using the examples.
            </p>
        </ProseSection>
        <WebAwesomeContent :navigation="navigation" />
    </article>
</template>
