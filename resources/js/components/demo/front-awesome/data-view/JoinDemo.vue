<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import PreviewAvailability from './PreviewAvailability.vue';
import SelectionSession from './SelectionSession.vue';
import selectionSessionSource from './SelectionSession.vue?raw';
import composedJoinSource from '../../../../../../app/DataSources/Dapter/ComposedJoin.php?raw';
import sqliteRecordsSource from '../../../../../../app/Demo/Dapter/Composed/SqliteRecords.php?raw';
import sqliteLineSource from '../../../../../../app/Demo/Dapter/Composed/SqliteLine.php?raw';
const running = ref(false);
const sources = [
    { label: 'SelectionSession.vue', language: 'vue', code: selectionSessionSource },
    { label: 'ComposedJoin.php', language: 'php', code: composedJoinSource },
    { label: 'SqliteRecords.php', language: 'php', code: sqliteRecordsSource },
    { label: 'SqliteLine.php', language: 'php', code: sqliteLineSource },
];
</script>
<template>
    <DemoFrame
        title="Pick one order line"
        description="Both Notebook lines identify different occurrences in the joined result."
        :sources="sources"
        data-testid="data-view-join"
        data-search-exclude>
        <PreviewAvailability>
            <div class="flex min-w-0 flex-col gap-4">
                <div>
                    <Button @click="running = !running">{{
                        running ? 'Stop example' : 'Start example'
                    }}</Button>
                </div>
                <SelectionSession v-if="running" mode="single" />
                <p v-else role="status">Start the example to read the fictional records.</p>
            </div>
        </PreviewAvailability>
    </DemoFrame>
</template>
