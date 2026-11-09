<script setup>
import { findNavigationItem } from '@/lib/docsNavigation';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const example1 = 'vendor/bin/maintainer deploy:unlock production';
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection>
            <p>
                The optional deployment retry after unlock is a preview available on the current
                <code>1.x</code> branch after the <code>1.10.0</code> release. It is not included in
                that stable release.
            </p>
        </ProseSection>
        <ProseSection>
            <p>
                A failed deployment can leave <code>.dep/deploy.lock</code> on the remote host.
                Remove it with Deployer's native task:
            </p>
            <CodeExample label="Unlock a Deployment example 1" language="bash" :code="example1" />
            <p>
                The command accepts host selectors and the <code>--file</code>, repeatable
                <code>--option</code>, <code>--limit</code>, <code>--no-hooks</code>,
                <code>--plan</code>, <code>--log</code>, and <code>--profile</code> options. It
                returns Deployer's original exit code.
            </p>
            <p>
                After a successful interactive unlock, Maintainer asks whether to deploy again. The
                default is no. Confirming runs
                <code>deploy</code> with the same recipe, hosts, configuration overrides, host
                limit, hooks setting, log, and profile. A failed retry returns the deployment's exit
                code.
            </p>
            <p>
                Failed unlocks, <code>--plan</code>, and non-interactive invocations do not offer or
                start another deployment. To retry in automation, invoke
                <code>deploy</code> explicitly after checking the unlock result. Deployment tag,
                branch, and revision choices are not recovered from an earlier failed run. Pass
                those choices to a separate <code>deploy</code> invocation when needed.
            </p>
        </ProseSection>
        <ProseSection id="ssh-authentication" title="SSH authentication">
            <p>
                Unlock uses the same
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'maintainer/deployment/deploy').href +
                        '#ssh-identity'
                    "
                    >temporary Maintainer identity</DocsLink
                >
                as a regular deployment. The identity is configured while the contribution recipe is
                imported, so
                <code>deploy:unlock</code> can connect even though it does not execute the main
                <code>deploy</code> task or its hooks.
            </p>
            <p>
                An SSH error such as
                <code>Permission denied (publickey)</code> means the selected identity is not
                authorized for the remote user or a project/host <code>identity_file</code> override
                points elsewhere. Confirm the public key, remote user, host configuration, and file
                ownership before retrying.
            </p>
            <p>
                The same import-time identity behavior applies when Deployer invokes lock
                inspection, rollback, release listing, logs, push, or another granular remote task
                through Maintainer.
            </p>
        </ProseSection>
    </article>
</template>
