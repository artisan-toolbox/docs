<script setup>
import { ref } from 'vue';
import { FileInput } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const files = ref([]);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <FileInput
                label="Local text files"
                accept=".txt,text/plain"
                :multiple="true"
                v-model="files" />
        </div>
        <div class="min-w-0">
            <output>{{
                files.length ? files.map((file) => file.name).join(', ') : 'No files selected'
            }}</output>
        </div>
        <div class="min-w-0">
            <Button @click="files = []">Clear selection</Button>
        </div>
    </div>
</template>
