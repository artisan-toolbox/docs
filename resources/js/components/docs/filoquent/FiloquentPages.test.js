import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import Index from '@/pages/docs/filoquent/Index.vue';
import Installation from '@/pages/docs/filoquent/Installation.vue';
import Configuration from '@/pages/docs/filoquent/Configuration.vue';
import Development from '@/pages/docs/filoquent/Development.vue';
import Files from '@/pages/docs/filoquent/Files.vue';
import Storage from '@/pages/docs/filoquent/Storage.vue';
import GarbageCollection from '@/pages/docs/filoquent/GarbageCollection.vue';
import Health from '@/pages/docs/filoquent/Health.vue';
import RenameOwners from '@/pages/docs/filoquent/RenameOwners.vue';
import { installationCommands } from '../installationFixture';

const slugs = [
    'filoquent',
    'filoquent/installation',
    'filoquent/files',
    'filoquent/configuration',
    'filoquent/health',
    'filoquent/garbage-collection',
    'filoquent/storage',
    'filoquent/rename-owners',
    'filoquent/development',
];
function render(component, slug, title) {
    return mount(component, {
        props: {
            navigation: slugs.map((slug) => ({ slug, href: `/docs/${slug}`, children: [] })),
            page: {
                slug,
                title,
                description: 'Inspect the Filoquent preview.',
                requirements: ['PHP 8.5', 'Laravel 13', 'Composer'],
                package: {
                    id: 'filoquent',
                    title: 'Filoquent',
                    composerName: 'artisan-toolbox/filoquent',
                    stability: 'Preview',
                    installationStatus: 'not-installed',
                    installationCommands: installationCommands('filoquent'),
                    artwork: {
                        light: '/images/packages/filoquent/filoquent-light.svg',
                        dark: '/images/packages/filoquent/filoquent-dark.svg',
                    },
                },
            },
        },
    });
}

describe('Filoquent preview documentation', () => {
    it.each([
        [Index, 'filoquent', 'Filoquent'],
        [Installation, 'filoquent/installation', 'Install Filoquent'],
    ])(
        'teaches installation before an executable file save with a defined model and input',
        (component, slug, title) => {
            const wrapper = render(component, slug, title);
            const content = wrapper.get('[data-document-content]').text();
            const commands = installationCommands('filoquent').preview.code;
            expect(wrapper.get('h1').text()).toBe(title);
            expect(content.indexOf('Requirements')).toBeLessThan(content.indexOf(commands));
            const code = wrapper
                .findAll('pre')
                .map((example) => example.text())
                .join('\n');
            expect(code).toContain(
                'composer config repositories.filoquent path packages/filoquent',
            );
            expect(code).toContain('composer require artisan-toolbox/filoquent:1.x-dev');
            expect(code).toContain('use ArtisanToolbox\\Filoquent\\Casts\\AsFile;');
            expect(code).toContain("$table->filoquent('attachment')->nullable();");
            expect(code).toContain("file_put_contents($source, 'Hello Filoquent');");
            expect(code).toContain('$document->save();');
            expect(content.indexOf('php artisan migrate')).toBeLessThan(
                content.indexOf('Hello Filoquent'),
            );
            expect(content).toContain('true');
            expect(content).toContain('not a');
            expect(wrapper.text()).toContain('Not installed');
        },
    );

    it('keeps the full identity on the overview and compact tags on child pages', () => {
        expect(render(Index, 'filoquent', 'Filoquent').findAll('h1 img')).toHaveLength(2);
        const child = render(Configuration, 'filoquent/configuration', 'Filoquent configuration');
        expect(child.get('h1').text()).toBe('Filoquent configuration');
        expect(child.findAll('h1 img')).toHaveLength(0);
        expect(child.text()).toContain('placeholder');
        expect(child.text()).toContain('base_path');
        expect(child.text()).toContain('AsFile::using()');
        expect(child.text()).toContain('FileNaming::Original');
        expect(child.text()).toContain('FileNaming::Uuid');
        expect(child.text()).toContain('use ArtisanToolbox\\Filoquent\\Enums\\FileNaming;');
    });

    it('shows the contributor checks and the README regeneration command', () => {
        const wrapper = render(Development, 'filoquent/development', 'Develop Filoquent');
        const code = wrapper
            .findAll('pre')
            .map((example) => example.text())
            .join('\n');
        expect(code).toContain('node .ai/sync.mjs --check');
        expect(code).toContain('composer test');
        expect(code).toContain('php vendor/bin/maintainer readme:update --no-interaction');
    });

    it('documents native database lanes and disposable worker database isolation', () => {
        const guide = render(Development, 'filoquent/development', 'Develop Filoquent');
        const checks = guide.get('section[aria-labelledby="database-checks"]');
        const code = checks
            .findAll('pre')
            .map((example) => example.text())
            .join('\n');
        expect(checks.text()).toContain('MySQL 8.4');
        expect(checks.text()).toContain('PostgreSQL 18');
        expect(checks.text()).toContain('prefer-lowest');
        expect(checks.text()).toContain('prefer-stable');
        expect(checks.text()).toContain('CREATE DATABASE');
        expect(checks.text()).toContain('disposable');
        expect(checks.text()).toContain('per PHP worker');
        expect(checks.text()).toContain('CanonicalOwnerRoutesTest');
        expect(checks.text()).toContain('GroupedMissingTablesTest');
        expect(checks.text()).toContain('WAL');
        expect(checks.text()).toContain('FILOQUENT_TEST_REDIS_PORT');
        expect(code).toContain('FILOQUENT_TEST_DATABASE_DRIVER=mysql');
        expect(code).toContain('FILOQUENT_TEST_DATABASE_DRIVER=pgsql');
        expect(code).toContain('FILOQUENT_TEST_MYSQL_DATABASE=filoquent_test');
        expect(code).toContain('FILOQUENT_TEST_PGSQL_DATABASE=filoquent_test');
        expect(code).toContain('composer test:unit -- --processes=2');
        expect(checks.text()).not.toContain('--group=mysql');
    });

    it('documents middleware output ownership and the indexed cleanup boundary', () => {
        const files = render(Files, 'filoquent/files', 'Work with file attributes').text();
        expect(files).toContain('PendingAsset::fromPath');
        expect(files).toContain('nonseekable');
        expect(files).toContain('exactly one default');
        const storage = render(
            Storage,
            'filoquent/storage',
            'Storage lifecycle and recovery',
        ).text();
        expect(storage).toContain('filoquent:prune --apply --limit=100');
        expect(storage).toContain('without any committed receipt');
        expect(storage).toContain('--after');
        expect(storage).toContain('one million');
    });

    it('orders controlled schema changes before detection, explicit resolution, and verification', () => {
        const guide = render(RenameOwners, 'filoquent/rename-owners', 'Rename file owners safely');
        expect(guide.get('h1').text()).toBe('Rename file owners safely');
        const preparation = guide.get('section[aria-labelledby="prerequisites"]').text();
        expect(preparation).toContain('Maintenance mode alone does not stop these processes');
        expect(preparation).toContain('Wait for all in-flight');
        const migration = guide.get('section[aria-labelledby="table-migration"]').text();
        expect(migration).toContain("Schema::rename('documents', 'articles');");
        expect(migration).toContain("Schema::rename('articles', 'documents');");
        expect(migration).toContain('Never reuse the old name before the pending group');
        expect(guide.text()).not.toContain('Filoquent::renameTable');
        const detection = guide.get('section[aria-labelledby="detect"]').text();
        expect(detection).toContain('filoquent:gc --apply --limit=100');
        expect(detection).toContain('one durable SQL group');
        expect(detection).toContain('The block persists even if a table later reappears');
        expect(detection).toContain('per UTC day');
        expect(detection).toContain('without walking or logging every receipt');
        const sections = guide
            .findAll('section')
            .map((section) => section.attributes('aria-labelledby'));
        expect(sections.indexOf('table-migration')).toBeLessThan(sections.indexOf('detect'));
        expect(sections.indexOf('detect')).toBeLessThan(sections.indexOf('rename-resolution'));
        expect(sections.indexOf('rename-resolution')).toBeLessThan(sections.indexOf('verify'));
    });

    it('requires explicit verified remapping or delayed removal rather than automatic table inference', () => {
        const guide = render(RenameOwners, 'filoquent/rename-owners', 'Rename file owners safely');
        const rename = guide.get('section[aria-labelledby="rename-resolution"]').text();
        expect(rename).toContain('--table=documents --rename-to=articles --apply');
        expect(rename).toContain('The command does not perform DDL or move files');
        expect(rename).toContain('every affected receipt');
        expect(rename).toContain('pages of 500');
        expect(rename).toContain('proportional database work');
        expect(rename).toContain('No journal drain is required');
        const removal = guide.get('section[aria-labelledby="removal"]').text();
        expect(removal).toContain('--table=documents --removed --apply');
        expect(removal).toContain('A new 24-hour grace period starts at this confirmation');
        expect(removal).toContain('does not delete files immediately');
        const restore = guide.get('section[aria-labelledby="restoration"]').text();
        expect(restore).toContain('--table=documents --rename-to=documents --apply');
        expect(restore).toContain('reappearance does not clear the block');
        expect(guide.get('section[aria-labelledby="model-class"]').text()).toContain(
            "protected $table = 'documents';",
        );
        const column = guide.get('section[aria-labelledby="file-column"]').text();
        expect(column).toContain("renameColumn('attachment', 'file')");
        expect(column).toContain("renameColumn('file', 'attachment')");
        expect(column).toContain('Change the model cast key');
        expect(guide.get('section[aria-labelledby="verify"]').text()).toContain('Hello Filoquent');
        const storage = render(Storage, 'filoquent/storage', 'Storage lifecycle and recovery');
        expect(
            storage
                .get('section[aria-labelledby="move-subpath"]')
                .findAll('a')
                .map((link) => link.attributes('href')),
        ).toContain('/docs/filoquent/rename-owners');
    });

    it('preserves PostgreSQL schema ownership and explains blocked legacy upgrades', () => {
        const guide = render(RenameOwners, 'filoquent/rename-owners', 'Rename file owners safely');
        const postgres = guide.get('section[aria-labelledby="postgresql"]').text();
        expect(postgres).toContain('--table=public.documents --rename-to=public.articles --apply');
        expect(postgres).toContain('search_path');
        expect(postgres).toContain('original schema cannot be inferred safely');
        expect(postgres).toContain('--removed is refused');
        expect(postgres).toContain('multiple schemas stays blocked');
        expect(guide.get('section[aria-labelledby="removal"]').text()).toContain(
            'PostgreSQL materialized view',
        );
        const installation = render(Installation, 'filoquent/installation', 'Install Filoquent');
        expect(
            installation
                .get('section[aria-labelledby="ownership-gates"]')
                .findAll('a')
                .map((link) => link.attributes('href')),
        ).toContain('/docs/filoquent/rename-owners#postgresql');
        const gc = render(
            GarbageCollection,
            'filoquent/garbage-collection',
            'Collect orphaned uploads',
        );
        const rotation = gc.get('section[aria-labelledby="schedule"]').text();
        expect(rotation).toContain('at most 500 routes');
        expect(rotation).toContain('owner_table, state, checked_at, id');
        expect(rotation).toContain('previews leave it unchanged');
    });

    it('distinguishes confirmed orphan collection from ambiguous schema changes', () => {
        const guide = render(
            GarbageCollection,
            'filoquent/garbage-collection',
            'Collect orphaned uploads',
        ).text();
        expect(guide).toContain('filoquent:gc --apply --limit=100');
        expect(guide).toContain('24 hours');
        expect(guide).toContain('renamed');
        expect(guide).toContain('soft-deleted');
        expect(guide).toContain('unresolved');
    });

    it('schedules complete health checks and bounded cleanup in background command processes', () => {
        const health = render(Health, 'filoquent/health', 'Check stored file health');
        expect(health.get('h1').text()).toBe('Check stored file health');
        expect(health.get('section[aria-labelledby="schedule"]').text()).toContain(
            "Schedule::command('filoquent:health')",
        );
        expect(health.text()).toContain('needs no queue worker or Redis journal');
        expect(health.text()).toContain('concurrently replaced or deleted upload is skipped');
        expect(health.text()).toContain('directory at the same path does not satisfy');

        const collection = render(
            GarbageCollection,
            'filoquent/garbage-collection',
            'Collect orphaned uploads',
        );
        const code = collection
            .findAll('pre')
            .map((block) => block.text())
            .join('\n');
        expect(code).toContain("Schedule::command('filoquent:gc --apply --limit=1000')");
        expect(code).toContain("Schedule::command('filoquent:prune --apply --limit=1000')");
        expect(code.match(/->runInBackground\(\)/g)).toHaveLength(2);
        for (const guide of [health, collection]) {
            const schedule = guide.get('section[aria-labelledby="schedule"]').text();
            expect(schedule).toContain('withoutOverlapping()');
            expect(schedule).toContain('onOneServer()');
            expect(schedule).toContain('shared cache store');
        }
    });

    it('distinguishes a completed partial audit from whole-ledger health and preserves log observability', () => {
        const health = render(Health, 'filoquent/health', 'Check stored file health');
        const coverage = health.get('section[aria-labelledby="coverage"]').text();
        expect(coverage).toContain('internal pages of 500 receipts');
        expect(coverage).toContain('from 1 to 10000');
        expect(coverage).toContain('Repeated limited runs without --after start at the beginning');
        expect(coverage).toContain('range_exhausted');
        expect(coverage).toContain('Exit code 0 on a partial run describes only that run');
        const results = health.get('section[aria-labelledby="results"]').text();
        for (const counter of [
            'uploads_examined',
            'files_checked',
            'files_present',
            'files_missing',
            'files_inconclusive',
            'uploads_skipped',
            'uploads_inconclusive',
        ]) {
            expect(results).toContain(counter);
        }
        expect(results).toContain('Exit code 2 means invalid options');
        const logs = health.get('section[aria-labelledby="logs"]').text();
        expect(logs).toContain('Filoquent maintenance started.');
        expect(logs).toContain('Filoquent maintenance completed.');
        expect(logs).toContain('independently of console verbosity');
        expect(logs).toContain('If the start log fails, no maintenance work starts');
        expect(logs).toContain('without undoing completed work');
    });

    it('makes journal activation optional and explains the reserved Redis database', () => {
        const configuration = render(
            Configuration,
            'filoquent/configuration',
            'Filoquent configuration',
        ).get('section[aria-labelledby="redis-journal"]');
        expect(configuration.text()).toContain('FILOQUENT_REDIS_DB=2');
        expect(configuration.text()).toContain('not an automatically unused database');
        expect(configuration.text()).toContain('Redis Cluster');
        expect(configuration.text()).toContain('FLUSHDB');
        expect(configuration.text()).toContain('FLUSHALL');

        const installation = render(Installation, 'filoquent/installation', 'Install Filoquent');
        expect(installation.get('section[aria-labelledby="first-file"]').text()).toContain(
            'Redis is optional',
        );
        const setup = installation.get('section[aria-labelledby="redis-journal"]');
        expect(setup.text().indexOf('php artisan migrate')).toBeLessThan(
            setup.text().indexOf('Set FILOQUENT_REDIS_DB=2'),
        );
        expect(setup.text()).toContain('filoquent_upload_namespace');
        expect(setup.findAll('a').map((link) => link.attributes('href'))).toContain(
            '/docs/filoquent/garbage-collection',
        );
    });

    it('teaches journal commit boundaries and bounded nonmutating collection preview', () => {
        const storage = render(Storage, 'filoquent/storage', 'Storage lifecycle and recovery');
        const journal = storage.get('section[aria-labelledby="journal"]').text();
        expect(journal).toContain('only after the outermost SQL commit');
        expect(journal).toContain('failed acknowledgment does not fail the committed save');
        expect(journal).toContain('first SQL promotion');
        expect(journal).toContain('Redis loss or eviction before SQL promotion');

        const collection = render(
            GarbageCollection,
            'filoquent/garbage-collection',
            'Collect orphaned uploads',
        );
        expect(collection.get('section[aria-labelledby="run"]').text()).toContain(
            'caps each phase, not their combined total',
        );
        const pending = collection.get('section[aria-labelledby="pending"]').text();
        expect(pending).toContain('does not import, acknowledge, retire, or delete anything');
        expect(pending).toContain('An active receipt remains active');
        expect(pending).toContain('cleanup when Redis is disabled');
    });

    it('explains persistent paths without recommending a relocation command', () => {
        const storage = render(Storage, 'filoquent/storage', 'Storage lifecycle and recovery');
        const section = storage.get('section[aria-labelledby="move-subpath"]');
        expect(section.text()).toContain('No path migration is required');
        expect(section.text()).toContain('saved manifest and ownership receipt');
        expect(section.text()).toContain('physical table and primary key remain the same');
        expect(storage.text()).not.toContain('filoquent:move-subpath');

        const configuration = render(
            Configuration,
            'filoquent/configuration',
            'Filoquent configuration',
        );
        expect(configuration.text()).toContain(
            'Existing fields retain their recorded disk and path',
        );
    });
});
