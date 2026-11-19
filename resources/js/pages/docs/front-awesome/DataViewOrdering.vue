<script setup>
import ComparisonDemo from '@/components/demo/front-awesome/data-view/ComparisonDemo.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import CapabilityDemo from '@/components/demo/front-awesome/data-view/CapabilityDemo.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
const configuration = `import { createFrontAwesome } from '@artisan-toolbox/front-awesome';

app.use(createFrontAwesome({
    dataView: {
        multiSortKey: 'shift',
        sortIcons: {
            family: 'classic',
            variant: 'solid',
            ascending: { name: 'arrow-up' },
            descending: '↓',
            unsorted: '↕',
        },
    },
}));`;
const header = `<DataView :adapter="catalog" :views="views" row-key="id">
    <template #head-name="{ name, sortDirection }">
        <span>{{ name }}</span>
        <span aria-hidden="true">{{ sortDirection }}</span>
    </template>
</DataView>`;
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
                ><template #title>Beta availability</template>The multi-term editor is available in
                Front Awesome 1.0.0-beta.4. See
                <DocsLink
                    :href="findNavigationItem(navigation, 'front-awesome/data-view/reference').href"
                    >DataView release availability</DocsLink
                >.</DocsCallout
            >
            <ProseSection id="sort-priority" title="Choose fields and priority">
                <p>
                    Start the composed catalog. Open Ordering. Choose Natural ascending for the name
                    field. Within the first fixed rank, Notebook 2 precedes Notebook 10. Add
                    quantity as a numeric descending secondary term. The source accepts two terms.
                    Edit either at the limit or remove a term before adding rank.
                </p>
                <p>
                    The order editor includes rank although the table does not display it. The same
                    editor works on a touch screen or in a view without columns. An orderBy alias on
                    a table column enables its header only when the source permits that operation.
                </p>
                <CapabilityDemo />
            </ProseSection>
            <ProseSection id="header-controls" title="Configure header sorting">
                <p>
                    Hold Command on macOS or Control on Windows and Linux while clicking an
                    orderable header to combine terms. A regular click selects the clicked field
                    alone. If that field was at its last allowed direction in a multi-term order, it
                    restarts at its first direction instead of leaving another field as the primary
                    order. With one term, regular clicks continue through the permitted directions
                    and then clear. A modifier click at the last direction removes only that field.
                </p>
                <p>
                    Configure presentation once in your application's existing Vue bootstrap with
                    createFrontAwesome. multiSortKey accepts auto, meta, ctrl, shift, or alt. The
                    default auto selects the platform key after mount and uses Control on the
                    server. The touch-accessible Ordering editor remains available without a key.
                </p>
                <CodeExample
                    label="Configure sort keys and icons"
                    language="js"
                    :code="configuration" />
                <p>
                    Sortable headers use Font Awesome classic solid sort, sort-up, and sort-down by
                    default. sortIcons.family and variant select the native Font Awesome family and
                    style. Each ascending, descending, or unsorted entry accepts an icon name object
                    with optional family and variant, or a literal character string. Strings render
                    as text. Pro families require your application's licensed kit. These settings
                    belong to the plugin and do not change server order capabilities. An empty
                    string hides that direction's glyph. Invalid modifier values or malformed icon
                    descriptors throw TypeError when creating the plugin.
                </p>
            </ProseSection>
            <ProseSection id="head-slots" title="Replace header content while retaining sorting">
                <p>
                    The snippet uses catalog and views from CapabilitySession above. Use head-ID,
                    matching the column ID used by cell-ID. The name prop is the configured column
                    label. sortDirection is null when sorting is unavailable, 0 when available but
                    unselected, 1 for ascending, and -1 for descending. The scope also includes
                    column, adapter, view, and selection. The new slot replaces the label, icon, and
                    priority inside the existing sorting button. DataView retains keyboard
                    activation, modifier handling, pending feedback, and the accepted primary
                    aria-sort value. sortDirection follows the requested state immediately; while a
                    request is pending, aria-sort continues to describe the accepted result.
                </p>
                <CodeExample label="Customize the name header" language="vue" :code="header" />
                <p>
                    Start the catalog above. Notebook displays its numeric direction, while Status
                    displays an unavailable marker. Quantity retains the default Font Awesome icon.
                    The existing header-ID slot still replaces the complete header contents and
                    takes precedence over head-ID. A full replacement owns its interactive controls.
                </p>
            </ProseSection>
            <ProseSection id="presets-and-defaults" title="Restore a server order">
                <p>
                    Choose <strong>Newest first</strong> in <strong>Order preset</strong> to replace
                    the active terms. Inspect the requested state for the preset ID. Manual field
                    ordering shows <strong>No preset</strong>. Clearing a preset leaves manual field
                    terms alone. Restore catalog defaults to return to the source order. Fixed rank
                    and identity tie-breakers belong to the server. See
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/multi-order').href"
                        >multi-order declarations</DocsLink
                    >.
                </p>
            </ProseSection>
            <ProseSection id="comparison-order" title="Use a declared collation">
                <p>
                    This collection uses PHP’s intl extension and a fixed pt-BR locale. Start the
                    example, open Ordering, choose Locale and Ascending for name, then replace the
                    order. The server returns IDs 4, 3, 1, 2, 6, and 5. Choose Text to compare the
                    same inputs. See
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/collection-comparisons').href"
                        >collection comparisons</DocsLink
                    >.
                </p>
                <ComparisonDemo mode="locale" />
                <p>
                    Continue with
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'front-awesome/data-view/selection').href
                        "
                        >Select and group rows</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
