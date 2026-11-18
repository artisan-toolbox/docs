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
            <ProseSection id="starting-environment" title="Prepare the backend preview">
                <p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    in a compatible Laravel application. Keep the web session, CSRF middleware, and
                    Ziggy route integration. These unpublished APIs require explicit wire version 2.
                    DataAdapter and useDataAdapter retain version 1 by default. Set protocol to 2
                    for the
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
            <ProseSection id="declaration" title="Resolve declarations by layer">
                <p>
                    Configuration provides the baseline, then parent-to-child attributes apply, then
                    explicitly called fluent options. A higher layer replaces the complete entry for
                    a search, an order, or a field and filter ID. Uncalled settings retain their
                    inherited definitions. A field shares one trusted target across its operations.
                    The attribute example declares public title against the raw name path. Both its
                    search and order use that same target. Conflicting targets and duplicate entries
                    within one layer fail configuration.
                </p>
                <p>
                    Use SearchableField, OrderableField, and FilterableField attributes with the
                    same arguments as their fluent methods. Use withoutFieldSearch,
                    withoutFieldOrder, and withoutFieldFilter to remove inherited entries. Their
                    WithoutFieldSearch, WithoutFieldOrder, and WithoutFieldFilter attributes provide
                    equivalent removal. Tombstones persist across the resolver so inherited entries
                    cannot return accidentally. The examples show the resulting capabilities and
                    rejected restoration attempt.
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
            <FieldDemo scenario="FieldsAttributes" />
            <FieldDemo scenario="FieldsRemoved" />
            <FieldDemo scenario="FieldsRemovedAttributes" />
            <FieldDemo scenario="FieldsRemovedRejected" />
        </div>
    </article>
</template>
