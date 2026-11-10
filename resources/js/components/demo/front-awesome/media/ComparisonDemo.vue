<script setup>
import { Comparison } from '@artisan-toolbox/front-awesome/components/WebAwesome';
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Comparison :position="50">
                <div
                    slot="before"
                    class="flex h-40 items-center justify-center bg-brand-100 text-brand-950">
                    Before
                </div>
                <div
                    slot="after"
                    class="flex h-40 items-center justify-center bg-brand-900 text-white">
                    After
                </div>
            </Comparison>
        </div>
    </div>
</template>
