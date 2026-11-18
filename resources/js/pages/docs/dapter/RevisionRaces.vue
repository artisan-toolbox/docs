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
            <ProseSection id="starting-environment" title="Prepare revision checks"
                ><p>
                    Complete Publish committed row replacements first. Keep its guard, cache,
                    broadcaster, Echo instance, and delivery worker available. These fixed sources
                    use the same fictional notebooks. LiveIdentity declares a custom public identity
                    and canonical decimal revision. LiveArrival intentionally omits revisions.
                    LiveNative uses isolated SQLite, a private SQL selector, reverse identity
                    lookup, and a principal-specific GlobalAudience.
                </p></ProseSection
            >
            <ProseSection id="identity-revisions" title="Declare identity and revision providers"
                ><p>
                    RowIdentityProvider implements identify(rawRow), selector(), and
                    lookup(publicIdentifier). A Collection selector returns null. Native SQL uses
                    SqlIdentitySelector(column, attribute) and a pure reverse mapping.
                    identifierField selects a hydrated attribute and conflicts with an explicit
                    identity provider. Default Collection identity is id. Default Eloquent identity
                    is the actual primary key, including custom names. Inferred hidden keys deny
                    unless explicitly selected. Duplicate public identities reject the complete
                    batch.
                </p></ProseSection
            >
            <ProseSection id="uint64" title="Compare exact revisions"
                ><p>
                    RowRevisionProvider::revision returns a canonical uint64 decimal string between
                    0 and 18446744073709551615. Dapter compares digit length and ASCII order, never
                    JavaScript numbers or updated_at timestamps. Equal and older revisions for the
                    same typed ID do not replace a loaded row. Publish one replacement, then Publish
                    older revision. LiveIdentity retains Changed notebook 2. LiveArrival accepts the
                    later arrival and shows Changed notebook 1. Arrival order alone promises no
                    database freshness.
                </p></ProseSection
            >
            <LiveDemo scenario="LiveIdentity" />
            <LiveDemo scenario="LiveArrival" />
            <ProseSection id="pending-events" title="Replay only the winning read"
                ><p>
                    Each update has exactly one row and aligned metadata, a canonical lowercase
                    UUID, and at most 65536 encoded UTF-8 JSON bytes. The backend event name is
                    dapter.updated; Echo listens for .dapter.updated. Each owner retains at most 512
                    accepted UUID event IDs per context. While debounce, HTTP, or render publication
                    is pending, valid events buffer in arrival order. The buffer permits 128 events
                    and 1 MiB. These bounds also apply to total reentrant replay within one render
                    settlement, even when queue occupancy stays lower. After the winning response
                    renders, only matching loaded IDs in that same source and complete channel
                    descriptor replay. Superseded contexts cannot replay. Ordinary failed HTTP
                    discards its pending buffer and retains old rows. Later valid events can still
                    replace those rows.
                </p></ProseSection
            >
            <ProseSection id="recovery" title="Recover integration failures explicitly"
                ><p>
                    A rejected event keeps the old row and exposes invalid_event or decoder_failed
                    separately from HTTP errors. Overflow drops the whole buffer, detaches this
                    owner&#x27;s listener, and exposes event_overflow. Render publication failure
                    exposes render_failed and pauses polling. Missing Echo exposes echo_missing.
                    Subscription denial exposes subscription_failed. A successful explicit reload or
                    resetContext recovers suspended integration. Background polling never silently
                    recovers overflow. resetContext cancels old work, clears rows and metadata
                    immediately, removes only its saved requested snapshot, and starts source
                    defaults. Other URL namespaces and fragments survive. Version 1 exposes null
                    integrationError, uses its normal fresh context behavior for resetContext, and
                    makes restartPolling a no-op.
                </p></ProseSection
            >

            <LiveDemo scenario="LiveNative" />
            <ProseSection id="next-guide" title="Refresh the complete listing">
                <p>
                    For periodic reads that also update membership and ordering,
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/polling').href"
                        >configure HTTP polling</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
