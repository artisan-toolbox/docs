<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import PressScheduleSession from './PressScheduleSession.vue';
import client from './PressScheduleSession.vue?raw';
import source from '../../../../../../app/DataSources/FrontAwesome/PressSchedule.php?raw';

const started = ref(false);
const sources = [
    { label: 'PressScheduleSession.vue', language: 'vue', code: client },
    { label: 'app/DataSources/FrontAwesome/PressSchedule.php', language: 'php', code: source },
];
</script>

<template>
    <DemoFrame
        title="Press schedule"
        data-testid="press-schedule"
        data-search-exclude
        :sources="sources">
        <PressScheduleSession v-if="started" />
        <Button v-else variant="brand" @click="started = true">Open the press schedule</Button>
    </DemoFrame>
</template>
