<script setup>
import { ref } from 'vue';
import { Animation, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const playing = ref(false);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="playing = !playing">{{
                playing ? 'Stop animation' : 'Start animation'
            }}</Button>
        </div>
        <div class="min-w-0">
            <Animation name="bounce" :duration="1200" :play="playing">
                <div class="w-fit rounded bg-brand-700 p-4 text-white">Preview</div>
            </Animation>
        </div>
    </div>
</template>
