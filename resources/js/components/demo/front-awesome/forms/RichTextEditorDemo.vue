<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { RichTextEditor } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';

const initialValue = '<p>Release notes</p>';
const body = ref(initialValue);
const submitted = ref(null);

function submit(event) {
    submitted.value = new FormData(event.currentTarget).get('body');
}
</script>

<template>
    <form
        class="flex min-w-0 flex-col gap-4"
        data-docs-outline-exclude
        @submit.prevent="submit"
        @reset="submitted = null">
        <div class="min-w-0">
            <RichTextEditor
                v-model="body"
                :default-value="initialValue"
                name="body"
                label="Release notes"
                hint="Select text to format it."
                toolbar="bold italic"
                required />
        </div>
        <div class="min-w-0">
            <output class="break-words">Current HTML: {{ body }}</output>
        </div>
        <div v-if="submitted !== null" class="min-w-0">
            <output class="break-words">Submitted HTML: {{ submitted }}</output>
        </div>
        <div class="min-w-0">
            <div class="flex flex-wrap gap-2">
                <Button type="submit">Submit example</Button>
                <Button type="reset" appearance="plain">Reset editor</Button>
            </div>
        </div>
    </form>
</template>
