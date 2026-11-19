<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import PreviewAvailability from './PreviewAvailability.vue';
import QuerySession from './QuerySession.vue';
import querySessionSource from './QuerySession.vue?raw';
import notebooksSource from '../../../../../../app/DataSources/FrontAwesome/Notebooks.php?raw';
const running = ref(false);
const sources = [
    { label: 'QuerySession.vue', language: 'vue', code: querySessionSource },
    { label: 'Notebooks.php', language: 'php', code: notebooksSource },
];
</script>
<template>
    <DemoFrame
        title="Find a notebook by stock mark"
        description="Select a typed stock mark, then open the requested criteria to see its JSON value."
        :sources="sources"
        data-testid="data-view-query"
        data-search-exclude>
        <PreviewAvailability>
            <div class="flex min-w-0 flex-col gap-4">
                <div>
                    <Button @click="running = !running">{{
                        running ? 'Stop example' : 'Start example'
                    }}</Button>
                </div>
                <QuerySession v-if="running" />
                <p v-else role="status">Start the example to read the fictional records.</p>
            </div>
        </PreviewAvailability>
    </DemoFrame>
</template>
