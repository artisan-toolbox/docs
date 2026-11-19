<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import LiveDemo from '@/components/demo/front-awesome/data-view/LiveDemo.vue';
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
            <ProseSection id="poll-accepted-rows" title="Poll a fictional catalog">
                <p>
                    Start the polling example to create a short-lived fictional reader. Change its
                    fixture. The owner polls every 1.5 seconds while eligible. The next successful
                    read displays the changed name. Select a row before the change to see its
                    identity survive the replacement. Revoke access to clear the data and selection.
                    Stop disposes the owner.
                </p>
                <LiveDemo mode="polling" />
            </ProseSection>
            <ProseSection id="receive-a-replacement" title="Receive an authorized replacement">
                <p>
                    To reproduce these fixtures, add their named POST routes to routes/web.php and
                    call the supplied Configuration::register() from AppServiceProvider::boot().
                    Make demo.dapter.live.* and dapter.data available to Ziggy. For push delivery,
                    configure the application broadcaster, authorize the private channel, and run a
                    Redis worker on the demos queue. See
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/live-updates').href"
                        >live update setup</DocsLink
                    >. Start the example, wait for the private subscription acknowledgement, select
                    the first row, and publish a replacement. Check the actual row for Changed
                    notebook. An accepted producer response alone does not establish delivery.
                </p>
                <p>
                    The Resource omits the raw ID. Its revisioned record metadata supplies one
                    authorized identifier at each corresponding row index. The row-key callback uses
                    that identifier through a rename. Each of the two notebooks has a unique record
                    identity. Use a result tuple for joined rows that can share an identifier.
                    Connection errors and read errors appear separately.
                </p>
                <LiveDemo mode="push" />
                <p>
                    Polling works independently of subscriptions. See
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/polling').href"
                        >polling and visibility rules</DocsLink
                    >.
                </p>
                <p>
                    Continue with
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'front-awesome/data-view/reference').href
                        "
                        >DataView API reference</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
