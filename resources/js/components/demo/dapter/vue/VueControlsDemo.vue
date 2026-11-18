<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import ControlsSession from './ControlsSession.vue';
import session from './ControlsSession.vue?raw';
import controls from './FieldControls.vue?raw';
import rows from './RowsView.vue?raw';
import decoder from './catalog.js?raw';
import source from '../../../../../../app/DataSources/Dapter/VueCatalog.php?raw';
import records from '../../../../../../app/Demo/Dapter/Fields/FieldRecords.php?raw';
const running = ref(false);
const sources = [
    { label: 'ControlsSession.vue', language: 'vue', code: session },
    { label: 'FieldControls.vue', language: 'vue', code: controls },
    { label: 'RowsView.vue', language: 'vue', code: rows },
    { label: 'catalog.js', language: 'js', code: decoder },
    { label: 'VueCatalog.php', language: 'php', code: source },
    { label: 'FieldRecords.php', language: 'php', code: records },
];
</script>

<template>
    <DemoFrame
        title="Declared Vue controls"
        description="One protocol 2 owner supplies child controls, a table, and a grid. The four records are fictional. Search waits 250 ms; other actions include the latest search immediately."
        :sources="sources"
        data-vue-controls-demo
        data-search-exclude>
        <div class="flex min-w-0 flex-col gap-5">
            <div class="flex flex-wrap gap-2">
                <Button :disabled="running" @click="running = true">Start controls</Button
                ><Button variant="neutral" @click="running = false">Reset controls</Button>
            </div>
            <ControlsSession v-if="running" />
            <p v-else role="status">Ready. Start controls to load the catalog.</p>
        </div>
    </DemoFrame>
</template>
