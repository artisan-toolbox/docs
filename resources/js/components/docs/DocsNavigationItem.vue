<script setup>
import { computed, ref, useId, watch } from 'vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import SiteIcon from '@/components/site/SiteIcon.vue';
import { navigationIcon } from '@/lib/navigationIcons';

const props = defineProps({
    item: { type: Object, required: true },
    currentUrl: { type: String, required: true },
    depth: { type: Number, default: 0 },
});

const emit = defineEmits(['navigate']);
const childrenId = `docs-section-${useId()}`;
const expanded = ref(props.item.active || props.item.activeAncestor);
const icon = computed(() => navigationIcon(props.item.slug));

watch([() => props.currentUrl, () => props.item], () => {
    if (props.item.active || props.item.activeAncestor) {
        expanded.value = true;
    }
});
</script>

<template>
    <li class="min-w-0" :class="{ 'mt-2': depth === 0 && item.children.length }">
        <div class="flex items-center gap-1">
            <DocsLink
                :href="item.href"
                :aria-current="item.active ? 'page' : undefined"
                class="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-r-md border-l-2 px-2 py-1.5 text-[13px] leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 motion-reduce:transition-none lg:min-h-8 lg:py-1"
                :class="
                    item.active
                        ? 'border-brand-600 bg-brand-50 font-semibold text-brand-800 dark:border-brand-400 dark:bg-brand-950/50 dark:text-brand-300'
                        : item.activeAncestor || (depth === 0 && item.children.length)
                          ? 'border-transparent font-semibold text-slate-800 hover:text-brand-700 dark:text-slate-200 dark:hover:text-brand-400'
                          : 'border-transparent text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                "
                @click="emit('navigate')"
                ><SiteIcon v-bind="icon" :size="depth ? 'sm' : 'md'" class="opacity-70" />
                <span class="min-w-0">{{ item.title }}</span></DocsLink
            >
            <button
                v-if="item.children.length"
                type="button"
                :aria-label="`${expanded ? 'Collapse' : 'Expand'} ${item.title} section`"
                :aria-expanded="expanded"
                :aria-controls="childrenId"
                class="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 motion-reduce:transition-none lg:min-h-8 lg:min-w-8 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                @click="expanded = !expanded">
                <SiteIcon
                    size="sm"
                    name="chevron-right"
                    class="transition-transform motion-reduce:transition-none"
                    :class="{ 'rotate-90': expanded }" />
            </button>
        </div>
        <ul
            v-if="item.children.length"
            v-show="expanded"
            :id="childrenId"
            class="ml-1 flex flex-col border-l border-slate-200 pl-2 dark:border-slate-800">
            <DocsNavigationItem
                v-for="child in item.children"
                :key="child.slug"
                :item="child"
                :current-url="currentUrl"
                :depth="depth + 1"
                @navigate="emit('navigate')" />
        </ul>
    </li>
</template>
