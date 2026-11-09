<script setup>
import { computed } from 'vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const props = defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const qualityHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/ci/quality').href,
);
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />

        <ProseSection>
            <p>
                The Code Quality group separates commands that modify files from checks intended for
                continuous integration. Open
                <strong>Code Quality</strong> from the interactive menu, choose
                <strong>Fix</strong> or <strong>CI Check</strong>, and then select from the commands
                configured for that workflow.
            </p>
            <ul>
                <li>
                    <DocsLink :href="qualityHref">Fixes and CI checks</DocsLink>: install,
                    configure, select, and run the supported tools.
                </li>
            </ul>
            <p>
                Maintainer always runs the consuming project's binaries, configuration files, and
                package scripts. Dependencies bundled inside the Maintainer PHAR are isolated and
                are never used to analyze or modify the consuming project.
            </p>
        </ProseSection>

        <ProseSection id="run-a-workflow" title="Run a workflow">
            <p>Run the configured CI checks:</p>
            <CodeExample label="Run CI checks" code="vendor/bin/maintainer quality:check" />
            <p>Run the configured fixes:</p>
            <CodeExample label="Run automated fixes" code="vendor/bin/maintainer quality:fix" />
            <p>
                The
                <DocsLink :href="qualityHref">Fixes and CI checks guide</DocsLink>
                covers tool requirements, configuration, selection, and workflow behavior.
            </p>
        </ProseSection>
    </article>
</template>
