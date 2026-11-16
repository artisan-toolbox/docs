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

const storeDeclaration = `use ArtisanToolbox\\Dapter\\CollectionDataSource;
use ArtisanToolbox\\Dapter\\Contracts\\WithOptions;
use ArtisanToolbox\\Dapter\\StoreOptions;
use ArtisanToolbox\\Dapter\\Enums\\EmptySelectionPolicy;
use ArtisanToolbox\\Dapter\\Enums\\MatchType;
use ArtisanToolbox\\Dapter\\Enums\\SearchMatch;
use ArtisanToolbox\\Dapter\\Enums\\SortType;
use ArtisanToolbox\\Dapter\\Enums\\ValueType;
use Illuminate\\Support\\Collection;

// Proposed Dapter imports and API, unavailable in the current package.
final class Products extends CollectionDataSource implements WithOptions
{
    /** @return Collection<int, array{id: int, name: string, status: string, price: int, user_id: int, news: bool}> */
    public function source(): Collection
    {
        return collect([
            ['id' => 1, 'name' => 'Notebook', 'status' => 'active', 'price' => 20, 'user_id' => 7, 'news' => true],
            ['id' => 2, 'name' => 'Pencil', 'status' => 'pending', 'price' => 5, 'user_id' => 9, 'news' => false],
        ]);
    }

    public function options(): StoreOptions
    {
        return StoreOptions::make()
            ->searchableField('name', matchTypes: [MatchType::Contains, MatchType::Equals])
            ->orderableField('name', sortTypes: [SortType::Natural])
            ->orderableField('price', sortTypes: [SortType::Numeric])
            ->multiOrder(true, max: 3)
            ->searchMatch(default: SearchMatch::All, allowed: [SearchMatch::All, SearchMatch::Any])
            ->filterableField('name', 'catalog', values: ['Notebook', 'Pencil'])
            ->filterableField('status', 'availability', values: ['active', 'pending'])
            ->filterableField('user_id', 'new_sales', values: [7, 9], multiple: true, empty: EmptySelectionPolicy::Clear)
            ->filterableField('user_id', 'mine', values: [7])
            ->globalSearchable([
                'name' => ['target' => 'name', 'valueType' => ValueType::String, 'matchType' => MatchType::Contains],
                'id' => ['target' => 'id', 'valueType' => ValueType::Integer, 'matchType' => MatchType::Equals],
            ])
            ->globalOrderable('by_price', label: 'Lowest price',
                apply: static fn (Collection $source): Collection =>
                    $source->sortBy([['price', 'asc'], ['id', 'asc']]))
            ->globalFilterable('only_news', values: [false, true],
                apply: static fn (Collection $source, bool $value): Collection =>
                    $source->whereStrict('news', $value))
            ->pageSize(25)
            ->pageSizeOptions([10, 25, 50]);
    }
}`;

const attributeOnlyDeclaration = `use ArtisanToolbox\\Dapter\\Attributes\\FilterableField;
use ArtisanToolbox\\Dapter\\Attributes\\PageSize;
use ArtisanToolbox\\Dapter\\Attributes\\SearchableField;
use ArtisanToolbox\\Dapter\\CollectionDataSource;
use ArtisanToolbox\\Dapter\\Enums\\MatchType;
use Illuminate\\Support\\Collection;

#[SearchableField('name', matchTypes: [MatchType::Contains])]
#[FilterableField('status', 'availability', values: ['active', 'pending'])]
#[PageSize(25)]
final class CatalogProducts extends CollectionDataSource
{
    /** @return Collection<int, array{id: int, name: string, status: string}> */
    public function source(): Collection
    {
        return collect([
            ['id' => 1, 'name' => 'Notebook', 'status' => 'active'],
            ['id' => 2, 'name' => 'Pencil', 'status' => 'pending'],
        ]);
    }
}`;

const composedDeclaration = `use ArtisanToolbox\\Dapter\\Contracts\\WithOptions;
use ArtisanToolbox\\Dapter\\Attributes\\PageSize;
use ArtisanToolbox\\Dapter\\Attributes\\SearchableField;
use ArtisanToolbox\\Dapter\\CollectionDataSource;
use ArtisanToolbox\\Dapter\\Enums\\MatchType;
use ArtisanToolbox\\Dapter\\Enums\\SortType;
use ArtisanToolbox\\Dapter\\StoreOptions;
use Illuminate\\Support\\Collection;

#[PageSize(25)]
#[SearchableField('name', matchTypes: [MatchType::Contains])]
final class OrderedProducts extends CollectionDataSource implements WithOptions
{
    /** @return Collection<int, array{id: int, name: string, price: int}> */
    public function source(): Collection
    {
        return collect([
            ['id' => 1, 'name' => 'Notebook', 'price' => 20],
            ['id' => 2, 'name' => 'Pencil', 'price' => 5],
        ]);
    }

    public function options(): StoreOptions
    {
        return StoreOptions::make()
            ->pageSizeOptions([10, 50])
            ->orderableField('price', sortTypes: [SortType::Numeric]);
    }
}`;

const emptyBaselineDeclaration = `use ArtisanToolbox\\Dapter\\Attributes\\SearchableField;
use ArtisanToolbox\\Dapter\\CollectionDataSource;
use ArtisanToolbox\\Dapter\\Contracts\\WithOptions;
use ArtisanToolbox\\Dapter\\Enums\\MatchType;
use ArtisanToolbox\\Dapter\\Enums\\PagingMode;
use ArtisanToolbox\\Dapter\\StoreOptions;
use Illuminate\\Support\\Collection;

#[SearchableField('name', matchTypes: [MatchType::Contains])]
final class ExplicitProducts extends CollectionDataSource implements WithOptions
{
    /** @return Collection<int, array{id: int, name: string}> */
    public function source(): Collection
    {
        return collect([
            ['id' => 1, 'name' => 'Notebook'],
            ['id' => 2, 'name' => 'Pencil'],
        ]);
    }

    public function options(): StoreOptions
    {
        return StoreOptions::makeWithoutDefaults()
            ->guard('web')
            ->pagingMode(PagingMode::Offset)
            ->pageSize(25);
    }
}`;

const packageDefaults = `use ArtisanToolbox\\Dapter\\Enums\\PagingMode;

return [
    'access' => ['guard' => 'web'],
    'broadcasting' => ['context' => null],
    'paging' => [
        'mode' => PagingMode::Offset,
        'per_page' => 10,
        'per_page_options' => [5, 10, 50, 100],
    ],
];`;

const broadcastDeclaration = `use ArtisanToolbox\\Dapter\\Broadcasting\\PrivateChannel;
use ArtisanToolbox\\Dapter\\Broadcasting\\PublicChannel;
use ArtisanToolbox\\Dapter\\Contracts\\RowIdentityProvider;
use ArtisanToolbox\\Dapter\\Contracts\\RowRevisionProvider;

/**
 * @param class-string<RowRevisionProvider>|null $revisions
 * @param class-string<RowIdentityProvider>|null $identity
 */
public function broadcastUpdatable(
    ?string $identifierField = null,
    PrivateChannel|PublicChannel|null $channel = null,
    ?string $revisions = null,
    ?string $identity = null,
): self;

/**
 * @param class-string<RowRevisionProvider>|null $revisions
 * @param class-string<RowIdentityProvider>|null $identity
 */
public function __construct(
    ?string $identifierField = null,
    PrivateChannel|PublicChannel|null $channel = null,
    ?string $revisions = null,
    ?string $identity = null,
);

namespace ArtisanToolbox\\Dapter\\Broadcasting;

use ArtisanToolbox\\Dapter\\Contracts\\ChannelContextResolver;
use Illuminate\\Contracts\\Auth\\Authenticatable;

final readonly class PrivateChannel
{
    /** @param class-string<ChannelContextResolver> $context */
    public function __construct(string $pattern, string $context, ?string $authorize = null);
}

final readonly class PublicChannel
{
    public function __construct(string $name, string $projection);
}

final readonly class GlobalAudience
{
    public function __construct(string $projection);
}

final readonly class ScopedAudience
{
    public function __construct(string $scope, string $projection);
}

// The container or worker reconstructs trusted source, selected guard, and its principal.
// Browser request context never grants authority to construct this reader.
final class ChannelReader
{
    public readonly string $source;
    public readonly string $guard;
    public readonly Authenticatable $user;
}

namespace ArtisanToolbox\\Dapter\\Drivers;

final readonly class SqlIdentitySelector
{
    // The private qualified SQL column and its separate raw hydrated attribute.
    public function __construct(string $column, string $attribute);
}

namespace ArtisanToolbox\\Dapter\\Contracts;

use ArtisanToolbox\\Dapter\\Broadcasting\\ChannelReader;
use ArtisanToolbox\\Dapter\\Broadcasting\\GlobalAudience;
use ArtisanToolbox\\Dapter\\Broadcasting\\ScopedAudience;
use ArtisanToolbox\\Dapter\\Drivers\\SqlIdentitySelector;

interface ChannelContextResolver
{
    public function resolve(ChannelReader $reader): GlobalAudience|ScopedAudience|null;
}

interface RowIdentityProvider
{
    public function identify(mixed $rawRow): int|string;
    // Null for a source without a SQL selector.
    public function selector(): ?SqlIdentitySelector;
    // Pure reverse mapping to a supported native key. Null denies the lookup.
    public function lookup(int|string $publicIdentifier): int|string|null;
}

interface RowRevisionProvider
{
    /** @return string Canonical uint64 decimal, 0 through 18446744073709551615. */
    public function revision(mixed $rawRow): string;
}`;

const enumDeclarations = `namespace ArtisanToolbox\\Dapter\\Enums;

// Proposed backend contracts, unavailable in the current package.
enum MatchType: string
{
    case Contains = 'contains';
    case Equals = 'equals';
    case StartsWith = 'starts_with';
    case EndsWith = 'ends_with';
}

enum PagingMode: string
{
    case Offset = 'offset';
    case Simple = 'simple';
    case Cursor = 'cursor';
}

enum ValueType: string
{
    case String = 'string';
    case Integer = 'integer';
    case Number = 'number';
    case Boolean = 'boolean';
}

enum SortType: string
{
    case Native = 'native';
    case Regular = 'regular';
    case String = 'string';
    case Natural = 'natural';
    case Numeric = 'numeric';
    case Locale = 'locale';
}

enum SortDirection: string
{
    case Asc = 'asc';
    case Desc = 'desc';
}

enum SearchMatch: string
{
    case All = 'all';
    case Any = 'any';
}

enum EmptySelectionPolicy: string
{
    case Clear = 'clear';
    case Reject = 'reject';
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
            <ProseSection
                id="ownership-and-reusable-contracts"
                title="Ownership and reusable contracts">
                <p>
                    The organizing data shapes are the source definition, requested state, effective
                    state, and result. Keep them separate so configuration never becomes
                    browser-supplied execution logic.
                </p>
                <DocsTable caption="Source ownership and boundaries">
                    <thead>
                        <tr>
                            <th scope="col">Owner</th>
                            <th scope="col">Responsibility</th>
                            <th scope="col">Boundary</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Application DataSource</td>
                            <td>
                                Authorized base data, public field declarations, options, defaults,
                                row identity, and serialization
                            </td>
                            <td>Application code determines what the reader can access</td>
                        </tr>
                        <tr>
                            <td>Source definition</td>
                            <td>
                                Normalized, immutable declarations and policy for this source and
                                request
                            </td>
                            <td>
                                Attributes and explicit declarations produce this same definition
                            </td>
                        </tr>
                        <tr>
                            <td>StoreDriver</td>
                            <td>Apply validated search, filters, order, counts, and pagination</td>
                            <td>
                                Eloquent and Collection engines implement common behavior with
                                explicit differences
                            </td>
                        </tr>
                        <tr>
                            <td>HTTP integration</td>
                            <td>
                                Resolve a public source identifier, authorize, validate input, and
                                return a versioned JSON envelope
                            </td>
                            <td>
                                No arbitrary PHP class, SQL expression, or callback crosses from the
                                browser
                            </td>
                        </tr>
                        <tr>
                            <td>Vue adapter</td>
                            <td>
                                Coordinate typed state, requests, URL, scrolling, and default-slot
                                actions
                            </td>
                            <td>
                                Table, grid, cards, controls, and visual styling belong to the
                                consumer
                            </td>
                        </tr>
                    </tbody>
                </DocsTable>
                <p>
                    A common DataSource contract owns authorization and definition. Specific
                    Eloquent and Collection contracts give <code>source()</code> precise return
                    types. Optional base classes provide the short default path. Applications may
                    implement the contracts directly. Avoid one untyped class that decides its
                    engine by inspecting arbitrary values at runtime.
                </p>
                <p>
                    Resolve a fresh DataSource for each request. Clone query builders before count
                    and page operations so one operation cannot mutate the other. Share only
                    configuration proven independent of the current reader and request.
                </p>
                <p>
                    For the Collection engine, accept ordinary arrays of records and Laravel
                    Collections through one normalization boundary. An array becomes a Collection
                    before operations run. Eloquent models remain models until the serialization
                    stage. Do not silently evaluate a LazyCollection or generator and describe it as
                    streaming pagination. Large in-memory inputs still require materialization for
                    sorting and exact counts.
                </p>
                <h3
                    id="declaration-choices"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Declaration choices
                </h3>
                <p>
                    The local preview already implements the optional options hook, config and empty
                    baselines, inherited paging and access attributes, and explicit fluent
                    precedence. Its normalized definition is immutable and request-scoped. The
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/authority').href"
                        >server authority guide</DocsLink
                    >
                    explains the delivered boundary. The additional operation declarations below
                    remain proposals and must ship their attribute equivalents in their own phases.
                </p>
                <p>
                    The proposed typed Eloquent and Collection source contracts do not require
                    public <code>options()</code>. Optional <code>WithOptions</code> alone requires
                    <code>options(): StoreOptions</code> and explicitly opts into that custom hook.
                    <code>EloquentDataSource</code> and <code>CollectionDataSource</code> provide an
                    internal request-scoped options resolution path, not an unconditional public
                    base hook or implicit interface implementation. A generated source implements
                    only <code>source()</code>. Attributes work without <code>WithOptions</code>, a
                    trait, a public hook, or provider registration. Raw source implementations use
                    the same coordinator. Public capabilities derive from effective options,
                    authorized reader, and engine support.
                </p>
                <p>
                    The coordinator calls a <code>WithOptions</code> source's public hook exactly
                    once before proceeding to normalization or source work. A public
                    <code>options()</code> method without <code>WithOptions</code> is a
                    configuration error; attribute presence alone is never an error. Reject an
                    invalid hook return before protected work. Without a custom hook, use the
                    internal <code>StoreOptions::make()</code> path. Select the returned builder's
                    config or empty baseline, then compose ancestor attributes from root to leaf,
                    concrete-class attributes, then explicit fluent declarations. Each request gets
                    one validated immutable policy before engine use. Never call
                    <code>source()</code> or perform protected reads while inspecting metadata or
                    constructing declarations. Never cache reader-specific policies or handlers
                    globally.
                </p>
                <p>
                    The normalizer explicitly walks class ancestry because PHP does not inherit
                    class attributes automatically. The effective <code>options()</code> method
                    follows ordinary PHP inheritance. When a parent authors that hook, call
                    <code>parent::options()</code> to retain its fluent declarations and baseline.
                    Returning a fresh factory authors a new fluent layer while inherited attributes
                    still participate. See the
                    <DocsLink href="https://www.php.net/manual/en/language.attributes.overview.php"
                        >PHP attributes overview</DocsLink
                    >. Attribute arguments contain supported metadata, not factory or fluent calls.
                    All names in this proposal remain unavailable in the current package.
                </p>
                <h3
                    id="store-options"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    A compact StoreOptions builder
                </h3>
                <p>
                    All Dapter classes, contracts, methods, imports, and named arguments below are
                    proposed and unavailable. This conceptual fixture defines its inputs. Its
                    intended result allows searching name, ordering price numerically, selecting
                    named field filters, using a fixed global search group, selecting global filter
                    and order presets, and using 25 records per page. For this fixture, global
                    search for Notebook with only_news true returns row 1. The by_price preset
                    orders rows 2 then 1 before pagination. The separate broadcast declaration below
                    requires an authorized channel context before it enables loaded-row
                    replacements.
                </p>
                <CodeExample
                    language="php"
                    label="Proposed StoreOptions declaration, not current package usage"
                    :code="storeDeclaration" />
                <p>
                    <code>StoreOptions</code> has a private constructor. Direct
                    <code>new StoreOptions()</code> is prohibited. The static
                    <code>make()</code> factory returns a fresh request-scoped authoring object
                    prefilled with package config. Fluent methods return <code>self</code> for
                    chaining. The normalizer freezes server declarations and policy before binding
                    the driver. The bound driver supplies the technical support needed to compute
                    effective capabilities. Without a custom hook, the internal resolver uses a
                    fresh <code>StoreOptions::make()</code>. Both factories keep the selected
                    baseline separate from explicit declarations. Uncalled defaults never erase
                    attributes. Calling a setter explicitly, even with the same value as config,
                    records an override.
                </p>
                <h3
                    id="attribute-shortcuts"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Attribute shortcuts and layered options
                </h3>
                <p>
                    Every proposed <code>StoreOptions</code> capability has a PHP attribute
                    shorthand with the same argument contract, enum cases, advanced option DTOs,
                    handler forms, and validation within PHP constant-expression limits. Named
                    attributes are repeatable for distinct keys. Basic shortcuts belong to phase 1;
                    advanced options ship their attribute equivalent in the same phase. A shortcut
                    never makes an unsupported engine capability available.
                </p>
                <p>
                    Callback attributes support two targets. A class-level declaration supplies a
                    supported static Closure or trusted invokable class. A method-level declaration
                    selects that private source method. Scalar settings and field declarations
                    remain class-level metadata. Both callback forms use the same normalized
                    operation definition.
                </p>
                <DocsTable caption="Proposed fluent and attribute parity">
                    <thead>
                        <tr>
                            <th scope="col">Fluent declaration</th>
                            <th scope="col">Attribute shorthand</th>
                            <th scope="col">Policy key and behavior</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>searchableField(field, ...)</code></td>
                            <td><code>SearchableField(field, ...)</code></td>
                            <td>Field search keyed by field identifier</td>
                        </tr>
                        <tr>
                            <td><code>orderableField(field, ...)</code></td>
                            <td><code>OrderableField(field, ...)</code></td>
                            <td>Field order keyed by field identifier</td>
                        </tr>
                        <tr>
                            <td><code>filterableField(field, id, ...)</code></td>
                            <td><code>FilterableField(field, id, ...)</code></td>
                            <td>Field filter keyed by field and filter identifier</td>
                        </tr>
                        <tr>
                            <td><code>globalSearchable(targets, ...)</code></td>
                            <td><code>GlobalSearch(targets, ...)</code></td>
                            <td>One global search declaration</td>
                        </tr>
                        <tr>
                            <td><code>globalOrderable(id, ...)</code></td>
                            <td><code>GlobalOrder(id, ...)</code></td>
                            <td>Global order keyed by preset identifier</td>
                        </tr>
                        <tr>
                            <td><code>globalFilterable(id, ...)</code></td>
                            <td><code>GlobalFilter(id, ...)</code></td>
                            <td>Global filter keyed by filter identifier</td>
                        </tr>
                        <tr>
                            <td><code>searchMatch(default, allowed)</code></td>
                            <td><code>SearchGrouping(default, allowed)</code></td>
                            <td>Cross-clause grouping default and allowed modes</td>
                        </tr>
                        <tr>
                            <td><code>multiOrder(enabled, max: ...)</code></td>
                            <td><code>MultiOrder(enabled, max: ...)</code></td>
                            <td>One atomic permission and term-limit policy</td>
                        </tr>
                        <tr>
                            <td><code>pagingMode(mode)</code></td>
                            <td><code>Paging(mode)</code></td>
                            <td>Typed PagingMode configuration, subject to engine support</td>
                        </tr>
                        <tr>
                            <td><code>pageSize(size)</code></td>
                            <td><code>PageSize(size)</code></td>
                            <td>Chosen page-size scalar</td>
                        </tr>
                        <tr>
                            <td><code>pageSizeOptions(sizes)</code></td>
                            <td><code>PageSizeOptions(sizes)</code></td>
                            <td>Whole declared page-size list</td>
                        </tr>
                        <tr>
                            <td>
                                <code
                                    >broadcastUpdatable(identifierField, channel, revisions,
                                    identity)</code
                                >
                            </td>
                            <td>
                                <code
                                    >BroadcastUpdatable(identifierField, channel, revisions,
                                    identity)</code
                                >
                            </td>
                            <td>Atomic identity, channel, and optional revision declaration</td>
                        </tr>
                        <tr>
                            <td><code>useResource(resourceClass)</code></td>
                            <td><code>UseResource(resourceClass)</code></td>
                            <td>Validated Resource class-string</td>
                        </tr>
                        <tr>
                            <td><code>withActions(actionsClass)</code></td>
                            <td><code>Actions(actionsClass)</code></td>
                            <td>Explicit registration of a dedicated action class</td>
                        </tr>
                        <tr>
                            <td><code>guard(name)</code></td>
                            <td><code>Guard(name)</code></td>
                            <td>Server-owned guard</td>
                        </tr>
                        <tr>
                            <td><code>authorize(ability, arguments: ...)</code></td>
                            <td><code>Authorize(ability, arguments: ...)</code></td>
                            <td>Atomic Gate ability and arguments</td>
                        </tr>
                        <tr>
                            <td><code>publicAccess(enabled: true)</code></td>
                            <td><code>PublicAccess(enabled: true)</code></td>
                            <td>Explicit public or authenticated access mode</td>
                        </tr>
                        <tr>
                            <td><code>withoutFieldSearch(field)</code></td>
                            <td><code>WithoutFieldSearch(field)</code></td>
                            <td>Remove lower field search</td>
                        </tr>
                        <tr>
                            <td><code>withoutFieldOrder(field)</code></td>
                            <td><code>WithoutFieldOrder(field)</code></td>
                            <td>Remove lower field order</td>
                        </tr>
                        <tr>
                            <td><code>withoutFieldFilter(field, id)</code></td>
                            <td><code>WithoutFieldFilter(field, id)</code></td>
                            <td>Remove lower named field filter</td>
                        </tr>
                        <tr>
                            <td><code>withoutGlobalSearch()</code></td>
                            <td><code>WithoutGlobalSearch</code></td>
                            <td>Remove lower global search</td>
                        </tr>
                        <tr>
                            <td><code>withoutGlobalOrder(id)</code></td>
                            <td><code>WithoutGlobalOrder(id)</code></td>
                            <td>Remove lower named global order</td>
                        </tr>
                        <tr>
                            <td><code>withoutGlobalFilter(id)</code></td>
                            <td><code>WithoutGlobalFilter(id)</code></td>
                            <td>Remove lower named global filter</td>
                        </tr>
                    </tbody>
                </DocsTable>
                <p>
                    All attribute imports below use the proposed
                    <code>ArtisanToolbox\Dapter\Attributes</code> namespace. This complete
                    attribute-only Collection source has no <code>options()</code> override. A name
                    search for Notebook and availability active returns row 1, with a chosen page
                    size of 25. The internal resolver supplies config defaults automatically;
                    attributes need no <code>WithOptions</code> contract or public hook.
                </p>
                <CodeExample
                    language="php"
                    label="Proposed attribute-only Collection source, unavailable"
                    :code="attributeOnlyDeclaration" />
                <p>
                    Composition is keyed. Field search and order use the field identifier. Field
                    filters use the pair of field and filter identifiers. Global filters and global
                    order presets use their identifier in separate namespaces. Global search is a
                    singleton. Multi-order permission and its maximum are atomic. Resource,
                    broadcast declaration, guard, access mode, and Gate ability with arguments
                    retain explicit server-owned policy keys.
                </p>
                <p>
                    A declaration replaces the whole lower capability entry at its exact key,
                    including its handler, defaults, and allowed values. Unrelated operations
                    remain. Same-layer duplicate named entries and two singleton attributes on one
                    class fail configuration. Repeated scalar fluent setters use the last value. A
                    descendant attribute overrides an ancestor at the same key. Duplicate named
                    entries in the effective fluent layer remain invalid.
                </p>
                <p>
                    The removal family records trusted declaration tombstones that mask lower
                    entries without automatic resurrection. A declaration and removal at the same
                    key in one layer fail configuration. These removals change server capabilities;
                    they are separate from frontend <code>clear()</code>, which changes a selection.
                    Removing a listing declaration never removes mandatory tenant or visibility
                    scope in <code>source()</code>.
                </p>
                <CodeExample
                    language="php"
                    label="Proposed attributes composed with explicit fluent settings, unavailable"
                    :code="composedDeclaration" />
                <p>
                    This source retains name search and page size 25 from attributes, adds numeric
                    price ordering, and produces <code>[10, 50, 25]</code> as its allowed sizes. No
                    parent call is needed to retain attributes. Adding an explicit
                    <code>pageSize(10)</code> changes the size to 10 even though 10 equals config.
                    The page-size membership invariant runs once after all layers are merged. No
                    uncalled factory setting replaces an attribute.
                </p>
                <p>
                    <code>StoreOptions::make()</code> starts with a snapshot of package config.
                    <code>StoreOptions::makeWithoutDefaults()</code> starts with no package-config
                    values. Both factories preserve inherited and concrete attributes and apply only
                    explicitly called fluent setters above them. The returned builder selects its
                    baseline; the internal resolver must not re-add config underneath an
                    empty-baseline result. A config-seeded builder with no setters keeps attributes.
                </p>
                <CodeExample
                    language="php"
                    label="Proposed empty-baseline factory with retained attributes, unavailable"
                    :code="emptyBaselineDeclaration" />
                <p>
                    This source retains the name-search attribute and explicitly supplies its guard,
                    offset mode, and page size. Its allowed size list is <code>[25]</code>, because
                    an absent size-options list starts empty and retains the chosen size. Equivalent
                    attributes <code>#[Guard('web')]</code>,
                    <code>#[Paging(PagingMode::Offset)]</code>, and <code>#[PageSize(25)]</code>
                    can supply those settings instead. No configured size list is restored.
                </p>
                <p>
                    An empty baseline does not bypass validation, authentication, or mandatory
                    scope. Missing paging mode, positive chosen page size, or guard fails sanitized
                    configuration validation before <code>source()</code> or handler construction. A
                    guard is required even for public access. Authentication remains required unless
                    <code>publicAccess(true)</code> explicitly changes that policy. Missing config
                    never implies anonymous access. Undeclared optional operations and broadcasting
                    stay disabled. Eloquent row identity and source-order inference remain source
                    invariants. The typed <code>pagingMode(PagingMode $mode)</code> setter and
                    <code>Paging</code> attribute do not enable simple or cursor paging before phase
                    4.
                </p>
                <h3
                    id="broadcast-declaration"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    One atomic broadcast declaration
                </h3>
                <p>
                    The proposed fluent signature below and equivalent
                    <code>BroadcastUpdatable</code> attribute replace one complete
                    <code>OptionKey</code> entry under baseline, inherited attributes, concrete
                    attributes, and explicit fluent layering. Identity, channel, and revisions
                    cannot merge independently into a different policy. These names are settled
                    design contracts and remain unavailable exports.
                </p>
                <CodeExample
                    language="php"
                    label="Proposed atomic broadcast signatures, unavailable"
                    :code="broadcastDeclaration" />
                <p>
                    A non-null <code>identity</code> provider conflicts with a non-null
                    <code>identifierField</code>. Null infers an ordinary Eloquent primary key or
                    Collection <code>id</code>. A field string names the raw hydrated public-ID
                    field. A SQL-qualified selector is never interpreted as a model property path.
                    An optional <code>RowIdentityProvider</code> declares the private selector and
                    hydrated key, extracts a safe integer or string from the raw row, and maps a
                    public update key back to a supported native key without I/O. The native driver
                    owns eligibility and rejects ambiguous or unfilterable joins. Concatenating
                    values does not establish composite identity support.
                </p>
                <p>
                    <code>PrivateChannel</code> requires an explicit context resolver and can add
                    one narrowing Laravel Gate ability. <code>PublicChannel</code> requires a
                    globally safe projection and explicit source opt-in. A null channel uses only
                    planned <code>dapter.broadcasting.context</code>, whose default is null. Calling
                    shorthand without a configured resolver or authorized context fails before
                    source reads. Configuration alone never enables broadcasting. There is no
                    required channel or revision source hook. See
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/design/live-updates').href +
                            '#broadcast-channel-authorization'
                        "
                        >channel authorization and audience</DocsLink
                    >
                    for registration, queued delivery, and the checked eligibility specification.
                </p>
                <h3
                    id="closed-domain-enums"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Closed backend domains use enums
                </h3>
                <p>
                    Every Dapter-owned fixed set uses a concrete PHP enum throughout the backend.
                    This is an MVP contract, not a later optional feature. Fluent declarations,
                    attributes, config defaults, normalized options, requested and effective state,
                    and engine dispatch use enum cases. Public PHP parameters never accept
                    <code>MatchType|string</code> or another permissive enum-or-string alternative.
                    Internal code must not convert cases back to strings to dispatch business logic.
                </p>
                <CodeExample
                    language="php"
                    label="Proposed backed enum contracts, not available package exports"
                    :code="enumDeclarations" />
                <p>
                    The inventory also includes <code>ErrorKind</code> for the error discriminator,
                    <code>SearchMatch</code> for all or any grouping, <code>OrderKind</code> for
                    default, fields, or preset ordering, <code>AccessMode</code> for authenticated
                    or public access, and <code>ChannelType</code> for private or public delivery.
                    <code>RevisionFormat::Unsigned64Decimal</code> has the stable wire value
                    <code>uint64-decimal</code>. Proposed <code>ActionTransport</code> has Visit and
                    Http cases with visit and http backing values. Action HTTP verbs use a concrete
                    <code>ActionMethod</code> enum, with Post as the default and explicitly declared
                    Put, Patch, or Delete alternatives. Add concrete enums for other closed backend
                    policies when their contracts are defined. Keep ordinary booleans and positive
                    integer limits in their native types. An enum case does not enable an operation:
                    source allowlists, engine support, valid combinations, and delivery phases still
                    decide availability. Cursor and locale cases remain unavailable until their
                    implementation phase passes.
                </p>
                <p>
                    Native PHP signatures name the enum. Lists use precise PHPDoc such as
                    <code>non-empty-list&lt;MatchType&gt;</code>, static analysis, and declaration
                    validation because PHP has no native generic array element type. Global search
                    target shapes hold <code>valueType: ValueType</code> and
                    <code>matchType: MatchType</code>; immutable typed option objects preserve
                    cross-option rules such as numeric targets accepting equality only. Use readonly
                    definitions and exhaustive enum handling rather than string switches or silent
                    fallback branches. Attributes receive the same enum cases as fluent methods.
                </p>
                <p>
                    ValueType names a logical comparison domain, not a database's implicit cast.
                    Nullability is declared separately. See the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/design/operations').href +
                            '#selectable-filters'
                        "
                        >managed scalar domain rules</DocsLink
                    >
                    for valid values, inference, numeric bounds, and incompatible target failures.
                    SQL boolean storage requires an explicit verified mapping before the driver can
                    advertise Boolean comparisons.
                </p>
                <p>
                    JSON, URL state, and TypeScript use the enums' documented backing values. Parse
                    external values once: first verify their exact primitive type, then convert to
                    the correct enum and check source subsets and engine compatibility. Unknown,
                    wrong-type, or known-but-forbidden values fail before operation handlers or
                    driver listing reads. A permissive <code>tryFrom()</code> conversion alone is
                    insufficient. Serialize backing values only at transport or framework
                    boundaries. For example, the Collection callback above uses Laravel's own
                    string-based sorting API; Dapter's declaration and engine contracts remain
                    enum-typed. Derive frontend literal unions from the published enum values when
                    generation is implemented, without claiming automatic PHP-to-TypeScript
                    inference today.
                </p>
                <p>
                    Field names, source aliases, filter and preset ids, guard names, Gate abilities,
                    and class names are application-owned identifiers. They remain validated open
                    domains. User filter values, including application enums such as
                    <code>Status</code>, follow the separate value-binding contract below. Keep
                    <code>mixed</code> only where application data genuinely varies, never as the
                    type of a fixed Dapter policy. The
                    <DocsLink
                        href="https://www.php.net/manual/en/language.enumerations.expressions.php"
                        >PHP enum constant-expression rules</DocsLink
                    >
                    support enum metadata and defaults. PHP 8.5 features must strengthen these
                    contracts without obscuring the source-only setup.
                </p>
                <h3
                    id="field-global-operations"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Field and global operations
                </h3>
                <p>
                    The six proposed root methods are <code>searchableField</code>,
                    <code>globalSearchable</code>, <code>orderableField</code>,
                    <code>globalOrderable</code>, <code>filterableField</code>, and
                    <code>globalFilterable</code>. Ordinary field declarations stay short. Typed
                    option objects carry advanced configuration without child builders or separate
                    operation interfaces. Offset mode requires exact counts. Later modes retain
                    their
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/design/paging-state').href +
                            '#pagination-and-consistency'
                        "
                        >count and navigation limits</DocsLink
                    >.
                </p>
                <p>
                    Field search, field order, and field filters apply automatically to trusted
                    mapped targets. Global search also applies automatically. It declares one string
                    input and fixed <code>matchType</code> and <code>valueType</code> per target.
                    Only global filter and global order presets accept callbacks. Each callback
                    receives a scoped Builder or Collection, never the DataStore coordinator.
                </p>
                <p>
                    A field filter has a public id scoped to its field, such as
                    <code>fields.user_id.filters.new_sales</code>. Several named filters may share
                    one field. Search, order, and filters on name merge into one field node, with
                    one consistent trusted target. Within one declaration layer, duplicate search or
                    order on that field, duplicate filter ids on that field, duplicate global filter
                    ids, duplicate global order ids, or a second global search fail definition
                    validation. Reusing a filter id on another field is valid. Global filter and
                    order ids occupy separate namespaces. Never derive SQL from browser strings.
                </p>
                <h3
                    id="package-defaults"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Package defaults and effective policy
                </h3>
                <p>
                    The current preview delivers <code>config/dapter.php</code>, its paging and
                    guard keys, and optional publication. Follow
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/options').href"
                        >Configure source options</DocsLink
                    >
                    for the working setup. The additional broadcasting context below is proposed and
                    unavailable. A basic <code>source()</code> plus <code>DataAdapter</code> uses
                    numbered pagination without custom config, attributes, or an
                    <code>options()</code> override.
                </p>
                <CodeExample
                    language="php"
                    label="Current paging defaults with a proposed broadcasting extension"
                    :code="packageDefaults" />
                <p>
                    The <code>make()</code> factory seeds offset mode, a chosen size of 10, and
                    <code>[5, 10, 50, 100]</code>. <code>pageSize(25)</code> is valid and appends
                    the chosen size to produce <code>[5, 10, 50, 100, 25]</code>. The effective
                    chosen size always belongs to the allowed list. Invalid sizes, including zero,
                    negative values, and non-integers, are configuration errors before listing
                    reads.
                </p>
                <p>
                    <code>pageSizeOptions(array)</code> replaces the configured list. Normalize
                    unique positive integers in first-declared order, then append the effective
                    chosen size if missing. Keep the declared size list separate from the
                    automatically retained size until normalization. Compute this invariant from the
                    final chosen size and declared list, independently of setter order. Both
                    <code>pageSize(25)-&gt;pageSizeOptions([5, 50, 5])</code> and the reverse order
                    yield <code>[5, 50, 25]</code>. Calling only
                    <code>pageSizeOptions([5, 50])</code> retains default 10 as
                    <code>[5, 50, 10]</code>. Do not retain an intermediate auto-added size after
                    the chosen size changes. An explicitly declared 10 remains allowed.
                </p>
                <p>
                    Effective options merge the selected config or empty baseline, ancestor
                    attributes, concrete attributes, then explicit fluent declarations. Unspecified
                    fluent settings retain attributes or selected baseline values. Config-seeded
                    <code>make()</code> is the internal default; a
                    <code>makeWithoutDefaults()</code> result is never reseeded. Scalar declarations
                    replace only their own key. A capability declaration replaces the whole lower
                    entry at that key, including defaults, handler, and allowed values. Never union
                    allowlists or recursively concatenate permission arrays. Unrelated declarations
                    remain. Request state can select an allowed <code>per_page</code>, but cannot
                    add sizes, handlers, or capabilities. Global config exposes no frontend search,
                    filter, or order fields and never enables broadcasting. Source authorization and
                    engine compatibility still constrain the effective policy.
                </p>
                <p>
                    Package config contains cacheable scalars, arrays, and enum cases, never runtime
                    <code>Closure</code> objects or resolved handler service instances. Trusted
                    class-string metadata is cacheable; resolve its service at runtime after access
                    and complete request validation. Factory isolation, changed application
                    defaults, layered composition, chosen-size retention in both call orders,
                    duplicate values, invalid sizes, and enum-preserving config-cache round trips
                    need behavioral tests.
                </p>
                <h3
                    id="reuse-decision"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Reuse decision
                </h3>
                <p>
                    Core's public <code>Arr::sift</code>, <code>Collection::sift</code>, and
                    <code>LazyCollection::sift</code> remove conditional markers from structures.
                    They do not implement record filtering or search. Keep Dapter's data operations
                    in Dapter. No concrete shared need currently justifies a Core dependency or
                    moving the engine into Core.
                </p>
                <p>
                    Front Awesome's public input, button, and presentation components can support
                    future documentation demos. They do not belong in the headless adapter's runtime
                    dependencies. The existing Inertia <code>useHttp</code> integration and
                    per-instance stale-response handling in documentation demos provide a behavior
                    precedent, not package code to copy.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
