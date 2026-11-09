<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({ navigation: { type: Array, required: true } });

const basicExample = `<script setup>
import { Icon } from '@artisan-toolbox/front-awesome/components';
\x3C/script>

<template>
  <div>
    <Icon name="house" label="Home" />
    <button type="button">
      <Icon name="download" />
      Download
    </button>
  </div>
</template>`;

const transformExample = `<script setup>
import { Icon } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
  <div>
    <Icon name="arrow-up" family="classic" variant="solid" canvas="auto" :rotate="90" label="Right" />
    <Icon name="arrow-up" flip="y" label="Down" />
    <Icon name="spinner" animation="spin" label="Loading" />
  </div>
</template>`;

const svgExample = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <path fill="currentColor" d="M2 7h5V2h2v5h5v2H9v5H7V9H2z" />
</svg>`;

const eventExample = `<script setup>
import { shallowRef } from 'vue';
import Icon from '@artisan-toolbox/front-awesome/components/Icon.vue';

const status = shallowRef('Loading icon.');

/** @type {NonNullable<import('@artisan-toolbox/front-awesome/components').IconProps['onWaLoad']>} */
const onLoad = (event) => {
  status.value = 'Icon loaded.';
  console.log(event.type);
};

/** @type {NonNullable<import('@artisan-toolbox/front-awesome/components').IconProps['onWaError']>} */
const onError = (event) => {
  status.value = 'Icon failed to load.';
  console.error(event.type);
};
\x3C/script>

<template>
  <div>
    <Icon src="/icons/add.svg" label="Add" @wa-load="onLoad" @wa-error="onError" />
    <p role="status">{{ status }}</p>
  </div>
</template>`;
</script>

<template>
    <ProseSection>
        <p>
            Start in the Laravel, Inertia, and Vue application from
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                >Installation</DocsLink
            >. Keep its Front Awesome Vite plugin and chosen Web Awesome setup. Add these examples
            to a Vue page in that application. The toast plugin is not required.
        </p>
        <DocsCallout variant="caution">
            <template #title>Development preview</template>
            <p>
                This guide describes the Icon API in the current Front Awesome checkout. Confirm
                that your Composer-installed package exports
                <code>components/Icon.vue</code>. Older published previews may not include it.
                Follow Installation to refresh the frontend package copy after updating Composer.
            </p>
        </DocsCallout>
        <h2 id="render-an-icon">Render an icon</h2>
        <p>
            Import <code>Icon</code> from <code>@artisan-toolbox/front-awesome/components</code>.
            The wrapper registers <code>wa-icon</code> and forwards native attributes and listeners
            to that element.
        </p>
        <CodeExample label="Render accessible icons" language="vue" :code="basicExample" />
        <p>
            The page displays a house icon named Home for assistive technology and a Download button
            with a decorative icon. Without a
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
        <h2 id="use-native-options">Use native options</h2>
        <p>
            Set <code>name</code>, <code>family</code>, and <code>variant</code> for the chosen
            library. Use <code>library</code> for a library already registered through Web Awesome,
            or <code>src</code> for a trusted SVG URL. Available names and families depend on that
            source. The wrapper does not resolve, fetch, or transform icons itself.
        </p>
        <CodeExample
            label="Choose a canvas and transform icons"
            language="vue"
            :code="transformExample" />
        <p>
            The arrows use native rotation and flipping. The spinner uses Web Awesome's spin
            animation. Set
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
        <h2 id="keep-application-styles">Keep application styles</h2>
        <p>
            Icon adds no default classes, theme, color, size, spacing, or stylesheet. Web Awesome
            retains its own rendering and native defaults. The icon inherits the surrounding font
            size and color. Pass <code>class</code> and <code>style</code> for application-owned
            choices, including Web Awesome's animation and duotone CSS custom properties. Other HTML
            attributes and listeners fall through to <code>wa-icon</code>.
        </p>
        <h2 id="handle-load-and-error">Handle load and error events</h2>
        <p>
            To try a local SVG, save this trusted content in
            <code>public/icons/add.svg</code> in your Laravel application. The browser must be able
            to request <code>/icons/add.svg</code>.
        </p>
        <CodeExample label="Create the local icon asset" language="html" :code="svgExample" />
        <p>
            Add this Vue page to display the SVG and its load status. The JSDoc annotations use the
            exported <code>IconProps</code> type while keeping Setup in JavaScript.
        </p>
        <CodeExample label="Observe native icon events" language="vue" :code="eventExample" />
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
        <h2 id="use-the-public-types">Use the public types</h2>
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
