<script setup>
import { ref } from 'vue';
import { Spinner, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const active = ref(false);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="active = !active">{{
                active ? 'Stop spinner' : 'Start spinner'
            }}</Button>
        </div>
        <div class="min-w-0">
            <Spinner v-if="active" aria-label="Loading preview" />
            <p v-else>Spinner stopped.</p>
        </div>
    </div>
</template>
