<script setup>
import { computed, ref } from 'vue';
import { http } from '@inertiajs/core';
import { route } from 'ziggy-js';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import fixtureRoutes from '../../../../../../routes/demo.php?raw';
import PagingSession from './PagingSession.vue';
import client from './PagingSession.vue?raw';
import frame from './PagingDemo.vue?raw';
const props = defineProps({
    title: { type: String, required: true },
    source: { type: String, required: true },
    infinite: Boolean,
    observed: Boolean,
});
const running = ref(false);
const starting = ref(false);
const error = ref('');
const files = import.meta.glob(
    [
        '../../../../../../app/DataSources/Dapter/{PagingSimple,PagingCursor,PagingCounts,PagingRecovery,InfiniteSimple,InfiniteRecovery}.php',
        '../../../../../../app/Demo/Dapter/Paging/{Records,State,DemonstrationClock}.php',
        '../../../../../../app/Demo/Dapter/Infinite/State.php',
    ],
    { query: '?raw', import: 'default', eager: true },
);
const sources = computed(() => {
    const source = props.source.split('.').at(-1);
    const fixture = { PagingRecovery: 'paging', InfiniteRecovery: 'infinite' }[source];
    const setup = fixture
        ? [
              {
                  label: 'routes/web.php · session routes',
                  language: 'php',
                  code:
                      'use Illuminate\\Support\\Facades\\Route;\n\n' +
                      fixtureRoutes
                          .split('\n')
                          .filter((line) =>
                              line.startsWith("Route::post('demo/dapter/" + fixture + '/'),
                          )
                          .join('\n'),
              },
              ...(source === 'PagingRecovery'
                  ? [
                        {
                            label: 'bootstrap/app.php · web middleware',
                            language: 'php',
                            code: 'use App\\Demo\\Dapter\\Paging\\DemonstrationClock;\nuse Illuminate\\Foundation\\Configuration\\Middleware;\n\n// Inside the existing withMiddleware callback:\n$middleware->web(append: [DemonstrationClock::class]);',
                        },
                    ]
                  : []),
          ]
        : [];
    return [
        ...setup,
        { label: 'PagingDemo.vue', language: 'vue', code: frame },
        { label: 'PagingSession.vue', language: 'vue', code: client },
        ...Object.entries(files)
            .filter(
                ([path]) =>
                    path.endsWith('/' + source + '.php') ||
                    path.endsWith('/PagingSimple.php') ||
                    path.endsWith('/Paging/Records.php') ||
                    (source.startsWith('Paging') &&
                        source !== 'PagingSimple' &&
                        path.endsWith('/PagingCursor.php')) ||
                    (source === 'PagingRecovery' &&
                        /Paging\/(State|DemonstrationClock)\.php$/.test(path)) ||
                    (source === 'InfiniteRecovery' && path.endsWith('/Infinite/State.php')),
            )
            .map(([path, code]) => ({ label: path.split('/').at(-1), language: 'php', code })),
    ];
});
async function toggle() {
    if (running.value) {
        running.value = false;
        return;
    }
    starting.value = true;
    error.value = '';
    try {
        const reset = {
            'Dapter.PagingRecovery': 'demo.dapter.paging.reset',
            'Dapter.InfiniteRecovery': 'demo.dapter.infinite.reset',
        }[props.source];
        if (reset)
            await http.getClient().request({
                method: 'post',
                url: route(reset),
                data: {},
                headers: { Accept: 'application/json' },
            });
        running.value = true;
    } catch {
        error.value = 'Cannot initialize the fictional session. Try again.';
    } finally {
        starting.value = false;
    }
}
</script>
<template>
    <DemoFrame
        :data-paging-demo="observed ? 'observed' : source"
        :title="title"
        description="Start the fixed source to read its first page."
        :sources="sources"
        data-search-exclude>
        <div class="flex min-w-0 flex-col gap-4">
            <div>
                <Button :disabled="starting" @click="toggle">{{
                    running ? 'Reset traversal' : 'Start traversal'
                }}</Button>
            </div>
            <p v-if="error" role="alert">{{ error }}</p>
            <PagingSession
                v-if="running"
                :source="source"
                :infinite="infinite"
                :observed="observed" />
            <p v-else role="status">No traversal source is running.</p>
        </div>
    </DemoFrame>
</template>
