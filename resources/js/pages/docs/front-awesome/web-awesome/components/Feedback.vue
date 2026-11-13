<script setup>
import TooltipDemo from '@/components/demo/front-awesome/feedback/TooltipDemo.vue';
import TagDemo from '@/components/demo/front-awesome/feedback/TagDemo.vue';
import BadgeDemo from '@/components/demo/front-awesome/feedback/BadgeDemo.vue';
import CalloutDemo from '@/components/demo/front-awesome/feedback/CalloutDemo.vue';
import ProgressBarDemo from '@/components/demo/front-awesome/feedback/ProgressBarDemo.vue';
import ProgressRingDemo from '@/components/demo/front-awesome/feedback/ProgressRingDemo.vue';
import SkeletonDemo from '@/components/demo/front-awesome/feedback/SkeletonDemo.vue';
import SpinnerDemo from '@/components/demo/front-awesome/feedback/SpinnerDemo.vue';
import ToastDemo from '@/components/demo/front-awesome/feedback/ToastDemo.vue';
import ToastItemDemo from '@/components/demo/front-awesome/feedback/ToastItemDemo.vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CatalogContext from '@/components/docs/front-awesome/catalog/CatalogContext.vue';
import ComponentCatalog from '@/components/docs/front-awesome/catalog/ComponentCatalog.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

const tagExample = `<script setup>
import { ref } from 'vue';
import { Tag } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const selected = ref(true);

function removeSelection() {
    selected.value = false;
}
\x3C/script>

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
`;
const tooltipExample = `<script setup>
import { useId, useTemplateRef } from 'vue';
import { Tooltip, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const targetId = useId();
const help = useTemplateRef('help');

function showHelp() {
    help.value.$el.show();
}

function hideHelp() {
    help.value.$el.hide();
}
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <div class="min-w-0">
                <Button :id="targetId" type="button">Save help</Button>
                <Tooltip
                    ref="help"
                    :for="targetId"
                    placement="top"
                    :disabled="false"
                    :without-arrow="false"
                    :show-delay="300"
                    :hide-delay="100"
                    >Save help. Stores this draft without publishing it.</Tooltip
                >
            </div>
        </div>
        <div class="min-w-0">
            <div class="flex flex-wrap gap-2">
                <Button type="button" @click.stop="showHelp">Show help</Button>
                <Button type="button" @click="hideHelp">Hide help</Button>
            </div>
        </div>
    </div>
</template>
`;

const badgeDemoSource = `<script setup>
import { Badge } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <p>Documentation <Badge variant="success" :pill="true">Current</Badge></p>
        </div>
    </div>
</template>
`;
const calloutDemoSource = `<script setup>
import { Callout } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Callout variant="warning">
                <strong>Beta APIs</strong>
                <p>The API can change before the first stable release.</p>
            </Callout>
        </div>
    </div>
</template>
`;
const progressBarDemoSource = `<script setup>
import { ref } from 'vue';
import { ProgressBar, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const value = ref(25);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <ProgressBar :value="value" aria-label="Checklist progress">{{ value }}%</ProgressBar>
        </div>
        <div class="min-w-0">
            <Button @click="value = value === 100 ? 0 : value + 25">Advance or reset</Button>
        </div>
    </div>
</template>
`;
const progressRingDemoSource = `<script setup>
import { ref } from 'vue';
import { ProgressRing, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const value = ref(25);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <ProgressRing :value="value" aria-label="Checklist progress">{{ value }}%</ProgressRing>
        </div>
        <div class="min-w-0">
            <Button @click="value = value === 100 ? 0 : value + 25">Advance or reset</Button>
        </div>
    </div>
</template>
`;
const skeletonDemoSource = `<script setup>
import { ref } from 'vue';
import { Button, Skeleton } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const animate = ref(false);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-5" data-docs-outline-exclude>
        <div class="min-w-0">
            <div class="grid gap-5 sm:grid-cols-3">
                <div class="flex min-w-0 flex-col gap-3">
                    <p class="text-sm font-medium">Static</p>
                    <Skeleton effect="none" class="h-6 w-full max-w-48" />
                </div>
                <div class="flex min-w-0 flex-col gap-3">
                    <p class="text-sm font-medium">Pulse</p>
                    <Skeleton :effect="animate ? 'pulse' : 'none'" class="h-6 w-full max-w-48" />
                </div>
                <div class="flex min-w-0 flex-col gap-3">
                    <p class="text-sm font-medium">Sheen</p>
                    <Skeleton :effect="animate ? 'sheen' : 'none'" class="h-6 w-full max-w-48" />
                </div>
            </div>
        </div>
        <div class="min-w-0">
            <div class="min-w-0">
                <Button type="button" @click="animate = !animate">{{
                    animate ? 'Pause animations' : 'Animate placeholders'
                }}</Button>
            </div>
        </div>
        <div class="min-w-0">
            <output aria-live="polite">{{
                animate ? 'Pulse and sheen animations running.' : 'Animations paused.'
            }}</output>
        </div>
    </div>
</template>
`;
const spinnerDemoSource = `<script setup>
import { ref } from 'vue';
import { Spinner, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const active = ref(false);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="active = !active">{{
                active ? 'Stop spinner' : 'Start spinner'
            }}</Button>
        </div>
        <div class="min-w-0">
            <Spinner v-if="active" aria-label="Loading preview" />
            <p v-else>Spinner stopped.</p>
        </div>
    </div>
</template>
`;
const toastDemoSource = `<script setup>
import { ref, useTemplateRef } from 'vue';
import { Toast, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const notifications = useTemplateRef('notifications');
const status = ref('Ready');
async function showNotification() {
    status.value = 'Creating notification...';
    try {
        await notifications.value.$el.create('Draft saved.', {
            variant: 'success',
            duration: 5000,
        });
        status.value = 'Notification created';
    } catch {
        status.value = 'Notification unavailable. Try again.';
    }
}
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="showNotification">Show notification</Button>
        </div>
        <div class="min-w-0">
            <Toast ref="notifications" placement="bottom-end" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">{{ status }}</output>
        </div>
    </div>
</template>
`;
const toastItemDemoSource = `<script setup>
import { ref } from 'vue';
import { ToastItem, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const visible = ref(false);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="visible = !visible">{{
                visible ? 'Reset notification' : 'Show notification item'
            }}</Button>
        </div>
        <div class="min-w-0">
            <ToastItem
                v-if="visible"
                variant="success"
                :duration="0"
                @wa-after-hide="visible = false"
                >Draft saved.</ToastItem
            >
        </div>
    </div>
</template>
`;

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <CatalogContext :navigation="navigation" />
        <ProseSection id="components" title="Component status" :prose="false">
            <ComponentCatalog group="feedback" :navigation="navigation" />
        </ProseSection>
        <ProseSection id="tag" title="Tag">
            <p>
                Label a status or selection with the Tag wrapper. Its default slot is the label
                inside one native <code>wa-tag</code>. The wrapper registers the element when it
                mounts.
            </p>
            <DemoFrame
                data-catalog-demo="Tag"
                title="Tag example"
                :sources="[{ label: 'Tag basic example', language: 'vue', code: tagExample }]">
                <TagDemo />
            </DemoFrame>
            <p>
                Expected result. A small green outlined pill displays Published. Activate its remove
                button to replace it with No status selected. The <code>wa-remove</code> event
                carries the original <code>Event</code>. Your handler owns removing the tag or its
                data.
            </p>
            <p>
                Bind <code>pill</code> and <code>withRemove</code> as booleans. Native
                <code>variant</code>, <code>appearance</code>, and <code>size</code> attributes
                remain available. For TypeScript consumers, <code>TagProps</code> is exported from
                <code>@artisan-toolbox/front-awesome</code>. The direct
                <code>@artisan-toolbox/front-awesome/components/WebAwesome/Tag.vue</code>
                entry is also public.
            </p>
            <p>
                Consult the
                <DocsLink href="https://webawesome.com/docs/components/tag/"
                    >Web Awesome Tag reference</DocsLink
                >
                for native options and styles.
            </p>
        </ProseSection>
        <ProseSection id="tooltip" title="Tooltip">
            <p>
                Give a focusable target a unique ID and pass it to the Tooltip's native
                <code>for</code> attribute. Its default slot contains the help text, not the target.
                The wrapper renders and registers one <code>wa-tooltip</code>.
            </p>
            <DemoFrame
                data-catalog-demo="Tooltip"
                title="Tooltip example"
                :sources="[
                    { label: 'Tooltip basic example', language: 'vue', code: tooltipExample },
                ]">
                <TooltipDemo />
            </DemoFrame>
            <p>
                Expected result. Hover over, focus, or tap Save help to display its explanation.
                Show help and Hide help call the native
                <code>show()</code> and <code>hide()</code> methods through the component ref's
                <code>$el</code>. Both methods return a promise. The opening helper stops its click
                before native outside-click dismissal. Mouse entry waits 300 milliseconds and mouse
                exit waits 100 milliseconds in this example.
            </p>
            <p>
                Bind <code>disabled</code>, <code>open</code>, and <code>withoutArrow</code> as
                booleans. Set numeric <code>showDelay</code> and <code>hideDelay</code> values with
                Vue bindings. Set <code>open</code> when controlling visibility declaratively, or
                use the native methods as this example does. Native attributes such as
                <code>placement</code>, <code>distance</code>, <code>skidding</code>, and
                <code>trigger</code> pass through.
            </p>
            <p>
                Listen with <code>@wa-show</code>, <code>@wa-after-show</code>,
                <code>@wa-hide</code>, or <code>@wa-after-hide</code> to receive the original native
                <code>Event</code>. For TypeScript consumers, <code>TooltipProps</code> is exported
                from <code>@artisan-toolbox/front-awesome</code>. The direct
                <code>@artisan-toolbox/front-awesome/components/WebAwesome/Tooltip.vue</code>
                entry is also public.
            </p>
            <p>
                Web Awesome associates the tooltip with
                <code>aria-labelledby</code>. Include the target's name in its text so the
                accessible name keeps that context. Keep links and buttons outside the tooltip.
                Essential instructions also belong in visible page text. Consult the
                <DocsLink href="https://webawesome.com/docs/components/tooltip/"
                    >Web Awesome Tooltip reference</DocsLink
                >
                for native activation and positioning options.
            </p>
        </ProseSection>
        <ProseSection id="native-toast-integration" title="Use toast services today">
            <p>
                The Toast and Toast Item wrappers below provide direct Vue access to the native
                elements. Existing notification services remain available for application
                integration. Follow
                <DocsLink
                    :href="findNavigationItem(navigation, 'front-awesome/toasts/laravel').href"
                    >Laravel toast integration</DocsLink
                >
                or
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/toasts/vue').href"
                    >Vue toast integration</DocsLink
                >. The
                <DocsLink href="https://webawesome.com/docs/components/toast/"
                    >Web Awesome Toast reference</DocsLink
                >
                describes the upstream element.
            </p>
        </ProseSection>
        <ProseSection id="badge" title="Badge">
            <p>Display a compact status or count.</p>
            <DemoFrame
                data-catalog-demo="Badge"
                title="Badge example"
                :sources="[
                    { label: 'Badge basic example', language: 'vue', code: badgeDemoSource },
                ]">
                <BadgeDemo />
            </DemoFrame>
            <p>Expected result. A green Current badge appears beside Documentation.</p>
        </ProseSection>
        <ProseSection id="callout" title="Callout">
            <p>Draw attention to contextual information.</p>
            <DemoFrame
                data-catalog-demo="Callout"
                title="Callout example"
                :sources="[
                    { label: 'Callout basic example', language: 'vue', code: calloutDemoSource },
                ]">
                <CalloutDemo />
            </DemoFrame>
            <p>
                Expected result. A warning callout displays the beta stability notice as visible
                text.
            </p>
        </ProseSection>
        <ProseSection id="progress-bar" title="Progress Bar">
            <p>Display progress along a horizontal track.</p>
            <DemoFrame
                data-catalog-demo="ProgressBar"
                title="Progress Bar example"
                :sources="[
                    {
                        label: 'Progress Bar basic example',
                        language: 'vue',
                        code: progressBarDemoSource,
                    },
                ]">
                <ProgressBarDemo />
            </DemoFrame>
            <p>
                Expected result. Advance or reset increases progress by 25 percentage points. After
                100%, the next action resets to zero.
            </p>
        </ProseSection>
        <ProseSection id="progress-ring" title="Progress Ring">
            <p>Display progress around a circular track.</p>
            <DemoFrame
                data-catalog-demo="ProgressRing"
                title="Progress Ring example"
                :sources="[
                    {
                        label: 'Progress Ring basic example',
                        language: 'vue',
                        code: progressRingDemoSource,
                    },
                ]">
                <ProgressRingDemo />
            </DemoFrame>
            <p>
                Expected result. Advance or reset increases progress by 25 percentage points. After
                100%, the next action resets to zero.
            </p>
        </ProseSection>
        <ProseSection id="skeleton" title="Skeleton">
            <p>Reserve space while content loads.</p>
            <DemoFrame
                data-catalog-demo="Skeleton"
                title="Skeleton example"
                :sources="[
                    { label: 'Skeleton basic example', language: 'vue', code: skeletonDemoSource },
                ]">
                <SkeletonDemo />
            </DemoFrame>
            <p>
                Expected result. Three visible placeholders compare static, pulse and sheen effects.
                Animate placeholders starts the two animations. Pause animations restores static
                placeholders. Keep the native flex display so its indicator fills the reserved
                height.
            </p>
        </ProseSection>
        <ProseSection id="spinner" title="Spinner">
            <p>Indicate ongoing work.</p>
            <DemoFrame
                data-catalog-demo="Spinner"
                title="Spinner example"
                :sources="[
                    { label: 'Spinner basic example', language: 'vue', code: spinnerDemoSource },
                ]">
                <SpinnerDemo />
            </DemoFrame>
            <p>
                Expected result. Start spinner shows a loading indicator. Stop spinner removes it.
                No animation starts until you act.
            </p>
        </ProseSection>
        <ProseSection id="toast" title="Toast">
            <p>Manage brief notifications.</p>
            <DemoFrame
                data-catalog-demo="Toast"
                title="Toast example"
                :sources="[
                    { label: 'Toast basic example', language: 'vue', code: toastDemoSource },
                ]">
                <ToastDemo />
            </DemoFrame>
            <p>
                Expected result. Show notification creates a success toast with Draft saved. The
                toast dismisses after five seconds.
            </p>
        </ProseSection>
        <ProseSection id="toast-item" title="Toast Item">
            <p>Display one toast notification.</p>
            <DemoFrame
                data-catalog-demo="ToastItem"
                title="Toast Item example"
                :sources="[
                    {
                        label: 'Toast Item basic example',
                        language: 'vue',
                        code: toastItemDemoSource,
                    },
                ]">
                <ToastItemDemo />
            </DemoFrame>
            <p>
                Expected result. Show notification item displays Draft saved without a dismissal
                timer. Its native close button or Reset notification removes it.
            </p>
        </ProseSection>
    </article>
</template>
