<script setup>
import { ref } from 'vue';
import { Popup, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const active = ref(false);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="active = !active">{{ active ? 'Hide popup' : 'Show popup' }}</Button>
        </div>
        <div class="min-w-0">
            <Popup :active="active" placement="bottom" :distance="8">
                <span slot="anchor" class="inline-block rounded border p-3">Anchor</span>
                <div class="rounded border bg-white p-4 text-black">Positioned content</div>
            </Popup>
        </div>
    </div>
</template>
