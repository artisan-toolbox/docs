<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const commands = `php artisan filoquent:gc --limit=100
php artisan filoquent:gc --apply --limit=100
php artisan filoquent:prune --apply --limit=100`;
const schedule = `use Illuminate\\Support\\Facades\\Schedule;

Schedule::command('filoquent:gc --apply --limit=1000')
    ->everyMinute()
    ->withoutOverlapping()
    ->runInBackground();

Schedule::command('filoquent:prune --apply --limit=1000')
    ->everyMinute()
    ->withoutOverlapping()
    ->runInBackground();`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="prerequisites" title="Prepare a complete database view">
                <p>
                    Complete the installation guide and keep the <code>filoquent_uploads</code>
                    ledger alongside the participating tables. Run collection with the writer
                    connection and permissions to see every owning row. Its primary-key column must
                    still have a single-column primary index.
                </p>
                <p>
                    The collector must see soft-deleted rows and all tenants in its selected
                    database. Database row security, tenant-specific credentials, key changes, or an
                    incomplete restored backup can hide live references. Use the correct maintenance
                    connection. Pause scheduled collection during table migrations and restores. Run
                    only the controlled passes in the
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/rename-owners').href"
                        >owner renaming and resolution procedure</DocsLink
                    >
                    until its schema and ownership checks pass.
                </p>
                <p>
                    To detect missing files still referenced by owners, use the read-only
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/health').href"
                        >file health audit</DocsLink
                    >. Collection reconciles ownership and cleanup eligibility rather than checking
                    whether every live file exists.
                </p>
            </ProseSection>
            <ProseSection id="run" title="Preview and apply a bounded batch">
                <p>From the Laravel application root, run:</p>
                <CodeExample label="Preview collection and apply reconciliation" :code="commands" />
                <p>
                    The first command leaves SQL receipts and files unchanged. With the optional
                    Redis journal enabled, it also leaves Redis intents and their index unchanged.
                    Applied collection has three independently bounded phases. It imports Redis
                    intents into pending SQL receipts, processes pending receipts, and checks active
                    receipts against their physical owner rows. <code>--limit</code> caps each
                    phase, not their combined total. The final command retries known retirements
                    whose storage deletion failed.
                </p>
                <p>
                    For an active receipt, a first confirmed absence marks a candidate. A later
                    confirmed absence, at least 24 hours after that mark, permits retirement and
                    exact-path deletion.
                </p>
                <p>
                    A direct SQL row deletion leaves no owner. Dropping a file column leaves no
                    matching manifest in that row. Both become candidates. Renaming a model or
                    column preserves the recorded files. An exact manifest in any current column
                    proves the reference remains live. Soft-deleted owners remain visible and retain
                    their files.
                </p>
            </ProseSection>
            <ProseSection id="pending" title="Consolidate and clean pending uploads">
                <p>
                    Enable the optional journal through the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'filoquent/configuration').href +
                            '#redis-journal'
                        "
                        >Redis configuration reference</DocsLink
                    >
                    after running the package migrations. Run applied collection frequently so
                    rolled-back or interrupted upload intents acquire durable SQL receipts. Preview
                    mode does not import, acknowledge, retire, or delete anything.
                </p>
                <p>
                    Each imported UUID becomes pending only when it has no conflicting SQL receipt.
                    An active receipt remains active. The collector acknowledges an intent after SQL
                    consolidation succeeds. Retrying an import preserves the same receipt and its
                    first promotion time. The minimum 24-hour grace period starts at that first SQL
                    promotion, even when an old intent has waited in Redis for longer.
                </p>
                <p>
                    After the grace period, the collector claims and commits a pending receipt as
                    retired before draining its exact manifest. A publication racing with this claim
                    cannot activate a generation that cleanup has already claimed. Committed pending
                    receipts still receive cleanup when Redis is disabled. If Redis is unavailable,
                    the command reports failure and continues the SQL pending and active phases.
                    Resolve the reported failure and rerun the command to retry Redis import.
                </p>
            </ProseSection>
            <ProseSection id="uncertainty" title="Resolve ambiguous candidates">
                <p>
                    A missing physical owner table creates one durable pending group for its whole
                    route during applied collection. Filoquent retains its files and blocks managed
                    saves and deletes on that route. The block remains if the old table name
                    reappears. An operator must use <code>filoquent:resolve-pending</code> to verify
                    a renamed or restored table, or explicitly confirm permanent removal. Follow the
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/rename-owners').href"
                        >pending-resolution guide</DocsLink
                    >
                    before changing ownership routes.
                </p>
                <p>
                    Collection counts the affected active uploads through the owner-table index at
                    detection and skips that blocked range in later passes. It does not walk or log
                    every affected upload. Each pass claims at most 500 table reports, also bounded
                    by <code>--limit</code>, independently of its upload phases. A persistent SQL
                    claim limits the unresolved-table error to once per table per UTC day across
                    processes. Command start and completion logs remain per invocation. Preview
                    collection does not create groups or claim a daily report.
                </p>
                <p>
                    A missing primary key, invalid receipt, or partial or malformed metadata
                    referencing the same upload remains unresolved. Filoquent retains the files,
                    clears any previous absence mark, and reports the problem. A restored live
                    reference clears a normal row-level absence mark. It does not release a pending
                    table block. Investigate these reports instead of deleting storage based on a
                    missing historical field name.
                </p>
                <p>
                    The model and field hash chooses only new directories. Collection does not
                    reverse, regenerate, or compare that hash. The UUID and the receipt's exact disk
                    and path remain the deletion authority. Do not manually copy asset JSON to
                    another owner. Raw metadata aliases outside the ownership protocol cannot be
                    discovered by checking the original owner alone.
                </p>
            </ProseSection>
            <ProseSection id="schedule" title="Rotate through a large ledger">
                <p>
                    Without blocked table groups, applied active batches select the oldest
                    <code>checked_at</code> values through the
                    <code>state, checked_at, id</code> index. Every examined receipt rotates to a
                    later check time, including unresolved entries. Repeated runs advance through
                    the ledger without restarting at its first UUID or retaining all IDs in memory.
                    <code>--limit</code> accepts 1 to 10000 per phase.
                    <code>--connection</code> selects the configured writer SQL database and its
                    durable journal namespace. Redis import uses its indexed journal records rather
                    than <code>KEYS</code> or a full keyspace scan. No command lists the complete
                    filesystem.
                </p>
                <p>
                    With blocked groups, collection rotates through available table routes using a
                    durable SQL cursor. It reads at most 500 routes per pass and selects each
                    route's oldest receipts through the
                    <code>owner_table, state, checked_at, id</code> index. Blocked receipts are not
                    scanned to find other work. Applied passes advance the cursor even past empty
                    historical routes; previews leave it unchanged. A pass can examine fewer uploads
                    than its limit while progressing through those routes.
                </p>
                <p>
                    Collection and prune reject explicit <code>::read</code> connection selectors,
                    including a reader selector in the default connection. Supply values for any
                    <code>--limit</code>, <code>--after</code>, or <code>--connection</code> option
                    that the command accepts. A bare option now returns exit code 2 instead of
                    silently falling back to another scope. These checks prevent maintenance from
                    using stale replicas or an unintended range.
                </p>
                <p>
                    To run recurring checks, add these commands to the application's existing
                    <code>routes/console.php</code> and ensure its Laravel scheduler is running:
                </p>
                <CodeExample
                    label="Schedule bounded reconciliation and retirement retries"
                    language="php"
                    :code="schedule" />
                <p>
                    <code>runInBackground()</code> lets the scheduler start other due tasks while
                    these command processes continue. It needs no queue worker. Background work
                    still consumes database and storage capacity. <code>withoutOverlapping()</code>
                    uses the application's scheduler cache locks, independently of Filoquent's
                    optional Redis journal database. When multiple servers run the scheduler, add
                    <code>onOneServer()</code> and configure a supported shared cache store on all
                    servers. See Laravel's
                    <DocsLink href="https://laravel.com/docs/13.x/scheduling"
                        >task scheduling guide</DocsLink
                    >
                    for scheduler setup and lock configuration.
                </p>
                <p>
                    Choose a batch and interval that fit the database workload. A million active
                    receipts at 100 checks per minute need 10000 runs for one pass. All receipt
                    observation timestamps are stored and compared in UTC, with microsecond
                    precision. The ledger uses timezone-neutral SQL date-time columns so a MySQL
                    session timezone does not shift the cleanup clock. The 24-hour interval is a
                    minimum grace period, not a guaranteed cleanup deadline. Database latency,
                    storage retries, and unresolved cases can extend it.
                </p>
                <p>
                    Every preview or apply run writes start and completion summaries through the
                    application's default logger, even when console output is suppressed. Check the
                    <DocsLink
                        :href="findNavigationItem(navigation, 'filoquent/health').href + '#logs'"
                        >maintenance logging requirements and failure behavior</DocsLink
                    >
                    before relying on unattended results. Collection reports bounded phases and
                    never declares that all referenced files exist.
                </p>
            </ProseSection>
            <ProseSection id="limits" title="Keep the discovery boundary explicit">
                <p>
                    With Redis disabled, reconciliation discovers only committed SQL receipts. A
                    crash or rolled-back save can leave untracked storage bytes. With Redis enabled,
                    import can recover recorded intents, but Redis loss before SQL promotion can
                    still lose that tracking. A remote write that completes after a forced SQL
                    disconnect and completed cleanup can leave bytes behind. Collection cannot
                    safely infer that a dropped table was not renamed. A detected missing table
                    therefore requires explicit resolution. Confirmed permanent removal starts a
                    fresh 24-hour SQL pending grace period before normal exact-file cleanup.
                    Unobserved table renames followed by old-name reuse remain outside that
                    protection. Do not reuse the old name before collection records the missing
                    table.
                </p>
                <p>
                    See
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/storage').href"
                        >storage lifecycle and recovery</DocsLink
                    >
                    for transaction boundaries, ownership rules, and persistent file paths.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
