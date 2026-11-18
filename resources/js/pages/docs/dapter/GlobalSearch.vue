<script setup>
import ComposedDemo from '@/components/demo/dapter/composed/ComposedDemo.vue';
import ComposedControlsDemo from '@/components/demo/dapter/composed/ComposedControlsDemo.vue';
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
            <ProseSection id="starting-environment" title="Prepare the composed preview"
                ><p>
                    Complete Install Dapter in a Laravel 13, PHP 8.5, Inertia 3, and Vue 3
                    application. Preserve the web session, CSRF middleware, Ziggy routes, and
                    Composer-before-npm installation. These APIs are an unpublished local preview.
                    Opt in to protocol 2 for composed reads. Default version 1 reads remain
                    compatible.
                </p></ProseSection
            >
            <ProseSection id="declare-targets" title="Declare trusted targets"
                ><p>
                    Call globalSearchable with a nonempty map of public identifiers to SearchTarget
                    objects. Each target fixes its server path, valueType, and matchType. The
                    browser sends one string. It cannot replace a target or match rule. Literal
                    string targets receive the original search text. Numeric targets accept
                    canonical numeric text. An incompatible target contributes false. If every
                    target is incompatible, the active search matches no rows. The string 0 remains
                    active. An empty string clears the global search.
                </p>
                <p>
                    String literal targets share the source-owned strictLiteralSearch policy with
                    field search. The default ignores case, accents, and canonical composition for
                    the documented variants. Strict mode preserves exact text. FullText retains its
                    parser and dictionary semantics in both modes. Follow
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/literal-search').href"
                        >Choose literal search sensitivity</DocsLink
                    >
                    for fixed default and strict examples. The browser never submits a sensitivity
                    override.
                </p></ProseSection
            >
            <ProseSection id="group-searches" title="Choose All or Any"
                ><p>
                    searchMatch declares the default and allowed choices. All combines active field
                    searches and the single global OR group with AND. Any combines these search
                    clauses with OR. Field and global finite filters remain mandatory AND
                    restrictions. Mandatory source predicates remain outside the search group.
                    GlobalAny uses Notebook plus numeric 0 and returns IDs 1, 2, and 3. All with the
                    same input returns only ID 1.
                </p></ProseSection
            ><ComposedControlsDemo /><ComposedDemo scenario="GlobalNotebook" />
            <ComposedDemo scenario="GlobalZero" />
            <ComposedDemo scenario="GlobalIncompatible" />
            <ComposedDemo scenario="GlobalAny" /><ProseSection
                id="next-guide"
                title="Continue with the next task"
                ><p>
                    Return to
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    for prerequisites. Continue with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/global-filters').href"
                        >Apply finite global filters</DocsLink
                    >.
                </p></ProseSection
            >
        </div>
    </article>
</template>
