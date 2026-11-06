<script setup>
import CommandsQualityConfiguration from '@/components/docs/maintainer/development/CommandsQualityConfiguration.vue';
import CommandsDeploymentVersioning from '@/components/docs/maintainer/development/CommandsDeploymentVersioning.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const example1 = 'vendor/bin/maintainer';
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection>
            <p>
                The <code>push</code> and <code>deploy:run</code> workflows,
                optional deployment retry after unlock, server maintenance
                tasks, and namespace-isolated PM2 replacement are previews
                available on the current <code>1.x</code> branch after the
                <code>1.10.0</code> release. They are not included in that
                stable release.
            </p>
        </ProseSection>
        <ProseSection>
            <p>
                Maintainer commands are documented with their setup and
                configuration under the same four groups shown in the
                interactive menu.
            </p>
        </ProseSection>
        <CommandsQualityConfiguration :navigation="navigation" />
        <CommandsDeploymentVersioning :navigation="navigation" />
        <ProseSection id="interactive-menu" title="Interactive menu">
            <p>Open the grouped menu with:</p>
            <CodeExample
                label="Commands and Workflows example 1"
                language="bash"
                :code="example1"
            />
            <p>
                Press <code>Ctrl+C</code> inside a submenu to return to
                <strong>Main Menu</strong>. Choose <strong>Exit</strong> from
                the main menu to close Maintainer. Compatible terminals are
                cleared before the banner and breadcrumb are redrawn;
                unsupported terminals continue without clearing.
            </p>
            <p>
                The menu requires interactive input. Invoke the individual
                commands directly in automation and continuous integration.
            </p>
        </ProseSection>
    </article>
</template>
