<script setup>
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { ref } from 'vue';

const source = ref('Dapter.Quickstart');
const catalog = useDataAdapter(() => source.value, { id: 'getter-catalog' });
</script>

<template>
    <div class="flex flex-col gap-3">
        <p role="status" class="text-sm">
            <template v-if="catalog.paging.loading">Loading getter source...</template>
            <template v-else
                >Getter source {{ source }}. Page {{ catalog.paging.current }} with
                {{ catalog.data.length }} rows.</template
            >
        </p>
        <p v-if="catalog.error" role="alert">{{ catalog.error.message }}</p>
        <div class="flex flex-wrap gap-3">
            <Button
                :disabled="catalog.paging.loading || !catalog.paging.has_next"
                @click="catalog.paging.goToNext()"
                >Next getter page</Button
            >
            <Button
                variant="neutral"
                :disabled="source === 'Dapter.CollectionFluent'"
                @click="source = 'Dapter.CollectionFluent'"
                >Use five-row source</Button
            >
        </div>
    </div>
</template>
