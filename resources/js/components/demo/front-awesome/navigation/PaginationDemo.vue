<script setup>
import { ref } from 'vue';
import { Button, Pagination } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const page = ref(1);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Pagination
                label="Local package results"
                :total="100"
                :page-size="10"
                v-model:page="page" />
        </div>
        <div class="min-w-0"><Button type="button" @click="page = 5">Go to page five</Button></div>
        <div class="min-w-0">
            <output>Current page: {{ page }}</output>
        </div>
    </div>
</template>
