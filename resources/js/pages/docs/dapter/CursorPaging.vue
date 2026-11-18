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
            <ProseSection id="starting-environment" title="Prepare cursor traversal"
                ><p>
                    Start with a
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/listing').href"
                        >working Laravel and Vue listing</DocsLink
                    >. Use <code>protocol: 2</code> and <code>paging: 'source'</code> on the adapter
                    to request the cursor mode declared by the source. Keep the named dapter.data
                    route, web session, CSRF middleware, and application encryption key. SQLite is
                    required only for the native example. Its separate in-memory database never
                    writes application records.
                </p></ProseSection
            >
            <ProseSection id="identity-and-scope" title="Declare identity and trusted scope"
                ><p>
                    Set PagingMode::Cursor and implement WithCursorScope::cursorScope(): string.
                    Every Collection cursor source also declares a durable ResultIdentity through
                    QueryOptions. The example uses integer id, not array position. Its constant
                    scope is valid because all fictional permissions and predicates are fixed. For
                    protected data, encode the actual server tenant, permission revision, and
                    query-definition revision. Never accept scope from the browser. Dapter
                    separately binds principal, guard, source, normalized criteria, order, and page
                    size.
                </p></ProseSection
            >
            <ProseSection id="expected-result" title="Traverse seven notebooks"
                ><p>
                    Start the Collection example. It returns Notebook 01 and Notebook 02. Next
                    returns the next pair. Previous returns the first pair. Cursor current and pages
                    are null. goToPage and goToLast are null. The tokens are opaque. Reload repeats
                    the current requested token. First clears that token and keeps criteria, order,
                    and page size. A real search, order, or size change resets to the first window.
                    Appending rank ascending demonstrates mixed directions after name descending.
                </p></ProseSection
            >
            <PagingDemo scenario="PagingCursor" />
            <PagingDemo scenario="PagingCursorAttributes" />
            <ProseSection id="native-eligibility" title="Check native eligibility"
                ><p>
                    The native SQLite example applies tenant = 1 before selection. Its non-null
                    primary key supplies durable identity. Full order combines fixed prefixes,
                    requested fields or authored source order, then missing identity ties. Every
                    term needs an extractable non-null output and supported type. Use distinct
                    selected aliases for joins and an explicit unique result identity. Plain
                    selected group keys can be eligible. Aggregate or expression order, unsafe
                    post-query transformations, and opaque presets reject with 422
                    unsupported_operation. The driver can probe null values and identity uniqueness
                    even when exact counts are omitted.
                </p></ProseSection
            >
            <ProseSection id="live-view" title="Treat each window as a live read"
                ><p>
                    A deterministic order does not freeze records between requests. An insertion
                    before the accepted boundary is outside the next window. An insertion after it
                    can appear. A deleted boundary can still be traversed by its values. An empty
                    traversed window retains the requested position and returns no previous or next
                    token. First provides an explicit escape. A sort edit can move a row across the
                    boundary and can produce repeats or omissions. Collection cursor String values
                    compare lexically. Native SQL uses the database collation. No cross-database
                    collation parity, high-water mark, streaming, or cross-request transaction is
                    promised.
                </p></ProseSection
            >

            <PagingDemo scenario="PagingNative" />
            <ProseSection id="next-guide" title="Recover from an expired cursor">
                <p>
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/cursor-recovery').href"
                        >Recover from an expired cursor</DocsLink
                    >
                    for the next example.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
