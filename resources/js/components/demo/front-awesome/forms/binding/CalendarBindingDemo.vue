<script setup>
import { useForm } from '@inertiajs/vue3';
import { nextTick, useTemplateRef, watch } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { DateInput, DatePicker } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';

const form = useForm({ date: '2026-01-15' });
const calendar = useTemplateRef('calendar');

watch(
    () => form.date,
    async () => {
        await nextTick();
        await customElements.whenDefined('wa-date-picker');
        const element = calendar.value?.$el;
        if (form.date && element?.isConnected) element.goToDate(form.date);
    },
    { immediate: true },
);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-5" data-docs-outline-exclude>
        <div class="min-w-0">
            <DateInput
                :form="form"
                field="date"
                label="Delivery date"
                hint="Both controls share the same form field." />
        </div>
        <div class="min-w-0">
            <DatePicker ref="calendar" :form="form" field="date" class="max-w-full" />
        </div>
        <div class="flex flex-wrap gap-2">
            <Button type="button" @click="form.date = '2026-02-20'">Use February 20</Button>
            <Button
                type="button"
                @click="form.setError('date', 'Choose an available delivery date.')"
                >Simulate date error</Button
            >
            <Button type="button" appearance="plain" @click="form.clearErrors('date')"
                >Clear date error</Button
            >
            <Button type="button" appearance="plain" @click="form.reset()">Reset date</Button>
        </div>
        <output class="text-sm break-words">Delivery date: {{ form.date || 'none' }}.</output>
    </div>
</template>
