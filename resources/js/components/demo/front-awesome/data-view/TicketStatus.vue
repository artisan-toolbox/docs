<script setup>
import { Tag } from '@artisan-toolbox/front-awesome/components/WebAwesome';

defineProps({ status: { type: String, required: true } });
const variants = { 'Needs action': 'warning', 'In progress': 'brand', Waiting: 'neutral' };
</script>

<template>
    <Tag :variant="variants[status]" size="small">{{ status }}</Tag>
</template>
