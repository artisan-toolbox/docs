<script setup>
import DemoFrame from '@/components/demo/DemoFrame.vue';
import ScrollbarDemo from '@/components/demo/front-awesome/styling/ScrollbarDemo.vue';
import ScrollbarShadowsDemo from '@/components/demo/front-awesome/styling/ScrollbarShadowsDemo.vue';
import shadowDemoSource from '../../../components/demo/front-awesome/styling/ScrollbarShadowsDemo.vue?raw';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const plugin = `import { createFrontAwesome } from '@artisan-toolbox/front-awesome';

// In the options passed to createInertiaApp:
withApp(app) {
    app.use(createFrontAwesome({
        scrollbar: { defaultVariant: 'brand' },
    }));
}`;

const usage = `<template>
    <section
        v-scrollbar.brand="{ scrollbars: { autoHide: 'leave' } }"
        aria-label="Notifications"
        tabindex="0"
        class="max-h-48 overflow-auto">
        <ol>
            <li v-for="number in 12" :key="number">Notification {{ number }}</li>
        </ol>
    </section>
</template>`;

const demoSource = `<script setup>
import { computed, h, ref, withDirectives } from 'vue';
import * as frontAwesome from '@artisan-toolbox/front-awesome';
import { Select } from '@artisan-toolbox/front-awesome/components/WebAwesome';
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
    const title = \`\${mode} notifications\`;
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
                    h('li', { key: index }, \`Notification \${index + 1}\`),
                ),
            ),
        ],
    );

    return scrollbarDirective
        ? withDirectives(panel, [[scrollbarDirective, options, undefined, { [variant]: true }]])
        : panel;
}

Preview.props = ['mode', 'variant', 'options'];
\x3C/script>

<template>
    <div class="grid min-w-0 gap-4">
        <div v-if="scrollbarDirective" class="grid min-w-0 gap-3 @lg:grid-cols-3">
            <Select
                v-model="variant"
                label="Thumb color"
                option-value="value"
                option-label="label"
                :options="variants.map((label) => ({ value: label.toLowerCase(), label }))" />
            <Select
                v-model="autoHide"
                label="Auto-hide"
                option-value="value"
                option-label="label"
                :options="[
                    { value: 'never', label: 'Never' },
                    { value: 'scroll', label: 'After scrolling' },
                    { value: 'leave', label: 'When the pointer leaves' },
                ]" />
            <Select
                v-model="trackClick"
                label="Track clicks"
                option-value="value"
                option-label="label"
                :options="[
                    { value: 'instant', label: 'Jump to position' },
                    { value: 'page', label: 'Scroll by a page' },
                    { value: 'none', label: 'Ignore track clicks' },
                ]" />
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
`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection>
            <DocsCallout variant="note">
                <template #title>Beta availability</template>
                The directive is available in Front Awesome 1.0.0-beta.4 and later.
            </DocsCallout>
        </ProseSection>
        <ProseSection id="try-the-scrollbar" title="Try the scrollbar">
            <p>
                Scroll either panel, then change <strong>Thumb color</strong>. Both thumbs update
                for their local light or dark theme. Try <strong>Auto-hide</strong> and
                <strong>Track clicks</strong> to compare the same settings in both panels. Focus a
                panel and press End to reach Notification 12.
            </p>
            <DemoFrame
                title="Scrollbar settings"
                :sources="[{ label: 'ScrollbarDemo.vue', language: 'vue', code: demoSource }]">
                <ScrollbarDemo />
            </DemoFrame>
        </ProseSection>
        <ProseSection id="style-a-scrollbar" title="Add the directive">
            <p>
                Load the
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/shared-theme').href"
                    >shared Tailwind theme</DocsLink
                >
                and
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/vue-plugin').href"
                    >install the Vue plugin</DocsLink
                >
                with <code>app.use(createFrontAwesome())</code>. Apply the directive to the element
                with a bounded size and <code>overflow: auto</code> or
                <code>overflow: scroll</code>.
            </p>
            <CodeExample label="Use a brand scrollbar" language="vue" :code="usage" />
            <p>
                The example scrolls 12 notifications in a height-limited panel. The thumb uses the
                local brand color. An explicit modifier overrides the app default. Choose
                <code>.neutral</code>, <code>.brand</code>, <code>.success</code>,
                <code>.warning</code>, or <code>.danger</code>.
            </p>
            <p>
                Set <code>scrollbar.defaultVariant</code> in your existing plugin registration to
                choose a color for every bare <code>v-scrollbar</code> in that Vue app. The default
                is <code>'neutral'</code>. Use <code>v-scrollbar.neutral</code> to request neutral
                explicitly.
            </p>
            <CodeExample label="Set the app scrollbar color" language="javascript" :code="plugin" />
            <p>
                With this setup, the DataView table, print preview, and permission editor use the
                brand color from their local theme. The separately exported
                <code>scrollbarDirective</code> defaults to neutral when registered on its own.
            </p>
        </ProseSection>
        <ProseSection id="configure-scrollbar-behavior" title="Configure scrollbar behavior">
            <p>
                Pass
                <DocsLink href="https://github.com/KingSora/OverlayScrollbars#options"
                    >OverlayScrollbars options</DocsLink
                >
                as the directive value. Import <code>ScrollbarOptions</code> from
                <code>@artisan-toolbox/front-awesome</code> for typed bindings. Changing an option
                updates the same instance. Removing an option restores its default.
            </p>
            <ul>
                <li>
                    <code>scrollbars.autoHide</code> controls when the thumb hides. The default
                    follows whether the browser uses overlay scrollbars. The demo starts with
                    <code>'never'</code> so you can see the colors immediately.
                </li>
                <li>
                    <code>scrollbars.clickScroll</code> defaults to <code>'instant'</code>. Set
                    <code>true</code> to move by a page or <code>false</code> to ignore track
                    clicks.
                </li>
            </ul>
            <p>
                A Vue template modifier is fixed. To switch colors at runtime, use Vue's
                <code>withDirectives</code> with the exported <code>scrollbarDirective</code>, as
                shown in the demo source.
            </p>
        </ProseSection>
        <ProseSection id="show-edge-shadows" title="Show edge shadows">
            <p>
                In Front Awesome 1.0.0-beta.8 and later, set <code>shadows: true</code> to show
                where more content is available. The directive fades the top and bottom edges for
                vertical overflow and the left and right edges for horizontal overflow. Shadows are
                off by default.
            </p>
            <DemoFrame
                title="Shadows on both scroll axes"
                :sources="[
                    { label: 'ScrollbarShadowsDemo.vue', language: 'vue', code: shadowDemoSource },
                ]">
                <ScrollbarShadowsDemo />
            </DemoFrame>
            <p>
                Scroll the notifications down and the months sideways. Midway through either panel,
                both edges show a shadow. At the end, the shadow remains only on the edge you
                scrolled away from. A panel with overflow on both axes can show four shadows.
            </p>
            <p>
                Shadows follow the local surface color and are <code>2rem</code> wide or tall. Set
                <code>--fa-scrollbar-shadow-color</code> or
                <code>--fa-scrollbar-shadow-size</code> on the scroll region to customize them.
                Shadows appear with OverlayScrollbars. Forced colors and other native scrollbar
                fallbacks use the browser scrollbar alone.
            </p>
        </ProseSection>
        <ProseSection id="native-scroll-behavior" title="Keep native scroll behavior">
            <p>
                The element remains the scroll target for Vue refs, scroll events, and Inertia's
                <code>scroll-region</code>. Keep a name and a focus target if readers need to scroll
                the area with a keyboard. OverlayScrollbars adds its rails inside the region, so
                wrap content if selectors such as <code>:last-child</code> rely on its children.
            </p>
            <p>
                Server rendering, forced colors, and native form controls use the browser scrollbar.
                To color a native scrollbar from HTML, use <code>fa-scrollbar</code> or a variant
                class such as <code>fa-scrollbar-brand</code>.
            </p>
        </ProseSection>
    </article>
</template>
