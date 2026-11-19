<script setup>
import ComparisonDemo from '@/components/demo/dapter/comparisons/ComparisonDemo.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import fieldDeclaration from '../../../../../app/DataSources/Dapter/ComparisonsPostgresField.php?raw';
import globalDeclaration from '../../../../../app/DataSources/Dapter/ComparisonsPostgresGlobal.php?raw';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
    comparisonDemoEnabled: { type: Boolean, default: false },
});
const indexExample = `CREATE INDEX documents_title_english_gin
ON documents USING GIN (to_tsvector('pg_catalog.english'::regconfig, coalesce(title, '')));`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Prepare the PostgreSQL source">
                <p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    in an existing Laravel, Inertia, Vue, and Vite application. Configure a real
                    PostgreSQL Eloquent connection with PDO pgsql, a text column, and permission to
                    read the selected text-search configuration. Use explicit protocol 2. No
                    PostgreSQL extension is required.
                </p>
                <p>
                    Keep tenant and visibility predicates in source(). Full-text filters remain
                    inside that source. The package probes the actual effective execution PDO and
                    role before handlers, counts, or row reads. The probe resolves the
                    schema-qualified configuration and executes a bound constant expression. It does
                    not change server or session settings. A separate successful default-connection
                    probe grants no capability.
                </p>
                <p>
                    Use a connection without registered Connection::beforeExecuting callbacks.
                    Laravel runs these callbacks after builder guards, so a callback could change
                    the execution PDO or role after admission. An admitted full-text declaration
                    with such callbacks fails configuration with invalid_source, even when that
                    optional search is unused. Admitted String literal declarations have the same
                    callback restriction on SQLite, MySQL, and PostgreSQL, including strict mode.
                    Numeric-only declarations do not acquire a literal prerequisite.
                </p>
            </ProseSection>
            <ProseSection id="declare-search" title="Declare a plain-text field search">
                <p>
                    FullText keeps PostgreSQL parser, dictionary, and stemming semantics under
                    either strictLiteralSearch setting. The literal flag does not make text search
                    case-sensitive. Pass MatchType::FullText and FieldOptions(fullText: new
                    FullTextOptions('pg_catalog.english')). Keep the configuration schema-qualified
                    and server-owned. The browser cannot choose a configuration. In your
                    application, replace the demo PostgresRecords import with your Eloquent source
                    and mandatory scopes.
                </p>
                <CodeExample
                    label="Declare an optional PostgreSQL full-text field"
                    language="php"
                    :code="fieldDeclaration" />
                <p>
                    Active input contains 1 to 512 UTF-8 bytes and no NUL. Existing clear semantics
                    still clear search. PostgreSQL plainto_tsquery treats surviving terms as AND,
                    applies the selected parser, stemming, and stopwords, and ignores query
                    operators. Stopword-only input matches no documents. A null document is empty.
                </p>
                <p>
                    The compiler binds the configuration and plain text to to_tsvector and
                    plainto_tsquery. Full-text is a filter. It exposes no rank value or relevance
                    ordering. Declared Native ordering and the existing offset, simple, and cursor
                    contracts remain in force. Cursor fingerprints include the trusted
                    configuration. Reads remain live views without snapshot isolation.
                </p>
            </ProseSection>
            <ProseSection id="global-search" title="Fix the global target on the server">
                <p>
                    For a global search, declare SearchTarget with the same FullTextOptions and
                    MatchType::FullText. The request supplies the search value. It cannot change the
                    target column or match operator.
                </p>
                <CodeExample
                    label="Declare a fixed global full-text target"
                    language="php"
                    :code="globalDeclaration" />
                <p>
                    SearchableField and GlobalSearch attributes accept the same DTOs. Captured
                    configuration uses fields.title.search.options.fullText.configuration for a
                    field and global.search.document.fullText.configuration for a fixed target. Both
                    use pg_catalog.english here. The source disclosures below show complete
                    executable equivalents.
                </p>
            </ProseSection>
            <ProseSection id="observe" title="Run the isolated fictional examples">
                <p>
                    These frames require a separately configured documentation demo connection. They
                    never create tables, seed records, or contact PostgreSQL while the page opens.
                    Select Start to read the fixed fixture. Reset cancels pending work and clears
                    the response. No reader authentication, tenant membership, or application record
                    changes.
                </p>
                <p>
                    The source includes four active docs-comparisons documents: running fox, quiet
                    library, runner notes, and null. A fifth running fox belongs to another tenant
                    and remains excluded. The English query running returns ID 1, total 4, and
                    filtered 1. Runner stems differently. Inspect fullText metadata for engine
                    pgsql, configuration pg_catalog.english, input plain_text, maxBytes 512, and
                    ranking filter_only.
                </p>
            </ProseSection>
            <ComparisonDemo scenario="PostgresField" :postgres-enabled="comparisonDemoEnabled" />
            <ComparisonDemo scenario="PostgresGlobal" :postgres-enabled="comparisonDemoEnabled" />
            <ComparisonDemo
                scenario="PostgresAttribute"
                :postgres-enabled="comparisonDemoEnabled" />
            <ComparisonDemo scenario="PostgresConfig" :postgres-enabled="comparisonDemoEnabled" />
            <ProseSection id="optional-index" title="Add an index for repeated searches">
                <p>
                    A GIN index is optional performance setup. Create it through your application's
                    migration workflow on the same expression and explicit configuration used by the
                    source. This example assumes an application documents table with an existing
                    nullable title text column. Neither pgvector nor unaccent is a prerequisite.
                </p>
                <CodeExample
                    label="Optional expression index for an application documents table"
                    language="sql"
                    :code="indexExample" />
                <p>
                    See
                    <DocsLink href="https://www.postgresql.org/docs/18/textsearch-controls.html"
                        >PostgreSQL text-search controls</DocsLink
                    >
                    and
                    <DocsLink href="https://www.postgresql.org/docs/18/textsearch-indexes.html"
                        >text-search indexes</DocsLink
                    >
                    for parser and index behavior. Index availability does not change Dapter's
                    admitted operation.
                </p>
            </ProseSection>
            <ProseSection
                id="contributor-demo-setup"
                title="Enable these frames in a documentation checkout">
                <p>
                    This setup is optional contributor tooling, separate from package installation.
                    In the docs checkout, provide a dedicated PostgreSQL database whose name begins
                    with dapter_ through DAPTER_COMPARISONS_PGSQL_URL. Keep that URL server-side.
                    Enable the frames in the same server environment:
                </p>
                <CodeExample
                    label="Enable isolated PostgreSQL documentation frames"
                    code="DAPTER_COMPARISONS_PGSQL_ENABLED=true" />
                <p>Run the fixture setup command from the docs checkout:</p>
                <CodeExample
                    label="Prepare only the isolated documentation fixture"
                    code="php scripts/setup-dapter-comparisons.php" />
                <p>
                    The command refuses an unowned existing table and unknown fixture rows. It
                    installs only the fictional docs_dapter_comparison_documents fixture on the
                    dedicated connection. Disabled installations show an unavailable message.
                    Configured but unreachable databases show the actual failed request. Do not
                    point this fixture setup at application data.
                </p>
            </ProseSection>
            <ProseSection id="next-guide" title="Check unavailable combinations">
                <p>
                    See
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/comparison-capabilities').href
                        "
                        >source comparison capabilities</DocsLink
                    >
                    for unsupported engines, sanitized selection failures, configuration errors, and
                    probe failures.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
