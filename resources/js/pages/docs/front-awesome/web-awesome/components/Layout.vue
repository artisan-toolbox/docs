<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import PageContent from '@/components/docs/front-awesome/PageContent.vue';
import PageDemo from '@/components/demo/front-awesome/layout/PageDemo.vue';
import AccordionDemo from '@/components/demo/front-awesome/layout/AccordionDemo.vue';
import CardDemo from '@/components/demo/front-awesome/layout/CardDemo.vue';
import DetailsDemo from '@/components/demo/front-awesome/layout/DetailsDemo.vue';
import DialogDemo from '@/components/demo/front-awesome/layout/DialogDemo.vue';
import DividerDemo from '@/components/demo/front-awesome/layout/DividerDemo.vue';
import DrawerDemo from '@/components/demo/front-awesome/layout/DrawerDemo.vue';
import ScrollerDemo from '@/components/demo/front-awesome/layout/ScrollerDemo.vue';
import SplitPanelDemo from '@/components/demo/front-awesome/layout/SplitPanelDemo.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CatalogContext from '@/components/docs/front-awesome/catalog/CatalogContext.vue';
import ComponentCatalog from '@/components/docs/front-awesome/catalog/ComponentCatalog.vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';

const pageExample = `<script setup>
import { useId } from 'vue';
import { Page, Button } from '@artisan-toolbox/front-awesome/components';

const contentId = useId();
\x3C/script>

<template>
    <div
        class="h-[28rem] min-w-0 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700"
        data-docs-outline-exclude>
        <Page
            mobile-breakpoint="600px"
            disable-sticky="header menu aside"
            class="h-full [&::part(header)]:border-b [&::part(header)]:border-slate-200 [&::part(header)]:bg-slate-50 dark:[&::part(header)]:border-slate-700 dark:[&::part(header)]:bg-slate-900 [&::part(page)]:min-h-full">
            <Button slot="navigation-toggle" type="button" size="s" class="m-3">Menu</Button>
            <header slot="header">
                <p class="text-sm font-medium">Header region</p>
            </header>
            <div slot="navigation-header">Project navigation</div>
            <div
                slot="navigation"
                class="border-r border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Navigation region
                </p>
                <Button :href="\`#\${contentId}\`" appearance="plain" variant="neutral" size="s"
                    >Dashboard</Button
                >
            </div>
            <div :id="contentId" class="min-h-48 p-6" tabindex="-1">
                <p class="mb-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    Main content
                </p>
                <p class="text-lg font-semibold">Dashboard</p>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    The content stays separate from the header, navigation and footer.
                </p>
            </div>
            <footer
                slot="footer"
                class="border-t border-slate-200 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-900">
                Footer region
            </footer>
        </Page>
    </div>
</template>
`;

const accordionDemoSource = `<script setup>
import { Accordion, AccordionItem } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Accordion>
                <AccordionItem label="Installation">Run Composer before npm.</AccordionItem>
                <AccordionItem label="Compatibility"
                    >Use the supported versions from Installation.</AccordionItem
                >
            </Accordion>
        </div>
    </div>
</template>
`;
const cardDemoSource = `<script setup>
import { ref } from 'vue';
import { Card, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const reviewed = ref(false);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Card>
                <strong slot="header">Release checklist</strong>
                <p>Implementation, tests, and documentation are ready.</p>
                <Button slot="footer" @click="reviewed = !reviewed">{{
                    reviewed ? 'Reviewed' : 'Mark reviewed'
                }}</Button>
            </Card>
        </div>
    </div>
</template>
`;
const detailsDemoSource = `<script setup>
import { Details } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Details summary="Installation order"
                >Install Composer dependencies before frontend dependencies.</Details
            >
        </div>
    </div>
</template>
`;
const dialogDemoSource = `<script setup>
import { ref } from 'vue';
import { Dialog, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const open = ref(false);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="open = true">Open dialog</Button>
        </div>
        <div class="min-w-0">
            <Dialog label="Review release" :open="open" @wa-after-hide="open = false">
                <p>Check the release before publishing.</p>
                <Button slot="footer" @click="open = false">Close</Button>
            </Dialog>
        </div>
    </div>
</template>
`;
const dividerDemoSource = `<script setup>
import { Divider } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <p>Requirements</p>
        </div>
        <div class="min-w-0">
            <Divider />
        </div>
        <div class="min-w-0">
            <p>Installation</p>
        </div>
    </div>
</template>
`;
const drawerDemoSource = `<script setup>
import { ref } from 'vue';
import { Drawer, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const open = ref(false);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="open = true">Open drawer</Button>
        </div>
        <div class="min-w-0">
            <Drawer label="Review release" :open="open" @wa-after-hide="open = false">
                <p>Check the release before publishing.</p>
                <Button slot="footer" @click="open = false">Close</Button>
            </Drawer>
        </div>
    </div>
</template>
`;
const scrollerDemoSource = `<script setup>
import { Scroller } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Scroller class="block max-w-full">
                <div class="flex w-max gap-4">
                    <span v-for="item in 8" :key="item" class="rounded border p-8"
                        >Package {{ item }}</span
                    >
                </div>
            </Scroller>
        </div>
    </div>
</template>
`;
const splitPanelDemoSource = `<script setup>
import { SplitPanel } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <SplitPanel :position="50" class="h-48">
                <div slot="start" class="h-full bg-brand-100 p-4 text-brand-950">Source</div>
                <div slot="end" class="h-full bg-brand-900 p-4 text-white">Preview</div>
            </SplitPanel>
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
            <ComponentCatalog group="layout" :navigation="navigation" />
        </ProseSection>
        <ProseSection id="page" title="Page">
            <span id="native-page-layout" class="scroll-mt-28" />
            <PageContent :navigation="navigation" />
            <DemoFrame
                data-catalog-demo="Page"
                title="Arrange page regions"
                :sources="[{ label: 'Arrange page regions', language: 'vue', code: pageExample }]">
                <PageDemo />
            </DemoFrame>
            <p>
                Expected result. Labeled header, navigation, main and footer regions have explicit
                borders and surfaces. Below 600px of page width, Menu opens the same navigation in a
                drawer. The Menu uses the native navigation-toggle slot so this nested preview stays
                independent of the application Page. The wrapper preserves native slot attributes
                and adds no styles or theme defaults.
            </p>
        </ProseSection>
        <ProseSection id="accordion" title="Accordion">
            <p>Organize expandable sections.</p>
            <DemoFrame
                data-catalog-demo="Accordion"
                title="Accordion example"
                :sources="[
                    {
                        label: 'Accordion basic example',
                        language: 'vue',
                        code: accordionDemoSource,
                    },
                ]">
                <AccordionDemo />
            </DemoFrame>
            <p>
                Expected result. Activate Installation or Compatibility to expand its content. The
                controls support native keyboard navigation.
            </p>
        </ProseSection>
        <ProseSection id="accordion-item" title="Accordion Item">
            <p>AccordionItem supplies each label and expandable panel inside Accordion.</p>
            <p><DocsLink href="#accordion">See the Accordion example and source</DocsLink>.</p>
        </ProseSection>
        <ProseSection id="card" title="Card">
            <p>Group related content in a container.</p>
            <DemoFrame
                data-catalog-demo="Card"
                title="Card example"
                :sources="[{ label: 'Card basic example', language: 'vue', code: cardDemoSource }]">
                <CardDemo />
            </DemoFrame>
            <p>
                Expected result. A card groups the header, body, and footer. Mark reviewed changes
                the footer action label.
            </p>
        </ProseSection>
        <ProseSection id="details" title="Details">
            <p>Reveal supporting content on demand.</p>
            <DemoFrame
                data-catalog-demo="Details"
                title="Details example"
                :sources="[
                    { label: 'Details basic example', language: 'vue', code: detailsDemoSource },
                ]">
                <DetailsDemo />
            </DemoFrame>
            <p>
                Expected result. Activate Installation order to expand or collapse the explanation.
            </p>
        </ProseSection>
        <ProseSection id="dialog" title="Dialog">
            <p>Present content in a modal window.</p>
            <DemoFrame
                data-catalog-demo="Dialog"
                title="Dialog example"
                :sources="[
                    { label: 'Dialog basic example', language: 'vue', code: dialogDemoSource },
                ]">
                <DialogDemo />
            </DemoFrame>
            <p>
                Expected result. Open dialog displays a labeled panel. Close or Escape dismisses it.
                The native component manages focus.
            </p>
        </ProseSection>
        <ProseSection id="divider" title="Divider">
            <p>Separate adjacent content.</p>
            <DemoFrame
                data-catalog-demo="Divider"
                title="Divider example"
                :sources="[
                    { label: 'Divider basic example', language: 'vue', code: dividerDemoSource },
                ]">
                <DividerDemo />
            </DemoFrame>
            <p>Expected result. A horizontal divider separates Requirements and Installation.</p>
        </ProseSection>
        <ProseSection id="drawer" title="Drawer">
            <p>Reveal a panel beside the page.</p>
            <DemoFrame
                data-catalog-demo="Drawer"
                title="Drawer example"
                :sources="[
                    { label: 'Drawer basic example', language: 'vue', code: drawerDemoSource },
                ]">
                <DrawerDemo />
            </DemoFrame>
            <p>
                Expected result. Open drawer displays a labeled panel. Close or Escape dismisses it.
                The native component manages focus.
            </p>
        </ProseSection>
        <ProseSection id="scroller" title="Scroller">
            <p>Navigate content within a scrollable region.</p>
            <DemoFrame
                data-catalog-demo="Scroller"
                title="Scroller example"
                :sources="[
                    { label: 'Scroller basic example', language: 'vue', code: scrollerDemoSource },
                ]">
                <ScrollerDemo />
            </DemoFrame>
            <p>
                Expected result. Eight package tiles remain inside a horizontally scrollable region.
                Scroll to reach the later tiles.
            </p>
        </ProseSection>
        <ProseSection id="split-panel" title="Split Panel">
            <p>Resize two adjacent content panels.</p>
            <DemoFrame
                data-catalog-demo="SplitPanel"
                title="Split Panel example"
                :sources="[
                    {
                        label: 'Split Panel basic example',
                        language: 'vue',
                        code: splitPanelDemoSource,
                    },
                ]">
                <SplitPanelDemo />
            </DemoFrame>
            <p>
                Expected result. Drag the divider or focus it and use the arrow keys to resize
                Source and Preview.
            </p>
        </ProseSection>
    </article>
</template>
