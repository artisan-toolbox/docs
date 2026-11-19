<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import DataViewSession from './DataViewSession.vue';
import client from './DataViewSession.vue?raw';
import catalog from './catalog.js?raw';
import collectionFluentSource from '../../../../../../app/DataSources/Dapter/CollectionFluent.php?raw';
import collectionGateDenySource from '../../../../../../app/DataSources/Dapter/CollectionGateDeny.php?raw';
import collectionFixtureSource from '../../../../../../app/Demo/Dapter/Listing/CollectionFixture.php?raw';
import fixtureProductsSource from '../../../../../../app/Demo/Dapter/Listing/FixtureProducts.php?raw';
import guestSetup from '../../../../../../app/Demo/Dapter/Listing/DemoConfiguration.php?raw';
const source = ref(null);
const sources = [
    { label: 'DemoConfiguration.php', language: 'php', code: guestSetup },
    { label: 'CollectionFluent.php', language: 'php', code: collectionFluentSource },
    { label: 'CollectionGateDeny.php', language: 'php', code: collectionGateDenySource },
    { label: 'CollectionFixture.php', language: 'php', code: collectionFixtureSource },
    { label: 'FixtureProducts.php', language: 'php', code: fixtureProductsSource },

    { label: 'DataViewSession.vue', language: 'vue', code: client },
    { label: 'catalog.js', language: 'javascript', code: catalog },
];
</script>

<template>
    <DemoFrame
        data-testid="data-view-demo"
        data-search-exclude
        title="Notebook catalog"
        description="Start the catalog, then compare the same accepted page in table, grid, and list layouts."
        :sources="sources">
        <div class="flex min-w-0 flex-col gap-4">
            <div class="flex flex-wrap gap-2">
                <template v-if="!source">
                    <Button variant="brand" @click="source = 'Dapter.CollectionFluent'"
                        >Start catalog</Button
                    >
                    <Button
                        variant="neutral"
                        appearance="outlined"
                        @click="source = 'Dapter.CollectionGateDeny'"
                        >Try denied source</Button
                    >
                </template>
                <Button v-else variant="neutral" size="s" @click="source = null">Reset</Button>
            </div>
            <DataViewSession v-if="source" :source="source" />
            <p v-else role="status" class="text-sm">No source is running.</p>
        </div>
    </DemoFrame>
</template>
