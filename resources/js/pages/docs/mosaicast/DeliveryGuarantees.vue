<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import Introduction from '@/components/docs/mosaicast/DeliveryGuarantees/Introduction.vue';
import ImplementedContract from '@/components/docs/mosaicast/DeliveryGuarantees/ImplementedContract.vue';
import DeliveryLimits from '@/components/docs/mosaicast/DeliveryGuarantees/DeliveryLimits.vue';
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
            <ImplementedContract :navigation="navigation" />
            <DeliveryLimits :navigation="navigation" />
        </div>
    </article>
</template>
