<script setup>
import { computed } from 'vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';

const props = defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const htmlDiffsHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/versioning/html-diffs').href,
);
const integrationHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/versioning/project-integration').href,
);
const commitsHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/versioning/commits').href,
);
const pushHref = computed(
    () =>
        findNavigationItem(props.navigation, 'maintainer/versioning/commits').href +
        '#push-existing-commits',
);
const releasesHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/versioning/releases').href,
);
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection>
            <p>
                The Versioning group turns a reviewed working tree into commits and releases while
                keeping Git as the source of truth.
            </p>
            <ul>
                <li>
                    <DocsLink :href="commitsHref">Create commits</DocsLink>: select files and write
                    or generate Conventional Commit messages.
                </li>
                <li>
                    <DocsLink :href="pushHref">Push existing commits</DocsLink>: review pending
                    branches and send their commits to origin.
                </li>
                <li>
                    <DocsLink :href="htmlDiffsHref">HTML Git diffs</DocsLink>: review working-tree
                    or reference comparisons in a browser.
                </li>
                <li>
                    <DocsLink :href="releasesHref">Create releases</DocsLink>: select a semantic
                    version, generate release content, push, and publish through GitHub CLI.
                </li>
                <li>
                    <DocsLink :href="integrationHref">Project integration</DocsLink>: expose the
                    version class, lifecycle hooks, and managed README header.
                </li>
            </ul>
            <p>
                Every mutating workflow starts from the consuming Composer project's root, even when
                Maintainer is invoked from a subdirectory.
            </p>
            <p>
                The pending-push workflow is a preview available on the current
                <code>1.x</code> branch after the <code>1.10.0</code> release. It is not included in
                that stable release.
            </p>
        </ProseSection>
    </article>
</template>
