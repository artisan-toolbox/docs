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
const health = 'php artisan filoquent:health';
const bounded = `php artisan filoquent:health --limit=1000
php artisan filoquent:health --limit=1000 --after=019aa951-0000-7000-8000-000000000001`;
const counts = [
    ['uploads_examined', 'Receipts fully examined in this run.'],
    ['files_checked', 'File checks accepted after ownership validation.'],
    ['files_present', 'Recorded files that exist.'],
    ['files_missing', 'Recorded files confirmed absent while ownership remains current.'],
    ['files_inconclusive', 'Recorded files whose storage check could not be completed.'],
    ['uploads_skipped', 'Receipts whose owner or current attachment is gone or changed.'],
    ['uploads_inconclusive', 'Receipts whose metadata or owner cannot be verified.'],
];
const schedule = `use Illuminate\\Support\\Facades\\Schedule;

Schedule::command('filoquent:health')
    ->dailyAt('02:00')
    ->withoutOverlapping()
    ->runInBackground();`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="prerequisites" title="Prepare access to owners and disks">
                <p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/installation').href"
                        >Install Filoquent</DocsLink
                    >
                    and save the first file example. Keep the upload ledger beside its owning
                    tables. The maintenance connection must read every owner, including soft-deleted
                    rows and all tenants, through the writer database connection.
                </p>
                <p>
                    Keep each disk referenced by existing manifests configured and grant the command
                    permission to check its recorded paths. Health needs no queue worker or Redis
                    journal. The command is part of the unpublished development preview.
                </p>
            </ProseSection>
            <ProseSection id="run" title="Audit the active ledger">
                <p>From the Laravel application root, run:</p>
                <CodeExample label="Check referenced files" :code="health" />
                <p>
                    In an application containing only the first file example's upload, expect one
                    examined upload, one present file, no missing or inconclusive results, and exit
                    code <code>0</code>. Supported interactive ANSI terminals show progress for each
                    batch and a final summary. Piped output, <code>--no-ansi</code>, and
                    <code>--no-interaction</code> use plain text without asking questions.
                </p>
                <p>
                    The command checks files belonging to current active ownership receipts. It
                    includes soft-deleted owners and follows manifests after model or field renames
                    without recalculating their paths. It does not change models, managed assets,
                    receipt states, <code>checked_at</code>, or orphan grace timestamps.
                </p>
                <p>
                    Each recorded variant must be a file. A directory at the same path does not
                    satisfy the check. Before reporting a missing file or a storage error, the
                    command checks the current receipt and owner again. A concurrently replaced or
                    deleted upload is skipped rather than reported as missing.
                </p>
                <p>
                    An unresolved built-in local disk with a missing root is inconclusive. The audit
                    does not initialize that directory. Custom filesystem factories can run their
                    own initialization and need review before use in an audit.
                </p>
            </ProseSection>
            <ProseSection id="coverage" title="Bound a run and continue with its cursor">
                <p>
                    Without <code>--limit</code>, health traverses the complete active UUID range
                    captured at startup in internal pages of 500 receipts. It never counts the whole
                    ledger or keeps every result in memory. Uploads added above that initial upper
                    bound wait for another run. Concurrent changes mean this is a sequence of
                    observations, not an atomic database or storage snapshot.
                </p>
                <p>
                    To restrict work, pass <code>--limit</code> from 1 to 10000. The limit counts
                    upload receipts, including all their variants. To select another configured
                    writer database, pass <code>--connection</code> with its connection name. Run
                    outside an application database transaction.
                </p>
                <p>
                    Supply a value whenever you pass <code>--limit</code>, <code>--after</code>, or
                    <code>--connection</code>. Bare options are invalid. Cursors use lowercase
                    canonical UUIDv7 values without URN prefixes. Explicit <code>::read</code>
                    connection selectors are rejected, including in the default connection, because
                    a stale replica cannot establish current ownership.
                </p>
                <CodeExample
                    label="Limit a run and resume after an example cursor"
                    :code="bounded" />
                <p>
                    Replace the second command's example UUIDv7 with the previous run's reported
                    <code>cursor</code>. That cursor identifies the last fully examined receipt.
                    Each invocation captures a new upper bound. A resumed run covers a suffix. It
                    cannot establish that earlier receipts are healthy. Repeated limited runs
                    without <code>--after</code> start at the beginning because health never rotates
                    cleanup timestamps.
                </p>
                <p>
                    The report's <code>completed</code> flag means the requested work reached its
                    normal endpoint, including a limited run or a run that found missing files.
                    <code>range_exhausted</code> means traversal reached the initial upper bound.
                    <code>partial</code> remains true for an <code>--after</code> scope, a limit
                    that leaves receipts, or an interruption. Exit code <code>0</code> on a partial
                    run describes only that run's scope.
                </p>
            </ProseSection>
            <ProseSection id="results" title="Handle missing and inconclusive results">
                <DocsTable
                    caption="Health result counters"
                    :columns="['Counter', 'Meaning']"
                    :rows="counts" />
                <p>
                    Exit code <code>1</code> means missing files, inconclusive results, or a command
                    or reporting failure. Exit code <code>2</code> means invalid options, such as an
                    out-of-range limit or an invalid UUIDv7 cursor. Skipped receipts are not
                    missing-file findings. Malformed manifests, missing owner tables or primary
                    keys, ambiguous owner metadata, and pending table routes require investigation
                    rather than cleanup. A pending route remains inconclusive even after a table
                    reappears under its old name, until an operator resolves that group.
                </p>
                <p>
                    When PHP provides <code>pcntl</code> signal handling, <code>SIGINT</code> or
                    <code>SIGTERM</code> stops the audit after its current receipt. The command
                    exits unsuccessfully and preserves the last completed cursor in its report. A
                    hard process kill cannot guarantee a completion report. Use another complete
                    audit when you need fresh coverage of the whole ledger.
                </p>
            </ProseSection>
            <ProseSection id="logs" title="Keep maintenance results observable">
                <p>
                    Health, <code>filoquent:gc</code>, <code>filoquent:prune</code>, and
                    <code>filoquent:resolve-pending</code> write
                    <code>Filoquent maintenance started.</code> and
                    <code>Filoquent maintenance completed.</code> through the application's default
                    log channel, independently of console verbosity. Configure a writable channel
                    that accepts <code>info</code> records. Application filters and discard handlers
                    can prevent persistence without the command detecting it.
                </p>
                <p>
                    Pass <code>--silent</code> to suppress Artisan messages and presentation,
                    including errors. Logs retain their configured destination. A channel that
                    writes to <code>stderr</code> can still appear in the terminal. Use a file or
                    external log channel when the terminal must remain silent. Use
                    <code>--no-interaction</code> when you want plain terminal output instead.
                </p>
                <p>
                    The completion context includes a <code>run_id</code>, command, mode, requested
                    and effective connection, counts, duration in milliseconds, exit code, coverage
                    flags, and relevant bounds and cursors. Health retains only a bounded sample of
                    issues. Clean runs use <code>info</code>, confirmed missing files use
                    <code>warning</code>, and inconclusive results or failures use
                    <code>error</code>. Collection and prune report bounded maintenance passes, not
                    a full file audit. Collection runs whose only outstanding condition is a pending
                    table group retain informational completion logs while returning failure. Their
                    separate unresolved-table error is claimed at most once per table per UTC day
                    through SQL. Other inconclusive results and failures still use error completion
                    logs.
                </p>
                <p>
                    Preview collection and prune still write audit logs while leaving SQL receipts
                    and managed assets unchanged. If the start log fails, no maintenance work starts
                    and the command fails. If completion logging fails after successful work, the
                    command fails without undoing completed work. An existing operation failure
                    keeps its original outcome even when logging also fails.
                </p>
            </ProseSection>
            <ProseSection id="schedule" title="Schedule a background audit">
                <p>
                    Add the daily audit to the application's existing
                    <code>routes/console.php</code>. Ensure its Laravel scheduler is running:
                </p>
                <CodeExample
                    label="Schedule a complete daily audit"
                    language="php"
                    :code="schedule" />
                <p>
                    <code>runInBackground()</code> starts a separate command process so other due
                    tasks can start. It does not remove the cost of remote storage requests.
                    <code>withoutOverlapping()</code> uses the application's scheduler cache locks,
                    independently of the optional Filoquent journal. For multiple scheduler servers,
                    add <code>onOneServer()</code> with a supported shared cache store on every
                    server. See Laravel's
                    <DocsLink href="https://laravel.com/docs/13.x/scheduling"
                        >task scheduling guide</DocsLink
                    >
                    for scheduler and cache setup.
                </p>
                <p>
                    Schedule
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'filoquent/garbage-collection').href +
                            '#schedule'
                        "
                        >bounded collection and retirement retries</DocsLink
                    >
                    separately when you need cleanup. Health reports missing referenced files and
                    never deletes or repairs them.
                </p>
            </ProseSection>
            <ProseSection id="boundaries" title="Keep the audit scope explicit">
                <p>
                    Health follows committed active receipts and current owner manifests. It does
                    not list storage, discover arbitrary imported JSON without receipts, check
                    pending or retired uploads, or verify file contents. A successful existence
                    check cannot prove that the bytes match a backup or remain available after the
                    check.
                </p>
                <p>
                    Restore missing bytes from a matching backup or replace the affected attribute
                    through the public file API. For transaction and recovery limits, read
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/storage').href"
                        >storage lifecycle and recovery</DocsLink
                    >. Before a physical table change, follow the
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/rename-owners').href"
                        >owner renaming and resolution guide</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
