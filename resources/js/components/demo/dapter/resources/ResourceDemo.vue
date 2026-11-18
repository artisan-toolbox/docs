<script setup>
import { computed, ref } from 'vue';
import { DataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
const props = defineProps({ scenario: { type: String, required: true } });
const running = ref(false);
const files = import.meta.glob('../../../../../../app/DataSources/Dapter/Resource*.php', {
    query: '?raw',
    import: 'default',
    eager: true,
});
const helpers = import.meta.glob('../../../../../../app/Demo/Dapter/Resources/*.php', {
    query: '?raw',
    import: 'default',
    eager: true,
});
const sources = computed(() =>
    [...Object.entries(files), ...Object.entries(helpers)].map(([path, code]) => ({
        label: path.split('/').at(-1),
        language: 'php',
        code,
    })),
);
</script>
<template>
    <DemoFrame
        :title="scenario"
        description="Project a raw fictional notebook through nested public JsonResource APIs. The default protocol stays version 1."
        :sources="sources"
        :data-resource-demo="scenario"
        data-search-exclude>
        <div class="flex min-w-0 flex-col gap-4">
            <div class="flex flex-wrap gap-2">
                <Button :disabled="running" @click="running = true">Start example</Button
                ><Button variant="neutral" @click="running = false">Reset example</Button>
            </div>
            <DataAdapter v-if="running" :source="`Dapter.${scenario}`" v-slot="view">
                <p v-if="view.error" role="alert">{{ view.error.message }}</p>
                <p v-for="row in view.data" :key="row.name" data-resource-row>
                    {{ row.name }}. Reader {{ row.details.selected }}. Nested
                    {{ row.related[0].selected }}. No ID or secret in projected data.
                </p>
            </DataAdapter>
            <p v-else role="status">Ready. Start example to project one fictional notebook.</p>
        </div>
    </DemoFrame>
</template>
