<script setup>
import { ref, useTemplateRef } from 'vue';
import { Stepper, Step, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const stepper = useTemplateRef('stepper');
const active = ref('install');
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Stepper ref="stepper" v-model:active="active" label="Package setup">
                <Step name="install">Install</Step>
                <Step name="configure">Configure</Step>
                <Step name="verify">Verify</Step>
            </Stepper>
        </div>
        <div class="min-w-0">
            <div class="flex gap-2">
                <Button @click="stepper.$el.previous()">Previous</Button>
                <Button @click="stepper.$el.next()">Next</Button>
            </div>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="active = 'verify'">Go to Verify step</Button>
        </div>
        <div class="min-w-0">
            <output>Active step: {{ active }}</output>
        </div>
    </div>
</template>
