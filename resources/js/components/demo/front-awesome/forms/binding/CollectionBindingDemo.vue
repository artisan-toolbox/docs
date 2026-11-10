<script setup>
import { useForm } from '@inertiajs/vue3';
import {
    Button,
    Option,
    Select,
    TagInput,
} from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { FileInput } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';

/** @type {{ country: string | null, topics: string[], attachments: File[] }} */
const initial = { country: 'br', topics: ['docs'], attachments: [] };
const form = useForm(initial);

function showErrors() {
    form.setError({
        country: 'Choose a destination country.',
        topics: 'Add a second topic.',
        attachments: 'Choose at least one local file.',
    });
}
</script>

<template>
    <div class="flex min-w-0 flex-col gap-5" data-docs-outline-exclude>
        <div class="min-w-0">
            <Select :form="form" field="country" label="Country" with-clear
                ><Option value="br">Brazil</Option><Option value="pt">Portugal</Option
                ><Option value="ca">Canada</Option></Select
            >
        </div>
        <div class="min-w-0">
            <TagInput
                :form="form"
                field="topics"
                label="Topics"
                hint="Type a topic and press Enter." />
        </div>
        <div class="min-w-0">
            <FileInput :form="form" field="attachments" label="Local attachments" multiple />
        </div>
        <div class="flex flex-wrap gap-2">
            <Button
                type="button"
                @click="
                    form.country = 'pt';
                    form.topics = ['vue', 'forms'];
                "
                >Use Portugal and two topics</Button
            >
            <Button type="button" @click="showErrors">Simulate collection errors</Button>
            <Button type="button" appearance="plain" @click="form.clearErrors()"
                >Clear collection errors</Button
            >
            <Button type="button" appearance="plain" @click="form.reset()"
                >Reset collection values</Button
            >
        </div>
        <output class="text-sm break-words"
            >Country: {{ form.country ?? 'none' }}. Topics: {{ form.topics.join(', ') || 'none' }}.
            Files: {{ form.attachments.map((file) => file.name).join(', ') || 'none' }}.</output
        >
        <p class="text-sm text-slate-500 dark:text-slate-400">
            Files stay in this browser. This demo does not submit or upload them.
        </p>
    </div>
</template>
