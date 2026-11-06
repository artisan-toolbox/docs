<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import Requirements from '@/components/docs/Requirements.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import InstallPackage from './InstallPackage.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const verify = `vendor/bin/maintainer list`;
const menu = `vendor/bin/maintainer`;
</script>

<template>
    <div data-document-content class="flex min-w-0 flex-col gap-10">
        <ProseSection>
            <p>
                Install Maintainer and inspect its commands before selecting a
                project workflow. The first check lists commands without
                creating a release or deploying an application.
            </p>
        </ProseSection>
        <Requirements :items="page.requirements">
            <p>
                Start in an existing Composer project root. Git is needed for
                repository workflows. GitHub CLI is needed for workflows that
                interact with GitHub.
            </p>
        </Requirements>
        <InstallPackage :page="page" />
        <ProseSection id="verify-the-cli" title="Verify the CLI">
            <p>Run the command list from the same project root:</p>
            <CodeExample
                label="Verify the installed Maintainer CLI"
                language="bash"
                :code="verify"
            />
            <p>
                The output lists the available commands, including
                <code>config:publish</code>. Maintainer has no browser package
                to install.
            </p>
            <p>To browse the same workflows interactively, open the menu:</p>
            <CodeExample
                label="Browse Maintainer workflows"
                language="bash"
                :code="menu"
            />
        </ProseSection>
        <ProseSection
            id="configure-your-project"
            title="Configure your project"
        >
            <p>
                Continue with
                <DocsLink
                    :href="
                        findNavigationItem(
                            navigation,
                            'maintainer/configuration/publishing',
                        ).href
                    "
                    >configuration publishing</DocsLink
                >
                before selecting validation tools. Publishing is interactive and
                asks before replacing existing files. Review optional secret and
                SSH identity choices rather than accepting them as installation
                prerequisites.
            </p>
            <p>
                For versioning and generated README metadata, keep the
                integration class in production <code>autoload.psr-4</code> or
                <code>autoload.classmap</code>, even when maintenance runs only
                during development. Maintainer does not discover classes from
                <code>autoload-dev</code>.
            </p>
            <p>
                If production code loads a class implementing Maintainer
                contracts, install Maintainer as a regular dependency so those
                interfaces remain available after
                <code>composer install --no-dev</code>. See
                <DocsLink
                    :href="
                        findNavigationItem(
                            navigation,
                            'maintainer/versioning/project-integration',
                        ).href
                    "
                    >project integration</DocsLink
                >
                before adding that class.
            </p>
        </ProseSection>
        <ProseSection id="next-steps" title="Next steps">
            <p>
                After configuration, use
                <DocsLink
                    :href="findNavigationItem(navigation, 'maintainer/ci').href"
                    >Code Quality</DocsLink
                >
                for your first project checks. Keep the
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'maintainer/commands')
                            .href
                    "
                    >command index</DocsLink
                >
                available for lookup.
            </p>
        </ProseSection>
    </div>
</template>
