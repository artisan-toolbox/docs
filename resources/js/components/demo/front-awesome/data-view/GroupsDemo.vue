<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import PreviewAvailability from './PreviewAvailability.vue';
import SelectionSession from './SelectionSession.vue';
import selectionSessionSource from './SelectionSession.vue?raw';
import notebooksSource from '../../../../../../app/DataSources/FrontAwesome/Notebooks.php?raw';
const running = ref(false);
const sources = [
    { label: 'SelectionSession.vue', language: 'vue', code: selectionSessionSource },
    { label: 'Notebooks.php', language: 'php', code: notebooksSource },
];
</script>
<template>
    <DemoFrame
        title="Pick notebooks by shelf"
        description="Select individual notebooks or every loaded row. The first four shelves remain A, A, B, A."
        :sources="sources"
        data-testid="data-view-groups"
        data-search-exclude>
        <PreviewAvailability>
            <div class="flex min-w-0 flex-col gap-4">
                <div>
                    <Button @click="running = !running">{{
                        running ? 'Stop example' : 'Start example'
                    }}</Button>
                </div>
                <SelectionSession v-if="running" mode="multiple" />
                <p v-else role="status">Start the example to read the fictional records.</p>
            </div>
        </PreviewAvailability>
    </DemoFrame>
</template>
