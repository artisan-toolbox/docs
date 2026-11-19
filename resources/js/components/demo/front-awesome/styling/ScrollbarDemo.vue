<script setup>
import { computed, h, ref, withDirectives } from 'vue';
import * as frontAwesome from '@artisan-toolbox/front-awesome';
import { Option, Select } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DocsCallout from '@/components/docs/DocsCallout.vue';

const scrollbarDirective = Reflect.get(frontAwesome, 'scrollbarDirective');
const variant = ref('neutral');
const autoHide = ref('never');
const trackClick = ref('instant');

const variants = ['Neutral', 'Brand', 'Success', 'Warning', 'Danger'];
const trackActions = { instant: 'instant', page: true, none: false };
const options = computed(() => ({
    scrollbars: {
        autoHide: autoHide.value,
        autoHideSuspend: false,
        clickScroll: trackActions[trackClick.value],
    },
}));

function Preview({ mode, variant, options }) {
    const title = `${mode} notifications`;
    const panel = h(
        'section',
        {
            'aria-label': title,
            tabindex: 0,
            class: [
                'h-44 overflow-auto rounded-lg border border-[var(--wa-color-surface-border)] bg-[var(--wa-color-surface-default)] p-3 text-[color:var(--wa-color-text-normal)] focus-visible:outline-2 focus-visible:outline-offset-2',
                mode === 'Light' ? 'wa-light' : 'wa-dark',
            ],
        },
        [
            h('p', { class: 'font-semibold' }, title),
            h(
                'ol',
                { class: 'mt-2 space-y-2' },
                Array.from({ length: 12 }, (_, index) =>
                    h('li', { key: index }, `Notification ${index + 1}`),
                ),
            ),
        ],
    );

    return scrollbarDirective
        ? withDirectives(panel, [[scrollbarDirective, options, undefined, { [variant]: true }]])
        : panel;
}

Preview.props = ['mode', 'variant', 'options'];
</script>

<template>
    <div class="grid min-w-0 gap-4">
        <div v-if="scrollbarDirective" class="grid min-w-0 gap-3 @lg:grid-cols-3">
            <Select v-model="variant" label="Thumb color">
                <Option v-for="color in variants" :key="color" :value="color.toLowerCase()">
                    {{ color }}
                </Option>
            </Select>
            <Select v-model="autoHide" label="Auto-hide">
                <Option value="never">Never</Option>
                <Option value="scroll">After scrolling</Option>
                <Option value="leave">When the pointer leaves</Option>
            </Select>
            <Select v-model="trackClick" label="Track clicks">
                <Option value="instant">Jump to position</Option>
                <Option value="page">Scroll by a page</Option>
                <Option value="none">Ignore track clicks</Option>
            </Select>
        </div>
        <DocsCallout v-else variant="note" data-scrollbar-preview-required>
            <template #title>Front Awesome beta.4 required</template>
            The panels use browser scrollbars with this installation. Upgrade Front Awesome to
            adjust the scrollbar options.
        </DocsCallout>

        <div class="grid min-w-0 gap-4 @sm:grid-cols-2">
            <Preview mode="Light" :variant="variant" :options="options" />
            <Preview mode="Dark" :variant="variant" :options="options" />
        </div>
    </div>
</template>
