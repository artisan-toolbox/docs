<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import PreviewAvailability from './PreviewAvailability.vue';
import ContextSession from './ContextSession.vue';
import contextSessionSource from './ContextSession.vue?raw';
import contextOwnerSource from './ContextOwner.vue?raw';
import notebooksSource from '../../../../../../app/DataSources/FrontAwesome/Notebooks.php?raw';
import quickstartSource from '../../../../../../app/DataSources/Dapter/Quickstart.php?raw';
import collectionGateDenySource from '../../../../../../app/DataSources/Dapter/CollectionGateDeny.php?raw';
import collectionFixtureSource from '../../../../../../app/Demo/Dapter/Listing/CollectionFixture.php?raw';
import fixtureProductsSource from '../../../../../../app/Demo/Dapter/Listing/FixtureProducts.php?raw';
const running = ref(false);
import guestSetup from '../../../../../../app/Demo/Dapter/Listing/DemoConfiguration.php?raw';
const sources = [
    { label: 'DemoConfiguration.php', language: 'php', code: guestSetup },
    { label: 'ContextSession.vue', language: 'vue', code: contextSessionSource },
    { label: 'ContextOwner.vue', language: 'vue', code: contextOwnerSource },
    { label: 'Notebooks.php', language: 'php', code: notebooksSource },
    { label: 'Quickstart.php', language: 'php', code: quickstartSource },
    { label: 'CollectionGateDeny.php', language: 'php', code: collectionGateDenySource },
    { label: 'CollectionFixture.php', language: 'php', code: collectionFixtureSource },
    { label: 'FixtureProducts.php', language: 'php', code: fixtureProductsSource },
];
</script>
<template>
    <DemoFrame
        title="Scope preselection to an owner"
        description="Compare a retained parent value with the rows currently authorized by the mounted view."
        :sources="sources"
        data-testid="data-view-context"
        data-search-exclude>
        <PreviewAvailability>
            <div class="flex min-w-0 flex-col gap-4">
                <div>
                    <Button @click="running = !running">{{
                        running ? 'Stop example' : 'Start example'
                    }}</Button>
                </div>
                <ContextSession v-if="running" />
                <p v-else role="status">Start the example to read the fictional records.</p>
            </div>
        </PreviewAvailability>
    </DemoFrame>
</template>
