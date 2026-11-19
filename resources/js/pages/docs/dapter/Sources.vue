<script setup>
import ListingDemo from '@/components/demo/dapter/listing/ListingDemo.vue';
import collectionSource from '../../../../../app/DataSources/Dapter/Quickstart.php?raw';
import eloquentSource from '../../../../../app/DataSources/Dapter/SqliteProducts.php?raw';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
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
            <ProseSection id="starting-environment" title="Choose a source for your records">
                <p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    first. Use a Collection source for rows you already have in memory. Use an
                    Eloquent source to let the database filter, order, and page a query. Keep
                    Laravel's web middleware, sessions, and CSRF protection enabled. Expose
                    <code>dapter.data</code> through your existing Ziggy configuration. Dapter
                    supports Collections and ordinary SQLite, MySQL, and PostgreSQL Eloquent
                    queries.
                </p>
                <p>
                    The grids use Front Awesome's public controls and Pro DataGrid. Complete
                    <DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                        >Front Awesome installation</DocsLink
                    >
                    and its Web Awesome Pro prerequisites before copying the grid. Dapter itself has
                    no presentation-library dependency. Each example below uses the same 23
                    fictional notebooks. Open its source disclosure for the complete declaration and
                    the helper files that declaration uses. Each example starts only when you select
                    <strong>Start example</strong>.
                </p>
            </ProseSection>
            <ProseSection id="collection" title="List records from memory">
                <p>
                    Create <code>app/DataSources/Dapter/Quickstart.php</code> using the declaration
                    below. A <code>CollectionDataSource</code> accepts a Laravel Collection or an
                    array from <code>source()</code>. This example returns an array of 23 notebook
                    records. <code>#[PublicAccess]</code> permits guests to read them. For private
                    data,
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/access').href"
                        >choose a guard</DocsLink
                    >
                    and declare the appropriate source scope.
                </p>
                <CodeExample
                    label="app/DataSources/Dapter/Quickstart.php"
                    language="php"
                    :code="collectionSource" />
                <p>
                    The source name <code>Dapter.Quickstart</code> resolves under the application's
                    actual namespace followed by <code>DataSources</code>, usually
                    <code>App\DataSources</code>. Start the example to display Notebook 01 through
                    Notebook 10. Paging reaches all 23 rows.
                </p>
            </ProseSection>
            <ListingDemo scenario="Quickstart" />
            <ProseSection id="eloquent" title="Read an ordinary SQLite query">
                <p>
                    Extend <code>EloquentDataSource</code> and return an Eloquent Builder from
                    <code>source()</code>. Keep protected reads inside that method so authorization
                    runs first. The example below returns the builder from the
                    <code>SqliteFixture</code> helper in the source disclosure.
                </p>
                <CodeExample
                    label="app/DataSources/Dapter/SqliteProducts.php"
                    language="php"
                    :code="eloquentSource" />
                <p>
                    The runnable example creates an isolated in-memory SQLite connection and seeds
                    its 23 fictional records after access succeeds. Its
                    <code>FixtureProduct</code> model and connection helper appear in the
                    disclosure. It reads no application tables. Start it to display five notebooks,
                    then navigate to page 5 to see the last three.
                </p>
                <p>
                    Ordinary Eloquent queries use the connection's SQLite, MySQL, or PostgreSQL
                    driver automatically. For joins, grouped results, and custom projections, see
                    the supported expressions and result identity requirements in
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/advanced-queries').href"
                        >Query joined or grouped records</DocsLink
                    >.
                </p>
            </ProseSection>
            <ListingDemo scenario="SqliteProducts" />
            <ProseSection id="collection-contract" title="Implement the Collection contract">
                <p>
                    Implement <code>Contracts\CollectionSource</code> directly when an existing
                    class cannot extend the base source. Return the fictional rows as an array. The
                    contract accepts a Collection or an array and preserves the same paging
                    behavior.
                </p>
                <p>
                    This declaration uses the shared <code>FixtureProducts</code> catalog shown in
                    its source disclosure. Start it to observe the same ten-row first page.
                </p>
            </ProseSection>
            <ListingDemo scenario="CollectionRaw" />
            <ProseSection id="generate-source" title="Generate a source declaration">
                <p>
                    From your Laravel application root, generate a Collection declaration or an
                    Eloquent declaration. Replace the generated <code>source()</code> body with your
                    application's public contract implementation.
                </p>
                <p>
                    The required <code>name</code> argument is a dotted string such as
                    <code>Dapter.GeneratedCatalog</code>. Omitting the argument fails before
                    generation. Programmatic Artisan calls with a non-string name return exit code
                    <code>1</code> and create no file.
                </p>
                <CodeExample
                    label="Generate a Collection source"
                    code="php artisan make:datasource Dapter.GeneratedCatalog" />
                <CodeExample
                    label="Generate an Eloquent source"
                    code="php artisan make:datasource Dapter.GeneratedSqliteCatalog --eloquent" />
            </ProseSection>
            <ProseSection id="decode-rows" title="Validate rows before presentation">
                <p>
                    Source-only Vue rows have the <code>unknown</code> TypeScript type. Pass a
                    validating <code>decodeRow</code> function to produce typed application rows.
                    These grids validate each product's integer <code>id</code>, string
                    <code>name</code>, and string <code>category</code>. A decoder failure rejects
                    the whole response.
                </p>
                <p>
                    To choose what each reader receives, declare a
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/resources').href"
                        >Laravel Resource</DocsLink
                    >
                    on the source. Rows must be JSON-safe before decoding. Top-level Laravel
                    Arrayable and JsonSerializable rows are converted first. Nested values must be
                    strings, booleans, null, arrays, plain objects, or finite numbers whose absolute
                    value is at most <code>9007199254740991</code>. Encode larger identifiers and
                    exact decimals as strings.
                </p>
                <p>
                    Nested value objects, resources, invalid UTF-8, and nesting deeper than 100
                    levels fail serialization. A decoder may create a Date or an application value
                    object. Dapter copies and freezes plain arrays and objects. Native methods on
                    decoded value objects still work, so a Date's internal state remains mutable.
                </p>
            </ProseSection>
            <ProseSection id="next-steps" title="Configure the declaration">
                <p>
                    Read
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/source-boundaries').href"
                        >source and public record boundaries</DocsLink
                    >
                    to scope and project records before paging. Continue with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/listing').href"
                        >Read and paginate a source</DocsLink
                    >, then
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/options').href"
                        >Configure source options</DocsLink
                    >
                    to choose paging defaults and attributes. Use
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/composable').href"
                        >Share an adapter</DocsLink
                    >
                    when controls outside the row component need the same state.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
