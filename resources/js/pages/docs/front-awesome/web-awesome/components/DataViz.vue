<script setup>
import DemoFrame from '@/components/demo/DemoFrame.vue';
import BarChartDemo from '@/components/demo/front-awesome/data-viz/BarChartDemo.vue';
import BubbleChartDemo from '@/components/demo/front-awesome/data-viz/BubbleChartDemo.vue';
import DataGridDemo from '@/components/demo/front-awesome/data-viz/DataGridDemo.vue';
import DoughnutChartDemo from '@/components/demo/front-awesome/data-viz/DoughnutChartDemo.vue';
import LineChartDemo from '@/components/demo/front-awesome/data-viz/LineChartDemo.vue';
import PieChartDemo from '@/components/demo/front-awesome/data-viz/PieChartDemo.vue';
import PolarAreaChartDemo from '@/components/demo/front-awesome/data-viz/PolarAreaChartDemo.vue';
import RadarChartDemo from '@/components/demo/front-awesome/data-viz/RadarChartDemo.vue';
import ScatterChartDemo from '@/components/demo/front-awesome/data-viz/ScatterChartDemo.vue';
import SparklineDemo from '@/components/demo/front-awesome/data-viz/SparklineDemo.vue';
import ChartDemo from '@/components/demo/front-awesome/data-viz/ChartDemo.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CatalogContext from '@/components/docs/front-awesome/catalog/CatalogContext.vue';
import ComponentCatalog from '@/components/docs/front-awesome/catalog/ComponentCatalog.vue';

const barChartDemoSource = `<script setup>
import { ref } from 'vue';
import { BarChart } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const config = {
    type: 'bar',
    data: {
        labels: ['Core', 'Front Awesome', 'Mosaicast'],
        datasets: [
            {
                label: 'Example count',
                data: [3, 5, 4],
            },
        ],
    },
    options: {
        animation: false,
    },
};
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="loaded = !loaded">{{ loaded ? 'Reset chart' : 'Render chart' }}</Button>
        </div>
        <div class="min-w-0">
            <BarChart
                v-if="loaded"
                label="Example package counts"
                description="Synthetic values for Core, Front Awesome, and Mosaicast"
                :config="config"
                :without-animation="true"
                class="block h-72 min-w-0" />
        </div>
        <div class="min-w-0">
            <p>Example counts: Core 3, Front Awesome 5, Mosaicast 4.</p>
        </div>
    </div>
</template>
`;
const bubbleChartDemoSource = `<script setup>
import { ref } from 'vue';
import { BubbleChart } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const config = {
    type: 'bubble',
    data: {
        labels: ['Core', 'Front Awesome', 'Mosaicast'],
        datasets: [
            {
                label: 'Example count',
                data: [
                    {
                        x: 1,
                        y: 3,
                        r: 8,
                    },
                    {
                        x: 2,
                        y: 5,
                        r: 12,
                    },
                    {
                        x: 3,
                        y: 4,
                        r: 10,
                    },
                ],
            },
        ],
    },
    options: {
        animation: false,
    },
};
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="loaded = !loaded">{{ loaded ? 'Reset chart' : 'Render chart' }}</Button>
        </div>
        <div class="min-w-0">
            <BubbleChart
                v-if="loaded"
                label="Example package counts"
                description="Synthetic values for Core, Front Awesome, and Mosaicast"
                :config="config"
                :without-animation="true"
                class="block h-72 min-w-0" />
        </div>
        <div class="min-w-0">
            <p>Example counts: Core 3, Front Awesome 5, Mosaicast 4.</p>
        </div>
    </div>
</template>
`;
const dataGridDemoSource = `<script setup>
import { ref } from 'vue';
import { DataGrid } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const columns = [
    { field: 'name', label: 'Package', sortable: true },
    { field: 'status', label: 'Status', sortable: true },
];
const data = [
    { id: 1, name: 'Core', status: 'Preview' },
    { id: 2, name: 'Front Awesome', status: 'Beta' },
    { id: 3, name: 'Mosaicast', status: 'Preview' },
];
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="loaded = !loaded">{{
                loaded ? 'Reset grid' : 'Render local grid'
            }}</Button>
        </div>
        <div class="min-w-0">
            <DataGrid
                v-if="loaded"
                label="Package status"
                row-key="id"
                :data="data"
                :columns="columns"
                :with-search="true"
                :paginate="true"
                :page-size="2"
                :page-size-options="[2, 5]" />
        </div>
    </div>
</template>
`;
const doughnutChartDemoSource = `<script setup>
import { ref } from 'vue';
import { DoughnutChart } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const config = {
    type: 'doughnut',
    data: {
        labels: ['Core', 'Front Awesome', 'Mosaicast'],
        datasets: [
            {
                label: 'Example count',
                data: [3, 5, 4],
            },
        ],
    },
    options: {
        animation: false,
    },
};
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="loaded = !loaded">{{ loaded ? 'Reset chart' : 'Render chart' }}</Button>
        </div>
        <div class="min-w-0">
            <DoughnutChart
                v-if="loaded"
                label="Example package counts"
                description="Synthetic values for Core, Front Awesome, and Mosaicast"
                :config="config"
                :without-animation="true"
                class="block h-72 min-w-0" />
        </div>
        <div class="min-w-0">
            <p>Example counts: Core 3, Front Awesome 5, Mosaicast 4.</p>
        </div>
    </div>
</template>
`;
const lineChartDemoSource = `<script setup>
import { ref } from 'vue';
import { LineChart } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const config = {
    type: 'line',
    data: {
        labels: ['Core', 'Front Awesome', 'Mosaicast'],
        datasets: [
            {
                label: 'Example count',
                data: [3, 5, 4],
            },
        ],
    },
    options: {
        animation: false,
    },
};
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="loaded = !loaded">{{ loaded ? 'Reset chart' : 'Render chart' }}</Button>
        </div>
        <div class="min-w-0">
            <LineChart
                v-if="loaded"
                label="Example package counts"
                description="Synthetic values for Core, Front Awesome, and Mosaicast"
                :config="config"
                :without-animation="true"
                class="block h-72 min-w-0" />
        </div>
        <div class="min-w-0">
            <p>Example counts: Core 3, Front Awesome 5, Mosaicast 4.</p>
        </div>
    </div>
</template>
`;
const pieChartDemoSource = `<script setup>
import { ref } from 'vue';
import { PieChart } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const config = {
    type: 'pie',
    data: {
        labels: ['Core', 'Front Awesome', 'Mosaicast'],
        datasets: [
            {
                label: 'Example count',
                data: [3, 5, 4],
            },
        ],
    },
    options: {
        animation: false,
    },
};
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="loaded = !loaded">{{ loaded ? 'Reset chart' : 'Render chart' }}</Button>
        </div>
        <div class="min-w-0">
            <PieChart
                v-if="loaded"
                label="Example package counts"
                description="Synthetic values for Core, Front Awesome, and Mosaicast"
                :config="config"
                :without-animation="true"
                class="block h-72 min-w-0" />
        </div>
        <div class="min-w-0">
            <p>Example counts: Core 3, Front Awesome 5, Mosaicast 4.</p>
        </div>
    </div>
</template>
`;
const polarAreaChartDemoSource = `<script setup>
import { ref } from 'vue';
import { PolarAreaChart } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const config = {
    type: 'polarArea',
    data: {
        labels: ['Core', 'Front Awesome', 'Mosaicast'],
        datasets: [
            {
                label: 'Example count',
                data: [3, 5, 4],
            },
        ],
    },
    options: {
        animation: false,
    },
};
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="loaded = !loaded">{{ loaded ? 'Reset chart' : 'Render chart' }}</Button>
        </div>
        <div class="min-w-0">
            <PolarAreaChart
                v-if="loaded"
                label="Example package counts"
                description="Synthetic values for Core, Front Awesome, and Mosaicast"
                :config="config"
                :without-animation="true"
                class="block h-72 min-w-0" />
        </div>
        <div class="min-w-0">
            <p>Example counts: Core 3, Front Awesome 5, Mosaicast 4.</p>
        </div>
    </div>
</template>
`;
const radarChartDemoSource = `<script setup>
import { ref } from 'vue';
import { RadarChart } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const config = {
    type: 'radar',
    data: {
        labels: ['Core', 'Front Awesome', 'Mosaicast'],
        datasets: [
            {
                label: 'Example count',
                data: [3, 5, 4],
            },
        ],
    },
    options: {
        animation: false,
    },
};
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="loaded = !loaded">{{ loaded ? 'Reset chart' : 'Render chart' }}</Button>
        </div>
        <div class="min-w-0">
            <RadarChart
                v-if="loaded"
                label="Example package counts"
                description="Synthetic values for Core, Front Awesome, and Mosaicast"
                :config="config"
                :without-animation="true"
                class="block h-72 min-w-0" />
        </div>
        <div class="min-w-0">
            <p>Example counts: Core 3, Front Awesome 5, Mosaicast 4.</p>
        </div>
    </div>
</template>
`;
const scatterChartDemoSource = `<script setup>
import { ref } from 'vue';
import { ScatterChart } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const config = {
    type: 'scatter',
    data: {
        labels: ['Core', 'Front Awesome', 'Mosaicast'],
        datasets: [
            {
                label: 'Example count',
                data: [
                    {
                        x: 1,
                        y: 3,
                    },
                    {
                        x: 2,
                        y: 5,
                    },
                    {
                        x: 3,
                        y: 4,
                    },
                ],
            },
        ],
    },
    options: {
        animation: false,
    },
};
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="loaded = !loaded">{{ loaded ? 'Reset chart' : 'Render chart' }}</Button>
        </div>
        <div class="min-w-0">
            <ScatterChart
                v-if="loaded"
                label="Example package counts"
                description="Synthetic values for Core, Front Awesome, and Mosaicast"
                :config="config"
                :without-animation="true"
                class="block h-72 min-w-0" />
        </div>
        <div class="min-w-0">
            <p>Example counts: Core 3, Front Awesome 5, Mosaicast 4.</p>
        </div>
    </div>
</template>
`;
const sparklineDemoSource = `<script setup>
import { Sparkline } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Sparkline
                label="Example weekly counts of 3, 5, 4, 7, and 6"
                data="3 5 4 7 6"
                class="block h-16 w-full" />
        </div>
        <div class="min-w-0">
            <p>Example counts: 3, 5, 4, 7, 6.</p>
        </div>
    </div>
</template>
`;
const chartDemoSource = `<script setup>
import { ref } from 'vue';
import { Chart } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const loaded = ref(false);
const config = {
    type: 'bar',
    data: {
        labels: ['Core', 'Front Awesome', 'Mosaicast'],
        datasets: [
            {
                label: 'Example count',
                data: [3, 5, 4],
            },
        ],
    },
    options: {
        animation: false,
    },
};
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button @click="loaded = !loaded">{{ loaded ? 'Reset chart' : 'Render chart' }}</Button>
        </div>
        <div class="min-w-0">
            <Chart
                v-if="loaded"
                label="Example package counts"
                description="Synthetic values for Core, Front Awesome, and Mosaicast"
                :config="config"
                :without-animation="true"
                class="block h-72 min-w-0" />
        </div>
        <div class="min-w-0">
            <p>Example counts: Core 3, Front Awesome 5, Mosaicast 4.</p>
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
            <ComponentCatalog group="data-viz" :navigation="navigation" />
        </ProseSection>
        <ProseSection id="wrapper-availability" title="Wrapper availability">
            <p>
                Pro wrappers in this group are available in Front Awesome beta. Install the licensed
                Pro runtime before using the examples below.
            </p>
        </ProseSection>
        <ProseSection id="bar-chart" title="Bar Chart">
            <p>
                Compare values with bars. This example requires the Front Awesome beta Pro wrappers
                and Web Awesome Pro 3.14.0.
            </p>
            <DemoFrame
                data-catalog-demo="BarChart"
                title="Bar Chart example"
                :sources="[
                    { label: 'Bar Chart basic example', language: 'vue', code: barChartDemoSource },
                ]">
                <BarChartDemo />
            </DemoFrame>
            <p>
                Expected result. Render chart plots the local synthetic dataset without animation.
                The visible text retains the values. Reset chart removes the canvas. These values
                are examples, not package usage statistics.
            </p>
        </ProseSection>
        <ProseSection id="bubble-chart" title="Bubble Chart">
            <p>
                Compare points with a size dimension. This example requires the Front Awesome beta
                Pro wrappers and Web Awesome Pro 3.14.0.
            </p>
            <DemoFrame
                data-catalog-demo="BubbleChart"
                title="Bubble Chart example"
                :sources="[
                    {
                        label: 'Bubble Chart basic example',
                        language: 'vue',
                        code: bubbleChartDemoSource,
                    },
                ]">
                <BubbleChartDemo />
            </DemoFrame>
            <p>
                Expected result. Render chart plots the local synthetic dataset without animation.
                The visible text retains the values. Reset chart removes the canvas. Bubble radius
                is an additional synthetic dimension, not package usage data.
            </p>
        </ProseSection>
        <ProseSection id="data-grid" title="Data Grid">
            <p>
                Present data in a structured grid. This example requires the Front Awesome beta Pro
                wrappers and Web Awesome Pro 3.14.0.
            </p>
            <DemoFrame
                data-catalog-demo="DataGrid"
                title="Data Grid example"
                :sources="[
                    { label: 'Data Grid basic example', language: 'vue', code: dataGridDemoSource },
                ]">
                <DataGridDemo />
            </DemoFrame>
            <p>
                Expected result. Render local grid displays three package rows, two per page. Search
                filters the local rows. Sortable column headings and pagination work without a
                server request. Reset grid removes it.
            </p>
        </ProseSection>
        <ProseSection id="doughnut-chart" title="Doughnut Chart">
            <p>
                Compare proportions around a ring. This example requires the Front Awesome beta Pro
                wrappers and Web Awesome Pro 3.14.0.
            </p>
            <DemoFrame
                data-catalog-demo="DoughnutChart"
                title="Doughnut Chart example"
                :sources="[
                    {
                        label: 'Doughnut Chart basic example',
                        language: 'vue',
                        code: doughnutChartDemoSource,
                    },
                ]">
                <DoughnutChartDemo />
            </DemoFrame>
            <p>
                Expected result. Render chart plots the local synthetic dataset without animation.
                The visible text retains the values. Reset chart removes the canvas. These values
                are examples, not package usage statistics.
            </p>
        </ProseSection>
        <ProseSection id="line-chart" title="Line Chart">
            <p>
                Show a series across an ordered axis. This example requires the Front Awesome beta
                Pro wrappers and Web Awesome Pro 3.14.0.
            </p>
            <DemoFrame
                data-catalog-demo="LineChart"
                title="Line Chart example"
                :sources="[
                    {
                        label: 'Line Chart basic example',
                        language: 'vue',
                        code: lineChartDemoSource,
                    },
                ]">
                <LineChartDemo />
            </DemoFrame>
            <p>
                Expected result. Render chart plots the local synthetic dataset without animation.
                The visible text retains the values. Reset chart removes the canvas. These values
                are examples, not package usage statistics.
            </p>
        </ProseSection>
        <ProseSection id="pie-chart" title="Pie Chart">
            <p>
                Compare proportions of a whole. This example requires the Front Awesome beta Pro
                wrappers and Web Awesome Pro 3.14.0.
            </p>
            <DemoFrame
                data-catalog-demo="PieChart"
                title="Pie Chart example"
                :sources="[
                    { label: 'Pie Chart basic example', language: 'vue', code: pieChartDemoSource },
                ]">
                <PieChartDemo />
            </DemoFrame>
            <p>
                Expected result. Render chart plots the local synthetic dataset without animation.
                The visible text retains the values. Reset chart removes the canvas. These values
                are examples, not package usage statistics.
            </p>
        </ProseSection>
        <ProseSection id="polar-area-chart" title="Polar Area Chart">
            <p>
                Compare values on a radial scale. This example requires the Front Awesome beta Pro
                wrappers and Web Awesome Pro 3.14.0.
            </p>
            <DemoFrame
                data-catalog-demo="PolarAreaChart"
                title="Polar Area Chart example"
                :sources="[
                    {
                        label: 'Polar Area Chart basic example',
                        language: 'vue',
                        code: polarAreaChartDemoSource,
                    },
                ]">
                <PolarAreaChartDemo />
            </DemoFrame>
            <p>
                Expected result. Render chart plots the local synthetic dataset without animation.
                The visible text retains the values. Reset chart removes the canvas. These values
                are examples, not package usage statistics.
            </p>
        </ProseSection>
        <ProseSection id="radar-chart" title="Radar Chart">
            <p>
                Compare values across several dimensions. This example requires the Front Awesome
                beta Pro wrappers and Web Awesome Pro 3.14.0.
            </p>
            <DemoFrame
                data-catalog-demo="RadarChart"
                title="Radar Chart example"
                :sources="[
                    {
                        label: 'Radar Chart basic example',
                        language: 'vue',
                        code: radarChartDemoSource,
                    },
                ]">
                <RadarChartDemo />
            </DemoFrame>
            <p>
                Expected result. Render chart plots the local synthetic dataset without animation.
                The visible text retains the values. Reset chart removes the canvas. These values
                are examples, not package usage statistics.
            </p>
        </ProseSection>
        <ProseSection id="scatter-chart" title="Scatter Chart">
            <p>
                Show relationships between numeric values. This example requires the Front Awesome
                beta Pro wrappers and Web Awesome Pro 3.14.0.
            </p>
            <DemoFrame
                data-catalog-demo="ScatterChart"
                title="Scatter Chart example"
                :sources="[
                    {
                        label: 'Scatter Chart basic example',
                        language: 'vue',
                        code: scatterChartDemoSource,
                    },
                ]">
                <ScatterChartDemo />
            </DemoFrame>
            <p>
                Expected result. Render chart plots the local synthetic dataset without animation.
                The visible text retains the values. Reset chart removes the canvas. These values
                are examples, not package usage statistics.
            </p>
        </ProseSection>
        <ProseSection id="sparkline" title="Sparkline">
            <p>
                Show a compact trend alongside content. This example requires the Front Awesome beta
                Pro wrappers and Web Awesome Pro 3.14.0.
            </p>
            <DemoFrame
                data-catalog-demo="Sparkline"
                title="Sparkline example"
                :sources="[
                    {
                        label: 'Sparkline basic example',
                        language: 'vue',
                        code: sparklineDemoSource,
                    },
                ]">
                <SparklineDemo />
            </DemoFrame>
            <p>
                Expected result. A compact sparkline plots the five example counts. The visible
                numbers and accessible label preserve the data in text.
            </p>
        </ProseSection>
        <ProseSection id="chart" title="Chart">
            <p>
                Configure chart types, datasets, and plugins. This example requires the Front
                Awesome beta Pro wrappers and Web Awesome Pro 3.14.0.
            </p>
            <DemoFrame
                data-catalog-demo="Chart"
                title="Chart example"
                :sources="[
                    { label: 'Chart basic example', language: 'vue', code: chartDemoSource },
                ]">
                <ChartDemo />
            </DemoFrame>
            <p>
                Expected result. Render chart plots the local synthetic dataset without animation.
                The visible text retains the values. Reset chart removes the canvas. These values
                are examples, not package usage statistics.
            </p>
        </ProseSection>
    </article>
</template>
