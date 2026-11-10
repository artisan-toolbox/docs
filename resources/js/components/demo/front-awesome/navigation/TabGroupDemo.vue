<script setup>
import { ref } from 'vue';
import {
    TabGroup,
    Tab,
    TabPanel,
    Button,
} from '@artisan-toolbox/front-awesome/components/WebAwesome';
const active = ref('install');
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <TabGroup v-model:active="active">
                <Tab panel="install">Installation</Tab>
                <Tab panel="usage">Usage</Tab>
                <TabPanel name="install">Run Composer before npm.</TabPanel>
                <TabPanel name="usage">Import public Vue components.</TabPanel>
            </TabGroup>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="active = 'usage'">Open Usage tab</Button>
        </div>
        <div class="min-w-0">
            <output>Active tab: {{ active }}</output>
        </div>
    </div>
</template>
