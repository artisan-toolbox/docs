<script setup>
import ActionDemo from '@/components/demo/dapter/actions/ActionDemo.vue';
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
            <ProseSection id="starting-environment" title="Prepare action declarations"
                ><p>
                    Complete Install Dapter and Invoke native actions first. The fixed dedicated
                    example writes only this browser session counter. Start explicitly before
                    loading metadata or calling an action.
                </p></ProseSection
            >
            <ProseSection id="owners" title="Select the owner"
                ><p>
                    Private inline methods, including parent-private and trait methods, require
                    Action. An Actions attribute or withActions class selects a dedicated class. Its
                    directly declared public nonstatic methods become endpoints, including trait
                    methods. Inherited public methods and magic methods do not become actions. Keep
                    helpers private. Container construction occurs after accepted input, source
                    access, policy, FormRequest authorization, and validation.
                </p></ProseSection
            >
            <ProseSection id="aliases" title="Keep methods and aliases finite"
                ><p>
                    Action id defines an alias without exposing its PHP method name. Dedicated
                    methods default to Visit and Post. Explicit ActionMethod values are Post, Put,
                    Patch, and Delete. The replace, amend, and remove buttons execute their declared
                    HTTP verbs. StoreOptions::actionAuthorize replaces a complete policy by public
                    action id. Class-level ActionAuthorize requires id. ActionAttributes
                    demonstrates a class policy by id. Method policy, child class policy, and
                    explicit fluent options replace a complete policy in that order. Unknown ids
                    fail configuration. Configuration, parent attributes, child attributes, and
                    explicit options follow the same layers without merging fragments of different
                    policies.
                </p></ProseSection
            >
            <ProseSection id="metadata" title="Keep FormRequest-only endpoints explicit"
                ><p>
                    A FormRequest-only endpoint with an explicit authorize method can be called
                    through dapter.action, but the listing cannot evaluate its input-dependent
                    authorization without input. It is omitted from action metadata, so same-handle
                    controls cannot advertise it. Pair a Gate with the FormRequest for working
                    controls. The formOnly source and backend test demonstrate the direct
                    named-route case. Do not bypass metadata omission by constructing browser URLs.
                </p></ProseSection
            ><ActionDemo external /><ActionDemo
                external
                source="Dapter.ActionAttributes" /><ActionDemo
                external
                source="Dapter.ActionConfigured" /><ProseSection
                id="next-guide"
                title="Continue with the next task"
                ><p>
                    Return to
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    for prerequisites. Continue with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/action-outcomes').href"
                        >Handle record targets and uncertain writes</DocsLink
                    >.
                </p></ProseSection
            >
        </div>
    </article>
</template>
