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
                    Filoquent connects Laravel's filesystem to Eloquent model attributes. Assign an
                    uploaded file, a local path, or a stream to a cast attribute. Saving the model
                    stores the file and its metadata together with an indexed upload ownership
                    record.
                </p>
                <p>
                    Filoquent is in beta. The documented release,
                    <code>1.0.0-beta.2</code>, is available on
                    <DocsLink :href="page.package.releasesUrl">Packagist</DocsLink>. APIs may change
                    before the stable release. The Documented version label shows the Composer
                    version installed in this documentation application.
                </p>
                <p>
                    The published <code>1.0.0-beta.2</code> release includes optional native PHP
                    configuration attributes, typed SQL state enums, environment configuration, and
                    an upload middleware generator. The first file example uses an explicit cast.
                    See the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'filoquent/configuration').href +
                            '#native-attributes'
                        "
                        >native attribute reference</DocsLink
                    >
                    for the optional declaration syntax and compatibility.
                </p>
            </ProseSection>
            <Requirements :items="page.requirements" />
            <ProseSection id="installation" title="Install Filoquent">
                <p>
                    Start with a Laravel 13 application. Run this command from the application root
                    to install the published prerelease:
                </p>
                <InstallCommand :package="page.package" label="Install Filoquent from Packagist" />
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
