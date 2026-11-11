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
const example1 = 'vendor/bin/maintainer config:publish';
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection>
            <p>
                Maintainer 1.11.0 includes the task selector, server maintenance tasks, optional
                deployment retry after unlock, and namespace-isolated PM2 replacement. Search in the
                <code>deploy:run</code> task selector is a source preview on the current
                <code>1.x</code> branch after 1.11.0.
            </p>
        </ProseSection>
        <ProseSection>
            <p>
                The Deployment group delegates to the consuming project's
                <code>vendor/bin/dep</code> while Maintainer manages the shared task recipe and
                temporary SSH identity lifecycle.
            </p>
            <ul>
                <li>
                    <p>
                        <DocsLink
                            :href="
                                findNavigationItem(navigation, 'maintainer/deployment/deploy').href
                            "
                            >Run a deployment</DocsLink
                        >: configure <code>deploy.php</code>, select hosts, and forward Deployer
                        options.
                    </p>
                </li>
                <li>
                    <p>
                        <DocsLink
                            :href="
                                findNavigationItem(navigation, 'maintainer/deployment/deploy')
                                    .href + '#run-another-deployer-task'
                            "
                            >Run another task</DocsLink
                        >: select a declared task or run server maintenance explicitly.
                    </p>
                </li>
                <li>
                    <p>
                        <DocsLink
                            :href="
                                findNavigationItem(navigation, 'maintainer/deployment/unlock').href
                            "
                            >Unlock a deployment</DocsLink
                        >: remove a lock left by a failed deployment and optionally deploy again.
                    </p>
                </li>
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
                        >: choose recent semantic tags interactively.
                    </p>
                </li>
                <li>
                    <p>
                        <DocsLink
                            :href="findNavigationItem(navigation, 'maintainer/deployment/pm2').href"
                            >PM2 configuration</DocsLink
                        >: replace the application's PM2 processes by namespace and persist each
                        change.
                    </p>
                </li>
            </ul>
            <p>Publish <code>deploy.php</code> before the first deployment:</p>
            <CodeExample label="Deployment example 1" language="bash" :code="example1" />
        </ProseSection>
    </article>
</template>
