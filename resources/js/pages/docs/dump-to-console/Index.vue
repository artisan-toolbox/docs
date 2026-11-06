<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import Introduction from '@/components/docs/dump-to-console/Index/Introduction.vue';
import Requirements from '@/components/docs/Requirements.vue';
import Installation from '@/components/docs/dump-to-console/Index/Installation.vue';
import SendYourFirstDump from '@/components/docs/dump-to-console/Index/SendYourFirstDump.vue';
import Guides from '@/components/docs/dump-to-console/Index/Guides.vue';
import Security from '@/components/docs/dump-to-console/Index/Security.vue';
import Development from '@/components/docs/dump-to-console/Index/Development.vue';
import SourceAndReleases from '@/components/docs/dump-to-console/Index/SourceAndReleases.vue';
import DocumentationAndContact from '@/components/docs/dump-to-console/Index/DocumentationAndContact.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>
<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <Introduction :navigation="navigation" />
            <Requirements :items="page.requirements" />
            <Installation :page="page" :navigation="navigation" />
            <ProseSection>
                <p>
                    Follow
                    <DocsLink
                        :href="
                            findNavigationItem(
                                navigation,
                                'dump-to-console/installation',
                            ).href
                        "
                        >Install Dump to Console</DocsLink
                    >
                    for the complete setup and a first working example.
                </p>
            </ProseSection>
            <SendYourFirstDump :navigation="navigation" />
            <Guides :navigation="navigation" />
            <Security :navigation="navigation" />
            <Development :navigation="navigation" />
            <SourceAndReleases :navigation="navigation" />
            <DocumentationAndContact :navigation="navigation" />
        </div>
    </article>
</template>
