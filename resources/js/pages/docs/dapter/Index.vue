<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import Requirements from '@/components/docs/Requirements.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import InstallCommand from '@/components/docs/InstallCommand.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const identity = `use ArtisanToolbox\\Dapter\\Dapter;

dump(Dapter::VERSION); // "1.0.0-alpha.1"`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="preview" title="Preview scope">
                <p>
                    Dapter is the foundation for a Laravel and Inertia data adapter. This unreleased
                    preview provides package identity, a typed frontend entry, and development
                    tools. Filtering, searching, sorting, and pagination APIs are not implemented
                    yet.
                </p>
                <p>
                    The source is developed on <code>1.x</code>. A local checkout is not a published
                    stable release. The shared version label reports whether this documentation
                    application has the package installed.
                </p>
            </ProseSection>
            <Requirements :items="page.requirements" />
            <ProseSection id="installation" title="Install a local preview">
                <p>
                    Start in an existing compatible Laravel application, with a Dapter checkout
                    beside it. Run these commands from the application root:
                </p>
                <InstallCommand
                    :package="page.package"
                    command="local-preview"
                    label="Install the local backend preview" />
                <p>
                    Follow
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install the Dapter preview</DocsLink
                    >
                    to connect the frontend after Composer completes.
                </p>
            </ProseSection>
            <ProseSection id="first-example" title="Check the package identity">
                <p>After installation, evaluate this PHP expression in your Laravel application:</p>
                <CodeExample language="php" label="Read the package version" :code="identity" />
                <p>The dump displays <code>1.0.0-alpha.1</code>. No configuration is required.</p>
            </ProseSection>
            <ProseSection id="next-steps" title="Next steps">
                <p>
                    Read
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/development').href"
                        >Develop Dapter</DocsLink
                    >
                    for the test matrix, TypeScript contracts, distribution checks, and artwork
                    workflow.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
