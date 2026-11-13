<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const checks = `composer install
node .ai/sync.mjs --check
composer test`;
const databaseMatrix = [
    [
        'SQLite',
        'Ubuntu and Windows',
        'prefer-lowest and prefer-stable',
        'Full Pest suite; Windows runs Pest sequentially',
    ],
    [
        'SQLite with Redis 7.4',
        'Ubuntu',
        'prefer-lowest and prefer-stable',
        'Native Redis journal integration',
    ],
    [
        'MySQL 8.4 with Redis 7.4',
        'Ubuntu',
        'prefer-lowest and prefer-stable',
        'Full package suite on MySQL; SQLite-only fixtures retain SQLite',
    ],
    [
        'PostgreSQL 18 with Redis 7.4',
        'Ubuntu',
        'prefer-lowest and prefer-stable',
        'Full package suite on PostgreSQL; SQLite-only fixtures retain SQLite',
    ],
];
const mysqlChecks = `FILOQUENT_TEST_DATABASE_DRIVER=mysql \\
FILOQUENT_TEST_MYSQL_HOST=127.0.0.1 \\
FILOQUENT_TEST_MYSQL_PORT=13306 \\
FILOQUENT_TEST_MYSQL_DATABASE=filoquent_test \\
FILOQUENT_TEST_MYSQL_USERNAME=root \\
FILOQUENT_TEST_MYSQL_PASSWORD=filoquent \\
composer test:unit -- --processes=2`;
const postgresChecks = `FILOQUENT_TEST_DATABASE_DRIVER=pgsql \\
FILOQUENT_TEST_PGSQL_HOST=127.0.0.1 \\
FILOQUENT_TEST_PGSQL_PORT=15432 \\
FILOQUENT_TEST_PGSQL_DATABASE=filoquent_test \\
FILOQUENT_TEST_PGSQL_USERNAME=filoquent \\
FILOQUENT_TEST_PGSQL_PASSWORD=filoquent \\
composer test:unit -- --processes=2`;
const refactoring = `composer refactor:check
composer refactor`;
const staticAnalysis = 'php vendor/bin/maintainer quality:check --tool=phpstan --no-interaction';
const workbench = `composer build
composer serve`;
const readme = 'php vendor/bin/maintainer readme:update --no-interaction';
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="checks" title="Run package checks">
                <p>
                    Start in the Filoquent package checkout with PHP ^8.5, Composer, and Node 24 or
                    later. Run these commands from that package root, rather than the consuming
                    Laravel application:
                </p>
                <CodeExample label="Validate the Filoquent package" :code="checks" />
                <p>
                    <code>composer test</code> runs PHPStan, Rector in dry-run mode, Pint, full type
                    coverage, and Pest. The CI workflow configures PHP 8.5 with Laravel 13 on Linux
                    and Windows in both lowest and stable dependency lanes. The manifest does not
                    support PHP 8.3, PHP 8.4, or Laravel 12.
                </p>
                <p>
                    Composer and Maintainer use the same PHPStan profile in
                    <code>phpstan.neon.dist</code>, included by <code>phpstan.neon</code>. It
                    analyzes source, configuration, and tests at level 7. The development
                    dependencies include the official Pest 5 PHPStan adapter, registered by
                    <code>phpstan/extension-installer</code> alongside Larastan, Carbon, and the
                    official Mockery extension. Do not add those extensions to
                    <code>includes</code> again. The profile identifies the package's
                    <code>config</code> directory explicitly because Larastan boots through
                    Testbench.
                </p>
                <p>
                    The shared profile loads <code>phpstan-platform.php</code> automatically.
                    Windows uses <code>maximumNumberOfProcesses: 1</code> because Larastan workers
                    share Testbench bootstrap files, including <code>services.php</code>. This
                    prevents concurrent file replacement during application startup. Composer and
                    Maintainer still analyze all source, configuration, and tests at level 7 in both
                    dependency lanes. Other systems retain PHPStan's default parallelism. No extra
                    command or environment variable is required. Run separate analysis invocations
                    sequentially when they use the same checkout.
                </p>
                <p>
                    PHPStan starts at <code>2.3.5</code>, and the Pest type-coverage plugin starts
                    at <code>5.1</code>. Earlier analyzer versions report invalid generic errors,
                    and the earlier coverage plugin cannot construct PHPUnit 13's configuration
                    builder. Rector starts at <code>2.8.4</code> with its Laravel extension at
                    <code>2.7.3</code> so their parser and Composer-based rules remain compatible.
                    Keep both lowest and stable dependency lanes enabled.
                </p>
                <CodeExample label="Run PHPStan through Maintainer" :code="staticAnalysis" />
            </ProseSection>
            <ProseSection id="database-checks" title="Check each database engine">
                <p>
                    The CI matrix has ten jobs on PHP 8.5 and Laravel 13. Each engine runs in both
                    <code>prefer-lowest</code> and <code>prefer-stable</code> dependency lanes:
                </p>
                <DocsTable
                    caption="Filoquent database and dependency CI coverage"
                    :columns="['Database', 'Operating system', 'Dependency lanes', 'Coverage']"
                    :rows="databaseMatrix" />
                <p>
                    MySQL and PostgreSQL jobs run PHPStan, Rector, Pint, type coverage, and the
                    complete Pest suite with two parallel workers. Each job owns its SQL service and
                    a private Redis service, so journal recovery also runs with the selected SQL
                    engine. The default suite uses SQLite when
                    <code>FILOQUENT_TEST_DATABASE_DRIVER</code> is absent or <code>sqlite</code>.
                </p>
                <p>
                    Start disposable MySQL 8.4 or PostgreSQL 18 services before running native tests
                    locally. Install the matching PDO driver. Use a dedicated test endpoint with
                    <code>CREATE DATABASE</code> and <code>DROP DATABASE</code> privileges, and
                    create the base database <code>filoquent_test</code>. Never point these
                    credentials at an application or production server. The test harness creates one
                    random owned database per PHP worker, resets its tables between tests, and drops
                    that owned database at shutdown. It does not use the base database for test
                    tables.
                </p>
                <p>
                    Run the following commands in a Linux shell from the package root after the
                    package checks above. These examples use disposable services on ports
                    <code>13306</code> and <code>15432</code> with synthetic credentials. Match the
                    host, port, and credentials to your own isolated services:
                </p>
                <CodeExample label="Run the complete Pest suite on MySQL" :code="mysqlChecks" />
                <CodeExample
                    label="Run the complete Pest suite on PostgreSQL"
                    :code="postgresChecks" />
                <p>
                    Select <code>mysql</code> or <code>pgsql</code> explicitly. The corresponding
                    <code>FILOQUENT_TEST_MYSQL_</code> or
                    <code>FILOQUENT_TEST_PGSQL_</code> variables require <code>HOST</code> or
                    <code>SOCKET</code>, <code>DATABASE</code>, and <code>USERNAME</code>. MySQL
                    accepts a socket file path; PostgreSQL accepts the directory containing its
                    socket. The database name must start with <code>filoquent_</code> and have a
                    nonempty suffix of lowercase ASCII letters, digits, or underscores.
                    <code>PASSWORD</code> defaults to an empty string, and
                    <code>PORT</code> defaults to the engine's standard port. An invalid or
                    incomplete native configuration fails before running against another engine.
                </p>
                <p>
                    To include real journal recovery locally, start a private Redis 7.4 service,
                    install the PHP Redis extension, and set
                    <code>FILOQUENT_TEST_REDIS_HOST</code> and, when needed,
                    <code>FILOQUENT_TEST_REDIS_PORT</code>. A local Unix socket can use
                    <code>FILOQUENT_TEST_REDIS_SOCKET</code> instead. The SQL engine selection still
                    applies. Never use a shared Redis instance for these integration checks.
                </p>
                <p>
                    SQLite-specific fixtures remain explicit SQLite tests inside the native jobs.
                    <code>CanonicalOwnerRoutesTest</code> and the case-insensitive table-name case
                    in <code>GroupedMissingTablesTest</code> verify SQLite routing, case folding,
                    and attached databases. Secondary tenant connections in
                    <code>FilePersistenceTest</code>, <code>UploadJournalTest</code>, and
                    <code>PendingOwnerTablesTest</code> also retain SQLite. The two-connection WAL
                    fixture in <code>UploadJournalTest</code> exercises SQLite locking. These
                    fixtures do not establish native MySQL or PostgreSQL behavior. General file
                    lifecycle, ownership, cleanup, migration, command, and journal tests use the
                    selected engine.
                </p>
            </ProseSection>
            <ProseSection id="refactoring" title="Review automated refactoring">
                <p>From the package root, check Rector's proposed changes before applying them:</p>
                <CodeExample label="Check and apply Rector changes" :code="refactoring" />
                <p>
                    Rector reads package compatibility from Composer and applies the configured
                    code-quality, dead-code, type-declaration, and Laravel rules. The configuration
                    excludes the rule that changes an explicit null-coalescing fallback into a
                    configuration default. Those expressions differ when a configuration key exists
                    with a null value. It also excludes the <code>WithoutTimestamps</code> attribute
                    conversion because Laravel 13.0 does not provide that attribute.
                </p>
                <p>
                    Development dependencies pin ParaTest to <code>~7.27.5</code>. Pest 5.3.5
                    expects that runner format; ParaTest 7.28 changes it. Keep the parallel Pest
                    check when reviewing an upgrade. The Mockery PHPStan extension provides dynamic
                    mock method types across the supported lowest and stable dependency lanes.
                </p>
            </ProseSection>
            <ProseSection id="journal-checks" title="Verify optional journal recovery">
                <p>
                    Keep the default Redis-disabled suite and the journal-enabled recovery suite
                    separate. Cover assignment without remote I/O, complete variant preflight,
                    registration failure before storage writes, rollback, and acknowledgment after
                    the outermost commit. An acknowledgment failure must not fail a committed save.
                </p>
                <p>
                    Exercise bounded preview and apply behavior, repeated import of one UUID,
                    active-receipt protection, first-promotion grace timing, pending cleanup with
                    Redis disabled, namespace isolation, and storage retry behavior. Use isolated
                    test databases and journal keys. Verify the real Redis client's atomic record
                    and index operations when checking integration. Never flush a shared Redis
                    server to prepare a test.
                </p>
                <p>
                    The forward migration makes <code>filoquent_uploads.owner_key</code> nullable
                    for pending work and adds <code>filoquent_upload_namespace</code>. Test both a
                    new installation and an existing ledger upgrade. Keep the class and field hash
                    restricted to creation-time paths. Journal recovery must use the stored UUID and
                    manifest, without adding a filesystem scan or a SQL tombstone requirement.
                </p>
            </ProseSection>
            <ProseSection id="workbench" title="Use the development workbench">
                <CodeExample label="Build and serve the package workbench" :code="workbench" />
                <p>
                    Orchestra Testbench builds the package's laboratory application before serving
                    it. Keep package behavior covered by the owning Pest suite even when a workbench
                    check passes.
                </p>
            </ProseSection>
            <ProseSection id="identity" title="Maintain package identity and versions">
                <p>
                    <code>ArtisanToolbox\Filoquent\Filoquent</code> implements Maintainer's
                    <code>Versionable</code> and <code>WithReadmeHead</code> contracts. Its
                    <code>VERSION</code> is <code>0.1.0-alpha.1</code>. This source identity is
                    separate from Composer's development branch label and does not publish a
                    release.
                </p>
                <p>
                    Edit <code>readmeHead()</code> for managed metadata, then regenerate the README
                    from the package root:
                </p>
                <CodeExample label="Regenerate the Filoquent README head" :code="readme" />
                <p>
                    Keep manual content outside the generated markers. The owning SVGs live in
                    <code>logo/</code>. The icon combines a document and linked model nodes on the
                    shared Artisan Toolbox tile. Copy theme variants into the central documentation
                    application when artwork changes.
                </p>
            </ProseSection>
            <ProseSection id="skills" title="Keep agent guidance synchronized">
                <p>
                    The package adopts contributor standards version <code>1.0.6</code> through the
                    standalone <code>.ai/sync.mjs</code> tool. Its check runs in CI. Keep the
                    generated <code>.ai</code> and <code>.agents</code> copies synchronized through
                    that tool and preserve the package's specialized contributor skills.
                </p>
                <p>
                    The source at <code>resources/boost/skills/filoquent-development/SKILL.md</code>
                    serves consuming applications. Review it with public API and installation
                    changes, together with the central guides, tests, and changelog. Do not copy
                    contributor requirements into consumer guidance.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
