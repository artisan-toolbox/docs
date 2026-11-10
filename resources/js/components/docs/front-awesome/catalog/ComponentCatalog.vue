<script setup>
import { Button, Popover } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { computed, reactive, useId } from 'vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import SiteIcon from '@/components/site/SiteIcon.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import catalog from './components.json';

const props = defineProps({
    group: { type: String, required: true },
    navigation: { type: Array, default: () => [] },
});
const catalogId = useId();
const expanded = reactive({});
const components = computed(() =>
    catalog.groups
        .find((group) => group.id === props.group)
        .components.map((component) => {
            const implemented = component.implementation.state === 'implemented';
            const owner = implemented
                ? catalog.groups
                      .find((group) => group.id === props.group)
                      .components.find(
                          (item) =>
                              item.implementation.export === component.implementation.demoOwner,
                      )
                : null;
            const guide = implemented
                ? findNavigationItem(props.navigation, component.implementation.guide)
                : null;
            return {
                ...component,
                status: catalog.statuses[component.implementation.state],
                implemented,
                triggerId: `${catalogId}-${component.tag}-trigger`,
                panelId: `${catalogId}-${component.tag}-details`,
                exampleHref: implemented ? `#${component.implementation.anchor}` : null,
                ownerHref: owner && owner !== component ? `#${owner.implementation.anchor}` : null,
                ownerName: owner?.name,
                guideHref:
                    guide &&
                    !(
                        component.implementation.guide ===
                            `front-awesome/web-awesome/components/${props.group}` &&
                        component.implementation.guideFragment ===
                            `#${component.implementation.anchor}`
                    )
                        ? `${guide.href}${component.implementation.guideFragment}`
                        : null,
            };
        }),
);

function syncExpanded(tag, event) {
    expanded[tag] = event.currentTarget.open;
}
</script>

<template>
    <div
        role="list"
        class="flex flex-wrap items-center gap-1.5"
        aria-label="Component wrapper status">
        <div
            v-for="component in components"
            :key="component.tag"
            role="listitem"
            class="inline-flex items-center gap-0.5"
            :data-component="component.tag">
            <Button
                :id="component.triggerId"
                type="button"
                :aria-label="`${component.name}. ${component.status.label}. Component details`"
                aria-haspopup="dialog"
                :aria-controls="component.panelId"
                :aria-expanded="Boolean(expanded[component.tag])"
                size="xs"
                :pill="true"
                :variant="component.status.variant"
                :appearance="component.status.appearance"
                class="max-sm:min-h-11">
                <span class="inline-flex items-center gap-1.5">
                    <SiteIcon :name="component.status.icon" />
                    {{ component.name }}
                    <span class="sr-only">{{ component.status.label }}</span>
                </span>
            </Button>
            <Popover
                :id="component.panelId"
                :for="component.triggerId"
                placement="bottom-start"
                @wa-after-show="syncExpanded(component.tag, $event)"
                @wa-after-hide="syncExpanded(component.tag, $event)">
                <div
                    class="flex w-72 max-w-[calc(100vw-3rem)] flex-col gap-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    <div class="flex flex-col gap-1">
                        <h3 class="text-base font-semibold text-slate-950 dark:text-white">
                            {{ component.name }}
                        </h3>
                        <p>{{ component.help }}</p>
                    </div>
                    <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                        <dt>Status</dt>
                        <dd class="font-medium text-slate-950 dark:text-white">
                            {{ component.status.label }}
                        </dd>
                        <dt>Element</dt>
                        <dd class="font-mono text-xs">{{ component.tag }}</dd>
                        <dt>Edition</dt>
                        <dd>{{ component.edition }}</dd>
                        <dt>Reviewed baseline</dt>
                        <dd>{{ catalog.coreBaseline }}</dd>
                        <template v-if="component.since"
                            ><dt>Since</dt>
                            <dd>{{ component.since }}</dd></template
                        >
                    </dl>
                    <p v-if="component.ownerHref">
                        Used with {{ component.ownerName }}. Their shared example includes this
                        public wrapper.
                    </p>
                    <p v-if="component.availability">
                        {{ component.availability }}
                    </p>
                    <p v-if="!component.implemented">
                        {{ component.status.description }}
                    </p>
                    <div
                        class="flex flex-col items-start gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
                        <DocsLink
                            v-if="component.implemented"
                            :href="component.exampleHref"
                            data-popover="close"
                            class="font-medium text-brand-700 underline underline-offset-4 dark:text-brand-400"
                            >Basic example</DocsLink
                        >
                        <DocsLink
                            v-if="component.ownerHref"
                            :href="component.ownerHref"
                            data-popover="close"
                            class="font-medium text-brand-700 underline underline-offset-4 dark:text-brand-400"
                            >Example with {{ component.ownerName }}</DocsLink
                        >
                        <DocsLink
                            v-if="component.guideHref"
                            :href="component.guideHref"
                            data-popover="close"
                            class="font-medium text-brand-700 underline underline-offset-4 dark:text-brand-400"
                            >Full guide</DocsLink
                        >
                        <DocsLink
                            :href="component.reference"
                            data-popover="close"
                            class="font-medium text-brand-700 underline underline-offset-4 dark:text-brand-400"
                            >Web Awesome reference</DocsLink
                        >
                    </div>
                </div>
            </Popover>
        </div>
    </div>
</template>
