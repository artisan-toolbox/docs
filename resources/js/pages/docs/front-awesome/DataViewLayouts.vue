<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PressroomDemo from '@/components/demo/front-awesome/data-view/PressroomDemo.vue';
import DataViewDemo from '@/components/demo/front-awesome/data-view/DataViewDemo.vue';
import TableFeedbackDemo from '@/components/demo/front-awesome/data-view/TableFeedbackDemo.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    pressroomPreview: { type: Object, required: true },
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="compare-layouts" title="Switch layouts on the same page">
                <p>
                    Select <strong>Start catalog</strong> and then <strong>Next</strong>. This
                    source declares five rows per page. Use the layout buttons above the results to
                    switch to Grid or List while the next page loads. In those layouts, you see the
                    five accepted records until Notebook 06 through Notebook 10 arrive. Changing the
                    layout sends no request.
                </p>
                <p>
                    Open <strong>Layout settings and adapter state</strong>. Choose Table only or
                    Grid only to remove the switch. Reset and try the denied source to see Dapter
                    withdraw access.
                </p>
                <DataViewDemo />
                <p>
                    When the table is wider than its container, scroll sideways to see the remaining
                    columns. That viewport follows the
                    <DocsLink :href="findNavigationItem(navigation, 'front-awesome/scrollbar').href"
                        >app scrollbar color</DocsLink
                    >.
                </p>
            </ProseSection>
            <ProseSection id="columns-and-slots" title="Render a header, cell, or item">
                <p>
                    Declare layouts in the order you want their buttons to appear. Give table a
                    columns array. Supply a grid-item or list-item slot for each matching layout.
                    With one effective layout the switch disappears.
                </p>
                <p>
                    A field column reads a decoded property. Give a computed value an accessor and a
                    unique id. Use a display column for content you render entirely in a slot. Name
                    the slot <code>#cell-ID</code> for a body cell. The <code>#head-ID</code> slot
                    replaces header content inside the built-in sorting button and receives the
                    label and numeric sort direction. The existing <code>#header-ID</code> slot
                    replaces its complete header, including the sort button. Give that full
                    replacement its own sorting control when needed. The Vue file in the source
                    panel renders a paper tag, a grid item, and a list item.
                </p>
            </ProseSection>
            <ProseSection id="table-feedback" title="Show loading and empty table states">
                <p>
                    Starting in Front Awesome 1.0.0-beta.10, a table keeps its column headings
                    during a read. One cell spans the columns, including the selection column, and
                    centers the spinner and loading message. An empty catalog shows “No records
                    yet”. A search with no matches shows “No matching records”. The
                    <code>#loading</code> and <code>#empty</code> slots let you supply your own
                    messages.
                </p>
                <ol class="list-decimal space-y-2 pl-5">
                    <li>
                        Choose <strong>Open notebook catalog</strong>, then
                        <strong>Search for envelopes</strong>. The example delays the search for 1.5
                        seconds so you can see the loading row. The four notebooks on the page give
                        way to a single message under the headings.
                    </li>
                    <li>
                        Set <strong>Table feedback</strong> to <strong>Replace the table</strong>.
                        The no-match message now occupies the whole results area. Choose
                        <strong>Open empty catalog</strong> to see the message for a source with
                        zero records.
                    </li>
                    <li>
                        Reopen the notebook catalog, select <strong>Use skeleton rows</strong>, then
                        search for envelopes again. Four placeholder rows appear beneath the
                        headings, even in replacement mode. Once the search finishes, choose
                        <strong>Clear search</strong> to restore the notebooks.
                    </li>
                </ol>
                <TableFeedbackDemo />
                <p>
                    Use <code>state-layout="replace"</code> to hide the table during feedback. To
                    draw your own loading rows, supply
                    <code>#skeleton="{ columns, index }"</code> and render a
                    <code>&lt;td&gt;</code> for each data column. DataView creates each
                    <code>&lt;tr&gt;</code> and adds a selection cell when selection is enabled. The
                    zero-based index lets this example vary the width of the notebook placeholders.
                </p>
                <p>
                    The example sets <code>:skeleton-rows="2"</code> for a first load or a read
                    after an empty page. With <code>preserve-skeleton-rows</code>, a later read uses
                    the number of rows on the last accepted page. A short final page therefore
                    produces fewer placeholders.
                </p>
            </ProseSection>
            <ProseSection id="compose-controls" title="Place controls beside a ticket list">
                <p>
                    This example requires Front Awesome beta.9 or later. Pass one
                    <code>useDataAdapter</code> handle to <code>DataViewSearch</code>,
                    <code>DataViewFilter</code>, and the list. Set <code>hide-header</code> and
                    <code>hide-footer</code> on DataView. Mount <code>DataViewStatus</code> and
                    <code>DataViewPagination</code> below it to show one summary and one navigation
                    area.
                </p>
                <p>
                    Open the ticket list. Apply <strong>Waiting</strong> in the status filter. The
                    list shows four tickets. Search for <strong>foil</strong> to find PR-416. Open
                    an independent queue to see the original twelve tickets while the first queue
                    keeps its search and filter.
                </p>
                <PressroomDemo :preview="pressroomPreview" sidebar />
                <p>
                    Continue with
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'front-awesome/data-view/query-controls')
                                .href
                        "
                        >Search and filter records</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
