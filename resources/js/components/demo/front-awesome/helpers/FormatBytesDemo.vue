<script setup>
import { FormatBytes } from '@artisan-toolbox/front-awesome/components/WebAwesome';
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <p>File size: <FormatBytes :value="2048" unit="byte" lang="en" /></p>
        </div>
    </div>
</template>
