<script setup>
import { RelativeTime } from '@artisan-toolbox/front-awesome/components/WebAwesome';
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <RelativeTime date="2026-11-09T12:00:00Z" lang="en" :sync="false" />
        </div>
    </div>
</template>
