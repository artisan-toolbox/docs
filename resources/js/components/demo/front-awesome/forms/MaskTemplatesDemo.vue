<script setup>
import { ref } from 'vue';
import * as frontAwesome from '@artisan-toolbox/front-awesome';
import Button from '@artisan-toolbox/front-awesome/components/Button.vue';

const MaskedInput = Reflect.get(frontAwesome, 'MaskedInput');
const useMaskTemplate = Reflect.get(frontAwesome, 'useMaskTemplate');
const masks = useMaskTemplate?.();
const cpf = ref('');
const address = ref('');
const submitted = ref(null);

function previewSubmission(event) {
    const data = new FormData(event.currentTarget);
    submitted.value = { cpf: data.get('cpf'), address: data.get('address') };
}
</script>

<template>
    <p v-if="!MaskedInput || !masks">
        This demo requires a Front Awesome checkout that exports useMaskTemplate.
    </p>
    <form v-else class="grid min-w-0 gap-5" @submit.prevent="previewSubmission">
        <div>
            <MaskedInput
                v-model="cpf"
                :mask="masks.Brazilian.cpf()"
                label="CPF"
                name="cpf"
                hint="Try 01234567890."
                incomplete-message="Enter all eleven digits."
                required />
        </div>
        <div>
            <MaskedInput
                v-model="address"
                :mask="masks.ip()"
                label="IP address"
                name="address"
                hint="Try 192.0.2.1 or 2001:db8::1."
                incomplete-message="Enter a complete IPv4 or IPv6 address."
                required />
        </div>
        <div>
            <Button type="submit">Preview form values</Button>
            <p v-if="submitted" role="status" class="mt-2">
                Submitted CPF <code>{{ submitted.cpf }}</code> and IP address
                <code>{{ submitted.address }}</code>.
            </p>
        </div>
    </form>
</template>
