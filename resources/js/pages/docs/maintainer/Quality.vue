<script setup>
import DocsTable from '@/components/docs/DocsTable.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import QualityConfiguration from '@/components/docs/maintainer/quality/QualityConfiguration.vue';
import QualityRequirements from '@/components/docs/maintainer/quality/QualityRequirements.vue';
import QualityWorkflows from '@/components/docs/maintainer/quality/QualityWorkflows.vue';

defineProps({
    page: { type: Object, required: true },
});

const workflowColumns = ['Workflow', 'Behavior', 'Default tools'];
const workflowRows = [
    ['quality:fix', 'Applies changes', 'Rector, Pint, and vp check --fix'],
    [
        'quality:check',
        'Runs checks',
        'Pest, Pint in test mode, vp check, vp test, vue-tsc --noEmit, and PHPStan',
    ],
];
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />

        <ProseSection>
            <p>Maintainer exposes two code-quality workflows:</p>
            <DocsTable
                caption="Maintainer quality workflows"
                :columns="workflowColumns"
                :rows="workflowRows"
            >
                <template #cell="{ value, columnIndex }">
                    <code v-if="columnIndex === 0">{{ value }}</code>
                    <template v-else>{{ value }}</template>
                </template>
            </DocsTable>
            <p>
                Each workflow reads an ordered list of public command contracts
                from the Maintainer configuration. All configured commands are
                selected by default in the interactive multi-select. A
                non-interactive invocation runs the complete configured list.
            </p>
        </ProseSection>

        <QualityRequirements />
        <QualityWorkflows />
        <QualityConfiguration />
    </article>
</template>
