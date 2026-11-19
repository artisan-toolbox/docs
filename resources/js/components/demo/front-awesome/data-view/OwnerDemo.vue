<script setup>
import { useRemember } from '@inertiajs/vue3';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import OwnerSession from './OwnerSession.vue';
import ownerSessionSource from './OwnerSession.vue?raw';
import vueCatalogSource from '../../../../../../app/DataSources/Dapter/VueCatalog.php?raw';
import fieldRecordsSource from '../../../../../../app/Demo/Dapter/Fields/FieldRecords.php?raw';
const session = useRemember({ running: false }, 'data-view-owner-consent');
const sources = [
    { label: 'OwnerSession.vue', language: 'vue', code: ownerSessionSource },
    { label: 'VueCatalog.php', language: 'php', code: vueCatalogSource },
    { label: 'FieldRecords.php', language: 'php', code: fieldRecordsSource },
];
</script>
<template>
    <DemoFrame
        title="One query, two views"
        description="Both views use the same URL namespace and accepted records."
        :sources="sources"
        data-testid="data-view-owner"
        data-search-exclude>
        <div class="flex min-w-0 flex-col gap-4">
            <div>
                <Button @click="session.running = !session.running">{{
                    session.running ? 'Stop example' : 'Start example'
                }}</Button>
            </div>
            <OwnerSession v-if="session.running" />
            <p v-else role="status">Start the example to read the fictional records.</p>
        </div>
    </DemoFrame>
</template>
