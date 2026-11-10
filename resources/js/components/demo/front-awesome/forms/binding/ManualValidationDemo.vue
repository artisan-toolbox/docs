<script setup>
import { computed, ref } from 'vue';
import {
    Button,
    Checkbox,
    Input,
    Rating,
} from '@artisan-toolbox/front-awesome/components/WebAwesome';

const name = ref('');
const accepted = ref(false);
const score = ref(0);
const validated = ref(false);
const nameFailure = computed(() =>
    validated.value && !name.value.trim() ? 'Enter a display name.' : false,
);
const choiceFailure = computed(() =>
    validated.value && !accepted.value
        ? ['Enable the example option.', 'You can change this value without submitting.']
        : false,
);
const scoreFailure = computed(() =>
    validated.value && score.value < 3 ? 'Choose at least three stars.' : false,
);

function reset() {
    name.value = '';
    accepted.value = false;
    score.value = 0;
    validated.value = false;
}
</script>

<template>
    <div class="flex min-w-0 flex-col gap-5" data-docs-outline-exclude>
        <div class="min-w-0">
            <Input
                v-model="name"
                label="Display name"
                hint="Validation belongs to this demo."
                :failed="nameFailure" />
        </div>
        <div class="min-w-0">
            <Checkbox v-model="accepted" :failed="choiceFailure"
                >Enable the example option</Checkbox
            >
        </div>
        <div class="min-w-0">
            <Rating v-model="score" label="Manual product rating" :failed="scoreFailure" />
        </div>
        <div class="flex flex-wrap gap-2">
            <Button type="button" @click="validated = true">Validate local values</Button>
            <Button type="button" appearance="plain" @click="reset">Reset local validation</Button>
        </div>
        <output class="text-sm break-words"
            >Name: {{ name || 'empty' }}. Enabled: {{ accepted }}. Rating: {{ score }}.</output
        >
    </div>
</template>
