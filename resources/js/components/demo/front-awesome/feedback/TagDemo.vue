<script setup>
import { ref } from 'vue';
import { Tag } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const selected = ref(true);

function removeSelection() {
    selected.value = false;
}
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Tag
                v-if="selected"
                variant="success"
                appearance="outlined"
                size="s"
                :pill="true"
                :with-remove="true"
                @wa-remove="removeSelection"
                >Published</Tag
            >
            <p v-else>No status selected.</p>
        </div>
    </div>
</template>
