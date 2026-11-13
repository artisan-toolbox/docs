<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const renamedModel = `namespace App\\Models;

use ArtisanToolbox\\Filoquent\\Casts\\AsFile;
use ArtisanToolbox\\Filoquent\\Concerns\\HasFiloquent;
use Illuminate\\Database\\Eloquent\\Model;

class Article extends Model
{
    use HasFiloquent;

    protected $table = 'documents';

    protected function casts(): array
    {
        return ['attachment' => AsFile::class];
    }
}`;
const columnMigration = `use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('documents', function (Blueprint $table): void {
            $table->renameColumn('attachment', 'file');
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table): void {
            $table->renameColumn('file', 'attachment');
        });
    }
};`;
const tableMigration = `use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('documents', 'articles');
    }

    public function down(): void
    {
        Schema::rename('articles', 'documents');
    }
};`;
const detect = `php artisan filoquent:gc --apply --limit=100
php artisan filoquent:resolve-pending`;
const interactive = 'php artisan filoquent:resolve-pending --table=documents';
const rename =
    'php artisan filoquent:resolve-pending --table=documents --rename-to=articles --apply';
const reverse = `php artisan filoquent:gc --apply --limit=100
php artisan filoquent:resolve-pending --table=articles --rename-to=documents --apply`;
const removed = 'php artisan filoquent:resolve-pending --table=documents --removed --apply';
const restored =
    'php artisan filoquent:resolve-pending --table=documents --rename-to=documents --apply';
const paginate = `php artisan filoquent:resolve-pending --limit=100 --after=documents
php artisan filoquent:resolve-pending --connection=tenant`;
const postgresRename =
    'php artisan filoquent:resolve-pending --table=public.documents --rename-to=public.articles --apply';
const inspect = `use App\\Models\\Article;
use Illuminate\\Support\\Facades\\Storage;

$article = Article::query()->firstOrFail();
$asset = $article->attachment->default();
dump($asset->filesystem, $asset->path);
dump($asset->exists());
dump(Storage::disk($asset->filesystem)->get($asset->path));`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="prerequisites" title="Prepare a controlled schema change">
                <p>
                    Use this guide in an installed Laravel application after saving the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'filoquent/installation').href +
                            '#first-file'
                        "
                        >first file example</DocsLink
                    >. That example defines <code>App\Models\Document</code>, the
                    <code>documents</code> table, and its <code>attachment</code> file column. Run
                    commands from the application root. The resolution command is included in the
                    Filoquent beta.
                </p>
                <p>
                    Back up the owning database, Filoquent ledger, and matching files. Record a
                    known upload's disk, path, and primary key. Keep the same database connection,
                    primary-key name and values, disk definitions, and stored JSON manifests
                    throughout this procedure.
                </p>
                <ol>
                    <li>
                        Stop new requests and jobs that can change the affected owners. Use the
                        application's normal maintenance procedure.
                    </li>
                    <li>
                        Pause scheduled and manual health, collection, and prune runs and workers
                        that use the affected owners or ledger. Maintenance mode alone does not stop
                        these processes.
                    </li>
                    <li>
                        Wait for all in-flight requests, transactions, uploads, storage work, jobs,
                        and maintenance runs to finish. Keep native SQL and schema writers stopped
                        through detection, resolution, and verification. Run only the controlled
                        commands in this guide while other processes remain paused.
                    </li>
                </ol>
            </ProseSection>
            <ProseSection id="model-class" title="Rename a model class without moving its table">
                <p>
                    Rename the PHP class and update your application imports. Set the physical table
                    explicitly when the new class would make Eloquent infer another name. This
                    renamed model keeps the original <code>documents</code> rows:
                </p>
                <CodeExample
                    label="Keep the existing table after a model class rename"
                    language="php"
                    :code="renamedModel" />
                <p>
                    Reads, health checks, replacement, deletion, and collection follow the saved
                    manifest and physical owner. They do not require the old PHP class to exist.
                    Leave receipt class provenance unchanged. Existing files keep their paths. New
                    uploads use the new class name when choosing a directory.
                </p>
            </ProseSection>
            <ProseSection
                id="file-column"
                title="Rename a file column without rewriting its manifest">
                <p>
                    Keep the table and primary key unchanged. Create an application migration that
                    renames the JSON column and preserves its values. For the original example:
                </p>
                <CodeExample
                    label="Rename and restore the file column"
                    language="php"
                    :code="columnMigration" />
                <p>
                    Change the model cast key from <code>attachment</code> to <code>file</code> and
                    update application reads, assignments, validation, and queries before resuming
                    work. Use <code>$article->file</code> with the renamed class above. Reversing
                    this migration also requires restoring the old cast key and callers.
                </p>
                <p>
                    Filoquent finds the exact saved manifest in the current row, including under a
                    renamed column. Do not rewrite receipt attribute provenance, rebuild paths, or
                    copy JSON to another owner. Renaming preserves the reference. Dropping the
                    column removes the reference and can make the upload eligible for collection.
                </p>
            </ProseSection>
            <ProseSection
                id="table-migration"
                title="Rename the physical table with a Laravel migration">
                <p>
                    Unlike a PHP class or JSON column rename, a physical table rename changes the
                    receipt's owner route. Keep all writers paused. Create and run this reversible
                    application migration to rename the original <code>documents</code> table to
                    <code>articles</code>, leaving <code>attachment</code> unchanged:
                </p>
                <CodeExample
                    label="Rename and restore the owner table"
                    language="php"
                    :code="tableMigration" />
                <p>
                    Run <code>php artisan migrate</code> and update the model's table to
                    <code>articles</code>. A renamed <code>Article</code> class can infer that name
                    or declare it explicitly. Keep the old name absent while you record the pending
                    group and resolve it in the following steps.
                </p>
                <DocsCallout variant="danger">
                    <template #title>Detect the missing table before reusing its old name</template>
                    <p>
                        Filoquent can block a missing table only after applied collection observes
                        its absence. If you rename a table and reuse the old name before detection,
                        unrelated rows can look like deleted original owners. Collection cannot
                        distinguish that sequence from an intentional row deletion and may
                        eventually delete the original files. Never reuse the old name before the
                        pending group has been recorded.
                    </p>
                </DocsCallout>
            </ProseSection>
            <ProseSection id="detect" title="Record and inspect the missing-table group">
                <p>
                    While <code>documents</code> is absent, run controlled applied collection and
                    then list pending groups:
                </p>
                <CodeExample
                    label="Detect the absent table and list pending groups"
                    :code="detect" />
                <p>
                    A bounded collection pass must reach a receipt for that table before detection.
                    Repeat controlled applied passes until the list includes
                    <code>documents</code>. Preview collection and the read-only health command do
                    not create pending groups. The listing command is read-only by default.
                </p>
                <p>
                    Detection creates one durable SQL group for the missing table. Its
                    <code>affected_uploads</code> count records all active receipts on that route at
                    detection through the owner-table index. Collection skips the blocked range
                    without walking or logging every receipt. The block persists even if a table
                    later reappears under the old name. Managed saves and deletes on that route fail
                    until an operator resolves it. Other owner routes can continue working.
                </p>
                <p>
                    Applied collection limits each unresolved table's error report to once per UTC
                    day. A persistent SQL claim shares that limit across processes without depending
                    on Redis or cache availability. Start and completion maintenance logs remain
                    separate records for each command invocation. Keep monitoring unresolved groups
                    even when the current day's error has already been reported.
                </p>
                <CodeExample
                    label="Page through groups or select another writer database"
                    :code="paginate" />
                <p>
                    <code>--limit</code> accepts 1 to 1000 groups, with a default of 100.
                    <code>--after</code> continues after the previous page's table name. Use the
                    reported cursor instead of the example <code>documents</code> value. Pass the
                    same configured writer <code>--connection</code> to collection, listing, and
                    resolution when the owner and ledger use a nondefault database.
                </p>
            </ProseSection>
            <ProseSection id="select-resolution" title="Choose an explicit resolution">
                <p>Inspect one listed group in a supported interactive ANSI terminal:</p>
                <CodeExample
                    label="Inspect and choose a pending-table resolution"
                    :code="interactive" />
                <p>
                    The command shows the physical table route, issue UUID, affected-upload count at
                    detection, and UTC detection time. Select a verified destination or permanent
                    removal, then confirm the displayed issue and count. Cancel and the default
                    negative confirmation leave the group unchanged.
                </p>
                <p>
                    On Windows, redirected output, quiet output, <code>--no-ansi</code>, and
                    <code>--no-interaction</code>, use the explicit action flags below. Without
                    <code>--apply</code>, those flags preview the selected action. Never combine
                    <code>--rename-to</code> and <code>--removed</code>. Run resolution outside an
                    application database transaction.
                </p>
                <p>
                    Use the route name exactly as listed. Laravel applies a configured table prefix,
                    so do not add it yourself. Source and destination must use the same configured
                    writer connection. PostgreSQL routes always include their physical schema,
                    including <code>public</code>. Use the qualified command below for PostgreSQL.
                    Other engines follow the writer's physical identifier rules. Unavailable schemas
                    fail before a managed write or receipt migration. Filoquent and Laravel
                    migration tables are not valid destinations.
                </p>
            </ProseSection>
            <ProseSection id="postgresql" title="Keep PostgreSQL schema ownership explicit">
                <p>
                    PostgreSQL receipts retain the physical schema and table resolved when the
                    upload is saved. A later <code>search_path</code> change cannot redirect that
                    receipt to another tenant's table. For the example in the
                    <code>public</code> schema, use the exact qualified routes from the pending
                    list:
                </p>
                <CodeExample label="Resolve a PostgreSQL table rename" :code="postgresRename" />
                <p>
                    When upgrading older preview receipts without a schema qualifier, the
                    ownership-gate migration preserves their original journal route and blocks
                    active groups. Their original schema cannot be inferred safely. These groups
                    require an explicit, qualified <code>--rename-to</code> destination that
                    contains every original manifest. <code>--removed</code> is refused until this
                    ownership verification succeeds. A group containing receipts from multiple
                    schemas stays blocked when no single destination can prove ownership. Keep its
                    files and reconcile the original records before retrying.
                </p>
            </ProseSection>
            <ProseSection id="rename-resolution" title="Resolve a verified table rename">
                <p>
                    Inspect the destination table, its primary key, and known rows on the writer
                    database. Confirm that <code>articles</code> is the renamed original table. Keep
                    native SQL and DDL paused. Then authorize the mapping explicitly:
                </p>
                <CodeExample label="Map the pending documents route to articles" :code="rename" />
                <p>
                    The command does not perform DDL or move files. In one SQL transaction it
                    verifies the physical destination table, the same primary-key identity, and
                    every affected receipt's exact manifest at that key in any current column. Only
                    after all checks pass does it retarget the whole active group and clear the
                    block. An incomplete or unrelated destination fails validation without a partial
                    remap. Model-class and attribute provenance, UUIDs, disks, and paths remain
                    unchanged.
                </p>
                <p>
                    Validation reads receipts in pages of 500 to bound application memory. A
                    million-receipt group still requires proportional database work, transaction
                    locks, and undo or transaction-log capacity. Plan the maintenance window and
                    database resources accordingly. Pagination is not a constant-time guarantee.
                </p>
                <p>
                    Existing Redis intents retain their original journal owner identity after a
                    remap, even when Redis is disabled during resolution. No journal drain is
                    required for this mapping. Keep normal journal configuration and durability
                    requirements from the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'filoquent/configuration').href +
                            '#redis-journal'
                        "
                        >Redis configuration reference</DocsLink
                    >.
                </p>
                <p>
                    To reverse the example, first pause and wait for work again. Roll back the
                    native migration so <code>articles</code> becomes absent and
                    <code>documents</code> contains the original rows. Then detect and resolve the
                    reverse route before resuming:
                </p>
                <CodeExample
                    label="Resolve the reverse table rename after migration rollback"
                    :code="reverse" />
            </ProseSection>
            <ProseSection id="removal" title="Confirm a permanently removed owner table">
                <p>
                    Use this action only when the owner table is intentionally gone and its files no
                    longer have live owners. Confirm the affected table and upload group from
                    backups and application records. The source table must still be absent. A view,
                    PostgreSQL materialized view, or another relation with that name also prevents
                    removal. An unavailable schema prevents removal as well:
                </p>
                <CodeExample
                    label="Authorize delayed cleanup for a confirmed removal"
                    :code="removed" />
                <p>
                    The command moves only that group's active receipts to SQL pending cleanup. A
                    new 24-hour grace period starts at this confirmation. It does not delete files
                    immediately. Subsequent applied collection and prune passes use the normal
                    exact-manifest cleanup protocol. Other routes and their files are unaffected. Do
                    not confirm removal to suppress an unresolved rename warning.
                </p>
            </ProseSection>
            <ProseSection id="restoration" title="Resolve a restored table or failed operation">
                <p>
                    If you restore the original table under the same name, its reappearance does not
                    clear the block. Verify the restored rows and manifests, then use the same name
                    as the explicit destination:
                </p>
                <CodeExample
                    label="Validate a restored documents table and release its block"
                    :code="restored" />
                <p>
                    This runs the full destination validation. An unrelated table that reuses
                    <code>documents</code> cannot release the block merely by existing. If a rename
                    validation or resolution fails, keep all writers paused, inspect the actual
                    schema and receipt routes on the writer database, and correct the cause before
                    retrying. Do not manually retarget or delete receipts to bypass a refusal.
                </p>
                <p>
                    Keep the ownership-gate migration installed while unresolved groups or retained
                    journal route aliases remain. Its rollback refuses those states. Reverting
                    application DDL and resolving a reverse rename is separate from rolling back the
                    package's ledger migrations.
                </p>
            </ProseSection>
            <ProseSection id="verify" title="Verify the original files before resuming work">
                <p>
                    List pending groups again and confirm that the intended group is resolved. Read
                    the known row through the updated model in Tinker. For the original first-file
                    example after the table rename to <code>articles</code>:
                </p>
                <CodeExample
                    label="Read the original upload through Article"
                    language="php"
                    :code="inspect" />
                <p>
                    Compare the disk and path with your recorded values. They remain identical. The
                    other dumps remain <code>true</code> and <code>Hello Filoquent</code>. If you
                    also renamed the file column, use <code>$article->file</code> instead of
                    <code>$article->attachment</code>.
                </p>
                <p>
                    Run a controlled <code>php artisan filoquent:health</code> audit on the same
                    writer connection. With only that original example upload, expect one examined
                    upload, one present file, no missing or inconclusive result, and exit code
                    <code>0</code>. Check affected application reads and writes before resuming
                    workers, schedules, and requests. Health does not establish that every caller
                    uses the new names.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
