<script setup>
import FieldDemo from '@/components/demo/dapter/fields/FieldDemo.vue';
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
            <ProseSection id="starting-environment" title="Prepare the Laravel source">
                <p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    in a compatible Laravel application. Keep the web session, CSRF middleware, and
                    Ziggy route integration. These APIs require explicit wire version 2. DataAdapter
                    and useDataAdapter retain version 1 by default. Set protocol to 2 for the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/vue-controls').href"
                        >declared Vue controls</DocsLink
                    >.
                </p>
                <p>
                    The examples use Inertia's public HTTP client, the public dapter.data endpoint,
                    and isolated fictional Collections. No account, application records, database,
                    worker, or broadcaster is required. Follow
                    <DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                        >Front Awesome installation</DocsLink
                    >
                    before copying the public Button, Spinner, and Tag presentation. Dapter has no
                    Front Awesome runtime dependency.
                </p>
            </ProseSection>
            <ProseSection id="declaration" title="Keep JSON values distinct">
                <p>
                    Use the same installed source and version 2 envelope as the filter guide. The
                    fictional catalog declares active as Boolean, score as Number, and optional as a
                    null-only option list. Null-only options are legal. The source sets
                    EmptySelectionPolicy::Reject for optional.
                </p>
                <p>
                    Null, false, 0, and the empty string can be active advertised values. A null
                    selection differs from omitting the filter. The optional example uses the
                    multiple list [null]. Its second button sends an empty list and verifies the
                    Reject policy. JSON strings are not coerced into numbers or booleans. Number
                    accepts finite safe integral and fractional tokens. Integer requires integral
                    tokens. Invalid types, unsafe values, and non-advertised options return HTTP 422
                    before record work.
                </p>
                <p>
                    A nonnull selection for a null-only option list is invalid and returns HTTP 422.
                    In a Collection, a public property containing null or a public get hook
                    returning null matches a declared null choice. A get hook may return null before
                    its backing storage is initialized. For a target such as
                    <code>details.note</code>, <code>details</code> must exist and allow access to
                    <code>note</code>. A missing, inaccessible, or plain uninitialized property
                    fails configuration. Reading the target does not invoke unrelated property
                    getters.
                </p>
                <p>
                    SQL null-only filters require an existing column and use IS NULL, without
                    requiring a compatible nonnull scalar type.
                </p>
            </ProseSection>
            <ProseSection id="sql-types" title="Use compatible SQL column types">
                <p>
                    SQL declarations must match existing model columns before listing queries run.
                    Integer fields require integer-compatible columns, Boolean fields require
                    supported boolean columns, and String fields require text-compatible columns.
                    Declare Number for compatible numeric columns that accept fractional values. An
                    unknown target column or incompatible declared type fails configuration with
                    HTTP 500 before count and page SQL. Targets remain trusted server declarations,
                    not client SQL expressions.
                </p>
                <p>
                    Native backend HTTP tests verify integer 0, text "0", false, and null
                    independently on arrays, Collections, SQLite, MySQL, and PostgreSQL. A matching
                    option cannot turn a wrongly typed request into a valid selection. Model casts
                    and JSON serialization still control returned public row types. Dapter does not
                    infer a shared collation policy across databases.
                </p>
            </ProseSection>
            <ProseSection id="observe" title="Send the fixed examples">
                <p>
                    Each frame defines its request and expected rows. Select Send request to contact
                    the server. Opening this page starts no read. Inspect the actual response,
                    requested state, effective order, and capabilities. Total counts describe the
                    base source; filtered counts describe the selections. Pages and bounded
                    positions use the filtered count. Reset cancels pending work and clears the
                    response. Source disclosures include the executable declaration and fixture.
                </p>
                <p>
                    These examples declare no live channel or Resource. Successful version 2 reads
                    return the fixture rows, <code>metadata.records.mode</code> equal to
                    <code>unidentified</code>, and <code>metadata.channel</code> equal to
                    <code>null</code>. Capabilities expose public field IDs. See the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/protocol/v2').href"
                        >version 2 response reference</DocsLink
                    >
                    for the full envelope.
                </p>
            </ProseSection>
            <FieldDemo scenario="FilterNull" />
            <FieldDemo scenario="FilterZero" />
            <FieldDemo scenario="FilterDecimal" />
            <FieldDemo scenario="FilterWrongType" />
        </div>
    </article>
</template>
