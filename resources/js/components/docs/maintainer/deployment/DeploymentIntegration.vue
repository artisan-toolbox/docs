<script setup>
import { findNavigationItem } from '@/lib/docsNavigation';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <div class="flex min-w-0 flex-col gap-10">
        <ProseSection
            id="shared-contribution-recipe"
            title="Shared contribution recipe"
        >
            <p>
                The published recipe imports the absolute contribution path
                provided through
                <code>MAINTAINER_CONTRIB</code>. This keeps project
                configuration local while allowing Maintainer updates to add or
                improve reusable Deployer tasks.
            </p>
            <p>
                A direct <code>vendor/bin/dep</code> invocation must provide
                <code>MAINTAINER_CONTRIB</code> itself and does not receive
                Maintainer's temporary SSH identity lifecycle. Prefer
                <code>vendor/bin/maintainer deploy</code> for the integrated
                flow.
            </p>
        </ProseSection>
        <ProseSection id="ssh-identity" title="SSH identity">
            <p>
                When Maintainer secrets contain an encrypted
                <code>ssh_key</code>, the command decrypts it into a temporary
                identity file immediately before starting Deployer. POSIX files
                use mode <code>0600</code>; only the path is passed to the child
                process, and the file is deleted after success, failure, or a
                process exception.
            </p>
            <p>
                The contribution recipe configures the path as Deployer's global
                <code>identity_file</code> while recipes are imported, before
                any task connects. This applies to deployment hooks, granular
                tasks, <code>--no-hooks</code>, and <code>--start-from</code>. A
                host-level <code>identity_file</code> configured after the
                contribution import may override it.
            </p>
            <p>
                When no generated key exists, Maintainer creates no temporary
                file and leaves SSH agent, SSH config, and Deployer identity
                resolution unchanged.
            </p>
        </ProseSection>
        <ProseSection id="extend-the-deployment" title="Extend the deployment">
            <p>
                The contribution recipe exposes opt-in tasks rather than
                attaching project-specific behavior automatically:
            </p>
            <ul>
                <li>
                    <p>
                        <DocsLink
                            :href="
                                findNavigationItem(
                                    navigation,
                                    'maintainer/deployment/repository-tags',
                                ).href
                            "
                            >Repository tag selection</DocsLink
                        >
                        with <code>repository:tag</code>;
                    </p>
                </li>
                <li>
                    <p>
                        <DocsLink
                            :href="
                                findNavigationItem(
                                    navigation,
                                    'maintainer/deployment/pm2',
                                ).href
                            "
                            >PM2 configuration</DocsLink
                        >
                        with <code>pm2:config</code>.
                    </p>
                </li>
            </ul>
            <p>
                Attach them from the project's <code>deploy.php</code> at the
                points appropriate for that application.
            </p>
        </ProseSection>
    </div>
</template>
