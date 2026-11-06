<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import Introduction from '@/components/docs/core/TranslatedAttributes/Introduction.vue';
import DefineTheTranslations from '@/components/docs/core/TranslatedAttributes/DefineTheTranslations.vue';
import ApplyTheCast from '@/components/docs/core/TranslatedAttributes/ApplyTheCast.vue';
import StorageAndMissingTranslations from '@/components/docs/core/TranslatedAttributes/StorageAndMissingTranslations.vue';
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
            <DefineTheTranslations :navigation="navigation" />
            <ApplyTheCast :navigation="navigation" />
            <StorageAndMissingTranslations :navigation="navigation" />
        </div>
    </article>
</template>
