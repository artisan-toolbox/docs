<script setup>
import VueControlsDemo from '@/components/demo/dapter/vue/VueControlsDemo.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
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
            <ProseSection id="starting-environment" title="Share a listing between views">
                <p>
                    Use a Laravel and Inertia application with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Dapter installed</DocsLink
                    >. The Dapter 1.0.0-beta.2 adapter reads a public four-record Collection with
                    explicit protocol 2. Its table and card grid share one adapter. Each view
                    displays the same accepted rows after you change a control.
                </p>
                <p>
                    For one control, start with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/field-search').href"
                        >search by name</DocsLink
                    >,
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/field-filters').href"
                        >filter by category</DocsLink
                    >, or
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/field-order').href"
                        >sort by name</DocsLink
                    >. View source below includes the complete Laravel source and the Front Awesome
                    controls.
                </p>
            </ProseSection>
            <ProseSection id="field-controls" title="Call only declared capabilities"
                ><p>
                    Wait for the first authorized response before using <code>catalog.fields</code>.
                    A field can be absent after permission narrowing. Check the field and operation
                    before rendering a control. Each search, order, and named filter exposes
                    <code>available</code>, <code>current</code>,
                    <code>call(input, options?)</code>, and <code>clear(options?)</code>.
                </p>
                <p>
                    Search accepts <code>{ value: 'Notebook', matchType: 'contains' }</code>. Order
                    accepts
                    <code>{ direction: 'desc', sortType: 'natural', multiSort: false }</code>. A
                    scalar filter accepts <code>{ value: false }</code>, <code>{ value: 0 }</code>,
                    or <code>{ value: null }</code> when declared. Selected null is a value. Use
                    <code>clear()</code> to remove the selection. String zero and numeric zero
                    remain distinct. An empty search clears only that search.
                </p>
                <p>
                    Criteria return to page 1 by default. Pass
                    <code>{ page: 'preserve' }</code> only with the delivered exact-count offset
                    mode when retaining the current position is useful. Calls patch the latest
                    requested state, retain unrelated criteria and page size, and make no request
                    for an identical or inactive operation.
                </p></ProseSection
            >
            <ProseSection id="try-controls" title="Operate one table and grid"
                ><p>
                    Select Start controls. Both views display Notebook 10 and Notebook 2 using one
                    initial request. Select Next catalog page, then Name descending, keep page to
                    retain page 2 and display Notebook 10 and Notebook 2 in natural descending
                    order. Clear order returns to page 1. Type Pencil to display the two tool
                    records. Select Inactive false and then Score zero to leave Pencil case.
                    Selected null preserves the row while recording an explicit null selection.
                    Restore server defaults returns to two unfiltered rows. Reset controls disposes
                    the owner and cancels pending work.
                </p></ProseSection
            >
            <VueControlsDemo />
            <ProseSection id="search-lifecycle" title="Combine the latest search with other actions"
                ><p>
                    <code>searchDebounce</code> is a nonnegative integer in milliseconds, defaulting
                    to 0. This example uses 250 ms. Search intent changes immediately. Selecting a
                    filter, order, page, or reload before the timer expires includes that latest
                    search and flushes the pending work. A superseded action resolves with status
                    <code>superseded</code>. Only the winning generation publishes rows, accepted
                    state, errors, metadata, and post-render scroll.
                </p>
                <p>
                    Validation and recoverable transport failures retain the last authorized rows.
                    Access and protocol failures clear protected rows and metadata. Disposing the
                    owner or changing its source invalidates saved operation closures. Retry with
                    <code>paging.reload()</code> after resolving the failure.
                </p></ProseSection
            >

            <ProseSection id="replace-reset" title="Replace all criteria or request defaults"
                ><p>
                    <code>replaceState(snapshot)</code> validates the entire version 2 requested
                    state and its declared capabilities before changing any intent. Omitted
                    selections clear earlier criteria. The supplied paging position is retained and
                    bounded by the server. Invalid snapshots make no request and leave the existing
                    intent unchanged.
                </p>
                <p>
                    Replace with paper snapshot clears all previous selections, chooses paper, and
                    requests page 1 with size 4. The table and grid both display Notebook 10 and
                    Notebook 2. <code>resetState()</code> sends a source-only version 2 read to
                    request server defaults. It differs from <code>paging.reload()</code>, which
                    retains current requested criteria.
                </p>
                <p>
                    Continue with the global-search and multi-order guides for composed protocol 2
                    controls. The actions guide uses the same handle for native writes with either
                    read version. Sources without these declarations retain fixed All grouping, one
                    field order, and null global operations. To add source-owned traversal, follow
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/cursor-paging').href"
                        >cursor pagination</DocsLink
                    >. For polling or broadcasts, follow
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/live-updates').href"
                        >refresh data</DocsLink
                    >.
                </p></ProseSection
            >
        </div>
    </article>
</template>
