<script setup>
import { ref } from 'vue';
import { Icon, Button } from '@artisan-toolbox/front-awesome/components';

const visible = ref(false);
const spinning = ref(false);

function reset() {
    visible.value = false;
    spinning.value = false;
}
</script>

<template>
    <div class="flex min-w-0 flex-col gap-5" data-docs-outline-exclude>
        <div class="flex flex-wrap gap-2">
            <Button type="button" @click="visible = true">Show transformations</Button>
            <Button type="button" appearance="plain" @click="reset">Reset transformations</Button>
        </div>
        <div v-if="visible" class="grid grid-cols-2 gap-5 text-sm @sm:grid-cols-3">
            <div class="flex flex-col items-start gap-2">
                <Icon name="arrow-up" :rotate="90" label="Right" class="text-2xl" /><span
                    >Rotate 90°</span
                >
            </div>
            <div class="flex flex-col items-start gap-2">
                <Icon name="arrow-up" flip="y" label="Down" class="text-2xl" /><span
                    >Flip vertically</span
                >
            </div>
            <div
                v-for="canvas in ['auto', 'fixed', 'square', 'roomy']"
                :key="canvas"
                class="flex flex-col items-start gap-2">
                <Icon
                    name="house"
                    :canvas="canvas"
                    :label="`${canvas} canvas`"
                    class="text-2xl" /><span>{{ canvas }} canvas</span>
            </div>
        </div>
        <div v-if="visible" class="flex flex-wrap items-center gap-3">
            <Button type="button" @click="spinning = !spinning">{{
                spinning ? 'Pause icon animation' : 'Start icon animation'
            }}</Button>
            <Icon
                name="spinner"
                :animation="spinning ? 'spin' : undefined"
                label="Loading"
                class="text-2xl" />
        </div>
    </div>
</template>
