<script setup>
import { ref } from 'vue';
import { Dialog, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const open = ref(false);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="open = true">Open dialog</Button>
        </div>
        <div class="min-w-0">
            <Dialog label="Review release" :open="open" @wa-after-hide="open = false">
                <p>Check the release before publishing.</p>
                <Button slot="footer" @click="open = false">Close</Button>
            </Dialog>
        </div>
    </div>
</template>
