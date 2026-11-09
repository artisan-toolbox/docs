<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import Introduction from '@/components/docs/mosaicast/VuePlugin/Introduction.vue';
import InstallFromTheComposerPackage from '@/components/docs/mosaicast/VuePlugin/InstallFromTheComposerPackage.vue';
import RegisterThePlugin from '@/components/docs/mosaicast/VuePlugin/RegisterThePlugin.vue';
import VerifyBothDeliveryPaths from '@/components/docs/mosaicast/VuePlugin/VerifyBothDeliveryPaths.vue';
import ListenForEvents from '@/components/docs/mosaicast/VuePlugin/ListenForEvents.vue';
import DiagnosticOutput from '@/components/docs/mosaicast/VuePlugin/DiagnosticOutput.vue';
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
            <InstallFromTheComposerPackage :page="page" :navigation="navigation" />
            <RegisterThePlugin :navigation="navigation" />
            <VerifyBothDeliveryPaths :navigation="navigation" />
            <ListenForEvents :navigation="navigation" />
            <DiagnosticOutput :navigation="navigation" />
        </div>
    </article>
</template>
