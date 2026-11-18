<script setup>
import { useRemember } from '@inertiajs/vue3';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import NavigationOwner from './NavigationOwner.vue';
import owner from './NavigationOwner.vue?raw';
import controls from './FieldControls.vue?raw';
import rows from './RowsView.vue?raw';
import decoder from './catalog.js?raw';
import backend from '../../../../../../app/DataSources/Dapter/VueCatalog.php?raw';
import records from '../../../../../../app/Demo/Dapter/Fields/FieldRecords.php?raw';
const session = useRemember({ running: false }, 'dapter-vue-navigation-consent');
import frame from './VueNavigationDemo.vue?raw';
const sources = [
    { label: 'VueNavigationDemo.vue', language: 'vue', code: frame },
    { label: 'NavigationOwner.vue', language: 'vue', code: owner },
    { label: 'FieldControls.vue', language: 'vue', code: controls },
    { label: 'RowsView.vue', language: 'vue', code: rows },
    { label: 'catalog.js', language: 'js', code: decoder },
    { label: 'VueCatalog.php', language: 'php', code: backend },
    { label: 'FieldRecords.php', language: 'php', code: records },
];
</script>

<template>
    <DemoFrame
        title="Independent saved catalogs"
        description="Two fixed-source owners use separate URL namespaces and scroll regions. Start grants this history entry permission to load. Inertia remembers that choice across Back and Forward. After a full reload, start again to restore the saved URL state. Dispose clears the remembered choice."
        :sources="sources"
        data-vue-navigation-demo
        data-search-exclude>
        <div class="flex min-w-0 flex-col gap-5">
            <div class="flex flex-wrap gap-2">
                <Button :disabled="session.running" @click="session.running = true"
                    >Start saved catalogs</Button
                ><Button variant="neutral" @click="session.running = false"
                    >Dispose saved catalogs</Button
                >
            </div>
            <template v-if="session.running"
                ><NavigationOwner identity="reading" /><NavigationOwner identity="comparison"
            /></template>
            <p v-else role="status">Ready. Start saved catalogs to restore their URL state.</p>
        </div>
    </DemoFrame>
</template>
