<script setup>
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { ref } from 'vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import GetterSession from './GetterSession.vue';
import sessionSource from './GetterSession.vue?raw';

const running = ref(false);
const sources = [{ label: 'GetterSession.vue', language: 'vue', code: sessionSource }];
</script>

<template>
    <DemoFrame
        data-search-exclude
        data-dapter-getter
        title="Reactive source getter"
        description="A getter follows the active source. Changing it replaces the previous page with the new source's first page."
        :sources="sources">
        <div class="flex flex-col gap-4">
            <div class="flex flex-wrap gap-3">
                <Button :disabled="running" @click="running = true">Start example</Button>
                <Button variant="neutral" @click="running = false">Reset</Button>
            </div>
            <p v-if="!running" role="status" class="text-sm">
                Ready. Start the example to read the getter source.
            </p>
            <GetterSession v-if="running" />
        </div>
    </DemoFrame>
</template>
