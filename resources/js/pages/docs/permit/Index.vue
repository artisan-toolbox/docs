<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import InstallCommand from '@/components/docs/InstallCommand.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import FirstGate from '@/components/docs/permit/FirstGate.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import Requirements from '@/components/docs/Requirements.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="preview" title="Authorize actions with Permit">
                <p>
                    Permit registers application permission and role declarations as Laravel Gates.
                    Assign access to users on the server, protect routes with middleware, and use
                    the optional Vue helpers to reflect access in your interface.
                </p>
                <p>
                    Permit is available as a beta on
                    <a href="https://packagist.org/packages/artisan-toolbox/permit">Packagist</a>.
                    APIs may change before the stable release.
                </p>
            </ProseSection>
            <Requirements :items="page.requirements" />
            <ProseSection id="installation" title="Install the beta">
                <p>Run this command from your Laravel application root.</p>
                <InstallCommand :package="page.package" label="Install Permit with Composer" />
                <p>
                    Follow
                    <DocsLink :href="findNavigationItem(navigation, 'permit/installation').href"
                        >Install Permit</DocsLink
                    >
                    for prerequisites and optional frontend installation.
                </p>
            </ProseSection>
            <FirstGate />
            <ProseSection id="next-steps" title="Next steps">
                <ul>
                    <li>
                        <DocsLink :href="findNavigationItem(navigation, 'permit/declarations').href"
                            >Declare permissions and roles</DocsLink
                        >
                    </li>
                    <li>
                        <DocsLink
                            :href="findNavigationItem(navigation, 'permit/authorization').href"
                            >Protect application actions</DocsLink
                        >
                    </li>
                    <li>
                        <DocsLink :href="findNavigationItem(navigation, 'permit/management').href"
                            >Manage user permissions</DocsLink
                        >
                    </li>
                    <li>
                        <DocsLink
                            :href="
                                findNavigationItem(navigation, 'permit/management').href +
                                '#try-the-editor'
                            "
                            >Try the permission editor</DocsLink
                        >
                    </li>
                    <li>
                        <DocsLink :href="findNavigationItem(navigation, 'permit/operations').href"
                            >Look up Artisan commands and assignment migrations</DocsLink
                        >
                    </li>
                </ul>
            </ProseSection>
        </div>
    </article>
</template>
