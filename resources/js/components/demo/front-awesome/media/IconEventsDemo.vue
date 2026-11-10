<script setup>
import { ref } from 'vue';
import { Icon, Button } from '@artisan-toolbox/front-awesome/components';

const source = ref(null);
const status = ref('Choose a local icon source.');
let attempt = 0;

function load(valid) {
    source.value = `/examples/front-awesome/${valid ? 'icon-add' : 'icon-missing'}.svg?attempt=${++attempt}`;
    status.value = 'Loading icon.';
}

/** @type {NonNullable<import('@artisan-toolbox/front-awesome').IconProps['onWaLoad']>} */
const onLoad = () => {
    if (source.value) status.value = 'Icon loaded.';
};

/** @type {NonNullable<import('@artisan-toolbox/front-awesome').IconProps['onWaError']>} */
const onError = () => {
    if (source.value) status.value = 'Icon failed to load.';
};

function reset() {
    source.value = null;
    status.value = 'Choose a local icon source.';
}
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="flex flex-wrap gap-2">
            <Button type="button" @click="load(true)">Load local SVG</Button>
            <Button type="button" @click="load(false)">Try a missing SVG</Button>
            <Button type="button" appearance="plain" @click="reset">Reset icon events</Button>
        </div>
        <div v-if="source" class="min-w-0">
            <Icon
                :src="source"
                label="Add"
                class="text-3xl"
                @wa-load="onLoad"
                @wa-error="onError" />
        </div>
        <output role="status" aria-live="polite">{{ status }}</output>
    </div>
</template>
