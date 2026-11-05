<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import PackageSpecs from '@/components/docs/PackageSpecs.vue';
import PageHeader from '@/components/docs/PageHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import Requirements from '@/components/docs/Requirements.vue';

defineProps({
    page: { type: Object, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PageHeader
            :title="page.title"
            :description="page.description"
            :artwork="page.package.artwork"
            eyebrow="Package documentation"
        >
            <PackageSpecs :package="page.package" />
        </PageHeader>

        <ProseSection>
            <p>
                Maintainer provides a single entry point for repetitive package
                and application maintenance tasks, including validation,
                commits, versioning, changelogs, deployments, and GitHub
                releases.
            </p>
            <p>
                This guide covers Maintainer 1.10. If your version class still
                uses
                <code>WithReadmeBadgeVersion</code>, follow the
                <a
                    href="https://artisantoolbox.wsssoftware.com.br/packages/maintainer/versioning/project-integration/#migrate-an-existing-version-badge"
                    >README badge migration</a
                >.
            </p>
        </ProseSection>

        <Requirements :items="page.requirements" />

        <ProseSection id="installation" title="Installation">
            <p>Install Maintainer as a development dependency:</p>
            <CodeExample
                label="Install Maintainer"
                code="composer require --dev artisan-toolbox/maintainer:^1.10"
            />
            <p>
                The PHAR bundles Maintainer's CLI dependencies and keeps them
                separate from the project being maintained.
            </p>
        </ProseSection>

        <ProseSection id="open-the-menu" title="Open the menu">
            <p>Open its interactive menu:</p>
            <CodeExample
                label="Open the interactive menu"
                code="vendor/bin/maintainer"
            />
            <p>
                The menu groups commands by workflow. Run
                <code>vendor/bin/maintainer list</code> to see the available
                command names.
            </p>
            <p>Initialize project configuration:</p>
            <CodeExample
                label="Publish configuration"
                code="vendor/bin/maintainer config:publish"
            />
        </ProseSection>

        <ProseSection id="common-workflows" title="Common workflows">
            <p>
                Maintainer's documentation follows the same groups as its
                interactive menu:
            </p>
            <ul>
                <li>
                    <a
                        href="https://artisantoolbox.wsssoftware.com.br/packages/maintainer/ci/"
                        >Code Quality</a
                    >: apply automated fixes and run PHP and frontend checks as
                    configurable workflows.
                </li>
                <li>
                    <a
                        href="https://artisantoolbox.wsssoftware.com.br/packages/maintainer/configuration/"
                        >Configuration</a
                    >: publish templates and manage settings, secrets, and SSH
                    keys.
                </li>
                <li>
                    <a
                        href="https://artisantoolbox.wsssoftware.com.br/packages/maintainer/deployment/"
                        >Deployment</a
                    >: run and unlock Deployer or attach shared repository and
                    PM2 tasks.
                </li>
                <li>
                    <a
                        href="https://artisantoolbox.wsssoftware.com.br/packages/maintainer/versioning/"
                        >Versioning</a
                    >: review diffs, create commits, and publish GitHub
                    releases.
                </li>
            </ul>
            <p>
                Open a feature page for its requirements, configuration,
                examples, interactive behavior, automation behavior, and failure
                conditions.
            </p>
        </ProseSection>

        <ProseSection id="learn-more" title="Learn more">
            <ul>
                <li>
                    <a
                        href="https://artisantoolbox.wsssoftware.com.br/packages/maintainer/commands/"
                        >Command index</a
                    >
                </li>
                <li>
                    <a
                        href="https://artisantoolbox.wsssoftware.com.br/packages/maintainer/versioning/project-integration/"
                        >Project integration</a
                    >
                </li>
                <li>
                    <a
                        href="https://artisantoolbox.wsssoftware.com.br/packages/maintainer/development/"
                        >Development and building</a
                    >
                </li>
            </ul>
        </ProseSection>

        <ProseSection id="source-and-releases" title="Source and releases">
            <ul>
                <li><a :href="page.package.repositoryUrl">Source code</a></li>
                <li>
                    <a :href="page.package.releasesUrl">Packagist releases</a>
                </li>
            </ul>
        </ProseSection>
    </article>
</template>
