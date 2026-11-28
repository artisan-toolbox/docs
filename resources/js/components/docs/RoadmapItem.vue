<script setup>
import { Badge, Card } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { computed, inject, onBeforeUnmount, onMounted, watchEffect } from 'vue';
import { roadmapPhaseKey, roadmapStatuses } from '@/lib/roadmap';

const props = defineProps({
    id: { type: String, required: true },
    title: { type: String, required: true },
    status: {
        type: String,
        default: 'not_started',
        validator: (value) => Object.hasOwn(roadmapStatuses, value),
    },
});

const statusMetadata = computed(() => roadmapStatuses[props.status]);
const phase = inject(roadmapPhaseKey, null);
const taskKey = Symbol('roadmap task');

watchEffect(() => phase?.setTask(taskKey, props.status));

function openHashTarget() {
    if (window.location.hash === `#${encodeURIComponent(props.id)}`) {
        phase?.open();
    }
}

onMounted(() => {
    openHashTarget();
    window.addEventListener('hashchange', openHashTarget);
});

onBeforeUnmount(() => {
    phase?.removeTask(taskKey);
    window.removeEventListener('hashchange', openHashTarget);
});
</script>

<template>
    <Card
        :id="id"
        appearance="outlined"
        :aria-labelledby="`${id}-title`"
        class="roadmap-item block min-w-0 scroll-mt-[calc(var(--site-header-height,6rem)+1rem)] rounded-xl border-slate-200 bg-white shadow-xs dark:border-slate-700 dark:bg-slate-900">
        <div class="flex min-w-0 flex-col gap-3.5">
            <div class="flex min-w-0 items-center gap-3">
                <h4
                    :id="`${id}-title`"
                    class="min-w-0 text-sm leading-[1.5rem] font-semibold text-slate-950 dark:text-slate-100">
                    {{ title }}
                </h4>
                <Badge
                    :variant="statusMetadata.variant"
                    appearance="filled"
                    pill
                    class="shrink-0 text-[0.6875rem]">
                    {{ statusMetadata.label }}
                </Badge>
            </div>
            <div
                class="min-w-0 space-y-[0.75rem] text-sm leading-[1.75rem] text-slate-600 dark:text-slate-300">
                <slot />
            </div>
        </div>
    </Card>
</template>

<style scoped>
.roadmap-item {
    --spacing: 1.25rem;
}
</style>
