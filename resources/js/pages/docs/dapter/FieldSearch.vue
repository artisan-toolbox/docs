<script setup>
import FieldUsageDemo from '@/components/demo/dapter/fields/FieldUsageDemo.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import FieldDemo from '@/components/demo/dapter/fields/FieldDemo.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const declaration = `<?php

namespace App\\DataSources\\Dapter;

use App\\Demo\\Dapter\\Fields\\FieldRecords;
use ArtisanToolbox\\Dapter\\Contracts\\WithOptions;
use ArtisanToolbox\\Dapter\\Enums\\MatchType;
use ArtisanToolbox\\Dapter\\StoreOptions;

final class VueCatalog extends FieldRecords implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(2)->pageSizeOptions([2, 4])
            ->searchableField('name', [MatchType::Contains, MatchType::Equals]);
    }
}`;
const binding = `<script setup>
import { DataAdapter } from '@artisan-toolbox/dapter';
import { Input } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <DataAdapter source="Dapter.VueCatalog" :protocol="2" :url="false" v-slot="catalog">
        <Input v-if="catalog.fields?.name?.search" label="Search name"
            :model-value="catalog.fields.name.search.current?.value ?? ''"
            @update:model-value="catalog.fields.name.search.call({ value: $event, matchType: 'contains' })" />
        <ul><li v-for="row in catalog.data" :key="row.id">{{ row.name }}</li></ul>
    </DataAdapter>
</template>`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Search a name">
                <p>
                    Start with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Dapter installed</DocsLink
                    >
                    in a Laravel and Vue application. This public catalog has four in-memory
                    records. To copy the control, install
                    <DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                        >Front Awesome</DocsLink
                    >. The table uses ordinary HTML.
                </p>
            </ProseSection>
            <ProseSection id="declaration" title="Declare the field and bind a control">
                <p>
                    Copy <code>app/Demo/Dapter/Fields/FieldRecords.php</code> from the example's
                    <strong>View source</strong> panel. It supplies the four catalog rows. Save this
                    source as <code>app/DataSources/Dapter/VueCatalog.php</code> to enable the field
                    control.
                </p>
                <CodeExample
                    language="php"
                    label="Field declaration in VueCatalog"
                    :code="declaration" />
                <p>
                    Use protocol 2 to read the authorized field controls. Check for the operation
                    before rendering it. The first response supplies its available choices and
                    current selection.
                </p>
                <CodeExample
                    language="vue"
                    label="Bind the authorized field in Vue"
                    :code="binding" />
                <p>
                    Select <strong>Start example</strong>. Type <strong>Pencil</strong> to see
                    Pencil 100%_! and Pencil case (IDs 3 and 4). Type <strong>Eraser</strong> to see
                    the empty result. Clear search restores Notebook 10 and Notebook 2.
                </p>
            </ProseSection>
            <FieldUsageDemo task="search" />
            <ProseSection id="declaration-details" title="Declaration details">
                <p>
                    Implement WithOptions and return StoreOptions::make()->searchableField('name',
                    [MatchType::Contains, MatchType::Equals, MatchType::StartsWith,
                    MatchType::EndsWith]). The default match list contains only Contains. A target
                    defaults to the public field name. Pass a trusted server target for another
                    record path. The default value type is String. Declare a scalar value type
                    explicitly for typed equality.
                </p>
                <p>
                    Search values use the declared type. Contains, StartsWith, and EndsWith compare
                    literal text. A percent sign, underscore, exclamation mark, or backslash does
                    not become a SQL wildcard. Empty text clears a search. Unknown fields and
                    undeclared match types return HTTP 422. All active searches use the declared
                    searchMatch grouping. The default is All, which combines search clauses with
                    AND. The global-search guide demonstrates an explicit Any choice. A search that
                    matches nothing returns zero filtered rows and page 1.
                </p>
                <p>
                    SQL String search requires a verified character or text column. Native
                    PostgreSQL UUID columns are not text targets and fail configuration before
                    counts. A UUID stored in a character column supports ordinary text search.
                    Native JSON and unverified custom column types are unavailable for managed
                    search. These limits do not prevent source-only listing of those columns.
                </p>
            </ProseSection>
            <ProseSection id="native-comparison" title="Choose literal sensitivity on the source">
                <p>
                    String Contains, Equals, StartsWith, and EndsWith ignore case and accents by
                    default, including canonical decompositions. Input joao matches Joao, JOAO,
                    João, JOÃO, and JoÃo. Declare strictLiteralSearch() or #[StrictLiteralSearch] on
                    the source for exact case, accent, composition, and boundary comparison. The
                    browser keeps sending the original text. It cannot select this policy.
                </p>
                <p>
                    SQL filters, counts, and pages remain in SQL. Strict SQL comparison uses
                    explicit binary or codepoint predicates. Default MySQL collation can equate
                    additional characters, such as ø and o, that Collection, SQLite, and PostgreSQL
                    folding do not equate. Ordering and finite filters retain their own contracts.
                    FullText retains engine parser and dictionary semantics under either literal
                    policy. The flag does not make FullText case-sensitive.
                </p>
                <p>
                    Use
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/literal-search').href"
                        >Choose literal search sensitivity</DocsLink
                    >
                    for default and strict fixtures, source configuration, actual SQLite execution,
                    and preview migration.
                </p>
            </ProseSection>
            <ProseSection id="observe" title="Inspect the fixed protocol requests">
                <p>
                    Send each request to compare the actual records and counts. Open
                    <strong>Request and response</strong> for the wire format. View source contains
                    the executable declaration and its fixture. Reset cancels a pending request.
                </p>
                <p>
                    These sources return <code>metadata.records.mode</code> as
                    <code>unidentified</code> and <code>metadata.channel</code> as
                    <code>null</code>. Trusted targets stay on the server. See the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/protocol/v2').href"
                        >version 2 protocol reference</DocsLink
                    >
                    for the response shape.
                </p>
            </ProseSection>
            <FieldDemo scenario="SearchContains" />
            <FieldDemo scenario="SearchEquals" />
            <FieldDemo scenario="SearchStarts" />
            <FieldDemo scenario="SearchEnds" />
        </div>
    </article>
</template>
