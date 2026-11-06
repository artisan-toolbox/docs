<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import Introduction from '@/components/docs/mosaicast/InertiaDelivery/Introduction.vue';
import RequestRequirements from '@/components/docs/mosaicast/InertiaDelivery/RequestRequirements.vue';
import DispatchAnEvent from '@/components/docs/mosaicast/InertiaDelivery/DispatchAnEvent.vue';
import LaravelEventObjects from '@/components/docs/mosaicast/InertiaDelivery/LaravelEventObjects.vue';
import DeliveryBehavior from '@/components/docs/mosaicast/InertiaDelivery/DeliveryBehavior.vue';
import BackgroundJobsAndDeferredWork from '@/components/docs/mosaicast/InertiaDelivery/BackgroundJobsAndDeferredWork.vue';
import InertiaDeliveryDemo from '@/components/demo/mosaicast/inertia-delivery/InertiaDeliveryDemo.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
    mosaicastDemo: { type: Object, required: true },
});
</script>
<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />

        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <Introduction :navigation="navigation" />
            <InertiaDeliveryDemo :configuration="mosaicastDemo" />
            <RequestRequirements :navigation="navigation" />
            <DispatchAnEvent :navigation="navigation" />
            <LaravelEventObjects :navigation="navigation" />
            <DeliveryBehavior :navigation="navigation" />
            <BackgroundJobsAndDeferredWork :navigation="navigation" />
        </div>
    </article>
</template>
