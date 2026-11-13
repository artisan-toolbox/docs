<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import Requirements from '@/components/docs/Requirements.vue';
import InstallCommand from '@/components/docs/InstallCommand.vue';
import RegistrationExample from '@/components/docs/filoquent/RegistrationExample.vue';
import FileExample from '@/components/docs/filoquent/FileExample.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const provider = `return [
    App\\Providers\\AppServiceProvider::class,
    ArtisanToolbox\\Filoquent\\FiloquentServiceProvider::class,
];`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection>
                <p>
                    Install the development preview in an existing Laravel 13 application and save
                    your first file through an Eloquent attribute. The source version
                    <code>0.1.0-alpha.1</code> is not a public stable release.
                </p>
            </ProseSection>
            <Requirements :items="page.requirements">
                <p>
                    Run commands from your application's root, where <code>artisan</code> and
                    <code>composer.json</code> live. Review the package source before installation.
                    Put that checkout at <code>packages/filoquent</code> and ignore the nested
                    checkout in your application's Git configuration.
                </p>
            </Requirements>
            <ProseSection id="install-source" title="Install the development source">
                <InstallCommand
                    :package="page.package"
                    command="preview"
                    label="Install the Filoquent source preview" />
                <p>
                    The first command adds a local Composer path repository. The second requires its
                    <code>1.x-dev</code> branch without changing your application's global minimum
                    stability. Keep that checkout available while using the path repository. Do not
                    distribute this local source wiring as a production installation.
                </p>
                <p>
                    Laravel discovers <code>FiloquentServiceProvider</code> automatically. No npm
                    dependency, authentication, or session setup is required. File persistence needs
                    a writable Laravel filesystem, a database, a JSON file column, the
                    <code>HasFiloquent</code> trait, and the package's upload ledger migration.
                    Configuration publishing is optional. The local public disk needs Laravel's
                    <code>php artisan storage:link</code> if you want browser access to public URLs.
                    Private disks need an authorized delivery strategy or supported temporary URLs.
                </p>
            </ProseSection>
            <ProseSection
                id="manual-provider"
                title="Register a provider when discovery is disabled">
                <p>
                    If your application disables package discovery, add this provider to the
                    existing list in <code>bootstrap/providers.php</code>. Keep your other
                    providers.
                </p>
                <CodeExample label="Register Filoquent manually" language="php" :code="provider" />
            </ProseSection>
            <RegistrationExample />
            <FileExample />
            <ProseSection id="ownership-gates" title="Install persistent missing-table protection">
                <p>
                    After updating an existing Filoquent checkout, run
                    <code>php artisan migrate</code> on every participating model connection before
                    resuming writes or maintenance. The ownership-gate migration adds durable
                    missing-table groups and keeps the journal's original owner identity when an
                    operator resolves a renamed route. This protection does not require Redis.
                </p>
                <p>
                    Use the
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/rename-owners').href"
                        >owner renaming and pending-resolution guide</DocsLink
                    >
                    for controlled table changes. Do not roll back the gate migration while pending
                    groups or retained journal route aliases remain. Its rollback refuses those
                    states to preserve ownership protection.
                </p>
                <p>
                    PostgreSQL owner routes include their schema, including <code>public</code>.
                    Older preview receipts without a schema are preserved in blocked groups until an
                    operator verifies a qualified destination. Follow the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'filoquent/rename-owners').href +
                            '#postgresql'
                        "
                        >PostgreSQL ownership upgrade procedure</DocsLink
                    >
                    before resuming affected writes or cleanup.
                </p>
            </ProseSection>
            <ProseSection id="redis-journal" title="Enable optional rollback recovery">
                <p>
                    The first file example works without Redis. To retain intents for uploads whose
                    SQL transaction rolls back, first configure Laravel's Redis integration and a
                    supported client on a standalone server. Reserve a logical database for
                    Filoquent. Database 2 is suitable only when your application has reserved it for
                    this purpose.
                </p>
                <p>
                    After updating an existing Filoquent checkout, run
                    <code>php artisan migrate</code> in the consuming application. The forward
                    migration allows a pending receipt without an owner key and creates the one-row
                    <code>filoquent_upload_namespace</code> table. Run the package migrations on
                    every participating model connection before enabling the journal.
                </p>
                <p>
                    Before rolling back the journal migration, stop upload writers, consolidate
                    Redis intents with applied collection, and finish pending cleanup and pruning.
                    Disable the journal and refresh configuration before the rollback. The migration
                    refuses rollback while pending or writing receipts, or receipts without owner
                    keys, remain. Keep the namespace metadata until all Redis intents are
                    consolidated.
                </p>
                <p>
                    Set <code>FILOQUENT_REDIS_DB=2</code> in the application's environment, using
                    your reserved number. Refresh the application's configuration cache and restart
                    long-running workers through your normal deployment procedure. Filoquent uses
                    Laravel's default Redis server through a dedicated connection. Do not duplicate
                    its credentials. See the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'filoquent/configuration').href +
                            '#redis-journal'
                        "
                        >Redis configuration reference</DocsLink
                    >
                    for isolation limits and the optional base connection setting.
                </p>
                <p>
                    Save the first file example again. The expected result remains
                    <code>true</code> and <code>Hello Filoquent</code>. A successful outermost SQL
                    commit makes its receipt active and permits acknowledgment of its Redis intent.
                    Run and schedule
                    <DocsLink
                        :href="findNavigationItem(navigation, 'filoquent/garbage-collection').href"
                        >applied garbage collection</DocsLink
                    >
                    frequently to consolidate failed or rolled-back upload intents into durable
                    pending SQL receipts. A preview alone does not consolidate them.
                </p>
            </ProseSection>
            <ProseSection id="agent-guidance" title="Install optional agent guidance">
                <p>
                    If your development application already uses Laravel Boost, run
                    <code>php artisan boost:install</code> and select the
                    <code>filoquent-development</code> skill for your agent. After changing the
                    package source, run <code>php artisan boost:update</code> to refresh a
                    previously selected copy. Boost is optional development tooling and is not
                    required in production.
                </p>
            </ProseSection>
            <ProseSection id="next-steps" title="Next steps">
                <p>
                    Continue with the
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/files').href"
                        >file attributes guide</DocsLink
                    >
                    for casts and variants, then the
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/configuration').href"
                        >configuration reference</DocsLink
                    >
                    for optional publishing and storage settings.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
