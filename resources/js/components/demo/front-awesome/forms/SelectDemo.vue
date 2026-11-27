<script setup>
import { ref } from 'vue';
import { Checkbox, Icon, Select } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const cityId = ref(1);
const strictSearch = ref(false);
const cityGroups = [
    {
        label: 'Northeast',
        options: [
            { id: 1, name: 'Salvador', icon: 'location-dot' },
            { id: 4, name: 'São Luís', icon: 'location-dot', disabled: true },
            { id: 3, name: 'Recife', icon: 'location-dot' },
        ],
    },
    {
        label: 'Southeast',
        options: [{ id: 2, name: 'São Paulo', icon: 'location-dot' }],
    },
];
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <Select
            v-model="cityId"
            label="City"
            :options="cityGroups"
            grouped
            option-value="id"
            option-label="name"
            :strict-search="strictSearch">
            <template #option="{ label, option }">
                <Icon slot="start" :name="option.icon" aria-hidden="true" />
                {{ label }}
            </template>
        </Select>
        <Checkbox v-model="strictSearch">Match case and accents</Checkbox>
        <output aria-live="polite">Selected city ID: {{ cityId }} ({{ typeof cityId }})</output>
    </div>
</template>
