<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const declaration = `use ArtisanToolbox\\Dapter\\Enums\\MatchType;
use ArtisanToolbox\\Dapter\\Options\\FieldOptions;
use ArtisanToolbox\\Dapter\\Options\\VectorOptions;
use ArtisanToolbox\\Dapter\\StoreOptions;

public function options(): StoreOptions
{
	return StoreOptions::make()->searchableField(
		'embedding',
		[MatchType::Vector],
		options: new FieldOptions(vector: new VectorOptions(
			dimensions: 3,
			maxDistance: 1.0,
		)),
	);
}`;
const request = `catalog.fields.embedding.search.call({ value: [0, 0, 0], matchType: 'vector' });`;
const configuration = `'declarations' => [
	'fields' => [
		'embedding' => [
			'search' => [
				'matchTypes' => ['vector'],
				'options' => ['vector' => ['dimensions' => 3, 'maxDistance' => 1.0]],
			],
		],
	],
],`;
</script>
<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection
                id="starting-environment"
                title="Prepare PostgreSQL and numeric embeddings">
                <p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    and
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/field-search').href"
                        >field search</DocsLink
                    >
                    in your Laravel application. Vector filtering is available in Dapter
                    1.0.0-beta.2. Use PostgreSQL with pgvector already installed and enabled on the
                    effective connection. The application owns its vector column, source query,
                    authorization, and prepared embeddings.
                </p>
                <p>
                    The example assumes a source named Products with a three-dimensional embedding
                    column. Supply embeddings before reading. Dapter never installs an extension,
                    calls a provider, or generates an embedding from text. MySQL, SQLite, and
                    Collection drivers do not advertise vector search and reject forced vector
                    requests.
                </p>
            </ProseSection>
            <ProseSection id="declare-vector-search" title="Declare the field and maximum distance">
                <p>
                    Add this public options hook to a source that implements WithOptions. The vector
                    declaration applies only to field search. Global vector search, mixed scalar and
                    vector match types, and vector options on filters or ordering are invalid
                    configurations.
                </p>
                <CodeExample
                    label="Declare prepared vector search"
                    language="php"
                    :code="declaration" />
                <p>
                    VectorOptions requires dimensions between 1 and 16,000 and a finite, nonnegative
                    maxDistance no greater than 9,007,199,254,740,991. The threshold belongs to the
                    server declaration. A request cannot replace it. The equivalent configuration
                    belongs to config/dapter.php for the configured declarations.
                </p>
                <CodeExample
                    label="Configure vector field search"
                    language="php"
                    :code="configuration" />
            </ProseSection>
            <ProseSection id="prepared-input" title="Submit a prepared numeric vector">
                <p>
                    With a ready protocol 2 catalog handle, submit a dense array of exactly three
                    finite numbers. Each coordinate has magnitude at most 1,000,000 and must remain
                    finite after float32 conversion. Zero vectors are valid for L2. Strings,
                    booleans, nulls, sparse arrays, nested arrays, NaN, and infinity are invalid.
                </p>
                <CodeExample label="Filter an existing adapter" language="js" :code="request" />
                <p>
                    The server advertises valueType vector, matchTypes ['vector'], and vector policy
                    with engine pgsql, dimensions, metric l2, maxDistance, input prepared_vector,
                    precision float32, maxCoordinateMagnitude 1000000, threshold inclusive, and
                    ranking filter_only. Build controls from these capabilities. Front Awesome's
                    DataView reads the same capability and accepts a JSON numeric array through its
                    field search control.
                </p>
            </ProseSection>
            <ProseSection id="expected-result" title="Read the inclusive L2 result">
                <p>
                    For a query [0, 0, 0] and maxDistance 1.0, embeddings [0, 0, 0] and [1, 0, 0]
                    match. [2, 0, 0] and null embeddings do not match. Authorization and source
                    scopes still apply. The comparison includes the exact distance boundary.
                </p>
                <p>
                    Vector search filters the source. It preserves the existing requested order,
                    default order, identity ties, offset or simple paging, cursor rules, and count
                    semantics. It does not rank nearest neighbors, return distance metadata, or
                    select a relevance order. Approximate indexes, recall guarantees, and
                    computed-distance cursors remain separate research topics.
                </p>
                <p>
                    This guide intentionally uses code snippets and native package tests instead of
                    an interactive vector demo. The package's VectorSearchTest and
                    NativeVectorSearchTest cover declaration, validation, scoped native PostgreSQL
                    filtering, inclusive distance, ordering, paging, counts, and unsupported
                    backends. See
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/research/vector-retrieval').href
                        "
                        >historical vector retrieval research</DocsLink
                    >
                    for the earlier ranking experiment.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
