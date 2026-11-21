<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PressroomDemo from '@/components/demo/front-awesome/data-view/PressroomDemo.vue';
import FirstDemo from '@/components/demo/front-awesome/data-view/FirstDemo.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import backend from '../../../../../app/DataSources/Dapter/Quickstart.php?raw';
defineProps({
    pressroomPreview: { type: Object, required: true },
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const firstTable = String.raw`<script setup>
import { useDataAdapter } from '@artisan-toolbox/dapter';
import { DataView } from '@artisan-toolbox/front-awesome/data-view';

const catalog = useDataAdapter('Dapter.Quickstart', { id: 'first-table', url: false });
const views = {
    table: {
        columns: [
            { field: 'name', label: 'Notebook' },
            { field: 'category', label: 'Paper' },
        ],
    },
};
</${'script'}>

<template>
    <DataView :adapter="catalog" :views="views" row-key="id" label="Notebooks" />
</template>`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="support-queue" title="Find the next ticket due">
                <p>
                    DataView displays a Dapter source as a table, list, or grid. Try the print shop
                    queue below, or
                    <DocsLink href="#install-the-packages">install both packages</DocsLink>
                    to build your first table.
                </p>
                <ol class="list-decimal space-y-2 pl-5">
                    <li>
                        Open the support queue. In the development preview, choose
                        <strong>View options</strong> beside quick search, then open
                        <strong>Filters</strong>. On beta.8, use
                        <strong>Search and filters</strong>.
                    </li>
                    <li>
                        Set <strong>Status</strong> to <strong>Waiting</strong> and choose
                        <strong>Apply</strong>. In the preview, choose <strong>Done</strong>. Four
                        of the twelve tickets need a reply.
                    </li>
                    <li>
                        Sort <strong>Reply due</strong> in ascending order. PR-416 is first, due at
                        09:45. Choose <strong>List</strong> to read the request or
                        <strong>Grid</strong> to see who owns it.
                    </li>
                </ol>
                <PressroomDemo :preview="pressroomPreview" />
                <p>
                    In the preview, remove the <strong>Waiting</strong> badge below quick search to
                    see all twelve tickets again. When deadlines match,
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'front-awesome/data-view/ordering')
                                .href + '#multi-sort'
                        "
                        >sort by deadline and run size</DocsLink
                    >.
                </p>
            </ProseSection>
            <ProseSection id="install-the-packages" title="Install both packages">
                <p>
                    Start in a Laravel 13.36+ application within 13.x, with PHP 8.5 or 8.6, Inertia
                    3, Vue 3, Vite, and a web session. From the application root, follow
                    <DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                        >Install Front Awesome</DocsLink
                    >
                    and
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >. Install the Composer packages first. Then install their frontend dependencies
                    from the vendor directories, configure Vite and styles, and expose Dapter’s
                    named data route through Ziggy.
                </p>
                <p>
                    This example uses Front Awesome 1.0.0-beta.8 and Dapter 1.0.0-beta.4. This
                    guest-accessible source needs a web session and CSRF protection. Reads run
                    without a worker or a broadcaster.
                </p>
            </ProseSection>
            <ProseSection id="create-a-source" title="Create a notebook source">
                <p>
                    Save this class at <code>app/DataSources/Dapter/Quickstart.php</code>. Dapter
                    resolves its name as <code>Dapter.Quickstart</code>. PublicAccess permits guests
                    to read these 23 fictional records.
                </p>
                <CodeExample
                    label="app/DataSources/Dapter/Quickstart.php"
                    language="php"
                    :code="backend" />
            </ProseSection>
            <ProseSection id="show-a-table" title="Show the first page">
                <p>
                    Save this component as <code>FirstTable.vue</code> in your application. Mount it
                    in an Inertia page. The owner reads ten rows. The table displays Notebook 01
                    through Notebook 10. Select <strong>Next</strong> to see Notebook 11 through
                    Notebook 20. The last page contains three notebooks.
                </p>
                <CodeExample label="FirstTable.vue" language="vue" :code="firstTable" />
                <FirstDemo />
                <p>
                    Continue with
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'front-awesome/data-view/layouts').href
                        "
                        >Switch layouts and customize cells</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
