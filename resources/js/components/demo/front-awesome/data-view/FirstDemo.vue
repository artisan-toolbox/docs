<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import FirstTable from './FirstTable.vue';
import firstTableSource from './FirstTable.vue?raw';
import quickstartSource from '../../../../../../app/DataSources/Dapter/Quickstart.php?raw';
const running = ref(false);
const sources = [
    { label: 'FirstTable.vue', language: 'vue', code: firstTableSource },
    { label: 'Quickstart.php', language: 'php', code: quickstartSource },
];
</script>
<template>
    <DemoFrame
        title="Your first notebook table"
        description="Start to read the first ten notebooks. Next reads notebooks 11 through 20."
        :sources="sources"
        data-testid="data-view-first"
        data-search-exclude>
        <div class="flex min-w-0 flex-col gap-4">
            <div>
                <Button @click="running = !running">{{
                    running ? 'Stop example' : 'Start example'
                }}</Button>
            </div>
            <FirstTable v-if="running" />
            <p v-else role="status">Start the example to read the fictional records.</p>
        </div>
    </DemoFrame>
</template>
