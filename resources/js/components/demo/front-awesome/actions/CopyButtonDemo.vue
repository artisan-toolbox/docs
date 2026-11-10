<script setup>
import { ref } from 'vue';
import { CopyButton } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const message = ref('Ready to copy');
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <CopyButton
                value="artisan-toolbox"
                copy-label="Copy package name"
                @wa-copy="message = 'Copied'"
                @wa-error="message = 'Clipboard unavailable. Check browser permissions.'" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">{{ message }}</output>
        </div>
    </div>
</template>
