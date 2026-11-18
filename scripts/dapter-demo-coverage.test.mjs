import readContract from '@artisan-toolbox/dapter/contracts/read-v1.json';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vite-plus/test';
import { behaviorChecks, coverageIssues, discoverSettings } from './check-dapter-demos.mjs';

const registry = JSON.parse(readFileSync(resolve('app/Demo/Dapter/Listing/coverage.json'), 'utf8'));

describe('Dapter functional demo coverage', () => {
    it('uses the same public conformance requests in Composer and npm consumers', () => {
        const backendContract = JSON.parse(
            readFileSync(
                resolve('vendor/artisan-toolbox/dapter/resources/contracts/read-v1.json'),
                'utf8',
            ),
        );
        expect(readContract).toEqual(backendContract);
    });

    it('loads the same delivered runtime source from Composer and npm', () => {
        const composerDirectory = resolve('vendor/artisan-toolbox/dapter/resources/js');
        const npmDirectory = resolve('node_modules/@artisan-toolbox/dapter/resources/js');
        const runtimeFiles = (directory) =>
            readdirSync(directory, { recursive: true, encoding: 'utf8' })
                .filter((file) => /\.(ts|vue)$/.test(file))
                .sort((left, right) => left.localeCompare(right));
        const files = runtimeFiles(composerDirectory);
        expect(files.length).toBeGreaterThan(0);
        expect(runtimeFiles(npmDirectory)).toEqual(files);
        for (const file of files) {
            expect(
                readFileSync(resolve(npmDirectory, file), 'utf8'),
                `Refresh the Composer-delivered npm copy of ${file}.`,
            ).toBe(readFileSync(resolve(composerDirectory, file), 'utf8'));
        }
    });

    it('executes every registered frontend example and its actual backend route checks once', () => {
        const checks = behaviorChecks(registry);
        expect(checks.frontend).toContain(
            'resources/js/components/demo/dapter/authority/AuthorityDemo.test.js',
        );
        expect(checks.backend).toContain('tests/Feature/DapterAuthorityDemoTest.php');
        expect(
            checks.frontend.filter((file) => file.endsWith('SharedAdapterDemo.test.js')),
        ).toHaveLength(1);
        const extended = structuredClone(registry);
        extended.frontend.examples.push({
            behavior_test: 'resources/js/components/demo/dapter/another/Example.test.js',
            backend_behavior_test: 'tests/Feature/AnotherDemoTest.php',
        });
        expect(behaviorChecks(extended).frontend).toContain(
            'resources/js/components/demo/dapter/another/Example.test.js',
        );
        expect(behaviorChecks(extended).backend).toContain('tests/Feature/AnotherDemoTest.php');
    });

    it('discovers every delivered public setting and links it to an executable demo', () => {
        const settings = discoverSettings();
        expect(settings).toContain('StoreOptions.makeWithoutDefaults');
        expect(settings).toContain('StoreOptions.searchableField');
        expect(settings).toContain('StoreOptions.withoutFieldFilter');
        expect(settings).toContain('attribute.Driver');
        expect(settings).toContain('DriverRegistry.register');
        expect(settings).toContain('DriverRegistry.make');
        expect(settings).toContain('SourceRegistry.register');
        expect(settings).toContain('SourceRegistry.className');
        expect(settings).toContain('attribute.PageSize');
        expect(settings).toContain('config.access.guard');
        expect(settings).toContain('DataAdapter.decodeRow');
        for (const prefix of ['DataAdapter', 'useDataAdapter']) {
            for (const option of [
                'protocol',
                'decodeDefinition',
                'searchDebounce',
                'url',
                'scrollContainer',
            ])
                expect(settings).toContain(`${prefix}.${option}`);
        }
        for (const member of ['available', 'current', 'call', 'clear'])
            expect(settings).toContain(`field.${member}`);
        expect(settings).toContain('DataAdapter.adapter');
        expect(settings).toContain('field.options.page');
        expect(settings).toContain('DataAdapter.id');
        expect(settings).toContain('useDataAdapter.source');
        expect(settings).toContain('useDataAdapter.reactiveSource');
        expect(settings).toContain('useDataAdapter.handle');
        expect(settings).toContain('useDataAdapter.decodeRow');
        expect(settings).toContain('command.make:datasource.--eloquent');
        expect(coverageIssues(settings, registry)).toEqual([]);
    });

    it('rejects a scenario that is no longer mounted in its focused guide', () => {
        const incomplete = structuredClone(registry);
        incomplete.cases[0].page = 'resources/js/pages/docs/dapter/Index.vue';
        expect(coverageIssues([], incomplete)).toContain(
            'Mount the fixed CollectionDefaults scenario in its focused guide.',
        );
    });

    it('runs registered backend examples and rejects a removed declaration demo', () => {
        expect(behaviorChecks(registry).backend).toContain('tests/Feature/DapterFieldDemoTest.php');
        expect(behaviorChecks(registry).frontend).toContain(
            'resources/js/components/demo/dapter/fields/FieldDemo.test.js',
        );
        const incomplete = structuredClone(registry);
        incomplete.backend.examples = incomplete.backend.examples.filter(
            (item) => !item.settings.includes('StoreOptions.driver'),
        );
        expect(coverageIssues(['StoreOptions.driver'], incomplete)).toContain(
            'Add a functional Dapter demo for StoreOptions.driver.',
        );
        const missingCase = structuredClone(registry);
        missingCase.backend.examples[0].id = 'MissingBackendCase';
        expect(coverageIssues([], missingCase)).toContain(
            'Link MissingBackendCase to its executable backend request and expected status.',
        );
        const unmounted = structuredClone(registry);
        unmounted.backend.examples[0].page = 'resources/js/pages/docs/dapter/Index.vue';
        expect(coverageIssues([], unmounted)).toContain(
            'Mount the fixed SearchContains scenario in its focused guide.',
        );
    });

    it('discovers constructor members, nested primitive configuration, and action controls without a fixed count', () => {
        const settings = discoverSettings();
        for (const key of [
            'dto.RecordTarget.input',
            'dto.HandlerRequirements.databases',
            'attribute.ActionAuthorize.id',
            'StoreOptions.globalFilterable.options',
            'config.declarations.query.identity.columns.*.valueType',
            'defineActions.decodeResult',
            'actions.http',
            'handle.setSearchMatch',
        ])
            expect(settings).toContain(key);
        expect(coverageIssues([...settings, 'dto.FutureOptions.newSetting'], registry)).toContain(
            'Add a functional Dapter demo for dto.FutureOptions.newSetting.',
        );
        const incomplete = structuredClone(registry);
        for (const item of [
            ...incomplete.cases,
            ...incomplete.backend.examples,
            ...incomplete.frontend.examples,
        ])
            item.settings = item.settings.filter((setting) => setting !== 'dto.RecordTarget.input');
        expect(coverageIssues(settings, incomplete)).toContain(
            'Add a functional Dapter demo for dto.RecordTarget.input.',
        );
    });

    it('rejects a new option without a functional example', () => {
        expect(coverageIssues(['StoreOptions.undeclaredDemo'], registry)).toContain(
            'Add a functional Dapter demo for StoreOptions.undeclaredDemo.',
        );
    });

    it('rejects a missing configuration example and generator option', () => {
        const incomplete = structuredClone(registry);
        for (const item of incomplete.cases)
            item.settings = item.settings.filter((setting) => setting !== 'config.paging.mode');
        delete incomplete.generator.eloquent_command;
        expect(
            coverageIssues(
                ['config.paging.mode', 'command.make:datasource.--eloquent'],
                incomplete,
            ),
        ).toEqual([
            'Add a functional Dapter demo for config.paging.mode.',
            'Add a functional Dapter demo for command.make:datasource.--eloquent.',
        ]);
    });
});

it('reflects new paging enum choices and rejects removed paging contract demonstrations', () => {
    const additions = JSON.parse(
        execFileSync(
            process.env.PHP_BINARY || 'php',
            [
                '-r',
                `ob_start(); require 'scripts/dapter-demo-surface.php'; ob_end_clean(); enum FuturePaging { case Offset; case Future; } echo json_encode(enumDemoSettings(new ReflectionEnum(FuturePaging::class)));`,
            ],
            { encoding: 'utf8' },
        ),
    );
    expect(additions).toEqual(['enum.FuturePaging.Offset', 'enum.FuturePaging.Future']);
    expect(coverageIssues(additions, registry)).toContain(
        'Add a functional Dapter demo for enum.FuturePaging.Future.',
    );
    const settings = discoverSettings();
    for (const setting of [
        'enum.PagingMode.Simple',
        'enum.PagingMode.Cursor',
        'WithCursorScope.cursorScope',
        'TraversalStoreDriver.traverse',
        'DriverCapabilities.simple',
        'DriverCapabilities.cursor',
        'DataAdapter.paging',
        'useDataAdapter.paging',
    ]) {
        expect(settings).toContain(setting);
        const incomplete = structuredClone(registry);
        for (const item of [
            ...incomplete.cases,
            ...incomplete.backend.examples,
            ...incomplete.frontend.examples,
        ])
            item.settings = item.settings.filter((value) => value !== setting);
        expect(coverageIssues(settings, incomplete)).toContain(
            `Add a functional Dapter demo for ${setting}.`,
        );
    }
});

it('discovers live contracts, public DTOs, queue routing, record metadata, and nested polling without a fixed total', () => {
    const settings = discoverSettings();
    for (const setting of [
        'SourceRegistry.registerLive',
        'DataStore.update',
        'DataStores.recipient',
        'contract.DeliveryContextFactory.restore',
        'contract.PublicRowProjection.project',
        'contract.IdentityLookupDriver.identifiedRows',
        'contract.RowRevisionProvider.revision',
        'dto.RestoredSource.audience',
        'dto.SqlIdentitySelector.column',
        'dto.GlobalAudience.projection',
        'config.broadcasting.context',
        'config.broadcasting.queue_connection',
        'config.broadcasting.queue',
        'attribute.UseResource.resourceClass',
        'attribute.BroadcastUpdatable.identity',
        'DataAdapter.echo',
        'useDataAdapter.polling',
        'polling.interval',
        'echoChannel.stopListening',
        'records.format',
        'channel.event',
        'metadata.records',
        'handle.integrationError',
        'handle.resetContext',
        'handle.restartPolling',
        'corpus.updates-v1',
    ]) {
        expect(settings).toContain(setting);
        const incomplete = structuredClone(registry);
        for (const item of [
            ...incomplete.cases,
            ...incomplete.backend.examples,
            ...incomplete.frontend.examples,
        ])
            item.settings = item.settings.filter((value) => value !== setting);
        expect(coverageIssues(settings, incomplete)).toContain(
            `Add a functional Dapter demo for ${setting}.`,
        );
    }
    expect(settings).not.toContain('dto.RecipientReference.encrypted');
    expect(settings).not.toContain('dto.DataStore.recipient');
    for (const corpus of ['read-v1', 'updates-v1']) {
        expect(
            readFileSync(
                resolve(`node_modules/@artisan-toolbox/dapter/resources/contracts/${corpus}.json`),
                'utf8',
            ),
        ).toBe(
            readFileSync(
                resolve(`vendor/artisan-toolbox/dapter/resources/contracts/${corpus}.json`),
                'utf8',
            ),
        );
    }
});

it('discovers every infinite creator option and control and rejects each removed demonstration', () => {
    const settings = discoverSettings();
    for (const setting of [
        'DataAdapter.infinite',
        'useDataAdapter.infinite',
        'handle.infinite',
        'infinite.options.root',
        'infinite.options.sentinel',
        'infinite.options.axis',
        'infinite.status',
        'infinite.append',
        'infinite.retry',
    ]) {
        expect(settings).toContain(setting);
        const incomplete = structuredClone(registry);
        for (const item of [
            ...incomplete.cases,
            ...incomplete.backend.examples,
            ...incomplete.frontend.examples,
        ]) {
            item.settings = item.settings.filter((value) => value !== setting);
        }
        expect(coverageIssues(settings, incomplete)).toContain(
            `Add a functional Dapter demo for ${setting}.`,
        );
    }
    expect(behaviorChecks(registry).backend).toContain('tests/Feature/DapterInfiniteDemoTest.php');
    expect(behaviorChecks(registry).frontend).toContain(
        'resources/js/components/demo/dapter/infinite/InfiniteDemo.test.js',
    );
});

it('discovers source comparison policies and rejects each missing functional demonstration', () => {
    const settings = discoverSettings();
    for (const setting of [
        'dto.LocaleOptions.locale',
        'dto.FullTextOptions.configuration',
        'dto.FieldOptions.locale',
        'dto.FieldOptions.fullText',
        'dto.SearchTarget.fullText',
        'enum.MatchType.FullText',
        'enum.SortType.Locale',
        'config.declarations.fields.*.order.options.locale.locale',
        'config.declarations.fields.*.search.options.fullText.configuration',
        'config.declarations.global.search.*.fullText.configuration',
        'localePolicy.validLocale',
        'fullTextPolicy.maxBytes',
        'DriverCapabilities.comparisons',
    ]) {
        expect(settings).toContain(setting);
        const missing = structuredClone(registry);
        for (const item of missing.backend.examples)
            item.settings = item.settings.filter((entry) => entry !== setting);
        expect(coverageIssues([setting], missing)).toContain(
            `Add a functional Dapter demo for ${setting}.`,
        );
    }
    expect(behaviorChecks(registry).backend).toContain(
        'tests/Feature/DapterComparisonDemoTest.php',
    );
    expect(behaviorChecks(registry).frontend).toContain(
        'resources/js/components/demo/dapter/comparisons/ComparisonDemo.test.js',
    );
});
