<script setup>
import { DataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { computed, ref } from 'vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import CatalogView from './CatalogView.vue';
import { decodeProduct } from './products';
import coverage from '../../../../../../app/Demo/Dapter/Listing/coverage.json';
import configurationSource from '../../../../../../config/dapter.php?raw';
import collectionSource from '../../../../../../app/Demo/Dapter/Listing/CollectionFixture.php?raw';
import inheritedSource from '../../../../../../app/Demo/Dapter/Listing/InheritedCollectionFixture.php?raw';
import fixtureSource from '../../../../../../app/Demo/Dapter/Listing/FixtureProducts.php?raw';
import sqliteSource from '../../../../../../app/Demo/Dapter/Listing/SqliteFixture.php?raw';
import modelSource from '../../../../../../app/Demo/Dapter/Listing/FixtureProduct.php?raw';
import accessSource from '../../../../../../app/Demo/Dapter/Listing/DemoConfiguration.php?raw';

const props = defineProps({
    scenario: { type: String, required: true },
});
const declarations = import.meta.glob('../../../../../../app/DataSources/Dapter/*.php', {
    query: '?raw',
    import: 'default',
    eager: true,
});
const running = ref(false);
const example = computed(() => coverage.cases.find((item) => item.id === props.scenario));
const sources = computed(() => {
    const item = example.value;
    const source = [
        {
            label: `${item.id}.php`,
            language: 'php',
            code: declarations[`../../../../../../app/DataSources/Dapter/${item.id}.php`],
        },
    ];
    if (item.id !== 'Quickstart') {
        if (!['CollectionRaw', 'SqliteProducts'].includes(item.id))
            source.push({
                label: 'CollectionFixture.php',
                language: 'php',
                code: collectionSource,
            });
        source.push({ label: 'FixtureProducts.php', language: 'php', code: fixtureSource });
    }
    if (item.id === 'CollectionOverride')
        source.push({
            label: 'InheritedCollectionFixture.php',
            language: 'php',
            code: inheritedSource,
        });
    if (item.id === 'SqliteProducts')
        source.push(
            { label: 'SqliteFixture.php', language: 'php', code: sqliteSource },
            { label: 'FixtureProduct.php', language: 'php', code: modelSource },
        );
    if (
        item.guide.startsWith('dapter/access') ||
        ['CollectionAttributes', 'CollectionEmptyBaseline', 'CollectionDefaults'].includes(item.id)
    )
        source.push({ label: 'DemoConfiguration.php', language: 'php', code: accessSource });
    if (['CollectionDefaults', 'CollectionConfiguredGuard'].includes(item.id))
        source.push({
            label: 'dapter.php (documentation fixture)',
            language: 'php',
            code: configurationSource,
        });
    source.push({
        label: 'Read the fixed source.vue',
        language: 'vue',
        code: `<script setup>\nimport { DataAdapter } from '@artisan-toolbox/dapter';\nimport { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';\n\x3C/script>\n\n<template>\n    <DataAdapter source="${item.source}" v-slot="adapter">\n        <p v-if="adapter.paging.loading">Loading...</p>\n        <p v-if="adapter.error" role="alert">{{ adapter.error.message }}</p>\n        <pre v-if="adapter.ready">{{ adapter.data }}</pre>\n        <Button :disabled="!adapter.paging.has_next" @click="adapter.paging.goToNext()">Next page</Button>\n    </DataAdapter>\n</template>`,
    });
    return source;
});
</script>

<template>
    <DemoFrame
        data-search-exclude
        :data-dapter-scenario="example.id"
        :title="example.label"
        :description="example.description"
        :sources="sources">
        <div class="flex min-w-0 flex-col gap-5">
            <p class="text-sm text-slate-600 dark:text-slate-400">
                Expected result.
                <template v-if="example.expected.status === 200">
                    {{ example.expected.per_page }} rows on page 1 of
                    {{ Math.ceil(23 / example.expected.per_page) }}. Allowed sizes
                    {{ example.expected.options.join(', ') }}. Total 23.
                </template>
                <template v-else
                    >Access error {{ example.expected.status }}. No rows or counts are
                    returned.</template
                >
            </p>
            <div class="flex flex-wrap gap-3">
                <Button :disabled="running" @click="running = true">Start example</Button>
                <Button variant="neutral" @click="running = false">Reset</Button>
            </div>
            <p v-if="!running" role="status" class="text-sm text-slate-600 dark:text-slate-400">
                Ready. Start the example to request its first page.
            </p>
            <DataAdapter
                v-if="running"
                :source="example.source"
                :id="example.id"
                :decode-row="decodeProduct"
                v-slot="adapter">
                <CatalogView :adapter="adapter" />
            </DataAdapter>
        </div>
    </DemoFrame>
</template>
