<script setup>
import ComparisonDemo from '@/components/demo/front-awesome/data-view/ComparisonDemo.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import QueryDemo from '@/components/demo/front-awesome/data-view/QueryDemo.vue';
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
            <DocsCallout variant="note"
                ><template #title>Beta availability</template>These controls are available in Front
                Awesome 1.0.0-beta.4. See
                <DocsLink
                    :href="findNavigationItem(navigation, 'front-awesome/data-view/reference').href"
                    >DataView release availability</DocsLink
                >.</DocsCallout
            >
            <ProseSection id="server-controls" title="Search the source">
                <p>
                    Start the stock example. Open Search and filters for field and filter controls.
                    Search globally for <code>C</code> to match shelf C, then search the name field
                    for <code>Notebook 2</code> with Equals. Combine the searches with All to get no
                    rows. Choose Any to see Notebook 2 and the two notebooks on shelf C. Clear both
                    searches before trying filters.
                </p>
                <p>
                    Sheet count is a searchable integer even though the table has no sheet-count
                    column. Enter <code>24</code> and apply Equals to find Notebook 2. Clear the
                    sheet-count search before applying a stock mark. Each editor offers the
                    operators declared by the source.
                </p>
            </ProseSection>
            <ProseSection id="typed-choices" title="Filter exact scalar values">
                <p>
                    Choose one stock mark in the global filter. The six options select different
                    rows. Numeric zero selects Notebook 7, string zero selects Notebook 3, and one
                    space selects Notebook 4. Open Requested and accepted criteria to inspect the
                    value sent to Dapter. Selecting Null sends a value. Clear removes the filter.
                </p>
                <p>
                    Select shelves A and B in the field filter. Its empty selection clears the
                    filter. Under Allowed stock marks, select two marks. Applying an empty selection
                    to that filter is rejected. Its explicit Clear still removes the filter. The
                    source controls both policies.
                </p>
                <p>
                    The published base also supports global search, a sortable header, presets and
                    an additive filter slot. Use the catalog in
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'front-awesome/data-view/ordering').href
                        "
                        >Order records</DocsLink
                    >
                    to try those controls.
                </p>
                <QueryDemo />
                <p>
                    For server declarations, see
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/field-search').href"
                        >field search</DocsLink
                    >,
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/typed-filters').href"
                        >typed filters</DocsLink
                    >, and
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/vue-controls').href"
                        >Vue controls</DocsLink
                    >.
                </p>
            </ProseSection>
            <ProseSection id="prepared-vector" title="Enter a prepared vector">
                <p>
                    Dapter 1.0.0-beta.2 and Front Awesome 1.0.0-beta.4 support a field that
                    advertises valueType vector and a vector policy. The field search editor accepts
                    a JSON numeric array, such as <code>[0, 0, 0]</code>. It validates the declared
                    dimensions and numeric coordinate limits before applying the vector operator.
                    Malformed JSON or an invalid vector stays in the editor and makes no read. Text
                    input never calls an embedding provider.
                </p>
                <p>
                    The source fixes the inclusive L2 threshold. DataView uses the existing adapter
                    field operation and adds no vector-specific prop. It does not choose a relevance
                    order. See
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/vector-search').href"
                        >Filter PostgreSQL vectors by distance</DocsLink
                    >
                    for declarations, prerequisites, limits, and code-only examples.
                </p>
            </ProseSection>
            <ProseSection id="search-comparison" title="Match a source’s exact spelling">
                <p>
                    Start the strict literal source. Enter <code>joao</code> in the name field and
                    apply Contains. Only ID 7 matches. The source fixes its case and accent policy.
                    DataView displays the permitted match operators. See
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/literal-search').href"
                        >literal search</DocsLink
                    >. A source that advertises full text also supplies its byte limit and
                    database-specific search policy. See
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/postgresql-full-text').href"
                        >PostgreSQL full-text prerequisites</DocsLink
                    >.
                </p>
                <ComparisonDemo mode="literal" />
                <p>
                    Continue with
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'front-awesome/data-view/ordering').href
                        "
                        >Order records</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
