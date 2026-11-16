<script setup>
import DataViewDemo from '@/components/demo/front-awesome/data-view/DataViewDemo.vue';
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

const example = `<script setup>
// Proposed Front Awesome component. No package release exports DataView.
import { DataView } from '@artisan-toolbox/front-awesome/data-view';
import { Tag } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const columns = [
    { id: 'notebook', field: 'name', label: 'Notebook' },
    { id: 'paper', field: 'category', label: 'Paper' },
];
const views = { table: { columns }, grid: {} };
\x3C/script>

<template>
    <DataView source="Dapter.CollectionFluent" row-key="id" :views="views">
        <template #cell-paper="{ value }"><Tag>{{ value }}</Tag></template>
        <template #grid-item="{ record }">
            <strong>{{ record.name }}</strong>
            <p>{{ record.category }} paper</p>
        </template>
    </DataView>
</template>`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <DocsCallout variant="note">
                <template #title>Temporary design laboratory</template>
                Front Awesome has no public DataView export. This page records the proposed design
                and runs a documentation-only renderer against the local Dapter preview.
            </DocsCallout>
            <ProseSection id="one-adapter" title="One adapter for every layout">
                <p>
                    Dapter owns the source, authorization, requests, decoded records, and paging.
                    Front Awesome gives readers controls for those operations and a choice of
                    layouts. The integration goal is to cover every supported Dapter capability,
                    including capabilities added after offset paging. Each new capability needs a
                    working example and a behavior test, or a documented reason it is unavailable
                    for a source or layout.
                </p>
                <p>
                    In the lab, one mounted <code>DataAdapter</code> supplies all layouts. Its
                    source and <code>decodeRow</code> function keep the same identity when the
                    reader changes layouts. Changing either input resets the adapter. A layout
                    switch preserves the requested state, accepted page, and any in-flight request.
                </p>
                <p>
                    The proposed DataView must support both Dapter ownership modes. With
                    <code>source</code>, each DataView owns an independent adapter, even if another
                    view names the same source. With <code>:adapter="catalog"</code>, it uses the
                    exact handle supplied by the caller, including its decoder and request
                    lifecycle. If the owner's reactive source changes, every bound layout follows
                    the same handle to the new source's first page.
                </p>
            </ProseSection>
            <ProseSection id="compare-layouts" title="The same page in three layouts">
                <p>
                    This catalog runs here with a guest-accessible Collection of 23 fictional
                    notebooks. Select <strong>Start catalog</strong>, then <strong>Next</strong>.
                    The table shows Notebook 06 through Notebook 10. Select
                    <strong>Cards</strong> or <strong>List</strong>
                    to see those five records on page 2 without another data request.
                </p>
                <p>
                    Open <strong>Layout settings and adapter state</strong> and choose
                    <strong>Table only</strong>. The layout switch disappears. Choose
                    <strong>Cards only</strong> to render records without columns. To try the access
                    error, select <strong>Reset</strong>, then <strong>Try denied source</strong>.
                    Dapter returns a denial and the view clears the records.
                </p>
                <p>
                    To reproduce the listing in a Laravel, Inertia, and Vue application, follow
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    and
                    <DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                        >Install Front Awesome</DocsLink
                    >. Complete Composer setup before installing frontend dependencies. The
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/listing').href"
                        >Dapter listing guide</DocsLink
                    >
                    includes the source declarations, web middleware, Ziggy route, and demo guards.
                </p>
            </ProseSection>
            <DataViewDemo />
            <ProseSection id="columns-and-slots" title="Columns in code, cells in Vue">
                <p>
                    An ordered array declares table columns. Each column has a stable ID, a visible
                    label, and a field for the default text. A named Vue slot can replace one cell's
                    contents. For example, <code>#cell-paper</code> renders a tag while the notebook
                    column still uses its default. Cards and lists receive a whole record in a slot.
                    A catalog can offer either of those layouts without declaring any columns.
                </p>
                <CodeExample
                    label="Proposed API sketch (unavailable in Front Awesome)"
                    language="vue"
                    :code="example" />
                <p>
                    Column order, density, striping, and merged cells belong to the table. Cards use
                    a CSS grid of list items. The table uses native column headers and cells. A
                    layout switch is available only when the application configures two or more
                    usable layouts. The lab keys each notebook by its fixed <code>id</code>. Its
                    private renderer takes a list of layout names. The sketch proposes a
                    configuration object with columns inside <code>views.table</code> and a
                    <code>#grid-item</code> slot for each card. Configurable row identity and this
                    public API remain proposals.
                </p>
            </ProseSection>
            <ProseSection id="dapter-coverage" title="Dapter capability coverage">
                <p>
                    All layouts render Dapter's accepted records in server order. Source permissions
                    and supported operations belong to Dapter. A hidden column can still represent a
                    searchable field, and a displayed value may have no server operation at all.
                </p>
                <DocsTable caption="Dapter integration status">
                    <thead>
                        <tr>
                            <th scope="col">Capability</th>
                            <th scope="col">Dapter support and DataView design</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">Offset listing</th>
                            <td>
                                The local preview decodes rows, exposes loading and errors, and
                                distinguishes requested from accepted state. First, previous, next,
                                last, direct page, page size, and reload all call the adapter.
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Shared handles and reactive sources</th>
                            <td>
                                Available in the local Dapter preview.
                                <code>useDataAdapter</code> accepts a source string, a Vue ref or
                                getter with a stable ID, or an existing handle. Binding a handle to
                                <code>DataAdapter</code>
                                shares its state without a second initial request. Try the
                                <DocsLink
                                    :href="findNavigationItem(navigation, 'dapter/composable').href"
                                    >shared adapter examples</DocsLink
                                >.
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Search, filters, and order</th>
                            <td>
                                Planned in Dapter. Field and global controls need public capability
                                metadata, including named filters with their accepted values and
                                ordering presets. A column declaration cannot grant an operation.
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">URL and browser history</th>
                            <td>
                                Planned in Dapter. Once Dapter can restore a query from the URL or
                                browser history, each layout must render the restored state.
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Other paging modes and retrieval</th>
                            <td>
                                Simple and cursor paging, infinite loading, and source-specific
                                comparisons remain roadmap work. Advanced retrieval and snapshots
                                are research topics. Controls must respect what the source can
                                report, including whether it knows a final page.
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Authorized actions</th>
                            <td>
                                Planned in Dapter. A row action can present Dapter's declared
                                operation and result once its public authorization and transport
                                contract exists. Application code owns business rules such as
                                changing a cart quantity.
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Live updates and polling</th>
                            <td>
                                Planned in Dapter. Each layout must follow the adapter's accepted
                                replacements and failure handling when those operations arrive.
                            </td>
                        </tr>
                    </tbody>
                </DocsTable>
                <p>
                    The
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/roadmap').href"
                        >Dapter roadmap</DocsLink
                    >
                    tracks delivery and source-specific limits. The laboratory exposes no local
                    search, filtering, sorting, or pagination over the current page.
                </p>
            </ProseSection>
            <ProseSection id="review-next" title="Questions for the next iteration">
                <ul>
                    <li>
                        Selection should follow stable record IDs across layout changes. Define what
                        happens when a page, query, or access permission changes before adding
                        selection controls.
                    </li>
                    <li>
                        A group or row span can end at a page boundary. Define whether the source
                        knows the complete group before offering counts or merging table cells.
                        Lists and cards need their own group presentation.
                    </li>
                    <li>
                        Repeat the page-switch exercise during a pending request, in the compact
                        frame, and with a denied source. A layout change must preserve the adapter's
                        response and error handling.
                    </li>
                </ul>
            </ProseSection>
        </div>
    </article>
</template>
