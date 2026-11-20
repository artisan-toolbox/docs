<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import DeploymentExecution from '@/components/docs/maintainer/deployment/DeploymentExecution.vue';
import DeploymentTasks from '@/components/docs/maintainer/deployment/DeploymentTasks.vue';
import DeploymentIntegration from '@/components/docs/maintainer/deployment/DeploymentIntegration.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection>
            <p>
                Maintainer 1.11.0 includes the <code>deploy:run</code> workflow and server
                maintenance tasks. Starting in Maintainer 1.12.0, type in the interactive selector
                to filter tasks by name.
            </p>
        </ProseSection>
        <DeploymentExecution :navigation="navigation" />
        <DeploymentTasks />
        <DeploymentIntegration :navigation="navigation" />
    </article>
</template>
