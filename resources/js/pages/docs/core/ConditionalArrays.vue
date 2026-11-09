<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import Introduction from '@/components/docs/core/ConditionalArrays/Introduction.vue';
import APIAtAGlance from '@/components/docs/core/ConditionalArrays/APIAtAGlance.vue';
import BuildAConditionalArray from '@/components/docs/core/ConditionalArrays/BuildAConditionalArray.vue';
import SiftNestedIterables from '@/components/docs/core/ConditionalArrays/SiftNestedIterables.vue';
import PreserveCollectionBehavior from '@/components/docs/core/ConditionalArrays/PreserveCollectionBehavior.vue';
import PracticalLimits from '@/components/docs/core/ConditionalArrays/PracticalLimits.vue';
import ConditionalArraysDemo from '@/components/demo/core/conditional-arrays/ConditionalArraysDemo.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
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
            <APIAtAGlance :navigation="navigation" />
            <BuildAConditionalArray :navigation="navigation" />
            <section class="flex min-w-0 flex-col gap-5">
                <ProseSection id="try-conditional-arrays" title="Try conditional arrays">
                    <p>
                        Run the example with the fixed fictional profile Alex Example. Your click
                        sends two options to this Laravel application, which executes Core's
                        <code>sift_when()</code> and <code>Arr::sift()</code>. Changing an option or
                        resetting the demo sends no request.
                    </p>
                    <p>
                        First run with both options off. The nested contact is omitted without
                        evaluating its closure, while
                        <code>false</code>, <code>null</code>, <code>0</code>, and the empty string
                        remain. Removing the middle item preserves numeric keys <code>0</code> and
                        <code>2</code>, so JSON represents those items as an object. Include the
                        middle item to see a JSON array instead.
                    </p>
                </ProseSection>
                <ConditionalArraysDemo />
            </section>
            <SiftNestedIterables :navigation="navigation" />
            <PreserveCollectionBehavior :navigation="navigation" />
            <PracticalLimits :navigation="navigation" />
        </div>
    </article>
</template>
