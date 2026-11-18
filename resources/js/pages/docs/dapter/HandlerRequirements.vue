<script setup>
import ComposedDemo from '@/components/demo/dapter/composed/ComposedDemo.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>
<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Prepare trusted handlers"
                ><p>
                    Complete Install Dapter, finite global filters, and source registration first.
                    These unpublished protocol 2 examples use fictional Collections or an isolated
                    in-memory SQLite connection. Start each read explicitly.
                </p></ProseSection
            ><ProseSection id="requirements" title="Declare actual compatibility"
                ><p>
                    Pass HandlerOptions with HandlerRequirements to a trusted filter or preset.
                    sourceType requires a real DataSource contract or base class. databases
                    restricts an Eloquent source to native sqlite, mysql, or pgsql engines. driver
                    requires the selected registered alias, even when that alias exists elsewhere in
                    the registry. An incompatible requirement fails before handler construction or
                    invocation. A driver capability label cannot emulate an engine.
                </p></ProseSection
            ><ComposedDemo scenario="RequiredCollection" /><ComposedDemo
                scenario="RequiredSqlite" /><ComposedDemo
                scenario="RequiredWrongEngine" /><ComposedDemo
                scenario="RequiredWrongAlias" /><ProseSection
                id="next-guide"
                title="Continue with the next task"
                ><p>
                    Return to
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    for prerequisites. Continue with
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/composed-declarations').href"
                        >Declare and inherit composed operations</DocsLink
                    >.
                </p></ProseSection
            >
        </div>
    </article>
</template>
