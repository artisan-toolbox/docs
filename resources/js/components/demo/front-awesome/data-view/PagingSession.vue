<script setup>
import { ref } from 'vue';
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';
import PreviewAvailability from './PreviewAvailability.vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { http } from '@inertiajs/core';
import { route } from 'ziggy-js';
const props = defineProps({
    source: { type: String, required: true },
    infinite: Boolean,
    observed: Boolean,
});
const root = ref(null);
const sentinel = ref(null);
const feedback = ref('');
const busy = ref(false);
const catalog = useDataAdapter(props.source, {
    protocol: 2,
    paging: 'source',
    id: `data-view-${props.source}`,
    url: false,
    ...(props.observed
        ? { infinite: { root, sentinel }, scrollContainer: root }
        : props.infinite
          ? { infinite: true }
          : {}),
});
const views = {
    table: {
        columns: [
            { field: 'id', label: 'ID' },
            { field: 'name', label: 'Notebook', orderBy: 'name' },
        ],
    },
};
async function change(action, message) {
    busy.value = true;
    feedback.value = '';
    try {
        await http.getClient().request({
            method: 'post',
            url: route(action),
            data: {},
            headers: { Accept: 'application/json' },
        });
        feedback.value = message;
    } catch {
        feedback.value = 'The fictional fixture could not change. Try again.';
    } finally {
        busy.value = false;
    }
}
</script>
<template>
    <div class="flex min-w-0 flex-col gap-3">
        <div v-if="source === 'Dapter.PagingRecovery'" class="flex flex-wrap gap-2">
            <Button
                :disabled="busy"
                @click="
                    change(
                        'demo.dapter.paging.expire',
                        'The clock advanced. Traverse with the previous token.',
                    )
                "
                >Expire fictional token</Button
            >
            <PreviewAvailability
                message="Restarting after a changed cursor scope requires the extended DataView. On beta.3, use Expire fictional token to try the released restart control."
                ><Button
                    :disabled="busy"
                    @click="
                        change(
                            'demo.dapter.paging.scope',
                            'The scope changed. Traverse with the previous token.',
                        )
                    "
                    >Change cursor scope</Button
                ></PreviewAvailability
            >
        </div>
        <div v-if="source === 'Dapter.InfiniteRecovery'" class="flex flex-wrap gap-2">
            <Button
                :disabled="busy"
                @click="change('demo.dapter.infinite.fail', 'The next read will fail.')"
                >Pause fictional service</Button
            >
            <Button
                :disabled="busy"
                @click="
                    change(
                        'demo.dapter.infinite.reset',
                        'The fictional service recovered. Retry the append.',
                    )
                "
                >Allow retry</Button
            >
        </div>
        <p role="status" v-if="feedback">{{ feedback }}</p>
        <div
            ref="root"
            :class="observed ? 'max-h-64 overflow-y-auto' : ''"
            :tabindex="observed ? 0 : undefined"
            :aria-label="observed ? 'Notebook scroll window' : undefined"
            :role="observed ? 'region' : undefined">
            <DataView :adapter="catalog" :views="views" row-key="id" label="Notebook traversal">
                <template #footer="{ adapter }"
                    ><p data-paging-summary>
                        Mode {{ adapter.paging.mode }}. {{ adapter.data.length }} loaded. Exact
                        total {{ adapter.paging.total == null ? 'unknown' : adapter.paging.total }}.
                    </p></template
                >
            </DataView>
            <div v-if="observed" ref="sentinel" aria-hidden="true" class="h-px" />
        </div>
    </div>
</template>
