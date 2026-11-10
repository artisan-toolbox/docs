<script setup>
import { ref } from 'vue';
import { ToastItem, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const visible = ref(false);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="visible = !visible">{{
                visible ? 'Reset notification' : 'Show notification item'
            }}</Button>
        </div>
        <div class="min-w-0">
            <ToastItem
                v-if="visible"
                variant="success"
                :duration="0"
                @wa-after-hide="visible = false"
                >Draft saved.</ToastItem
            >
        </div>
    </div>
</template>
