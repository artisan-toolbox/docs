<script setup>
import { SplitPanel } from '@artisan-toolbox/front-awesome/components/WebAwesome';
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <SplitPanel :position="50" class="h-48">
                <div slot="start" class="h-full bg-brand-100 p-4 text-brand-950">Source</div>
                <div slot="end" class="h-full bg-brand-900 p-4 text-white">Preview</div>
            </SplitPanel>
        </div>
    </div>
</template>
