<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import Requirements from '@/components/docs/Requirements.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import InstallCommand from '@/components/docs/InstallCommand.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import quickstartSource from '../../../../../app/DataSources/Dapter/Quickstart.php?raw';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const identity = `use ArtisanToolbox\\Dapter\\Dapter;

dump(Dapter::VERSION); // "1.0.0-alpha.1"`;
const adapter = `<script setup>
import { DataAdapter } from '@artisan-toolbox/dapter';
\x3C/script>

<template>
    <DataAdapter source="Dapter.Quickstart" v-slot="adapter">
        <p v-if="adapter.paging.loading">Loading...</p>
        <p v-if="adapter.error" role="alert">{{ adapter.error.message }}</p>
        <pre v-if="adapter.ready">{{ adapter.data }}</pre>
    </DataAdapter>
</template>`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="preview" title="Preview scope">
                <p>
                    Dapter reads and paginates server-owned data through a headless Vue adapter.
                    This unpublished local preview supports Collections and ordinary SQLite Eloquent
                    sources, offset paging, typed options, PHP attributes, and guard and Gate access
                    checks. A host composable and a bound component can share one adapter, while
                    named stores keep independent state. Search, filters, selectable sorting, MySQL,
                    PostgreSQL, URL persistence, scrolling, and live updates remain future work.
                </p>
                <p>
                    The source is developed on <code>1.x</code>. A local checkout is not a published
                    stable release. The shared version label reports whether this documentation
                    application has the package installed.
                </p>
            </ProseSection>
            <Requirements :items="page.requirements" />
            <ProseSection id="installation" title="Install a local preview">
                <p>
                    Start in an existing compatible Laravel application, with a Dapter checkout
                    beside it. Run these commands from the application root:
                </p>
                <InstallCommand
                    :package="page.package"
                    command="local-preview"
                    label="Install the local backend preview" />
                <p>
                    Follow
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install the Dapter preview</DocsLink
                    >
                    to connect the frontend after Composer completes.
                </p>
            </ProseSection>
            <ProseSection id="first-example" title="Read the first page">
                <p>
                    After completing the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/installation').href +
                            '#vite-config'
                        "
                        >required Vue source configuration</DocsLink
                    >, expose <code>dapter.data</code> in Ziggy and keep Laravel's web middleware,
                    session, and CSRF integration enabled. Create
                    <code>app/DataSources/Dapter/Quickstart.php</code> with this self-contained
                    fictional catalog. Its explicit public attribute permits guests. Other sources
                    require authentication under the configured guard by default.
                </p>
                <CodeExample
                    language="php"
                    label="Executed quickstart source"
                    :code="quickstartSource" />
                <p>Mount this component in an existing Inertia page:</p>
                <CodeExample
                    language="vue"
                    label="Load the source asynchronously"
                    :code="adapter" />
                <p>
                    After loading, the page displays Notebook 01 through Notebook 10 from the
                    23-record catalog. The adapter requests data after mounting. Open
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/sources').href"
                        >Declare a data source</DocsLink
                    >
                    to run this exact source with Front Awesome controls. Continue with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/listing').href"
                        >Read and paginate a source</DocsLink
                    >
                    for paging controls.
                </p>
                <p>The existing identity API remains available:</p>
                <CodeExample language="php" label="Read the package version" :code="identity" />
                <p>The dump displays <code>1.0.0-alpha.1</code>. No configuration is required.</p>
            </ProseSection>
            <ProseSection id="next-steps" title="Next steps">
                <p>
                    Read the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/roadmap').href"
                        >Dapter roadmap</DocsLink
                    >
                    for the remaining architecture and delivery phases. Completed slices are
                    identified separately from proposed APIs. No stable release is available.
                </p>
                <p>
                    Read
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/development').href"
                        >Develop Dapter</DocsLink
                    >
                    for the test matrix, TypeScript contracts, distribution checks, and artwork
                    workflow.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
