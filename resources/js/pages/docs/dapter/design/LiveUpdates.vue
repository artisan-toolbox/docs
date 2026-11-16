<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import channelReference from './reference/channels.ts?raw';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const updateDeclaration = `use ArtisanToolbox\\Dapter\\DataStore;

// The application passes an already resolved, authorized Products store context.
function refreshProducts(DataStore $store): void
{
    $store->update(identified: [1, 2]);
}`;

const pollingDeclaration = `<DataAdapter source="Products" :polling="{ interval: 15000 }">
    <template #default="{ data }">
        <ul><li v-for="product in data" :key="product.id">{{ product.name }}</li></ul>
    </template>
</DataAdapter>`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection>
                <p>
                    Design proposal for the unpublished Dapter preview. Unless a section explicitly
                    identifies an implemented contract, these examples are unavailable and are not
                    installation instructions.
                </p>
                <p>
                    Use the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/listing').href"
                        >functional listing guide</DocsLink
                    >
                    for delivered APIs. The
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/roadmap').href"
                        >roadmap</DocsLink
                    >
                    records acceptance gates and progress.
                </p>
            </ProseSection>
            <ProseSection
                id="async-requests-url-and-scrolling"
                title="Async requests, URL, and scrolling">
                <p>
                    The first data request starts after the adapter mounts and never blocks initial
                    page rendering. Every later request is asynchronous. Inertia 3's
                    <DocsLink href="https://inertiajs.com/docs/v3/the-basics/http-requests"
                        >useHttp</DocsLink
                    >
                    provides standalone HTTP requests and cancellation. It does not perform a page
                    visit or manage page history and scroll for the adapter. Keep the transport
                    behind a narrow interface, but implement only the required Inertia integration
                    initially. Removing the existing PHP Inertia dependency or supporting a separate
                    browser-side array engine is outside the MVP.
                </p>
                <p>
                    Each client adapter controller owns its pending listing request and generation
                    counter. The host composable and its bound DataAdapter share those controls. A
                    new intent invalidates the previous generation before cancellation. Only the
                    current generation can commit rows, metadata, errors, URL normalization, or
                    scroll. Disposal cancels the instance and disconnects observers. Two adapters
                    using the same source with different store identities remain independent. A
                    source, adapter identity, tenant, or authorization-context change disposes old
                    requests and private subscriptions, clears old rows and cursors, and starts from
                    fresh source defaults. Restoring saved state is explicit, source-bound, and
                    validated against the current context. Never share rows or selections
                    automatically across sources or tenants. Do not use global
                    <code>router.cancelAll()</code> or a source-name-wide cancellation registry.
                </p>
                <p>
                    Coalesce identical pending requests within an instance. A changed selection
                    cancels or supersedes the previous request. Infinite loading is additionally
                    serialized until both delivery and Vue rendering finish. Cancellation can save
                    browser work but does not guarantee that database execution stops on the server.
                </p>
                <h3
                    id="url-ownership"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    URL ownership
                </h3>
                <p>
                    Enable URL state by default with a stable namespace derived from the adapter
                    identifier. A page using the same source twice supplies distinct explicit
                    identifiers. Preserve unrelated query parameters, fragments, and Inertia history
                    state. Keep URL parsing and updates behind the integration boundary.
                </p>
                <p>
                    Persist source-specific search, filters, selected sort or preset, page size, and
                    page or opaque cursor in a versioned representation. Omit optional inactive
                    selections and derived representation defaults only when decoding restores the
                    same editable intent. Preserve the namespace and version for an explicit clear.
                    Do not put rows, callbacks, mandatory access scope, credentials, capability
                    definitions,
                    <code>multiSort</code>, modifier events, or page-preservation hints in the URL.
                    Document that search terms in URLs are visible to browser history and ordinary
                    URL logging. Private views can explicitly disable URL persistence.
                </p>
                <p>
                    On mount or Back/Forward, parse the namespace structurally. An absent namespace
                    requests authorized defaults. A present valid snapshot uses
                    <code>replaceState(next)</code> for exactly one load, even before metadata
                    exists. The server authorizes and validates the whole candidate in that load.
                    Reject a malformed local snapshot without fetching. On success, only the winning
                    generation publishes the acknowledged editable state and position. Replacing a
                    normalized URL must not trigger a second load.
                </p>
                <p>
                    Use history replacement for search edits and canonicalization. Use a history
                    entry for explicit pagination, sort, filter, or page-size changes. Source
                    defaults can configure this policy. Inertia's history mechanism must retain
                    ownership of its stored page object. Choose the exact integration only after
                    testing back, forward, page visits, and full reload with the installed version.
                </p>
                <h3
                    id="scroll-behavior"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Scroll behavior
                </h3>
                <p>
                    <code>reload()</code> preserves the relevant scroll container. An explicit page
                    change scrolls the configured adapter container to its beginning after the
                    winning result renders. Search, filters, sorting, and page-size changes restart
                    pagination and scroll to that beginning by default. An explicit supported
                    page-preservation option retains the ordinal but does not preserve scroll.
                    Restoring browser history respects its saved position. Preserve focus unless the
                    consumer opts into a focus target.
                </p>
                <p>
                    Infinite append preserves scroll. Support vertical Y by default and optional
                    horizontal X with a declared scroll root and sentinel. Infinite mode is disabled
                    by default and uses the same pagination engine. Its observer cannot start a
                    second append before the active result renders, cannot run past
                    <code>has_next: false</code>, and pauses on error until explicit retry. Define a
                    bounded automatic-fill policy for a still-visible sentinel to avoid draining the
                    entire dataset on mount.
                </p>
                <p>
                    Changing criteria clears accumulated pages and cursor history. In infinite mode,
                    <code>reload()</code> resets the accumulated window to the first page with the
                    latest requested criteria and size, rather than appending a refreshed page into
                    stale accumulated data. This explicit exception prevents a mixed result window.
                </p>
                <p>
                    The initial infinite-mode URL identifies the start of the current window.
                    Appending does not rewrite it to the last fetched cursor. A full reload restores
                    that starting window and resumes observation. Restoring the whole accumulated
                    window or an exact visible item is a later capability, not an implied guarantee
                    of URL persistence.
                </p>
                <h3
                    id="broadcast-updates"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Broadcast updates replace loaded rows
                </h3>
                <p>
                    Proposed
                    <code
                        >broadcastUpdatable(identifierField: null, channel: null, revisions: null,
                        identity: null)</code
                    >
                    is one atomic option. Its <code>BroadcastUpdatable</code> attribute has the same
                    arguments. Omitting the declaration leaves broadcasts disabled. All APIs in this
                    section remain unavailable. The exact signatures and layering belong to
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/design/declarations').href +
                            '#broadcast-declaration'
                        "
                        >the broadcast declaration reference</DocsLink
                    >.
                </p>
                <p>
                    A null identifier field infers an ordinary Eloquent primary key or Collection
                    <code>id</code>. An unqualified field names the raw hydrated public-ID field,
                    never a SQL property path. An optional <code>RowIdentityProvider</code> handles
                    supported advanced mappings and conflicts with an explicit identifier field.
                    Native drivers reject ambiguous or unfilterable joined identities. Ordinary
                    offset Collection rows, including scalars, still need no identity. The
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/design/source-boundaries').href
                        "
                        >source and record boundaries</DocsLink
                    >
                    separate selectors, public typed IDs, and projected row data.
                </p>
                <p>
                    The proposed DataSource owns the authorized scoped source and its options.
                    <code>DataStore</code> coordinates that resolved context. It does not write
                    application records. The operation spelling
                    <code>DataStore::update(identified: [1, 2])</code> refers to an already
                    server-resolved store with source, tenant, and audience. It is not a global
                    ambiguous store lookup. This unavailable sketch shows an application callback
                    receiving that bound coordinator after committed mutations:
                </p>
                <CodeExample
                    language="php"
                    label="Proposed context-bound DataStore update, not current package usage"
                    :code="updateDeclaration" />
                <p>
                    The proposed native parameter can use <code>mixed</code> with PHPDoc
                    <code>TIdentifier|list&lt;TIdentifier&gt;</code>, where the identifier type is
                    integer or string. Accept one ID or a finite list, preserve identifier types,
                    deduplicate, and make an empty list a no-op. Invalid IDs fail at the boundary.
                    Refine bounded batch limits before implementation. Missing or unauthorized rows
                    produce no payload for those IDs and no deletion signal.
                </p>
                <p>
                    Re-read the same authorized source with its tenant restrictions and application
                    prefilters, without adapter search, selectable filters, sort, or the current
                    page window. A row changing a dynamic filter value still receives its
                    replacement. Mandatory source prefilters remain, and a row leaving that scope
                    emits no row or deletion. Narrow the complete authorized Eloquent predicate by
                    the requested identities before materializing, or filter the Collection through
                    its declared identity. Never use unscoped <code>Model::find</code>. Send
                    refreshed rows through the same raw-row and optional Resource serializer as HTTP
                    for the same audience. Publish only after committed mutations, including when
                    the operation is requested inside a transaction. Rollbacks emit nothing.
                </p>
                <p>
                    An event replaces only matching identities already present in the adapter's
                    current loaded payload and same source context. For immediate delivery and
                    buffered replay, validate the event envelope and pass the row through the same
                    protocol parser and optional decodeRow as HTTP. Commit the replacement
                    atomically only after both checks succeed. On failure, keep the existing row,
                    expose an integration error, and leave reloading to the reader. Preserve each
                    row's index, URL, counts, cursors, scroll, and selection. Never insert, delete,
                    reorder, automatically reload, or reconcile membership because of an event. A
                    changed sort or filter value still replaces the existing row in place. Infinite
                    mode touches only its loaded window. Updates do not implement create, delete, or
                    list reconciliation. A consumer can explicitly reload when it wants a fresh
                    listing.
                </p>
                <h3
                    id="broadcast-channel-authorization"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Channel authorization and audience
                </h3>
                <p>
                    Proposed immutable
                    <code
                        >PrivateChannel(pattern, context: ChannelContextResolver::class, authorize:
                        null)</code
                    >
                    and <code>PublicChannel(name, projection)</code> are distinct variants. The
                    optional private <code>authorize</code> value names an extra Laravel Gate
                    ability. Its approval only narrows admission and never overrides source denial.
                    No separate channel source hook or revision hook is required.
                </p>
                <p>
                    Shorthand <code>broadcastUpdatable()</code> uses planned
                    <code>dapter.broadcasting.context</code>, a trusted resolver class-string with a
                    null default, to form <code>dapter.{guard}.{source}.{context}</code>. A missing
                    resolver or denied context fails before source reads. A source descriptor
                    replaces this fallback atomically. No tenant or global audience is inferred. A
                    resolver returns explicit <code>GlobalAudience(projection)</code>,
                    <code>ScopedAudience(scope, projection)</code>, or null to deny. The opaque
                    context binds logical source, selected guard, principal or verified shared
                    audience, scope, projection, and definition generation. Public wire values
                    contain no raw tenant IDs, credentials, classes, or callbacks.
                </p>
                <p>
                    A custom private pattern has exactly one dynamic <code>{context}</code>
                    segment. Guard and source in the default are materialized from trusted
                    registration. Patterns are disjoint and registration-stable. Reject duplicates
                    and intersections before Laravel registration. Per-request options may narrow
                    eligibility but cannot retarget a registered pattern, guard, or policy. A fresh
                    effective definition that differs from registration denies admission.
                </p>
                <p>
                    Private admission intersects authentication under exactly the selected guard,
                    source authorization and Gate, trusted scope and projection, matching context,
                    and the optional extra ability. Register only
                    <code>['guards' =&gt; [$selectedGuard]]</code>. Fallback guard arrays can select
                    another principal. Missing scoped context denies access. Explicit global context
                    is a separate choice. Laravel's private-channel denial remains 403,
                    independently of the listing endpoint's JSON 401.
                </p>
                <p>
                    Public delivery requires explicit source opt-in and a globally safe projection
                    with no reader-dependent Resource fields. Public listing access does not enable
                    public broadcasting. Source read, action, and producer authorization remain
                    authoritative. Only a safe <code>{ type, name, event: '.dapter.updated' }</code>
                    descriptor crosses the wire. Applications supply Echo, their broadcaster,
                    authorization endpoint, and queue workers under Laravel's
                    <DocsLink href="https://laravel.com/framework/docs/13.x/broadcasting"
                        >broadcasting prerequisites</DocsLink
                    >. No Echo listener, broadcaster, or authorization endpoint is implemented here.
                </p>
                <p>
                    The exact checked TypeScript below specifies descriptor safety, context
                    eligibility, and disjoint registration patterns. Its boolean inputs represent
                    trusted decisions supplied by fixtures. The resolver has already bound its
                    opaque token to the complete authorized context. The reference neither creates
                    nor proves that binding. It does not implement Laravel Gate, selected-guard
                    authentication, tenant-safe SQL, revocation, or delivery. The reference
                    restricts context tokens to one safe bounded segment and channels to 128 safe
                    characters. It rejects overlap even when placeholders occupy different
                    positions.
                </p>
                <CodeExample
                    language="typescript"
                    label="Checked planned channel eligibility specification, not a package export"
                    :code="channelReference" />
                <p>
                    Channel authorization runs on subscription, not automatically before every
                    event. For revocable protected access, require authorized per-recipient emission
                    or a defined channel rotation and disconnection strategy. Listener cleanup alone
                    cannot revoke server delivery. A queued producer reconstructs trusted recipient,
                    tenant, guard, and Resource context and rechecks current permission; the user
                    who changed a row does not determine every reader's projection. Deny missing
                    context instead of borrowing an ambient worker request. A shared audience needs
                    equivalent visibility and projection plus a verified revocation policy. Private
                    per-reader contexts are the conservative default. Refine revocation and delivery
                    tests before enabling protected broadcasts.
                </p>
                <p>
                    Attach an automatic listener only when broadcasting is enabled and an Echo
                    instance is available. Expose missing-instance, subscription, and authorization
                    failures as visible integration errors without silently switching to public
                    channels. On context change or unmount, remove only the adapter's own listener.
                    Do not leave a shared channel still used by another adapter.
                </p>
                <h3
                    id="broadcast-request-races"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Bounded event and request races
                </h3>
                <p>
                    The compact baseline uses per-instance context generations and event-ID
                    deduplication. While HTTP is pending, buffer current-context replacements within
                    a declared bound. After the winning response renders, replay applicable events
                    in received order only for identities present in that result. Superseded
                    contexts cannot commit. Define buffer overflow, failed-request retention, and
                    cleanup behavior before implementing the listener. Never solve a race through an
                    automatic reload.
                </p>
                <p>
                    Arrival order is not database freshness. Optional
                    <code>RowRevisionProvider::revision(rawRow): string</code> supplies one
                    canonical unsigned 64-bit decimal revision for HTTP and events. The grammar is
                    <code>0|[1-9][0-9]*</code>, bounded by <code>18446744073709551615</code>. The
                    planned PHP enum case <code>RevisionFormat::Unsigned64Decimal</code> uses wire
                    value <code>uint64-decimal</code>. Validate before publication or atomic
                    acceptance. Invalid revisions fail without silent downgrade or partial
                    replacement.
                </p>
                <p>
                    Compare revisions only for the same typed ID and context. Compare decimal
                    length, then ASCII lexical order, without JavaScript Number or PHP float. Equal
                    revisions are duplicate no-ops, lower revisions are stale, and higher revisions
                    replace the loaded row. HTTP and events share the provider, projection context,
                    and atomic revision-plus-data semantics. The source owns monotonic revisions
                    across visible changes and ID reuse. Never infer revisions from
                    <code>updated_at</code>, a serialization counter, or browser time.
                </p>
                <p>
                    The provider is optional. Without one, the baseline retains context generations
                    and event deduplication with arrival-order limits. It offers no database
                    freshness guarantee and requires no mandatory revision column or service. The
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/design/source-boundaries').href
                        "
                        >shared checked record specification</DocsLink
                    >
                    owns the revision parser and aligned metadata, independently of the projected
                    record type.
                </p>
                <h3
                    id="polling"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Optional frontend polling
                </h3>
                <p>
                    Proposed frontend <code>polling</code> defaults to <code>false</code>. This
                    unavailable prop sketch requests a positive 15-second interval. It does not
                    require broadcasting, and enabling broadcasts does not enable polling:
                </p>
                <CodeExample
                    language="vue"
                    label="Proposed opt-in polling prop, not a current frontend export"
                    :code="pollingDeclaration" />
                <p>
                    Polling uses the same explicit adapter <code>reload()</code> behavior and
                    retains the latest requested criteria, order, size, and ordinary position,
                    including edits whose load failed. The accepted snapshot is display evidence,
                    never a fallback that discards requested intent. It preserves the reload scroll
                    rules and normally refreshes listing membership, order, and counts. This reload
                    behavior is separate from replacement-only broadcast events. In infinite mode, a
                    polling reload resets the accumulated window to its first page under the
                    existing reload contract.
                </p>
                <p>
                    Skip active requests and scheduled interactive or debounced work. Schedule the
                    next timer only after settlement and Vue rendering. Pause when the page is
                    hidden or offline, clear timers on unmount, and avoid catch-up request piles.
                    Pause polling on failure and expose the error. Retain accepted data and
                    requested intent only within the same authorized context. Access denial clears
                    protected data and subscriptions under the access-control contract. Explicit
                    reload retries that retained intent. Resume after a successful explicit retry or
                    when the consumer restarts polling. There is no automatic failure retry loop.
                </p>
                <p>
                    Inertia's
                    <DocsLink href="https://inertiajs.com/docs/v3/data-props/polling"
                        >usePoll</DocsLink
                    >
                    refreshes an Inertia page through the router. It is not a proven direct
                    scheduler for standalone <code>useHttp</code> JSON requests. Verify transport
                    ownership before reusing it for Dapter. No polling runtime is implemented here.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
