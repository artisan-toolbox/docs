<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import RoadmapItem from '@/components/docs/RoadmapItem.vue';
import RoadmapPhase from '@/components/docs/RoadmapPhase.vue';
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
            <ProseSection>
                <p>
                    Status: implementation in progress, updated on 2026-11-16. The local preview
                    implements the first Collection and SQLite offset listing slice. Remaining
                    architecture examples describe proposed APIs, not a complete release.
                </p>
                <p>
                    This explanation records the intended contracts and delivery order for Dapter
                    maintainers. The goal is a small first implementation that works after
                    generating a DataSource, implementing <code>source()</code>, and referencing it
                    from a headless Vue adapter. Applications can then declare deeper customization
                    without replacing that path.
                </p>
                <p>
                    Run the implemented slice in
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/listing').href"
                        >Read and paginate a source</DocsLink
                    >. Every delivered setting has a public-API demo and behavioral checks. Search,
                    filters, selectable ordering, MySQL, PostgreSQL, URL persistence, scrolling,
                    Resources, actions, and live updates remain unavailable. The shared
                    useDataAdapter handle is implemented and documented in its own guide. The full
                    phase 1 and phase 2 exit criteria have not passed.
                </p>
                <p>
                    The server owns the allowed operations. The frontend can select only declared
                    fields, filters, comparison types, sort presets, and page sizes. Server
                    validation enforces the same limits on manually constructed requests.
                </p>
                <p>
                    This is the canonical roadmap. The package's <code>ROADMAP.md</code> and the
                    contributor documentation pointer link here. Current public instructions remain
                    in the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter').href"
                        >overview</DocsLink
                    >,
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >installation guide</DocsLink
                    >, and
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/development').href"
                        >development guide</DocsLink
                    >.
                </p>
                <p>
                    Review the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/design').href"
                        >proposed design</DocsLink
                    >
                    in focused guides for declarations, drivers, operations, pagination, actions,
                    and live updates.
                </p>
            </ProseSection>

            <ProseSection
                id="the-smallest-useful-implementation"
                title="The smallest useful implementation">
                <p>The proposed first experience is deliberately short:</p>
                <ol class="list-decimal space-y-3 pl-5">
                    <li>
                        <code>php artisan make:datasource Products</code> generates
                        <code>app/DataSources/Products.php</code> with the selected source contract.
                    </li>
                    <li>
                        The application implements <code>source()</code>, for example with an
                        existing <code>App\Models\Product::query()</code> or a Collection of defined
                        records.
                    </li>
                    <li>
                        <code>&lt;DataAdapter source=&quot;Products&quot;&gt;</code> resolves that
                        source and exposes its first page through the default slot.
                    </li>
                </ol>
                <p>
                    This source-only path is implemented in the local preview. The Eloquent example
                    assumes an application-owned <code>Product</code> model with an ordinary primary
                    key and SQLite query. Complete installation and retain the default web
                    authentication requirement, or explicitly declare public access for a public
                    source. Use the Sources guide for a self-contained fictional fixture.
                </p>
                <p>
                    With the package defaults and no optional declarations, the adapter loads
                    asynchronously, uses conventional numbered pagination, and offers page sizes
                    <code>[5, 10, 50, 100]</code> with a default of <code>10</code>. Eloquent uses
                    the qualified model primary key in ascending order when the source has no order.
                    Collections preserve their input order. Browser-controlled search, filters, and
                    sort controls start disabled until declared. A source can override these
                    defaults through attributes or its public <code>options()</code> hook.
                </p>
                <p>
                    For the MVP, evaluate eligibility after applying global scopes once. Source
                    builders must describe the full eligible result, without an existing
                    <code>limit</code>, <code>offset</code>, or pagination window. Reject
                    incompatible builders instead of silently removing application constraints. A
                    simple existing order is preserved and completed with the unique row identity
                    when needed. Complex grouping and custom count strategies arrive in a later
                    phase.
                </p>
                <p>
                    The generated endpoint uses Laravel's <code>web</code> middleware. The generated
                    source defaults to requiring an authenticated user from the <code>web</code>
                    guard. The middleware group does not authenticate by itself. Declare an optional
                    Gate ability and policy target, select another guard, or explicitly allow public
                    access through server-owned StoreOptions. These choices do not change the client
                    API. There is no implicit administrator-only policy, and the source author
                    remains responsible for restricting the returned records and sensitive fields.
                </p>
            </ProseSection>

            <ProseSection
                id="delivery-phases-and-exit-criteria"
                title="Implementation TODO and exit criteria">
                <p>
                    Expand a phase to read its task cards and acceptance details. Completion states
                    track only this roadmap, independently of package stability or overall progress.
                </p>
                <div class="border-t border-slate-200 dark:border-slate-800">
                    <RoadmapPhase
                        id="phase-0-settle-the-contract"
                        title="Phase 0. Settle the contract">
                        <ol class="list-none space-y-[0.75rem]">
                            <li>
                                <RoadmapItem
                                    id="todo-0-1"
                                    status="completed"
                                    title="TODO 0.1. Record server authority">
                                    <p>
                                        Record server authority and separate the immutable source
                                        definition, requested intent, effective execution, and
                                        bounded result. Accept browser choices only within declared
                                        limits. Resolve optional WithOptions exactly once, compose
                                        the selected config or empty baseline, inherited and
                                        concrete attributes, then explicit fluent declarations by
                                        key. Check access before source work. Bind the actual driver
                                        and accept the full supported plan before record reads. Use
                                        that acceptance to advertise capabilities. Use concrete
                                        enums for package-owned closed domains and stable wire
                                        values.
                                    </p>
                                    <p>
                                        The acceptance gate covers the current Collection and
                                        ordinary SQLite offset preview. Verify rejected client
                                        choices, incompatible drivers, scope application once,
                                        immutable request isolation, and the canonical bounded
                                        acknowledgement. The
                                        <DocsLink
                                            :href="
                                                findNavigationItem(navigation, 'dapter/authority')
                                                    .href
                                            "
                                            >server authority guide</DocsLink
                                        >
                                        contains the working boundary demo. Every fluent capability
                                        has an attribute shortcut. Each later operation phase must
                                        preserve this contract and deliver its own enum, attribute
                                        equivalent, permission and driver checks, and demo.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-0-2"
                                    status="completed"
                                    title="TODO 0.2. Define request and response contracts">
                                    <p>
                                        Define the versioned request schema, discriminated
                                        pagination responses, action outcomes, and HTTP error
                                        semantics. Give every MVP operation an input, accepted
                                        state, result, and failure example. Define all six field and
                                        global operation kinds before implementation, with automatic
                                        field behavior, fixed declarative global search, and Closure
                                        or trusted invokable class handlers only for global filters
                                        and orders. Settle one requested state and exclusive
                                        default, fields, or preset order, plus typed call and clear
                                        projections. Specify scoped transitions, capability versus
                                        additive intent, explicit page preservation, snapshot
                                        restoration, and source-default reset. Cover raw JSON
                                        structure, interoperable numbers, a sanitized access
                                        discriminator, and canonical editable intent in the
                                        response.
                                    </p>
                                    <p>
                                        The working
                                        <DocsLink
                                            :href="
                                                findNavigationItem(navigation, 'dapter/protocol')
                                                    .href
                                            "
                                            >read protocol v1 reference</DocsLink
                                        >
                                        and its error guide share concrete request and response
                                        examples with Laravel and frontend conformance tests. The
                                        specialized design guides define the planned version 2
                                        grammar through checked operation, paging, action, and
                                        transition contracts. This task settles those contracts;
                                        later phases implement their capabilities and demos. The
                                        current endpoint rejects version 2.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-0-3"
                                    status="completed"
                                    title="TODO 0.3. Settle source and record boundaries">
                                    <p>
                                        Preserve conventional source identifiers, fresh source
                                        resolution, mandatory server scope, and JSON-safe public
                                        projection. Separate logical source, local adapter, raw
                                        selector, hydrated key, and public row identity. Specify
                                        trusted alias and driver registration precedence and the
                                        future accepted execution's source, reader, scope, driver,
                                        and verified connection binding. Keep the current public
                                        plan's narrower guarantees explicit.
                                    </p>
                                    <p>
                                        Define aligned raw-row identity metadata before optional
                                        Resources in the checked planned v2 envelope. Distinguish
                                        DataSource from the context-bound DataStore coordinator.
                                        Settle one atomic broadcastUpdatable declaration and its
                                        equivalent attribute, explicit PrivateChannel or
                                        PublicChannel, trusted audience resolution, and narrowing
                                        Laravel Gate authorization. Deny missing private context.
                                        Keep a shared uint64-decimal RowRevisionProvider optional
                                        and state the arrival-order limits without it. The
                                        <DocsLink
                                            :href="
                                                findNavigationItem(
                                                    navigation,
                                                    'dapter/source-boundaries',
                                                ).href
                                            "
                                            >working source-boundary guide</DocsLink
                                        >
                                        proves the current scope and projection behavior. The
                                        specialized design references settle future contracts; their
                                        runtime remains in the owning later phases.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-0-4"
                                    status="completed"
                                    title="TODO 0.4. Confirm authorization defaults">
                                    <p>
                                        Confirm authenticated access by default, the web guard,
                                        explicit guard selection, optional Gate abilities and policy
                                        targets, and the public-source override. Bind Gate and
                                        Resource to the selected principal. Require authorization
                                        before source execution, counts, capability output, and
                                        serialization. Use the sanitized error kind to distinguish
                                        access-loss cleanup from a recoverable listing error,
                                        including when both use HTTP 503.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-0-5"
                                    status="completed"
                                    title="TODO 0.5. Set query defaults and counts">
                                    <p>
                                        Fix the defaults for offset pagination, page sizes, existing
                                        order and its unique tie-breaker, literal search, and scalar
                                        filters. Keep an authorized base total separate from the
                                        filtered count, including zero matches. Seed offset mode, 10
                                        records, and [5, 10, 50, 100] through the factory. A chosen
                                        size joins the allowed list. Replacement lists retain that
                                        size in deterministic first-declared order, independent of
                                        setter order. Browser input cannot expand the server list.
                                        Specify the logical scalar domain for each managed field
                                        comparison.
                                    </p>
                                    <p>
                                        Current Collection and SQLite endpoint tests verify
                                        defaults, bounded counts, empty results, and stable offset
                                        order. The checked
                                        <DocsLink
                                            :href="
                                                findNavigationItem(
                                                    navigation,
                                                    'dapter/design/operations',
                                                ).href + '#query-contract-reference'
                                            "
                                            >query contract reference</DocsLink
                                        >
                                        fixes planned scalar domains, literal matching, numeric
                                        parsing, and distinct total and filtered count arithmetic.
                                        This closes the phase 0 contract. Search, filters, and
                                        native SQL comparison profiles remain in their later
                                        delivery gates.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-0-6"
                                    status="completed"
                                    title="TODO 0.6. Define shared fixtures">
                                    <p>
                                        Define shared fixtures for raw JSON objects, lists, null,
                                        malformed input, untrimmed strings, numeric round trips, and
                                        cloaked denials. Use arrays, Collections, SQLite, MySQL, and
                                        PostgreSQL. Include hidden fields, tenant boundaries,
                                        duplicate sort values, empty inputs, and zero-match
                                        searches. Pin database versions. For each driver, specify
                                        expected rows, counts, and errors for an allowed plan, a
                                        forbidden final clause, and two individually supported
                                        operations that cannot run together. Cover source-only and
                                        attribute-only declarations, WithOptions opt-in, hook calls
                                        exactly once, undeclared hooks, both factory baselines,
                                        missing required settings without config, explicit fluent
                                        patches, inherited attributes, fresh factory isolation,
                                        same-layer duplicate identifiers, capability removals,
                                        invalid sizes, both size setter orders, and config-cache
                                        data. An uncalled config default never masks attributes. An
                                        explicit equal-to-default setter does. Cover scoped field
                                        filter ids, merged field nodes, unsupported null
                                        capabilities, selected null, false, and zero, strict
                                        empty-list policy, all and any grouping, fixed target
                                        parsing, and field versus preset order. Specify
                                        source-first, value-second global filter transforms,
                                        source-only global order callbacks, and strict enum binding.
                                        Cover replace versus additive order, limit rejection,
                                        inactive clears, exact-count clamping, and unchanged
                                        criteria. Define resource omission of identity and private
                                        versus explicit public audiences.
                                    </p>
                                    <p>
                                        The
                                        <DocsLink
                                            :href="
                                                findNavigationItem(
                                                    navigation,
                                                    'dapter/design/fixtures',
                                                ).href
                                            "
                                            >shared fixture reference</DocsLink
                                        >
                                        defines the reusable data, complete driver-plan examples,
                                        selected database targets, and evidence categories. Current
                                        cases execute the installed package. Pure reference cases
                                        verify proposed semantics. Specification cases fix concrete
                                        future expectations without claiming native execution or
                                        enabling unavailable APIs. Both current protocol consumers
                                        retain the original shared raw corpus.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-0-7"
                                    status="in_progress"
                                    title="TODO 0.7. Review contract evidence">
                                    <p>
                                        Review the fixtures against the proposed contract and record
                                        accepted refinements in this canonical roadmap. Treat
                                        unresolved public behavior as a blocker for its dependent
                                        task.
                                    </p>
                                </RoadmapItem>
                            </li>
                        </ol>
                        <p>
                            Exit when every MVP operation has an input, effective state, expected
                            result, and failure example. Only optional
                            <code>WithOptions</code> requires public
                            <code>options(): StoreOptions</code>. Source-only and attribute-only
                            paths use the internal config-seeded resolver. Raw source
                            implementations use the same coordinator. Both factories preserve
                            attributes, and an empty baseline never silently regains config. Revisit
                            exact names here without claiming released compatibility. Package
                            defaults and override failures have fixtures, and filter value shapes,
                            strict allowlists, and typed enum binding are settled. Six-kind
                            declarations, nested nullable projections, scoped duplicate failures,
                            and order exclusivity have concrete fixtures. Decoder props determine
                            the static types for rows and operation metadata independently.
                            Later-phase fixtures specify the expected behavior for their owning
                            phase.
                        </p>
                    </RoadmapPhase>
                    <RoadmapPhase
                        id="phase-1-build-the-smallest-backend-path"
                        title="Phase 1. Build the smallest backend path">
                        <ol class="list-none space-y-[0.75rem]">
                            <li>
                                <RoadmapItem
                                    id="todo-1-1"
                                    status="in_progress"
                                    title="TODO 1.1. Define backend source contracts">
                                    <p>
                                        After the relevant phase 0 fixture passes, add typed
                                        Eloquent and Collection source contracts, the normalized
                                        definition, and small optional base classes with an internal
                                        request-scoped options resolver. Keep
                                        <code>WithOptions</code> optional; it requires the custom
                                        public hook and triggers exactly one call before proceeding.
                                        Reject a public hook without the contract or an invalid hook
                                        return. Resolve source-only, attribute-only, and fluent
                                        declarations through the same layered normalizer. Implement
                                        config-seeded <code>make()</code> and
                                        <code>makeWithoutDefaults()</code> without reseeding the
                                        empty baseline. Require mode, positive size, and guard
                                        before work; retain authentication and mandatory scope. Ship
                                        basic attribute parity now. Separate config defaults from
                                        explicit fluent setters, validate duplicate keys and
                                        removals, and preserve unrelated declarations. Config
                                        declares no browser fields or global broadcasting. Enforce
                                        the private factory constructor and normalize one immutable
                                        definition. Declare direct runtime dependencies. Register
                                        and publish only cacheable scalars, arrays, and enum cases
                                        in config. Implement MVP enums and typed immutable options
                                        now, before engine dispatch. Validate chosen-size list
                                        retention, source policy precedence, and engine
                                        compatibility. Bind the StoreDriver to the typed source and
                                        its actual connection through the server registry. Reject an
                                        unknown driver or ambiguous registration.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-1-2"
                                    status="completed"
                                    title="TODO 1.2. Generate a minimal DataSource">
                                    <p>
                                        Build the minimal DataSource generator against those
                                        contracts. A conventional generated source needs only
                                        <code>source()</code>, without mandatory attributes or an
                                        application registry entry.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-1-3"
                                    status="in_progress"
                                    title="TODO 1.3. Resolve and authorize sources">
                                    <p>
                                        Resolve conventional public source names and explicit
                                        aliases into a fresh source per request. Resolve exactly the
                                        configured guard and run the declared Gate ability before
                                        source() or any count. Test guests, the wrong logged-in
                                        guard, policy allow and deny responses, unknown guards, and
                                        zero protected reads on rejection. Preserve mandatory scope
                                        after authorization. Verify that every listing request
                                        rechecks access. Phase 2 exercises reloads and restores.
                                        Phase 3a exercises polling and scoped update delivery.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-1-4"
                                    status="in_progress"
                                    title="TODO 1.4. Validate requested state">
                                    <p>
                                        Decode the original JSON body once and preserve object,
                                        list, null, and literal string values. Parse the phase 0
                                        request schema into typed requested state, converting
                                        strictly typed transport tokens into concrete enums once.
                                        Enforce strict allowlists for public fields, operators,
                                        directions, filters, and page sizes before invoking an
                                        engine. Validate MVP declarations without executing
                                        <code>source()</code> or constructing handlers. Reject
                                        missing mode, chosen size, or guard from an empty baseline
                                        as sanitized configuration errors before protected work.
                                        Attribute presence alone never requires
                                        <code>WithOptions</code>. Validate the complete field and
                                        global request, strict option membership, matchType,
                                        sortType, order exclusivity, server multi-order permission
                                        and field-term limit, priorities, and paging eligibility
                                        before constructing operation handlers or running listing
                                        queries. Invalid clause values return HTTP 422 with zero
                                        operation handlers or driver listing reads. Malformed JSON
                                        returns 400.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-1-5"
                                    status="in_progress"
                                    title="TODO 1.5. Build the Collection offset pipeline">
                                    <p>
                                        Normalize ordinary arrays and Collections at one boundary.
                                        Implement the Collection offset pipeline in
                                        CollectionStoreDriver. Keep input order for tied rows using
                                        their ordinal within this evaluation. Test rows without IDs,
                                        duplicate values, separate base and filtered counts, and a
                                        bounded page that serializes as a JSON list.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-1-6"
                                    status="in_progress"
                                    title="TODO 1.6. Build the Eloquent offset pipeline">
                                    <p>
                                        Implement the equivalent ordinary Eloquent offset pipeline
                                        on SQLite, MySQL, and PostgreSQL through three drivers
                                        sharing the same builder pipeline. Clone builders for counts
                                        and pages. Test a base predicate containing a top-level OR
                                        and a global scope that adds a limit. Preserve the complete
                                        predicate. Reject existing windows and unsupported query
                                        forms instead of removing application constraints.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-1-7"
                                    title="TODO 1.7. Add basic sort, search, and filters">
                                    <p>
                                        Add declared single-field sorting, literal search, and
                                        scalar filters to both pipelines through searchableField,
                                        orderableField, and filterableField. These field operations
                                        are automatic. Group OR search predicates inside mandatory
                                        scope and preserve it when controls are cleared. Apply typed
                                        equality, membership, and null predicates to compatible
                                        targets. Cover integer zero, string zero, and false on both
                                        input and record sides. Retain a base clone for totals
                                        without replaying transforms for filtered counts. Test
                                        multiple named filters on one field and merged nodes.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-1-8"
                                    status="completed"
                                    title="TODO 1.8. Expose the JSON endpoint">
                                    <p>
                                        Expose the named JSON endpoint through declared middleware
                                        and serialize the versioned response. Default model
                                        serialization respects hidden and visible fields. Array
                                        records must be JSON-safe. Never bypass visibility with raw
                                        attributes. Return normalized editable intent separately
                                        from the effective order and counts. Use the access
                                        discriminator even for a cloaked 404 or a policy denial with
                                        a 5xx status. Keep the later optional Resource path behind
                                        this same row serialization boundary.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-1-9"
                                    status="in_progress"
                                    title="TODO 1.9. Verify the backend journey">
                                    <p>
                                        Run the same behavioral cases through arrays, Collections,
                                        and all three databases. Verify the generated source-only
                                        journey, allowlist failures, authorization, ordering,
                                        counts, serialization, and engine differences before Vue
                                        integration. Test config publication and config-cache round
                                        trips, fresh factory isolation, config-seeded defaults,
                                        empty-baseline isolation, hook calls exactly once,
                                        missing-setting failures, attribute-only operation, keyed
                                        overrides, inheritance, removals, and explicit setters equal
                                        to config. Verify chosen-size retention in both setter
                                        orders, invalid sizes, and unchanged source-only operation.
                                        Compare row-side types across drivers for integer zero,
                                        string zero, and false. Measure driver listing reads
                                        separately from authorization, catalog probes, and work done
                                        by application sources. Reject an invalid final operation
                                        before applying earlier filters. Test stale profiles,
                                        connection mismatches, and probe failures.
                                    </p>
                                </RoadmapItem>
                            </li>
                        </ol>
                        <p>
                            Exit when a generated source with only <code>source()</code> returns its
                            first page, undeclared operations fail, tenant scope survives grouped OR
                            searches and cleared filters, and a zero-match search returns
                            <code>total: 100</code> with <code>filtered: 0</code> for the defined
                            100-row fixture. Hidden fields stay hidden, and all baseline engines
                            pass the shared behavioral cases. No mandatory attributes or application
                            registry entry is needed for the conventional case. Basic attributes and
                            explicit fluent patches normalize through the same request-scoped
                            resolver. Config overrides, publication, and cache round trips pass
                            without caching callbacks, resolved handler instances, or
                            reader-specific policy. Invalid filter state causes zero handler calls.
                            Test managed field transforms and count semantics here. Phase 3 verifies
                            successful custom filter and order callbacks.
                        </p>
                    </RoadmapPhase>
                    <RoadmapPhase
                        id="phase-2-complete-the-first-vue-experience"
                        title="Phase 2. Complete the first Vue experience">
                        <ol class="list-none space-y-[0.75rem]">
                            <li>
                                <RoadmapItem
                                    id="todo-2-1"
                                    status="in_progress"
                                    title="TODO 2.1. Define the Vue response and slot contract">
                                    <p>
                                        Establish the shared controller and useDataAdapter ownership
                                        before extending the typed response. Bind a host handle
                                        through adapter, keep source-owning components independent,
                                        and verify exact handle identity in both acquisition orders.
                                        Keep internal methods outside the public facade and
                                        declaration exports. For each verified backend capability,
                                        define the typed response envelope, transport parser,
                                        props-derived DataAdapter default slot, and action outcomes.
                                        Keep post-Resource rows independent from explicit operation
                                        definitions. Parse the protocol from unknown. Infer row and
                                        operation types from supplied decoders. Test source-only
                                        access, first-render readiness, and permission-narrowed
                                        subsets. Type-check narrowed match types, sort types, finite
                                        values, nullable capabilities, and named filter entries.
                                        Declare only the necessary runtime peers.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-2-2"
                                    status="completed"
                                    title="TODO 2.2. Load the first source asynchronously">
                                    <p>
                                        Implement the first asynchronous source-only load through
                                        Inertia useHttp. Mount
                                        <code>&lt;DataAdapter source=&quot;Products&quot;&gt;</code>
                                        and expose loading, records, accepted state, and initial
                                        failure through the slot.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-2-3"
                                    status="in_progress"
                                    title="TODO 2.3. Add pagination and refresh actions">
                                    <p>
                                        Add numbered pagination, page-size selection, and refresh
                                        actions against the accepted offset response. Reset the
                                        requested page when criteria or page size changes. Preserve
                                        unrelated criteria and size. Support explicit page
                                        preservation only for exact-count offset without infinite
                                        mode, with server clamping and atomic local rejection in
                                        unsupported modes.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-2-4"
                                    title="TODO 2.4. Expose declared query controls">
                                    <p>
                                        Expose declared sort, search, and scalar filter controls
                                        through nested fields and global slot projections. Use
                                        available, current, call, and clear. Unsupported
                                        capabilities and empty filter maps are null; named entries
                                        may be absent for the reader. Derive current from one
                                        requested state. Local actions patch one selection, and
                                        replaceState atomically replaces full state. Add explicit
                                        resetState for current source defaults; inactive clears and
                                        identical intents make no request. Keep source-only usage
                                        short and test selected null versus absence, false and zero,
                                        action outcomes, and order exclusivity.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-2-5"
                                    status="in_progress"
                                    title="TODO 2.5. Prove request safety and recovery">
                                    <p>
                                        Prove current-generation commits, request coalescing,
                                        initial and refresh failures, retry, and disposal before
                                        connecting browser history. A stale response must not
                                        replace records or accepted state, and adapter instances
                                        must remain independent. Test debounced search then sort
                                        against latest requested state, stale closures, and source
                                        or tenant disposal before new rows load. Exercise access and
                                        validation through useHttp's 422 callback with withAllErrors
                                        enabled. Verify missing or malformed reserved kinds and
                                        ambiguous non-JSON responses clear protected state. A late
                                        denial from a superseded generation cannot clear a newer
                                        authorized result.
                                    </p>
                                    <p>
                                        Verify one request for shared host and component
                                        acquisition, independent same-source stores, decoder
                                        mismatch rejection, sibling handle binding, Options API
                                        setup, and owner disposal. A borrowed view must not cancel
                                        the live owner's request. Keep separate action and listing
                                        request lifecycles.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-2-6"
                                    title="TODO 2.6. Restore URL and browser history state">
                                    <p>
                                        Add URL namespaces and requested-state serialization.
                                        Restore full reload and back and forward navigation, while
                                        retaining the distinction between requested and accepted
                                        state. Apply a compatible full snapshot atomically once,
                                        honoring supplied position, without an automatic reset or
                                        duplicate load. Test an absent namespace, an explicit clear
                                        of a source default, and a winning clamped page. Exclude
                                        interaction hints and capability flags from serialized
                                        state.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-2-7"
                                    title="TODO 2.7. Reset the intended scroll container">
                                    <p>
                                        After URL restoration works, implement the intended
                                        scroll-container reset for accepted page changes. Preserve
                                        scroll for the actions whose contract requires it.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-2-8"
                                    status="in_progress"
                                    title="TODO 2.8. Verify table and grid consumers">
                                    <p>
                                        Render the same source as a table and a grid through the
                                        default slot in a real Laravel and Inertia application.
                                        Check the generated source-only journey and source and built
                                        frontend entries in the existing packed consumers.
                                    </p>
                                </RoadmapItem>
                            </li>
                        </ol>
                        <p>
                            Exit when the three-step application journey works in a real Laravel and
                            Inertia app. A deliberately slow old response cannot replace a newer
                            result or commit after disposal. Two instances of the same source do not
                            cancel or rewrite each other. A reload preserves selected state and a
                            page change resets the intended scroll container. Full reload and
                            browser history restore the requested URL state. Rendered consumers and
                            type checks prove nested nullable field and global projections without
                            inferring operation ids from Resource rows. Local patches preserve
                            unrelated selections, and full replacement validates before mutation.
                            Existing paging action names remain.
                        </p>
                        <p>
                            Phases 1 and 2 together form the MVP. Keep the generated source and the
                            consumer example short while testing the implementation behind them
                            thoroughly.
                        </p>
                    </RoadmapPhase>
                    <RoadmapPhase
                        id="phase-2a-add-authorized-datastore-actions"
                        title="Phase 2a. Add authorized DataStore actions">
                        <ol class="list-none space-y-[0.75rem]">
                            <li>
                                <RoadmapItem
                                    id="todo-2a-1"
                                    title="TODO 2a.1. Define action discovery and metadata">
                                    <p>
                                        After the shared adapter contract, normalize private Action
                                        methods and explicitly registered dedicated action classes.
                                        Add withActions and its Actions shortcut together. Validate
                                        names, aliases, signatures, declared public trait methods,
                                        excluded inherited and magic methods, and duplicate
                                        failures. Support equivalent action policy declarations
                                        through attributes and options, keyed by action identifier.
                                        Apply options layering before evaluating the selected
                                        guard's principal and trusted target. Serialize only actions
                                        allowed by their declared policy, without PHP internals or
                                        policy details.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-2a-2"
                                    title="TODO 2a.2. Add package-owned authorized action routing">
                                    <p>
                                        Register the internal named action route. Recheck source
                                        guard, source Gate, action permission, HTTP verb, and
                                        transport before resolving action owners. Support bound
                                        private method Closures, container dependencies, and
                                        FormRequest authorization and validation. Prove
                                        source-scoped record selection, CSRF, guard isolation, and
                                        zero mutations on rejection. Reevaluate declared policies
                                        for direct requests and permissions revoked since metadata
                                        generation. Application authors declare no per-action
                                        endpoints.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-2a-3"
                                    title="TODO 2a.3. Preserve visit and HTTP response semantics">
                                    <p>
                                        Define native ActionTransport and action verb enums. Default
                                        to visits and explicitly enable HTTP or both. Keep native
                                        redirects and error bags for visits, and compatible JSON for
                                        useHttp. Reject unsupported modes before execution. Never
                                        rerun a mutation to adapt its response or silently navigate
                                        on HTTP.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-2a-4"
                                    title="TODO 2a.4. Expose typed shared action controls">
                                    <p>
                                        Add actions.visit and actions.http to the same public handle
                                        and slot projection, using generated route URLs and native
                                        transport-specific options. Use explicit payload and result
                                        definitions, with unknown fallback. Keep action pending and
                                        error state separate. Preserve listing intent and leave
                                        reload explicit. Never apply read coalescing or automatic
                                        retries to writes.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-2a-5"
                                    title="TODO 2a.5. Verify functional action and composable demos">
                                    <p>
                                        Deliver Front Awesome demos for private and external
                                        actions, both transports, shared host handles and
                                        independent adapters. Execute private FormRequests, denied
                                        and expired access, validation errors, redirects, JSON,
                                        source-scoped ids, network uncertainty, duplicate discovery,
                                        disposal, and lint/type negative controls. Verify attribute
                                        and options policy parity, declaration precedence, omission
                                        of denied action metadata, record-specific permissions, and
                                        denial before mutation after permission revocation. Every
                                        delivered option needs a working public-API demo.
                                    </p>
                                </RoadmapItem>
                            </li>
                        </ol>
                        <p>
                            Exit when declared actions execute through package routes exactly once
                            per accepted request, with native response behavior and authorization
                            before mutation. Actions denied by a declared policy never appear in
                            client metadata and remain protected against direct calls. The host and
                            its bound view share one store; another adapter does not share its
                            state. Undeclared methods never execute, protected data never crosses
                            contexts, and action completion never silently resets a listing.
                        </p>
                    </RoadmapPhase>
                    <RoadmapPhase
                        id="phase-3-add-deeper-declarations-and-composed-operations"
                        title="Phase 3. Add deeper declarations and composed operations">
                        <ol class="list-none space-y-[0.75rem]">
                            <li>
                                <RoadmapItem
                                    id="todo-3-1"
                                    title="TODO 3.1. Extend declaration contracts">
                                    <p>
                                        After the MVP, extend
                                        <code>StoreOptions</code> normalization for deeper
                                        operations without changing source-only defaults. Extend the
                                        existing MVP enum contracts and typed option objects through
                                        the same optional <code>WithOptions</code> hook and
                                        independent attribute schema. Refine fluent APIs and
                                        matching attributes for advanced options on the six root
                                        declaration methods without adding child builders or
                                        per-operation interfaces. Preserve count and navigation
                                        limits. Test keyed config, attribute, and fluent composition
                                        and deterministic page-size retention without reviving
                                        removed entries. Give driver-dependent global handlers
                                        explicit trusted requirements in both declaration forms. The
                                        evaluator cannot infer those requirements by inspecting
                                        arbitrary PHP.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-3-2"
                                    title="TODO 3.2. Add multi-sort and presets">
                                    <p>
                                        Extend the basic sort contract with independent multi-sort
                                        directions, sortTypes, maximum lengths, labeled
                                        globalOrderable Closure or invokable-class presets, and
                                        requested versus effective order. Keep one default, fields,
                                        or preset union. Separate global.multi_order permission from
                                        transient multiSort intent, defaulting false. Test append
                                        and update, explicit additive priority, limit rejection
                                        without eviction, and opaque-preset rejection. Prove
                                        priority from array order, replacement on mode changes,
                                        fixed prefix retention, and unique ties. Opaque Collection
                                        callbacks supply complete order themselves; do not infer
                                        comparator ties or add a post-sort. Presets stay offset-only
                                        and expose no client direction.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-3-3"
                                    title="TODO 3.3. Compose declared search">
                                    <p>
                                        Extend literal field search with globalSearchable fixed
                                        target matchType and valueType metadata. Global search is
                                        automatic, with one string and grouped OR targets. Preserve
                                        grouped OR scope under declared all or any search
                                        composition and AND filters. Test fluent and attribute
                                        grouping settings, the fixed All default, and rejection of
                                        an undeclared grouping. Test Notebook against text and
                                        numeric targets, all incompatible targets returning no
                                        matches, empty text clearing, zero active, and invalid
                                        numeric field input returning HTTP 422.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-3-4"
                                    title="TODO 3.4. Add multi-value and custom filters">
                                    <p>
                                        After filter composition is defined, extend automatic named
                                        filterableField membership and add globalFilterable presets
                                        with finite values and custom handlers. Field filters never
                                        require callbacks. Preserve declared empty-list clear or
                                        reject policy. Verify empty values, mixed criteria, and
                                        handler failures against the same normalized contract.
                                        Validate all values before invoking any handler. Test strict
                                        enum subsets, mixed wire values versus typed enum cases,
                                        nullable binding, pure enums, explicit multi-value element
                                        binding, integer and string mismatches, wrong source types,
                                        and exceptions. One invalid member returns HTTP 422 with
                                        zero handler calls.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-3-5"
                                    title="TODO 3.5. Extend attribute and handler parity">
                                    <p>
                                        Extend the basic attribute support delivered in phase 1 with
                                        every advanced option DTO, enum binding, and handler form
                                        accepted fluently. Test explicit ancestry traversal,
                                        ordinary PHP method inheritance, parent::options() retention
                                        when a parent authors that hook, intentional replacement of
                                        the fluent layer and factory baseline, and matching removal
                                        attributes. Verify same-layer duplicate failures,
                                        config-seeded defaults, PHP 8.5 static closure attributes,
                                        and trusted invokable class handlers. Resolve services only
                                        after access and complete request validation. Prove strict
                                        enum binding parity, constructor injection, container
                                        lifetime isolation, zero constructions for invalid input,
                                        and runtime handler resolution without serializing closures
                                        or services into config.
                                    </p>
                                    <p>
                                        Add private method GlobalFilter and GlobalOrder targets with
                                        bound declaring-class Closures. Keep class-level static
                                        Closure and invokable support. Validate identical operands,
                                        values, enum conversion, inheritance, explicit aliases,
                                        method-name defaults, duplicate failures, and preserved
                                        scope. Reject apply on a method and action/query dual
                                        registration.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-3-6"
                                    title="TODO 3.6. Verify advanced Eloquent queries">
                                    <p>
                                        Extend the ordinary query cases with qualified joined
                                        fields, aliases,
                                        <code>whereHas</code>, duplicate model keys, grouped counts,
                                        and custom count strategies. Test supported handlers and
                                        intentional unsupported-query errors on each database.
                                        Recheck model, connection, and effective query shape after
                                        handlers and global scopes, before reading rows or counts.
                                    </p>
                                </RoadmapItem>
                            </li>
                        </ol>
                        <p>
                            Exit when the same public field can target
                            <code>joined_table.id</code> without exposing SQL selection to the
                            browser. Attribute and explicit definitions yield equivalent normalized
                            contracts through one engine path, without a trait or provider
                            registration. Advanced attributes preserve full fluent parity. Invalid
                            declarations and same-layer duplicate identifiers fail configuration
                            before query execution. Unsupported query forms fail clearly without
                            changing the source query or dropping rows. Custom transforms and
                            attribute handlers share strict option and enum binding behavior.
                            Forbidden subset values and invalid multi-value members invoke zero
                            handlers and construct no handler instances. Keyed overrides replace
                            whole entries while unrelated attribute declarations remain.
                        </p>
                    </RoadmapPhase>
                    <RoadmapPhase
                        id="phase-3a-add-live-updates-and-polling"
                        title="Phase 3a. Add live updates and polling">
                        <ol class="list-none space-y-[0.75rem]">
                            <li>
                                <RoadmapItem
                                    id="todo-3a-1"
                                    title="TODO 3a.1. Implement Resource and identity serialization">
                                    <p>
                                        Implement the settled optional
                                        <code>useResource(class-string&lt;JsonResource&gt;)</code>
                                        after filtering, sorting, and paging. Share raw-row
                                        serialization between HTTP and events. For opted-in row
                                        matching, extract safe stable identity into aligned public
                                        row metadata before Resources can omit or rename it. Respect
                                        model visibility by default. Validate resource classes and
                                        explicit reader context through final nested Resource and
                                        ResourceCollection materialization for HTTP and queued
                                        recipients. Keep the ambient request intact.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-3a-2"
                                    title="TODO 3a.2. Implement channel authorization and context">
                                    <p>
                                        Implement the phase 0 atomic broadcastUpdatable declaration
                                        and BroadcastUpdatable attribute with PrivateChannel,
                                        PublicChannel, trusted audience context, and narrowing
                                        Laravel Gate authorization. Implement the configured private
                                        context resolver for shorthand declarations. Default to
                                        private Laravel-authorized channels and deny missing
                                        context. Public requires explicit opt-in and a public-safe
                                        projection. Match the DataStore guard and Gate in private
                                        subscription authorization. Require disjoint guard-specific
                                        channel patterns, including when both guards have logged-in
                                        users. Define revocation through per-recipient authorization
                                        or channel rotation and disconnection, including queued
                                        recipient context. Test cross-tenant denial, reader-aware
                                        Resources, safe client descriptors, missing Echo, and
                                        visible authorization failures without public fallback.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-3a-3"
                                    title="TODO 3a.3. Add the scoped update pipeline">
                                    <p>
                                        Implement context-bound
                                        <code>DataStore::update(identified: ...)</code>
                                        with one ID or a list of stable integer or string IDs.
                                        Deduplicate, reject invalid IDs, and make an empty list a
                                        no-op. Bound batch limits. Re-read the authorized base
                                        source without dynamic listing criteria or its page window,
                                        constrain a cloned Eloquent builder before materialization,
                                        or filter the Collection by its declared identity. Missing
                                        or denied rows emit nothing. Publish only after commit
                                        through the same audience-aware row serializer as HTTP.
                                        Never perform persistence writes, unscoped lookups, or
                                        deletion reconciliation.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-3a-4"
                                    title="TODO 3a.4. Add replacement-only listener lifecycle">
                                    <p>
                                        Mount an Echo listener only when broadcasting is enabled and
                                        an application Echo instance exists. Replace only matching
                                        IDs already in the current loaded payload and same source
                                        context. Apply the HTTP row parser and optional decodeRow to
                                        immediate and buffered replacements. Rejected event data
                                        keeps the loaded row and raises an integration error.
                                        Preserve row index, URL, counts, cursors, scroll, and
                                        selection. Never insert, remove, reorder, reconcile, or
                                        automatically reload, even when changed values affect sort
                                        or filter membership. Infinite mode updates only loaded
                                        rows. Remove owned listeners without leaving a shared
                                        channel used by another adapter.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-3a-5"
                                    title="TODO 3a.5. Bound event and HTTP races">
                                    <p>
                                        Use per-instance context generations, event-ID
                                        deduplication, and bounded buffering while HTTP is pending.
                                        Replay applicable replacements in received order after the
                                        winning result, only for IDs present in that result. Discard
                                        superseded context work. Define overflow and failure
                                        behavior without automatic reload. Arrival order does not
                                        establish database freshness. Optional source revisions
                                        supplied by the settled uint64-decimal RowRevisionProvider
                                        and shared by HTTP and events can reject stale duplicates
                                        and reordered updates. Do not require new revision
                                        infrastructure or treat updated_at as a sufficient revision.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-3a-6"
                                    title="TODO 3a.6. Add opt-in polling scheduling">
                                    <p>
                                        Implement frontend polling with default
                                        <code>false</code> and a validated positive interval. Use
                                        the same explicit reload behavior, latest requested state,
                                        and scroll rules. Skip active requests and scheduled
                                        interactive or debounced work, then schedule the next timer
                                        after settlement and rendering. Pause when hidden or
                                        offline, clean up on unmount, and prevent catch-up piles.
                                        Pause polling on failure until an explicit retry succeeds or
                                        the consumer restarts polling. Explicit reload retries
                                        retained requested intent after failure. Infinite reload
                                        resets to the first window. Verify standalone HTTP
                                        scheduling rather than assuming Inertia page polling owns
                                        this transport.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-3a-7"
                                    title="TODO 3a.7. Verify behavior and consumer guidance">
                                    <p>
                                        Test default-disabled options, resource identity omission,
                                        authorized private and explicit public channels, scoped
                                        batches, commit and rollback, unknown IDs, context
                                        isolation, listener cleanup, duplicate events, bounded
                                        races, and polling timers. Prove replacement-only behavior
                                        for changed sort and filter values without modifying counts
                                        or navigation. Run engine conformance and realistic
                                        consuming-application checks. Update consumer skills,
                                        central guides, and changelogs with tested prerequisites and
                                        limits before presenting any API as released.
                                    </p>
                                </RoadmapItem>
                            </li>
                        </ol>
                        <p>
                            Exit when optional Resources and scoped committed updates produce the
                            same authorized row schema as HTTP, private authorization and public
                            opt-in pass, and Echo replaces only loaded rows without changing listing
                            structure. Test the same decoded row shape over HTTP, immediate
                            delivery, and buffered replay. A failed replacement leaves the previous
                            row intact. Baseline races are bounded with explicit arrival-order
                            limits. Polling stays disabled until requested and follows the existing
                            reload contract. Test both integrations independently and together
                            without automatic event reloads.
                        </p>
                    </RoadmapPhase>
                    <RoadmapPhase
                        id="phase-4-add-honest-pagination-choices"
                        title="Phase 4. Add honest pagination choices">
                        <ol class="list-none space-y-[0.75rem]">
                            <li>
                                <RoadmapItem
                                    id="todo-4-1"
                                    title="TODO 4.1. Define simple and cursor results">
                                    <p>
                                        Build on the MVP pagination contract. Define simple and
                                        cursor result variants with nullable counts and navigation
                                        capabilities before adding actions. Include phase 3 criteria
                                        in cursor binding whenever those optional criteria are
                                        enabled.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-4-2"
                                    title="TODO 4.2. Implement simple pagination">
                                    <p>
                                        Implement simple pagination without an exact-count
                                        requirement. Let the frontend expose only the navigation
                                        actions supplied by that result variant.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-4-3"
                                    title="TODO 4.3. Validate cursor order and scope">
                                    <p>
                                        Before executing a cursor query, validate a supported unique
                                        extractable full field order, null restrictions, and its
                                        identity tie-breaker. Reject opaque callback order presets
                                        with HTTP 422. Local unsupported selection fails without
                                        mutating state or switching paging mode. Bind the cursor to
                                        the source, authorization scope, effective criteria, and
                                        order.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-4-4"
                                    title="TODO 4.4. Implement cursor traversal and recovery">
                                    <p>
                                        Implement cursor traversal, tamper checks, expiration, and
                                        recovery. Return null for unsupported numbered-page and
                                        last-page navigation instead of manufacturing values or
                                        enabling jumps.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-4-5"
                                    title="TODO 4.5. Define optional exact-count costs">
                                    <p>
                                        Add optional exact counts with a documented cost policy.
                                        Keep deterministic order, high-water limits, and snapshot
                                        consistency distinct, whether counts are enabled or omitted.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-4-6"
                                    title="TODO 4.6. Verify cursor behavior across changes">
                                    <p>
                                        Test ties, opposite sort directions, insertion before and
                                        after the cursor, deletions, mutable sort values, null
                                        rejection, changed criteria, and changed authorization
                                        scope. Reject page-preservation hints outside exact-count
                                        ordinary offset mode without mutation; criteria changes
                                        invalidate cursors and accumulated windows. Run the
                                        corresponding action and nullable-navigation checks in Vue.
                                    </p>
                                </RoadmapItem>
                            </li>
                        </ol>
                        <p>
                            Exit when the tests distinguish deterministic ordering from snapshot
                            consistency. Cursor results never fabricate page numbers, totals, or
                            last-page navigation. Unsupported cursor navigation remains null and its
                            actions remain unavailable. Tampering and scope changes cannot reuse an
                            invalid cursor. Opaque callback presets remain offset-only; field cursor
                            order passes verified unique, extractable-order cases. Unsupported local
                            actions preserve both requested state and paging mode.
                        </p>
                    </RoadmapPhase>
                    <RoadmapPhase
                        id="phase-5-add-guarded-infinite-loading"
                        title="Phase 5. Add guarded infinite loading">
                        <ol class="list-none space-y-[0.75rem]">
                            <li>
                                <RoadmapItem
                                    id="todo-5-1"
                                    title="TODO 5.1. Define infinite-loading boundaries">
                                    <p>
                                        After request-generation safety and the chosen pagination
                                        variant pass their gates, define append boundaries, row
                                        identity, refresh reset, and URL window restoration.
                                        Infinite loading must respect that variant's actual
                                        navigation capabilities.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-5-2"
                                    title="TODO 5.2. Serialize append and recovery">
                                    <p>
                                        Implement one serialized append through request completion
                                        and Vue rendering. Ignore stale generations and handle
                                        disposal, changed criteria, failure, and explicit retry
                                        before attaching observers.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-5-3"
                                    title="TODO 5.3. Add vertical observation">
                                    <p>
                                        Add the opt-in Y observer with an explicit scroll root and a
                                        bounded automatic-fill policy. Repeated callbacks at the
                                        same boundary must request one page.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-5-4"
                                    title="TODO 5.4. Add horizontal observation">
                                    <p>
                                        Add the opt-in X observer using the verified append
                                        lifecycle. Test a real horizontal scroll root and overflow
                                        instead of assuming that the Y geometry applies.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-5-5"
                                    title="TODO 5.5. Verify refresh and URL window restoration">
                                    <p>
                                        Connect the documented refresh reset and URL window
                                        restoration. Verify both axes, changed criteria, failures,
                                        and retries in the browser without silently deduplicating
                                        joined rows.
                                    </p>
                                </RoadmapItem>
                            </li>
                        </ol>
                        <p>
                            Exit when repeated intersection callbacks produce one append per
                            boundary, failures do not create retry loops, joined rows are not
                            silently deduplicated, and browser tests verify real scroll roots and
                            rendered records in both axes.
                        </p>
                    </RoadmapPhase>
                    <RoadmapPhase
                        id="phase-6-add-source-specific-comparison-capabilities"
                        title="Phase 6. Add source-specific comparison capabilities">
                        <ol class="list-none space-y-[0.75rem]">
                            <li>
                                <RoadmapItem
                                    id="todo-6-1"
                                    title="TODO 6.1. Define Collection comparison modes">
                                    <p>
                                        After shared declaration validation and literal comparison
                                        behavior are stable, specify Collection comparison modes and
                                        locale behavior with accented and numeric text. Keep
                                        sortTypes distinct from search matchTypes and fixed global
                                        target rules. Test each mode in the bound Collection
                                        driver's profile.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-6-2"
                                    title="TODO 6.2. Define optional full-text capabilities">
                                    <p>
                                        For each optional database full-text capability, define
                                        required server versions and extensions, index setup, input
                                        handling, ranking, and its supported pagination contract
                                        before implementation. Probe the execution connection and
                                        distinguish an absent feature from a failed catalog read.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-6-3"
                                    title="TODO 6.3. Evaluate bounded regex support">
                                    <p>
                                        Evaluate regex separately with declared operators, bounded
                                        input and execution, and explicit engine requirements.
                                        Reject unsupported operations without loading SQL results
                                        into memory. Test a supported filter followed by an
                                        unsupported regex.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-6-4"
                                    title="TODO 6.4. Publish verified comparison capabilities">
                                    <p>
                                        Publish the tested capability matrix and expose only
                                        verified controls. Record source-specific semantics and
                                        failure examples, without claiming equivalent behavior
                                        across different comparison engines. Verify that stale
                                        client metadata cannot enable a disallowed operation or
                                        combination.
                                    </p>
                                </RoadmapItem>
                            </li>
                        </ol>
                        <p>
                            Exit when unsupported operations fail without loading SQL results into
                            memory, cross-source differences are documented, and available frontend
                            controls match the engine's verified capabilities. Finite values,
                            nullable projections, and field-specific matchType and sortType
                            narrowing pass typed consumer examples separately from post-Resource row
                            shapes.
                        </p>
                    </RoadmapPhase>
                    <RoadmapPhase
                        id="phase-7-explore-advanced-retrieval-and-snapshots"
                        title="Phase 7. Explore advanced retrieval and snapshots">
                        <ol class="list-none space-y-[0.75rem]">
                            <li>
                                <RoadmapItem
                                    id="todo-7-1"
                                    title="TODO 7.1. Define independent research questions">
                                    <p>
                                        After the source, ordering, and pagination contracts are
                                        verified, define separate research questions for vector
                                        retrieval and snapshot consistency. Neither experiment
                                        blocks the earlier phases or requires the other.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-7-2"
                                    title="TODO 7.2. Evaluate PostgreSQL vector retrieval">
                                    <p>
                                        Evaluate PostgreSQL vector retrieval using finite prepared
                                        vectors on a declared column with known dimensions and
                                        metric. Test ranking, paging, authorization, missing
                                        pgvector, and a configured MySQL driver without a vector
                                        implementation. Only an implemented driver with a passing
                                        profile may advertise it.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-7-3"
                                    title="TODO 7.3. Compare high-water limits and snapshots">
                                    <p>
                                        Compare high-water limits with a persisted snapshot design
                                        under insertion, update, and deletion. Measure the storage,
                                        expiration, authorization, and recovery requirements of any
                                        proposed snapshot contract.
                                    </p>
                                </RoadmapItem>
                            </li>
                            <li>
                                <RoadmapItem
                                    id="todo-7-4"
                                    title="TODO 7.4. Record evidence and select capabilities">
                                    <p>
                                        Record the evidence and adopt only capabilities whose
                                        correctness, cost, and operational requirements have been
                                        demonstrated. Update this proposal before scheduling a new
                                        implementation phase, or record why the experiment is
                                        deferred.
                                    </p>
                                </RoadmapItem>
                            </li>
                        </ol>
                        <p>
                            Exit when an experiment either supports a concrete feature contract or
                            records a reason to defer it. No vector or snapshot claim is required to
                            release the earlier phases.
                        </p>
                    </RoadmapPhase>
                </div>
                <h3
                    id="completion-rules-for-every-implementation-phase"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Completion rules for every implementation phase
                </h3>
                <p>
                    The ordered TODOs follow prerequisites, not estimated dates. Each delivered
                    backend capability includes a functional Vue example, so a verified vertical
                    slice can advance dependent frontend tasks while other driver and query gates
                    remain open. Completed and WIP statuses identify the current slice. Each phase
                    ends in a verifiable change and can run in a separate interaction.
                </p>
                <p>
                    Each phase starts collapsed. Open a phase to read its task cards and their
                    acceptance details. Completion is authored in this documentation and tracks only
                    this roadmap, independently of package stability or overall progress. Opening an
                    item does not change its status. This temporary preview roadmap can be removed
                    after a future stable release.
                </p>
                <p>
                    Mark an item Completed only after its acceptance evidence and corresponding
                    tests, canonical documentation, consumer skill, and changelog have been
                    verified. Later phases state their dependencies. Optional capabilities do not
                    block one another merely because their phase numbers differ. Do not implement a
                    later capability merely because its extension point is mentioned here.
                </p>
                <p>
                    Implementation, automated behavior tests, consumer skill, changelog, canonical
                    guides, formatting, and static analysis form one change. Keep the README
                    concise. Publish examples only after executing their public APIs. Check matching
                    and unrelated Boost requests when consumer guidance changes, plus Composer
                    archive inclusion and discovery in a consumer.
                </p>
                <p>
                    Run the focused checks during development, then the complete owning package
                    validation suite and affected documentation checks. Use the shared integration
                    application to complement package-owned tests. Drive real browser behavior when
                    URL, request races, focus, or scrolling changes. Record unavailable databases or
                    services as blockers, not passes.
                </p>
            </ProseSection>

            <ProseSection id="current-baseline" title="Current baseline">
                <p>
                    The <code>1.0.0-alpha.1</code> source preview contains PHP package identity, a
                    service provider and facade, a frontend <code>version</code> export, strict
                    TypeScript tooling, and distribution checks. Its current local checkout adds
                    Collection and ordinary SQLite DataSources, offset paging, paging and access
                    options and attributes, guard and Gate checks, and the headless Vue DataAdapter.
                    Filtering, search, selectable sorting, other drivers, and advanced integrations
                    remain planned.
                </p>
                <p>
                    The package declares PHP <code>^8.5</code>, Illuminate Support
                    <code>^13.0</code>, and Inertia Laravel <code>^3.0</code>. Its development
                    frontend uses Vue <code>^3.5.13</code>, Inertia Vue <code>^3.0.0</code>, and
                    TypeScript <code>^5.8.3</code>. These declarations are distinct from installed
                    versions and future feature support. Inertia Laravel supplies the Laravel
                    framework components used by the initial pipeline. Runtime frontend peers now
                    declare Vue, Inertia Vue and Core, and Ziggy. Ordinary SQLite is the only SQL
                    driver supported by this slice.
                </p>
                <p>
                    The functional listing guide is the reference for the delivered public API. This
                    roadmap retains the remaining architecture proposals and their acceptance gates.
                    The local checkout is not a stable or newly published package release.
                </p>
            </ProseSection>

            <ProseSection
                id="planning-evidence-and-maintenance-notes"
                title="Planning evidence and maintenance notes">
                <p>
                    The initial planning journey was inspected before authoring. It started in an
                    existing Laravel 13 and Inertia 3 application with a sibling Dapter checkout on
                    <code>1.x</code>. The Installation page connects Composer's path repository
                    before installing the frontend from <code>vendor/artisan-toolbox/dapter</code>.
                    Its first backend and frontend examples report <code>1.0.0-alpha.1</code>. The
                    next guides are this proposed roadmap and Development. No adapter setup,
                    authentication, queue, worker, or broadcaster is required for those existing
                    identity checks.
                </p>
                <p>
                    The first implementation updates the consumer skill, README, changelogs, and
                    learning journey together. Installation now leads to the functional listing
                    guide before this roadmap and Development. Its self-contained quickstart and
                    every delivered setting execute through the installed package. The demo coverage
                    gate discovers options, attributes, config keys, command options, and frontend
                    props, then runs backend and frontend behavior checks.
                </p>
                <p>
                    The historical planning inspection observed PHP 8.5.12, Node.js 26.13.1,
                    Composer 2.11.1, Laravel 13.42.0, Inertia Laravel 3.7.0, Inertia Vue 3.11.0, Vue
                    3.5.45, Pest 5.3.5, TypeScript 5.9.3, and Vite Plus 1.6.0. Dapter was not
                    installed during that planning inspection. The current application installs its
                    local source through Composer before the vendor-file npm package. These
                    observations do not establish the latest available compatible versions.
                </p>
                <p>
                    Historical planning refresh attempts ran in the documentation application,
                    Composer before npm. Both were dry runs and did not install the implementation.
                    Composer targeted installed <code>artisan-toolbox/*</code>, Laravel, Inertia
                    Laravel, and Pest using
                    <code
                        >--with-all-dependencies --dry-run --no-install --no-scripts
                        --no-plugins</code
                    >. It failed with DNS resolution error 6 for Packagist.
                    <code>npm update --dry-run --ignore-scripts --no-audit --no-fund</code> failed
                    with ERESOLVE while resolving Inertia Vue and local package peers. No forced
                    resolution, compatibility relaxation, vendor refresh, or lockfile change was
                    made during that planning pass. Those results do not describe the subsequent
                    local implementation installation.
                </p>
                <p>
                    The implementation pass subsequently installed Dapter through a local Composer
                    path repository as <code>1.x-dev</code>, then installed and refreshed its
                    frontend package. This is an unpublished local preview. Registry access remained
                    unavailable, so the compatible registry refresh could not establish newer
                    available versions. Cached dependencies and the local package enabled validation
                    without relaxing compatibility. The current Composer lock contains local path
                    metadata and is not portable to a clean standalone consumer. A successful local
                    installation is not evidence of a public release or a passing standalone
                    distribution check.
                </p>
                <p>
                    The normal Composer launcher initially selected a broken Homebrew PHP 8.4 binary
                    in the documentation directory. Re-running Composer with the existing Herd PHP
                    8.5 executable reached the resolver. No system PHP installation was modified.
                </p>
                <p>
                    Planning validation executed both existing identity examples and observed
                    <code>1.0.0-alpha.1</code>. The existing Dapter documentation feature tests
                    passed with 2 tests and 35 assertions. Dapter's frontend checks and strict types
                    passed, and both frontend test files passed with 2 tests and no type errors.
                    PHPStan passed. The normal <code>composer test</code> command stopped when
                    parallel Pint could not open a local TCP socket in the sandbox. Running the same
                    formatting check without parallel workers passed, then PHP type coverage passed
                    at 100% and all 10 Pest tests passed with 23 assertions. This is not a claim
                    that the original aggregate command passed.
                </p>
                <p>
                    The canonical Vue page uses shared documentation sections and tables. Route,
                    navigation, rendered content, and search extraction tests protect the proposal
                    and its links. Browser review verifies the roadmap's presentation and search
                    destinations. It does not establish database feature conformance, a new adapter
                    installation, or execution of any future API. A roadmap review does not prove
                    the behavior of any unimplemented phase.
                </p>
                <p>
                    Phase 0 records fixtures for the raw JSON boundary, safe numeric tokens,
                    access-denial cleanup, and the driver's complete scoped predicate. The endpoint
                    and Vue phases must prove explicit clears, cold URL restoration, clamped pages,
                    decoder failures, and initial slot readiness in a consuming application. Phase 3
                    must test trusted callbacks against scoped fixtures. Phase 3a must prove nested
                    recipient serialization and guard isolation for replacement-only broadcasts.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
