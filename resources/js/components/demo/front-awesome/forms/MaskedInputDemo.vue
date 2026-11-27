<script setup>
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import Button from '@artisan-toolbox/front-awesome/components/Button.vue';
import { MaskedInput } from '@artisan-toolbox/front-awesome';

const postalCode = ref('');
const identificationForm = useForm({ taxId: '' });
const phone = ref('');
const reference = ref('');
const submission = ref('');

const documentMasks = ['###.###.###-##', 'XX.XXX.XXX/XXXX-##'];
const documentTokens = {
    X: { accept: /[A-Z0-9]/, transform: (character) => character.toUpperCase() },
};
const referenceMask = {
    parts: [
        { accept: /[0-9A-Za-z]/, transform: (character) => character.toUpperCase() },
        '.',
        /b/,
        { optional: ['-', /[0-9]/, /[0-9]/] },
    ],
};

function phoneMask(proposed) {
    return proposed.replace(/\D/g, '').length > 10 ? '(##) #####-####' : '(##) ####-####';
}

function previewSubmission(event) {
    const data = new FormData(event.currentTarget);
    submission.value = String(data.get('postal_code') ?? '');
}
</script>

<template>
    <form class="grid min-w-0 gap-5" data-docs-outline-exclude @submit.prevent="previewSubmission">
        <div>
            <MaskedInput
                v-model="postalCode"
                mask="##.###-###"
                label="Brazilian postal code"
                name="postal_code"
                autocomplete="postal-code"
                inputmode="numeric"
                hint="Enter eight digits, for example 01310100."
                incomplete-message="Enter all eight digits."
                required />
            <p class="mt-1 text-sm">Model value <code>{{ postalCode || 'Empty' }}</code></p>
            <Button type="button" appearance="plain" @click="postalCode = '01310100'">
                Load saved postal code
            </Button>
        </div>
        <div>
            <MaskedInput
                :form="identificationForm"
                field="taxId"
                :mask="documentMasks"
                :tokens="documentTokens"
                label="CPF or CNPJ"
                hint="Try 000.000.000-00 or 00.000.000/e08g-12. Letters appear in uppercase."
                with-clear />
            <p class="mt-1 text-sm">
                Inertia form value <code>{{ identificationForm.taxId || 'Empty' }}</code>
            </p>
        </div>
        <div>
            <MaskedInput
                v-model="phone"
                :mask="phoneMask"
                label="Brazilian phone number"
                inputmode="tel"
                hint="Include the two-digit area code. Try 1134567890 or 11987654321."
                value-mode="formatted" />
            <p class="mt-1 text-sm">Model value <code>{{ phone || 'Empty' }}</code></p>
        </div>
        <div>
            <MaskedInput
                v-model="reference"
                :mask="referenceMask"
                label="Reference code"
                hint="Enter a letter or digit, then lowercase b, then an optional pair of digits. Partial entries clear when you leave."
                prefix="ID "
                suffix=" BR"
                guide="focus"
                guide-char="_"
                clear-incomplete-on-blur
                overwrite />
            <p class="mt-1 text-sm">Model value <code>{{ reference || 'Empty' }}</code></p>
        </div>
        <div>
            <Button type="submit">Preview submitted postal code</Button>
            <p v-if="submission" role="status" class="mt-2">
                Submitted postal code <code>{{ submission }}</code>
            </p>
        </div>
    </form>
</template>
