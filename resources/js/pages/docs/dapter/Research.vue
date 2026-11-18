<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
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
            <ProseSection id="scope" title="Four questions with separate outcomes">
                <p>
                    This explanation records completed experiments for the unpublished Dapter
                    preview. The experiments examine native database behavior and two persisted
                    traversal prototypes. They do not add a vector MatchType, a snapshot PagingMode,
                    or a new frontend control. Current public paging remains offset, simple, and
                    live cursor.
                </p>
                <DocsTable
                    caption="Research decisions"
                    :columns="['Question', 'Evidence', 'Decision']"
                    :rows="[
                        [
                            'Prepared vector retrieval',
                            'PostgreSQL 18.6 with pgvector 0.8.7 ranks a real vector(3) column and reapplies SQL authorization.',
                            'Native feasibility established. Public Dapter support deferred.',
                        ],
                        [
                            'Vector paging and unsupported engines',
                            'Exact offset, lookahead, and raw rank seek work on the fixed fixture. Configured MySQL 8.4.11 refuses Laravel vector grammar.',
                            'No Dapter cursor or approximate-index guarantee established.',
                        ],
                        [
                            'Traversal consistency',
                            'Nine committed mutation scenarios compare high-water, ordered keys, and frozen values. Primary-key reuse breaks both persisted prototypes.',
                            'Public snapshots deferred. Ordered keys with current values remain the smaller future candidate.',
                        ],
                        [
                            'Retention, recovery, and storage',
                            'Independent sessions recover committed entries. Expiry and scope checks reject fixture handles. Six-entry storage is measured separately from logical bytes.',
                            'Secure handles, generation identity, cleanup, quotas, and field authorization still need implementation.',
                        ],
                    ]" />
            </ProseSection>
            <ProseSection
                id="independent"
                title="Keep engine support separate from package support">
                <p>
                    The initial PostgreSQL environment had no available or installed pgvector
                    extension. That historical absence blocked an early positive vector test. After
                    the user installed pgvector, the real native-column baseline and revocation
                    probes both passed with extension version 0.8.7. No reader request or published
                    probe installs an extension.
                </p>
                <p>
                    Native ranking does not supply a typed Dapter rank, distance metadata, a
                    negotiated driver, authenticated cursor state, or operational limits. Persisted
                    rows do not supply a production snapshot handle. These missing contracts explain
                    the deferrals independently of extension availability.
                </p>
            </ProseSection>
            <ProseSection id="readings" title="Inspect the focused findings">
                <p>
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/research/vector-retrieval').href
                        "
                        >Vector retrieval research</DocsLink
                    >
                    defines the prepared input, metric, actual ranks, native paging boundaries, and
                    unsupported request example.
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/research/pagination-consistency')
                                .href
                        "
                        >Pagination consistency research</DocsLink
                    >
                    compares mutation outcomes, authorization gaps, restart behavior, and the
                    measured storage boundary. Both pages link to reproducible CLI-only laboratory
                    artifacts.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
