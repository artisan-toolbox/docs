<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import DevelopmentPaths from '@/components/docs/maintainer/development/DevelopmentPaths.vue';
import LocalDevelopment from '@/components/docs/maintainer/development/LocalDevelopment.vue';
import BuildingMaintainer from '@/components/docs/maintainer/development/BuildingMaintainer.vue';
import ContributionConventions from '@/components/docs/maintainer/development/ContributionConventions.vue';
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
                The grouped Deployer tests, standard-input preservation and Windows input
                inheritance, isolated APT test environment, and Symfony 8.1.11 security updates
                described here are previews available on the current
                <code>1.x</code> branch after the <code>1.10.0</code> release. They are not included
                in that stable release.
            </p>
        </ProseSection>
        <DevelopmentPaths />
        <LocalDevelopment />
        <BuildingMaintainer />
        <ContributionConventions />
    </article>
</template>
