<script setup>
import SiteIcon from '@/components/site/SiteIcon.vue';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from 'vue';

const props = defineProps({
    content: { type: Object, default: null },
    pageKey: { type: String, required: true },
});

const listId = `docs-outline-${useId()}`;
const entries = shallowRef([]);
const activeId = ref('');
const expanded = ref(false);
let mounted = false;
let revision = 0;
let animationFrame = null;

const sections = computed(() => {
    const groups = [];

    for (const entry of entries.value) {
        if (entry.level === 1) {
            groups.at(-1).children.push(entry);
        } else {
            groups.push({ heading: entry, children: [] });
        }
    }

    return groups;
});

function updateActiveHeading() {
    const headings = entries.value;

    if (!headings.length) {
        return;
    }

    if (
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
    ) {
        activeId.value = headings.at(-1).id;
        return;
    }

    let current = headings[0].id;

    for (const heading of headings) {
        const scrollMargin =
            Number.parseFloat(window.getComputedStyle(heading.element).scrollMarginTop) || 112;

        if (heading.element.getBoundingClientRect().top <= scrollMargin + 2) {
            current = heading.id;
        }
    }

    activeId.value = current;
}

function scheduleActiveHeading() {
    if (animationFrame !== null) {
        return;
    }

    animationFrame = window.requestAnimationFrame(() => {
        animationFrame = null;
        updateActiveHeading();
    });
}

async function refreshHeadings() {
    const currentRevision = ++revision;
    expanded.value = false;
    entries.value = [];
    activeId.value = '';
    await nextTick();

    if (!mounted || currentRevision !== revision) {
        return;
    }

    const headings = [];
    const ids = new Set();
    let hasSection = false;

    for (const element of props.content?.querySelectorAll('h2[id], h3[id]') ?? []) {
        const id = element.id;
        const title = element.textContent.trim();

        if (!id.trim() || !title || ids.has(id) || element.closest('[data-docs-outline-exclude]')) {
            continue;
        }

        ids.add(id);

        if (element.tagName === 'H2') {
            hasSection = true;
        }

        headings.push({
            id,
            title,
            level: element.tagName === 'H3' && hasSection ? 1 : 0,
            element,
        });
    }

    entries.value = headings;
    updateActiveHeading();
}

function selectHeading(id) {
    activeId.value = id;
    expanded.value = false;
}

watch(
    [() => props.content, () => props.pageKey],
    () => {
        if (mounted) {
            refreshHeadings();
        }
    },
    { flush: 'post' },
);

onMounted(() => {
    mounted = true;
    window.addEventListener('scroll', scheduleActiveHeading, { passive: true });
    window.addEventListener('resize', scheduleActiveHeading);
    refreshHeadings();
});

onBeforeUnmount(() => {
    mounted = false;
    revision++;
    window.removeEventListener('scroll', scheduleActiveHeading);
    window.removeEventListener('resize', scheduleActiveHeading);

    if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
    }
});
</script>

<template>
    <nav v-if="entries.length" aria-label="On this page" class="min-w-0">
        <p
            class="hidden items-center gap-2 text-sm font-semibold text-slate-950 xl:flex dark:text-white">
            <SiteIcon name="list-ul" class="text-slate-400" />
            On this page
        </p>
        <button
            type="button"
            :aria-expanded="expanded"
            :aria-controls="listId"
            class="flex min-h-11 w-full items-center justify-between gap-3 rounded-md text-sm font-semibold text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 xl:hidden dark:text-white"
            @click="expanded = !expanded">
            On this page
            <SiteIcon name="chevron-down" :class="{ 'rotate-180': expanded }" />
        </button>
        <ul
            :id="listId"
            class="mt-3 border-l border-slate-200 xl:block dark:border-slate-800"
            :class="{ hidden: !expanded }">
            <li v-for="section in sections" :key="section.heading.id">
                <a
                    :href="`#${encodeURIComponent(section.heading.id)}`"
                    :aria-current="activeId === section.heading.id ? 'location' : undefined"
                    class="-ml-px flex min-h-11 items-center border-l-2 py-2 pl-4 text-[13px] leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 motion-reduce:transition-none xl:min-h-7 xl:py-1"
                    :class="
                        activeId === section.heading.id
                            ? 'border-brand-600 font-medium text-brand-700 dark:border-brand-400 dark:text-brand-400'
                            : 'border-transparent text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                    "
                    @click="selectHeading(section.heading.id)"
                    >{{ section.heading.title }}</a
                >
                <ul v-if="section.children.length">
                    <li v-for="child in section.children" :key="child.id">
                        <a
                            :href="`#${encodeURIComponent(child.id)}`"
                            :aria-current="activeId === child.id ? 'location' : undefined"
                            class="-ml-px flex min-h-11 items-center border-l-2 py-2 pl-7 text-xs leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 motion-reduce:transition-none xl:min-h-7 xl:py-1"
                            :class="
                                activeId === child.id
                                    ? 'border-brand-600 font-medium text-brand-700 dark:border-brand-400 dark:text-brand-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                            "
                            @click="selectHeading(child.id)"
                            >{{ child.title }}</a
                        >
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
</template>
