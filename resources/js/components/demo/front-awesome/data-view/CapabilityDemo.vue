<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import CapabilitySession from './CapabilitySession.vue';
import client from './CapabilitySession.vue?raw';
import source from '../../../../../../app/DataSources/Dapter/ComposedCatalog.php?raw';
import recordsSource from '../../../../../../app/Demo/Dapter/Composed/Records.php?raw';
import manyStatusesSource from '../../../../../../app/Demo/Dapter/Composed/ManyStatuses.php?raw';
import reverseOrderSource from '../../../../../../app/Demo/Dapter/Composed/ReverseOrder.php?raw';
import statusSource from '../../../../../../app/Demo/Dapter/Composed/Status.php?raw';
import statusFilterSource from '../../../../../../app/Demo/Dapter/Composed/StatusFilter.php?raw';
const running = ref(false);
const sources = [
    { label: 'Records.php', language: 'php', code: recordsSource },
    { label: 'ManyStatuses.php', language: 'php', code: manyStatusesSource },
    { label: 'ReverseOrder.php', language: 'php', code: reverseOrderSource },
    { label: 'Status.php', language: 'php', code: statusSource },
    { label: 'StatusFilter.php', language: 'php', code: statusFilterSource },

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
