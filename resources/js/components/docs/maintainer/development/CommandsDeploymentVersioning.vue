<script setup>
import { findNavigationItem } from '@/lib/docsNavigation';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <div class="flex min-w-0 flex-col gap-10">
        <ProseSection id="deployment" title="Deployment">
            <ul>
                <li>
                    <p>
                        <DocsLink
                            :href="
                                findNavigationItem(navigation, 'maintainer/deployment/deploy').href
                            "
                            ><code>deploy</code></DocsLink
                        >: run the consuming project's Deployer binary.
                    </p>
                </li>
                <li>
                    <p>
                        <DocsLink
                            :href="
                                findNavigationItem(navigation, 'maintainer/deployment/unlock').href
                            "
                            ><code>deploy:unlock</code></DocsLink
                        >: unlock a failed deployment.
                    </p>
                </li>
                <li>
                    <p>
                        <DocsLink
                            :href="
                                findNavigationItem(navigation, 'maintainer/deployment/deploy')
                                    .href + '#run-another-deployer-task'
                            "
                            ><code>deploy:run</code></DocsLink
                        >: select or execute any declared Deployer task, including explicit server
                        maintenance tasks.
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
                            ><code>repository:tag</code></DocsLink
                        >: select a semantic repository tag.
                    </p>
                </li>
                <li>
                    <p>
                        <DocsLink
                            :href="findNavigationItem(navigation, 'maintainer/deployment/pm2').href"
                            ><code>pm2:config</code></DocsLink
                        >: replace PM2 processes by application namespace from an ecosystem file.
                    </p>
                </li>
            </ul>
        </ProseSection>
        <ProseSection id="versioning" title="Versioning">
            <ul>
                <li>
                    <p>
                        <DocsLink
                            :href="
                                findNavigationItem(navigation, 'maintainer/versioning/commits').href
                            "
                            ><code>commit</code></DocsLink
                        >: select files and create a commit.
                    </p>
                </li>
                <li>
                    <p>
                        <DocsLink
                            :href="
                                findNavigationItem(navigation, 'maintainer/versioning/commits')
                                    .href + '#push-existing-commits'
                            "
                            ><code>push</code></DocsLink
                        >: review pending branches and push already-created commits.
                    </p>
                </li>
                <li>
                    <p>
                        <DocsLink
                            :href="
                                findNavigationItem(navigation, 'maintainer/versioning/html-diffs')
                                    .href
                            "
                            ><code>diff:html</code></DocsLink
                        >: render a Git comparison in the browser.
                    </p>
                </li>
                <li>
                    <p>
                        <DocsLink
                            :href="
                                findNavigationItem(navigation, 'maintainer/versioning/releases')
                                    .href
                            "
                            ><code>release:create</code></DocsLink
                        >: prepare and publish a GitHub release.
                    </p>
                </li>
                <li>
                    <p>
                        <DocsLink
                            :href="
                                findNavigationItem(
                                    navigation,
                                    'maintainer/versioning/project-integration',
                                ).href + '#update-the-readme-locally'
                            "
                            ><code>readme:update</code></DocsLink
                        >: regenerate the managed README header.
                    </p>
                </li>
                <li>
                    <p>
                        <DocsLink
                            :href="
                                findNavigationItem(
                                    navigation,
                                    'maintainer/versioning/project-integration',
                                ).href
                            "
                            >Project integration</DocsLink
                        >: configure the version class, hooks, and managed README header.
                    </p>
                </li>
            </ul>
        </ProseSection>
    </div>
</template>
