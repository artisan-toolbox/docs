<script setup>
import { ref } from 'vue';
import { Video } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const failed = ref(false);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button
                @click="
                    loaded = !loaded;
                    failed = false;
                "
                >{{ loaded ? 'Reset media' : 'Load media controls' }}</Button
            >
        </div>
        <div class="min-w-0">
            <div v-if="loaded">
                <Video
                    title="Silent color test"
                    controls="full"
                    preload="none"
                    :autoplay="false"
                    src="/examples/front-awesome/color-test.mp4"
                    @error="failed = true" />
            </div>
        </div>
        <div class="min-w-0">
            <p v-if="failed" role="alert">Media unavailable. Reset and try again.</p>
        </div>
    </div>
</template>
