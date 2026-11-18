<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import PagingSession from './PagingSession.vue';
import client from './PagingSession.vue?raw';
const props = defineProps({
    title: { type: String, required: true },
    source: { type: String, required: true },
    infinite: Boolean,
});
const running = ref(false);
const sources = [{ label: 'PagingSession.vue', language: 'vue', code: client }];
</script>
<template>
    <DemoFrame
        :data-paging-demo="source"
        :title="title"
        description="Start this fixed source to inspect its negotiated paging controls. Unknown totals remain unknown."
        :sources="sources"
        data-search-exclude>
        <div class="flex min-w-0 flex-col gap-4">
            <div>
                <Button @click="running = !running">{{
                    running ? 'Reset traversal' : 'Start traversal'
                }}</Button>
            </div>
            <PagingSession v-if="running" :source="props.source" :infinite="infinite" />
            <p v-else role="status">No traversal source is running.</p>
        </div>
    </DemoFrame>
</template>
