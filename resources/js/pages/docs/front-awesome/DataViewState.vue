<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import OwnerDemo from '@/components/demo/front-awesome/data-view/OwnerDemo.vue';
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
            <ProseSection id="one-adapter" title="One adapter for every layout">
                <p>
                    This example uses Dapter 1.0.0-beta.2 and Front Awesome 1.0.0-beta.4. The
                    application creates one handle with
                    <code>useDataAdapter(source, options)</code>. The handle owns the requested
                    query, accepted rows, permissions, network work, and errors. A borrowed DataView
                    can change its presentation during a pending read. Both a table and a sibling
                    list then receive the same accepted response.
                </p>
                <p>
                    The owner saves its accepted criteria in localStorage and puts only a UUID under
                    <code>saved_catalog.saved-notebooks</code> in the URL. Start the example and
                    scroll inside the table. Select <strong>Next saved page</strong>. Both views now
                    display pencil records and the region returns to the top. Use Back to restore
                    the notebooks and the saved scroll position. Apply the paper snapshot to request
                    both paper records. Restore server defaults to send a source-only request.
                    Select Create share URL to export the accepted criteria through
                    <code>catalog.share()</code>. A borrowed DataView uses this same Dapter handle,
                    including its TTL, version, and share behavior. Layout, selection, and
                    disclosure state stay in Vue.
                </p>
                <OwnerDemo />
            </ProseSection>
            <ProseSection id="context-and-recovery" title="Accepted state after a failure">
                <p>
                    During a recoverable read failure, previously accepted records can remain
                    visible. The request describes what the reader tried. The accepted state
                    describes the displayed result. Retry the read deliberately. An access or
                    terminal protocol failure withdraws data. An integration error describes a
                    separate client integration, such as a failed live subscription.
                </p>
                <p>
                    Configure URL, scroll, polling, Echo, search debounce, protocol, paging,
                    decoders, and action definitions on the creator. To change the handle passed to
                    a mounted DataView, remount the view with a new key. See
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/composable').href"
                        >shared adapters</DocsLink
                    >
                    and
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/vue-navigation').href"
                        >Vue navigation</DocsLink
                    >.
                </p>
                <p>
                    Continue with
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'front-awesome/data-view/live-updates')
                                .href
                        "
                        >Refresh projected rows</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
