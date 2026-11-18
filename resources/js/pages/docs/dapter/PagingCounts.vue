<script setup>
import PagingDemo from '@/components/demo/dapter/paging/PagingDemo.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>
<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Prepare optional counts"
                ><p>
                    Start with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/simple-paging').href"
                        >simple pagination</DocsLink
                    >
                    or
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/cursor-paging').href"
                        >cursor pagination</DocsLink
                    >. Use protocol 2 and paging: source with the unpublished 1.x preview. The four
                    examples each read the same seven fictional notebooks. They expose a server
                    count policy through fluent options, attributes, captured configuration, or an
                    explicit override.
                </p></ProseSection
            >
            <ProseSection id="declare-policy" title="Choose an explicit policy"
                ><p>
                    StoreOptions::exactCounts() and ExactCounts enable exact counts. Pass false to
                    disable them. dapter.paging.exact_counts defaults to false. StoreOptions::make()
                    captures configuration when created. Fluent declarations override attributes and
                    captured defaults. makeWithoutDefaults() omits configuration defaults and needs
                    explicit guard, access, mode, and sizes. The fourth example uses
                    exactCounts(false) to override the ExactCounts attribute. Offset always retains
                    exact counts.
                </p></ProseSection
            >
            <ProseSection id="expected-result" title="Compare the count examples"
                ><p>
                    Start each example. All return Notebook 01 and Notebook 02. The first three
                    expose counts exact with total 7 and filtered 7. The explicit false example
                    exposes counts unknown with null total and filtered. Simple pages remain null.
                    Cursor current and pages remain null. Numbered and last actions remain null in
                    both modes. Enabling counts does not grant page preservation.
                </p></ProseSection
            >
            <PagingDemo scenario="PagingCounts" />
            <PagingDemo scenario="PagingCountsAttributes" />
            <PagingDemo scenario="PagingCountsConfig" />
            <PagingDemo scenario="PagingCountsOff" />
            <ProseSection id="count-cost" title="Account for count queries"
                ><p>
                    Exact counts use the guarded authorized base and selected queries before cursor
                    bounds. An unfiltered read can reuse the base total. Filtering can require a
                    second aggregate. QueryOptions::counts selects guarded count builders and does
                    not enable the policy. Counts and rows can observe different live moments. Do
                    not infer advanced row lengths from total or filtered. The frontend exposes a
                    counts discriminant so unknown values remain null rather than invented zeroes.
                </p></ProseSection
            >

            <ProseSection id="next-guide" title="Search the list by name">
                <p>
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/field-search').href"
                        >Search the list by name</DocsLink
                    >
                    for the next example.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
