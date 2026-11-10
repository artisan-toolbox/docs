<script setup>
import { Callout } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import SiteIcon from '@/components/site/SiteIcon.vue';

const variants = {
    info: {
        title: 'Information',
        icon: 'circle-info',
        variant: 'brand',
    },
    note: {
        title: 'Note',
        icon: 'note-sticky',
        variant: 'neutral',
    },
    tip: {
        title: 'Tip',
        icon: 'lightbulb',
        variant: 'success',
    },
    caution: {
        title: 'Caution',
        icon: 'triangle-exclamation',
        variant: 'warning',
    },
    danger: {
        title: 'Danger',
        icon: 'circle-exclamation',
        variant: 'danger',
    },
};

defineProps({
    variant: {
        type: String,
        default: 'note',
        validator: (value) => ['info', 'note', 'tip', 'caution', 'danger'].includes(value),
    },
});
</script>

<template>
    <aside :aria-label="variants[variant].title" class="min-w-0">
        <Callout :variant="variants[variant].variant" appearance="filled-outlined">
            <SiteIcon slot="icon" :name="variants[variant].icon" />
            <div class="flex min-w-0 flex-col gap-3">
                <p class="font-semibold">
                    <slot name="title">{{ variants[variant].title }}</slot>
                </p>
                <slot />
            </div>
        </Callout>
    </aside>
</template>
