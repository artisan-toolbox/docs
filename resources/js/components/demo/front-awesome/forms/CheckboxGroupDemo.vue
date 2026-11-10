<script setup>
import { ref } from 'vue';
import { CheckboxGroup, Checkbox } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const email = ref(false);
const dashboard = ref(false);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <CheckboxGroup label="Updates" hint="Choose one or both channels.">
                <Checkbox name="email" v-model="email">Email</Checkbox>
                <Checkbox name="dashboard" v-model="dashboard">Dashboard</Checkbox>
            </CheckboxGroup>
        </div>
        <div class="min-w-0">
            <output>Email: {{ email }}. Dashboard: {{ dashboard }}.</output>
        </div>
    </div>
</template>
