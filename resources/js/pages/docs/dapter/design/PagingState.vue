<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import operationTypes from './reference/operations.ts?raw';
import pagingTypes from './reference/paging.ts?raw';
import requestedOperationState from './reference/transitions.ts?raw';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const sharedAdapter = `<script setup>
import { DataAdapter, useDataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const users = useDataAdapter('Users');
\x3C/script>

<template>
    <Button :disabled="users.paging.loading" @click="users.paging.reload()">
        Reload this listing
    </Button>
    <DataAdapter :adapter="users" v-slot="listing">
        <pre v-if="listing.ready">{{ listing.data }}</pre>
    </DataAdapter>
    <DataAdapter source="Users" />
</template>`;
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
            <ProseSection id="pagination-and-consistency" title="Pagination and consistency">
                <p>
                    Use distinct typed pagination variants. Numbered pagination is the MVP default.
                    Simple and cursor pagination are subsequent capabilities.
                </p>
                <DocsTable caption="Pagination modes and available navigation">
                    <thead>
                        <tr>
                            <th scope="col">Mode</th>
                            <th scope="col">Position</th>
                            <th scope="col">Counts by default</th>
                            <th scope="col">Navigation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>offset</code></td>
                            <td><code>current</code> starts at 1</td>
                            <td>
                                Exact <code>total</code>, <code>filtered</code>, and
                                <code>pages</code>
                            </td>
                            <td>First, previous, next, last, and direct page</td>
                        </tr>
                        <tr>
                            <td><code>simple</code></td>
                            <td>Known <code>current</code>, starting at 1</td>
                            <td>
                                <code>total</code>, <code>filtered</code>, and
                                <code>pages</code> are null
                            </td>
                            <td>First, previous, and next</td>
                        </tr>
                        <tr>
                            <td><code>cursor</code></td>
                            <td>
                                Opaque cursor, <code>current</code> and <code>pages</code> are null
                            </td>
                            <td><code>total</code> and <code>filtered</code> are null</td>
                            <td>First, previous, and next</td>
                        </tr>
                    </tbody>
                </DocsTable>
                <p>
                    This complete accepted-result union is proposed for protocol 2. Production still
                    exports only offset pagination. Wire results contain metadata, while local slot
                    projections add navigation functions. Each accepted result couples the requested
                    and returned paging mode. Exact counts for simple or cursor mode require a
                    separately specified extension and are not accepted by this initial union.
                </p>
                <CodeExample
                    language="typescript"
                    label="Planned discriminated paging contract, unavailable"
                    :code="pagingTypes" />
                <p>
                    <code>total</code> counts the authorized base source before selectable filters
                    and dynamic search. <code>filtered</code> counts it after both. Counts exclude
                    pagination. With no selections, reuse the same count where valid. Empty offset
                    results report <code>current: 1</code>, <code>pages: 1</code>,
                    <code>filtered: 0</code>, and no previous or next page. Preserve the authorized
                    base count in <code>total</code>. For example, searching 100 authorized records
                    with no matches returns <code>total: 100</code> and <code>filtered: 0</code>.
                    Only an empty authorized base has <code>total: 0</code>. Clamp an out-of-range
                    offset page to the last valid page. The current generation adopts the
                    acknowledged page in requested state and replaces its URL without issuing
                    another load. Reload starts at that page. Stale acknowledgments cannot change
                    it.
                </p>
                <p>
                    Derive <code>pages</code> from <code>filtered</code>, never from
                    <code>total</code>. For an authorized base of four rows, selecting two rows with
                    size 1 and requested page 9 yields total 4, filtered 2, pages 2, and current 2.
                    A zero-match selection retains total 4 but yields filtered 0, pages 1, and
                    current 1. An empty authorized base yields both counts zero. Counts are exact,
                    nonnegative safe integers with filtered no greater than total. Reject invalid
                    counts instead of fabricating navigation. Clamping changes only the acknowledged
                    position, leaving the selected criteria intact.
                </p>
                <p>
                    The
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/design/operations').href +
                            '#query-contract-reference'
                        "
                        >checked query reference</DocsLink
                    >
                    verifies these proposed cases. In the delivered preview there are no managed
                    selections, so <code>filtered</code> equals <code>total</code>. The current
                    drivers reuse one count. Distinct filtered execution remains in its operation
                    phase, rather than being simulated by a second identical query.
                </p>
                <p>
                    Optional exact counts can later be requested for simple or cursor mode through a
                    server declaration. They do not enable direct cursor page jumps. Unknown counts
                    remain null, never zero or an estimate presented as exact. Separate count and
                    data queries describe a live view and are not a transactionally consistent
                    snapshot by default.
                </p>
                <p>
                    The allowed page-size options are positive integers declared by the source. A
                    request outside that list fails validation. Changing page size invalidates an
                    old cursor and restarts navigation.
                </p>
                <h3
                    id="deterministic-order-and-cursor-limits"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Deterministic order and cursor limits
                </h3>
                <p>
                    Automatic field cursor order requires a verified supported, unique, extractable
                    complete order. Opaque callback order presets remain offset-only. Every
                    paginated SQL result needs a deterministic order with a unique tie-breaker.
                    Cursor execution also requires compatible, selected ordering values. The initial
                    cursor capability excludes null ordering values and unsupported expressions.
                    Laravel documents its restrictions on unique order, selected aliases, and
                    parameterized expressions in
                    <DocsLink
                        href="https://laravel.com/framework/docs/13.x/pagination#cursor-pagination"
                        >cursor pagination</DocsLink
                    >.
                </p>
                <p>
                    Cursor navigation avoids offset shifts for immutable ordering values but does
                    not freeze a changing dataset. A unique <code>id</code> tie-breaker does not
                    prevent changes caused by editing sort values, deleting records, or adding
                    records before the current boundary. Collection cursor mode also requires
                    durable record identities and the same comparator across requests. Re-created
                    array positions are not durable identities.
                </p>
                <p>
                    Bind opaque cursors to the source, normalized search, filters, effective order,
                    page size, and relevant authorization scope. Authenticate the envelope and
                    reject tampered, mismatched, or expired state with a recoverable error. Signing
                    is not confidentiality or authorization. Do not expose sensitive ordering values
                    in a token merely because it is base64-encoded. Reauthorize every request.
                </p>
                <p>
                    A snapshot is a separate future feature. A high-water mark can limit some new
                    rows but does not freeze edits or deletions. Do not hold a database transaction
                    open across browser requests. Stronger snapshot claims require an explicit
                    persistence design and insertion, update, and deletion tests.
                </p>
            </ProseSection>
            <ProseSection id="vue-slot-and-action-contract" title="Vue slot and action contract">
                <p>
                    The proposed headless <code>DataAdapter</code> infers row types from decodeRow
                    and operation types from an explicit validated definition. The checked reference
                    uses a definition generic as a precondition, not a new component prop. TRecord
                    describes the post-Resource data shape. TDefinition describes the operation
                    metadata the application can read. The fixture uses displayName for its decoded
                    name and a Date to verify that the public ReadonlyDeep type preserves decoded
                    method calls. The operation metadata still uses user_id, name, and price. The
                    default slot supports tables, grids, and cards without a frontend table library.
                </p>
                <p>
                    The built-in parser validates the versioned envelope, dense row list, paging,
                    state, capabilities, and wire values from unknown. Source-only rows have type
                    <code>unknown</code>. Supply <code>decodeRow</code> to validate each
                    post-Resource row. A proposed <code>decodeDefinition</code> metadata boundary
                    belongs to phase 2.1 and is unavailable in the current package. That future
                    decoder narrows operation types independently of row decoding. Give it a
                    detached, deeply readonly copy of the parsed metadata. Keep the authoritative
                    snapshot private. Validate the returned narrowing against that original and
                    detach the accepted projection before exposing it. Reject an incompatible
                    decoder result before committing any state. Each row retains its identity
                    position. Actions use the original authorized metadata. A decoder cannot add
                    permissions or broaden allowed values.
                </p>
                <CodeExample
                    language="typescript"
                    label="Proposed independent row and operation schema, unavailable"
                    :code="operationTypes" />
                <p>
                    The productDefinition value in the checked source contains only JSON data. It
                    has no functions, callbacks, PHP classes, trusted target paths, or SQL. The
                    frontend creates local actions after validation. Only supported named filter
                    entries appear; reader authorization may remove a named entry, so check the
                    entry too. An unauthorized field key may also be absent. Before the first
                    accepted response, <code>ready</code> is false, data is empty, and fields and
                    global are null. A same-context refresh retains a ready accepted view. Access
                    loss or a context change clears it. A field or global scope without supported
                    filters exposes null. Each search and order capability is null when unsupported.
                </p>
                <p>
                    PlannedSlot is a documentation-only type, separate from the delivered
                    DataAdapterSlot. Its initial paging is null until ready is true. The current
                    package keeps its existing offset paging facade and initial null counts. The
                    reference imports the real AsyncOutcome, AdapterError, and ReadonlyDeep. It does
                    not redefine weaker listing outcomes or erase Date methods.
                </p>
                <DocsTable caption="Proposed Vue slot members">
                    <thead>
                        <tr>
                            <th scope="col">Slot member</th>
                            <th scope="col">Proposed meaning</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>data</code></td>
                            <td>
                                Readonly records for the current page, or accumulated records when
                                infinite mode is enabled
                            </td>
                        </tr>
                        <tr>
                            <td><code>paging.mode</code></td>
                            <td>Discriminator for offset, simple, or cursor state</td>
                        </tr>
                        <tr>
                            <td><code>paging.loading</code></td>
                            <td>True while this adapter has a current pending operation</td>
                        </tr>
                        <tr>
                            <td><code>paging.empty</code></td>
                            <td>
                                True only after a successful result with no visible records, never
                                just because the initial request has not finished
                            </td>
                        </tr>
                        <tr>
                            <td><code>paging.current</code>, <code>paging.pages</code></td>
                            <td>Numbers where supported, null otherwise</td>
                        </tr>
                        <tr>
                            <td><code>paging.total</code>, <code>paging.filtered</code></td>
                            <td>Counts with the semantics above, or null when not computed</td>
                        </tr>
                        <tr>
                            <td><code>paging.per_page</code></td>
                            <td>
                                <code>value</code>, declared <code>options</code>, and asynchronous
                                <code>setValue(value)</code>
                            </td>
                        </tr>
                        <tr>
                            <td><code>paging.has_previous</code>, <code>paging.has_next</code></td>
                            <td>Availability reported by the accepted result</td>
                        </tr>
                        <tr>
                            <td>
                                <code>paging.goToFirst</code>, <code>goToPrevious</code>,
                                <code>goToNext</code>
                            </td>
                            <td>Asynchronous navigation actions, guarded by availability</td>
                        </tr>
                        <tr>
                            <td><code>paging.goToPage</code>, <code>goToLast</code></td>
                            <td>Actions in offset mode, null in modes that cannot perform them</td>
                        </tr>
                        <tr>
                            <td><code>paging.reload</code></td>
                            <td>
                                Refresh the latest requested position while retaining requested
                                criteria and preserving scroll
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <code>fields.&lt;field&gt;.search</code>,
                                <code>fields.&lt;field&gt;.order</code>
                            </td>
                            <td>
                                Automatic field capabilities or null. Each supported capability has
                                readonly available and current, with call and clear actions
                            </td>
                        </tr>
                        <tr>
                            <td><code>fields.&lt;field&gt;.filters</code></td>
                            <td>
                                A map of supported named filter capabilities, or null; each has
                                available, current, call, and clear
                            </td>
                        </tr>
                        <tr>
                            <td><code>global.search</code>, <code>global.filters</code></td>
                            <td>
                                One declarative search capability and a map of named callback
                                filters, each nullable when unsupported
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <code>global.multi_order</code>,
                                <code>global.multi_order_limit</code>
                            </td>
                            <td>
                                Readonly server permission and effective field-term limit, not
                                selected state
                            </td>
                        </tr>
                        <tr>
                            <td><code>global.order</code></td>
                            <td>
                                One capability with labeled presets in available, current { id } or
                                null, call({ id }), and clear(); no client direction or sortType
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <code>requested</code>, <code>replaceState(next)</code>,
                                <code>resetState()</code>,
                                <code>setSearchMatch</code>
                            </td>
                            <td>
                                One readonly requested state; atomic advanced replacement after full
                                validation; explicit source-default reset; optional all or any
                                action only when declared
                            </td>
                        </tr>
                        <tr>
                            <td><code>accepted</code></td>
                            <td>
                                Immutable last response snapshot, including effective order, rows,
                                and accepted criteria
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <code>ready</code>, <code>status</code>, <code>error</code>,
                                <code>capabilities</code>
                            </td>
                            <td>
                                Availability of an accepted result, request lifecycle, structured
                                error, and supported operations
                            </td>
                        </tr>
                    </tbody>
                </DocsTable>
                <p>
                    Preserve existing snake_case paging keys and camelCase paging actions. New
                    operation metadata and action inputs consistently use
                    <code>matchType</code>, <code>matchTypes</code>, <code>sortType</code>, and
                    <code>sortTypes</code>. Pagination remains a discriminated union. Narrowing
                    <code>paging.mode</code> narrows counts and available navigation actions.
                </p>
                <p>
                    selectNotebook in the checked source demonstrates nullable field and global slot
                    actions. Definitions contain no functions on the wire. The frontend creates call
                    and clear locally after metadata validation.
                </p>
                <h3
                    id="requested-operation-state"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    One requested operation state
                </h3>
                <p>
                    An absent snapshot asks the server for this reader's defaults. A present
                    versioned snapshot describes the full editable intent. Include its order,
                    grouping, paging mode, size, and position. Store only active field and global
                    selections. Omitted selections mean clear, including a filter with a source
                    default. Keep the version marker even when every selection is cleared. Every
                    available and current property is a readonly projection. All current selections
                    derive from one requested state, never parallel mutable slot stores. A filter or
                    global search current is <code>{ value: V } | null</code>. Absence is null;
                    <code>{ value: null }</code>, <code>{ value: false }</code>,
                    <code>{ value: 0 }</code>, and <code>{ value: '0' }</code> remain selections
                    when declared. Field search current adds matchType; field order current derives
                    direction, sortType, and priority from the order list. Global order current is
                    <code>{ id } | null</code>. Its available metadata lists named labeled presets.
                </p>
                <p>
                    The following pure reference specifies protocol 2 transitions. Protocol 1 is the
                    only currently accepted wire version. The operation selections and pagination
                    variants are an incompatible draft grammar and require protocol 2 delivery in
                    later phases. Current endpoints reject version 2. These files add no runtime
                    version, package export, HTTP transport, reactive store, or data engine. The
                    reference assumes operands and authorization have already passed boundary
                    validation. Its tests verify state transitions, not query execution.
                </p>
                <CodeExample
                    language="typescript"
                    label="Proposed canonical request state and exclusive order, unavailable"
                    :code="requestedOperationState" />
                <p>
                    Local <code>call</code> and <code>clear</code> patch only the addressed
                    selection, preserving other fields and global selections. Clear always means
                    absence. A multiple filter preserves its declared empty-list clear or reject
                    policy. An ordinary field order call replaces only ordering. Its transient
                    <code>multiSort</code> input defaults to false. With server permission,
                    <code>multiSort: true</code> updates an existing field at its priority or
                    appends a new field. Priority is the terms array index. No call accepts a
                    priority option. A compatible full snapshot can explicitly reorder terms. At the
                    limit, a new field fails atomically without evicting another term; an existing
                    field can still change. Clear removes only the addressed field order, retaining
                    the other terms. Clearing the final term returns source default order.
                </p>
                <p>
                    A preset call replaces only ordering. An additive field call while an opaque
                    preset is active fails without mutation. An ordinary field call explicitly
                    switches out of the preset. Clearing a preset returns source default order,
                    never a hidden previous field list. Browser history can restore that previous
                    list only through an explicit compatible snapshot.
                </p>
                <p>
                    A real criteria or order change preserves unrelated selections and page size,
                    resets the one-based page to 1 or cursor to null, and clears cursor history and
                    the accumulated infinite window. SQL offset zero is an internal translation.
                    Invocation options <code>call(input, { page: 'preserve' })</code> and
                    <code>clear({ page: 'preserve' })</code> override the default
                    <code>page: 'first'</code> only for ordinary offset pagination with exact counts
                    and infinite mode disabled. The server clamps an invalid retained page using the
                    existing count contract. This retains a page ordinal, not the same rows, a
                    snapshot, a row anchor, or scroll. Unsupported preservation resolves a typed
                    local failure without mutation or a request. Cursor changes always invalidate
                    the old cursor. Page-size changes still reset to the first position through the
                    existing <code>paging.per_page.setValue(value)</code> API.
                </p>
                <p>
                    <code>replaceState(next)</code> validates and atomically replaces the full
                    compatible requested snapshot, honoring its supplied page or cursor. On cold
                    restore only its structure is known locally. Commit the server-authorized
                    candidate as accepted only after the single response validates. History
                    restoration applies that snapshot once, without a second automatic reset or
                    load. Proposed <code>resetState()</code> always sends one request without a
                    snapshot. The authorized server supplies the current defaults and first
                    position. Mandatory scope remains. Optional
                    <code>setSearchMatch('all' | 'any')</code> changes cross-clause grouping only
                    when declared; global target match types stay fixed. Paging actions preserve
                    criteria, order, and size.
                </p>
                <p>
                    A null capability has no function to invoke. Check it or use optional chaining.
                    An action rejects locally without mutation or a request when the current
                    metadata proves the choice invalid. An advertised direction and sort type do not
                    guarantee their combination. Send structurally valid combinations whose support
                    is unknown to the server for whole-plan validation. Identical canonical
                    requested intent and clearing an inactive selection are no-ops without a
                    position reset or request;
                    <code>reload()</code> deliberately fetches again. Actions resolve success,
                    failure, or supersession, with recoverable errors in slot state and no unhandled
                    promise rejections. Unsupported opaque ordering in cursor mode never changes the
                    paging mode or requested state.
                </p>
                <p>
                    Derive each patch from the latest requested state, never the accepted snapshot
                    or a stale render closure. A pending debounced search followed by sorting must
                    retain the latest search input. Track requested state separately from accepted
                    result state. URL or control edits can be pending while the previous result
                    remains visible. On a recoverable load failure within the same authorized
                    context, retain that result, expose its accepted criteria, and allow retry of
                    the requested criteria. Access denial follows the cleanup contract above. Do not
                    label old rows as the new result. Initial failure exposes an error state, not a
                    successful empty state.
                </p>
                <h3
                    id="competitor-state-research"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Competitor state research
                </h3>
                <p>
                    Official documentation and versioned source reviewed on 2026-11-14 show separate
                    criteria models and explicit additive sorting. They do not establish one page
                    reset policy. The observations below are source research, not browser trials.
                    Dapter's proposed policy follows the action matrix below.
                </p>
                <DocsTable caption="Verified competitor behavior and Dapter design implications">
                    <thead>
                        <tr>
                            <th scope="col">Library and primary evidence</th>
                            <th scope="col">Observed behavior</th>
                            <th scope="col">Dapter recommendation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <DocsLink href="https://tanstack.com/table/v8/docs/guide/sorting"
                                    >TanStack Table v8 sorting</DocsLink
                                >
                                and
                                <DocsLink href="https://tanstack.com/table/v8/docs/guide/pagination"
                                    >pagination</DocsLink
                                >
                            </td>
                            <td>
                                Multi-sort uses Shift by default, with configurable event detection,
                                capability and term limits. Page-altering changes normally reset the
                                page index; manual pagination disables that automatic default.
                            </td>
                            <td>
                                Separate permission from per-call intent. Declare page invalidation
                                instead of inheriting an unspecified client default.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <DocsLink
                                    href="https://www.ag-grid.com/javascript-data-grid/row-sorting/"
                                    >AG Grid sorting</DocsLink
                                >
                                and
                                <DocsLink
                                    href="https://www.ag-grid.com/javascript-data-grid/column-state/"
                                    >column state</DocsLink
                                >
                            </td>
                            <td>
                                Shift adds sort columns by default; the Ctrl option also supports
                                Command. Partial column-state updates leave unspecified or undefined
                                attributes unchanged; null clears supported attributes.
                            </td>
                            <td>
                                Patch the addressed operation. Preserve Dapter's distinct
                                selected-null filter meaning.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <DocsLink href="https://mui.com/x/react-data-grid/sorting/"
                                    >MUI X sorting</DocsLink
                                >
                                and
                                <DocsLink href="https://mui.com/x/react-data-grid/state/"
                                    >state restoration</DocsLink
                                >
                            </td>
                            <td>
                                Pro or higher enables multiple sorting with Ctrl, Shift, or Command,
                                or an always mode. Controlled models and snapshots are separate.
                                Restoring pagination without its filters and ordering can show
                                different rows.
                            </td>
                            <td>
                                Restore a compatible complete snapshot atomically. Do not interpret
                                position preservation as preserving row identity.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <DocsLink href="https://primevue.dev/datatable/"
                                    >PrimeVue DataTable documentation</DocsLink
                                >
                                and
                                <DocsLink
                                    href="https://github.com/primefaces/primevue/blob/4.5.5/packages/primevue/src/datatable/DataTable.vue"
                                    >4.5.5 source</DocsLink
                                >
                            </td>
                            <td>
                                Current documentation describes Ctrl/Cmd multi-sort and stored table
                                state. The docs application installs 4.5.5. That source replaces
                                other terms on an ordinary multiple-sort click and retains them with
                                Ctrl/Cmd. Filtering precedes sorting. Single-sort and applied
                                filters reset position; the multiple-sort header branch does not
                                call that reset.
                            </td>
                            <td>
                                Keep criteria when ordering. Choose Dapter's position rule
                                explicitly rather than claiming all PrimeVue sorts reset it.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <DocsLink href="https://datatables.net/reference/api/draw()"
                                    >DataTables draw()</DocsLink
                                >
                            </td>
                            <td>
                                Default draw recalculates search and ordering and resets pagination.
                                draw(false) recalculates both while retaining the page. draw('page')
                                skips those recalculations.
                            </td>
                            <td>
                                Offer explicit, bounded page preservation after a criteria change,
                                with invalid-page handling.
                            </td>
                        </tr>
                    </tbody>
                </DocsTable>
                <h3
                    id="state-preservation-matrix"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    State preservation by action
                </h3>
                <p>
                    This is Dapter's proposed contract, unavailable in the current package. A real
                    local change preserves unrelated criteria and page size. The default position
                    reset clears cursor history and accumulated infinite rows. The optional
                    <code>page: 'preserve'</code> invocation hint works only with exact-count
                    ordinary offset pagination and infinite mode disabled. Invalid retained pages
                    are clamped by the server. Identical intent and inactive clears change nothing
                    and send no request.
                </p>
                <DocsTable caption="Proposed action and state preservation matrix">
                    <thead>
                        <tr>
                            <th scope="col">Action</th>
                            <th scope="col">Search and filters</th>
                            <th scope="col">Order</th>
                            <th scope="col">Position</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Search or filter call</td>
                            <td>Replace its own clause; retain the others</td>
                            <td>Retain</td>
                            <td>
                                First by default; explicit supported preserve can retain the ordinal
                            </td>
                        </tr>
                        <tr>
                            <td>Ordinary field order call</td>
                            <td>Retain all</td>
                            <td>Replace with that field only</td>
                            <td>First by default; supported preserve optional</td>
                        </tr>
                        <tr>
                            <td>Additive field order call</td>
                            <td>Retain all</td>
                            <td>Update in place or append; array position determines priority</td>
                            <td>
                                First by default; supported preserve optional; invalid intent
                                changes nothing
                            </td>
                        </tr>
                        <tr>
                            <td>Global order preset call</td>
                            <td>Retain all</td>
                            <td>Replace only order with the preset</td>
                            <td>First by default; supported preserve optional</td>
                        </tr>
                        <tr>
                            <td>Local clear</td>
                            <td>Remove only the addressed criterion, if any</td>
                            <td>
                                Remove only the addressed order, if any; last clear returns source
                                order
                            </td>
                            <td>
                                First after a real change; supported preserve optional; inactive
                                clear is a no-op
                            </td>
                        </tr>
                        <tr>
                            <td>Page-size change</td>
                            <td>Retain all</td>
                            <td>Retain</td>
                            <td>First; retain only the new allowed size</td>
                        </tr>
                        <tr>
                            <td>Pagination action</td>
                            <td>Retain all</td>
                            <td>Retain</td>
                            <td>Move to the requested supported position; retain size</td>
                        </tr>
                        <tr>
                            <td>Reload or polling</td>
                            <td>Retain latest requested criteria</td>
                            <td>Retain latest requested order</td>
                            <td>
                                Retain requested position and size; infinite mode restarts its first
                                window
                            </td>
                        </tr>
                        <tr>
                            <td>Loaded-ID broadcast replacement</td>
                            <td>Unchanged</td>
                            <td>Unchanged</td>
                            <td>Unchanged, including window and scroll</td>
                        </tr>
                        <tr>
                            <td>replaceState(next), including Back/Forward</td>
                            <td>Restore the full validated compatible snapshot</td>
                            <td>Restore its order</td>
                            <td>Honor supplied position and size atomically, with one load</td>
                        </tr>
                        <tr>
                            <td>resetState()</td>
                            <td>Restore current source defaults; mandatory scope remains</td>
                            <td>Restore source defaults</td>
                            <td>First position and declared default size</td>
                        </tr>
                        <tr>
                            <td>Access denial or authentication loss</td>
                            <td>
                                Retain intent only for the same identity context and authorized
                                retry
                            </td>
                            <td>Retain intent under the same restriction</td>
                            <td>
                                Clear protected rows, metadata, cursors, windows, and buffered
                                events; stop polling and release private subscriptions
                            </td>
                        </tr>
                        <tr>
                            <td>New source or tenant context</td>
                            <td>Fresh context defaults; no automatic sharing</td>
                            <td>Fresh context defaults</td>
                            <td>
                                Clear old rows, cursors, and requests; explicitly validate any
                                source-bound restore
                            </td>
                        </tr>
                    </tbody>
                </DocsTable>
                <p>
                    For a concrete sequence, start on page 3 with size 25 and no selected criteria.
                    Searching name for Notebook creates that clause and moves to page 1. An ordinary
                    price order keeps Notebook and replaces only order with price ascending. After
                    navigating to page 2, Ctrl/Cmd ordering name appends name to price when
                    permitted, keeps Notebook, and returns to page 1. Selecting only_news true
                    retains both sort terms and Notebook. Clearing only_news removes only that
                    filter. Search, both order terms, and size 25 remain. Editing Notebook to Pencil
                    replaces the same search clause; a separate declared filter refines the full
                    source result.
                </p>
                <p>
                    The consuming UI maps Ctrl/Cmd to a boolean. No DOM event, modifier flag,
                    <code>multiSort</code>, preservation hint, or capability flag belongs in
                    canonical state, URL state, or HTTP request payloads. Serialize only the
                    normalized resulting criteria, ordered terms, and position. The server
                    independently validates the resulting terms against
                    <code>global.multi_order</code>, its term limit, allowed fields, directions,
                    sort types, and cursor eligibility.
                </p>
                <h3
                    id="response-and-failure-rules"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Response and failure rules
                </h3>
                <p>
                    At the common JSON boundary, validate numeric values recursively in requests,
                    metadata, rows, Resource output, and events. Every integer must be in the
                    inclusive range −9007199254740991 to 9007199254740991. Counts and positions also
                    meet their nonnegative or positive bounds. Planned number operands allow finite
                    decimals and safe integers. Current protocol 1 paging still requires safe
                    integer tokens and rejects <code>1.0</code>. Planned numeric operand
                    canonicalization is a separate rule and does not loosen current paging.
                    Canonicalize safe integral numeric options such as 0.0 and negative zero to
                    integers before strict membership or duplicate checks. Reject duplicate options
                    such as [0, 0.0]. The string <code>'0'</code> and false retain their types. An
                    invalid request value returns HTTP 422. An invalid declaration or output returns
                    a sanitized 500. To expose a larger identifier, explicitly project it as a
                    string on the server and use a compatible string declaration or identity
                    extractor.
                </p>
                <p>
                    The successful JSON envelope has a protocol version, a dense
                    <code>data</code> list, canonical editable <code>requested</code> intent,
                    effective <code>state</code> including the full server order, pagination
                    metadata, and public <code>capabilities</code>. It does not contain executable
                    actions. Keep source aliases, state names, and normalization consistent with the
                    slot contract.
                </p>
                <p>
                    The existing <code>ErrorKind</code> enum encodes <code>access</code>,
                    <code>validation</code>, <code>unsupported_operation</code>, or
                    <code>server</code> in <code>error.kind</code>. The separate planned
                    cursor_expired kind is unavailable until cursor support ships. That phase must
                    extend the public AdapterError classification and add the explicit restart
                    outcome; the checked references reuse today's public error and listing outcome
                    types without pretending that extension exists. Malformed JSON returns 400. A
                    well-formed request with an invalid shape or undeclared operation returns 422
                    with a stable validation code before driver listing reads. Each denial uses the
                    access kind, including a deliberate 5xx denial. Unknown and cloaked sources
                    return an identical generic 404. If an unclassified response has status 401,
                    403, 404, or 419, clear protected state. Treat a session redirect to a login
                    page as access loss. Never accept an HTML page as data. Expired cursors return
                    409 with an explicit restart action. Invalid or mismatched cursors return 422.
                    An unsupported optional store operation returns 422 with kind
                    <code>unsupported_operation</code> even when stale metadata advertised it.
                    Configuration failures and unexpected query errors return a sanitized 500
                    response without SQL, model paths, or secrets. Laravel middleware failures such
                    as CSRF rejection remain recognizable to the adapter.
                </p>
                <p>
                    A genuine infrastructure 503 retains the last accepted same-context result.
                    Inertia useHttp resolves 422 through its validation callback and can return
                    undefined. Include the same enum value under the reserved
                    <code>errors._dapter_kind</code> key as a single-element string list on every
                    Dapter 422. The server serializes both fields from one ErrorKind. Application
                    field errors and client input cannot supply the reserved key. The 422 callback
                    sees only the projected kind. Configure <code>withAllErrors()</code> so the
                    adapter can validate the complete list and require exactly one recognized 422
                    kind, including server. HTTP status alone never determines error kind, and
                    trusted PHP error statuses remain supported. For the winning generation, access
                    clears protected data. Validation, unsupported_operation, and server retain the
                    last result in the same authorized context. A missing, malformed, or unknown 422
                    discriminator clears protected state. A JSON parse failure in the network-error
                    callback also clears it: a redirected login page and a maintenance page can
                    produce the same parse error. Retain the last result on a genuine network
                    disconnection only in the same authorized context. Bind loading and error
                    commits to the instance generation. Network and server failures require an
                    explicit retry. There is no default retry loop. Canceled or superseded requests
                    do not become visible errors. A failed request retains its requested state for
                    retry and the previous accepted result for display only while access and
                    identity context remain valid.
                </p>
                <h3
                    id="shared-adapter-composable"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Shared useDataAdapter instances
                </h3>
                <p>
                    This shared-handle contract is implemented in the local preview. Follow
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/composable').href"
                        >Share an adapter with component logic</DocsLink
                    >
                    for focused executable examples, prerequisites, and current limitations. Query
                    controls, history, actions, and live updates elsewhere on this page remain
                    proposed.
                </p>
                <p>
                    The local preview's <code>useDataAdapter('Users', options)</code> creates or
                    acquires one DataStore handle in the current Vue owner scope. It exposes the
                    same public state and operations as the component slot. Bind that handle with
                    <code>&lt;DataAdapter :adapter="users"&gt;</code> to share it with the host
                    component. A separate <code>&lt;DataAdapter source="Users"&gt;</code> creates a
                    separate store, even when the source name matches. Source name identifies a
                    server definition, not a client instance. Never use a module-global singleton
                    keyed only by source.
                </p>
                <p>
                    The public adapter handle owns one client listing. The backend DataStore is
                    resolved afresh for each authorized read or action. Sharing a frontend handle
                    does not preserve or share a PHP object across HTTP requests. Client identity
                    never substitutes for server authorization.
                </p>
                <CodeExample
                    language="vue"
                    label="Shared host handle and independent second adapter"
                    :code="sharedAdapter" />
                <p>
                    A source-owning DataAdapter provides its handle to descendants. A descendant's
                    matching <code>useDataAdapter('Users')</code> acquires that exact public object.
                    A repeated acquisition in the same host scope also reuses its local handle.
                    Siblings share through their common host's explicit handle, not by depending on
                    which sibling mounted first. A nested source-owning DataAdapter establishes a
                    new boundary. The optional <code>id</code> creation option supplies a stable
                    local identity. For two same-source handles in one host, use distinct
                    identifiers, such as <code>useDataAdapter('Users', { id: 'review' })</code> and
                    <code>useDataAdapter('Users', { id: 'active' })</code>. Reacquire with the same
                    identifier or pass the handle. A source-owning component accepts the same id
                    option. A bound component inherits its handle's identity and cannot replace it.
                    Identifiers do not grant server access. Returning the same public handle must
                    mean strict object identity, shared reactive state, and one request generation,
                    not copied state.
                </p>
                <p>
                    Creation accepts the component's source configuration, including row decoding
                    and later supported options. Binding an existing handle accepts no conflicting
                    source or creation options. The first creator fixes configuration. Joining with
                    incompatible settings fails before loading or mutation. Typed consumers share
                    the decoder or typed handle. A string lookup alone cannot infer row types from
                    another component's decoder and returns unknown rows. Do not let independent
                    generic assertions pretend that one store has two incompatible row schemas.
                </p>
                <p>
                    An omitted decoder when joining retains the creator's decoder. A different
                    decoder function reference conflicts, and an undecoded store cannot acquire a
                    decoder later. Pass the same shared function or the typed handle. The handle is
                    a stable reactive readonly facade with ordinary property access. Destructuring a
                    property reads its current value; use a Vue computed or ref projection when a
                    separate binding must keep tracking changes.
                </p>
                <p>
                    Source creation accepts a string, a Vue Ref of string, or a getter. A reactive
                    source uses a stable explicit id, such as
                    <code>useDataAdapter(() =&gt; props.source, { id: 'users' })</code>. The id
                    stays fixed while the source context changes. Reacquisition must agree on that
                    source input and configured decoder. A source-only component retains its
                    existing reactive source behavior. Source changes reset context and never rename
                    the handle or transfer state to an unrelated store.
                </p>
                <p>
                    The component delegates to the same composable/controller implementation. Start
                    once after mount, coalesce only identical listing requests within that store,
                    and retain one parser, decoder, pending request, and generation counter.
                    Detaching a borrowed view does not cancel its live owner's request. Dispose the
                    controller when its owner scope ends and release each view's observers. A
                    disposed handle cannot be revived by a late callback. Source changes clear old
                    rows before the new context loads. For tenant, principal, or
                    authorization-context changes, recreate the owning Vue scope with a stable
                    application key. The preview does not infer those external application contexts
                    or implement private subscriptions yet. Do not share across Vue apps, page
                    owners, SSR requests, or readers implicitly.
                </p>
                <p>
                    Use the composable synchronously in script setup or the Options API's
                    <code>setup()</code>, then return its handle for use by methods and templates.
                    Calling it from created, data, an arbitrary module, or a click callback is not
                    the acquisition API. Ordinary functions can receive an already created handle.
                    This ownership follows Vue's
                    <DocsLink href="https://vuejs.org/api/composition-api-dependency-injection"
                        >provide and inject lifecycle</DocsLink
                    >.
                </p>
                <p>
                    Internal mount, disposal, protocol commit, and transport controls remain in
                    unexported closures or internal modules. The public handle never contains them.
                    Public declarations and package exports exclude internal paths. Add an adoptable
                    lint rule for forbidden deep imports and verify consumer discovery when it
                    ships. An internal annotation alone cannot hide a property from every IDE or
                    make an unconfigured consumer linter report an error. Type checks and package
                    exports reject unsupported access independently of that optional lint setup. The
                    local preview exports useDataAdapter and DataAdapterHandle.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
