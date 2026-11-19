<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ContextDemo from '@/components/demo/front-awesome/data-view/ContextDemo.vue';
import GroupsDemo from '@/components/demo/front-awesome/data-view/GroupsDemo.vue';
import JoinDemo from '@/components/demo/front-awesome/data-view/JoinDemo.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
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
                ><template #title>Beta availability</template>These controls are available in Front
                Awesome 1.0.0-beta.4. See
                <DocsLink
                    :href="findNavigationItem(navigation, 'front-awesome/data-view/reference').href"
                    >DataView release availability</DocsLink
                >.</DocsCallout
            >
            <ProseSection id="adjacent-groups" title="Select adjacent rows">
                <p>
                    Start the shelf example. The table receives A, A, B, A. A grouped data column
                    produces three row groups with spans of 2, 1, and 1. Both A runs stay in place.
                    The cell slot receives the first occurrence in each run. Other columns and
                    selection controls still represent every row. The list renders all four
                    occurrences.
                </p>
                <p>
                    Pick one notebook and switch to List. The selected key remains. Choose all
                    loaded rows to select four records. Go to the next page to remove the first
                    page’s keys. An infinite owner keeps selection across appended rows while those
                    occurrences remain loaded. Selecting rows makes no request.
                </p>
                <GroupsDemo />
            </ProseSection>
            <ProseSection id="joined-occurrences" title="Choose one joined line">
                <p>
                    This SQLite example creates a fictional order on each read. Two Notebook lines
                    share a product ID. A groupBy callback groups the product cell by that ID. The
                    cell slot receives the original object and renders the product name. The row-key
                    callback serializes the pair [record_id, line_id]. Select Notebook line 11 and
                    then Notebook line 12. Only the second line stays selected.
                </p>
                <JoinDemo />
            </ProseSection>
            <ProseSection
                id="controlled-selection"
                title="Keep preselection in its current context">
                <p>
                    Bind a string or numeric key array with <code>v-model:selected-keys</code>. An
                    initially supplied key takes effect only when an authorized occurrence arrives.
                    A mounted view clears withdrawn keys and ignores a parent that continues to
                    assert them. Acknowledge removal before deliberately adding the same key again.
                </p>
                <p>
                    Keep the parent model per source and tenant. Clear it before mounting a new
                    keyed owner. A new component cannot infer that the previous tenant selected an
                    identical ID. For a menu or write, resolve selected rows from the current scope
                    when the reader activates the command.
                </p>
                <p>
                    Start with key 1 preselected. Withdraw access and hold the old parent value.
                    Load the second catalog, which also has a key 1. Current selected rows stays
                    empty. Acknowledge removal, then select a current row. Start a fresh owner
                    clears the parent model before mounting a new handle.
                </p>
                <ContextDemo />
                <p>
                    Continue with
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'front-awesome/data-view/paging').href
                        "
                        >Page, append, and recover</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
