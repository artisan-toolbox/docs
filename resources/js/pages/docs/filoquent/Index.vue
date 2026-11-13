<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import Requirements from '@/components/docs/Requirements.vue';
import InstallCommand from '@/components/docs/InstallCommand.vue';
import FileExample from '@/components/docs/filoquent/FileExample.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection>
                <p>
                    Filoquent is an early preview for connecting Laravel's filesystem to Eloquent
                    model attributes. Assign an uploaded file, a local path, or a stream to a cast
                    attribute. Saving the model stores the file and its metadata together with an
                    indexed upload ownership record.
                </p>
                <p>
                    The source version is <code>0.1.0-alpha.1</code> on the development branch
                    <code>1.x</code>. It is not a stable release. The file API described here is
                    unpublished development source. The shared Documented version label reports the
                    documentation application's installed Composer version, or Not installed when
                    the package is absent.
                </p>
            </ProseSection>
            <Requirements :items="page.requirements" />
            <ProseSection id="installation" title="Install the preview">
                <p>
                    Start with a Laravel 13 application and a reviewed Filoquent source checkout at
                    <code>packages/filoquent</code> inside that application. Run from the
                    application root. Keep the nested checkout out of the application's Git history.
                </p>
                <InstallCommand
                    :package="page.package"
                    command="preview"
                    label="Install the Filoquent source preview" />
                <p>
                    Follow
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/installation').href"
                        >Install Filoquent</DocsLink
                    >
                    for prerequisites, automatic discovery, and optional Boost setup. No filename
                    configuration is required for the first example.
                </p>
            </ProseSection>
            <FileExample />
            <ProseSection id="guides" title="Next steps">
                <p>
                    Continue with
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/files').href"
                        >file attributes and variants</DocsLink
                    >. Read the
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/configuration').href"
                        >configuration reference</DocsLink
                    >
                    for naming and storage options. Use
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/health').href"
                        >file health checks</DocsLink
                    >
                    to audit referenced files without modifying them. See
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/storage').href"
                        >storage lifecycle and recovery</DocsLink
                    >
                    for transaction guarantees and bounded cleanup. See
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/development').href"
                        >Develop Filoquent</DocsLink
                    >
                    for contributor checks, skills, and version metadata.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
