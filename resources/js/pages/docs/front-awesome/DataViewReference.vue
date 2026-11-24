<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const contracts = [
    [
        'hideHeader, hideFooter (beta.9)',
        'Set either Boolean to omit that region, including its slots. Both default to false. Hiding the header also hides the layout switcher. A controlled view, row selection and read feedback still work.',
    ],
    [
        'View options (beta.9)',
        'The filter icon beside quick search opens one dialog. The source determines which Search, Filters, Sort, and Page settings sections appear. When two or more layouts are configured, the toolbar shows a separate layout switch above the results. Small badges below the quick search show each accepted filter value, field or global search, search grouping, sort term or preset, and an explicitly changed page size. The paginator shows the current position. Removing a control clears that setting. Keyboard focus moves to the next remaining control or back to View options. The footer keeps the result status and page navigation. Done or Escape returns focus to the opener.',
    ],
    [
        'DataViewSearch, DataViewFilter (beta.9)',
        'Import from @artisan-toolbox/front-awesome/data-view. Pass the existing adapter and an optional field to search. For a filter, pass its declared filter ID and, for a field filter, the field ID. Each control uses the operation advertised by its adapter.',
    ],
    [
        'DataViewStatus, DataViewPagination (beta.9)',
        'Pass the same adapter to show an accepted result summary and navigation independently. Offset pages can show a range and numbered navigation. Cursor and infinite sources expose their available traversal controls. Place both in a custom layout or replace the whole pagination slot.',
    ],
    [
        'adapter, views, rowKey',
        'Required. Pass one existing Dapter handle, an ordered layout object, and a decoded field name or callback returning a stable string or number. Replacing the handle requires a keyed remount.',
    ],
    [
        'view, update:view',
        'Optional controlled table, grid, or list. An unavailable layout falls back to the first effective layout.',
    ],
    [
        'size, label, caption',
        'Size is s, m, or l, default m. The default results label is Results. Caption optionally names the semantic table.',
    ],
    [
        'views.table.columns',
        'Field columns read a property. Accessor columns require id and accessor. Display-only columns use kind: display and an id. All require a label. align accepts start, center, or end. orderBy names a public server alias. Table also accepts striped, hover, and label.',
    ],
    [
        'views.grid, views.list',
        'Each accepts an optional label and requires its matching item slot. Declaration order controls layout availability and switch order.',
    ],
    [
        'groupBy',
        'One field or accessor column may specify true or a row-to-scalar callback. Only consecutive equal values share a table cell. Groups end at the loaded boundary.',
    ],
    [
        'selection, selectedKeys, update:selectedKeys',
        'Single or multiple mode. Omitting selection disables controls. Without a model, selection is local. v-model:selected-keys controls the array of occurrence keys. New accepted rows prune unavailable keys.',
    ],
    [
        'controlLabel',
        'Optional formatter for field, filter, option, or row. Filter and option subjects include field (null for global) and filter. Options also include the exact scalar value. Row subjects contain row, key, and index. Return undefined to use the built-in label. Interface text uses Front Awesome localization with English fallback.',
    ],
    [
        'toolbar, filters, actions',
        'toolbar replaces the built-in search, filters, ordering, presets, and default reset. In beta.9, replacing the toolbar leaves Page settings accessible from the default footer. The filters slot adds content after the toolbar. actions supplies explicit application-owned controls.',
    ],
    [
        'pagination, footer, loading, empty, error, integration-error',
        'Each scope includes the current view and the exact adapter. A pagination slot owns its replacement controls. An integration error and a read error have distinct slots.',
    ],
    [
        'stateLayout (beta.10)',
        'Accepts row (default) or replace. In table view, row displays loading, empty-source, or no-match feedback in one cell spanning every visible column, including selection. Replace hides the entire table while the message is visible. The loading and empty slots follow the selected layout. An infinite view keeps its loaded rows when appending more records.',
    ],
    [
        'Empty results (beta.10)',
        'A zero total identifies an empty source. A positive total with zero matches shows a search or filter hint. If counts are unavailable, an empty first page with accepted search or filter criteria and no adjacent pages also shows the hint. Other empty pages can report that this page has no records.',
    ],
    [
        'skeleton, skeletonRows, preserveSkeletonRows (beta.10)',
        'In table view, the skeleton slot takes precedence over the loading slot in both state layouts and keeps the headings visible. It receives adapter, view, selection, columns, and a zero-based index. Supply a td for each configured data column. DataView supplies the tr and any selection cell. Skeleton rows are decorative. A separate status announces loading to assistive technology. skeletonRows defaults to 5 and falls back to 5 for invalid counts. Use a positive safe integer. preserveSkeletonRows defaults to false. When enabled, it uses the number of rows on the last accepted page. A first load, a fresh source context, or a read after an empty page uses skeletonRows.',
    ],
    [
        'grid-item, list-item, cell-ID, head-ID, header-ID',
        'Items receive row, index, rowKey, and selected. Cells also receive column and value. head-ID receives column, name (the label), and sortDirection: null unavailable, 0 unselected, 1 ascending, -1 descending. It replaces content inside the sort button. header-ID replaces the whole header and takes precedence. These slots share the current view and adapter.',
    ],
    [
        'createFrontAwesome({ dataView })',
        'multiSortKey accepts auto, meta, ctrl, shift, or alt. Auto uses Command on macOS and Control elsewhere. sortIcons configures family, variant, ascending, descending, and unsorted. An entry is a literal text string or a Font Awesome name object with optional family and variant. Without a plugin, DataView uses the same defaults.',
    ],
    [
        'selection in slot scope',
        'Null when disabled. Otherwise mode, readonly keys and current rows in accepted order, has(key), set(key, selected), clear(). Multiple selection adds setAllLoaded(selected), allLoaded, and someLoaded. someLoaded means a strict nonempty subset.',
    ],
    [
        'DataViewSelection<Row, Key>, DataViewLabelSubject<Row, Key>',
        'The development entry exports both types. Narrow the selection mode before using multiple-only operations. Narrow kind to field, filter, option, or row before reading formatter properties. Key follows the return type of rowKey.',
    ],
    [
        'rowKey(row, index)',
        'A property key or callback must identify each loaded occurrence. Numeric 0 and string zero are distinct. A row index can identify an indistinguishable occurrence at its current position. Reordering changes positional identity.',
    ],
    [
        'DataViewColumn, DataViewViews, DataViewLayout, DataViewSize, DataViewRowKey, DataViewScope, DataViewItemScope, DataViewCellScope, DataViewHeadScope, DataViewSortDirection, DataViewSlots',
        'Public types are exported from @artisan-toolbox/front-awesome/data-view. A decoded row type determines fields, accessor input, and callback input. The concrete adapter retains definition, action, and paging types.',
    ],
];
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="review-next" title="Release availability">
                <p>
                    Front Awesome 1.0.0-beta.9 includes the redesigned toolbar, footer, and four
                    standalone controls. Beta.8 uses the original toolbar. Front Awesome
                    1.0.0-beta.10 adds feedback layouts and the skeleton slot. See
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'front-awesome/data-view/layouts').href +
                            '#table-feedback'
                        ">
                        Show loading and empty table states</DocsLink
                    >
                    for a runnable example.
                </p>
                <p>
                    Front Awesome 1.0.0-beta.4 introduced integrated field and global criteria, an
                    order editor, extended paging and recovery, selection, grouped cells, and
                    indexed row keys. Dapter 1.0.0-beta.2 supplies the adapter.
                </p>
            </ProseSection>
            <ProseSection id="dapter-coverage" title="DataView presentation props and slots">
                <DocsTable
                    caption="DataView presentation props and slots"
                    :columns="['Public API', 'Contract']"
                    :rows="contracts" />
            </ProseSection>
            <ProseSection id="owner-options" title="Dapter owner options">
                <p>
                    Protocol 1 supports offset reads and declared actions. Protocol 2 negotiates
                    source paging, state restoration, live and polling integrations, and infinite
                    accumulation. Request policy, history, scroll containers, and the server’s
                    declaration stay on the adapter. DataView renders those capabilities and does
                    not define a separate query or action endpoint.
                </p>
                <p>
                    See
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/vue-controls').href"
                        >Dapter Vue controls</DocsLink
                    >,
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/actions').href"
                        >action transports</DocsLink
                    >, and
                    <DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/localization').href"
                        >Front Awesome localization</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
