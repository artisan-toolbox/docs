<script setup>
import { Sparkline } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Sparkline
                label="Example weekly counts of 3, 5, 4, 7, and 6"
                data="3 5 4 7 6"
                class="block h-16 w-full" />
        </div>
        <div class="min-w-0">
            <p>Example counts: 3, 5, 4, 7, 6.</p>
        </div>
    </div>
</template>
