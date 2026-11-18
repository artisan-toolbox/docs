<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import ResearchDemo from '@/components/demo/dapter/research/ResearchDemo.vue';
import CodeExample from '@/components/docs/CodeExample.vue';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const commands = `DAPTER_RESEARCH_ALLOW_SNAPSHOT_WRITES=1 php scripts/dapter-research/snapshot-probe.php`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="scope" title="Three different traversal contracts">
                <p>
                    This explanation compares native PostgreSQL research prototypes. Dapter's
                    existing cursor is a live view, not captured membership or frozen output. No
                    snapshot paging mode, creation command, or public handle is delivered.
                    PostgreSQL 18.6 runs the mutation experiment with independent reader and writer
                    sessions. Every capture commits before a mutation, and every mutation commits
                    before the next read. No browser-spanning transaction remains open.
                </p>
                <DocsTable
                    caption="Candidate contracts"
                    :columns="['Candidate', 'Persisted state', 'Later authorized output']"
                    :rows="[
                        [
                            'High-water',
                            'Maximum identity 70 and live tuple boundary',
                            'Current rows and values. Backfilled identities can enter. Sort edits can repeat or omit rows.',
                        ],
                        [
                            'Ordered membership',
                            'Snapshot identity, ordinal, and result identity',
                            'Current values in captured order for surviving authorized members.',
                        ],
                        [
                            'Frozen output',
                            'The same entries plus captured id, rank, and label',
                            'Captured values for surviving authorized members, subject to safe field authorization.',
                        ],
                    ]" />
                <p>
                    Authorization uses current tenant and permission predicates, independently of
                    the original mutable search selection. Deleted and unauthorized members are
                    suppressed in both persisted prototypes. Replaying every captured payload
                    without current authorization can expose deleted or revoked records. See
                    <DocsLink href="https://www.postgresql.org/docs/18/transaction-iso.html"
                        >PostgreSQL transaction isolation</DocsLink
                    >
                    and
                    <DocsLink
                        href="https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-SNAPSHOT-SYNCHRONIZATION"
                        >snapshot synchronization</DocsLink
                    >. Exported MVCC snapshots depend on an open exporting transaction and do not
                    supply durable cross-request storage.
                </p>
            </ProseSection>
            <ProseSection id="mutations" title="Nine observed committed scenarios">
                <p>
                    The initial authorized order is 10, 20, 40, 50, 60, 70. Initial rank equals
                    identity and label is row-&lt;id&gt;. Tenant 2's ID 80 remains excluded. Page
                    one contains 10 and 20. Page size is two, live boundary is (20,20), captured
                    ordinal is two, and the high-water identity is 70.
                </p>
                <DocsTable
                    caption="Observed next windows after page one"
                    :columns="[
                        'Committed mutation',
                        'High-water',
                        'Ordered membership',
                        'Frozen output',
                    ]"
                    :rows="[
                        ['None', '40, 50', '40, 50', '40, 50'],
                        ['Insert 90 above the bound', '40, 50', '40, 50', '40, 50'],
                        ['Backfill 30 below the bound', '30, 40', '40, 50', '40, 50'],
                        [
                            'Update label of 40',
                            '40, 50 with current label',
                            '40, 50 with current label',
                            '40, 50 with captured label',
                        ],
                        [
                            'Move 40 to rank 5 and 10 to rank 65',
                            '50, 60',
                            '40, 50 in captured order',
                            '40, 50 with captured rank',
                        ],
                        ['Delete 50', '40, 60', '40, 60', '40, 60'],
                        ['Revoke 60', '40, 50, then 70', '40, 50, then 70', '40, 50, then 70'],
                        [
                            'Delete and replace entity 40 at the same key',
                            'Replacement entity 40, 50',
                            'Replacement entity 40, 50',
                            'Deleted entity payload 40, 50',
                        ],
                        [
                            'Combine insertion, edits, deletion, and revocation',
                            '30, 10',
                            '40, 70 with current values',
                            '40, 70 with captured values',
                        ],
                    ]" />
                <p>
                    In the combined case, high-water traversal admits the backfilled 30, repeats the
                    already-read 10, and misses 40 after its sort value crosses the boundary.
                    Ordered membership returns 40 at its current rank 5. Frozen output returns its
                    original rank 40 and label row-40.
                </p>
                <p>
                    The identity-reuse result is deliberately unsafe. After deleting 40, an allowed
                    replacement with the same key satisfies the key-only authorization join. Ordered
                    membership admits a new entity, and frozen output replays the deleted entity's
                    old payload. A proven no-reuse identity contract or a generation identity
                    checked at capture and read time is required. The experiment records
                    production_safe=false. A passing experiment reproduces that defect rather than
                    claiming production safety.
                </p>
            </ProseSection>
            <ProseSection id="admission" title="Metadata admission and recovery boundaries">
                <p>
                    The fixture records principal reader-1, authorization revision
                    tenant-1-permissions-v1, creation and expiry times, building and ready states,
                    captured count, query descriptor, and serializer revision. A different
                    principal, a revised scope, an expired deadline, or a missing identifier
                    produces an explicit research restart outcome before entry reads.
                </p>
                <p>
                    The query_hash value is a symbolic descriptor, not an authenticated
                    normalized-query digest. The prototype does not check query or serializer
                    compatibility. It has no signed or encrypted public handle. Expiration advances
                    the comparison by 16 minutes without changing the database clock or sleeping. It
                    proves the predicate, not cleanup scheduling, quota enforcement, or recovery
                    from partial capture.
                </p>
                <p>
                    A fresh third database session reads the same committed windows. A new traversal
                    after the combined mutation starts at 40, 20 instead of replaying the captured
                    start. This is fresh-session recovery evidence, not a full service restart or a
                    production authorization token. Frozen projections also require current
                    field-audience authorization and serializer revision checks before replay.
                </p>
            </ProseSection>
            <ProseSection id="storage" title="Measured bytes with an explicit boundary">
                <p>
                    Three independent reads of the same first capture each measure one metadata row
                    and six entries per candidate. These are repeated reads of one fixture, not
                    three independent capture runs or a benchmark. PostgreSQL text rendering of
                    jsonb_build_array supplies the logical byte representation. The physical
                    measurement uses pg_total_relation_size, including each relation's indexes and
                    auxiliary storage.
                </p>
                <DocsTable
                    caption="Observed six-entry storage on PostgreSQL 18.6"
                    :columns="[
                        'Storage owner',
                        'Logical entry bytes',
                        'Main heap bytes',
                        'Index bytes',
                        'Total relation bytes',
                    ]"
                    :rows="[
                        ['Ordered keys', '42', '8,192', '32,768', '40,960'],
                        ['Frozen output', '300', '8,192', '32,768', '49,152'],
                        [
                            'Shared metadata, one row',
                            'Excluded from entry measurement',
                            'Reported in total',
                            'Reported in total',
                            '49,152',
                        ],
                    ]" />
                <p>
                    Logical entry bytes exclude UUIDs, metadata, row headers, alignment, page
                    allocation, indexes, and storage bookkeeping. Physical totals include precreated
                    relation allocation without subtracting an empty-table baseline. The
                    ownership-marker table is outside the candidate measurement. Base-source rows,
                    WAL, replicas, backups, temporary files, memory, network transfer, and
                    encryption overhead are excluded. Count metadata once for whichever candidate is
                    chosen. Page allocation makes tiny-row extrapolation unsafe. The experiment
                    establishes no capacity, latency, throughput, or production savings estimate.
                    See
                    <DocsLink
                        href="https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-ADMIN-DBSIZE"
                        >PostgreSQL object size functions</DocsLink
                    >.
                </p>
            </ProseSection>
            <ProseSection id="current-boundary" title="Observe the current paging refusal">
                <p>
                    Start submits a structurally shaped but unsupported snapshot mode through the
                    real Dapter endpoint. Expected HTTP 422 unsupported_operation contains no rows
                    or capabilities. This example needs no database, authentication change, or
                    persisted research table. Reset clears the response. Opening the page performs
                    no experiment or database mutation.
                </p>
            </ProseSection>
            <ResearchDemo scenario="SnapshotRejected" />
            <ProseSection id="reproduce" title="Guarded CLI mutation artifacts">
                <p>
                    The documentation repository owns
                    <code>scripts/dapter-research/snapshot-fixture.sql</code>,
                    <code>snapshot-probe.php</code>, and sanitized
                    <code>results/snapshot.json</code>. Review the
                    <DocsLink
                        href="https://github.com/artisan-toolbox/docs/tree/1.x/scripts/dapter-research"
                        >research artifacts</DocsLink
                    >
                    before provisioning the dedicated dapter_research_snapshot schema in a
                    disposable PostgreSQL database. Never apply the fixture to business tables. No
                    web route invokes this script.
                </p>
                <p>
                    From the documentation checkout with PHP and PDO PostgreSQL installed, set
                    DAPTER_RESEARCH_PG_DSN, DAPTER_RESEARCH_PG_USER, and DAPTER_RESEARCH_PG_PASSWORD
                    using local secret handling. The mutation command requires an explicit guard,
                    the exact ownership marker, and an empty snapshots table. Reprovision a fresh
                    disposable fixture for each complete run. It never creates schemas or installs
                    extensions itself. Expect nine verified scenarios, production_safe=false for
                    identity reuse, the metadata compatibility gap, repeated storage measurements,
                    and matching committed windows from a fresh session. Physical byte totals can
                    differ on another PostgreSQL installation.
                </p>
                <CodeExample
                    label="Run the mutation experiment from the docs checkout"
                    :code="commands" />
            </ProseSection>
            <ProseSection
                id="decision"
                title="Defer public snapshots until their operating contract exists">
                <p>
                    Ordered membership with current values is the smaller future candidate when
                    stable membership is the actual requirement. It still needs generation-safe
                    identities, complete current authorization, secure source-bound handles,
                    retention, deadlines, quotas, cleanup, publication recovery, and concurrent
                    revocation tests. Frozen output adds sensitive-value retention and
                    field-audience and serializer compatibility requirements. Neither prototype is a
                    supported Dapter paging mode.
                </p>
                <p>
                    Return to
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/research').href"
                        >Research findings</DocsLink
                    >
                    or use the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/cursor-paging').href"
                        >working live cursor guide</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
