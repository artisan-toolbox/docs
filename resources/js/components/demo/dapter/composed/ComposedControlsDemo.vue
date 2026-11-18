<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import ComposedSession from './ComposedSession.vue';
import client from './ComposedSession.vue?raw';
import source from '../../../../../../app/DataSources/Dapter/ComposedCatalog.php?raw';
const running = ref(false);
const sources = [
    { label: 'ComposedSession.vue', language: 'vue', code: client },
    { label: 'ComposedCatalog.php', language: 'php', code: source },
];
</script>
<template>
    <DemoFrame
        title="Composed Vue controls"
        description="One protocol 2 owner controls four fictional rows. Reset disposes the owner. Read intent can be restored from the URL."
        :sources="sources"
        data-composed-controls
        data-search-exclude
        ><div class="flex min-w-0 flex-col gap-4">
            <div class="flex flex-wrap gap-2">
                <Button :disabled="running" @click="running = true">Start composed controls</Button
                ><Button variant="neutral" @click="running = false">Reset composed controls</Button>
            </div>
            <ComposedSession v-if="running" />
            <p v-else role="status">Ready. Start composed controls to read.</p>
        </div></DemoFrame
    >
</template>
