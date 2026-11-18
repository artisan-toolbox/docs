<script setup>
import { ref } from 'vue';
import { http } from '@inertiajs/core';
import { route } from 'ziggy-js';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import ActionSession from './ActionSession.vue';
import client from './ActionSession.vue?raw';
import orchestration from './ActionDemo.vue?raw';
import state from '../../../../../../app/Demo/Dapter/Actions/State.php?raw';
import definitions from '../../dapter/actions/definitions.js?raw';
import source from '../../../../../../app/DataSources/Dapter/ActionCatalog.php?raw';
const running = ref(false),
    starting = ref(false),
    failure = ref(null);
const sources = [
    { label: 'ActionDemo.vue', language: 'vue', code: orchestration },
    { label: 'ActionSession.vue', language: 'vue', code: client },
    { label: 'definitions.js', language: 'javascript', code: definitions },
    { label: 'ActionCatalog.php', language: 'php', code: source },
    { label: 'State.php', language: 'php', code: state },
];
async function start() {
    starting.value = true;
    failure.value = null;
    try {
        await http.getClient().request({
            method: 'post',
            url: route('demo.dapter.actions.start'),
            data: {},
            headers: { Accept: 'application/json' },
        });
        running.value = true;
    } catch {
        failure.value = 'The isolated demo could not start. Try again.';
    } finally {
        starting.value = false;
    }
}
</script>
<template>
    <DemoFrame
        data-testid="data-view-actions"
        title="Authorized actions in a slot"
        description="Start enables the isolated session Gate, resets its fictional counter, then reads notebooks. Save performs a fictional write only after you click it. Reload reads the confirmed counter. Reset only disposes the owner."
        :sources="sources"
        data-search-exclude>
        <div class="flex min-w-0 flex-col gap-4">
            <div class="flex flex-wrap gap-2">
                <Button :disabled="starting || running" @click="start">Start actions</Button>
                <Button variant="neutral" :disabled="starting || !running" @click="running = false"
                    >Reset actions</Button
                >
            </div>
            <p v-if="failure" role="alert">{{ failure }}</p>
            <ActionSession v-if="running" />
            <p v-else role="status">
                {{
                    starting
                        ? 'Starting the isolated action session.'
                        : 'Start actions to read available server-authorized operations.'
                }}
            </p>
        </div>
    </DemoFrame>
</template>
