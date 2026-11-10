<script setup>
import { ref } from 'vue';
import { Combobox } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button, Option } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const value = ref('core');
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Combobox label="Package" v-model="value">
                <Option value="core">Core</Option>
                <Option value="front-awesome">Front Awesome</Option>
                <Option value="mosaicast">Mosaicast</Option>
            </Combobox>
        </div>
        <div class="min-w-0">
            <output>Selected package: {{ value }}</output>
        </div>
    </div>
</template>
