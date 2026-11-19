<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const compilation = `php artisan permit:catalog:cache
php artisan permit:catalog:clear`;

const inspection = `php artisan make:permission-group BillingInvoices
php artisan permit:inspect
php artisan permit:inspect 42
php artisan permit:inspect --defaults
php artisan permit:inspect --no-interaction`;

const makeMigration = `php artisan make:migration rename_permit_assignments`;

const runMigration = `php artisan migrate:status
php artisan migrate --pretend
php artisan migrate
php artisan permit:catalog:cache`;

const rename = String.raw`<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->rename(
            static fn (Blueprint $table) => $table->renamePermissionGroup('reports', 'analytics'),
            static fn (Blueprint $table) => $table->renamePermission('analytics', 'export', 'download'),
            static fn (Blueprint $table) => $table->renameRole('admin', 'administrator'),
        );
    }

    public function down(): void
    {
        $this->rename(
            static fn (Blueprint $table) => $table->renameRole('administrator', 'admin'),
            static fn (Blueprint $table) => $table->renamePermission('analytics', 'download', 'export'),
            static fn (Blueprint $table) => $table->renamePermissionGroup('analytics', 'reports'),
        );
    }

    private function rename(Closure ...$steps): void
    {
        $connection = $this->getConnection();
        $schema = Schema::connection($connection);
        $table = config()->string('permit.table');

        DB::connection($connection)->transaction(static function () use ($steps, $schema, $table): void {
            foreach ($steps as $step) {
                $schema->table($table, $step);
            }
        });
    }
};`;

const commands = [
    [
        'make:permission-group <name>',
        'Generate an interface under app/Permit with #[Group] and all four CRUD abilities.',
    ],
    [
        'permit:inspect [user] [--defaults]',
        'Print the user’s assignments and their defaults, or print catalog defaults alone.',
    ],
    ['permit:catalog:cache', 'Validate declarations and write the compiled catalog.'],
    [
        'permit:catalog:clear',
        'Remove the compiled catalog so a fresh process discovers declarations.',
    ],
];

const renameMacros = [
    [
        "renamePermissionGroup('reports', 'analytics')",
        'Move every stored reports:: key to analytics::.',
    ],
    [
        "renamePermission('analytics', 'export', 'download')",
        'Move analytics::export to analytics::download.',
    ],
    ["renameRole('admin', 'administrator')", 'Move role::admin to role::administrator.'],
];

const cacheOptions = [
    [
        'permit.cache.enabled',
        'true',
        'Use the optional shared assignment cache. Request memoization remains active.',
    ],
    [
        'permit.cache.store',
        'null',
        'Automatically use the default Laravel store for Redis or Memcached. Set a Laravel cache store name to select one explicitly.',
    ],
    [
        'permit.cache.ttl',
        '300',
        'Set the number of seconds each shared assignment entry stays cached.',
    ],
];
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="artisan-commands" title="Permit Artisan commands">
                <p>Run these commands from the Laravel application root after installing Permit.</p>
                <DocsTable
                    caption="Permit commands"
                    :columns="['Command', 'Result']"
                    :rows="commands">
                    <template #cell="{ value, columnIndex }">
                        <code v-if="columnIndex === 0">{{ value }}</code>
                        <span v-else>{{ value }}</span>
                    </template>
                </DocsTable>
                <CodeExample label="Generate a group and inspect assignments" :code="inspection" />
                <p>
                    <code>BillingInvoices</code> writes
                    <code>app/Permit/BillingInvoices.php</code> with group ID
                    <code>billing_invoices</code>. The generator refuses an existing interface or
                    reserved group ID. Rebuild a compiled catalog before expecting
                    <code>billing_invoices::read</code> to appear.
                </p>
                <p>
                    Replace <code>42</code> with an existing user ID from the configured provider.
                    Pass the ID as an integer or a string when calling the command through
                    <code>Artisan::call()</code>. With no ID, the interactive picker searches by ID
                    or name when the user table has a <code>name</code> column. Choose
                    <strong>Catalog defaults</strong> to skip the user. A noninteractive invocation
                    with no ID also shows defaults. An unknown user or a user ID combined with
                    <code>--defaults</code> returns a nonzero exit code.
                </p>
                <p>
                    The two-column output labels explicit grants <strong>Allowed</strong> in green
                    and explicit denials <strong>Denied</strong> in red.
                    <strong>Default · Allowed</strong> and <strong>Default · Denied</strong> appear
                    in amber because the user has no stored value for that key. Add
                    <code>--no-ansi</code> to keep the labels and omit color codes.
                </p>
            </ProseSection>
            <ProseSection id="compile-the-catalog" title="Compile the declaration catalog">
                <p>
                    Run Artisan from the deployed application root before serving traffic. Cache the
                    catalog to load its validated declarations from
                    <code>bootstrap/cache/permit.php</code> at boot. Generate a fresh file after
                    changing declarations. A failed validation exits with an error and preserves the
                    previous artifact.
                </p>
                <CodeExample label="Build or remove the Permit catalog cache" :code="compilation" />
                <p>
                    Use <code>php artisan optimize</code> or <code>php artisan optimize:clear</code>
                    to invoke the corresponding command during Laravel optimization.
                    <code>--except=permit</code> skips the Permit task. After rebuilding or clearing
                    the catalog, restart long-lived workers so they load the intended declarations.
                </p>
                <p>
                    To clear only the Permit catalog, run <code>permit:catalog:clear</code>.
                    Laravel's <code>optimize:clear</code> also clears the application's default
                    cache store.
                </p>
            </ProseSection>
            <ProseSection id="assignment-cache" title="Configure the assignment cache">
                <p>
                    Permit memoizes assignment maps for each request or job. A shared cache entry
                    remains usable only while its revision matches the database primary. If the
                    cache is unavailable, Permit reads the primary database.
                </p>
                <DocsTable
                    caption="Shared assignment cache options"
                    :columns="['Configuration key', 'Default', 'Effect']"
                    :rows="cacheOptions">
                    <template #cell="{ value, columnIndex }">
                        <code v-if="columnIndex < 2">{{ value }}</code>
                        <span v-else>{{ value }}</span>
                    </template>
                </DocsTable>
                <p>
                    The management routes and facade replace the revision with each actual change
                    and evict that user's shared entry after commit. Inside an open database
                    transaction, reads use the transaction state. Requests that started before
                    another request's commit can keep their earlier snapshot.
                </p>
            </ProseSection>
            <ProseSection id="assignment-migration" title="Create the assignment table">
                <p>
                    Follow
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'permit/installation').href +
                            '#prepare-the-catalog'
                        "
                        >publish and run the Permit migration</DocsLink
                    >
                    after the configured user's table exists. Set <code>permit.guard</code> and
                    <code>permit.table</code> before migrating. Permit uses the configured Eloquent
                    user's connection, table, and primary key to create the assignment table.
                </p>
                <p>
                    The default table is <code>user_permissions</code>. It holds one row per user.
                    <code>user_id</code> is both the primary key and a foreign key with cascading
                    deletion. <code>permissions</code> and <code>roles</code> are separate JSON
                    objects with full ability keys and booleans. <code>revision</code> is the UUID
                    used to reject stale writes and cache entries.
                </p>
                <DocsCallout variant="caution">
                    <template #title>Rolling back table creation drops assignments</template>
                    Back up the assignment table before rolling back its creation. Keep the
                    configured table name and user connection aligned with the original migration.
                </DocsCallout>
            </ProseSection>
            <ProseSection id="rename-assignment-keys" title="Rename saved permissions and roles">
                <p>
                    Start with a migrated application that has a saved
                    <code>reports::export</code> or <code>role::admin</code> assignment. Generate a
                    migration and replace its contents with the example.
                </p>
                <CodeExample label="Create the application migration" :code="makeMigration" />
                <CodeExample
                    label="Rename and reverse saved Permit keys"
                    language="php"
                    :code="rename" />
                <DocsTable
                    caption="Blueprint rename macros used in the example"
                    :columns="['Macro call', 'Saved keys']"
                    :rows="renameMacros">
                    <template #cell="{ value, columnIndex }">
                        <code v-if="columnIndex === 0">{{ value }}</code>
                        <span v-else>{{ value }}</span>
                    </template>
                </DocsTable>
                <p>
                    Use one <code>Schema::table()</code> call per rename. The example keeps all
                    three calls in a single transaction. If the user's connection differs from the
                    migration connection, set the migration's <code>$connection</code> to the user's
                    connection name.
                </p>
                <p>
                    Each rename preserves explicit grants and denials and changes the revision of
                    changed rows. A stored destination key or a concurrent change aborts the rename.
                    <code>migrate --pretend</code> leaves data intact and cannot detect these
                    conflicts. Run the migration on a copy with representative assignments before
                    deploying.
                </p>
                <p>
                    Pause requests and workers that use these Gates. Update the declarations and
                    application references to the new keys in the same deployment. Run the migration
                    and rebuild the catalog before restarting workers and serving traffic.
                </p>
                <CodeExample label="Review and apply the migration" :code="runMigration" />
                <p>
                    After deployment, a stored <code>reports::export</code> denial appears as a
                    denial for <code>analytics::download</code>. To roll back, restore the old
                    declarations and references, reverse the migration, and rebuild the catalog
                    before resuming traffic. The reverse migration also rejects destination
                    collisions.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
