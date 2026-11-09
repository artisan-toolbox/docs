<script setup>
import { computed } from 'vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';

const props = defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const referenceHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/configuration/reference').href,
);
const publishingHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/configuration/publishing').href,
);
const sshKeysHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/configuration/ssh-keys').href,
);
const publishCommand = String.raw`vendor/bin/maintainer config:publish`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection>
            <p>
                The Configuration group owns the files and credentials used by every Maintainer
                workflow. Open
                <strong>Configuration</strong> from the interactive menu or use its commands
                directly.
            </p>
            <ul>
                <li>
                    <DocsLink :href="referenceHref">Configuration reference</DocsLink>: defaults,
                    project overrides, environment variables, encryption, secrets, and legacy
                    migration.
                </li>
                <li>
                    <DocsLink :href="publishingHref">Publish configuration</DocsLink>: selectively
                    create Maintainer, quality, and deployment templates.
                </li>
                <li>
                    <DocsLink :href="sshKeysHref">SSH keys</DocsLink>: generate, inspect, and
                    consume the encrypted Maintainer identity.
                </li>
            </ul>
            <p>Start by publishing the files needed by your project:</p>
            <CodeExample label="Publish configuration" language="bash" :code="publishCommand" />
        </ProseSection>
    </article>
</template>
