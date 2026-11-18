<script setup>
import { ref } from 'vue';
import { OtpInput, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const initialValue = '';
const value = ref(initialValue);
const submitted = ref('');

function resetExample() {
    value.value = initialValue;
    submitted.value = '';
}
</script>

<template>
    <form
        id="otp-example-form"
        method="post"
        class="flex min-w-0 flex-col gap-4"
        data-docs-outline-exclude
        @submit.prevent="submitted = value"
        @reset="resetExample">
        <div class="min-w-0">
            <OtpInput
                id="otp-example-code"
                name="verification_code"
                label="Verification code"
                autocomplete="one-time-code"
                type="numeric"
                v-model="value"
                :length="6"
                required />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">Current value: {{ value }}</output>
        </div>
        <div v-if="submitted" class="min-w-0">
            <output aria-live="polite"
                >Submitted code: {{ submitted }}. No request was sent.</output
            >
        </div>
        <div class="min-w-0">
            <div class="flex flex-wrap gap-2">
                <Button type="submit">Submit example</Button>
                <Button type="reset" appearance="plain">Reset</Button>
            </div>
        </div>
    </form>
</template>
