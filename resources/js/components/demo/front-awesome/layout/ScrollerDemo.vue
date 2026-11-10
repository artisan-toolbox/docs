<script setup>
import { Scroller } from '@artisan-toolbox/front-awesome/components/WebAwesome';
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Scroller class="block max-w-full">
                <div class="flex w-max gap-4">
                    <span v-for="item in 8" :key="item" class="rounded border p-8"
                        >Package {{ item }}</span
                    >
                </div>
            </Scroller>
        </div>
    </div>
</template>
