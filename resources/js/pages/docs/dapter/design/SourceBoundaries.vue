<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import recordTypes from './reference/records.ts?raw';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection>
                <p id="status-and-scope">
                    Design proposal for the unpublished Dapter preview. Unless a section explicitly
                    identifies an implemented contract, these examples are unavailable and are not
                    installation instructions.
                </p>
                <p>
                    This reference settles proposed source, execution, and record boundaries for
                    later protocol version 2 capabilities. Durable identity, Resources, channel
                    metadata, and sealed execution remain unavailable. The delivered backend v2
                    subset reports unidentified records and channel null. The checked TypeScript
                    sources remain documentation specifications for the broader design. Their tests
                    do not establish future database routing, Resource, or Echo behavior.
                </p>
                <p>
                    Use the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/listing').href">
                        functional listing guide
                    </DocsLink>
                    for delivered APIs. The
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/roadmap').href">
                        roadmap
                    </DocsLink>
                    records acceptance gates and progress. Current protocol version 1 keeps its
                    source-only workflow and response unchanged. Ordinary offset reads accept scalar
                    Collection rows without durable identifiers. The
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/source-boundaries').href">
                        current source boundaries guide
                    </DocsLink>
                    demonstrates the delivered behavior. Installation and first success remain in
                    the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href">
                        Installation guide </DocsLink
                    >.
                </p>
            </ProseSection>
            <ProseSection id="distinct-identities" title="Distinct identities">
                <DocsTable
                    caption="Source, execution, and record identities"
                    :columns="['Identity', 'Owner and purpose']"
                    :rows="[
                        [
                            'Logical source',
                            'A trusted source identifier resolves an application definition and its access policy.',
                        ],
                        [
                            'Source evaluation',
                            'One fresh source instance supplies the native data for one authorized read. Shared dependencies retain their Laravel lifetimes.',
                        ],
                        [
                            'Local adapter',
                            'The browser identifies local shared state and URL state. This value grants no source or tenant access.',
                        ],
                        [
                            'Native selector',
                            'A private SQL column or supported native restriction selects a result row. It is not a browser field.',
                        ],
                        [
                            'Hydrated key',
                            'The raw row attribute exposes the selected value before projection. A SQL-qualified column is not a model property path.',
                        ],
                        [
                            'Public row ID',
                            'A reviewed safe integer or nonempty Unicode string matches projected rows while preserving its type.',
                        ],
                        [
                            'Audience context',
                            'An opaque server value binds the logical source, selected reader or verified shared audience, guard, scope, projection, and definition generation.',
                        ],
                    ]" />
                <p>
                    The future alias registry uses the current dotted ASCII identifier grammar and
                    rejects reserved PHP names. Each dot-separated segment matches
                    <code>[A-Za-z_][A-Za-z0-9_]*</code>. Exact alias lookup precedes convention
                    lookup. Duplicate and case-fold-colliding aliases fail registration. Convention
                    lookup preserves current PHP casing behavior. Aliases that target the same class
                    still authorize under that source policy and have distinct logical context
                    identities. Retargeting an alias or changing its definition generation
                    invalidates old contexts. Browsers never select PHP classes, drivers, or
                    connections.
                </p>
                <h3
                    id="accepted-execution"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Accepted execution
                </h3>
                <p>
                    The current internal NegotiatedRead pairs one native driver with an accepted
                    options and paging plan and executes immediately. Public StoreDriver and
                    ValidatedReadPlan retain their current shapes. A trusted direct driver call does
                    not authenticate a source or seal its connection by itself.
                </p>
                <p>
                    A future internal accepted execution closes over the fresh source evaluation,
                    selected reader and guard, mandatory scope or explicit global context,
                    projection audience, driver instance and profile, native snapshot, and verified
                    execution route. Execution accepts no replacement source, context, or driver.
                    Family, model, connection, scope, or query-shape drift fails before listing
                    reads and after operation handlers. An unverified execution route also fails.
                </p>
                <p>
                    The route commitment covers the verified database, schema, tenant, and read-role
                    route set. A native verifier may admit reconnect or failover within that same
                    set. Without a verifier, exact effective PDO identity is the conservative
                    fallback. Current reads promise neither a pinned socket nor transaction
                    isolation or a database snapshot. A callback is trusted application code. A
                    matching token cannot prove that arbitrary callback logic preserves tenant
                    safety.
                </p>
                <p>
                    DataStore remains a proposed coordinator bound to this context. Its
                    <code>update(identified: ...)</code> rereads within the authorized source scope.
                    It never persists records or applies transient listing state. Driver selection
                    and native restrictions belong in the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/design/drivers').href">
                        driver reference </DocsLink
                    >.
                </p>
                <h3
                    id="raw-identity-and-projection"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Raw identity and projection
                </h3>
                <p>
                    A null identifier field infers the Eloquent model's actual primary-key name,
                    including a custom primary key, or the raw Collection <code>id</code> field. The
                    qualified SQL selector and hydrated key resolve separately. Identity and
                    optional revision extraction precede an optional Resource. The projected data
                    may omit or rename the ID. The browser still matches by metadata, while
                    <code>decodeRow</code> sees projected data only. TRecord describes the projected
                    and decoded value, independently of record metadata.
                </p>
                <p>
                    Public IDs are safe JSON integers or nonempty valid Unicode strings. Numeric
                    <code>1</code> and string <code>'1'</code> are different IDs. Numeric negative
                    zero has the same identity as zero. Unsafe integers, floats, nonfinite values,
                    null, booleans, empty strings, and lone surrogates fail. Typed Set or Map keys
                    preserve these distinctions. PHP array-key coercion and stringification do not.
                </p>
                <p>
                    Exposing an otherwise hidden model key in metadata is public disclosure. The
                    source author selects a safe public identity. The parser validates its shape,
                    not its privacy. IDs must be unique across the source result-row domain.
                    Duplicate IDs in a returned batch fail atomically. No row position becomes a
                    durable ID.
                </p>
                <p>
                    Private selectors, helper columns, PHP classes, connections, deployment details,
                    credentials, and authorization inputs never enter record metadata. Audience
                    context remains opaque. It does not expose a raw tenant identifier.
                </p>
                <p>
                    A one-to-many join needs a unique supported result identity, such as a line-item
                    key rather than a repeated order key. A private selector, hydrated alias, and
                    mapped public ID serve different purposes. A future native driver must support
                    the reverse restriction. Ambiguous or unfilterable joins fail eligibility.
                    Concatenating fields does not establish composite-key support. Current drivers
                    retain their existing eligibility limits.
                </p>
            </ProseSection>
            <ProseSection id="planned-response-metadata" title="Planned response metadata">
                <p>
                    Version 2 retains the top-level <code>data</code> array. Required
                    <code>metadata.records</code> declares unidentified, identified, or revisioned
                    mode. Identified and revisioned metadata contain a dense rows array with exactly
                    one entry per data row in the same order. An empty page retains its declared
                    mode. Equal lengths verify structural alignment. The producer owns
                    correspondence between each raw row, projected value, and metadata entry.
                </p>
                <p>
                    Unidentified mode requires a null channel. Identified and revisioned modes may
                    also use a null channel, including future cursor or infinite lists without Echo.
                    A materialized channel contains only its private or public type, a safe name of
                    at most 128 ASCII characters, and event <code>.dapter.updated</code>.
                    Dot-separated segments use letters, digits, underscores, equals signs, and
                    hyphens. Empty segments, transport prefixes, placeholders, and extra policy
                    fields fail.
                </p>
                <p>
                    The complete response validates version, data, metadata, paging, state, and
                    capabilities before one atomic acceptance. The focused parser below checks its
                    exact data and metadata input, then decodes all rows. Invalid metadata prevents
                    decoding. Any decoder failure rejects the complete page. A ready slot exposes
                    metadata alongside its accepted data. Before readiness, metadata is null.
                </p>
                <CodeExample
                    language="typescript"
                    label="Checked planned record metadata and boundary specification, unavailable"
                    :code="recordTypes" />
                <p>
                    The complete planned response and ready-slot types appear in the
                    <DocsLink
                        :href="`${findNavigationItem(navigation, 'dapter/design/paging-state').href}#vue-slot-and-action-contract`">
                        Vue slot and action contract </DocsLink
                    >.
                </p>
                <h3
                    id="optional-revision-domain"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Optional revision domain
                </h3>
                <p>
                    Revisioned mode requires format <code>uint64-decimal</code> and one revision for
                    every ID. A revision is a canonical decimal string in the inclusive range
                    <code>0</code> to <code>18446744073709551615</code>. Only zero or a nonzero
                    digit followed by digits is valid. Leading zeroes, signs, whitespace, exponents,
                    numbers, and out-of-range values fail before publication or acceptance.
                </p>
                <p>
                    Comparison uses length and then ASCII lexical order. It never converts revisions
                    to JavaScript Number or PHP float. The same typed ID and context are
                    prerequisites. Equal revisions are duplicate no-ops. Lower revisions are stale.
                    Higher revisions replace an already loaded matching row. The source owns
                    monotonicity across observable changes and ID reuse. HTTP and events use the
                    same raw provider and projection context with atomic revision and data
                    semantics.
                </p>
                <p>
                    No revision provider is mandatory. Without one, context generations and event
                    deduplication retain arrival-order limits and do not establish database
                    freshness. Channel declarations, authorization, and the optional provider
                    contract belong in
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/design/live-updates').href">
                        live update reference </DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
