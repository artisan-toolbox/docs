<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="proposal-status" title="Proposed contracts and implemented behavior">
                <p>
                    These design guides record proposed contracts for the unpublished Dapter
                    preview. They describe design decisions, constraints, and acceptance criteria.
                    Unless a section explicitly identifies an implemented contract, its API examples
                    are unavailable. They are not installation instructions.
                </p>
                <p>
                    Begin with the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >installation guide</DocsLink
                    >, then run the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/listing').href"
                        >functional listing examples</DocsLink
                    >. The
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/roadmap').href"
                        >roadmap</DocsLink
                    >
                    owns delivery phases, task statuses, and their acceptance gates.
                </p>
            </ProseSection>
            <ProseSection id="design-boundaries" title="Read one design topic at a time">
                <p>
                    Source declarations determine server-owned permissions and defaults. Drivers
                    execute validated reads within source and connection boundaries. Operations
                    describe how search, filters, and ordering compose without weakening mandatory
                    scope.
                </p>
                <p>
                    Pagination and adapter state explain count semantics, requested and accepted
                    state, and preservation rules. Action design covers authorized package-routed
                    commands. Requests and live updates cover cancellation, URL ownership,
                    scrolling, broadcasts, and polling.
                </p>
                <p>
                    Shared contract fixtures fix reusable inputs, database targets, and expected
                    rows, counts, and failures. Their evidence categories distinguish the
                    implemented preview from reference checks and future native execution.
                </p>
            </ProseSection>
        </div>
        <nav aria-label="Proposed design guides" data-search-exclude>
            <ul class="grid list-none gap-3 pl-0 sm:grid-cols-2">
                <li
                    v-for="guide in findNavigationItem(navigation, 'dapter/design').children"
                    :key="guide.slug">
                    <DocsLink :href="guide.href">{{ guide.title }}</DocsLink>
                </li>
            </ul>
        </nav>
    </article>
</template>
