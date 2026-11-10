<script setup>
import { useId, useTemplateRef } from 'vue';
import { Tooltip, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const targetId = useId();
const help = useTemplateRef('help');

function showHelp() {
    help.value.$el.show();
}

function hideHelp() {
    help.value.$el.hide();
}
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <div class="min-w-0">
                <Button :id="targetId" type="button">Save help</Button>
                <Tooltip
                    ref="help"
                    :for="targetId"
                    placement="top"
                    :disabled="false"
                    :without-arrow="false"
                    :show-delay="300"
                    :hide-delay="100"
                    >Save help. Stores this draft without publishing it.</Tooltip
                >
            </div>
        </div>
        <div class="min-w-0">
            <div class="flex flex-wrap gap-2">
                <Button type="button" @click.stop="showHelp">Show help</Button>
                <Button type="button" @click="hideHelp">Hide help</Button>
            </div>
        </div>
    </div>
</template>
