<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import IconTransformsDemo from '@/components/demo/front-awesome/media/IconTransformsDemo.vue';
import IconEventsDemo from '@/components/demo/front-awesome/media/IconEventsDemo.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({ navigation: { type: Array, required: true } });

const svgExample = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <path fill="currentColor" d="M2 7h5V2h2v5h5v2H9v5H7V9H2z" />
</svg>`;

const transformDemoSource = `<script setup>
import { ref } from 'vue';
import { Icon, Button } from '@artisan-toolbox/front-awesome/components';

const visible = ref(false);
const spinning = ref(false);

function reset() {
    visible.value = false;
    spinning.value = false;
}
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-5" data-docs-outline-exclude>
        <div class="flex flex-wrap gap-2">
            <Button type="button" @click="visible = true">Show transformations</Button>
            <Button type="button" appearance="plain" @click="reset">Reset transformations</Button>
        </div>
        <div v-if="visible" class="grid grid-cols-2 gap-5 text-sm @sm:grid-cols-3">
            <div class="flex flex-col items-start gap-2">
                <Icon name="arrow-up" :rotate="90" label="Right" class="text-2xl" /><span
                    >Rotate 90°</span
                >
            </div>
            <div class="flex flex-col items-start gap-2">
                <Icon name="arrow-up" flip="y" label="Down" class="text-2xl" /><span
                    >Flip vertically</span
                >
            </div>
            <div
                v-for="canvas in ['auto', 'fixed', 'square', 'roomy']"
                :key="canvas"
                class="flex flex-col items-start gap-2">
                <Icon
                    name="house"
                    :canvas="canvas"
                    :label="\`\${canvas} canvas\`"
                    class="text-2xl" /><span>{{ canvas }} canvas</span>
            </div>
        </div>
        <div v-if="visible" class="flex flex-wrap items-center gap-3">
            <Button type="button" @click="spinning = !spinning">{{
                spinning ? 'Pause icon animation' : 'Start icon animation'
            }}</Button>
            <Icon
                name="spinner"
                :animation="spinning ? 'spin' : undefined"
                label="Loading"
                class="text-2xl" />
        </div>
    </div>
</template>
`;
const eventsDemoSource = `<script setup>
import { ref } from 'vue';
import { Icon, Button } from '@artisan-toolbox/front-awesome/components';

const source = ref(null);
const status = ref('Choose a local icon source.');
let attempt = 0;

function load(valid) {
    source.value = \`/examples/front-awesome/\${valid ? 'icon-add' : 'icon-missing'}.svg?attempt=\${++attempt}\`;
    status.value = 'Loading icon.';
}

/** @type {NonNullable<import('@artisan-toolbox/front-awesome').IconProps['onWaLoad']>} */
const onLoad = () => {
    if (source.value) status.value = 'Icon loaded.';
};

/** @type {NonNullable<import('@artisan-toolbox/front-awesome').IconProps['onWaError']>} */
const onError = () => {
    if (source.value) status.value = 'Icon failed to load.';
};

function reset() {
    source.value = null;
    status.value = 'Choose a local icon source.';
}
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="flex flex-wrap gap-2">
            <Button type="button" @click="load(true)">Load local SVG</Button>
            <Button type="button" @click="load(false)">Try a missing SVG</Button>
            <Button type="button" appearance="plain" @click="reset">Reset icon events</Button>
        </div>
        <div v-if="source" class="min-w-0">
            <Icon
                :src="source"
                label="Add"
                class="text-3xl"
                @wa-load="onLoad"
                @wa-error="onError" />
        </div>
        <output role="status" aria-live="polite">{{ status }}</output>
    </div>
</template>
`;
</script>

<template>
    <ProseSection data-component-reference="icon">
        <p>
            Start in the Laravel, Inertia, and Vue application from
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                >Installation</DocsLink
            >. Keep its Front Awesome Vite plugin and chosen Web Awesome setup. Add these examples
            to a Vue page in that application. The toast plugin is not required.
        </p>
        <DocsCallout variant="caution">
            <template #title>Published preview</template>
            <p>
                Front Awesome 1.0.0-alpha.2 exports <code>components/Icon.vue</code>. Its API can
                change before the first stable release. Follow Installation to refresh the frontend
                package copy after updating Composer.
            </p>
        </DocsCallout>
        <h3 id="render-an-icon">Render an icon</h3>
        <p>
            Import <code>Icon</code> from <code>@artisan-toolbox/front-awesome/components</code>.
            The wrapper registers <code>wa-icon</code> and forwards native attributes and listeners
            to that element.
        </p>
        <slot />
        <p>
            Activate Load icons to display a house icon named Home for assistive technology and a
            Download button with a decorative icon. Without a
            <code>label</code>, Web Awesome hides the icon from assistive technology. Keep a visible
            label on the containing control, or give an icon-only control its own accessible name.
        </p>
        <p>
            The default Font Awesome library supplies these free icons over the network. No kit code
            is required for this example. Pro families and variants require the corresponding Font
            Awesome access and native kit setup. Front Awesome does not configure a kit or an icon
            library.
        </p>
        <p>
            The same component is available from
            <code>@artisan-toolbox/front-awesome/components/WebAwesome</code>,
            <code>@artisan-toolbox/front-awesome/components/Icon.vue</code>, and
            <code>@artisan-toolbox/front-awesome/components/WebAwesome/Icon.vue</code>. Choose one
            import path for each use.
        </p>
        <h3 id="use-native-options">Use native options</h3>
        <p>
            Set <code>name</code>, <code>family</code>, and <code>variant</code> for the chosen
            library. Use <code>library</code> for a library already registered through Web Awesome,
            or <code>src</code> for a trusted SVG URL. Available names and families depend on that
            source. The wrapper does not resolve, fetch, or transform icons itself.
        </p>
        <DemoFrame
            title="Icon transformations"
            :sources="[
                {
                    label: 'Choose a canvas and transform icons',
                    language: 'vue',
                    code: transformDemoSource,
                },
            ]">
            <IconTransformsDemo />
        </DemoFrame>
        <p>
            The arrows use native rotation and flipping. Start icon animation enables Web Awesome's
            spin effect; Pause icon animation stops it. Set
            <code>rotate</code> to a number of degrees and <code>flip</code> to <code>x</code>,
            <code>y</code>, or <code>both</code>. Choose an <code>animation</code> supported by your
            installed Web Awesome version, such as <code>spin</code>, <code>bounce</code>, or
            <code>beat</code>.
        </p>
        <p>
            Use <code>canvas="auto"</code> for the icon's natural width, <code>fixed</code> for the
            default canvas, or <code>square</code> and <code>roomy</code> for those native canvas
            sizes. The optional boolean <code>auto-width</code> remains supported by Web Awesome but
            is deprecated in favor of <code>canvas="auto"</code>. The optional boolean
            <code>swap-opacity</code> reverses duotone layer opacities. Bind
            <code>:auto-width="false"</code> or <code>:swap-opacity="false"</code> to disable either
            flag.
        </p>
        <h3 id="keep-application-styles">Keep application styles</h3>
        <p>
            Icon adds no default classes, theme, color, size, spacing, or stylesheet. Web Awesome
            retains its own rendering and native defaults. The icon inherits the surrounding font
            size and color. Pass <code>class</code> and <code>style</code> for application-owned
            choices, including Web Awesome's animation and duotone CSS custom properties. Other HTML
            attributes and listeners fall through to <code>wa-icon</code>.
        </p>
        <h3 id="handle-load-and-error">Handle load and error events</h3>
        <p>
            To try a local SVG, save this trusted content in
            <code>public/examples/front-awesome/icon-add.svg</code> in your Laravel application. The
            browser must be able to request <code>/examples/front-awesome/icon-add.svg</code>.
        </p>
        <CodeExample label="Create the local icon asset" language="html" :code="svgExample" />
        <p>
            Load local SVG displays the asset and its status. Try a missing SVG demonstrates
            failure; load the valid source again to retry. Reset icon events removes the example.
            The JSDoc annotations use the exported <code>IconProps</code> type while keeping Setup
            in JavaScript.
        </p>
        <DemoFrame
            title="Native icon events"
            :sources="[
                { label: 'Observe native icon events', language: 'vue', code: eventsDemoSource },
            ]">
            <IconEventsDemo />
        </DemoFrame>
        <p>
            A successful request displays the plus icon and Icon loaded. If the URL cannot load an
            SVG, Web Awesome emits <code>wa-error</code> and the status becomes Icon failed to load.
            Check the URL, network access, and SVG response before retrying with a corrected source.
            Include only SVG content you trust.
        </p>
        <p>
            These listeners receive the original native <code>Event</code>. Front Awesome adds no
            payload or renamed event. In programmatic bindings, use <code>onWaLoad</code> and
            <code>onWaError</code>. A custom library using <code>spriteSheet: true</code> does not
            emit either load event in Web Awesome, so do not use these events to determine sprite
            readiness.
        </p>
        <h3 id="use-the-public-types">Use the public types</h3>
        <p>
            Import <code>IconProps</code> as a type from
            <code>@artisan-toolbox/front-awesome</code> or either components barrel. Its native
            options derive from the installed Web Awesome icon types, including the canvas, flip,
            and animation unions. Vue's <code>HTMLAttributes</code> supplies ordinary HTML
            attributes, classes, styles, and listeners. The wrapper normalizes native load listener
            names to <code>onWaLoad</code> and <code>onWaError</code>
            and excludes upstream implementation state. It adds no icon-specific option vocabulary.
        </p>
        <p>
            See the
            <DocsLink href="https://webawesome.com/docs/components/icon/"
                >Web Awesome Icon reference</DocsLink
            >
            for available native options, library registration, kit setup, animations, and CSS
            custom properties.
        </p>
    </ProseSection>
</template>
