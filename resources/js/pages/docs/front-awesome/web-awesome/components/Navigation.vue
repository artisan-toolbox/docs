<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import BreadcrumbDemo from '@/components/demo/front-awesome/navigation/BreadcrumbDemo.vue';
import PaginationDemo from '@/components/demo/front-awesome/navigation/PaginationDemo.vue';
import StepperDemo from '@/components/demo/front-awesome/navigation/StepperDemo.vue';
import TabGroupDemo from '@/components/demo/front-awesome/navigation/TabGroupDemo.vue';
import TreeDemo from '@/components/demo/front-awesome/navigation/TreeDemo.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CatalogContext from '@/components/docs/front-awesome/catalog/CatalogContext.vue';
import ComponentCatalog from '@/components/docs/front-awesome/catalog/ComponentCatalog.vue';

const breadcrumbDemoSource = `<script setup>
import { Breadcrumb, BreadcrumbItem } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Breadcrumb label="Documentation location">
                <BreadcrumbItem href="#components">Components</BreadcrumbItem>
                <BreadcrumbItem>Navigation</BreadcrumbItem>
            </Breadcrumb>
        </div>
    </div>
</template>
`;
const paginationDemoSource = `<script setup>
import { ref } from 'vue';
import { Button, Pagination } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const page = ref(1);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Pagination
                label="Local package results"
                :total="100"
                :page-size="10"
                v-model:page="page" />
        </div>
        <div class="min-w-0"><Button type="button" @click="page = 5">Go to page five</Button></div>
        <div class="min-w-0">
            <output>Current page: {{ page }}</output>
        </div>
    </div>
</template>
`;
const stepperDemoSource = `<script setup>
import { ref, useTemplateRef } from 'vue';
import { Stepper, Step, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const stepper = useTemplateRef('stepper');
const active = ref('install');
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Stepper ref="stepper" v-model:active="active" label="Package setup">
                <Step name="install">Install</Step>
                <Step name="configure">Configure</Step>
                <Step name="verify">Verify</Step>
            </Stepper>
        </div>
        <div class="min-w-0">
            <div class="flex gap-2">
                <Button @click="stepper.$el.previous()">Previous</Button>
                <Button @click="stepper.$el.next()">Next</Button>
            </div>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="active = 'verify'">Go to Verify step</Button>
        </div>
        <div class="min-w-0">
            <output>Active step: {{ active }}</output>
        </div>
    </div>
</template>
`;
const tabGroupDemoSource = `<script setup>
import { ref } from 'vue';
import {
    TabGroup,
    Tab,
    TabPanel,
    Button,
} from '@artisan-toolbox/front-awesome/components/WebAwesome';
const active = ref('install');
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <TabGroup v-model:active="active">
                <Tab panel="install">Installation</Tab>
                <Tab panel="usage">Usage</Tab>
                <TabPanel name="install">Run Composer before npm.</TabPanel>
                <TabPanel name="usage">Import public Vue components.</TabPanel>
            </TabGroup>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="active = 'usage'">Open Usage tab</Button>
        </div>
        <div class="min-w-0">
            <output>Active tab: {{ active }}</output>
        </div>
    </div>
</template>
`;
const treeDemoSource = `<script setup>
import { Tree, TreeItem } from '@artisan-toolbox/front-awesome/components/WebAwesome';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Tree aria-label="Package files">
                <TreeItem :expanded="true"
                    >Package<TreeItem>src</TreeItem>
                    <TreeItem>tests</TreeItem>
                </TreeItem>
            </Tree>
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
            <ComponentCatalog group="navigation" :navigation="navigation" />
        </ProseSection>
        <ProseSection id="wrapper-availability" title="Wrapper availability">
            <p>
                Core and Pro wrappers in this group are available in the source preview. Pro
                examples require a licensed upstream installation.
            </p>
        </ProseSection>
        <ProseSection id="breadcrumb" title="Breadcrumb">
            <p>Show the path to the current location.</p>
            <DemoFrame
                data-catalog-demo="Breadcrumb"
                title="Breadcrumb example"
                :sources="[
                    {
                        label: 'Breadcrumb basic example',
                        language: 'vue',
                        code: breadcrumbDemoSource,
                    },
                ]">
                <BreadcrumbDemo />
            </DemoFrame>
            <p>
                Expected result. Components links to the status section on this page. Navigation
                identifies the current location.
            </p>
        </ProseSection>
        <ProseSection id="breadcrumb-item" title="Breadcrumb Item">
            <p>
                BreadcrumbItem supplies a linked ancestor or the unlinked current location inside
                Breadcrumb.
            </p>
            <p><DocsLink href="#breadcrumb">See the Breadcrumb example and source</DocsLink>.</p>
        </ProseSection>
        <ProseSection id="pagination" title="Pagination">
            <p>Move between pages of results.</p>
            <DemoFrame
                data-catalog-demo="Pagination"
                title="Pagination example"
                :sources="[
                    {
                        label: 'Pagination basic example',
                        language: 'vue',
                        code: paginationDemoSource,
                    },
                ]">
                <PaginationDemo />
            </DemoFrame>
            <p>
                Expected result. Select a page or a next or previous control. Current page changes
                locally through <code>v-model:page</code>. Go to page five updates the same native
                control and output programmatically. No network request is made.
            </p>
        </ProseSection>
        <ProseSection id="stepper" title="Stepper">
            <p>Show progress through a sequence.</p>
            <DemoFrame
                data-catalog-demo="Stepper"
                title="Stepper example"
                :sources="[
                    { label: 'Stepper basic example', language: 'vue', code: stepperDemoSource },
                ]">
                <StepperDemo />
            </DemoFrame>
            <p>
                Expected result. Next and Previous move the active step through Install, Configure,
                and Verify using native methods. The <code>v-model:active</code> value appears in
                Active step. Go to Verify step changes the model and native selection together.
            </p>
        </ProseSection>
        <ProseSection id="step" title="Step">
            <p>
                Step supplies the named steps. Stepper owns the active step and previous()/next()
                navigation.
            </p>
            <p><DocsLink href="#stepper">See the Stepper example and source</DocsLink>.</p>
        </ProseSection>
        <ProseSection id="tab-group" title="Tab Group">
            <p>Switch between related content panels.</p>
            <DemoFrame
                data-catalog-demo="TabGroup"
                title="Tab Group example"
                :sources="[
                    { label: 'Tab Group basic example', language: 'vue', code: tabGroupDemoSource },
                ]">
                <TabGroupDemo />
            </DemoFrame>
            <p>
                Expected result. Installation and Usage switch between their matching panels. Arrow
                keys move between tab controls. The <code>v-model:active</code> value appears in
                Active tab. Open Usage tab changes the model and displays that panel.
            </p>
        </ProseSection>
        <ProseSection id="tab" title="Tab">
            <p>
                Tab panel identifies the TabPanel name. TabGroup coordinates active state and native
                keyboard navigation.
            </p>
            <p><DocsLink href="#tab-group">See the TabGroup example and source</DocsLink>.</p>
        </ProseSection>
        <ProseSection id="tab-panel" title="Tab Panel">
            <p>TabPanel name matches a Tab panel value and supplies the active content.</p>
            <p><DocsLink href="#tab-group">See the TabGroup example and source</DocsLink>.</p>
        </ProseSection>
        <ProseSection id="tree" title="Tree">
            <p>Navigate a hierarchy of items.</p>
            <DemoFrame
                data-catalog-demo="Tree"
                title="Tree example"
                :sources="[{ label: 'Tree basic example', language: 'vue', code: treeDemoSource }]">
                <TreeDemo />
            </DemoFrame>
            <p>
                Expected result. Package starts expanded with src and tests children. Collapse or
                expand Package with its control or keyboard.
            </p>
        </ProseSection>
        <ProseSection id="tree-item" title="Tree Item">
            <p>TreeItem supplies nested nodes and expanded state inside Tree.</p>
            <p><DocsLink href="#tree">See the Tree example and source</DocsLink>.</p>
        </ProseSection>
    </article>
</template>
