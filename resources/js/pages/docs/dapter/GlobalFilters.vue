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
            <ProseSection id="starting-environment" title="Prepare the filter preview"
                ><p>
                    Start with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Dapter installed</DocsLink
                    >
                    and a declared source. These unpublished protocol 2 examples use four fictional
                    Collection rows. Opening the page loads no data. Send request starts each fixed
                    example.
                </p></ProseSection
            >
            <ProseSection id="declare-filters" title="Declare finite inputs and trusted handlers"
                ><p>
                    globalFilterable accepts an identifier, finite values, and a trusted Closure or
                    invokable class. The handler receives the actual Collection or Eloquent Builder
                    and the accepted value. Return the same source family while retaining mandatory
                    predicates. multiple true invokes the handler once with the complete validated
                    list. EmptySelectionPolicy Reject rejects an empty list. Clear removes the
                    selection.
                </p></ProseSection
            >
            <ProseSection id="filter-status" title="Show only paused records">
                <p>
                    The catalog advertises a <code>status</code> filter. Send the paused selection
                    below. The handler receives the declared value and returns the matching row with
                    ID 2. Open the request and response to inspect the selection and the count.
                </p>
            </ProseSection>
            <ComposedDemo scenario="GlobalStatus" />
            <ProseSection id="enum-binding" title="Bind enums without coercion"
                ><p>
                    Pass one enum case, an explicit subset, cases(), or a trusted enum class. Backed
                    cases use their scalar value. Pure cases use their case name. A concrete enum
                    parameter receives the exact case. Mixed receives wire values unless
                    HandlerOptions supplies EnumBinding. For multiple conversion, set elements true
                    and accept an array. Null requires both a nullable handler parameter and null in
                    the finite domain. Explicit EnumBinding also resolves a compatible enum member
                    of a union or interface parameter. Without an unambiguous binding, reject the
                    declaration. Different enum classes and duplicate wire tokens fail
                    configuration. Every member validates before a service is constructed. See
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/enum-inputs').href"
                        >bind finite enum inputs</DocsLink
                    >
                    for complete declarations.
                </p></ProseSection
            >
            <ProseSection id="requirements" title="Restrict a handler to its source">
                <p>
                    <code>HandlerRequirements</code> can restrict a handler to Collections,
                    Eloquent, a native database (SQLite, MySQL, or PostgreSQL), or a registered
                    driver alias. Database requirements check the actual engine. Values such as
                    null, false, integer zero, string zero, and empty text remain distinct.
                </p>
                <p>
                    See
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/handler-requirements').href"
                        >require a matching source and engine</DocsLink
                    >
                    for the declarations and failure cases.
                </p>
            </ProseSection>
            <ComposedDemo scenario="GlobalMany" />
            <ComposedDemo scenario="GlobalInvalid" />
            <ComposedDemo scenario="GlobalNull" /><ProseSection
                id="next-guide"
                title="Use enums as filter inputs">
                <p>
                    To accept an enum case, an explicit subset, or all cases,
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/enum-inputs').href"
                        >bind finite enum inputs</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
