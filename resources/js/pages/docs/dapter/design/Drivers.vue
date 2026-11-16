<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const driverContract = `namespace ArtisanToolbox\\Dapter\\Contracts;

use ArtisanToolbox\\Dapter\\Drivers\\DriverCapabilities;
use ArtisanToolbox\\Dapter\\Drivers\\RawPage;
use ArtisanToolbox\\Dapter\\Drivers\\ValidatedReadPlan;

interface StoreDriver
{
    public function capabilities(): DriverCapabilities;

    public function execute(ValidatedReadPlan $plan): RawPage;
}`;

const resourceDeclaration = `use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

final class ProductResource extends JsonResource
{
    /** @return array{name: string} */
    public function toArray(Request $request): array
    {
        return ['name' => $this->resource['name']];
    }
}

// Proposed options() body for the Products fixture above.
return StoreOptions::make()->useResource(ProductResource::class);`;
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
                id="store-drivers-and-capabilities"
                title="Store drivers and capabilities">
                <p>
                    The local preview implements the <code>StoreDriver</code> interface and the
                    <code>DriverCapabilities</code>, <code>ValidatedReadPlan</code>, and
                    <code>RawPage</code> types shown below for offset reads. Its factory selects
                    <code>CollectionStoreDriver</code> or <code>EloquentStoreDriver</code>, with
                    ordinary SQLite as the only supported SQL connection. Managed field search,
                    filters, selectable ordering, custom driver registration, and broader capability
                    profiles remain future work.
                </p>
                <p>
                    The implemented offset path binds one actual driver after access and request
                    validation. Eloquent prepares a private scoped builder once and derives support
                    from that exact connection and query shape. Internal
                    <code>NegotiatedRead</code> pairs the options and paging plan with that driver
                    for immediate execution. The public <code>ValidatedReadPlan</code> itself
                    carries no source, principal, connection, or intrinsic execution authority.
                    Trusted direct driver calls are not an authentication boundary. The negotiated
                    definition supplies response capabilities. An incompatible required offset
                    source fails configuration before Dapter executes count or row SQL. Repeated
                    capability access does not replay scopes. See
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/authority').href"
                        >Understand server authority</DocsLink
                    >
                    for the current contract and executable request boundary.
                </p>
                <CodeExample
                    language="php"
                    label="Current StoreDriver interface"
                    :code="driverContract" />
                <p>
                    Driver constructors accept an Eloquent <code>Builder</code> or a normalized
                    <code>Collection</code> according to their source family. Keeping the source out
                    of <code>execute()</code> lets each constructor require its native type. The
                    future resolver selects a SQL driver using the builder's actual connection and
                    dialect. The remaining driver rules in this section are proposals. They are not
                    registration or capability APIs in the current preview. The proposed extension
                    allows applications to register a custom driver in trusted server configuration
                    under a validated identifier. Selection precedence is an exact configured
                    connection plus source family, then verified dialect plus family, then family
                    fallback. Reject duplicate registrations at each specificity. A selected driver
                    that refuses the bound source fails without falling back to a weaker driver. A
                    source-only adapter needs no driver declaration. The browser supplies neither a
                    driver selector nor a class name.
                </p>
                <DocsTable caption="Proposed built-in store drivers">
                    <thead>
                        <tr>
                            <th scope="col">Driver</th>
                            <th scope="col">Execution on its native source</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>CollectionStoreDriver</code></td>
                            <td>
                                Compare typed record values in memory. Preserve input order for
                                ordinary offset pages.
                            </td>
                        </tr>
                        <tr>
                            <td><code>SqliteStoreDriver</code></td>
                            <td>
                                Compile supported comparisons against the SQLite connection,
                                including its type and collation rules.
                            </td>
                        </tr>
                        <tr>
                            <td><code>MySqlStoreDriver</code></td>
                            <td>
                                Use the MySQL dialect and check support for optional operations on
                                the configured server.
                            </td>
                        </tr>
                        <tr>
                            <td><code>PostgresStoreDriver</code></td>
                            <td>
                                Use the PostgreSQL dialect and verify any required extension in the
                                selected database.
                            </td>
                        </tr>
                    </tbody>
                </DocsTable>
                <p>
                    The three SQL drivers share an Eloquent pipeline for scoped predicates, builder
                    cloning, counts, and paging. Each compiles supported comparisons and ordering
                    through Laravel's query APIs and grammar. An unsupported SQL operation must
                    never load the result into a Collection as a fallback.
                </p>
                <p>
                    <code>DriverCapabilities</code> describes technical support for the bound
                    source, driver implementation, server version, extensions, and query shape. It
                    describes valid combinations. A ranking operation and a paging mode can each be
                    available while their combination is unsupported. One evaluator combines those
                    rules with source policy, authorized fields, and reader permissions to produce
                    effective capabilities. It uses those same rules to validate the entire request,
                    including requests from a browser with stale metadata.
                </p>
                <ol class="list-decimal space-y-3 pl-5">
                    <li>
                        Parse the original JSON body and normalize trusted declarations. Authorize
                        the reader before validating source-specific intent or calling
                        <code>source()</code>. Reject combinations already ruled out by the declared
                        source family before resolving its data. Authentication or the Gate may
                        query the database.
                    </li>
                    <li>
                        Bind the actual source and check its execution connection, including the
                        read route. For Eloquent, apply global scopes once to a private snapshot and
                        check its effective predicates, windows, and supported shape before issuing
                        the capability profile or plan. Use that same scoped snapshot for later
                        count and page clones without replaying scopes. An application returning a
                        Collection from <code>source()</code> may already have read its records.
                        After authorization, a driver may read catalog metadata to check a version
                        or extension. Keep those checks read-only and specific to that connection
                        and tenant. Withhold unverified optional operations.
                    </li>
                    <li>
                        Issue a <code>ValidatedReadPlan</code> only for the complete allowed
                        request. A future internal accepted execution closes over this source
                        evaluation, selected reader and guard, explicit global or scoped audience,
                        projection, driver instance and profile, native snapshot, and verified
                        route. Its execute method accepts no replacement source, context, or driver.
                        The public plan constructor remains unchanged. If the last clause fails, the
                        driver performs zero listing reads or managed transforms and the coordinator
                        constructs and invokes zero operation handlers. The client cannot issue a
                        plan.
                    </li>
                    <li>
                        Execute the plan on its bound, eligible source. After application handlers
                        run, check the resulting family, model, connection, mandatory scope,
                        projection context, route, and effective query shape before the count or
                        page read. Apply managed restrictions to the complete authorized predicate,
                        including existing OR groups and their bindings. Preserve supported WHERE
                        and HAVING semantics or reject the effective shape. Reject an ineligible
                        query or changed route without dropping clauses. Return a
                        <code>RawPage</code> with a bounded, ordered list of raw rows and
                        mode-specific paging information. Reindex the final outer Collection page,
                        including an empty page, and keep any per-row identities aligned.
                    </li>
                </ol>
                <p>
                    A future route commitment covers the verified semantic database, schema, tenant,
                    and read-role route set. A native verifier may accept reconnect or failover only
                    inside that same set. Without such a verifier, exact effective PDO identity is
                    the conservative fallback. Current reads promise no socket pinning, transaction
                    isolation, or database snapshot. Arbitrary callbacks remain trusted application
                    code. A token or fingerprint cannot prove tenant-safe semantics. Later native
                    integration must preserve mandatory predicates independently and prove actual
                    route and handler behavior before claiming this stronger boundary.
                </p>
                <p>
                    A private identity, when needed, comes from the raw row. Keep its SQL selector
                    separate from its hydrated key. An ordinal breaks Collection ties within one
                    evaluation. Ordinary offset paging needs no cross-request identity. Resource
                    projection, HTTP serialization, error mapping, Echo delivery, and Vue state
                    belong outside the driver.
                </p>
                <p>
                    An otherwise declared, authorized optional operation or combination outside the
                    bound driver's verified support raises
                    <code>UnsupportedStoreOperation</code>. HTTP maps it to a sanitized 422
                    unsupported-operation error. An undeclared field still receives a validation
                    error. Authorization and undeclared choices retain their own errors. An
                    unsupported required default, an unregistered driver, or a plan bound to the
                    wrong connection is a configuration fault (500). Catalog permission errors,
                    outages, and unexpected SQL errors retain their server or infrastructure
                    classification. If support disappears during execution, fail the request without
                    a partial page. Keep SQL, class names, and extension details out of the
                    response.
                </p>
            </ProseSection>
            <ProseSection
                id="source-resolution-and-automatic-behavior"
                title="Source resolution and automatic behavior">
                <p>
                    The current convention maps <code>Products</code> beneath the application's
                    actual namespace plus <code>DataSources</code>, commonly
                    <code>App\DataSources\Products</code>. <code>Catalog.Products</code> maps to a
                    nested class. It accepts dotted ASCII PHP name segments with reserved-word
                    rejection. It rejects traversal, arbitrary fully qualified names, and unrelated
                    classes. Each read uses <code>Container::build</code> for a fresh source and
                    calls <code>source()</code> once. Shared dependencies keep their Laravel
                    lifetimes. Constructors and options run before access and must not read
                    protected records. Authentication and the selected Gate precede
                    <code>source()</code>.
                </p>
                <p>
                    A trusted alias registry remains proposed. No alias or configurable source
                    namespace exists today. Future aliases use the same identifier grammar. Exact
                    alias lookup precedes convention resolution. Duplicate aliases and case-fold
                    collisions fail registration. Existing PHP convention casing remains unchanged.
                    Aliases targeting the same class still reauthorize that source's policy and
                    retain distinct logical context identities. Retargeting an alias or changing its
                    definition generation invalidates old contexts. The browser supplies no class,
                    connection, or driver selector. See
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/design/source-boundaries').href
                        "
                        >source and record boundaries</DocsLink
                    >
                    for the separate identity domains.
                </p>
                <p>
                    Use one package-owned named route, proposed as <code>dapter.data</code>, with a
                    source identifier parameter. Ziggy resolves that named route in the Inertia
                    integration. Do not add a parallel route registry or accept client-provided
                    endpoints through source names. The proposed endpoint accepts POST requests with
                    a JSON body. Keep the session and CSRF middleware. Read the original body once
                    with an object-preserving decoder. A malformed document returns 400. A valid
                    JSON list, null, or other invalid envelope shape returns 422. Preserve literal
                    strings, including padding and empty strings, before checking each operation.
                    Laravel's middleware-normalized input bag cannot preserve those distinctions.
                    Check protocol syntax before source lookup and return source-specific validation
                    details only after authorization. The page URL stores editable state separately.
                </p>
                <p>Useful automatic behavior has clear limits:</p>
                <ul>
                    <li>
                        Infer an ordinary Eloquent model's qualified primary key for default order
                        and row identity. A joined or grouped result can override both.
                    </li>
                    <li>
                        Infer the Collection engine from its declared source contract and normalize
                        arrays once. Preserve source order unless a declared sort is selected.
                    </li>
                    <li>
                        Produce labels from declared public field identifiers unless the source
                        supplies labels or translation keys. Labels never determine database
                        columns.
                    </li>
                    <li>
                        Publish only the capabilities that the current source, engine, pagination
                        mode, and reader can use together.
                    </li>
                    <li>
                        Reset pagination after search, filters, sorting, or page size changes. Reuse
                        the same canonical state normalizer for HTTP, URL, and response state.
                    </li>
                    <li>
                        Use a unique SQL tie-breaker or the evaluation-local Collection ordinal for
                        ordinary offset rows. Keep this distinct from the user's selected sort list.
                    </li>
                </ul>
                <p>
                    Do not automatically expose every database column, relationship, model method,
                    or serialized property as searchable or sortable. Do not guess joins, database
                    expressions, access policies, or a durable identity for duplicate result rows.
                </p>
                <h3
                    id="resource-serialization"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Optional Resource serialization
                </h3>
                <p>
                    Proposed <code>useResource(resourceClass)</code> accepts a validated
                    <code>class-string&lt;JsonResource&gt;</code>. No resource is configured by
                    default, and there is no automatic discovery. The default path uses normal safe
                    model serialization with hidden and visible fields, or JSON-safe array records.
                    Never expose raw model attributes to bypass visibility rules.
                </p>
                <p>
                    Apply filtering, sorting, and paging to raw rows before serialization. Use
                    <code>JsonResource::resolve($request)</code> with the selected reader or queued
                    recipient. Recursively materialize nested Resources and ResourceCollections with
                    that same explicit request before final JSON encoding. Reject unsupported
                    deferred objects. A nested Resource left to ambient serialization can project
                    the operator's private fields. Keep the worker's ambient request untouched. Do
                    not invoke its full HTTP response per row or mutate global Resource wrapping.
                    The response envelope and pagination metadata remain Dapter-owned. Laravel's
                    <DocsLink href="https://laravel.com/framework/docs/13.x/eloquent-resources"
                        >API Resource documentation</DocsLink
                    >
                    describes the framework's transformation layer. This Dapter integration is
                    proposed and unavailable.
                </p>
                <p>
                    This proposed Resource uses the defined Products array fixture and deliberately
                    omits id. The intended row data is <code>{ name: 'Notebook' }</code> for row 1.
                    Selecting this fresh options body replaces the earlier method's explicit fluent
                    layer, so that method's search, filters, size overrides, and broadcasting are
                    not carried forward. Inherited and concrete attributes still participate;
                    uncalled factory defaults do not erase them. Add <code>useResource()</code> to
                    the existing chain or use <code>parent::options()</code> to retain its
                    declarations.
                </p>
                <CodeExample
                    language="php"
                    label="Proposed optional Resource projection, not current package usage"
                    :code="resourceDeclaration" />
                <p>
                    The planned version-2 response keeps the top-level <code>data</code> array. It
                    always carries separate <code>metadata.records</code> and
                    <code>metadata.channel</code>. Unidentified mode has a null channel. Identified
                    and revisioned modes carry dense identity rows aligned with data and may also
                    have a null channel, such as cursor reads without Echo. Preserve the declared
                    mode on empty pages. A feature needing identity extracts it before the optional
                    Resource and exposes a safe value through that metadata. Ordinary Collection
                    offset pages may omit row identities. Omitting or renaming id in row data must
                    not break matching. This identity metadata is part of the public wire contract
                    and must never leak a sensitive identifier. When identity is required, reject
                    missing, duplicate, or unsafe identities before atomic acceptance. Integer
                    <code>1</code> and string <code>'1'</code> are distinct. Preserve typed keys
                    without PHP key coercion, stringification, or position-derived identities.
                    Select or privately alias the SQL key and read its hydrated attribute. A
                    qualified SQL identifier alone cannot extract it from a model. Frontend generic
                    <code>T</code> describes the post-Resource data shape, including renamed or
                    omitted fields, rather than the source model.
                </p>
                <p>
                    HTTP and broadcast events share the raw-row-to-Resource pipeline and equivalent
                    authorized audience context. Exact same row data means the same schema and
                    resource projection for current values, not old bytes, counts, or page metadata.
                    Reader-aware Resources require per-reader delivery or an equivalent projection
                    audience. Never serialize one reader's request and send its private projection
                    to a broader channel.
                </p>
            </ProseSection>
            <ProseSection id="capability-rollout" title="Capability rollout">
                <p>
                    The portable baseline means the same declared operations and error contract, not
                    identical database collation or query plans.
                </p>
                <DocsTable caption="Proposed capability rollout">
                    <thead>
                        <tr>
                            <th scope="col">Capability</th>
                            <th scope="col">MVP</th>
                            <th scope="col">Later delivery</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Eloquent source on SQLite, MySQL, and PostgreSQL</td>
                            <td>
                                Ordinary model queries, qualified fields, exact numbered pagination
                            </td>
                            <td>
                                Tested joins, aggregates, custom count strategies, advanced query
                                handlers
                            </td>
                        </tr>
                        <tr>
                            <td>Array and Collection source</td>
                            <td>Array normalization, records, exact numbered pagination</td>
                            <td>
                                Comparator modes, locale comparison, durable-identity cursor support
                            </td>
                        </tr>
                        <tr>
                            <td>Field sort and literal search</td>
                            <td>Explicit declarations, native order, basic string operators</td>
                            <td>Multi-sort, composed search, labeled presets, custom operators</td>
                        </tr>
                        <tr>
                            <td>Selectable filters</td>
                            <td>Declared scalar options and exact membership</td>
                            <td>Multi-value options and scoped option providers</td>
                        </tr>
                        <tr>
                            <td>Configuration</td>
                            <td>
                                Internal options resolution, optional WithOptions, and basic
                                attributes
                            </td>
                            <td>Advanced attribute, handler, inheritance, and removal parity</td>
                        </tr>
                        <tr>
                            <td>Vue integration</td>
                            <td>
                                Headless typed slot, async load, errors, instance isolation, URL,
                                scroll rules
                            </td>
                            <td>Infinite X or Y, additional integration transports if justified</td>
                        </tr>
                        <tr>
                            <td>Pagination</td>
                            <td>Offset with exact counts</td>
                            <td>
                                Simple, cursor, optional counts, separately researched snapshot
                                behavior
                            </td>
                        </tr>
                        <tr>
                            <td>Database-specific search</td>
                            <td>No mandatory extension</td>
                            <td>Opt-in full-text, bounded regex, PostgreSQL vector exploration</td>
                        </tr>
                    </tbody>
                </DocsTable>
                <p>
                    MVP completion includes conformance tests on all three target databases.
                    SQLite-only evidence does not establish MySQL or PostgreSQL support. Pin the
                    actual supported server versions and required extensions in CI before making
                    that compatibility claim.
                </p>
                <p>
                    Vector search remains phase 7 research. A PostgreSQL source could advertise a
                    distance operation only after Dapter implements it for a compatible Laravel and
                    server version, verifies pgvector in the selected database, and confirms a
                    compatible declared column with supported dimensions, metrics, ranking, and
                    paging modes. Availability does not require a submitted vector. At request
                    validation, check the actual prepared vector for finite numeric values and the
                    declared dimension, then validate the selected metric and complete ranking and
                    paging combination before execution. Test exact ranking separately from any
                    approximate index strategy. A driver must never install extensions or generate
                    embeddings as a side effect of a read. Laravel's vector helpers can generate
                    embeddings when given text. See
                    <DocsLink href="https://github.com/pgvector/pgvector#querying"
                        >pgvector querying</DocsLink
                    >
                    and
                    <DocsLink
                        href="https://laravel.com/framework/docs/13.x/queries#vector-similarity-clauses"
                        >Laravel vector similarity clauses</DocsLink
                    >.
                </p>
                <p>
                    For the same declared request, a PostgreSQL profile missing pgvector or a
                    configured MySQL driver without verified vector support raises
                    <code>UnsupportedStoreOperation</code> before a driver listing read. MySQL
                    variants differ. For example, MySQL 9.7 documents <code>DISTANCE()</code> for
                    HeatWave on OCI and MySQL AI. Availability in a database product alone does not
                    enable a Dapter operation. See
                    <DocsLink href="https://dev.mysql.com/doc/refman/9.7/en/vector-functions.html"
                        >MySQL vector functions</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
