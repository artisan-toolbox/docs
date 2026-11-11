<script setup>
import PopoverDemo from '@/components/demo/front-awesome/helpers/PopoverDemo.vue';
import AnimationDemo from '@/components/demo/front-awesome/helpers/AnimationDemo.vue';
import FormatBytesDemo from '@/components/demo/front-awesome/helpers/FormatBytesDemo.vue';
import FormatDateDemo from '@/components/demo/front-awesome/helpers/FormatDateDemo.vue';
import FormatNumberDemo from '@/components/demo/front-awesome/helpers/FormatNumberDemo.vue';
import IncludeDemo from '@/components/demo/front-awesome/helpers/IncludeDemo.vue';
import IntersectionObserverDemo from '@/components/demo/front-awesome/helpers/IntersectionObserverDemo.vue';
import MutationObserverDemo from '@/components/demo/front-awesome/helpers/MutationObserverDemo.vue';
import PopupDemo from '@/components/demo/front-awesome/helpers/PopupDemo.vue';
import RandomContentDemo from '@/components/demo/front-awesome/helpers/RandomContentDemo.vue';
import RelativeTimeDemo from '@/components/demo/front-awesome/helpers/RelativeTimeDemo.vue';
import ResizeObserverDemo from '@/components/demo/front-awesome/helpers/ResizeObserverDemo.vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CatalogContext from '@/components/docs/front-awesome/catalog/CatalogContext.vue';
import ComponentCatalog from '@/components/docs/front-awesome/catalog/ComponentCatalog.vue';

const popoverExample = `<script setup>
import { useId, useTemplateRef } from 'vue';
import { Popover, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const triggerId = useId();
const details = useTemplateRef('details');

function showDetails() {
    details.value.$el.show();
}

function hideDetails() {
    details.value.$el.hide();
}
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button :id="triggerId" type="button">Component details</Button>
        </div>
        <div class="min-w-0">
            <Popover ref="details" :for="triggerId" placement="bottom-start" :without-arrow="false">
                <p>Read the native Popover options.</p>
                <a href="https://webawesome.com/docs/components/popover/" data-popover="close"
                    >Web Awesome Popover reference</a
                >
            </Popover>
        </div>
        <div class="min-w-0">
            <Button type="button" @click.stop="showDetails">Show details</Button>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="hideDetails">Hide details</Button>
        </div>
    </div>
</template>
`;

const animationDemoSource = `<script setup>
import { ref } from 'vue';
import { Animation, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const playing = ref(false);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="playing = !playing">{{
                playing ? 'Stop animation' : 'Start animation'
            }}</Button>
        </div>
        <div class="min-w-0">
            <Animation name="bounce" :duration="1200" :play="playing">
                <div class="w-fit rounded bg-brand-700 p-4 text-white">Preview</div>
            </Animation>
        </div>
    </div>
</template>
`;
const formatBytesDemoSource = `<script setup>
import { FormatBytes } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <p>File size: <FormatBytes :value="2048" unit="byte" lang="en" /></p>
        </div>
    </div>
</template>
`;
const formatDateDemoSource = `<script setup>
import { FormatDate } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <FormatDate
                date="2026-11-09T12:00:00Z"
                lang="en"
                month="long"
                day="numeric"
                year="numeric"
                time-zone="UTC" />
        </div>
    </div>
</template>
`;
const formatNumberDemoSource = `<script setup>
import { FormatNumber } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <FormatNumber :value="1234.5" type="currency" currency="USD" lang="en-US" />
        </div>
    </div>
</template>
`;
const includeDemoSource = `<script setup>
import { ref } from 'vue';
import { Include, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const status = ref('Ready');
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button
                @click="
                    loaded = !loaded;
                    status = loaded ? 'Loading local content...' : 'Ready';
                "
                >{{ loaded ? 'Reset include' : 'Load local content' }}</Button
            >
        </div>
        <div class="min-w-0">
            <Include
                v-if="loaded"
                src="/examples/front-awesome/include.html"
                @wa-load="status = 'Local content loaded'"
                @wa-error="status = 'Content unavailable. Reset and try again.'" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">{{ status }}</output>
        </div>
    </div>
</template>
`;
const intersectionObserverDemoSource = `<script setup>
import { ref } from 'vue';
import { IntersectionObserver, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const observing = ref(false);
const events = ref(0);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="observing = !observing">{{
                observing ? 'Stop observing' : 'Start observing'
            }}</Button>
        </div>
        <div class="min-w-0">
            <IntersectionObserver :disabled="!observing" @wa-intersect="events++">
                <div class="rounded border p-8">Observed panel</div>
            </IntersectionObserver>
        </div>
        <div class="min-w-0">
            <output>Intersection events: {{ events }}</output>
        </div>
    </div>
</template>
`;
const mutationObserverDemoSource = `<script setup>
import { ref } from 'vue';
import { MutationObserver, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const observing = ref(false);
const changed = ref(false);
const events = ref(0);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="observing = !observing">{{
                observing ? 'Stop observing' : 'Start observing'
            }}</Button>
        </div>
        <div class="min-w-0">
            <MutationObserver attr="data-state" :disabled="!observing" @wa-mutation="events++">
                <Button type="button" :data-state="changed" @click="changed = !changed">
                    Change observed attribute
                </Button>
            </MutationObserver>
        </div>
        <div class="min-w-0">
            <output>Mutation events: {{ events }}</output>
        </div>
    </div>
</template>
`;
const popupDemoSource = `<script setup>
import { ref } from 'vue';
import { Popup, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const active = ref(false);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="active = !active">{{ active ? 'Hide popup' : 'Show popup' }}</Button>
        </div>
        <div class="min-w-0">
            <Popup :active="active" placement="bottom" :distance="8">
                <span slot="anchor" class="inline-block rounded border p-3">Anchor</span>
                <div class="rounded border bg-white p-4 text-black">Positioned content</div>
            </Popup>
        </div>
    </div>
</template>
`;
const randomContentDemoSource = `<script setup>
import { useTemplateRef } from 'vue';
import { RandomContent, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const content = useTemplateRef('content');
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <RandomContent ref="content" mode="sequence" :autoplay="false">
                <p>Check installation.</p>
                <p>Review compatibility.</p>
                <p>Run the tests.</p>
            </RandomContent>
        </div>
        <div class="min-w-0">
            <Button @click="content.$el.randomize()">Next tip</Button>
        </div>
    </div>
</template>
`;
const relativeTimeDemoSource = `<script setup>
import { RelativeTime } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <RelativeTime date="2026-11-09T12:00:00Z" lang="en" :sync="false" />
        </div>
    </div>
</template>
`;
const resizeObserverDemoSource = `<script setup>
import { ref } from 'vue';
import { ResizeObserver, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const observing = ref(false);
const events = ref(0);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="observing = !observing">{{
                observing ? 'Stop observing' : 'Start observing'
            }}</Button>
        </div>
        <div class="min-w-0">
            <ResizeObserver :disabled="!observing" @wa-resize="events++">
                <div class="h-28 w-48 max-w-full resize overflow-auto rounded border p-4">
                    Drag this panel corner.
                </div>
            </ResizeObserver>
        </div>
        <div class="min-w-0">
            <output>Resize events: {{ events }}</output>
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
            <ComponentCatalog group="helpers" :navigation="navigation" />
        </ProseSection>
        <ProseSection id="popover" title="Popover">
            <p>
                Put interactive content, including links, in the Popover's default slot. Render a
                Button with a unique ID before the Popover and pass that ID to its native
                <code>for</code>
                attribute. The wrapper renders and registers one
                <code>wa-popover</code>.
            </p>
            <DemoFrame
                data-catalog-demo="Popover"
                title="Popover example"
                :sources="[
                    { label: 'Popover basic example', language: 'vue', code: popoverExample },
                ]">
                <PopoverDemo />
            </DemoFrame>
            <p>
                Expected result. Activate Component details with a click, Enter, or Space to open a
                panel containing a working reference link. Tab reaches the link. Activating it
                follows the reference and dismisses the panel through
                <code>data-popover="close"</code>. Escape closes the panel and returns focus to its
                trigger. Clicking outside also closes the panel.
            </p>
            <p>
                Show details and Hide details call the native
                <code>show()</code> and <code>hide()</code> methods through the component ref's
                <code>$el</code>. Both return promises that resolve after their transition events.
                The opening helper stops its click from reaching native outside-click dismissal. A
                canceled show or hide has no corresponding after event, so do not await its promise
                when canceling that transition.
            </p>
            <p>
                Bind <code>open</code> and <code>withoutArrow</code> as booleans. Control visibility
                with <code>:open="isOpen"</code> when using declarative state, or use native methods
                as this example does. Native <code>placement</code>, <code>distance</code>, and
                <code>skidding</code> pass through. The <code>for</code> target must already exist
                in the same document or shadow root.
            </p>
            <p>
                Listen with <code>@wa-show</code>, <code>@wa-after-show</code>,
                <code>@wa-hide</code>, or <code>@wa-after-hide</code> to receive the original native
                <code>Event</code>. The show and hide events are cancelable. The wrapper adds no
                trigger ARIA attributes. If your trigger exposes <code>aria-expanded</code>, update
                it from the actual native state after successful transition events.
            </p>
            <p>
                For TypeScript consumers, <code>PopoverProps</code> is exported from
                <code>@artisan-toolbox/front-awesome</code>. The direct
                <code>@artisan-toolbox/front-awesome/components/WebAwesome/Popover.vue</code>
                entry is also public. Consult the
                <DocsLink href="https://webawesome.com/docs/components/popover/"
                    >Web Awesome Popover reference</DocsLink
                >
                for native positioning and dismissal options.
            </p>
        </ProseSection>
        <ProseSection id="wrapper-availability" title="Wrapper availability">
            <p>
                Every Core wrapper in this group is available in Front Awesome 1.0.0-alpha.2. Check
                the installed exports before using these examples in a released application.
            </p>
        </ProseSection>
        <ProseSection id="animation" title="Animation">
            <p>Apply an animation to an element.</p>
            <DemoFrame
                data-catalog-demo="Animation"
                title="Animation example"
                :sources="[
                    {
                        label: 'Animation basic example',
                        language: 'vue',
                        code: animationDemoSource,
                    },
                ]">
                <AnimationDemo />
            </DemoFrame>
            <p>
                Expected result. Start animation bounces the Preview box. Stop animation pauses it.
                The initial state is paused.
            </p>
        </ProseSection>
        <ProseSection id="format-bytes" title="Format Bytes">
            <p>Format a byte count for display.</p>
            <DemoFrame
                data-catalog-demo="FormatBytes"
                title="Format Bytes example"
                :sources="[
                    {
                        label: 'Format Bytes basic example',
                        language: 'vue',
                        code: formatBytesDemoSource,
                    },
                ]">
                <FormatBytesDemo />
            </DemoFrame>
            <p>
                Expected result. The file size is formatted in English using a suitable byte unit
                for 2048 bytes.
            </p>
        </ProseSection>
        <ProseSection id="format-date" title="Format Date">
            <p>Format a date for a locale.</p>
            <DemoFrame
                data-catalog-demo="FormatDate"
                title="Format Date example"
                :sources="[
                    {
                        label: 'Format Date basic example',
                        language: 'vue',
                        code: formatDateDemoSource,
                    },
                ]">
                <FormatDateDemo />
            </DemoFrame>
            <p>
                Expected result. The date displays November 9, 2026 in English with the UTC
                timezone.
            </p>
        </ProseSection>
        <ProseSection id="format-number" title="Format Number">
            <p>Format a numeric value for a locale.</p>
            <DemoFrame
                data-catalog-demo="FormatNumber"
                title="Format Number example"
                :sources="[
                    {
                        label: 'Format Number basic example',
                        language: 'vue',
                        code: formatNumberDemoSource,
                    },
                ]">
                <FormatNumberDemo />
            </DemoFrame>
            <p>
                Expected result. The number displays $1,234.50 using the US English currency format.
            </p>
        </ProseSection>
        <ProseSection id="include" title="Include">
            <p>Load external HTML into a region.</p>
            <DemoFrame
                data-catalog-demo="Include"
                title="Include example"
                :sources="[
                    { label: 'Include basic example', language: 'vue', code: includeDemoSource },
                ]">
                <IncludeDemo />
            </DemoFrame>
            <p>
                Expected result. Load local content requests the local HTML fixture and displays
                Local package guide. Errors appear in the status. Include only trusted HTML.
            </p>
        </ProseSection>
        <ProseSection id="intersection-observer" title="Intersection Observer">
            <p>Observe when an element enters a region.</p>
            <DemoFrame
                data-catalog-demo="IntersectionObserver"
                title="Intersection Observer example"
                :sources="[
                    {
                        label: 'Intersection Observer basic example',
                        language: 'vue',
                        code: intersectionObserverDemoSource,
                    },
                ]">
                <IntersectionObserverDemo />
            </DemoFrame>
            <p>
                Expected result. Start observing enables native intersection tracking. Scroll the
                panel into or out of view to increment the event count. Stop observing disables
                tracking.
            </p>
        </ProseSection>
        <ProseSection id="mutation-observer" title="Mutation Observer">
            <p>Observe changes to an element.</p>
            <DemoFrame
                data-catalog-demo="MutationObserver"
                title="Mutation Observer example"
                :sources="[
                    {
                        label: 'Mutation Observer basic example',
                        language: 'vue',
                        code: mutationObserverDemoSource,
                    },
                ]">
                <MutationObserverDemo />
            </DemoFrame>
            <p>
                Expected result. Start observing, then activate Change observed attribute. The
                native mutation event updates the count. Stop observing disables tracking.
            </p>
        </ProseSection>
        <ProseSection id="popup" title="Popup">
            <p>Position floating content near an anchor.</p>
            <DemoFrame
                data-catalog-demo="Popup"
                title="Popup example"
                :sources="[
                    { label: 'Popup basic example', language: 'vue', code: popupDemoSource },
                ]">
                <PopupDemo />
            </DemoFrame>
            <p>
                Expected result. Show popup positions content below Anchor. Hide popup removes the
                positioned content. Popup supplies positioning rather than dialog semantics.
            </p>
        </ProseSection>
        <ProseSection id="random-content" title="Random Content">
            <p>Generate placeholder content.</p>
            <DemoFrame
                data-catalog-demo="RandomContent"
                title="Random Content example"
                :sources="[
                    {
                        label: 'Random Content basic example',
                        language: 'vue',
                        code: randomContentDemoSource,
                    },
                ]">
                <RandomContentDemo />
            </DemoFrame>
            <p>
                Expected result. Next tip moves through three local tips in sequence. No automatic
                timer runs.
            </p>
        </ProseSection>
        <ProseSection id="relative-time" title="Relative Time">
            <p>Display a date relative to the current time.</p>
            <DemoFrame
                data-catalog-demo="RelativeTime"
                title="Relative Time example"
                :sources="[
                    {
                        label: 'Relative Time basic example',
                        language: 'vue',
                        code: relativeTimeDemoSource,
                    },
                ]">
                <RelativeTimeDemo />
            </DemoFrame>
            <p>
                Expected result. The fixed date appears relative to your current clock. The wording
                depends on when you view the example. Periodic synchronization is disabled.
            </p>
        </ProseSection>
        <ProseSection id="resize-observer" title="Resize Observer">
            <p>Observe changes to an element's size.</p>
            <DemoFrame
                data-catalog-demo="ResizeObserver"
                title="Resize Observer example"
                :sources="[
                    {
                        label: 'Resize Observer basic example',
                        language: 'vue',
                        code: resizeObserverDemoSource,
                    },
                ]">
                <ResizeObserverDemo />
            </DemoFrame>
            <p>
                Expected result. Start observing and drag the panel corner to change its size. The
                native resize events update the count. Stop observing disables tracking.
            </p>
        </ProseSection>
    </article>
</template>
