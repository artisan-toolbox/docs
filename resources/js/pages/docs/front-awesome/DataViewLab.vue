<script setup>
import DataViewDemo from '@/components/demo/front-awesome/data-view/DataViewDemo.vue';
import CapabilityDemo from '@/components/demo/front-awesome/data-view/CapabilityDemo.vue';
import ActionDemo from '@/components/demo/front-awesome/data-view/ActionDemo.vue';
import PagingDemo from '@/components/demo/front-awesome/data-view/PagingDemo.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const firstTable = String.raw`<script setup>
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';

function decodeRow(row) {
    if (!Number.isSafeInteger(row?.id) || typeof row.name !== 'string') {
        throw new Error('Expected a notebook with an integer ID and name.');
    }
    return { id: row.id, name: row.name };
}

const catalog = useDataAdapter('Dapter.CollectionFluent', { decodeRow });
const views = {
    table: {
        columns: [
            { field: 'id', label: 'No.' },
            { field: 'name', id: 'notebook', label: 'Notebook' },
        ],
    },
};
</${'script'}>

<template>
    <DataView :adapter="catalog" :views="views" row-key="id" label="Notebook catalog">
        <template #cell-notebook="{ row }">
            <strong>{{ row.name }}</strong>
        </template>
    </DataView>
</template>`;
const contracts = [
    [
        'adapter',
        'Required existing Dapter handle. Acquire it with useDataAdapter(source, options). Changing the handle requires a keyed remount.',
    ],
    [
        'views',
        'Required ordered object. table declares columns and optional striped, hover, and label. grid and list accept an optional label and require their item slot.',
    ],
    ['rowKey', 'Required decoded property name or callback returning a stable string or number.'],
    [
        'view',
        'Optional v-model:view with table, grid, or list. An unavailable view falls back to the first effective configured view.',
    ],
    ['size', 's, m, or l. The default is m.'],
    [
        'label and caption',
        'label names the results region and defaults to Results. caption optionally names the semantic table.',
    ],
];
const columns = [
    [
        'Property',
        "{ field: 'name', label: 'Notebook', id: 'notebook', orderBy: 'name' }",
        'Reads the decoded name property. The ID defaults to field. orderBy explicitly names the public Dapter field alias.',
    ],
    [
        'Computed',
        "{ id: 'summary', accessor: row => row.name, label: 'Summary' }",
        'Computes presentation from the decoded row. An optional orderBy grants no capability by itself.',
    ],
    [
        'Display',
        "{ kind: 'display', id: 'actions', label: 'Actions' }",
        'Has no data accessor or query field. Render its content in a cell slot.',
    ],
];
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <DocsCallout variant="note">
                <template #title>Local unpublished preview</template>
                This guide runs the public DataView export from the local Front Awesome development
                checkout with the local Dapter preview. The component is not included in an existing
                tagged Front Awesome release. The documented package version badge identifies the
                installed package, not a release promise for this API.
            </DocsCallout>
            <ProseSection id="one-adapter" title="One adapter for every layout">
                <p>
                    Dapter owns acquisition, authorization, requests, decoded rows, query state, and
                    paging. Create a handle with the public
                    <code>useDataAdapter(source, options)</code> composable, then pass that handle
                    to <code>DataView</code>. The same handle can feed sibling controls or another
                    DataView.
                </p>
                <p>
                    DataView attaches to that handle once. A layout switch preserves the accepted
                    page, requested criteria, and pending request. Dapter continues to own URL
                    history, caching, polling, live updates, and infinite loading. Configure those
                    operations on the Dapter owner.
                </p>
                <p>
                    Begin in a Laravel, Inertia, and Vue application with Dapter's routes and web
                    middleware configured. Follow
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    and
                    <DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                        >Install Front Awesome</DocsLink
                    >. Run Composer before npm and consume each frontend package from its
                    Composer-installed directory. This preview requires the local unpublished
                    DataView export and compatible Dapter preview; a tagged Front Awesome
                    installation alone does not provide it.
                </p>
                <p>
                    The examples below reuse guest-accessible fictional sources from the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/listing').href"
                        >Dapter listing guide</DocsLink
                    >. The catalog requires no authenticated user, worker, or broadcaster. None of
                    its sources starts before you click a start button.
                </p>
            </ProseSection>
            <ProseSection id="compare-layouts" title="The same page in three layouts">
                <p>
                    Select <strong>Start catalog</strong>, then <strong>Next</strong>. The table
                    shows Notebook 06 through Notebook 10. Select <strong>Grid</strong> or
                    <strong>List</strong> to render those five records without another request. You
                    can also switch while Next is pending.
                </p>
                <p>
                    Open <strong>Layout settings and adapter state</strong>. Select
                    <strong>Table only</strong> to hide the layout switch, or
                    <strong>Grid only</strong> to render cards without columns. The source remains
                    mounted. To inspect access denial, select <strong>Reset</strong>, then
                    <strong>Try denied source</strong>. Dapter clears unauthorized records.
                </p>
            </ProseSection>
            <DataViewDemo />
            <ProseSection id="columns-and-slots" title="Columns in code, cells in Vue">
                <p>
                    Register <code>Dapter.CollectionFluent</code> from the listing guide, then save
                    this component in your application's Vue components directory and mount it. The
                    source supplies fictional notebooks with integer IDs and string names. The first
                    table shows Notebook 01 through Notebook 05, with each name in bold.
                </p>
                <CodeExample label="First notebook table" language="vue" :code="firstTable" />
                <p>
                    For the complete table, grid, and list example, open
                    <strong>View source</strong> in the catalog above. Save
                    <code>DataViewSession.vue</code> and <code>catalog.js</code> together, then
                    mount <code>DataViewSession</code> with
                    <code>source="Dapter.CollectionFluent"</code>. The result is a five-row table
                    with a paper tag and a switch to grid or list.
                </p>
                <p>
                    The ordered <code>views</code> object declares available layouts. Table columns
                    belong to <code>views.table.columns</code>. Grid and list need their
                    corresponding item slot. Only configured layouts with a renderer enter the
                    switch. One effective layout needs no switch.
                </p>
                <DocsTable
                    caption="DataView presentation props"
                    :columns="['Prop', 'Contract']"
                    :rows="contracts" />
                <DocsTable
                    caption="Table column declarations"
                    :columns="['Kind', 'Example', 'Behavior']"
                    :rows="columns" />
                <p>
                    Columns also accept <code>align</code> with <code>start</code>,
                    <code>center</code>, or <code>end</code>. Import the public
                    <code>DataViewColumn</code> type from
                    <code>@artisan-toolbox/front-awesome/data-view</code> in TypeScript consumers.
                    The actual Dapter handle supplies row, definition, action, and paging types.
                </p>
                <p>
                    <code>#cell-ID</code> receives <code>row</code>, <code>index</code>,
                    <code>column</code>, <code>value</code>, <code>adapter</code>, and
                    <code>view</code>. <code>#header-ID</code> receives the column, adapter, and
                    view. <code>#grid-item</code> and <code>#list-item</code> receive the row,
                    index, adapter, and view. Cell values are unknown because a computed accessor
                    can return application-specific content; use the decoded row for precise types.
                </p>
                <p>
                    The <code>toolbar</code>, <code>filters</code>, <code>actions</code>,
                    <code>pagination</code>, <code>footer</code>, <code>loading</code>,
                    <code>empty</code>, <code>error</code>, and <code>integration-error</code> slots
                    receive the full original adapter and current view. Replacing pagination makes
                    your slot responsible for its controls. Read the current Dapter state through
                    that handle instead of copying rows or building a second query engine.
                </p>
            </ProseSection>
            <ProseSection id="server-controls" title="Use server capabilities and custom controls">
                <p>
                    Start this fixed composed source. DataView displays global search, order
                    presets, and header ordering only when Dapter advertises them. Search for
                    <code>Notebook</code>, order the Notebook column, or select the
                    <strong>Newest first</strong> preset. <strong>Paused notebooks</strong> calls
                    the declared named status filter from the full handle in the filters slot. The
                    sibling status reads the same owner.
                </p>
                <p>
                    Decoded display properties and server aliases are independent.
                    <code>orderBy</code> explicitly names the Dapter field that may accept ordering.
                    A column never grants search, filtering, or order permissions. Named filters
                    retain their declared typed values, including distinct null, false, numeric
                    zero, and string zero.
                </p>
            </ProseSection>
            <CapabilityDemo />
            <ProseSection id="authorized-actions" title="Use authorized actions in a slot">
                <p>
                    Select <strong>Start actions</strong> to initialize only the current session's
                    fictional counter and permission before reading the action source. Then select
                    <strong>Save fictional notebook</strong>. The actions slot calls the original
                    handle's typed <code>actions.http</code> method. Dapter checks the advertised
                    action and reauthorizes the session-scoped fictional write on the server. Select
                    <strong>Reload write counter</strong> to read the confirmed state. Saving runs
                    only on that explicit click, and this example never retries a write
                    automatically.
                </p>
            </ProseSection>
            <ActionDemo />
            <ProseSection id="paging-modes" title="Render the paging mode the source provides">
                <p>
                    These fixed sources negotiate their mode through <code>protocol: 2</code> and
                    <code>paging: 'source'</code>. Simple and cursor sources expose traversal
                    without invented page counts or a last-page operation. The infinite example
                    enables <code>infinite: true</code> on the owner. DataView calls append and
                    retry on Dapter's accumulated window.
                </p>
                <p>
                    Start each example separately. Select <strong>Next</strong> for traversal or
                    <strong>Load more</strong> for accumulation. Unknown totals stay unknown.
                    Initial loading, accepted empty results, recoverable read errors, revoked
                    access, integration errors, and append failures follow the adapter's actual
                    state.
                </p>
            </ProseSection>
            <PagingDemo title="Simple traversal" source="Dapter.PagingSimple" />
            <PagingDemo title="Cursor traversal" source="Dapter.PagingCursor" />
            <PagingDemo title="Infinite append" source="Dapter.InfiniteSimple" infinite />
            <ProseSection id="dapter-coverage" title="Dapter capability coverage">
                <p>
                    All layouts render accepted records in server order. The focused Dapter guides
                    own setup, limits, and recovery for each operation.
                </p>
                <DocsTable caption="Current Dapter integration">
                    <thead>
                        <tr>
                            <th scope="col">Capability</th>
                            <th scope="col">DataView integration and next guide</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">Ownership and lifecycle</th>
                            <td>
                                One borrowed handle retains requests, decoded rows, source resets,
                                and requested versus accepted state. See
                                <DocsLink
                                    :href="findNavigationItem(navigation, 'dapter/composable').href"
                                    >shared adapters</DocsLink
                                >
                                and
                                <DocsLink
                                    :href="
                                        findNavigationItem(navigation, 'dapter/vue-navigation').href
                                    "
                                    >Vue navigation</DocsLink
                                >.
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Search, filters, and order</th>
                            <td>
                                Built-in global search, presets, and header ordering use public
                                capabilities. Custom controls use the full handle. See
                                <DocsLink
                                    :href="
                                        findNavigationItem(navigation, 'dapter/field-search').href
                                    "
                                    >field search</DocsLink
                                >,
                                <DocsLink
                                    :href="
                                        findNavigationItem(navigation, 'dapter/typed-filters').href
                                    "
                                    >typed filters</DocsLink
                                >,
                                <DocsLink
                                    :href="
                                        findNavigationItem(navigation, 'dapter/multi-order').href
                                    "
                                    >multi-order</DocsLink
                                >, and
                                <DocsLink
                                    :href="
                                        findNavigationItem(navigation, 'dapter/vue-controls').href
                                    "
                                    >Vue controls</DocsLink
                                >.
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Paging and accumulation</th>
                            <td>
                                Offset, simple, cursor, and infinite controls follow the negotiated
                                capabilities. See
                                <DocsLink
                                    :href="
                                        findNavigationItem(navigation, 'dapter/simple-paging').href
                                    "
                                    >simple paging</DocsLink
                                >,
                                <DocsLink
                                    :href="
                                        findNavigationItem(navigation, 'dapter/cursor-paging').href
                                    "
                                    >cursor paging</DocsLink
                                >, and
                                <DocsLink
                                    :href="
                                        findNavigationItem(navigation, 'dapter/infinite-loading')
                                            .href
                                    "
                                    >infinite loading</DocsLink
                                >.
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Authorized actions</th>
                            <td>
                                The actions slot retains available operations, pending writes,
                                validation, outcomes, and native or HTTP transports. See
                                <DocsLink
                                    :href="findNavigationItem(navigation, 'dapter/actions').href"
                                    >Dapter actions</DocsLink
                                >.
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Live updates and polling</th>
                            <td>
                                Configure Echo or polling on the owner. Each layout follows Dapter's
                                accepted row replacements and integration errors. See
                                <DocsLink
                                    :href="
                                        findNavigationItem(navigation, 'dapter/live-updates').href
                                    "
                                    >live updates</DocsLink
                                >
                                and
                                <DocsLink
                                    :href="findNavigationItem(navigation, 'dapter/polling').href"
                                    >polling</DocsLink
                                >. Those guides provide reader-started service demos and their
                                prerequisites.
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">URL and browser history</th>
                            <td>
                                Dapter owns URL restoration and query history. Use a unique owner ID
                                when multiple sources participate. See
                                <DocsLink
                                    :href="
                                        findNavigationItem(navigation, 'dapter/vue-navigation').href
                                    "
                                    >Vue navigation</DocsLink
                                >.
                            </td>
                        </tr>
                    </tbody>
                </DocsTable>
            </ProseSection>
            <ProseSection id="review-next" title="Future presentation work">
                <p>
                    Selection, grouping, merged cells, and editing remain proposals. They are
                    separate from the delivered local preview above. Selection needs explicit
                    behavior across page, query, and access changes. Group counts and row spans need
                    a defined page-boundary contract before implementation.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
