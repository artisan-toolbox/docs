<script>
export function supportsDataViewPreview(component) {
    const props = component.props ?? {};
    const names = Array.isArray(props) ? props : Object.keys(props);
    return names.includes('selection') && names.includes('controlLabel');
}
</script>
<script setup>
import { DataView } from '@artisan-toolbox/front-awesome/data-view';
import DocsCallout from '@/components/docs/DocsCallout.vue';
defineProps({
    required: { type: Boolean, default: true },
    message: {
        type: String,
        default:
            'This example requires Front Awesome 1.0.0-beta.4. You can inspect its source below.',
    },
});
const available = supportsDataViewPreview(DataView);
</script>
<template>
    <slot v-if="!required || available" />
    <DocsCallout v-else variant="note" data-data-view-preview-required>
        <template #title>Front Awesome beta.4 required</template>
        {{ message }}
    </DocsCallout>
</template>
