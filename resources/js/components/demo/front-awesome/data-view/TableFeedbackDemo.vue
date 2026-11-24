<script setup>
import { ref } from 'vue';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import TableFeedbackSession from './TableFeedbackSession.vue';
import sessionSource from './TableFeedbackSession.vue?raw';
import notebooksSource from '../../../../../../app/DataSources/FrontAwesome/Notebooks.php?raw';
import emptySource from '../../../../../../app/DataSources/FrontAwesome/EmptyNotebooks.php?raw';

const source = ref(null);
const dataViewProps = DataView.props ?? {};
const available = (
    Array.isArray(dataViewProps) ? dataViewProps : Object.keys(dataViewProps)
).includes('stateLayout');
const sources = [
    { label: 'TableFeedbackSession.vue', language: 'vue', code: sessionSource },
    { label: 'app/DataSources/FrontAwesome/Notebooks.php', language: 'php', code: notebooksSource },
    {
        label: 'app/DataSources/FrontAwesome/EmptyNotebooks.php',
        language: 'php',
        code: emptySource,
    },
];
</script>

<template>
    <DemoFrame
        title="Notebook table feedback"
        data-testid="table-feedback"
        data-search-exclude
        :sources="sources">
        <div v-if="available" class="grid min-w-0 gap-4">
            <div class="flex flex-wrap gap-2">
                <Button
                    :disabled="source === 'FrontAwesome.Notebooks'"
                    @click="source = 'FrontAwesome.Notebooks'"
                    >Open notebook catalog</Button
                >
                <Button
                    appearance="outlined"
                    :disabled="source === 'FrontAwesome.EmptyNotebooks'"
                    @click="source = 'FrontAwesome.EmptyNotebooks'"
                    >Open empty catalog</Button
                >
            </div>
            <TableFeedbackSession v-if="source" :source="source" />
        </div>
        <p v-else>
            Table feedback requires Front Awesome beta.10 or later. Open the source panel to inspect
            the example.
        </p>
    </DemoFrame>
</template>
