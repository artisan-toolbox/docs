<script setup>
import { computed } from 'vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import CodeExample from '@/components/docs/CodeExample.vue';
import InstallPackage from '@/components/docs/maintainer/installation/InstallPackage.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageSpecs from '@/components/docs/PackageSpecs.vue';
import PageHeader from '@/components/docs/PageHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import Requirements from '@/components/docs/Requirements.vue';
const props = defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const codeQualityHref = computed(() => findNavigationItem(props.navigation, 'maintainer/ci').href);
const configurationHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/configuration').href,
);
const versioningHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/versioning').href,
);
const integrationHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/versioning/project-integration').href,
);
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PageHeader
            :title="page.title"
            :description="page.description"
            :artwork="page.package.artwork"
            eyebrow="Package documentation">
            <PackageSpecs :package="page.package" />
        </PageHeader>

        <ProseSection>
            <p>
                Maintainer provides a single entry point for repetitive package and application
                maintenance tasks, including validation, commits, versioning, changelogs,
                deployments, and GitHub releases.
            </p>
            <p>
                This guide covers Maintainer 1.10. If your version class still uses
                <code>WithReadmeBadgeVersion</code>, follow the
                <DocsLink :href="`${integrationHref}#migrate-an-existing-version-badge`"
                    >README badge migration</DocsLink
                >.
            </p>
        </ProseSection>

        <Requirements :items="page.requirements" />

        <InstallPackage :page="page" />
        <ProseSection>
            <p>
                Follow
                <DocsLink :href="findNavigationItem(navigation, 'maintainer/installation').href"
                    >Install Maintainer</DocsLink
                >
                to verify the CLI and choose your first configuration steps.
            </p>
        </ProseSection>

        <ProseSection id="open-the-menu" title="Open the menu">
            <p>Open its interactive menu:</p>
            <CodeExample label="Open the interactive menu" code="vendor/bin/maintainer" />
            <p>
                The menu groups commands by workflow. Run
                <code>vendor/bin/maintainer list</code> to see the available command names.
            </p>
            <p>Initialize project configuration:</p>
            <CodeExample
                label="Publish configuration"
                code="vendor/bin/maintainer config:publish" />
        </ProseSection>

        <ProseSection id="common-workflows" title="Common workflows">
            <p>Maintainer's documentation follows the same groups as its interactive menu:</p>
            <ul>
                <li>
                    <DocsLink :href="codeQualityHref">Code Quality</DocsLink>: apply automated fixes
                    and run PHP and frontend checks as configurable workflows.
                </li>
                <li>
                    <DocsLink :href="configurationHref">Configuration</DocsLink>: publish templates
                    and manage settings, secrets, and SSH keys.
                </li>
                <li>
                    <DocsLink href="https://atb.dev.br/packages/maintainer/deployment/"
                        >Deployment</DocsLink
                    >: run declared Deployer tasks, retry after unlock, and manage PM2 processes by
                    application namespace.
                </li>
                <li>
                    <DocsLink :href="versioningHref">Versioning</DocsLink>: review diffs, create
                    commits, push pending branches, and publish GitHub releases.
                </li>
            </ul>
            <p>
                Open a feature page for its requirements, configuration, examples, interactive
                behavior, automation behavior, and failure conditions.
            </p>
        </ProseSection>

        <ProseSection id="learn-more" title="Learn more">
            <ul>
                <li>
                    <DocsLink href="https://atb.dev.br/packages/maintainer/commands/"
                        >Command index</DocsLink
                    >
                </li>
                <li>
                    <DocsLink :href="integrationHref">Project integration</DocsLink>
                </li>
                <li>
                    <DocsLink href="https://atb.dev.br/packages/maintainer/development/"
                        >Development and building</DocsLink
                    >
                </li>
            </ul>
        </ProseSection>

        <ProseSection id="source-and-releases" title="Source and releases">
            <ul>
                <li>
                    <DocsLink :href="page.package.repositoryUrl">Source code</DocsLink>
                </li>
                <li>
                    <DocsLink :href="page.package.releasesUrl">Packagist releases</DocsLink>
                </li>
            </ul>
        </ProseSection>
    </article>
</template>
