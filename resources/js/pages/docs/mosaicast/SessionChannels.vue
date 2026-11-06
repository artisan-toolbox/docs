<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import Introduction from '@/components/docs/mosaicast/SessionChannels/Introduction.vue';
import EnableBroadcastingInTheHostApplication from '@/components/docs/mosaicast/SessionChannels/EnableBroadcastingInTheHostApplication.vue';
import ChannelIdentity from '@/components/docs/mosaicast/SessionChannels/ChannelIdentity.vue';
import AuthorizationRequirements from '@/components/docs/mosaicast/SessionChannels/AuthorizationRequirements.vue';
import Configuration from '@/components/docs/mosaicast/SessionChannels/Configuration.vue';
import SessionLifecycle from '@/components/docs/mosaicast/SessionChannels/SessionLifecycle.vue';
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
            <EnableBroadcastingInTheHostApplication :navigation="navigation" />
            <ChannelIdentity :navigation="navigation" />
            <AuthorizationRequirements :navigation="navigation" />
            <Configuration :navigation="navigation" />
            <SessionLifecycle :navigation="navigation" />
        </div>
    </article>
</template>
