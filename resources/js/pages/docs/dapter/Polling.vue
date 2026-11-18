<script setup>
import LiveDemo from '@/components/demo/dapter/live/LiveDemo.vue';
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
            <ProseSection id="starting-environment" title="Prepare HTTP-only polling"
                ><p>
                    Start with a
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/listing').href"
                        >working paginated source</DocsLink
                    >. This example requires the web session, CSRF middleware, and dapter.data
                    route. It needs no Echo, broadcaster, or worker. Polling and broadcasting are
                    independent. The unpublished preview requires explicit protocol: 2 for either
                    opt-in. Protocol 1 remains the default and rejects active integrations.
                </p></ProseSection
            >
            <ProseSection id="interval" title="Choose one bounded interval"
                ><p>
                    Pass polling: { interval: 1500 } to useDataAdapter or DataAdapter. The exact
                    interval object accepts a finite number above zero and at most 2147483647
                    milliseconds. Fractional values follow browser timer rounding. false is the
                    default and creates no timer or extra request. Bound views borrow the owner and
                    cannot override echo or polling. The fixed example mounts only after Start.
                </p></ProseSection
            >
            <ProseSection id="expected-result" title="Observe the next scheduled read"
                ><p>
                    Start LivePolling. The first result contains Notebook 01 and Notebook 02. Change
                    fixture only changes the isolated fictional rows without broadcasting. The next
                    polling read shows Changed notebook 2. Reload explicitly uses the latest
                    requested search, filters, order, size, and ordinary position, including
                    retained failed edits. Polling uses that same requested state. See
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/infinite-loading').href"
                        >append pages to a list</DocsLink
                    >
                    for accumulated windows.
                </p></ProseSection
            >
            <LiveDemo scenario="LivePolling" />
            <ProseSection id="settlement" title="Wait for interactive work and rendering"
                ><p>
                    The owner has one setTimeout. Interactive intent cancels it. A tick skips
                    pending, debounced, or settling work without flushing a search or starting
                    overlapping HTTP. The next interval begins after guarded browser publication,
                    Vue rendering, buffered replay, and final rendering settle. Hidden, offline,
                    failure-paused, and disposed owners have no polling timer. Returning online or
                    visible schedules one future interval without catch-up requests.
                </p></ProseSection
            >
            <ProseSection id="retry" title="Resume deliberately after a failure"
                ><p>
                    A read failure remains visible and pauses polling. A successful explicit retry
                    clears that pause. restartPolling clears the pause and schedules a future
                    interval after current settlement; it sends no immediate HTTP request. Disabled
                    polling makes restartPolling a no-op. Revoke fictional access demonstrates
                    cleared protected rows. Reset example disposes the owner and stops its timer.
                    Reset adapter context clears protected state before starting fresh defaults.
                </p></ProseSection
            >

            <LiveDemo scenario="LivePollingProps" />
            <ProseSection id="next-guide" title="Publish a change after a commit">
                <p>
                    When the application knows which loaded row changed,
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/live-updates').href"
                        >publish a committed row replacement</DocsLink
                    >
                    through its broadcaster.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
