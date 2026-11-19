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
            <ProseSection id="starting-environment" title="Prepare native queries"
                ><p>
                    Complete Install Dapter, field declarations, and multiple ordering first. These
                    examples create a separate in-memory SQLite connection only after Send request.
                    They never use the application database or real records. The fixture has two
                    visible records, three visible lines, and one hidden tenant record.
                </p></ProseSection
            >
            <ProseSection id="projection" title="Declare qualified targets and output keys"
                ><p>
                    Advanced joins, projections, and grouped results require QueryOptions with a
                    complete ResultIdentity. Use qualified trusted targets and FieldOptions output
                    for literal returned keys. Browser identifiers remain simple public names.
                    JoinedAliases returns two notebook lines without collapsing them into one model.
                    A partial identity that duplicates across lines returns a clear server
                    invalid_source error instead of dropping rows.
                </p></ProseSection
            >
            <ProseSection id="counts" title="Count the logical result"
                ><p>
                    Native pagination counts retain joins, grouping, HAVING, and mandatory scopes.
                    Ordinary whereHas remains supported without an advanced projection. A trusted
                    count factory receives base and filtered Builders and returns CountQueries with
                    total and filtered aggregate queries. Both queries must retain their mandatory
                    source and selection scopes. The factory and each transform run once. Do not
                    replace the filtered counter with a wider base query.
                </p></ProseSection
            >
            <ProseSection id="limits" title="Keep supported expressions explicit"
                ><p>
                    Ordering supports trusted aggregate aliases for count, sum, min, max, and avg
                    over simple qualified columns or star. Automatic search and filtering do not
                    target aggregate aliases. Arbitrary calculated projections, unions, and
                    unsupported source shapes fail closed. The package tests native SQLite, MySQL,
                    and PostgreSQL. This page demonstrates SQLite and does not emulate another
                    database collation.
                </p></ProseSection
            ><ComposedDemo scenario="JoinedAliases" />
            <ComposedDemo scenario="GroupedCounts" />
            <ComposedDemo scenario="CustomCounts" />
            <ComposedDemo scenario="DuplicateIdentity" /><ProseSection
                id="next-guide"
                title="Continue with the next task"
                ><p>
                    Return to
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    for prerequisites. Continue with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/actions').href"
                        >Invoke native actions</DocsLink
                    >.
                </p></ProseSection
            >
        </div>
    </article>
</template>
