<script setup>
import ComparisonDemo from '@/components/demo/dapter/comparisons/ComparisonDemo.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import DocsTable from '@/components/docs/DocsTable.vue';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const columns = ['Source', 'Literal search', 'Ordering', 'Full-text', 'Regex'];
const rows = [
    [
        'Collection',
        'Canonical mark folding and lowercase; explicit strict exact text',
        'Native, Regular, String, Natural, Numeric; explicit Locale for String in offset/simple',
        'Unavailable',
        'Unavailable',
    ],
    [
        'PostgreSQL Eloquent',
        'Source-owned folding by default; explicit strict binary or codepoint predicates',
        'Native database collation and null placement',
        'Explicit regconfig, plain text, filter only; offset/simple/cursor',
        'Unavailable',
    ],
    [
        'MySQL Eloquent',
        'Source-owned folding by default; explicit strict binary or codepoint predicates',
        'Native database collation and null placement',
        'Unavailable',
        'Unavailable',
    ],
    [
        'SQLite Eloquent',
        'Source-owned folding by default; explicit strict binary or codepoint predicates',
        'Native database collation and null placement',
        'Unavailable, including FTS5 installations',
        'Unavailable',
    ],
];
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="matrix" title="Source comparison matrix">
                <p>
                    This reference describes the unpublished protocol 2 preview. A listed mode still
                    needs a declaration and admission on the actual bound source. SQL rows stay in
                    SQL. Dapter never materializes them into PHP to imitate another engine's
                    comparator.
                </p>
                <DocsTable
                    caption="Declared comparisons by source"
                    :columns="columns"
                    :rows="rows" />
                <p>
                    Collection cursor ordering remains Native, with lexical strcmp for strings.
                    Locale cannot be used for cursor order. SQL Locale ordering is unavailable.
                    Full-text preserves its engine parser and dictionary under either literal
                    policy. The strict literal flag does not make FullText case-sensitive. Full-text
                    retains native order and paging restrictions. None of these modes promises equal
                    results across engines.
                </p>
                <p>
                    Verified environments use PostgreSQL 18.6, MySQL 8.4.11, SQLite 3.45.2, and ICU
                    77.1. These observations do not make unsupported full-text engines available or
                    promise identical collation across versions.
                </p>
            </ProseSection>
            <ProseSection id="metadata" title="Admitted metadata">
                <p>
                    Locale order metadata contains locale, validLocale, actualLocale, icuVersion,
                    strength tertiary, normalization true, and numeric false. Full-text search
                    metadata contains engine pgsql, configuration, input plain_text, maxBytes 512,
                    and ranking filter_only. Fixed global targets retain their fullText metadata.
                    Requests never select comparison policy settings.
                </p>
                <p>
                    Definition decoders may remove declared capabilities or finite values. A
                    retained operation keeps its exact comparison metadata. Neither decoded rows nor
                    stale controls grant new operations. Field-specific nullable and finite operands
                    remain separate from the projected row shape.
                </p>
            </ProseSection>
            <ProseSection id="failure-boundary" title="Absence and failure">
                <p>
                    An unavailable optional comparison is omitted from capabilities. Selecting an
                    unavailable declared comparison returns HTTP 422 unsupported_operation before
                    handlers, counts, or rows. Required unsupported defaults and fixed operations
                    fail configuration. A forged operation outside the wire vocabulary returns
                    unsupported_operation before calling source().
                </p>
                <p>
                    Unavailable support differs from a failed probe. Catalog denial, outages,
                    unexpected SQL errors, malformed results, invalid UTF-8, and Collator failures
                    remain failures. Dapter never converts those failures into successful empty
                    results or equal ordering ties. Admission uses the effective read or write PDO,
                    including sticky and transaction routing, without a cross-request cache.
                </p>
                <p>
                    An admitted SQL String literal declaration, in either default or strict mode,
                    and an admitted PostgreSQL full-text declaration require a connection without
                    registered Connection::beforeExecuting callbacks. These callbacks run after
                    builder guards and could redirect execution to another PDO or role. Their
                    presence fails configuration with invalid_source even when the declared search
                    is unused. This includes SQLite, MySQL, and PostgreSQL literal targets.
                    Numeric-only declarations do not acquire the literal callback restriction.
                </p>
            </ProseSection>
            <ProseSection id="regex" title="Arbitrary regex remains unavailable">
                <p>
                    No MatchType, request control, or capability admits arbitrary regex. A short
                    pattern can still cause excessive work. Input length and PHP PCRE backtrack or
                    recursion limits do not establish a wall-clock execution bound. MySQL's global
                    ICU limits cannot be changed safely for one read. PostgreSQL POSIX regex
                    requires its own timeout and failure contract. SQLite defines no default regexp
                    function.
                </p>
                <p>
                    The fixed request below combines a valid active=true filter with a forged regex
                    search. Start returns HTTP 422 unsupported_operation without calling source() or
                    running the valid filter. Reset clears the result. This is a rejection example,
                    not a pattern editor.
                </p>
                <ComparisonDemo scenario="RegexRejected" />
                <p>
                    See
                    <DocsLink href="https://www.php.net/manual/en/pcre.configuration.php"
                        >PHP PCRE limits</DocsLink
                    >,
                    <DocsLink href="https://dev.mysql.com/doc/refman/8.4/en/regexp.html"
                        >MySQL regex limits</DocsLink
                    >,
                    <DocsLink href="https://www.postgresql.org/docs/18/functions-matching.html"
                        >PostgreSQL pattern matching</DocsLink
                    >, and
                    <DocsLink href="https://www.sqlite.org/lang_expr.html"
                        >SQLite expressions</DocsLink
                    >.
                </p>
            </ProseSection>
            <ProseSection id="guides" title="Working comparison guides">
                <p>
                    Use
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/collection-comparisons').href"
                        >Compare Collection values</DocsLink
                    >
                    for fixed locale and Unicode examples. Use
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/postgresql-full-text').href"
                        >Search PostgreSQL documents</DocsLink
                    >
                    for explicit parser configuration, scoped fixtures, and optional index setup.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
