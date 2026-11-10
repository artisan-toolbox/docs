<script setup>
import { FormatNumber } from '@artisan-toolbox/front-awesome/components/WebAwesome';
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <FormatNumber :value="1234.5" type="currency" currency="USD" lang="en-US" />
        </div>
    </div>
</template>
