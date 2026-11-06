<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageCard from '@/components/docs/PackageCard.vue';
import PageHeader from '@/components/docs/PageHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    packages: { type: Array, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PageHeader :title="page.title" :description="page.description" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection>
                <p>
                    Choose the package that solves your current task. Composer
                    installs its PHP dependencies for you.
                </p>
            </ProseSection>
            <div data-package-catalog class="grid min-w-0 grid-cols-1 gap-4">
                <PackageCard
                    v-for="item in packages"
                    :key="item.id"
                    :package="item"
                />
            </div>
            <ProseSection>
                <p>
                    Core collects useful, focused helpers that do not need
                    separate packages. Install it directly when you need its
                    public APIs, or let Composer install it as another package's
                    dependency.
                </p>
                <p>
                    Artisan Toolbox packages use Maintainer for their own
                    maintenance, quality checks, and releases. We use and test
                    these workflows in our projects. Maintainer can also be
                    adopted independently for the same tasks. Its inclusion does
                    not make it the implementation of a package's business
                    features. Some production-autoloaded package identity
                    classes implement its versioning and README contracts, so
                    Composer installs Maintainer as a runtime dependency. Keep
                    those declared dependencies available in production.
                </p>
                <p>
                    QZ Tray Connector ships its PHP backend and compiled
                    frontend through Composer. Run Composer before the frontend
                    package manager. Register the frontend with
                    <code>npm install ./vendor/artisan-toolbox/qztray</code>,
                    which records a
                    <code>file:vendor/artisan-toolbox/qztray</code> dependency.
                    Imports use <code>@artisan-toolbox/qztray</code>
                    without an npm registry release. Printing requires QZ Tray
                    on the user's computer and Laravel signing credentials;
                    local previews do not require a QZ Tray installation. See
                    the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'qztray').href +
                            '#quickstart'
                        "
                        >QZ Tray quickstart</DocsLink
                    >
                    for installation and configuration.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
