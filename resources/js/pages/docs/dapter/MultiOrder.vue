<script setup>
import ComposedDemo from '@/components/demo/dapter/composed/ComposedDemo.vue';

import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
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
            <ProseSection id="starting-environment" title="Order by two fields">
                <p>
                    Start with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/field-order').href"
                        >a declared field order</DocsLink
                    >
                    on a protocol 2 source. This catalog declares
                    <code>multiOrder(true, max: 2)</code>. Its four records have rank, quantity, and
                    name.
                </p>
            </ProseSection>
            <ProseSection id="priority" title="Append or update without eviction"
                ><p>
                    An ordinary field-order call replaces the requested list. multiSort true appends
                    a new field or updates an existing field in place. The server and client reject
                    a third field without evicting an existing term. Clearing a field preserves
                    other terms. current.priority starts at 1. A page policy can preserve the
                    current page. The example orders quantity descending, then name ascending in
                    natural order. Send the request to see IDs 2, 1, 4, and 3.
                </p></ProseSection
            >
            <ComposedDemo scenario="MultiOrder" />
            <ComposedDemo scenario="MultiLimit" />
            <ProseSection id="stability" title="Declare fixed prefix and unique ties"
                ><p>
                    QueryOptions accepts fixedOrder and an optional ResultIdentity. A FixedOrderTerm
                    references an orderable public field. The server applies fixed terms before user
                    terms and unique identity terms after them. IdentityColumn separates a trusted
                    target from its literal output key and declared scalar type. Complete identities
                    must be non-null and unique across the result. Raw rows and unidentified record
                    metadata remain unchanged. This is deterministic listing order, not a live
                    record channel.
                </p>
                <p>
                    Declaring result identity alone preserves the source's default order. A fixed
                    prefix precedes that fallback. Native SQL adds missing identity ties after the
                    source order; Collection rows retain their original relative order where no
                    earlier term distinguishes them. An explicit field order or preset replaces the
                    source fallback.
                </p></ProseSection
            >
            <ProseSection id="presets" title="Use a complete opaque preset"
                ><p>
                    globalOrderable advertises an id and label. Its trusted handler owns the
                    complete order. The client sends only the id, with no direction, sort type, or
                    additive override. Presets and field order are exclusive. Additive calls fail
                    while a preset is active. Accepted preset state is opaque and does not invent
                    SQL terms. URL restoration stores read intent only.
                </p>
                <p>
                    A preset can reorder the complete filtered result but cannot remove, duplicate,
                    restore, or replace its rows. Native SQL presets start with only the declared
                    fixed prefix. The handler must retain that prefix first and include each
                    declared result-identity target, or the qualified model key when no explicit
                    identity is declared. Existing source fallback orders are removed before the
                    callback. Dapter rejects membership or identity violations before listing SQL;
                    it never appends or rearranges the returned preset order.
                </p>
                <p>
                    Collection presets retain the exact filtered row multiset and original row
                    objects, including duplicate multiplicity. Their callback owns the complete
                    deterministic comparator and unique tie behavior. An opaque permutation cannot
                    prove those comparator rules, so the author remains responsible for them. Dapter
                    never performs a second Collection sort.
                </p></ProseSection
            >

            <ComposedDemo scenario="OpaquePreset" /><ProseSection
                id="next-guide"
                title="Continue with the next task"
                ><p>
                    Return to
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    for prerequisites. Continue with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/advanced-queries').href"
                        >Read joined and grouped queries</DocsLink
                    >.
                </p></ProseSection
            >
        </div>
    </article>
</template>
