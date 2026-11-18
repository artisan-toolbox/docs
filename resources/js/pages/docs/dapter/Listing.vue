<script setup>
import ListingDemo from '@/components/demo/dapter/listing/ListingDemo.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const clientCode = `<script setup>
import { DataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { DataGrid } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';

const columns = [
    { field: 'id', label: 'ID', sortable: false, filterable: false },
    { field: 'name', label: 'Product', sortable: false, filterable: false },
    { field: 'category', label: 'Paper', sortable: false, filterable: false },
];
\x3C/script>
<template>
    <DataAdapter source="Dapter.CollectionFluent" v-slot="adapter">
        <p v-if="adapter.paging.loading">Loading...</p>
        <p v-if="adapter.error" role="alert">{{ adapter.error.message }}</p>
        <DataGrid v-if="adapter.ready" label="Notebooks" row-key="id"
            :data="adapter.data" :columns="columns" :server="true" :paginate="false"
            :total="adapter.paging.total" :loading="adapter.paging.loading" />
        <Button :disabled="adapter.paging.loading || !adapter.paging.has_next"
            @click="adapter.paging.goToNext()">Next page</Button>
    </DataAdapter>
</template>`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Prepare a numbered list">
                <p>
                    Use the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Laravel and Vue installation</DocsLink
                    >
                    with the web session, CSRF protection, and the <code>dapter.data</code> route
                    exposed through Ziggy. The default protocol 1 reads numbered pages from
                    Collections and ordinary SQLite, MySQL, or PostgreSQL Eloquent sources.
                </p>
                <p>
                    For a list rendered with ordinary Vue markup, use the
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter').href + '#first-example'"
                        >notebook quickstart</DocsLink
                    >. The grid below uses the optional Front Awesome Pro DataGrid. Follow
                    <DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                        >Front Awesome installation</DocsLink
                    >
                    and configure Web Awesome Pro before copying its presentation.
                </p>
            </ProseSection>

            <ProseSection id="run-listing" title="Read the first page">
                <p>
                    Select <strong>Start example</strong> below. The grid displays Notebook 01
                    through Notebook 10, page 1 of 3, and 23 total records. Opening this guide sends
                    no data request.
                </p>
                <p>
                    Select <strong>Next</strong> to read Notebook 11 through Notebook 20.
                    <strong>First</strong>, <strong>Previous</strong>, and
                    <strong>Last</strong> navigate the accepted page range.
                    <strong>Reload</strong> requests the current page again.
                    <strong>Reset</strong> cancels the adapter and clears its result.
                </p>
            </ProseSection>
            <ListingDemo scenario="CollectionDefaults" />
            <ProseSection id="change-page-size" title="Change the active page size">
                <p>
                    Start this five-row declaration. Select 10 in <strong>Rows per page</strong>.
                    The adapter returns to page 1 and displays ten rows. The source's configured
                    default stays 5.
                </p>
                <p>
                    Dapter owns server paging. The grid renders only the accepted page, with its own
                    local paging, sorting, and filters disabled. For a control that changes the
                    server-side query, start with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/field-search').href"
                        >field search</DocsLink
                    >. For shared Vue controls, URL persistence, and targeted scrolling, follow
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/vue-controls').href"
                        >Build declared Vue controls</DocsLink
                    >. For authorized replacement-only delivery, follow
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/live-authorization').href"
                        >Authorize live row updates</DocsLink
                    >.
                </p>
            </ProseSection>
            <ListingDemo scenario="CollectionFluent" />
            <ProseSection id="connect-adapter" title="Render a headless component">
                <p>
                    Copy <code>CollectionFluent.php</code> and its notebook fixture from View source
                    above. To display the optional Pro grid, mount this component in an existing
                    Inertia page. It requests five notebooks on mount. Select
                    <strong>Next page</strong>
                    to see Notebook 06 through Notebook 10.
                </p>
                <CodeExample label="Source-only Vue adapter" language="vue" :code="clientCode" />
                <p>
                    Use <code>paging.loading</code> for pending feedback and <code>error</code> for
                    failures. Keep accepted rows visible during subsequent loads if your
                    presentation supports it. A failed request does not accept partial rows. Reload
                    retries the current request.
                </p>
            </ProseSection>
            <ProseSection id="fixture-defaults" title="Reproduce the demonstration defaults">
                <p>
                    The first fixture's <code>config/dapter.php</code> selects
                    <code>dapter-demo-guest</code>. To copy that configuration, include the
                    disclosed <code>DemoConfiguration.php</code> and call
                    <code>DemoConfiguration::register()</code> from
                    <code>AppServiceProvider::boot()</code>. This registers the fictional guards
                    before source execution and leaves your sign-in session unchanged. The package
                    default guard remains <code>web</code>.
                </p>
                <p>
                    The fluent public example below works with the package defaults and needs no
                    fixture guard. The standalone overview Quickstart also needs no shared fixture
                    setup.
                </p>
            </ProseSection>
            <ProseSection id="offset-counts" title="Read offset counts and boundaries">
                <p>
                    Collections preserve the input order. For ordinary SQLite reads, Dapter appends
                    the qualified primary key when the source order omits it. The primary key
                    supplies the order when the source has none. Exact counts cover the authorized
                    source. Without selections, <code>total</code> equals <code>filtered</code>. An
                    empty source returns page 1 of 1 with zero records. Requests beyond the last
                    page return the last valid page.
                </p>
            </ProseSection>
            <ProseSection id="declare-source" title="Declare another source">
                <p>
                    Continue with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/sources').href"
                        >Declare a data source</DocsLink
                    >
                    for Collection and SQLite implementations. Choose
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/options').href"
                        >Configure source options</DocsLink
                    >
                    for attributes, defaults, and fluent overrides.
                </p>
            </ProseSection>
            <ProseSection id="check-access" title="Protect a source">
                <p>
                    Authentication is required by default. Continue with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/access').href"
                        >Choose a guard</DocsLink
                    >
                    before reading protected data, then
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/access/gates').href"
                        >Authorize with Gates</DocsLink
                    >
                    for guest access and abilities.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
