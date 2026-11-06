<script setup>
import Button from '@artisan-toolbox/front-awesome/components/Button.vue';

defineProps({
    busy: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    variant: { type: String, default: 'brand' },
});
</script>

<template>
    <Button
        type="button"
        :variant="variant"
        :loading="busy"
        :disabled="disabled || busy"
    >
        <slot />
    </Button>
</template>
