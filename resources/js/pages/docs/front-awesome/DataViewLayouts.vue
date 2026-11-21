<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PressroomDemo from '@/components/demo/front-awesome/data-view/PressroomDemo.vue';
import DataViewDemo from '@/components/demo/front-awesome/data-view/DataViewDemo.vue';
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
                    switch to Grid or List while the next page loads. You see the same five accepted
                    records until Notebook 06 through Notebook 10 arrive. Changing the layout sends
                    no request.
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
            <ProseSection id="compose-controls" title="Place controls beside a ticket list">
                <p>
                    This example uses the local Front Awesome preview. Pass one
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
