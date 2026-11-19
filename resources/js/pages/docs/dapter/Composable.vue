<script setup>
import GetterDemo from '@/components/demo/dapter/composable/GetterDemo.vue';
import SharedAdapterDemo from '@/components/demo/dapter/composable/SharedAdapterDemo.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const factories = `import { computed, ref } from 'vue';
import { useDataAdapter } from '@artisan-toolbox/dapter';

const catalog = useDataAdapter('Dapter.Quickstart');
const independent = useDataAdapter('Dapter.Quickstart', { id: 'review' });
const currentPage = computed(() => catalog.paging.current);

const source = ref('Dapter.Quickstart');
const reactiveCatalog = useDataAdapter(source, { id: 'active-catalog' });
// A getter also works. Reactive sources require an explicit id.
const getterCatalog = useDataAdapter(() => source.value, { id: 'getter-catalog' });`;
const typed = `import { useDataAdapter, type DataAdapterHandle } from '@artisan-toolbox/dapter';

type Product = { id: number; name: string; category: string };
function decodeProduct(value: unknown): Product {
    if (value === null || typeof value !== 'object' ||
        !('id' in value) || typeof value.id !== 'number' || !Number.isSafeInteger(value.id) ||
        !('name' in value) || typeof value.name !== 'string' ||
        !('category' in value) || typeof value.category !== 'string') {
        throw new Error('Expected a catalog product.');
    }
    return { id: value.id, name: value.name, category: value.category };
}
const catalog: DataAdapterHandle<Product> = useDataAdapter('Dapter.Quickstart', { decodeRow: decodeProduct });`;
const binding = `<script setup>
import { DataAdapter, useDataAdapter } from '@artisan-toolbox/dapter';
const catalog = useDataAdapter('Dapter.Quickstart');
\x3C/script>

<template>
    <DataAdapter :adapter="catalog" v-slot="adapter">
        <pre v-if="adapter.ready">{{ adapter.data }}</pre>
    </DataAdapter>
</template>`;
const borrowing = `<script setup>
import { useDataAdapter } from '@artisan-toolbox/dapter';
const props = defineProps({ adapter: { type: Object, required: true } });
const catalog = useDataAdapter(props.adapter);
\x3C/script>

<template>
    <p>Current page {{ catalog.paging.current }}</p>
</template>`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Start with a working catalog">
                <p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    and
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/listing').href"
                        >Read and paginate a source</DocsLink
                    >. The examples use the public Dapter Vue export in an existing Inertia page.
                    Apply the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/installation').href +
                            '#vite-config'
                        "
                        >required Vue source configuration</DocsLink
                    >
                    before sharing a handle in development.
                </p>
                <p>
                    Use <code>useDataAdapter</code> in component setup when a host needs to own
                    paging state outside the headless component. The returned
                    <code>DataAdapterHandle&lt;Row&gt;</code> exposes the same data, accepted state,
                    error, readiness, and paging controls as the component slot.
                </p>
            </ProseSection>
            <ProseSection id="create" title="Create a named adapter">
                <p>
                    A string source creates an adapter for that source. An explicit
                    <code>id</code> distinguishes stores, so the same source can power independent
                    views. A reactive Ref or getter requires an explicit id. Changing its source
                    clears the old source state and requests the new first page.
                </p>
                <CodeExample
                    label="String, independent, Ref, and getter factories"
                    language="js"
                    :code="factories" />
                <p>
                    Repeated compatible requests in one host reuse that host's store. The nearest
                    owner provides its store to descendants. A child can create another store with a
                    distinct id. These are component-scoped stores, not a global application cache.
                </p>
                <p>
                    The handle is a stable reactive object with readonly state and imperative paging
                    methods. Read properties through the handle. To keep a destructured projection
                    reactive, use <code>computed(() =&gt; catalog.paging.current)</code> rather than
                    saving its current number.
                </p>
                <p>
                    With protocol 1, a saved paging command, page-size setter,
                    <code>resetState</code>, or <code>resetContext</code> belongs to the owner
                    context that supplied it. You can reuse it after ordinary reads. After a context
                    change or unmount, calling the saved function returns
                    <code>{ status: 'superseded' }</code> without issuing a read.
                </p>
            </ProseSection>
            <ProseSection id="bind" title="Bind the component to its owner">
                <p>
                    Pass the handle through <code>adapter</code> to render the owner's exact store.
                    The component does not issue an additional initial request. A mounted bound view
                    keeps the same handle identity. To switch handles, recreate the view with
                    <code>:key="selectedStoreId"</code>, using your stable application id as the
                    key. Replacing its handle directly fails and detaches the view without canceling
                    its owner. The bound form accepts the handle alone. Configure the source,
                    decoders, paging, actions, live updates, and other options on the owner.
                </p>
                <CodeExample label="Bind the headless component" language="vue" :code="binding" />
                <p>
                    For a component-owned isolated store, keep using
                    <code>&lt;DataAdapter source="Dapter.Quickstart" id="catalog"&gt;</code>. It can
                    also accept <code>decodeRow</code>. For explicit protocol 2 field controls and
                    independent definition decoding, follow
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/vue-controls').href"
                        >Build declared Vue controls</DocsLink
                    >. Mounting a second source-owned component creates a separate store. Keep its
                    id and ownership mode fixed while mounted. Changing the id or switching between
                    source ownership and a bound handle requires a keyed remount. An invalid
                    source-owner change detaches the view and cancels only its owned store. The
                    source and decoder themselves remain reactive.
                </p>
            </ProseSection>
            <ProseSection id="run-shared" title="Operate the shared store">
                <p>
                    Select <strong>Start example</strong>. Two five-row stores request their first
                    pages. Select <strong>Next from host</strong>. The host, child controls, and
                    grid move to page 2 together. The independent store remains on page 1.
                </p>
                <p>
                    Select <strong>Use ten-row source</strong>. The shared store changes its
                    reactive source and displays page 1 with ten rows. The independent five-row
                    store keeps its own page. <strong>Reload from child</strong> reloads only the
                    shared store. <strong>Reset</strong> disposes both owners and cancels active
                    work.
                </p>
            </ProseSection>
            <SharedAdapterDemo />
            <ProseSection id="getter" title="Follow a reactive getter">
                <p>
                    Start this source-only example to display ten rows. Select
                    <strong>Next getter page</strong>, then <strong>Use five-row source</strong>.
                    The getter changes the source and returns to page 1 with five rows. Its explicit
                    id keeps the store's identity stable.
                </p>
            </ProseSection>
            <GetterDemo />
            <ProseSection id="borrow" title="Borrow the handle in a child">
                <p>
                    Pass the handle as a prop, then call <code>useDataAdapter(handle)</code> in the
                    child. The child borrows the same typed store and does not own another request
                    lifecycle. Releasing the child leaves the owner active. Disposing the owner
                    stops its work, even when a borrower still holds the handle.
                </p>
                <CodeExample label="Borrow the parent's handle" language="vue" :code="borrowing" />
            </ProseSection>
            <ProseSection id="decode" title="Decode application rows">
                <p>
                    Use the factory's <code>decodeRow</code> option to validate unknown server rows
                    and infer your row type. Reusing one store requires the same decoder function
                    reference. Define the decoder once and pass the same function to compatible
                    acquisitions. Conflicting source or decoder declarations fail instead of
                    silently replacing another view's contract.
                </p>
                <CodeExample label="Decode a typed product handle" language="ts" :code="typed" />
                <p>
                    A decoder rejects the whole response when any row fails. Read
                    <code>error</code> to display the failure and call
                    <code>paging.reload()</code> to retry after correcting the data or decoder. See
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/sources').href + '#decode-rows'
                        "
                        >row serialization limits</DocsLink
                    >
                    before converting wire values into application objects.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
