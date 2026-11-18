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
use ArtisanToolbox\\Dapter\\Enums\\SortType;
use ArtisanToolbox\\Dapter\\StoreOptions;

final class VueCatalog extends FieldRecords implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(2)->pageSizeOptions([2, 4])
            ->orderableField('name', [SortType::Natural]);
    }
}`;
const binding = `<script setup>
import { DataAdapter } from '@artisan-toolbox/dapter';
import { Select, Option } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <DataAdapter source="Dapter.VueCatalog" :protocol="2" :url="false" v-slot="catalog">
        <Select v-if="catalog.fields?.name?.order" label="Name order"
            :model-value="catalog.fields.name.order.current?.direction ?? ''"
            @update:model-value="catalog.fields.name.order.call({ direction: $event, sortType: 'natural', multiSort: false })">
            <Option v-for="direction in catalog.fields.name.order.available.directions"
                :key="direction" :value="direction">{{ direction === 'asc' ? 'Ascending' : 'Descending' }}</Option>
        </Select>
        <ul><li v-for="row in catalog.data" :key="row.id">{{ row.name }}</li></ul>
    </DataAdapter>
</template>`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Sort names in natural order">
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
                    Select <strong>Start example</strong>. Choose <strong>Ascending</strong>.
                    Natural sorting puts Notebook 2 before Notebook 10 (IDs 2 and 1). Clear order
                    restores the original order (IDs 1 and 2).
                </p>
            </ProseSection>
            <FieldUsageDemo task="sort" />
            <ProseSection id="declaration-details" title="Declaration details">
                <p>
                    Call orderableField with a public field name, its allowed SortType values, and
                    allowed SortDirection values. Native and both ascending and descending
                    directions are the defaults. Pass valueType when the comparison needs a scalar
                    contract. All behaviors remain server-owned.
                </p>
                <p>
                    SQL Native ordering accepts verified scalar and temporal column families,
                    including native UUID ordering. Native JSON and unverified custom types fail
                    configuration before counts or pages. SQLite JSON stored as text follows its
                    ordinary native text order. Source-only reads remain available without an order
                    declaration.
                </p>
                <p>
                    Version 2 accepts one field ordering term by default. Declare multiOrder to
                    permit a bounded priority list. Collections support declared Native, Regular,
                    String, Natural, and Numeric comparisons. Ordinary SQL drivers initially
                    advertise only Native. Unsupported declarations fail configuration. A selected
                    SQL order retains the model key as a deterministic tie-breaker. Default
                    requested order preserves the source order. The multiple-order guide covers
                    additive terms, fixed prefixes, unique identity ties, and opaque global presets.
                    Explicit Locale sorting is available for String Collections in offset and simple
                    paging. Follow
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/collection-comparisons').href"
                        >Compare Collection values</DocsLink
                    >
                    for intl prerequisites, Unicode behavior, and equivalent declarations.
                </p>
            </ProseSection>
            <ProseSection id="native-nulls" title="Preserve native null placement">
                <p>
                    SQL Native order follows the database's null placement and comparison rules.
                    SQLite 3.45.2 and MySQL 8.4.11 place null before nonnull values in ascending
                    order and after them in descending order. PostgreSQL 18.6 places null after
                    nonnull values in ascending order and before them in descending order.
                    Collection ordering puts null first ascending and last descending. Dapter does
                    not silently replace those native SQL semantics.
                </p>
                <p>
                    For equal selected values, SQL adds the model key ascending as a tie-breaker.
                    Collections retain their original ordinal, including rows without IDs. An
                    ordinary model query with no source order falls back to its qualified primary
                    key ascending. Existing simple source orders survive default requests. A
                    selected public field order replaces the source order and appends its key
                    tie-breaker.
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
            <FieldDemo scenario="OrderString" />
            <FieldDemo scenario="OrderNatural" />
            <FieldDemo scenario="OrderNumeric" />
            <FieldDemo scenario="OrderInvalid" />
        </div>
    </article>
</template>
