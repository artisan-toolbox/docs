<script setup>
import { useId, useTemplateRef } from 'vue';
import { Popover, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const triggerId = useId();
const details = useTemplateRef('details');

function showDetails() {
    details.value.$el.show();
}

function hideDetails() {
    details.value.$el.hide();
}
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button :id="triggerId" type="button">Component details</Button>
        </div>
        <div class="min-w-0">
            <Popover ref="details" :for="triggerId" placement="bottom-start" :without-arrow="false">
                <p>Read the native Popover options.</p>
                <a href="https://webawesome.com/docs/components/popover/" data-popover="close"
                    >Web Awesome Popover reference</a
                >
            </Popover>
        </div>
        <div class="min-w-0">
            <Button type="button" @click.stop="showDetails">Show details</Button>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="hideDetails">Hide details</Button>
        </div>
    </div>
</template>
