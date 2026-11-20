<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import CodeExample from '@/components/docs/CodeExample.vue';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const commands = `DAPTER_RESEARCH_VECTOR_SCENARIO=baseline php scripts/dapter-research/vector-probe.php
DAPTER_RESEARCH_VECTOR_SCENARIO=revoked php scripts/dapter-research/vector-probe.php`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="scope" title="Historical native ranking experiment">
                <p>
                    This explanation examines a real PostgreSQL vector column. It is CLI-only
                    laboratory research, separate from the working scalar search guides. Dapter
                    1.0.0-beta.1 introduced a public vector field filter, described in
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/vector-search').href"
                        >Filter PostgreSQL vectors by distance</DocsLink
                    >. This historical experiment explores ranking and computed-distance seek, which
                    remain outside that API.
                </p>
                <p>
                    The initial environment lacked pgvector. After the user installed and enabled
                    version 0.8.7, both native-column scenarios passed on PostgreSQL 18.6. The
                    earlier absence remains historical evidence. The remaining deferral concerns
                    ranked retrieval and its operational contracts.
                </p>
            </ProseSection>
            <ProseSection id="input" title="Prepared three-dimensional L2 input">
                <p>
                    The fixture declares a nullable public.vector(3) column and a unique bigint
                    identity. The research accepts dense arrays of exactly three finite PHP integers
                    or floats, bounded to magnitude 1,000,000. It converts coordinates to float32
                    and verifies finiteness again before binding JSON to the trusted vector cast.
                    Zero vectors are valid for this L2 experiment. That does not establish a cosine
                    zero-vector policy.
                </p>
                <p>
                    Fifteen invalid inputs fail before any query. They cover empty, wrong-size,
                    oversized, sparse, null-vector, null-coordinate, boolean, numeric-string,
                    nested, object, text, NaN, infinity, negative infinity, and out-of-bound inputs.
                    Separate native SELECT casts reject dimension mismatch and non-finite literals.
                    These checks record the experiment's boundary. The current package validator has
                    its own native and public API tests.
                </p>
                <p>
                    Native L2 uses <code>OPERATOR(public.&lt;-&gt;)</code>. The installed Laravel
                    vector helpers compile PostgreSQL cosine distance with <code>&lt;=&gt;</code>.
                    Text arguments can call the separate Laravel AI SDK's embedding macro before
                    grammar admission. The experiment supplies prepared numeric arrays and invokes
                    no model, provider, or embedding service. See
                    <DocsLink href="https://github.com/pgvector/pgvector#querying"
                        >pgvector querying</DocsLink
                    >
                    and
                    <DocsLink
                        href="https://laravel.com/framework/docs/13.x/queries#vector-similarity-clauses"
                        >Laravel vector similarity clauses</DocsLink
                    >.
                </p>
            </ProseSection>
            <ProseSection id="results" title="Observed rank, scope, and pages">
                <p>
                    Each query applies tenant_id=1 and allowed=true. The baseline has six authorized
                    rows, including one null vector. Eligible IDs 10, 20, 30, 40, and 50 rank at L2
                    distances 0, 1, 1, 2, and 3 from [0, 0, 0]. Total is 6 and filtered is 5. The
                    closer revoked and other-tenant rows remain excluded. A [1, 0, 0] query changes
                    the rank to 20, 10, 30, 40, 50.
                </p>
                <DocsTable
                    caption="Observed exact native traversal"
                    :columns="['Experiment', 'Baseline', 'After revoking ID 20']"
                    :rows="[
                        ['Complete rank', '10, 20, 30, 40, 50', '10, 30, 40, 50'],
                        ['Scoped total and filtered', '6 and 5', '5 and 4'],
                        ['Offset pages of two', '[10,20], [30,40], [50]', '[10,30], [40,50]'],
                        ['Simple lookahead', 'has_next true, true, false', 'has_next true, false'],
                        ['Raw seek after distance 1, ID 20', '30, 40, 50', '30, 40, 50'],
                    ]" />
                <p>
                    Simple lookahead deliberately reports unknown counts. The raw SQL seek preserves
                    the tied ID 30 by ordering distance then identity. It is neither a sealed token
                    nor a Dapter cursor. Changing vectors or authorization can move rows between
                    requests. The prototype proves fresh SQL authorization predicates, not Laravel
                    Gates or revocation of bytes already returned.
                </p>
                <p>
                    The same retained PDO verifies extension, type, dimension, privileges, and
                    execution identity before reading. The controlled table has only a primary-key
                    index. Its recorded EXPLAIN contains a sequential scan and sort. This tiny
                    fixture makes no approximate-recall, latency, throughput, or production-cost
                    claim. Configured MySQL 8.4.11 supplies native connection metadata, then Laravel
                    rejects vector compilation before any vector SQL. Newer MySQL product-specific
                    facilities do not establish support for this server or Dapter.
                </p>
            </ProseSection>
            <ProseSection id="current-boundary" title="Current public filtering boundary">
                <p>
                    Dapter declares MatchType::Vector with FieldOptions and VectorOptions. It
                    filters with inclusive exact L2 distance and preserves source ordering and
                    normal pagination. Unsupported drivers omit this capability and reject a forced
                    operation. This research page has no interactive vector example.
                </p>
            </ProseSection>
            <ProseSection id="reproduce" title="Reproducible CLI laboratory artifacts">
                <p>
                    The documentation repository owns
                    <code>scripts/dapter-research/vector-probe.php</code>, its reviewed
                    <code>vector-fixture.sql</code>, and sanitized
                    <code>results/vector-baseline.json</code> and
                    <code>results/vector-revoked.json</code>. Inspect the
                    <DocsLink
                        href="https://github.com/artisan-toolbox/docs/tree/1.x/scripts/dapter-research"
                        >research artifacts</DocsLink
                    >
                    before running them from a documentation checkout with Composer dependencies
                    installed. A database owner provisions the isolated dapter_research_vector
                    schema on a disposable database. The SQL requires an already-installed public
                    pgvector extension and never installs one.
                </p>
                <p>
                    Set DAPTER_RESEARCH_PG_DSN, DAPTER_RESEARCH_PG_USER,
                    DAPTER_RESEARCH_PG_PASSWORD, DAPTER_RESEARCH_MYSQL_DSN,
                    DAPTER_RESEARCH_MYSQL_USER, and DAPTER_RESEARCH_MYSQL_PASSWORD in the shell. Use
                    local secret handling for passwords. No personal database name, role, or process
                    identifier is published. Run the baseline command below. Expect
                    passed_native_column_fixture. After an owner sets fixture ID 20 to
                    allowed=false, run the revoked command, then restore that fixture row. The probe
                    itself contains only SELECT, WITH, and EXPLAIN statements and performs no
                    session changes.
                </p>
                <CodeExample
                    label="Run native vector research from the docs checkout"
                    :code="commands" />
            </ProseSection>
            <ProseSection id="decision" title="Remaining gates for ranked retrieval">
                <p>
                    Defer ranked retrieval until a typed computed rank and its ordering,
                    authorization, count, and operational contracts exist. The delivered
                    exact-distance field filter does not establish these ranking contracts. Computed
                    distance needs its own sealed cursor boundary before vector cursors are
                    admitted. Exact and approximate retrieval need separate index, recall, mutation,
                    and operational limits. An unsupported operation must keep the existing
                    sanitized error contract. Reads must never provision extensions or generate
                    embeddings.
                </p>
                <p>
                    Return to
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/research').href"
                        >Research findings</DocsLink
                    >
                    for the independent pagination decision.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
