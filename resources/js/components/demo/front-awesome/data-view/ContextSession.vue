<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import ContextOwner from './ContextOwner.vue';
const source = ref('FrontAwesome.Notebooks');
const parentKeys = ref([1]);
const owner = ref(0);
const hold = ref(false);
function update(keys) {
    if (!hold.value) parentKeys.value = keys;
}
function withdraw() {
    hold.value = true;
    source.value = 'Dapter.CollectionGateDeny';
}
function acknowledge() {
    hold.value = false;
    parentKeys.value = [];
}
function fresh() {
    acknowledge();
    source.value = 'FrontAwesome.Notebooks';
    owner.value++;
}
</script>
<template>
    <div class="flex min-w-0 flex-col gap-3">
        <div class="flex flex-wrap gap-2">
            <Button @click="withdraw">Withdraw access and hold old prefill</Button>
            <Button @click="source = 'Dapter.Quickstart'">Load overlapping keys</Button>
            <Button @click="acknowledge">Acknowledge removal</Button>
            <Button @click="fresh">Start a fresh owner</Button>
        </div>
        <p data-parent-keys>Parent model {{ JSON.stringify(parentKeys) }}.</p>
        <ContextOwner :key="owner" :source="source" :keys="parentKeys" @update:keys="update" />
    </div>
</template>
