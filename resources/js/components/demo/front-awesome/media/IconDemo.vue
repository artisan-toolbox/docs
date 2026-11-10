<script setup>
import { ref } from 'vue';
import { Icon, Button } from '@artisan-toolbox/front-awesome/components';

const visible = ref(false);
const failed = ref(false);

function toggleIcons() {
    visible.value = !visible.value;
    failed.value = false;
}
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button type="button" @click="toggleIcons">{{
                visible ? 'Reset icons' : 'Load icons'
            }}</Button>
        </div>
        <div v-if="visible" class="flex flex-wrap items-center gap-5">
            <Icon name="house" label="Home" class="text-2xl" @wa-error="failed = true" />
            <Button type="button"
                ><Icon slot="start" name="download" @wa-error="failed = true" />Download</Button
            >
        </div>
        <p v-if="failed" role="alert">
            Icon unavailable. Check the configured icon source and reset.
        </p>
    </div>
</template>
