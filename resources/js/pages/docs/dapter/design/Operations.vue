<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const invokableHandlers = `use ArtisanToolbox\\Dapter\\Attributes\\GlobalFilter;
use ArtisanToolbox\\Dapter\\Attributes\\GlobalOrder;
use ArtisanToolbox\\Dapter\\CollectionDataSource;
use ArtisanToolbox\\Dapter\\StoreOptions;
use Illuminate\\Support\\Collection;

final class OnlyNews
{
    /**
     * @param Collection<int, array{id: int, name: string, status: string, price: int, user_id: int, news: bool}> $source
     * @return Collection<int, array{id: int, name: string, status: string, price: int, user_id: int, news: bool}>
     */
    public function __invoke(Collection $source, bool $value): Collection
    {
        return $source->whereStrict('news', $value);
    }
}

final class ByPrice
{
    /**
     * @param Collection<int, array{id: int, name: string, status: string, price: int, user_id: int, news: bool}> $source
     * @return Collection<int, array{id: int, name: string, status: string, price: int, user_id: int, news: bool}>
     */
    public function __invoke(Collection $source): Collection
    {
        return $source->sortBy([['price', 'asc'], ['id', 'asc']]);
    }
}

$fluentOptions = StoreOptions::make()
    ->globalFilterable('only_news', values: [false, true], apply: OnlyNews::class)
    ->globalOrderable('by_price', label: 'Lowest price', apply: ByPrice::class);

#[GlobalFilter('only_news', values: [false, true], apply: OnlyNews::class)]
#[GlobalOrder('by_price', label: 'Lowest price', apply: ByPrice::class)]
final class PresetProducts extends CollectionDataSource
{
    /** @return Collection<int, array{id: int, name: string, status: string, price: int, user_id: int, news: bool}> */
    public function source(): Collection
    {
        return collect([
            ['id' => 1, 'name' => 'Notebook', 'status' => 'active', 'price' => 20, 'user_id' => 7, 'news' => true],
            ['id' => 2, 'name' => 'Pencil', 'status' => 'pending', 'price' => 5, 'user_id' => 9, 'news' => false],
        ]);
    }
}`;

const authorizationDeclaration = `use Illuminate\\Contracts\\Auth\\Authenticatable;
use Illuminate\\Support\\Facades\\Gate;

// Products is the DataSource fixture above. This policy permits user identifier 7.
final class ProductsPolicy
{
    public function viewAny(Authenticatable $user): bool
    {
        return $user->getAuthIdentifier() === 7;
    }
}

// Register in the application's service provider boot() method.
Gate::policy(Products::class, ProductsPolicy::class);

// Proposed Products::options() body, unavailable in the current package.
return StoreOptions::make()
    ->guard('admin')
    ->authorize('viewAny', Products::class);`;

const filterCallbacks = `use ArtisanToolbox\\Dapter\\StoreOptions;
use Illuminate\\Database\\Eloquent\\Builder;
use Illuminate\\Support\\Collection;

enum Status: string
{
    case Active = 'active';
    case Pending = 'pending';
    case Archived = 'archived';
}

$sqlOptions = StoreOptions::make()->globalFilterable(
    id: 'status',
    values: [Status::Active, Status::Pending],
    multiple: false,
    apply: static function (Builder $source, Status $value): Builder {
        return $source->where('status', $value->value);
    },
);

$collectionOptions = StoreOptions::make()->globalFilterable(
    id: 'status',
    values: [Status::Active, Status::Pending],
    multiple: false,
    apply: static function (Collection $source, mixed $value): Collection {
        return $source->whereStrict('status', $value);
    },
);

$records = collect([
    ['id' => 1, 'status' => 'active'],
    ['id' => 2, 'status' => 'pending'],
]);`;

const filterAttribute = `use ArtisanToolbox\\Dapter\\Attributes\\GlobalFilter;
use Illuminate\\Support\\Collection;

#[GlobalFilter(
    id: 'status',
    values: [Status::Active, Status::Pending],
    multiple: false,
    apply: static function (Collection $source, Status $value): Collection {
        return $source->whereStrict('status', $value->value);
    },
)]`;

const methodHandlers = `use ArtisanToolbox\\Dapter\\Attributes\\GlobalFilter;
use ArtisanToolbox\\Dapter\\Attributes\\GlobalOrder;
use ArtisanToolbox\\Dapter\\EloquentDataSource;
use ArtisanToolbox\\Dapter\\Enums\\ValueType;
use Illuminate\\Database\\Eloquent\\Builder;

abstract class ProductHandlers extends EloquentDataSource
{
    #[GlobalFilter('active', values: [true, false], valueType: ValueType::Boolean)]
    private function activeItems(Builder $source, bool $value): Builder
    {
        return $source->where('active', $value);
    }

    #[GlobalOrder]
    private function lowestPrice(Builder $source): Builder
    {
        return $source->orderBy('price');
    }
}`;
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
            <ProseSection id="six-operation-contract-cases" title="Six planned operation cases">
                <p>
                    These are authored protocol 2 examples, unavailable until the owning operation
                    phases ship. Each case starts independently from the authorized Products input
                    in the checked operation reference on the paging and state page, with all rows,
                    no selections, source order by id ascending, offset page 1, and size 25. Rows
                    are (id, name, price, user_id, is_news): (1, Notebook, 30, 7, true), (2, Pencil,
                    5, 9, false), (3, Notebook sleeve, 20, 11, false), and (4, Notebook, 10, 9,
                    true). Mandatory scope has already selected these four rows. Expected IDs below
                    describe those inputs; no future driver or handler ran. All criteria and page
                    size outside the addressed operation stay unchanged.
                </p>
                <DocsTable caption="Planned inputs, accepted selections, rows, and failures">
                    <thead>
                        <tr>
                            <th>Operation and declaration</th>
                            <th>Input and accepted current</th>
                            <th>Expected row IDs and failure</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                Field filter. user_id.new_sales declares values [7, 9], multiple
                                true, and empty clear. Automatic typed membership has no callback.
                            </td>
                            <td>
                                call({ value: [7, 9] }) accepts { value: [7, 9] } in
                                fields.user_id.filters.new_sales.
                            </td>
                            <td>
                                [1, 2, 4]. Value [11] fails HTTP 422 before listing reads. Empty []
                                clears this declared filter.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Field search. name declares string contains and equals. Matching is
                                automatic and literal.
                            </td>
                            <td>
                                call({ value: 'Notebook', matchType: 'contains' }) accepts that same
                                search under fields.name.
                            </td>
                            <td>
                                [1, 3, 4]. An undeclared matchType fails HTTP 422. Numeric search on
                                a separately declared numeric field rejects 'Notebook'.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Field order. price declares numeric ascending and descending.
                                Ordering is automatic, with id ascending as the unique tie-breaker.
                            </td>
                            <td>
                                call({ direction: 'asc', sortType: 'numeric' }) accepts one price
                                term and current { direction: 'asc', sortType: 'numeric', priority:
                                0 }.
                            </td>
                            <td>
                                [2, 4, 3, 1]. A natural price sort or undeclared direction rejects
                                atomically before listing reads.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Global filter. only_news declares [false, true]. A trusted Closure
                                or invokable keeps rows whose is_news equals the validated boolean.
                            </td>
                            <td>
                                call({ value: false }) accepts global.filters.only_news { value:
                                false }. False is selected, not cleared.
                            </td>
                            <td>
                                [2, 3]. String 'false' fails HTTP 422 with zero handler calls. The
                                scoped transform receives false exactly once after full validation.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Global search. One string input targets name as literal contains and
                                id as strict integer equals. Parsers and match types are fixed by
                                the server.
                            </td>
                            <td>
                                call({ value: 'Notebook' }) accepts global.search { value:
                                'Notebook' }. Name matches OR id matches inside this one search
                                group.
                            </td>
                            <td>
                                [1, 3, 4]. The id parser cannot parse Notebook, so that target
                                contributes false. '2' matches id 2. Client targets or matchType
                                overrides fail HTTP 422. An input incompatible with every target
                                yields no rows.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Global order. by_price is a labeled offset-only preset. A trusted
                                Closure or invokable orders price ascending then id ascending
                                without I/O.
                            </td>
                            <td>
                                call({ id: 'by_price' }) accepts current { id: 'by_price' } and
                                replaces only ordering. Effective state identifies its opaque
                                deterministic order.
                            </td>
                            <td>
                                [2, 4, 3, 1]. A direction, sortType, additive field call, or cursor
                                combination fails before handler execution. Only global filter and
                                order accept trusted transforms.
                            </td>
                        </tr>
                    </tbody>
                </DocsTable>
                <p>
                    Combining name contains Notebook with only_news false yields [3] under all
                    grouping. Under any search grouping, only the search clauses form the OR group;
                    mandatory scope and filters still combine with AND. Field/global capabilities
                    contain readonly available and current plus local call and clear. None of those
                    functions, trusted callbacks, SQL targets, or PHP class names travel on the
                    wire.
                </p>
            </ProseSection>
            <ProseSection id="scope-filters-and-search" title="Scope, filters, and search">
                <h3
                    id="mandatory-scope"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Mandatory scope
                </h3>
                <p>
                    <code>source()</code> returns the authorized base dataset with tenant
                    constraints, visibility rules, joins, eager loads, and application prefilters
                    already applied. The source-owned guard and optional Gate declaration protect
                    access to the DataStore before this method executes. Neither mechanism is
                    editable through listing state.
                </p>
                <p>
                    No search or filter may escape that base scope. Wrap OR predicates in their own
                    group. Clearing all client selections must preserve tenant and visibility
                    restrictions.
                </p>
                <h3
                    id="datastore-access-control"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    DataStore authentication and authorization
                </h3>
                <p>
                    Proposed <code>StoreOptions::guard(string $name)</code> selects the
                    authentication guard. Authentication is required by default. The default is
                    <code>web</code>, seeded by <code>access.guard</code> in package config,
                    independently of Laravel's default guard. Proposed
                    <code>authorize(string $ability, mixed $arguments = [])</code> adds a Gate
                    check. Supply a trusted class-string or already-bound object for a policy
                    target, or omit arguments for a named Gate. The application registers policies
                    through Laravel's normal discovery or <code>Gate::policy()</code>. These
                    declarations also govern the context-bound DataStore. Do not call policy methods
                    directly or create a second policy registry inside Dapter.
                </p>
                <p>
                    The fixture below assumes the application has configured an <code>admin</code>
                    guard. Its policy permits only the authenticated user whose identifier is the
                    integer 7. That user can proceed to the source; another authenticated user is
                    denied. No login under the selected guard produces JSON 401, even when
                    <code>web</code> has a logged-in user. Dapter's methods remain proposed.
                </p>
                <CodeExample
                    language="php"
                    label="Proposed guard and Laravel policy binding, not current package usage"
                    :code="authorizationDeclaration" />
                <p>
                    Resolve the user only from the selected guard, then evaluate
                    <code>Gate::forUser($selectedUser)-&gt;authorize($ability, $arguments)</code>.
                    Run this check before <code>source()</code>, protected reads, counts, public
                    capabilities, Resource transformation, or channel descriptors. Constructors and
                    option declarations must not read protected datasets before this boundary. A
                    missing user fails required authentication before Gate hooks run. Gate retains
                    Laravel's before and after hooks, policy resolution, and denial responses.
                    Preserve a deliberate policy status from 400 through 599, including 404 from
                    <code>denyAsNotFound()</code>. Normalize a non-error or invalid denial status to
                    403 so its access body survives HTTP response handling. Empty or unknown guards
                    are configuration errors with a sanitized 500 response, never anonymous or
                    another-guard fallback.
                </p>
                <p>
                    Without <code>authorize()</code>, required authentication still applies. A Gate
                    allow does not remove record scope, field visibility, or operation allowlists.
                    Pass the selected principal consistently to source scope and request-aware
                    Resources instead of using an unrelated default-guard user. Do not change the
                    application-wide default guard as a side effect of resolving a DataStore. Every
                    load, reload, poll, and URL restore rechecks current access. Guard names,
                    abilities, policy targets, and access mode are server declarations, never
                    frontend state or request overrides.
                </p>
                <p>
                    Proposed <code>publicAccess()</code> explicitly removes only the login
                    requirement. It never removes a declared Gate check or mandatory scope. Resolve
                    an optional user from the same valid guard; a guest Gate check uses
                    <code>Gate::forUser(null)</code> and follows Laravel's nullable-user rules.
                    Public HTTP access and public broadcasting are independent opt-ins. Protected
                    rows must never become public because a channel type changed. Proposed
                    <code>Guard</code>, <code>Authorize</code>, and
                    <code>PublicAccess</code> attributes normalize to the same server-owned access
                    policy. The ability and its arguments form one atomic declaration.
                    <code>PublicAccess(false)</code> explicitly restores authenticated access over a
                    lower public declaration; its native boolean maps to the internal
                    <code>AccessMode</code> enum.
                </p>
                <p>
                    The wire discriminator <code>error.kind = access</code> identifies a denial even
                    when its HTTP status is 503. An unknown source and a cloaked source share one
                    generic 404 access body. On access denial or authentication loss, invalidate
                    pending generations, clear rows, counts, capability metadata, cursor history,
                    and infinite windows, discard buffered replacements, stop polling, and release
                    private subscriptions. This exception overrides retaining an accepted result
                    after a network or server error. Retain requested criteria only within the same
                    identity context for an explicit authorized retry. A user, tenant, or
                    guard-context change starts fresh defaults. Rejected access must not reveal
                    protected counts or whether a requested row exists.
                </p>
                <p>
                    The design follows Laravel's
                    <DocsLink
                        href="https://laravel.com/framework/docs/13.x/authentication#specifying-a-guard"
                        >explicit authentication guards</DocsLink
                    >
                    and
                    <DocsLink href="https://laravel.com/framework/docs/13.x/authorization"
                        >Gate and policy authorization</DocsLink
                    >. Those Laravel APIs are available; the Dapter integration above is planned.
                </p>
                <h3
                    id="selectable-filters"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Selectable filters
                </h3>
                <p>
                    A field filter has a scoped public id and one logical scalar domain. Infer the
                    domain from homogeneous non-null declared options when unambiguous. An ambiguous
                    comparison requires an explicit compatible ValueType and storage mapping.
                    ValueType::Boolean covers boolean filter targets. A null-only comparison uses IS
                    NULL and needs no non-null coercion. Mixed incompatible options or row types are
                    source configuration errors. Check each Collection target against the declared
                    domain. Each SQL driver verifies a compatible column or expression and binds
                    typed values. A database's implicit conversion of false or string zero to
                    integer zero cannot define equality. Global callback operands keep their own
                    declared wire types.
                </p>
                <p>
                    The driver applies equality for one value, membership for multiple values, and
                    explicit null matching for an allowed null. For example,
                    <code>status</code> can allow <code>active</code> and <code>pending</code>. The
                    browser can select permitted values, but it cannot choose an undeclared
                    operator, column, or callback. The definition is immutable from the client's
                    perspective. The selection is mutable within that definition.
                </p>
                <p>
                    Single-value filters use declared wire values. Multi-value filters use typed
                    arrays, with OR semantics within one filter and AND semantics between different
                    filters. A definition declares whether the empty selection removes that filter
                    or is invalid. Defaults are initial selections, not access restrictions.
                    Required restrictions belong in mandatory scope.
                </p>
                <p>
                    Validate option values and selection cardinality on every request. Dynamic
                    options must respect the same reader scope. Large option catalogs can gain a
                    separately authorized option provider later rather than appearing unbounded in
                    every response.
                </p>
                <h3
                    id="filter-application-callbacks"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Filter application callbacks
                </h3>
                <p>
                    The proposed <code>globalFilterable</code> declaration describes a global filter
                    transform authored as a <code>Closure</code> or trusted invokable class-string.
                    Its normalized PHPDoc contract is
                    <code>Closure(TSource, TValue): TSource</code>. The first argument is the scoped
                    working source. The second argument is the validated selected value. Return the
                    same source type, such as Eloquent <code>Builder</code> or
                    <code>Collection</code>. A derived instance of that type is valid; returning the
                    identical object is not required.
                </p>
                <p>
                    Native callbacks can use
                    <code>(Builder $source, mixed $value): Builder</code> or
                    <code>(Collection $source, mixed $value): Collection</code>. PHP's
                    <code>mixed</code> already includes arrays and enums. Use
                    <code>array&lt;mixed&gt;</code>, <code>TValue</code>, or
                    <code>list&lt;TValue&gt;</code> in PHPDoc to describe a narrower contract.
                    Single or multiple selection is explicit in the filter declaration, never
                    inferred from an array input. Field filters use automatic equality, membership,
                    and explicit null matching, without callbacks. Their enum options normalize to
                    strict wire tokens. This callback contract belongs only to global filters.
                </p>
                <p>
                    Validate every requested operation before constructing handlers or running
                    listing queries. This includes search match types, sort types, directions, order
                    exclusivity, filter values, page sizes, and cursor eligibility. Unknown or
                    missing filter identifiers and values outside declared options fail with HTTP
                    422. Multiple selection validates every element, its shape, and its cardinality.
                    One invalid selection rejects the whole request and invokes zero handlers, so
                    validation never leaves a partially applied callback chain. Membership uses
                    strict types, distinguishing <code>0</code>, <code>'0'</code>,
                    <code>false</code>, and <code>null</code> without loose PHP equality or
                    coercion. Missing, empty, and null selections follow the filter's explicit
                    declaration. Clearing a selection never removes mandatory source scopes.
                </p>
                <p>
                    Preserve an authorized base clone for <code>total</code>. Apply transforms to a
                    scoped working source, then derive filtered counts and data from their returned
                    source. Do not replay callbacks for counts. Transforms must not execute
                    <code>get()</code>, pagination, queries, or other I/O. Trusted application
                    handlers must preserve model, connection, record semantics, and mandatory scope.
                    Matching the source family, model, connection, and query shape cannot prove
                    membership. A fresh same-model builder can widen scope. Test each handler with
                    excluded rows. Dapter can enforce the complete base predicate for its own
                    managed restrictions. Group OR conditions beneath that scope. A wrong source
                    return type or handler exception is a source fault, not a successful empty
                    result. Callbacks belong to the server and never travel through browser state,
                    URLs, or package config.
                </p>
                <p>
                    This conceptual sketch uses a SQL source with string <code>status</code> values
                    and the explicit Collection fixture below. The filter APIs and named arguments
                    remain proposed and unavailable. Given the wire selection <code>'active'</code>,
                    the SQL callback receives <code>Status::Active</code> because its second
                    parameter is typed. The Collection callback receives the string
                    <code>'active'</code> because its second parameter is <code>mixed</code>. Each
                    produces the eligible active records, including fixture row <code>1</code>
                    for the Collection. The adapter, not these transforms, executes or pages the
                    result.
                </p>
                <CodeExample
                    language="php"
                    label="Proposed Builder and Collection filter transforms, not current package usage"
                    :code="filterCallbacks" />
                <h3
                    id="invokable-global-handlers"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Invokable global filter and order handlers
                </h3>
                <p>
                    Proposed fluent <code>globalFilterable</code> and
                    <code>globalOrderable</code> accept a <code>Closure</code> or a trusted
                    invokable class-string. Native PHP uses <code>Closure|string</code>; PHPDoc
                    restricts the string to <code>class-string</code>. Declaration validation
                    requires an existing, container-resolvable class with a public nonstatic
                    <code>__invoke</code>. Arbitrary function names,
                    <code>Class::method</code> strings, array callables, and supplied handler
                    objects are outside this proposal.
                </p>
                <p>
                    Class-level <code>GlobalFilter</code> and <code>GlobalOrder</code> keep their
                    supported <code>apply</code> handler argument, including invokable classes.
                    Their method-level form instead binds the attributed private method, as
                    described below. This does not enable arbitrary method strings in fluent
                    declarations or browser requests.
                </p>
                <p>
                    A filter implements <code>__invoke(TSource, TValue): TSource</code>. An order
                    handler implements <code>__invoke(TSource): TSource</code>. Validate each
                    concrete signature for its source engine, value binding, and return type.
                    Preserve that signature when normalizing the resolved method to an internal
                    <code>Closure</code>. PHPDoc generics describe row types; reflection cannot
                    prove row shapes or mandatory scope. Do not require a generic public interface
                    whose broad Builder-or-Collection or mixed parameters would prevent concrete
                    Builder and enum parameter types under PHP contravariance.
                </p>
                <p>
                    Laravel's container resolves the class per request and supports constructor
                    injection. Pass exactly the source and validated value to filters, or the source
                    alone to order handlers. Do not inject services into invocation operands.
                    Resolve handlers only after access checks and complete request validation. An
                    invalid request invokes zero handlers and constructs no handler instances.
                    Static metadata reflection may validate declarations earlier without executing
                    constructors. Constructors and handlers perform no queries or other I/O. Shared
                    singleton bindings must never retain reader or tenant context.
                </p>
                <CodeExample
                    language="php"
                    label="Proposed invokable classes with fluent and attribute forms, unavailable"
                    :code="invokableHandlers" />
                <p>
                    These records match the Products fixture. With <code>only_news</code> true,
                    either declaration form retains row 1. Without the filter, <code>by_price</code>
                    orders rows 2 then 1. The same strict enum subsets, explicit array-element enum
                    binding, source and return checks, mandatory scope, and membership and order
                    rules apply to classes and closures. An order handler only reorders; a filter
                    preserves the scoped record semantics. Neither handler classes nor service
                    instances appear in browser input or client metadata.
                </p>
                <p>
                    A wrong engine, invalid declared signature, or unresolvable handler is a
                    sanitized configuration error. A wrong actual source return or handler exception
                    is a source fault. Invalid browser values still return HTTP 422 before service
                    construction. Request-local handler lifetime also applies to queued delivery,
                    where authorization and Resource projection use the intended recipient context.
                </p>
                <h3
                    id="private-method-handlers"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Private method filter and order callbacks
                </h3>
                <p>
                    A private nonstatic method with <code>GlobalFilter</code> or
                    <code>GlobalOrder</code> becomes that operation's callback. Its public
                    identifier defaults to the PHP method name. An explicit identifier remains
                    stable when the implementation method is renamed. Class-level handler
                    declarations require an explicit identifier and supported handler. Method-level
                    declarations reject <code>apply</code>, because the method already owns the
                    callback.
                </p>
                <p>
                    The following proposed members belong inside an Eloquent DataSource whose model
                    has boolean <code>active</code> and numeric <code>price</code> columns. The
                    filter allows exactly true or false. The order identifier is
                    <code>lowestPrice</code>. Filters receive the already scoped Builder and
                    validated value. Order callbacks receive the already scoped Builder. Both return
                    the same source type without executing it. A zero-argument method returning a
                    fresh query would discard the authorized source and is outside this contract.
                </p>
                <CodeExample
                    language="php"
                    label="Proposed private source callback members, unavailable"
                    :code="methodHandlers" />
                <p>
                    A method-level identifier can be explicit, such as
                    <code>GlobalOrder(id: 'lowest_price')</code>. Omitting it uses the method name.
                    Filter value domains still require declared allowed values; a shortcut does not
                    turn mixed input into an unrestricted filter.
                </p>
                <p>
                    Normalize the reflected method to a bound Closure using its declaring class,
                    including parent private methods. Apply the existing enum conversion, allowed
                    values, duplicate checks, scope preservation, and driver validation. Do not use
                    container operand injection for these transforms. Query callback methods never
                    become HTTP actions. Separate action methods carry Action metadata. Reject a
                    method marked as both a query transform and an action. Private visibility does
                    not authorize a request, and none of these method names can be selected as
                    arbitrary callables.
                </p>
                <h3
                    id="enum-filter-binding"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Enum options and typed value binding
                </h3>
                <p>
                    These application value enums are separate from Dapter's mandatory contract
                    enums for match types, sort types, value types, and pagination modes. Filter
                    declarations accept individual enum cases, arrays of cases,
                    <code>Status::cases()</code>, or a server-declared enum class that expands its
                    cases. An explicit subset such as
                    <code>[Status::Active, Status::Pending]</code> stays restrictive. A valid
                    <code>Status::Archived</code> case remains forbidden. The browser sends only the
                    declared primitive representation, never PHP enum objects, class names, or
                    method names.
                </p>
                <p>
                    PHP backed enums expose string or integer values, as documented in the
                    <DocsLink href="https://www.php.net/manual/en/language.enumerations.backed.php"
                        >backed enum reference</DocsLink
                    >. Dapter's proposed wire representation uses that value with its exact type.
                    For pure <code>UnitEnum</code> cases, use the case name described in the
                    <DocsLink href="https://www.php.net/manual/en/language.enumerations.basics.php"
                        >basic enum reference</DocsLink
                    >. Reject duplicate or ambiguous wire representations during definition
                    validation, including raw <code>'active'</code> beside
                    <code>Status::Active</code>.
                </p>
                <p>
                    A concrete enum type on global filter callback parameter two, such as
                    <code>Status $value</code>, binds a validated allowed wire value to that exact
                    case before invocation. A nullable enum receives null only when null is
                    explicitly allowed. A <code>mixed</code> parameter receives the validated wire
                    value without automatic enum conversion. The declared enum domain must match the
                    typed callback enum. Never translate to another enum merely because backing
                    values match. Type and subset membership checks precede binding, with no
                    permissive <code>tryFrom</code> coercion or expansion to the whole enum.
                </p>
                <p>
                    Native <code>array</code> cannot reveal an element's enum type. Multiple enum
                    conversion requires explicit enum-element binding metadata in the definition or
                    attribute, plus PHPDoc <code>list&lt;Status&gt;</code> for static typing.
                    Reflection alone does not infer PHPDoc element types. A callback may therefore
                    specialize <code>TValue</code> to <code>Status</code> or
                    <code>list&lt;Status&gt;</code> under a declared binding. Ambiguous enum unions
                    or interfaces require an explicit binding or fail configuration validation.
                </p>
                <p>
                    The equivalent proposed <code>#[GlobalFilter(...)]</code> below reuses the
                    <code>Status</code> declaration above and the same Collection fixture. PHP 8.5
                    permits static closures and first-class callables in attribute parameters, as
                    the
                    <DocsLink href="https://www.php.net/releases/8.5/en.php"
                        >PHP 8.5 release announcement</DocsLink
                    >
                    documents. This sketch uses a long <code>static function</code> closure.
                    Alternatively, metadata can reference a trusted invokable class-string. Neither
                    handler nor class names come from the client. The same normalizer accepts fluent
                    and attribute forms without a provider registration. Attribute-only sources
                    require neither <code>WithOptions</code> nor public <code>options()</code>.
                    Resolve these callbacks at runtime without serializing closure objects into
                    config or definition caches.
                </p>
                <CodeExample
                    language="php"
                    label="Proposed PHP 8.5 filter metadata, unavailable"
                    :code="filterAttribute" />
                <p>
                    Acceptance cases must distinguish mixed and enum-typed callbacks, an allowed
                    subset value, an unknown token, and a valid-but-forbidden enum case. Verify
                    integer versus string mismatches, pure enum case names, explicitly allowed null,
                    and duplicate wire tokens. Verify multiple selections with explicit element
                    types and one invalid member. That invalid request returns HTTP 422 with zero
                    handler calls. Configuration failures include a mismatched enum domain,
                    ambiguous binding, and a wrong callback source type.
                </p>
                <h3
                    id="dynamic-search"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Dynamic search
                </h3>
                <p>
                    Search accepts terms and declared match types. The portable baseline supports
                    <code>equals</code>, <code>contains</code>, <code>starts_with</code>, and
                    <code>ends_with</code> on compatible declared fields. Each field declares its
                    accepted types and value type. Numeric equality parses a numeric input instead
                    of applying a string operator to every value.
                </p>
                <p>
                    The phase 3 setting <code>searchMatch(default, allowed)</code> accepts
                    <code>SearchMatch::All</code> and <code>SearchMatch::Any</code>. Its attribute
                    form is <code>#[SearchGrouping(default: ..., allowed: ...)]</code>. Both default
                    to All with only All allowed. Reject an empty list or a default outside the list
                    as a configuration fault. Publish the authorized default and allowed modes in
                    <code>global.searchMatch</code>. Expose <code>setSearchMatch</code> only when
                    the reader can choose between modes. Otherwise it is null. Field search clauses
                    and the one global search group combine with declared
                    <code>searchMatch: 'all'</code> by default. A declared
                    <code>searchMatch: 'any'</code> uses OR between those clauses inside one
                    parenthesized search group. Global targets always combine with grouped OR.
                    Filters and mandatory scope always AND the whole search group. In all mode the
                    shape is
                    <code
                        >scope AND filters AND (field A AND (global target A OR global target
                        B))</code
                    >. In any mode it is
                    <code
                        >scope AND filters AND (field A OR (global target A OR global target
                        B))</code
                    >. Multiple membership values use OR within their own filter. Different filters,
                    including two named filters on one field, combine with AND.
                </p>
                <p>
                    Global search accepts exactly one string. Each target fixes its own parser and
                    match type on the server. For Notebook, a numeric id target contributes false
                    while a name contains target is still evaluated. If all targets are
                    incompatible, the global search group is false. Never drop an active restriction
                    because parsing failed for its targets. Invalid numeric field search returns
                    HTTP 422; a valid global string with an incompatible numeric target does not.
                    Clients cannot replace global targets, value types, or match types. The source
                    declares search clause and term-length limits.
                </p>
                <p>
                    Repeated input on one control replaces its current term. It does not append a
                    query clause per keystroke. A new declared field or global clause refines the
                    full source criteria under the existing all or any grouping; it does not search
                    only loaded rows. Search changes preserve active filters and ordering.
                </p>
                <p>
                    String terms are literal text. Escape SQL LIKE metacharacters consistently. Only
                    an empty literal string clears its clause. Preserve surrounding whitespace. A
                    term equal to
                    <code>&quot;0&quot;</code> remains a real term. Specify case, accents, Unicode
                    normalization, null, and numeric behavior per engine. Do not promise identical
                    collation across SQLite, MySQL, PostgreSQL, and PHP.
                </p>
                <p>
                    Regex is optional and disabled by default. Its syntax, execution bounds,
                    invalid-pattern behavior, and database support require a separate capability.
                    SQLite cannot be assumed to have an application-installed regex function. Never
                    silently fetch an entire SQL dataset into PHP to emulate an unsupported
                    operator.
                </p>
            </ProseSection>
            <ProseSection id="sorting-and-complex-queries" title="Sorting and complex queries">
                <p>
                    Requested order is exactly one of <code>default</code>, an ordered nonempty
                    field list, or one global preset id. Field entries contain public
                    <code>field</code>, <code>direction</code>, and <code>sortType</code>. Array
                    position is priority. Do not store a second priority number. Single-order
                    sources reject multiple entries. Proposed
                    <code>multiOrder(true, max: 3)</code> permits additive field ordering through
                    <code>global.multi_order</code> and <code>global.multi_order_limit</code>. It
                    defaults to disabled, with an effective limit of one. A validated finite limit
                    counts requested field terms, excluding fixed prefixes and identity
                    tie-breakers. Multi-order sources reject duplicate public fields. Match types
                    describe search; sort types describe ordering.
                </p>
                <p>
                    Field ordering applies automatically using allowed directions and
                    <code>sortTypes</code>. Initial SQL capabilities expose supported native
                    ordering. Collections can expose numeric and natural ordering when verified.
                    Natural and numeric comparisons are different operations. Locale-aware Unicode
                    comparison requires an explicit locale and supported implementation such as
                    PHP's optional intl
                    <DocsLink href="https://www.php.net/manual/en/class.collator.php"
                        >Collator</DocsLink
                    >. Unsupported modes fail validation instead of silently falling back.
                </p>
                <p>
                    <code>globalOrderable('by_price', ...)</code> declares a labeled preset with
                    <code>Closure(TSource): TSource</code>. It receives only the scoped source. Each
                    preset fixes its own complete order, with no browser direction or sortType.
                    Selecting a preset replaces field order. Selecting a field while a preset is
                    active starts a new field order. A raw request containing both fails HTTP 422. A
                    global order callback may only reorder; it must preserve membership, projection,
                    model, connection, identity, and scope. It performs no queries or other I/O.
                </p>
                <p>
                    An existing source order is either a replaceable fallback or a declared fixed
                    prefix. Remove the replaceable fallback before applying field order or invoking
                    a preset callback. Retain the fixed prefix. Automatic field ordering composes
                    prefix, selected terms, and the declared unique identity tie-breaker. An opaque
                    Collection callback must itself provide that complete deterministic order. The
                    fixture uses <code>sortBy([['price', 'asc'], ['id', 'asc']])</code> with no
                    fixed prefix. The engine cannot infer arbitrary comparator ties or safely add a
                    separate sort afterward. SQL callbacks must preserve declared prefix and unique
                    tie order too. Reject contracts the engine cannot preserve.
                </p>
                <p>
                    Effective metadata describes full terms for automatic field order. For an opaque
                    callback it identifies the selected preset and opaque order without inventing
                    terms. Callback order presets are offset-only in this first proposal. A cursor
                    request selecting one returns HTTP 422. A local unsupported action returns a
                    typed failure without changing state or silently switching paging mode. A future
                    cursor-capable preset extension needs separate review.
                </p>
                <h3
                    id="public-identifiers-and-query-targets"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Public identifiers and query targets
                </h3>
                <p>
                    Separate the public field identifier, SQL target, and output key. For example,
                    the browser requests <code>category_id</code>, the source maps it to
                    <code>categories.id</code>, and the query can select it as
                    <code>category_id</code>. Only the declared mapping reaches SQL. The same public
                    field can map to a Collection record path in another source.
                </p>
                <p>
                    Qualified identifiers such as <code>joined_table.id</code> are valid trusted
                    server-side targets. Dotted browser identifiers do not become SQL automatically.
                    Reject an undeclared identifier even if it names a real joined column. A source
                    may deliberately expose a dotted public key, but it remains an allowlisted key.
                    Keep that key literal in frontend maps and use bracket notation for it; never
                    interpret browser dots as query paths.
                </p>
                <p>
                    Existing joins and whereHas constraints remain intact. Relationship filters use
                    declared global filter handlers where a column mapping is insufficient. Grouped
                    queries, aggregates, aliases, expressions, subqueries, distinct results, and
                    custom ordering require tested count and pagination strategies. Preserve select
                    lists and bindings. Never apply a generic <code>select('*')</code>,
                    deduplication pass, or rewritten join to make an unsupported query appear to
                    work.
                </p>
                <p>
                    A join can create several output rows with the same model primary key. The
                    source must then define a unique result identity and valid order, use a declared
                    one-row-per-model projection, or choose a supported simpler query. Do not append
                    the model key and claim uniqueness for a one-to-many result. Define counts over
                    returned logical records, not blindly over the underlying joined rows.
                </p>
                <p>
                    Serialization uses the declared optional JsonResource. The simple Eloquent path
                    follows Laravel serialization, including hidden and visible properties. Source
                    authors remain responsible for selected joined fields and appended data. Never
                    add internal cursor-only columns to the public payload unless declared for
                    output.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
