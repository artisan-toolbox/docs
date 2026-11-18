<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import SourceSession from './SourceSession.vue';
import source from './SourceSession.vue?raw';
import decoder from './catalog.js?raw';
import controls from './FieldControls.vue?raw';
import rows from './RowsView.vue?raw';
import backend from '../../../../../../app/DataSources/Dapter/VueCatalog.php?raw';
import records from '../../../../../../app/Demo/Dapter/Fields/FieldRecords.php?raw';
const running = ref(false);
const sources = [
    { label: 'SourceSession.vue', language: 'vue', code: source },
    { label: 'catalog.js', language: 'js', code: decoder },
    { label: 'FieldControls.vue', language: 'vue', code: controls },
    { label: 'RowsView.vue', language: 'vue', code: rows },
    { label: 'VueCatalog.php', language: 'php', code: backend },
    { label: 'FieldRecords.php', language: 'php', code: records },
];
</script>

<template>
    <DemoFrame
        title="Narrow a component definition"
        description="The source-owned component validates rows separately, keeps only the name field, and permits only contains search. Its declared scroll region resets after a winning page change."
        :sources="sources"
        data-vue-definition-demo
        data-search-exclude>
        <div class="flex min-w-0 flex-col gap-5">
            <div class="flex flex-wrap gap-2">
                <Button :disabled="running" @click="running = true">Start definition</Button
                ><Button variant="neutral" @click="running = false">Reset definition</Button>
            </div>
            <SourceSession v-if="running" />
            <p v-else role="status">Ready. Start definition to load the narrowed catalog.</p>
        </div>
    </DemoFrame>
</template>
