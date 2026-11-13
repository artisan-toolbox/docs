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
                    Install Filoquent in an existing Laravel 13 application and save your first file
                    through an Eloquent attribute. Filoquent is in beta. The documented release,
                    <code>1.0.0-beta.3</code>, is available on
                    <DocsLink :href="page.package.releasesUrl">Packagist</DocsLink>. APIs may change
                    before the stable release.
                </p>
            </ProseSection>
            <Requirements :items="page.requirements">
                <p>
                    Run commands from your application's root, where <code>artisan</code> and
                    <code>composer.json</code> live. Configure a database connection and a writable
                    default Laravel filesystem before running the first file example.
                </p>
            </Requirements>
            <ProseSection id="install-source" title="Install from Packagist">
                <InstallCommand :package="page.package" label="Install Filoquent from Packagist" />
                <p>
                    The explicit prerelease version allows Composer to install it without changing
                    your application's global <code>minimum-stability</code>. No local source
                    checkout or custom repository is required.
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
            <ProseSection id="configuration" title="Configure Filoquent">
                <p>
                    Filoquent uses Laravel's default filesystem disk and stores new uploads under
                    <code>assets</code>. Redis recovery is disabled by default. The first file
                    example needs no additional package configuration.
                </p>
                <p>
                    To customize these defaults, optionally publish
                    <code>config/filoquent.php</code> from your application's root:
                </p>
                <CodeExample
                    label="Publish optional Filoquent configuration"
                    language="bash"
                    code="php artisan vendor:publish --tag=filoquent-config" />
                <p>
                    See the
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/configuration').href"
                        >configuration guide</DocsLink
                    >
                    to choose a filesystem disk, change the upload directory, or enable optional
                    Redis recovery.
                </p>
            </ProseSection>
            <FileExample />
            <ProseSection id="ownership-gates" title="Install persistent missing-table protection">
                <p>
                    After updating an existing Filoquent installation, run
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
                    After updating an existing Filoquent installation, run
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
                    package version, run <code>php artisan boost:update</code> to refresh a
                    previously selected copy. Boost is optional development tooling and is not
                    required in production.
                </p>
                <p>
                    If bundled or previously generated guidance names an older release or describes
                    these APIs as unpublished, use the Packagist command above and the current
                    canonical documentation. Check your actual installed package version before
                    following version-specific agent instructions.
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
