<script setup>
import { ref } from 'vue';
import { http } from '@inertiajs/core';
import { route } from 'ziggy-js';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import ActionSession from './ActionSession.vue';
import client from './ActionSession.vue?raw';
import definitions from './definitions.js?raw';
import sourceCode from '../../../../../../app/DataSources/Dapter/ActionCatalog.php?raw';
import externalCode from '../../../../../../app/Demo/Dapter/Actions/ExternalActions.php?raw';
import request from '../../../../../../app/Demo/Dapter/Actions/SaveRequest.php?raw';
import state from '../../../../../../app/Demo/Dapter/Actions/State.php?raw';
const extraSources = import.meta.glob(
    [
        '../../../../../../app/DataSources/Dapter/Action*.php',
        '../../../../../../app/Demo/Dapter/Actions/*.php',
    ],
    { query: '?raw', import: 'default', eager: true },
);
const props = defineProps({
    protocol: { type: Number, default: 1 },
    external: { type: Boolean, default: false },
    source: { type: String, default: null },
});
const running = ref(false),
    starting = ref(false),
    failure = ref(null);
const sources = [
    ...Object.entries(extraSources).map(([path, code]) => ({
        label: path.split('/').at(-1),
        language: 'php',
        code,
    })),
    { label: 'ActionSession.vue', language: 'vue', code: client },
    { label: 'definitions.js', language: 'js', code: definitions },
    { label: 'ActionCatalog.php', language: 'php', code: sourceCode },
    { label: 'ExternalActions.php', language: 'php', code: externalCode },
    { label: 'SaveRequest.php', language: 'php', code: request },
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
        failure.value = 'The isolated demo could not start.';
    } finally {
        starting.value = false;
    }
}
</script>
<template>
    <DemoFrame
        :title="external ? 'Dedicated action methods' : `Native actions with protocol ${protocol}`"
        description="Start resets only this session's fictional write counter and enables its demo Gate. Reader accounts and application records remain unchanged."
        :sources="sources"
        :data-action-demo="external ? 'external' : String(protocol)"
        data-search-exclude
        ><div class="flex min-w-0 flex-col gap-4">
            <div class="flex flex-wrap gap-2">
                <Button :disabled="running || starting" @click="start">Start action demo</Button
                ><Button variant="neutral" @click="running = false">Dispose action owner</Button>
            </div>
            <p v-if="failure" role="alert">{{ failure }}</p>
            <ActionSession
                v-if="running"
                :protocol="props.protocol"
                :external="props.external"
                :source="props.source" />
            <p v-else role="status">Ready. Start action demo to read its authorized controls.</p>
        </div></DemoFrame
    >
</template>
