<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import VueNavigationDemo from '@/components/demo/dapter/vue/VueNavigationDemo.vue';
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
            <ProseSection id="starting-environment" title="Prepare Inertia navigation"
                ><p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    and
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/vue-controls').href"
                        >Build declared Vue controls</DocsLink
                    >. Keep the real Inertia router and history events. The isolated fictional
                    source uses no account, database, worker, or broadcaster. Select Start saved
                    catalogs before any reads begin. The package identity is Dapter 1.0.0-beta.2.
                    These browser-state and share APIs are available in Dapter 1.0.0-beta.2.
                </p></ProseSection
            >
            <ProseSection id="url-namespaces" title="Give each saved catalog a durable identity"
                ><p>
                    Explicit version 2 enables browser persistence by default. Version 1 defaults to
                    disabled. Pass <code>url: false</code> to disable listeners, local writes, URL
                    references, and sharing. The server supplies a policy after authorization. A
                    normal URL contains only a UUID v4, such as
                    <code>?saved_catalog.reading=UUID</code>. The browser stores its source,
                    version, requested state, and expiration in <code>localStorage</code> under
                    <code>dapter:state:&lt;uuid&gt;</code>. The link works in same-origin tabs and
                    reopened windows until expiration.
                </p>
                <p>
                    The default key is the source alias in snake case, with dotted segments joined
                    by underscores.
                    <code>Dapter.VueCatalog</code> becomes <code>dapter_vue_catalog</code>.
                    <code>stateKey('saved_catalog')</code> overrides the base key in this demo. An
                    explicit id different from the source appends a dot and the id, giving
                    <code>saved_catalog.reading</code> and <code>saved_catalog.comparison</code>.
                    Without an explicit id, the owner uses the base key. Use distinct stable ids or
                    keys for independent owners.
                </p>
                <p>
                    A cold mount first reads authorized defaults and policy. A valid local UUID or
                    portable share then makes a second read with restored criteria. Missing,
                    malformed, expired, wrong-source, or old-version references fall back to
                    authorized defaults and remove the owned URL key. They do not leave the owner at
                    a local validation error. Unrelated query parameters and fragments survive.
                </p></ProseSection
            >
            <ProseSection id="expiration" title="Set the lifetime and class version">
                <p>
                    <code>dapter.state.ttl</code> defaults to 240 minutes.
                    <code>StoreOptions::make()->stateTtl(60)</code> sets a positive duration in
                    minutes. <code>StoreOptions::make()->stateTtl(now()->addHour())</code> sets a
                    fixed future Carbon deadline. The empty
                    <code>makeWithoutDefaults()</code> baseline still uses 240 minutes. Empty keys
                    and invalid durations fail configuration. An elapsed fixed deadline disables
                    saved-state restoration and persistence while source defaults remain readable.
                </p>
                <CodeExample
                    label="Set the browser state policy"
                    language="php"
                    code="return StoreOptions::make()->stateTtl(240)->stateKey('saved_catalog');" />
                <p>
                    The lifetime starts when an accepted distinct snapshot is saved. Reads, reloads,
                    and sharing do not renew it. An imported share starts a new local duration,
                    subject to any fixed server deadline. Each distinct accepted non-default state
                    receives an immutable UUID. No-op reads reuse the UUID. An already displayed
                    view can remain visible after its stored reference expires. Older history
                    entries stay available until expiration. Reset or reverting every criterion,
                    including paging, to server defaults removes the current UUID and URL key.
                </p>
                <p>
                    The server computes a SHA-256 version from the source class declaration, its
                    parents, and recursively used traits. Declaration edits invalidate saved records
                    and shares. File paths, modification times, unrelated sibling classes, runtime
                    options, and package configuration do not change this class-scoped version.
                    Configuration changes still apply through the current authorized read and
                    expiration policy.
                </p>
            </ProseSection>
            <ProseSection id="share" title="Export a portable share URL">
                <p>
                    <code>catalog.share()</code> returns an absolute URL for the accepted state. The
                    same method is available from the DataAdapter default slot and exposed component
                    ref. It returns null before readiness, after disposal, with URL support
                    disabled, on legacy protocol, or without a server policy. The method does not
                    change browser history, storage, or the clipboard. A default view returns a URL
                    with its owned parameter removed.
                </p>
                <CodeExample
                    label="Create a share URL from the current handle"
                    language="js"
                    code="const sharedUrl = catalog.share();" />
                <p>
                    The owned value starts with <code>s1.</code> and contains UTF-8 base64url JSON
                    with source, version, and requested state. It contains no rows or authorization.
                    The values are readable. Dapter removes known sibling owners' UUID parameters
                    from the returned URL and preserves unrelated parameters and fragments. A
                    recipient passes authorization again, restores validated criteria, and replaces
                    the portable token with a fresh local UUID after success.
                </p>
                <p>
                    Independent cursor expiration and principal binding still apply. A shared cursor
                    does not become a transferable authorization grant. After an expired persisted
                    reference is reopened, the owner recovers to defaults.
                </p>
            </ProseSection>
            <ProseSection id="history" title="Restore requested state through browser history"
                ><p>
                    Page, order, filter, and size actions push history. Search and server
                    normalization replace the current entry. A clamped response normalizes the URL
                    without another read. Back and Forward restore each owner's requested state. The
                    first fresh page stays idle. After Start, Inertia remembers the reader's choice
                    across Back and Forward. A full reload keeps the URL but returns the frame to
                    Start. Start again to mount both owners and restore their requested state.
                </p>
                <p>
                    Dapter uses the public Inertia router, preserving page props and history state.
                    Native Inertia client visits cross an asynchronous boundary and cannot be
                    publicly canceled after dispatch. Dapter serializes namespace writes and
                    reconciles superseded publication so the URL converges to current intent. A
                    transient older URL can be visible during an already accepted client visit. A
                    superseded accepted push can also leave an extra corrected history entry because
                    the public SDK cannot erase that push atomically. Rows, errors, and scroll still
                    require the winning request generation.
                </p></ProseSection
            >
            <ProseSection id="try-history" title="Compare two independent owners"
                ><p>
                    Select Start saved catalogs. Both owners read page 1 independently. Select Next
                    saved page in reading; comparison stays on page 1. Select Tools only in
                    comparison; reading keeps its own criteria. Select Create share URL in reading
                    and open the displayed portable URL in another browser. Only reading restores
                    its page. Use browser Back and Forward, then reload the page and select Start
                    saved catalogs again. Each namespace restores its own requested selection.
                    Dispose saved catalogs clears the remembered Start choice, cancels work, and
                    detaches listeners. It does not erase the local UUID URL.
                </p></ProseSection
            >
            <VueNavigationDemo />
            <ProseSection id="scroll-container" title="Reset only the declared scroll region"
                ><p>
                    <code>scrollContainer</code> accepts an HTMLElement, a Vue ref, or a getter
                    returning HTMLElement or null. The creator owns this target. After a winning
                    page, criteria, or size change renders, Dapter resets that region. Reload
                    preserves its offset. Browser history restores recorded offsets after rendering.
                    Scroll offsets stay separate from the requested URL snapshot.
                </p>
                <p>
                    Scroll inside reading, then change its page. The reading region resets;
                    comparison and the document keep their positions. A temporarily null declared
                    target has no window fallback. Dapter does not manipulate body scroll.
                </p></ProseSection
            >
        </div>
    </article>
</template>
