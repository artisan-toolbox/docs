<script setup>
import QuickstartUsageDemo from '@/components/demo/dapter/listing/QuickstartUsageDemo.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import Requirements from '@/components/docs/Requirements.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import InstallCommand from '@/components/docs/InstallCommand.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import quickstartSource from '../../../../../app/DataSources/Dapter/Quickstart.php?raw';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const adapter = `<script setup>
import { DataAdapter } from '@artisan-toolbox/dapter';
\x3C/script>

<template>
    <DataAdapter source="Dapter.Quickstart" v-slot="adapter">
        <p v-if="adapter.paging.loading">Loading...</p>
        <p v-if="adapter.error" role="alert">{{ adapter.error.message }}</p>
        <ul v-if="adapter.ready">
            <li v-for="notebook in adapter.data" :key="notebook.id">{{ notebook.name }}</li>
        </ul>
        <button :disabled="!adapter.paging.has_next || adapter.paging.loading"
            @click="adapter.paging.goToNext()">Next</button>
    </DataAdapter>
</template>`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="preview" title="List records from Laravel">
                <p>
                    Dapter gives your Vue page an authorized list of records and controls for
                    reading the next page. Render the records as a list, table, or cards. This guide
                    uses a public Collection. Dapter also reads ordinary SQLite, MySQL, and
                    PostgreSQL Eloquent sources.
                </p>
            </ProseSection>
            <Requirements :items="page.requirements" />
            <ProseSection id="installation" title="Install Dapter">
                <p>
                    From the root of your Laravel application with Inertia and Vue, install the
                    published beta with Composer.
                </p>
                <InstallCommand :package="page.package" label="Install Dapter with Composer" />
                <p>
                    Follow
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    to connect Vite, the frontend package, and the session-backed read route.
                </p>
            </ProseSection>
            <ProseSection id="first-example" title="Read the first page">
                <p>
                    Create <code>app/DataSources/Dapter/Quickstart.php</code>. This source generates
                    23 notebooks in memory. Its <code>PublicAccess</code> attribute lets a guest
                    read the catalog. Sources require authentication by default.
                </p>
                <CodeExample
                    language="php"
                    label="Executed quickstart source"
                    :code="quickstartSource" />
                <p>
                    Mount this component on an existing Vue page. Dapter requests the first ten rows
                    when the adapter mounts. The example uses the default protocol 1.
                </p>
                <CodeExample
                    language="vue"
                    label="Load the source asynchronously"
                    :code="adapter" />
                <p>
                    Select <strong>Start example</strong> to see Notebook 01 through Notebook 10.
                    Select <strong>Next</strong> to read Notebook 11 through Notebook 20.
                </p>
                <QuickstartUsageDemo />
            </ProseSection>
            <ProseSection id="next-steps" title="Choose a task">
                <p>
                    Choose the feature you want to add. Each guide supplies its prerequisites and
                    examples.
                </p>
                <nav aria-label="Dapter guides" data-search-exclude>
                    <ul>
                        <li
                            v-for="guide in findNavigationItem(navigation, 'dapter').children"
                            :key="guide.slug">
                            <DocsLink :href="guide.href">{{ guide.title }}</DocsLink>
                        </li>
                    </ul>
                </nav>
            </ProseSection>
            <ProseSection id="vue-controls" title="Add controls to your list">
                <p>
                    For a search box, start with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/field-search').href"
                        >search by name</DocsLink
                    >. To display the same result in two layouts,
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/vue-controls').href"
                        >share one adapter between views</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
