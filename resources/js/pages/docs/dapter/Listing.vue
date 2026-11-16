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
\x3C/script>
<template>
    <DataAdapter source="Dapter.CollectionFluent" v-slot="adapter">
        <p v-if="adapter.paging.loading">Loading...</p>
        <p v-if="adapter.error" role="alert">{{ adapter.error.message }}</p>
        <pre v-if="adapter.ready">{{ adapter.data }}</pre>
        <Button :disabled="!adapter.paging.has_next" @click="adapter.paging.goToNext()">Next page</Button>
    </DataAdapter>
</template>`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Prepare the application">
                <p>
                    Use the Laravel, Inertia, and Vue application from
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >. Complete Composer installation before frontend installation. This unpublished
                    preview supports offset paging for Collections and ordinary SQLite Eloquent
                    sources.
                </p>
                <p>
                    Collections preserve their input order. SQLite preserves supported source
                    ordering and appends the qualified primary key ascending when it is absent. With
                    no source order, that key supplies the complete order. Exact counts cover the
                    complete authorized source before pagination. Since this preview has no managed
                    search or filters, <code>total</code> and <code>filtered</code> are equal. An
                    empty source returns page 1 of 1, both counts zero, and no previous or next
                    page. A page beyond the last page clamps to the last valid page.
                </p>
                <p>
                    Keep Laravel's web middleware, session, and CSRF integration enabled. Expose the
                    named <code>dapter.data</code> route through your existing Ziggy configuration.
                    No worker or broadcaster is needed.
                </p>
                <p>
                    The demos use Front Awesome's public Button, Select, Spinner, Tag, and Pro
                    DataGrid. Complete
                    <DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                        >Front Awesome installation</DocsLink
                    >
                    and its Web Awesome Pro prerequisites before copying the grid. Dapter itself has
                    no presentation-library dependency.
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
                    local paging, sorting, and filters disabled. Search, filters, selectable
                    sorting, URL persistence, scrolling, and live updates remain future work.
                </p>
            </ProseSection>
            <ListingDemo scenario="CollectionFluent" />
            <ProseSection id="connect-adapter" title="Render a headless component">
                <p>
                    After declaring <code>Dapter.CollectionFluent</code> in your application, mount
                    the public component in an existing Inertia page. It requests its first page on
                    mount. These demos delay mounting until you select Start.
                </p>
                <CodeExample label="Source-only Vue adapter" language="vue" :code="clientCode" />
                <p>
                    Use <code>paging.loading</code> for pending feedback and <code>error</code> for
                    failures. Keep accepted rows visible during subsequent loads if your
                    presentation supports it. A failed request does not accept partial rows. Reload
                    retries the current request.
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
