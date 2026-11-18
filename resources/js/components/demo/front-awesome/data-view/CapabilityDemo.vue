<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import CapabilitySession from './CapabilitySession.vue';
import client from './CapabilitySession.vue?raw';
import source from '../../../../../../app/DataSources/Dapter/ComposedCatalog.php?raw';
const running = ref(false);
const sources = [
    { label: 'CapabilitySession.vue', language: 'vue', code: client },
    { label: 'ComposedCatalog.php', language: 'php', code: source },
];
</script>
<template>
    <DemoFrame
        data-testid="data-view-capabilities"
        title="Server capabilities and custom filters"
        description="Use built-in global search, header ordering, and order presets. The custom status filter receives the same full Dapter handle."
        :sources="sources"
        data-search-exclude>
        <div class="flex min-w-0 flex-col gap-4">
            <div>
                <Button @click="running = !running">{{
                    running ? 'Reset capabilities' : 'Start capabilities'
                }}</Button>
            </div>
            <CapabilitySession v-if="running" />
            <p v-else role="status">Start capabilities to request fictional records.</p>
        </div>
    </DemoFrame>
</template>
