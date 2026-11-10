<script setup>
import { ref } from 'vue';
import { MutationObserver, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const observing = ref(false);
const changed = ref(false);
const events = ref(0);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="observing = !observing">{{
                observing ? 'Stop observing' : 'Start observing'
            }}</Button>
        </div>
        <div class="min-w-0">
            <MutationObserver attr="data-state" :disabled="!observing" @wa-mutation="events++">
                <Button type="button" :data-state="changed" @click="changed = !changed">
                    Change observed attribute
                </Button>
            </MutationObserver>
        </div>
        <div class="min-w-0">
            <output>Mutation events: {{ events }}</output>
        </div>
    </div>
</template>
