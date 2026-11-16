<script setup>
import { Badge, Details, ProgressRing } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { computed, onBeforeUnmount, onMounted, provide, reactive, ref } from 'vue';
import { roadmapPhaseKey, roadmapStatuses, summarizeRoadmap } from '@/lib/roadmap';

const props = defineProps({
    id: { type: String, required: true },
    title: { type: String, required: true },
});

const expanded = ref(false);
const tasks = reactive(new Map());
const summary = computed(() => summarizeRoadmap([...tasks.values()]));
const status = computed(() => roadmapStatuses[summary.value.status]);

provide(roadmapPhaseKey, {
    setTask: (key, value) => tasks.set(key, value),
    removeTask: (key) => tasks.delete(key),
    open: () => (expanded.value = true),
});

function openHashTarget() {
    if (window.location.hash === `#${encodeURIComponent(props.id)}`) expanded.value = true;
}

onMounted(() => {
    openHashTarget();
    window.addEventListener('hashchange', openHashTarget);
});

onBeforeUnmount(() => window.removeEventListener('hashchange', openHashTarget));
</script>

<template>
    <section :aria-labelledby="id" class="min-w-0 border-b border-slate-200 dark:border-slate-800">
        <Details v-model:open="expanded" appearance="plain" class="roadmap-phase block min-w-0">
            <div slot="summary" class="flex min-w-0 items-center gap-[0.75rem] sm:gap-[1rem]">
                <ProgressRing
                    :value="summary.progress"
                    :label="`${title}: ${summary.completed} of ${summary.total} tasks completed`"
                    :style="{ '--indicator-color': status.indicator }"
                    class="roadmap-progress shrink-0 text-[0.65rem] font-semibold text-slate-600 tabular-nums dark:text-slate-300">
                    {{ Math.round(summary.progress) }}%
                </ProgressRing>
                <div class="min-w-0 flex-1">
                    <div class="flex min-w-0 items-center gap-[0.75rem]">
                        <h3
                            :id="id"
                            class="scroll-mt-[calc(var(--site-header-height,6rem)+1rem)] text-base leading-[1.5rem] font-semibold tracking-tight text-slate-950 dark:text-white">
                            {{ title }}
                        </h3>
                        <Badge
                            :variant="status.variant"
                            appearance="filled"
                            pill
                            class="shrink-0 text-[0.6875rem]">
                            {{ status.label }}
                        </Badge>
                    </div>
                    <p
                        class="mt-[0.25rem] text-xs leading-[1.25rem] text-slate-500 dark:text-slate-400">
                        {{ summary.completed }} of {{ summary.total }} tasks completed
                    </p>
                </div>
            </div>
            <div class="min-w-0 space-y-[1.25rem] pb-[0.5rem] sm:pl-[3.5rem]">
                <slot />
            </div>
        </Details>
    </section>
</template>

<style scoped>
.roadmap-phase {
    --spacing: 1rem;
}

.roadmap-phase::part(header) {
    min-height: 6rem;
    padding-inline: 0;
}

.roadmap-phase::part(summary) {
    min-width: 0;
}

.roadmap-phase::part(content) {
    padding: 0 0 1.25rem;
}

.roadmap-progress {
    --size: 2.25rem;
    --track-width: 3px;
    --track-color: var(--color-slate-100);
}

.roadmap-progress:where(.dark *) {
    --track-color: var(--color-slate-800);
}

@media (max-width: 30rem) {
    .roadmap-phase {
        --spacing: 0.75rem;
    }
}

@media (prefers-reduced-motion: reduce) {
    .roadmap-progress {
        --indicator-transition-duration: 0s;
    }
}
</style>
