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
            <ProseSection id="choose-refresh" title="Choose how rows refresh">
                <p>
                    To refresh a listing on a timer, start with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/polling').href"
                        >HTTP polling</DocsLink
                    >. It repeats the current read and needs no broadcaster. To replace an already
                    loaded row after a committed change, use the broadcast example below.
                </p>
            </ProseSection>
            <ProseSection id="starting-environment" title="Prepare committed updates"
                ><p>
                    First
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/live-authorization').href"
                        >authorize a live source and its channel</DocsLink
                    >. Supply your application-owned Echo instance through echo with explicit
                    protocol: 2. Use a configured broadcaster and a queue worker for the selected
                    connection and queue. The examples use existing Reverb infrastructure and Redis
                    queue demos. Start a worker only through your application&#x27;s queue
                    operations procedure. The demo does not start a worker or create real accounts.
                </p></ProseSection
            >
            <ProseSection id="bound-producer" title="Bind a recipient and connection"
                ><p>
                    Authorize the mutation actor through your application policy. Obtain
                    DataStores::recipient(source, request), then DataStores::forRecipient(reference,
                    connection: namedMutationConnection). The server-only RecipientReference can
                    travel through a trusted application job. Keep intended recipients in
                    application code. Dapter does not enumerate subscribers. A reference preserves
                    identity and context, never an old authorization decision.
                </p></ProseSection
            >
            <ProseSection id="committed-update" title="Publish after the owning commit"
                ><p>
                    Inside the named mutation transaction, persist your application change and call
                    DataStore::update(identified: idOrList). Dapter waits for that connection&#x27;s
                    owning root commit. Nested or root rollback emits nothing. Without a transaction
                    it dispatches immediately. Collection sources also require the explicit mutation
                    connection. Cross-connection atomicity and read-replica consistency are
                    application responsibilities. The demo changes expiring fictional cache rows and
                    exercises a real named database transaction; the producer API itself never
                    persists rows.
                </p></ProseSection
            >
            <ProseSection id="replacement-only" title="Keep the accepted window stable"
                ><p>
                    Start LivePrivate, wait for private subscription, then Publish one replacement.
                    Changed notebook 2 replaces the first loaded row. Its position, page, counts,
                    URL, scroll, and action metadata remain unchanged. Publish batch deduplicates ID
                    1. Unknown ID and rollback emit no row event. No replacement inserts, deletes,
                    reorders, reconciles, or reloads. Explicit reload refreshes action metadata.
                    Missing Echo and subscription denial expose integrationError with no public
                    fallback. Disposal removes only the owner&#x27;s listener and keeps shared
                    application channels.
                </p></ProseSection
            >
            <LiveDemo scenario="LivePrivate" />
            <ProseSection id="lookup-limits" title="Reread the mandatory source"
                ><p>
                    Pass one safe integer or nonempty string, or a dense list of at most 100 inputs
                    before deduplication. String IDs have at most 1024 UTF-8 bytes. Integer 1
                    differs from string 1. An empty list does nothing. Duplicate typed IDs preserve
                    first-input order. The lookup retains mandatory scopes and removes transient
                    listing search, filters, order, counts, and paging. Unknown IDs and rows outside
                    mandatory scope emit nothing. There is no deletion signal. Custom drivers need
                    IdentityLookupDriver::identifiedRows before a live declaration is eligible.
                </p></ProseSection
            >
            <ProseSection id="queue-routing" title="Choose the delivery queue"
                ><p>
                    dapter.broadcasting.queue_connection and dapter.broadcasting.queue default to
                    null and use application queue defaults. Set them to the delivery worker&#x27;s
                    connection and queue. These examples snapshot the settings, select redis and
                    demos around update scheduling and commit, then restore them in finally. A
                    queued job contains encrypted recipient references, typed IDs, and stable event
                    IDs. It reconstructs current context and reauthorizes before acquiring or
                    projecting rows. HTTP and event output use the same Resource pipeline.
                </p></ProseSection
            >

            <ProseSection id="next-guide" title="Handle competing updates">
                <p>
                    For two replacements of the same row,
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/revision-races').href"
                        >compare revisions and recover from a failed update</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
