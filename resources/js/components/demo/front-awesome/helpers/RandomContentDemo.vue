<script setup>
import { useTemplateRef } from 'vue';
import { RandomContent, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const content = useTemplateRef('content');
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <RandomContent ref="content" mode="sequence" :autoplay="false">
                <p>Check installation.</p>
                <p>Review compatibility.</p>
                <p>Run the tests.</p>
            </RandomContent>
        </div>
        <div class="min-w-0">
            <Button @click="content.$el.randomize()">Next tip</Button>
        </div>
    </div>
</template>
