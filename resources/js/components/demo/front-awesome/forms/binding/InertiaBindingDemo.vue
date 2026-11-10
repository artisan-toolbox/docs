<script setup>
import { useForm } from '@inertiajs/vue3';
import {
    Button,
    Checkbox,
    Input,
    Rating,
    Slider,
} from '@artisan-toolbox/front-awesome/components/WebAwesome';

const form = useForm({
    users: [{ email: 'ada@example.com' }],
    subscribed: false,
    score: 2,
    volume: 25,
});

function showErrors() {
    form.setError({
        'users.0.email': 'Email is already taken.',
        subscribed: 'Enable this option for the example.',
        score: 'Choose at least three stars.',
        volume: 'Choose a volume of at least 50.',
    });
}
</script>

<template>
    <div class="flex min-w-0 flex-col gap-5" data-docs-outline-exclude>
        <div class="grid min-w-0 gap-5 @sm:grid-cols-2">
            <div class="min-w-0">
                <Input
                    :form="form"
                    field="users.0.email"
                    type="email"
                    label="Email"
                    hint="Use your work email."
                    with-clear />
            </div>
            <div class="min-w-0">
                <Checkbox :form="form" field="subscribed">Receive release notes</Checkbox>
            </div>
            <div class="min-w-0"><Rating :form="form" field="score" label="Product rating" /></div>
            <div class="min-w-0">
                <Slider :form="form" field="volume" label="Volume" :min="0" :max="100" :step="5" />
            </div>
        </div>
        <div class="flex flex-wrap gap-2">
            <Button type="button" @click="form.users[0].email = 'grace@example.com'"
                >Use Grace's email</Button
            >
            <Button type="button" @click="showErrors">Simulate server errors</Button>
            <Button type="button" appearance="plain" @click="form.clearErrors()"
                >Clear server errors</Button
            >
            <Button type="button" appearance="plain" @click="form.reset()"
                >Reset form values</Button
            >
        </div>
        <output class="text-sm break-words"
            >Email: {{ form.users[0].email }}. Subscribed: {{ form.subscribed }}. Score:
            {{ form.score }}. Volume: {{ form.volume }}.</output
        >
    </div>
</template>
