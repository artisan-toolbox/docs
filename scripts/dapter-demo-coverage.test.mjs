import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import { behaviorChecks, coverageIssues, discoverSettings } from './check-dapter-demos.mjs';

const registry = JSON.parse(readFileSync(resolve('app/Demo/Dapter/Listing/coverage.json'), 'utf8'));

describe('Dapter functional demo coverage', () => {
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
        expect(settings).toContain('attribute.PageSize');
        expect(settings).toContain('config.access.guard');
        expect(settings).toContain('DataAdapter.decodeRow');
        expect(settings).toContain('DataAdapter.adapter');
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
