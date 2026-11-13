<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import IconContent from '@/components/docs/front-awesome/IconContent.vue';
import VideoDemo from '@/components/demo/front-awesome/media/VideoDemo.vue';
import VideoPlaylistDemo from '@/components/demo/front-awesome/media/VideoPlaylistDemo.vue';
import IconDemo from '@/components/demo/front-awesome/media/IconDemo.vue';
import AnimatedImageDemo from '@/components/demo/front-awesome/media/AnimatedImageDemo.vue';
import AvatarDemo from '@/components/demo/front-awesome/media/AvatarDemo.vue';
import CarouselDemo from '@/components/demo/front-awesome/media/CarouselDemo.vue';
import ComparisonDemo from '@/components/demo/front-awesome/media/ComparisonDemo.vue';
import MarkdownDemo from '@/components/demo/front-awesome/media/MarkdownDemo.vue';
import QrCodeDemo from '@/components/demo/front-awesome/media/QrCodeDemo.vue';
import ZoomableFrameDemo from '@/components/demo/front-awesome/media/ZoomableFrameDemo.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CatalogContext from '@/components/docs/front-awesome/catalog/CatalogContext.vue';
import ComponentCatalog from '@/components/docs/front-awesome/catalog/ComponentCatalog.vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
const example1 = `<script setup>
import { ref } from 'vue';
import { Icon, Button } from '@artisan-toolbox/front-awesome/components';

const visible = ref(false);
const failed = ref(false);

function toggleIcons() {
    visible.value = !visible.value;
    failed.value = false;
}
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button type="button" @click="toggleIcons">{{
                visible ? 'Reset icons' : 'Load icons'
            }}</Button>
        </div>
        <div v-if="visible" class="flex flex-wrap items-center gap-5">
            <Icon name="house" label="Home" class="text-2xl" @wa-error="failed = true" />
            <Button type="button"
                ><Icon slot="start" name="download" @wa-error="failed = true" />Download</Button
            >
        </div>
        <p v-if="failed" role="alert">
            Icon unavailable. Check the configured icon source and reset.
        </p>
    </div>
</template>
`;

const animatedImageDemoSource = `<script setup>
import { ref } from 'vue';
import { AnimatedImage, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const error = ref(false);
const status = ref('Ready');
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button
                @click="
                    loaded = !loaded;
                    error = false;
                    status = loaded ? 'Loading local image...' : 'Ready';
                "
                >{{ loaded ? 'Reset image' : 'Load image' }}</Button
            >
        </div>
        <div class="min-w-0">
            <AnimatedImage
                v-if="loaded"
                class="h-24 w-24"
                src="/examples/front-awesome/status.gif"
                alt="A square alternating between light and dark"
                :play="false"
                @wa-load="status = 'Image loaded. Use the native play control to animate it.'"
                @wa-error="
                    error = true;
                    status = 'Image unavailable';
                " />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">{{ status }}</output>
        </div>
        <div class="min-w-0">
            <p v-if="error" role="alert">Image unavailable. Reset and try again.</p>
        </div>
    </div>
</template>
`;
const avatarDemoSource = `<script setup>
import { Avatar } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Avatar initials="AT" label="Artisan Toolbox contributor" />
        </div>
    </div>
</template>
`;
const carouselDemoSource = `<script setup>
import { Carousel, CarouselItem } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Carousel
                :navigation="true"
                :pagination="true"
                :autoplay="false"
                aria-label="Package highlights">
                <CarouselItem>
                    <div class="flex h-40 items-center justify-center bg-brand-100 text-brand-950">
                        Core utilities
                    </div>
                </CarouselItem>
                <CarouselItem>
                    <div class="flex h-40 items-center justify-center bg-brand-900 text-white">
                        Front Awesome UI
                    </div>
                </CarouselItem>
            </Carousel>
        </div>
    </div>
</template>
`;
const comparisonDemoSource = `<script setup>
import { Comparison } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Comparison :position="50">
                <div
                    slot="before"
                    class="flex h-40 items-center justify-center bg-brand-100 text-brand-950">
                    Before
                </div>
                <div
                    slot="after"
                    class="flex h-40 items-center justify-center bg-brand-900 text-white">
                    After
                </div>
            </Comparison>
        </div>
    </div>
</template>
`;
const markdownDemoSource = `<script setup>
import { Markdown } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const source = '# Release notes\\n\\nThe **preview** is ready for review.';
\x3C/script>

<template>
    <div class="min-w-0" data-docs-outline-exclude>
        <Markdown>
            <component :is="'script'" type="text/markdown">{{ source }}</component>
        </Markdown>
    </div>
</template>
`;
const qrCodeDemoSource = `<script setup>
import { QrCode } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <QrCode value="https://atb.dev.br" label="QR code for Artisan Toolbox documentation" />
        </div>
    </div>
</template>
`;
const zoomableFrameDemoSource = `<script setup>
import { ref } from 'vue';
import { ZoomableFrame, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const status = ref('Ready');
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button
                @click="
                    loaded = !loaded;
                    status = loaded ? 'Loading local document...' : 'Ready';
                "
                >{{ loaded ? 'Close frame' : 'Open frame' }}</Button
            >
        </div>
        <div class="min-w-0">
            <ZoomableFrame
                v-if="loaded"
                label="Local layout preview"
                @load="status = 'Local document loaded'"
                @error="status = 'Document unavailable. Close and try again.'"
                srcdoc="<!doctype html>
            <html lang='en'>
            <title>Preview</title>
            <body>
            <h1>Local preview</h1>
            <p>Resize and zoom this document.</p>
            </body>
            </html>"
                sandbox=""
                :zoom="0.75"
                class="block h-72" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">{{ status }}</output>
        </div>
    </div>
</template>
`;

const videoDemoSource = `<script setup>
import { ref } from 'vue';
import { Video } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const failed = ref(false);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button
                @click="
                    loaded = !loaded;
                    failed = false;
                "
                >{{ loaded ? 'Reset media' : 'Load media controls' }}</Button
            >
        </div>
        <div class="min-w-0">
            <div v-if="loaded">
                <Video
                    title="Silent color test"
                    controls="full"
                    preload="none"
                    :autoplay="false"
                    src="/examples/front-awesome/color-test.mp4"
                    @error="failed = true" />
            </div>
        </div>
        <div class="min-w-0">
            <p v-if="failed" role="alert">Media unavailable. Reset and try again.</p>
        </div>
    </div>
</template>
`;
const videoPlaylistDemoSource = `<script setup>
import { ref } from 'vue';
import { VideoPlaylist, Video } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const failed = ref(false);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button
                @click="
                    loaded = !loaded;
                    failed = false;
                "
                >{{ loaded ? 'Reset media' : 'Load media controls' }}</Button
            >
        </div>
        <div class="min-w-0">
            <div v-if="loaded">
                <VideoPlaylist>
                    <Video
                        title="Silent color test"
                        controls="full"
                        preload="none"
                        :autoplay="false"
                        src="/examples/front-awesome/color-test.mp4"
                        @error="failed = true" />
                    <Video
                        title="Second silent color test"
                        preload="none"
                        :autoplay="false"
                        src="/examples/front-awesome/color-test.mp4"
                        @error="failed = true" />
                </VideoPlaylist>
            </div>
        </div>
        <div class="min-w-0">
            <p v-if="failed" role="alert">Media unavailable. Reset and try again.</p>
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
            <ComponentCatalog group="media" :navigation="navigation" />
        </ProseSection>
        <ProseSection id="icon" title="Icon">
            <p>
                Allow the configured icon source to load over the network. Standalone informative
                icons need a label. Custom Font Awesome kit icons require the kit setup described in
                the complete guide.
            </p>
            <IconContent :navigation="navigation">
                <DemoFrame
                    data-catalog-demo="Icon"
                    title="Icon example"
                    :sources="[{ label: 'Icon basic example', language: 'vue', code: example1 }]">
                    <IconDemo />
                </DemoFrame>
            </IconContent>
            <p>
                Expected result. A Download button displays an icon beside its visible text after
                the SVG loads. The icon is decorative because the button already has a name.
            </p>
        </ProseSection>
        <ProseSection id="animated-image" title="Animated Image">
            <p>Control playback of an animated image.</p>
            <DemoFrame
                data-catalog-demo="AnimatedImage"
                title="Animated Image example"
                :sources="[
                    {
                        label: 'Animated Image basic example',
                        language: 'vue',
                        code: animatedImageDemoSource,
                    },
                ]">
                <AnimatedImageDemo />
            </DemoFrame>
            <p>
                Expected result. Load image requests a local GIF in its paused state. Use the native
                play control to animate it. Reset image removes it.
            </p>
        </ProseSection>
        <ProseSection id="avatar" title="Avatar">
            <p>Represent a person or entity.</p>
            <DemoFrame
                data-catalog-demo="Avatar"
                title="Avatar example"
                :sources="[
                    { label: 'Avatar basic example', language: 'vue', code: avatarDemoSource },
                ]">
                <AvatarDemo />
            </DemoFrame>
            <p>
                Expected result. An avatar displays AT initials with an accessible contributor
                label. No image request is needed.
            </p>
        </ProseSection>
        <ProseSection id="carousel" title="Carousel">
            <p>Browse a sequence of slides.</p>
            <DemoFrame
                data-catalog-demo="Carousel"
                title="Carousel example"
                :sources="[
                    { label: 'Carousel basic example', language: 'vue', code: carouselDemoSource },
                ]">
                <CarouselDemo />
            </DemoFrame>
            <p>
                Expected result. Use the navigation buttons or pagination to switch between Core
                utilities and Front Awesome UI. Slides do not advance automatically.
            </p>
        </ProseSection>
        <ProseSection id="carousel-item" title="Carousel Item">
            <p>CarouselItem supplies slides. Carousel owns navigation, pagination, and autoplay.</p>
            <p><DocsLink href="#carousel">See the Carousel example and source</DocsLink>.</p>
        </ProseSection>
        <ProseSection id="comparison" title="Comparison">
            <p>Compare two overlaid images.</p>
            <DemoFrame
                data-catalog-demo="Comparison"
                title="Comparison example"
                :sources="[
                    {
                        label: 'Comparison basic example',
                        language: 'vue',
                        code: comparisonDemoSource,
                    },
                ]">
                <ComparisonDemo />
            </DemoFrame>
            <p>
                Expected result. Drag the comparison handle to reveal more of Before or After. The
                content uses local colored panels.
            </p>
        </ProseSection>
        <ProseSection id="markdown" title="Markdown">
            <p>Render Markdown content.</p>
            <DemoFrame
                data-catalog-demo="Markdown"
                title="Markdown example"
                :sources="[
                    { label: 'Markdown basic example', language: 'vue', code: markdownDemoSource },
                ]">
                <MarkdownDemo />
            </DemoFrame>
            <p>
                Expected result. Local Markdown renders a Release notes heading and a bold preview
                word. The source is trusted authored content.
            </p>
        </ProseSection>
        <ProseSection id="qr-code" title="QR Code">
            <p>Encode a value as a QR code.</p>
            <DemoFrame
                data-catalog-demo="QrCode"
                title="QR Code example"
                :sources="[
                    { label: 'QR Code basic example', language: 'vue', code: qrCodeDemoSource },
                ]">
                <QrCodeDemo />
            </DemoFrame>
            <p>
                Expected result. A labeled QR code encodes https://atb.dev.br. Rendering the code
                does not visit the destination.
            </p>
        </ProseSection>
        <ProseSection id="zoomable-frame" title="Zoomable Frame">
            <p>Inspect content in a zoomable region.</p>
            <DemoFrame
                data-catalog-demo="ZoomableFrame"
                title="Zoomable Frame example"
                :sources="[
                    {
                        label: 'Zoomable Frame basic example',
                        language: 'vue',
                        code: zoomableFrameDemoSource,
                    },
                ]">
                <ZoomableFrameDemo />
            </DemoFrame>
            <p>
                Expected result. Open frame displays a sandboxed local document at 75% zoom. Native
                controls change its zoom. Close frame removes it.
            </p>
        </ProseSection>
        <ProseSection id="video" title="Video">
            <p>
                Play video with media controls. This example requires the Front Awesome beta Pro
                wrappers and Web Awesome Pro 3.14.0.
            </p>
            <DemoFrame
                data-catalog-demo="Video"
                title="Video example"
                :sources="[
                    { label: 'Video basic example', language: 'vue', code: videoDemoSource },
                ]">
                <VideoDemo />
            </DemoFrame>
            <p>
                Expected result. Load media controls displays a silent local test clip without
                autoplay. Use the native play control to start playback. Reset media removes the
                player. The playlist adds a second selectable clip.
            </p>
        </ProseSection>
        <ProseSection id="video-playlist" title="Video Playlist">
            <p>
                Organize multiple videos for playback. This example requires the Front Awesome beta
                Pro wrappers and Web Awesome Pro 3.14.0.
            </p>
            <DemoFrame
                data-catalog-demo="VideoPlaylist"
                title="Video Playlist example"
                :sources="[
                    {
                        label: 'Video Playlist basic example',
                        language: 'vue',
                        code: videoPlaylistDemoSource,
                    },
                ]">
                <VideoPlaylistDemo />
            </DemoFrame>
            <p>
                Expected result. Load media controls displays a silent local test clip without
                autoplay. Use the native play control to start playback. Reset media removes the
                player. The playlist adds a second selectable clip.
            </p>
        </ProseSection>
    </article>
</template>
