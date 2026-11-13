<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const prune = `php artisan filoquent:prune --limit=100
php artisan filoquent:prune --apply --limit=100`;
const states = [
    ['UploadState', 'Writing, Active, Pending, Retired', 'writing, active, pending, retired'],
    ['OwnerTableState', 'Ready, Pending', 'ready, pending'],
    ['OwnerTableResolution', 'Renamed, Removed', 'renamed, removed'],
];
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="ownership" title="Ownership and immutable paths">
                <p>
                    Filoquent coordinates two systems with different failure boundaries. A database
                    transaction can roll back row changes. Laravel filesystem writes cannot join
                    that transaction. Every upload therefore gets a new UUIDv7 directory. Existing
                    bytes are never overwritten during replacement.
                </p>
                <p>
                    The <code>filoquent_uploads</code> table records the creating model class,
                    physical table, primary key, attribute, exact manifest, and receipt state.
                    Active receipts belong to saved model files. Retired receipts await exact-path
                    deletion. The optional journal also uses transaction-private writing receipts
                    and durable pending receipts. A model update and its ownership change use the
                    model's database connection and the same transaction. Install this table on
                    every participating connection before saving files.
                </p>
                <p>
                    Retirement requires an exact match with an active ownership record for the
                    physical table, raw stored primary key, and stored manifest. The current class
                    name and its SHA1 are not part of this authorization. Primary-key accessors and
                    casts do not change that physical identity. Unknown metadata does not authorize
                    deletion. Cleanup removes individual recorded objects and never deletes an
                    entire directory. Replicating a model excludes managed attributes so the new row
                    cannot silently share deletable files.
                </p>
            </ProseSection>
            <ProseSection id="sql-states" title="Typed SQL states">
                <p>
                    The published <code>1.0.0-beta.2</code> release represents SQL receipt states,
                    owner-table states, and table resolutions with string-backed enums under
                    <code>ArtisanToolbox\Filoquent\Enums</code>.
                </p>
                <DocsTable
                    caption="SQL enums and their persisted values"
                    :columns="['Enum', 'Cases', 'Stored values in the same order']"
                    :rows="states" />
                <p>
                    The stored strings, transitions, maintenance commands, and cleanup guarantees
                    remain unchanged. This conversion requires no schema migration or stored-data
                    rewrite. Continue to use the package commands for maintenance rather than
                    assigning SQL states directly. Existing installation migrations remain required.
                </p>
            </ProseSection>
            <ProseSection id="transactions" title="Transactions and failures">
                <p>
                    The <code>HasFiloquent</code> trait coordinates normal and quiet instance saves
                    and deletes. Assign file inputs before calling save. Managed assignments from
                    save or delete observers and recursive operations on the same model are
                    rejected. Use normal <code>save()</code> rather than <code>saveOrIgnore()</code>
                    for pending uploads. Upload preparation happens after cancellation-capable model
                    events. A stale replacement fails rather than publishing against an outdated
                    file value. A missing projected file column requires a full reload before
                    replacement.
                </p>
                <p>
                    With an outer application transaction, retiring files does not remove them
                    before the outer commit. Run the retirement drain after commit to process
                    deferred cleanup. Soft-deleted rows keep their active ownership and files. A
                    cleanup adapter failure leaves a retryable retired record. A missing local
                    filesystem root also preserves that receipt, including local disks behind scoped
                    or read-through disks. Restore the volume before retrying. An unmounted disk is
                    not proof that its files were deleted.
                </p>
                <p>
                    Asset reads and URL resolution also preserve unavailable local roots. These
                    operations fail without creating an empty replacement directory. Restore the
                    volume before retrying rather than treating that failure as a missing file.
                </p>
                <p>
                    Invalid sources, invalid middleware output, and failed storage writes raise
                    <code>ArtisanToolbox\Filoquent\Exceptions\FiloquentException</code>. Database
                    and application observer exceptions retain their original type. A cancelled
                    Eloquent save returns <code>false</code>. Laravel fires
                    <code>forceDeleted</code> after its virtual delete method has returned. An
                    exception in that notification does not undo an already committed standalone
                    deletion. Wrap the complete <code>forceDelete()</code> call in an application
                    database transaction when that observer must participate in rollback. After an
                    outer transaction rollback, discard or refresh the affected model and reassign a
                    readable source before retrying. If an after-commit callback throws after the
                    database has committed, the exception does not undo the saved row or the model's
                    committed state. Inspect the database before retrying that operation.
                </p>
                <p>
                    Use Laravel's application-managed database connections. Replacing or detaching
                    their transaction manager is rejected before publication. Failed root commits
                    release the transaction for a retry without rolling back a new transaction
                    opened by a post-commit callback.
                </p>
                <p>
                    With the Redis journal disabled, a process crash or rollback after new bytes
                    were written can leave files without any committed receipt. The retirement drain
                    cannot discover those objects. The optional journal extends discovery to
                    recorded upload intents, subject to the boundaries below. Zero orphan retention
                    is not a guarantee of Filoquent beta.
                </p>
            </ProseSection>
            <ProseSection id="journal" title="Upload intents outside SQL rollback">
                <p>
                    Assignment still copies input only to a local snapshot. During save, middleware
                    prepares every variant and Filoquent validates the complete manifest before
                    remote work. With the journal enabled, Filoquent reserves the UUID as a private
                    SQL writing receipt, records the full intent in Redis, and then writes files.
                    Redis registration failure raises <code>FiloquentException</code> before the
                    first storage write.
                </p>
                <p>
                    The model's successful save changes that writing receipt to active in the same
                    SQL transaction, using the model's actual saved primary key. Filoquent
                    acknowledges the Redis intent only after the outermost SQL commit. A failed
                    acknowledgment does not fail the committed save. A later applied collection
                    recognizes the active receipt and retries acknowledgment without downgrading it
                    to pending.
                </p>
                <p>
                    A rollback removes the private SQL reservation but leaves the Redis intent.
                    Applied collection imports that UUID and exact manifest as a pending SQL receipt
                    before acknowledging Redis. The 24-hour cleanup grace period starts at this
                    first SQL promotion, not at the upload's creation time. Repeated imports
                    preserve that clock. A durable pending receipt remains eligible for cleanup when
                    the journal is disabled or unavailable.
                </p>
                <p>
                    The SQL reservation and pending claim serialize publication and cleanup for a
                    UUID. An overdue pending receipt changes to retired in a committed SQL
                    transaction before the exact manifest drain removes any files. The package
                    retains no SQL tombstones after successful deletion. It does not list storage to
                    infer ownership.
                </p>
                <p>
                    The one-row <code>filoquent_upload_namespace</code> table gives each ledger a
                    durable random identity. Redis indexing uses that identity rather than a
                    connection alias. Changing an alias does not transfer another database's
                    intents. A cloned database must receive an independent namespace before both
                    copies use the same Redis journal. Coordinate database restores and journal
                    configuration deliberately.
                </p>
                <p>
                    Registration writes each record and its index in one Redis script. Storage
                    writes require successful registration, and records have no TTL. Redis loss or
                    eviction before SQL promotion can still leave untracked objects. Logical
                    database isolation does not isolate server resources or failures. A remote
                    storage write that finishes after a forced SQL disconnect and completed cleanup
                    can also leave bytes behind. These cases require application recovery. The
                    journal does not make filesystem writes part of a SQL transaction.
                </p>
                <p>
                    See
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'filoquent/configuration').href +
                            '#redis-journal'
                        "
                        >journal configuration</DocsLink
                    >
                    and
                    <DocsLink
                        :href="findNavigationItem(navigation, 'filoquent/garbage-collection').href"
                        >bounded garbage collection</DocsLink
                    >
                    for activation and maintenance.
                </p>
            </ProseSection>
            <ProseSection id="health" title="Audit referenced files without cleanup">
                <p>
                    Use <code>php artisan filoquent:health</code> from the application root to check
                    files in current active manifests, including soft-deleted owners. It changes no
                    receipt state, observation timestamp, owner, or storage object. Collection
                    checks ownership for cleanup. Health checks file existence for recovery. Follow
                    the
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/health').href"
                        >file health guide</DocsLink
                    >
                    for coverage, result handling, and background scheduling.
                </p>
            </ProseSection>
            <ProseSection id="prune" title="Drain known retirements">
                <p>From the Laravel application root, preview a bounded batch, then apply it:</p>
                <CodeExample label="Preview and apply retirement cleanup" :code="prune" />
                <p>
                    The default invocation leaves receipts and storage unchanged.
                    <code>--apply</code> attempts only committed retired uploads.
                    <code>--limit</code> bounds the batch. <code>--connection</code> selects another
                    configured database. Already absent files on an available disk are successful
                    cleanup. An interrupted or failed attempt can be retried. Active uploads and
                    soft-deleted owners are not retirement candidates. Use the
                    <code>--after</code> UUID cursor to continue past a failed record in a batch,
                    then retry failed records without that cursor.
                </p>
                <p>
                    Use the
                    <DocsLink
                        :href="findNavigationItem(navigation, 'filoquent/garbage-collection').href"
                        >orphan collection guide</DocsLink
                    >
                    to reconcile direct database changes. Schedule the prune apply command through
                    your application's Laravel scheduler if deferred retirements need regular
                    processing. This is an exact retirement drain, not a scan for unreferenced
                    files. Do not delete unknown objects based only on their age or directory name.
                </p>
                <p>
                    Prune writes start and completion summaries independently of console verbosity.
                    Its report describes the bounded retirement pass. Follow the
                    <DocsLink
                        :href="findNavigationItem(navigation, 'filoquent/health').href + '#logs'"
                        >maintenance logging requirements</DocsLink
                    >
                    for the default application channel and reporting failures, and the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'filoquent/garbage-collection').href +
                            '#schedule'
                        "
                        >background cleanup schedule</DocsLink
                    >
                    for recurring retries.
                </p>
            </ProseSection>
            <ProseSection id="move-subpath" title="Keep stored paths after model changes">
                <p>
                    Filoquent chooses paths when it creates an upload. Reads, integrity checks,
                    replacement, and deletion keep working after a model or field rename when the
                    physical table and primary key remain the same. These operations use the saved
                    manifest and ownership receipt without recalculating the original directory.
                </p>
                <p>
                    For example, renaming <code>App\Models\OldDocument</code> to
                    <code>App\Models\Document</code> leaves existing files at their recorded paths.
                    New uploads use the current model and attribute hash, base path, and configured
                    disk. Replacing an old upload creates a new generation and retires the exact
                    previous files through their receipt.
                </p>
                <p>
                    No path migration is required after a model, field, base path, or default disk
                    change. Keep old disk definitions available while existing files reference them.
                    A physical table rename changes the receipt's owner route. Follow the
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/rename-owners').href"
                        >owner renaming and pending-resolution guide</DocsLink
                    >
                    for native Laravel migrations, class and column changes, and explicit ownership
                    resolution. Do not reuse an old table name before applied collection records its
                    absence. Primary-key changes and disk root or endpoint moves need separate
                    application planning.
                </p>
            </ProseSection>
            <ProseSection
                id="missing-tables"
                title="Persistent protection for missing owner tables">
                <p>
                    When applied collection observes a missing physical owner table, it records one
                    pending SQL group for that table route and preserves the affected files. Managed
                    saves and deletes on the blocked route fail, even if a table later reuses its
                    name. Unrelated routes can continue. An operator must verify a renamed or
                    restored destination, or confirm permanent owner removal through
                    <code>filoquent:resolve-pending</code>.
                </p>
                <p>
                    The group stores the affected active-upload count at detection through the
                    owner-table index. Later collection passes skip the blocked range instead of
                    visiting every receipt. One error per unresolved table per UTC day uses a
                    persistent SQL reporting claim shared across processes. This protection needs
                    neither Redis nor the application's cache. Normal start and completion logs
                    remain per command invocation.
                </p>
                <p>
                    Detection must happen while the old table is absent. A rename followed by
                    immediate reuse of the old name before detection is indistinguishable from
                    deliberate row deletion. Pause writers and maintenance for the controlled
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/rename-owners').href"
                        >schema change and resolution procedure</DocsLink
                    >.
                </p>
            </ProseSection>
            <ProseSection id="scale" title="Access paths at large row counts">
                <p>
                    Reading a cast decodes only its loaded JSON. It does not query the ledger,
                    hydrate related models, or list a storage prefix. Replacing or deleting a file
                    uses primary-key owner lookup and indexed ownership records. Work grows with the
                    affected field's variants, not the total number of models.
                </p>
                <p>
                    The ledger indexes ownership and cleanup traversal. The retirement drain uses
                    bounded keyset batches. No command loads the entire candidate set into memory or
                    calls <code>allFiles()</code>. Storage latency, variant generation, row lock
                    contention, and database infrastructure still determine throughput. Access-path
                    checks do not establish a production throughput guarantee for S3 or a particular
                    database with one million rows.
                </p>
            </ProseSection>
            <ProseSection id="boundaries" title="Writes that bypass ownership">
                <p>
                    Use instance <code>save()</code>, <code>delete()</code>, and supported quiet
                    equivalents. Bulk updates, bulk deletes, upserts, raw SQL, foreign-key cascades,
                    and manual JSON imports bypass Eloquent's instance lifecycle. They cannot upload
                    or retire files through this protocol. Do not copy asset metadata between rows
                    or reattach retired paths. Assign the source bytes to create independent
                    ownership instead.
                </p>
                <p>
                    Restoring an old database backup without the matching filesystem and ownership
                    ledger can restore references to deleted files. Coordinate backups and disk
                    configuration outside this package. Scope each application or tenant's storage
                    root and database deliberately.
                </p>
                <p>
                    See the
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/configuration').href"
                        >configuration reference</DocsLink
                    >
                    for storage identities and the
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/files').href"
                        >file guide</DocsLink
                    >
                    for application validation and middleware ownership.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
