<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import PageHeader from '@/components/docs/PageHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PageHeader :title="page.title" :description="page.description" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="documentation" title="Documentation">
                <p>
                    Artisan Toolbox keeps complete package documentation in one
                    repository. Package READMEs provide a concise introduction
                    and link to the guides for each tool.
                </p>
                <p>
                    Read the
                    <DocsLink
                        :href="
                            findNavigationItem(
                                navigation,
                                'project/documentation-policy',
                            ).href
                        "
                        >documentation policy</DocsLink
                    >
                    for content ownership, contributor requirements, frontend
                    installation conventions, and the Laravel migration
                    workflow.
                </p>
            </ProseSection>
            <ProseSection id="releases" title="Releases">
                <p>
                    The documentation application and its packages have
                    independent release histories. The
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'project/versioning')
                                .href
                        "
                        >versioning guide</DocsLink
                    >
                    explains application identity, README metadata, package
                    generations, development previews, and public URL
                    continuity.
                </p>
                <p>
                    Start with
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'getting-started')
                                .href
                        "
                        >Getting Started</DocsLink
                    >
                    to install a package, or browse the
                    <DocsLink :href="findNavigationItem(navigation, '').href"
                        >package catalog</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
