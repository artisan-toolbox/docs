<script setup>
import ManualAppendDemo from '@/components/demo/dapter/infinite/ManualAppendDemo.vue';
import InfiniteDemo from '@/components/demo/dapter/infinite/InfiniteDemo.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const manualAppend = `<script setup>
import { DataAdapter } from '@artisan-toolbox/dapter';
\x3C/script>

<template>
    <DataAdapter source="Dapter.Quickstart" :protocol="2" :infinite="true" :url="false" v-slot="adapter">
        <p v-if="adapter.error" role="alert">{{ adapter.error.message }}</p>
        <ul>
            <li v-for="notebook in adapter.data" :key="notebook.id">{{ notebook.name }}</li>
        </ul>
        <button v-if="adapter.ready" :disabled="adapter.infinite?.status !== 'idle'"
            @click="adapter.infinite.append()">Load more</button>
    </DataAdapter>
</template>`;
</script>
<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Prepare the infinite preview"
                ><p>
                    Complete Install Dapter and Read and paginate a source in your Laravel 13, PHP
                    8.5, Inertia 3, and Vue application. Install Composer dependencies before npm at
                    the application root. Keep the web session, CSRF middleware, and Ziggy
                    dapter.data route. These APIs belong to the unpublished 1.x preview. The
                    fictional public sources require no account, broadcaster, or queue worker.
                </p></ProseSection
            >
            <ProseSection id="enable-append" title="Keep the previous pages">
                <p>
                    Keep the
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter').href + '#first-example'"
                        >quickstart's PHP source</DocsLink
                    >
                    and replace its Vue component with this one. Protocol 2 and
                    <code>:infinite="true"</code> enable append on the default offset pages. The
                    button becomes available when the adapter can read another page. Without
                    infinite loading, <code>adapter.infinite</code> is null.
                </p>
                <CodeExample
                    language="vue"
                    label="Append the next page of notebooks"
                    :code="manualAppend" />
                <p>
                    Start the example to read Notebook 01 through Notebook 10. Select
                    <strong>Load more</strong> to append Notebook 11 through Notebook 20. The first
                    ten stay visible. Load the final page to see all 23 notebooks.
                </p>
            </ProseSection>
            <ManualAppendDemo />
            <ProseSection id="observe-vertical" title="Observe the vertical root"
                ><p>
                    The next example uses a two-row simple source with
                    <code>paging: 'source'</code>. Use that option for source-owned simple or cursor
                    pagination. Pass <code>infinite: { root, sentinel }</code> to observe an
                    explicit scrolling element and a contained trailing sentinel. Both values accept
                    an element, a Vue ref, or a getter. The default axis is <code>y</code>. Give the
                    root a bounded height and place the sentinel after the rendered rows.
                    Observation waits until both elements exist. A missing
                    <code>IntersectionObserver</code> leaves manual Load more available.
                </p>
                <p>
                    Start the vertical example. Notebook 01 and Notebook 02 appear inside a
                    200-pixel root with real vertical overflow. Scroll that root to its end or click
                    Load more. Notebook 03 and Notebook 04 append. Continue until Notebook 07
                    appears and status becomes <code>exhausted</code>. Replace scroll root and
                    Replace sentinel retain the adapter owner and loaded rows while replacing the
                    observed elements.
                </p></ProseSection
            >
            <InfiniteDemo scenario="InfiniteSimple" />
            <ProseSection id="serialize-append" title="Wait for the complete append"
                ><p>
                    Enabled controls expose <code>status</code>, <code>append()</code>, and
                    <code>retry()</code>. Status is <code>idle</code>, <code>loading</code>,
                    <code>paused</code>, or <code>exhausted</code>. Await
                    <code>infinite.append()</code> before dependent work. Its promise includes HTTP
                    acceptance, URL publication, Vue rendering, and buffered live-event replay.
                    Concurrent calls share the active append. An append during unrelated work
                    returns superseded without queuing. Status is <code>loading</code> until that
                    work settles. A consumed boundary cannot append twice.
                </p>
                <p>
                    Search, order, and page-size changes clear accumulated rows before dispatch.
                    Page-preserve hints fail locally in infinite mode. Ordinary Next, Previous,
                    First, or numbered navigation starts a new one-page window. Counts and accepted
                    paging metadata describe the tail response. They are not sums of the loaded
                    pages.
                </p></ProseSection
            >
            <ProseSection id="joined-results" title="Keep separate occurrences in a joined result">
                <p>
                    The joined SQLite source returns one result per page. Select Load more twice.
                    Both notebook lines, 1:11 and 1:12, appear before the pencil line 2:21. Give
                    each rendered occurrence a stable key, such as the tuple of notebook and line
                    IDs. A repeated notebook ID alone cannot identify a result row.
                </p>
            </ProseSection>
            <InfiniteDemo scenario="InfiniteJoined" />
            <ProseSection id="live-limits" title="Keep live consistency limits visible"
                ><p>
                    Live replacements update matching loaded occurrences without adding, removing,
                    or reordering membership. They do not refresh action metadata. Appending live
                    data does not create snapshot isolation. Changes between reads can still cause
                    repeated or omitted records. Preserve legitimate row occurrences rather than
                    hiding those limits through generic ID deduplication.
                </p></ProseSection
            >
            <ProseSection id="next-guide" title="Continue with the next task"
                ><p>
                    Review
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    for the complete installation procedure. Continue with
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/horizontal-infinite-loading')
                                .href
                        "
                        >Append cards horizontally</DocsLink
                    >.
                </p></ProseSection
            >
        </div>
    </article>
</template>
