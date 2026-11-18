<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import LiteralDemo from '@/components/demo/dapter/literal/LiteralDemo.vue';
import CodeExample from '@/components/docs/CodeExample.vue';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const sqliteSetup = 'php scripts/setup-dapter-literal.php';
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Prepare the literal search preview">
                <p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    in your Laravel application before copying these source declarations. These APIs
                    belong to the unpublished protocol 2 preview. Use protocol 2 with the documented
                    session, CSRF, and Ziggy setup. No browser setting selects sensitivity. Front
                    Awesome supplies the demonstration controls through its public exports.
                </p>
                <p>
                    The fictional scoped rows contain Joao, JOAO, João, JOÃO, JoÃo, decomposed Joa
                    followed by U+0303 and o, and joao. IDs 1 through 7 belong to tenant 1. An
                    eighth matching row belongs to tenant 2 and remains excluded. The Collection
                    examples need no database, account, worker, or broadcaster.
                </p>
            </ProseSection>
            <ProseSection id="default" title="Keep the default for case and accent variants">
                <p>
                    Declare String search with Contains, Equals, StartsWith, or EndsWith. By
                    default,
                    <code>joao</code> matches all seven scoped variants with every literal operator.
                    The source policy applies to field search and fixed global String targets. The
                    request sends the original text and the existing matchType. It contains no
                    sensitivity flag.
                </p>
                <p>
                    Select Start to send the displayed Contains request. Inspect the seven rows and
                    total 7, filtered 7. Opening the page starts no read. Reset cancels pending work
                    and clears the response. The source disclosure contains the actual declaration,
                    helper, and fixture.
                </p>
            </ProseSection>
            <LiteralDemo scenario="LiteralDefault" />
            <ProseSection id="strict" title="Select strict comparison on the source">
                <p>
                    Add <code>strictLiteralSearch()</code> to StoreOptions, or declare
                    <code>#[StrictLiteralSearch]</code> on the source class. Both default their
                    boolean argument to true. The same input now returns ID 7 only. Strict
                    comparison preserves case, accents, canonical composition, and string
                    boundaries. Composed João and decomposed Joa followed by U+0303 and o remain
                    different strings. Percent, underscore, exclamation mark, and backslash remain
                    literal characters in both modes.
                </p>
                <p>
                    Both declarations below keep field and global search on the same source policy.
                    Numeric and boolean equality, finite filters, projections, source scope,
                    ordering, and paging retain their own contracts. FullText retains its engine
                    parser, dictionary, and stemming behavior. This option does not make FullText
                    case-sensitive.
                </p>
            </ProseSection>
            <LiteralDemo scenario="LiteralStrictFluent" />
            <LiteralDemo scenario="LiteralStrictAttribute" />
            <ProseSection id="sql" title="Keep filtering and counts in SQL">
                <p>
                    SQL String literal sources require a connection without registered
                    Connection::beforeExecuting callbacks, in both default and strict modes, even
                    when a declared literal search is unused. Laravel runs those callbacks after
                    builder guards, so they could redirect the execution PDO or role after
                    admission. Dapter rejects that configuration with invalid_source before
                    handlers, counts, or rows. Numeric-only declarations do not acquire this literal
                    prerequisite. The SQLite example uses a dedicated, preprovisioned fictional
                    database. Its source only reads literal_search_records through the
                    dapter_literal_demo connection. It never creates tables, seeds records, or
                    changes a reader's application data. The documentation installation prepares
                    that fixture before Start is used.
                </p>
                <CodeExample
                    label="Prepare the isolated documentation SQLite fixture"
                    :code="sqliteSetup" />
                <p>
                    Collection and SQLite normalize canonical NFD, remove Unicode marks, and
                    lowercase text without ASCII transliteration. Symfony's public normalizer
                    polyfill is an explicit Composer runtime dependency, so literal search does not
                    require PHP intl. SQLite registers one deterministic scalar function on the
                    actual execution PDO. SQL still filters, counts, and pages rows, but each folded
                    value calls PHP. Ordinary indexes on the original text do not accelerate the
                    folded expression automatically.
                </p>
                <p>
                    PostgreSQL uses verified UTF8 normalization, mark removal, and lowercase with
                    deterministic final comparison. MySQL uses verified native case and accent
                    insensitive collation with fixed mark removal. MySQL can equate additional
                    characters such as ø with o and ł with l. The other implementations do not
                    promise those equivalences. Strict SQL comparison uses explicit binary or
                    codepoint predicates instead of the column's case insensitive equality or LIKE
                    rules. Ordering still follows the source's declared comparison rules.
                </p>
            </ProseSection>
            <LiteralDemo scenario="LiteralSqlite" />
            <ProseSection id="migration" title="Review the preview default change">
                <p>
                    Earlier preview builds used strict Collection literals and database-native SQL
                    literal rules. Declare strictLiteralSearch(true) explicitly wherever exact text
                    is required. The existing Collection comparison example does so. Check native
                    collation equivalences before upgrading SQL sources. Existing cursor and
                    retained live contexts cannot cross a policy change. Restart those reads after
                    changing the declaration.
                </p>
                <p>
                    Continue with
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/literal-search/configuration')
                                .href
                        "
                        >Configure literal search defaults</DocsLink
                    >
                    for captured configuration, inherited attributes, and custom driver migration.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
