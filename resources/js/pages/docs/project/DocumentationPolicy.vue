<script setup>
import PageHeader from '@/components/docs/PageHeader.vue';
import Introduction from '@/components/docs/community/ProjectDocumentationPolicy/Introduction.vue';
import PackageRepositories from '@/components/docs/community/ProjectDocumentationPolicy/PackageRepositories.vue';
import FrontendInstallation from '@/components/docs/community/ProjectDocumentationPolicy/FrontendInstallation.vue';
import Language from '@/components/docs/community/ProjectDocumentationPolicy/Language.vue';
import LearningJourneys from '@/components/docs/community/ProjectDocumentationPolicy/LearningJourneys.vue';
import PackageSkills from '@/components/docs/community/ProjectDocumentationPolicy/PackageSkills.vue';
import KeepingDocumentationCurrent from '@/components/docs/community/ProjectDocumentationPolicy/KeepingDocumentationCurrent.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PageHeader :title="page.title" :description="page.description" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <Introduction :navigation="navigation" />
            <PackageRepositories :navigation="navigation" />
            <FrontendInstallation :navigation="navigation" />
            <LearningJourneys :navigation="navigation" />
            <PackageSkills :navigation="navigation" />
            <Language :navigation="navigation" />
            <KeepingDocumentationCurrent :navigation="navigation" />
        </div>
    </article>
</template>
