<script setup>
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const props = defineProps({ adapter: { type: Object, required: true } });
const adapter = useDataAdapter(props.adapter);
</script>

<template>
    <div class="flex flex-wrap items-center gap-3" data-shared-borrower>
        <span class="text-sm">Child controls read page {{ adapter.paging.current }}.</span>
        <Button
            :disabled="adapter.paging.loading"
            variant="neutral"
            @click="adapter.paging.reload()"
            >Reload from child</Button
        >
    </div>
</template>
