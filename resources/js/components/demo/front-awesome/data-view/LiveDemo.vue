<script setup>
import { computed, onScopeDispose, ref, shallowRef, watch } from 'vue';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import PreviewAvailability from './PreviewAvailability.vue';
import { fixtureRequest } from '../../dapter/live/request';
import { activeDemo, fixtureBusy as busy } from '../../dapter/live/session';
import LiveSession from './LiveSession.vue';
import owner from './LiveSession.vue?raw';
import frame from './LiveDemo.vue?raw';
import request from '../../dapter/live/request.js?raw';
import sessions from '../../dapter/live/session.js?raw';
import fixtureRoutes from '../../../../../../routes/demo.php?raw';
const props = defineProps({ mode: { type: String, required: true } });
const name = `data-view-${props.mode}`;
const running = computed(() => activeDemo.value === name);
const echo = shallowRef();
const failure = ref('');
let disposed = false;
function disconnect() {
    echo.value?.disconnect();
    echo.value = undefined;
}
onScopeDispose(() => {
    disposed = true;
    if (running.value) activeDemo.value = null;
    disconnect();
});
watch(
    running,
    (active) => {
        if (!active) disconnect();
    },
    { flush: 'sync' },
);
function stop() {
    activeDemo.value = null;
    disconnect();
    failure.value = '';
}
async function start() {
    if (busy.value) return;
    stop();
    busy.value = true;
    try {
        await fixtureRequest('start');
        if (disposed) return;
        if (props.mode === 'push') {
            const key = import.meta.env.VITE_REVERB_APP_KEY;
            const host = import.meta.env.VITE_REVERB_HOST;
            if (!key || !host)
                throw new Error(
                    'Configure the Reverb application key and host to start push delivery.',
                );
            const port = Number(import.meta.env.VITE_REVERB_PORT || 443);
            echo.value = new Echo({
                broadcaster: 'reverb',
                Pusher,
                key,
                wsHost: host,
                wsPort: port,
                wssPort: port,
                forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'https') === 'https',
                enabledTransports: ['ws', 'wss'],
            });
        }
        activeDemo.value = name;
    } catch (error) {
        disconnect();
        if (!disposed) failure.value = error.message;
    } finally {
        busy.value = false;
    }
}
const shared = import.meta.glob(
    [
        '../../../../../../app/Demo/Dapter/Live/*.php',
        '../../../../../../app/Demo/Dapter/Resources/{NotebookResource,ReaderResource}.php',
        '../../../../../../app/DataSources/Dapter/{LivePrivate,LiveIdentity,LiveArrival,LiveAttributes,LiveShorthand,LiveNative,LivePublic}.php',
        '../../../../../../app/DataSources/FrontAwesome/PollingNotebooks.php',
    ],
    { query: '?raw', import: 'default', eager: true },
);
const liveRoutes = fixtureRoutes.match(/Route::prefix\('demo\/dapter\/live'\)[\s\S]+?^\}\);/m)[0];
const sources = [
    {
        label: 'routes/web.php · live fixture',
        language: 'php',
        code: 'use Illuminate\\Support\\Facades\\Route;\n\n' + liveRoutes,
    },
    {
        label: 'AppServiceProvider.php · register the fixture',
        language: 'php',
        code: 'use App\\Demo\\Dapter\\Live\\Configuration;\n\npublic function boot(): void\n{\n    Configuration::register();\n}',
    },

    { label: 'LiveDemo.vue', language: 'vue', code: frame },
    { label: 'LiveSession.vue', language: 'vue', code: owner },
    { label: 'request.js', language: 'javascript', code: request },
    { label: 'session.js', language: 'javascript', code: sessions },
    ...Object.entries(shared).map(([path, code]) => ({
        label: path.split('/').at(-1),
        language: 'php',
        code,
    })),
];
</script>
<template>
    <DemoFrame
        :title="mode === 'polling' ? 'Poll fictional notebooks' : 'Receive a private replacement'"
        description="Start creates an isolated fictional reader. Stop disposes this owner."
        :sources="sources"
        :data-live-mode="mode"
        data-search-exclude>
        <PreviewAvailability>
            <div class="flex min-w-0 flex-col gap-4">
                <div class="flex flex-wrap gap-2">
                    <Button :disabled="busy || running" @click="start">Start example</Button
                    ><Button :disabled="busy || !running" @click="stop">Stop example</Button>
                </div>
                <p v-if="failure" role="alert">{{ failure }}</p>
                <LiveSession v-if="running" :mode="mode" :echo="echo" />
                <p v-else role="status">No live owner is running.</p>
            </div>
        </PreviewAvailability>
    </DemoFrame>
</template>
