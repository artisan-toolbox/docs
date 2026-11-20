<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import FirstDemo from '@/components/demo/front-awesome/data-view/FirstDemo.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import backend from '../../../../../app/DataSources/Dapter/Quickstart.php?raw';
defineProps({
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
                    This example uses Front Awesome 1.0.0-beta.7 and Dapter 1.0.0-beta.4. This
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
