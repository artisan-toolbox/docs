<script setup>
import { Icon } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { computed } from 'vue';

const props = defineProps({
    name: { type: String, required: true },
    family: { type: String, default: 'classic' },
    variant: { type: String, default: 'solid' },
    label: { type: String, default: '' },
    size: {
        type: String,
        default: 'md',
        validator: (value) => ['sm', 'md', 'lg'].includes(value),
    },
});

const sizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };
const customKit = computed(() => ['kit', 'kit-duotone'].includes(props.family));
</script>

<template>
    <span
        v-if="customKit"
        :role="label ? 'img' : undefined"
        :aria-label="label || undefined"
        :aria-hidden="label ? undefined : 'true'"
        class="inline-flex size-[1.25em] shrink-0 items-center justify-center align-middle leading-none"
        :class="sizes[size]"
        data-search-exclude>
        <span
            :key="`${family}:${name}`"
            class="inline-flex size-full items-center justify-center [&_svg]:max-h-full [&_svg]:max-w-full"
            data-kit-icon>
            <i
                :class="[family === 'kit-duotone' ? 'fa-kit-duotone' : 'fa-kit', `fa-${name}`]"
                aria-hidden="true" />
        </span>
    </span>
    <Icon
        v-else
        :name="name"
        :family="family"
        :variant="variant"
        :label="label"
        canvas="square"
        :aria-hidden="label ? undefined : 'true'"
        class="inline-block shrink-0 align-middle"
        :class="sizes[size]"
        data-search-exclude />
</template>
