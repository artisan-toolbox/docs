<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ReferenceDefaults from '@/components/docs/maintainer/configuration/ReferenceDefaults.vue';
import ReferenceEncryptionEnvironment from '@/components/docs/maintainer/configuration/ReferenceEncryptionEnvironment.vue';
import ReferenceSecretsResolution from '@/components/docs/maintainer/configuration/ReferenceSecretsResolution.vue';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>
<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ReferenceDefaults :navigation="navigation" />
        <ReferenceEncryptionEnvironment />
        <ReferenceSecretsResolution />
    </article>
</template>
