<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ReleasePreparation from '@/components/docs/maintainer/versioning/ReleasePreparation.vue';
import ReleaseWorkflow from '@/components/docs/maintainer/versioning/ReleaseWorkflow.vue';
import ReleaseSafety from '@/components/docs/maintainer/versioning/ReleaseSafety.vue';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const example1 = 'vendor/bin/maintainer release:create';
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection>
            <p>Create a release for the consuming project:</p>
            <CodeExample
                label="Create a release"
                language="bash"
                :code="example1"
            />
        </ProseSection>
        <ReleasePreparation :navigation="navigation" />
        <ReleaseWorkflow />
        <ReleaseSafety />
    </article>
</template>
