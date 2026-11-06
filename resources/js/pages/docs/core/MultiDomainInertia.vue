<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import Introduction from '@/components/docs/core/MultiDomainInertia/Introduction.vue';
import PublishTheCORSConfiguration from '@/components/docs/core/MultiDomainInertia/PublishTheCORSConfiguration.vue';
import AllowTrustedApplicationOrigins from '@/components/docs/core/MultiDomainInertia/AllowTrustedApplicationOrigins.vue';
import PrependTheMiddleware from '@/components/docs/core/MultiDomainInertia/PrependTheMiddleware.vue';
import ForwardNginxPreflightRequestsWhenNeeded from '@/components/docs/core/MultiDomainInertia/ForwardNginxPreflightRequestsWhenNeeded.vue';
import VerifyTheIntegration from '@/components/docs/core/MultiDomainInertia/VerifyTheIntegration.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>
<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />

        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <Introduction :navigation="navigation" />
            <PublishTheCORSConfiguration :navigation="navigation" />
            <AllowTrustedApplicationOrigins :navigation="navigation" />
            <PrependTheMiddleware :navigation="navigation" />
            <ForwardNginxPreflightRequestsWhenNeeded :navigation="navigation" />
            <VerifyTheIntegration :navigation="navigation" />
        </div>
    </article>
</template>
