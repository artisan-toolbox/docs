<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ListeningForDumps from '@/components/docs/dump-to-console/Usage/ListeningForDumps.vue';
import DumpingValues from '@/components/docs/dump-to-console/Usage/DumpingValues.vue';
import FluentDumps from '@/components/docs/dump-to-console/Usage/FluentDumps.vue';
import Benchmarks from '@/components/docs/dump-to-console/Usage/Benchmarks.vue';
import Configuration from '@/components/docs/dump-to-console/Usage/Configuration.vue';
import Security from '@/components/docs/dump-to-console/Usage/Security.vue';
import HowItWorks from '@/components/docs/dump-to-console/Usage/HowItWorks.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>
<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />

        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ListeningForDumps :navigation="navigation" />
            <DumpingValues :navigation="navigation" />
            <FluentDumps :navigation="navigation" />
            <Benchmarks :navigation="navigation" />
            <Configuration :navigation="navigation" />
            <Security :navigation="navigation" />
            <HowItWorks :navigation="navigation" />
        </div>
    </article>
</template>
