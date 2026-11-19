<script setup>
import VueDefinitionDemo from '@/components/demo/dapter/vue/VueDefinitionDemo.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
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
            <ProseSection id="starting-environment" title="Start with declared field controls"
                ><p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    and
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/vue-controls').href"
                        >Build declared Vue controls</DocsLink
                    >. The example uses the same fictional Collection and the public DataAdapter
                    export. Mounting the component starts a read, so this frame mounts it only after
                    Start definition. This example uses Dapter 1.0.0-beta.2.
                </p></ProseSection
            >
            <ProseSection id="decode-definitions" title="Narrow the authorized definition"
                ><p>
                    <code>decodeRow</code> validates individual unknown records.
                    <code>decodeDefinition</code> independently receives a detached, deeply readonly
                    parsed definition. It may narrow server-authorized fields, named filters, and
                    allowed values. It cannot add fields, widen capabilities, or remove an active
                    selection from the definition. A rejected decoder output rejects the whole
                    response.
                </p>
                <p>
                    The example retains only the name field and the contains match type. The row
                    decoder retains id, name, and category. The visible category column does not
                    grant category filtering. Operation names come from the server definition, never
                    from row keys.
                </p>
                <p>
                    <code>definition</code> and <code>capabilities</code> expose the same accepted
                    parsed definition. <code>fields</code>, <code>global</code>, and
                    <code>metadata</code> stay null until the first authorized version 2 response.
                    Version 1 leaves these views null. This example declares no live source, so
                    version 2 reports unidentified records and a null channel.
                </p></ProseSection
            >
            <ProseSection id="try-narrowing" title="Observe independent row and operation contracts"
                ><p>
                    Select Start definition. The table includes category values, while category,
                    active, score, and optional filter buttons are absent. Search offers contains
                    only. Name descending still works because the decoder retains the declared name
                    order. Scroll inside the bounded region and select Next narrowed page. That
                    region resets after the winning render. Reload narrowed page preserves its
                    position. Reset definition disposes the source owner.
                </p></ProseSection
            >
            <VueDefinitionDemo />
            <ProseSection id="ownership" title="Keep configuration with the owner"
                ><p>
                    Configure <code>decodeRow</code> and <code>decodeDefinition</code> on the
                    component that owns the source. With a composable owner, pass them in the
                    options after its source argument. The owner also supplies any action
                    definitions, paging settings, and live options. String, Ref, and getter
                    factories remain supported; reactive sources require an explicit id. Borrowing
                    with <code>useDataAdapter(handle)</code> and binding with
                    <code>&lt;DataAdapter :adapter="handle"&gt;</code> share that exact store.
                </p>
                <p>
                    A bound component cannot override owner configuration. Define decoder functions
                    once and reuse their references for compatible acquisitions. Keep ownership
                    mode, id, and a bound handle fixed while mounted; use a keyed remount to replace
                    them. Decoders and source may change reactively. Consumers can use
                    <code>DataAdapterHandle&lt;Row, Definition&gt;</code>; the second generic is
                    optional and existing single-generic handles remain valid.
                </p></ProseSection
            >
        </div>
    </article>
</template>
