<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import Introduction from '@/components/docs/mosaicast/Index/Introduction.vue';
import Requirements from '@/components/docs/Requirements.vue';
import Installation from '@/components/docs/mosaicast/Index/Installation.vue';
import FirstEvent from '@/components/docs/mosaicast/Index/FirstEvent.vue';
import DeliverySequence from '@/components/docs/mosaicast/Index/DeliverySequence.vue';
import DetailedGuides from '@/components/docs/mosaicast/Index/DetailedGuides.vue';
import Versioning from '@/components/docs/mosaicast/Index/Versioning.vue';
import SourceAndReleases from '@/components/docs/mosaicast/Index/SourceAndReleases.vue';
import DocumentationAndContact from '@/components/docs/mosaicast/Index/DocumentationAndContact.vue';
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
                    <DocsLink :href="findNavigationItem(navigation, 'mosaicast/installation').href"
                        >Install Mosaicast</DocsLink
                    >
                    for the complete setup and a first working example.
                </p>
            </ProseSection>
            <FirstEvent :navigation="navigation" />
            <DeliverySequence :navigation="navigation" />
            <DetailedGuides :navigation="navigation" />
            <Versioning :navigation="navigation" />
            <SourceAndReleases :navigation="navigation" />
            <DocumentationAndContact :navigation="navigation" />
        </div>
    </article>
</template>
