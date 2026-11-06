<script setup>
import { findNavigationItem } from '@/lib/docsNavigation';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = 'vendor/bin/maintainer deploy';
const example2 =
    "vendor/bin/maintainer deploy production --tag=v1.2.3\nvendor/bin/maintainer deploy 'stage=production&role=web' --branch=1.x --limit=2\nvendor/bin/maintainer deploy production --option=keep_releases=3 --plan";
</script>

<template>
    <div class="flex min-w-0 flex-col gap-10">
        <ProseSection id="requirements" title="Requirements">
            <p>
                Install Maintainer or Deployer as a Composer development
                dependency in the consuming project, then publish
                <code>deploy.php</code> through
                <DocsLink
                    :href="
                        findNavigationItem(
                            navigation,
                            'maintainer/configuration/publishing',
                        ).href
                    "
                    >Configuration Publishing</DocsLink
                >.
            </p>
            <p>
                The project recipe owns its repository, hosts, deployment path,
                shared files, and hooks. It imports the package-managed
                contribution recipe through the
                <code>MAINTAINER_CONTRIB</code> path supplied by Maintainer.
            </p>
        </ProseSection>
        <ProseSection id="run-the-deployment" title="Run the deployment">
            <CodeExample
                label="Run a Deployment example 1"
                language="bash"
                :code="example1"
            />
            <p>Pass host selectors and options using Deployer's conventions:</p>
            <CodeExample
                label="Run a Deployment example 2"
                language="bash"
                :code="example2"
            />
            <p>
                Maintainer resolves the consuming project's
                <code>vendor/bin/dep</code>, runs it from the project root, and
                returns Deployer's original exit code. Interactive executions
                retain terminal access for Deployer prompts; non-interactive
                executions stream standard output and error.
            </p>
            <p>
                Supported pass-through options are <code>--file</code>,
                <code>--tag</code>, <code>--revision</code>,
                <code>--branch</code>, repeatable <code>--option</code>,
                <code>--limit</code>, <code>--no-hooks</code>,
                <code>--plan</code>, <code>--start-from</code>,
                <code>--log</code>, and <code>--profile</code>.
            </p>
        </ProseSection>
    </div>
</template>
