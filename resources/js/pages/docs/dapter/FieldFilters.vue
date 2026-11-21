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
use ArtisanToolbox\\Dapter\\StoreOptions;

final class VueCatalog extends FieldRecords implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(2)->pageSizeOptions([2, 4])
            ->filterableField('category', 'category', ['paper', 'tools']);
    }
}`;
const binding = `<script setup>
import { DataAdapter } from '@artisan-toolbox/dapter';
import { Select, Option } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <DataAdapter source="Dapter.VueCatalog" :protocol="2" :url="false" v-slot="catalog">
        <Select v-if="catalog.fields?.category?.filters?.category" label="Category"
            :model-value="catalog.fields.category.filters.category.current?.value ?? ''"
            @update:model-value="catalog.fields.category.filters.category.call({ value: $event })">
            <Option v-for="category in catalog.fields.category.filters.category.available.values"
                :key="category" :value="category">{{ category }}</Option>
        </Select>
        <ul><li v-for="row in catalog.data" :key="row.id">{{ row.name }}</li></ul>
    </DataAdapter>
</template>`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Filter by category">
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
                    Select <strong>Start example</strong>. Choose <strong>tools</strong> to see
                    Pencil 100%_! and Pencil case (IDs 3 and 4). Clear category restores both
                    notebooks (IDs 1 and 2).
                </p>
                <p>
                    The Front Awesome workspace preview also supplies a standalone editor. Pass the
                    field name and its filter ID to <code>DataViewFilter</code>, for example
                    <code>field="category" filter="category"</code>. Omit the field for a global
                    filter. The control preserves the advertised scalar types and multiple-selection
                    policy. See the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'front-awesome/data-view/layouts').href +
                            '#compose-controls'
                        "
                        >standalone control example</DocsLink
                    >
                    for a borrowed adapter in a sidebar.
                </p>
            </ProseSection>
            <FieldUsageDemo task="filter" />
            <ProseSection id="declaration-details" title="Declaration details">
                <p>
                    Call filterableField('category', 'category', ['paper', 'tools']). The second
                    argument is the filter ID within that field. Set multiple: true for list
                    selections. Homogeneous options infer String, Integer, or Boolean. Declare
                    Number explicitly when combining integral and fractional values.
                </p>
                <p>
                    Each selected value must occur in the advertised options with the declared type.
                    Multiple filters and searches are combined with AND. The default
                    EmptySelectionPolicy::Clear turns an empty multiple list into an inactive
                    selection. EmptySelectionPolicy::Reject returns HTTP 422 instead. Neither an
                    unknown ID nor a client target can add a server capability.
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
            <FieldDemo scenario="FilterSingle" />
            <FieldDemo scenario="FilterMultiple" />
            <FieldDemo scenario="FilterClear" />
            <FieldDemo scenario="FilterBoolean" />
        </div>
    </article>
</template>
