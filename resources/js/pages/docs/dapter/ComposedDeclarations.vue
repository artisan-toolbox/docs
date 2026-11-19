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
            <ProseSection id="starting-environment" title="Prepare the source declarations"
                ><p>
                    Complete Install Dapter and the global operation guides. These PHP 8.5 examples
                    use the same fictional Collection. Inspect the complete executable source in
                    each frame.
                </p></ProseSection
            >
            <ProseSection id="forms" title="Choose a declaration form"
                ><p>
                    GlobalSearch, GlobalFilter, GlobalOrder, MultiOrder, SearchGrouping, and Query
                    attributes use the same contracts as fluent options. A class GlobalFilter or
                    GlobalOrder requires id and apply. A private nonstatic method supplies its
                    handler and defaults its id to the method name. Method forms reject apply. PHP
                    8.5 static Closures in trusted attributes and invokable classes use the same
                    validated binder. Do not combine Action and a global operation on one method.
                </p></ProseSection
            >
            <ProseSection id="layers" title="Replace complete keyed declarations"
                ><p>
                    Configuration is the lowest layer. Parent attributes, child attributes, and
                    explicit fluent patches follow. Each field operation, global filter, or preset
                    replaces its whole keyed entry. A removal remains removed until explicitly
                    replaced. Same-layer duplicates fail. WithoutGlobalSearch, WithoutGlobalFilter,
                    and WithoutGlobalOrder remove inherited declarations. Their fluent equivalents
                    remove entries explicitly.
                </p></ProseSection
            >
            <ProseSection id="configuration" title="Capture primitive configuration"
                ><p>
                    dapter.declarations supports fields, global search, filters, and orders,
                    multi_order, search_match, query, actions_class, action_policies, and
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/literal-search/configuration')
                                .href
                        "
                        >strict_literal_search</DocsLink
                    >. Use primitive arrays, enum backing strings, and trusted class names. Do not
                    store Closures, services, or DTO instances in configuration. StoreOptions::make
                    captures configuration when created. makeWithoutDefaults captures neither scalar
                    defaults nor declarations. The fixed examples restore the application
                    configuration immediately after taking the snapshot.
                </p></ProseSection
            ><ComposedDemo scenario="ComposedAttributeMethods" />
            <ComposedDemo scenario="ComposedRemoved" />
            <ComposedDemo scenario="ComposedConfig" />
            <ComposedDemo scenario="ComposedNoDefaults" /><ProseSection
                id="next-guide"
                title="Continue with the next task"
                ><p>
                    Return to
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    for prerequisites. Continue with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/multi-order').href"
                        >Compose multiple order terms</DocsLink
                    >.
                </p></ProseSection
            >
        </div>
    </article>
</template>
