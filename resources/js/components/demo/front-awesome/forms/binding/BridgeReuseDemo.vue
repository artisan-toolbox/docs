<script setup>
import { defineComponent, h, ref, useId } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { useFormBridge } from '@artisan-toolbox/front-awesome';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const BridgeTextField = defineComponent({
    name: 'BridgeTextField',
    props: {
        modelValue: String,
        form: [String, Object],
        field: String,
        fieldName: String,
        label: { type: String, required: true },
        failed: [Boolean, String, Array],
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const id = useId();
        const { value, errors, invalid } = useFormBridge(props, {
            emitValue: (next) => emit('update:modelValue', next),
        });
        return () =>
            h('div', { class: 'flex min-w-0 flex-col gap-2' }, [
                h('label', { for: id, class: 'text-sm font-medium' }, props.label),
                h('input', {
                    id,
                    value: value.value ?? '',
                    'aria-invalid': invalid.value ? 'true' : undefined,
                    'aria-describedby': errors.value.length ? `${id}-errors` : undefined,
                    class: [
                        'min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-base outline-offset-2 dark:bg-slate-950',
                        invalid.value
                            ? 'border-red-600 text-red-700 focus:outline-red-600 dark:text-red-300'
                            : 'border-slate-300 focus:outline-brand-600 dark:border-slate-700',
                    ],
                    onInput(event) {
                        value.value = event.currentTarget.value;
                    },
                }),
                h(
                    'div',
                    {
                        id: `${id}-errors`,
                        role: 'alert',
                        class: 'text-sm text-red-700 dark:text-red-300',
                    },
                    errors.value.map((message) => h('p', message)),
                ),
            ]);
    },
});

const nickname = ref('Ada');
const form = useForm({ nickname: 'Grace' });
</script>

<template>
    <div class="flex min-w-0 flex-col gap-5" data-docs-outline-exclude>
        <BridgeTextField v-model="nickname" label="Custom model field" />
        <BridgeTextField :form="form" field="nickname" label="Custom Inertia field" />
        <div class="flex flex-wrap gap-2">
            <Button
                type="button"
                @click="
                    nickname = 'Lin';
                    form.nickname = 'Margaret';
                "
                >Update both custom fields</Button
            >
            <Button
                type="button"
                @click="form.setError('nickname', 'This nickname is already taken.')"
                >Simulate custom field error</Button
            >
            <Button type="button" appearance="plain" @click="form.clearErrors()"
                >Clear custom field error</Button
            >
        </div>
        <output class="text-sm break-words"
            >Model: {{ nickname }}. Form: {{ form.nickname }}.</output
        >
    </div>
</template>
