<script setup>
import { ref, useTemplateRef } from 'vue';
import { Toast, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const notifications = useTemplateRef('notifications');
const status = ref('Ready');
async function showNotification() {
    status.value = 'Creating notification...';
    try {
        await notifications.value.$el.create('Draft saved.', {
            variant: 'success',
            duration: 5000,
        });
        status.value = 'Notification created';
    } catch {
        status.value = 'Notification unavailable. Try again.';
    }
}
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="showNotification">Show notification</Button>
        </div>
        <div class="min-w-0">
            <Toast ref="notifications" placement="bottom-end" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">{{ status }}</output>
        </div>
    </div>
</template>
