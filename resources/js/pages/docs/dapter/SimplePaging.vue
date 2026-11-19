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
            <ProseSection id="starting-environment" title="Prepare simple pagination"
                ><p>
                    Complete Install Dapter and Read and paginate a source in your Laravel 13, PHP
                    8.5, Inertia 3, and Vue application. Run backend commands at the application
                    root before npm. Keep the web session, CSRF middleware, and Ziggy dapter.data
                    route. These controls are available in Dapter 1.0.0-beta.2. No account, worker,
                    or broadcaster is required.
                </p></ProseSection
            >
            <ProseSection id="declare-simple" title="Declare simple pagination"
                ><p>
                    Call <code>StoreOptions::pagingMode()</code> with
                    <code>PagingMode::Simple</code> or use the equivalent
                    <code>Paging</code> attribute. Keep a bounded <code>pageSize</code> and allowed
                    <code>pageSizeOptions</code>. Use protocol 2 with paging: source in the Vue
                    creator. The source selects the mode. Existing creators keep their offset types
                    and reject an advanced source unless they opt in.
                </p></ProseSection
            >
            <ProseSection id="expected-result" title="Read seven notebooks"
                ><p>
                    Start the fluent example. Notebook 01 and Notebook 02 appear. Next returns
                    Notebook 03 and Notebook 04. Previous returns the first pair. Simple current is
                    an ordinal. pages, total, and filtered are null by default. goToPage and
                    goToLast are null. A distant empty ordinal remains unchanged. Previous means the
                    preceding ordinal and does not promise rows.
                </p>
                <p>
                    Eloquent pages return rows in a sequential list, including when the model's
                    collection uses string keys. Collection keys do not become record identifiers.
                </p></ProseSection
            >
            <PagingDemo scenario="PagingSimple" />
            <PagingDemo scenario="PagingSimpleAttributes" />
            <ProseSection id="costs" title="Understand bounded lookahead"
                ><p>
                    The native driver reads size plus one rows to determine has_next. It does not
                    run an exact aggregate count by default. Schema, null, and identity eligibility
                    probes can still run. Collection sources materialize, filter, and sort their
                    input. Simple traversal does not provide a snapshot or a performance guarantee.
                </p></ProseSection
            >
            <ProseSection id="extension" title="Register a traversal driver"
                ><p>
                    The docs_paging registration creates NotebookDriver through the public
                    DriverRegistry. Its DriverCapabilities advertises simple: true. Existing
                    constructor calls omit the optional comparisons policy and retain their literal
                    behavior. Built-in drivers provide their own admitted comparison policy. A
                    cursor extension also advertises cursor: true and its TraversalStoreDriver
                    implementation delegates bounded traversal to the public CollectionStoreDriver.
                    Both the interface and matching capability are required. Existing StoreDriver
                    implementations remain offset-only without changes. This application
                    service-provider registration is demo integration, not a built-in alias.
                </p></ProseSection
            >

            <PagingDemo scenario="PagingDriver" />
            <ProseSection id="next-guide" title="Traverse a list with a cursor">
                <p>
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/cursor-paging').href"
                        >Traverse a list with a cursor</DocsLink
                    >
                    for the next example.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
