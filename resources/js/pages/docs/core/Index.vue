<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import Introduction from '@/components/docs/core/Index/Introduction.vue';
import Requirements from '@/components/docs/Requirements.vue';
import Installation from '@/components/docs/core/Index/Installation.vue';
import BuildAConditionalPayload from '@/components/docs/core/Index/BuildAConditionalPayload.vue';
import Features from '@/components/docs/core/Index/Features.vue';
import PublishedResources from '@/components/docs/core/Index/PublishedResources.vue';
import Development from '@/components/docs/core/Index/Development.vue';
import SourceAndReleases from '@/components/docs/core/Index/SourceAndReleases.vue';
import DocumentationAndContact from '@/components/docs/core/Index/DocumentationAndContact.vue';
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
                            findNavigationItem(navigation, 'core/installation')
                                .href
                        "
                        >Install Core</DocsLink
                    >
                    for the complete setup and a first working example.
                </p>
            </ProseSection>
            <BuildAConditionalPayload :navigation="navigation" />
            <Features :navigation="navigation" />
            <PublishedResources :navigation="navigation" />
            <Development :navigation="navigation" />
            <SourceAndReleases :navigation="navigation" />
            <DocumentationAndContact :navigation="navigation" />
        </div>
    </article>
</template>
