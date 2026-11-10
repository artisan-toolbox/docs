<script setup>
import { ref } from 'vue';
import { Button, Input } from '@artisan-toolbox/front-awesome/components';

const name = ref('Ada');
</script>

<template>
    <form class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude @submit.prevent>
        <div class="min-w-0"><Input v-model="name" label="Name" with-clear /></div>
        <div class="flex flex-wrap gap-2">
            <Button type="button" @click="name = 'Grace'">Use Grace</Button>
            <Button type="reset" appearance="plain">Reset name</Button>
        </div>
        <output>{{ name }}</output>
    </form>
</template>
