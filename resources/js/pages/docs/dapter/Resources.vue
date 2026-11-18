<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import projection from '../../../../../app/Demo/Dapter/Resources/NotebookResource.php?raw';
import ResourceDemo from '@/components/demo/dapter/resources/ResourceDemo.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
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
            <ProseSection id="starting-environment" title="Choose what the reader sees">
                <p>
                    Use a
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/sources').href"
                        >declared source</DocsLink
                    >
                    in a Laravel application with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Dapter installed</DocsLink
                    >. Keep the web session, CSRF middleware, and <code>dapter.data</code> route. A
                    read can project rows without Echo or a queue worker.
                </p>
            </ProseSection>
            <ProseSection id="declare-resource" title="Project one notebook">
                <p>
                    The raw row has <code>id: 1</code>, <code>name: Notebook 01</code>, and a
                    server-only secret. This Laravel Resource returns the name and two
                    reader-specific details. Its output omits the ID and secret.
                </p>
                <CodeExample language="php" label="NotebookResource.php" :code="projection" />
                <p>
                    In the source’s <code>options()</code> method, return
                    <code
                        >StoreOptions::make()->publicAccess()->useResource(NotebookResource::class)</code
                    >. The equivalent attribute is
                    <code>#[UseResource(NotebookResource::class)]</code>. Use an instantiable
                    <code>JsonResource</code> subclass for each row. View source includes the source
                    and both Resource classes.
                </p>
            </ProseSection>

            <ProseSection id="expected-result" title="Read the projected result">
                <p>
                    Select <strong>Start example</strong>. The guest sees Notebook 01, Reader guest,
                    and Nested guest. Both read protocols support Resource projection. Protocol 1
                    keeps its usual envelope. In protocol 2, <code>decodeRow</code> receives
                    projected data only.
                </p>
            </ProseSection>
            <ResourceDemo scenario="ResourceFluent" />
            <ResourceDemo scenario="ResourceAttributes" />
            <ProseSection id="explicit-reader" title="Use the selected reader"
                ><p>
                    Resolve each Resource with its supplied Request. Nested Resources receive that
                    same selected reader, including queued recipient projection. Do not use ambient
                    auth(), request(), a shared tenant singleton, or Resource wrapping changes to
                    decide visibility. Raw identifiers and revisions are extracted before
                    projection. Existing action policies still inspect the raw row. Explicit
                    metadata selection discloses an identifier even when the Resource body omits it.
                </p>
                <p>
                    Each projected row supports up to 100 levels of nesting. Dapter rejects cycles,
                    invalid Unicode, unsafe numbers, invalid JSON, and unsupported deferred objects.
                </p></ProseSection
            >
            <ProseSection id="next-guide" title="Use the projection with live updates">
                <p>
                    For updates targeted to a reader,
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/live-authorization').href"
                        >authorize the live source and its channel</DocsLink
                    >. The recipient’s request supplies the projection context.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
