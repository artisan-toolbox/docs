import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import Quality from '../../pages/docs/maintainer/Quality.vue';

const page = {
    title: 'Fixes and CI Checks',
    description:
        'Apply automated fixes and run configured PHP and frontend quality checks.',
    package: {
        title: 'Maintainer',
        composerName: 'artisan-toolbox/maintainer',
        documentedVersion: '1.10',
        installedVersion: '1.10',
        stability: 'Stable',
        artwork: {
            light: '/images/packages/maintainer/maintainer-light.svg',
            dark: '/images/packages/maintainer/maintainer-dark.svg',
        },
    },
};

describe('Maintainer fixes and CI checks guide', () => {
    it('preserves the guide headings, original anchors, package metadata, and requirements', () => {
        const wrapper = mount(Quality, { props: { page } });
        const requirements = wrapper
            .findAll('table')
            .find(
                (table) =>
                    table.get('caption').text() ===
                    'PHP quality command requirements',
            );

        expect(wrapper.get('h1').text()).toBe('Fixes and CI Checks');
        expect(wrapper.get('h1').find('.sr-only, img').exists()).toBe(false);
        expect(wrapper.find('dl').exists()).toBe(false);
        expect(wrapper.get('[aria-label="Package details"]').text()).toContain(
            'Maintainer',
        );
        expect(wrapper.get('[aria-label="Package details"]').text()).toContain(
            'Documented version 1.10',
        );
        expect(wrapper.get('[aria-label="Package details"]').text()).toContain(
            'Stable',
        );
        expect(
            wrapper
                .findAll('table')[0]
                .findAll('tbody tr')
                .map((row) => row.findAll('td').map((cell) => cell.text())),
        ).toEqual([
            [
                'quality:fix',
                'Applies changes',
                'Rector, Pint, and vp check --fix',
            ],
            [
                'quality:check',
                'Runs checks',
                'Pest, Pint in test mode, vp check, vp test, vue-tsc --noEmit, and PHPStan',
            ],
        ]);
        expect(
            wrapper
                .findAll('h2, h3')
                .map((heading) => [
                    heading.element.tagName,
                    heading.attributes('id'),
                    heading.text(),
                ]),
        ).toEqual([
            [
                'H2',
                'requirements-and-skipped-commands',
                'Requirements and skipped commands',
            ],
            ['H2', 'apply-fixes', 'Apply fixes'],
            ['H2', 'run-ci-checks', 'Run CI checks'],
            ['H3', 'github-actions', 'GitHub Actions'],
            ['H2', 'select-a-subset', 'Select a subset'],
            [
                'H2',
                'configure-workflow-commands',
                'Configure workflow commands',
            ],
            ['H2', 'pest-and-phpstan-options', 'Pest and PHPStan options'],
        ]);
        expect(
            requirements.findAll('thead th').map((cell) => cell.text()),
        ).toEqual(['Command', 'Required binary', 'Recognized configuration']);
        expect(
            requirements
                .findAll('tbody tr')
                .map((row) => row.findAll('td').map((cell) => cell.text())),
        ).toEqual([
            ['Pint', 'vendor/bin/pint', 'pint.json'],
            ['Rector', 'vendor/bin/rector', 'rector.php'],
            ['Pest', 'vendor/bin/pest', 'phpunit.xml or phpunit.xml.dist'],
            [
                'PHPStan',
                'vendor/bin/phpstan',
                'phpstan.neon, phpstan.neon.dist, or phpstan.dist.neon',
            ],
        ]);
    });

    it('preserves all ten copyable examples including workflow versions and public contract namespaces', () => {
        const wrapper = mount(Quality, { props: { page } });

        expect(wrapper.findAll('pre code').map((code) => code.text())).toEqual(
            expectedExamples,
        );
        expect(
            wrapper
                .findAll('pre code')
                .map((code) =>
                    code.classes().find((name) => name.startsWith('language-')),
                ),
        ).toEqual([
            'language-json',
            'language-bash',
            'language-bash',
            'language-yaml',
            'language-yaml',
            'language-bash',
            'language-php',
            'language-php',
            'language-php',
            'language-php',
        ]);
        expect(
            wrapper
                .findAll('button')
                .map((button) => button.attributes('aria-label')),
        ).toEqual([
            'Copy Discover frontend scripts',
            'Copy Apply automated fixes',
            'Copy Run CI checks',
            'Copy GitHub Actions quality workflow',
            'Copy Run PHP checks in CI',
            'Copy Select workflow tools',
            'Copy Configure workflow commands',
            'Copy Default workflow commands',
            'Copy Enable parallel Pest',
            'Copy Configure PHPStan memory',
        ]);
    });

    it('explains selection, requirements, skips, failures, confirmations, and supported configuration', () => {
        const wrapper = mount(Quality, { props: { page } });
        const text = wrapper.text();

        for (const phrase of [
            'All configured commands are selected by default in the interactive multi-select.',
            'A non-interactive invocation runs the complete configured list.',
            'Maintainer discovers the script by its contents rather than its name.',
            'infers pnpm, Yarn, or Bun from its lock file. It falls back to npm.',
            'When any requirement is missing, Maintainer emits a Skipped warning and continues with the next selected command.',
            'A command that starts and exits unsuccessfully still stops the workflow and returns its exit code.',
            'The default order is Rector, Pint, then the package script containing vp check --fix.',
            'defaulting to yes',
            'if at least one fixer ran and the working tree is dirty',
            'Only an explicit confirmation starts the commit workflow and its optional diff review.',
            'Non-interactive runs do not prompt for checks or offer to create a commit.',
            'configured but unavailable commands remain visible and report why they were skipped.',
            "Adapt the Node.js version and package-manager install command to the consuming project's lock file.",
            'Projects without configured frontend checks can omit the Node.js and frontend dependency steps.',
            'a successful job does not prove that a skipped tool ran.',
            'The --no-interaction option is required in CI.',
            "Direct invocations accept either the command's short name or its FQCN.",
            'Lists replace the distributed defaults instead of merging by numeric index.',
            'project configuration must not reference',
            'move RunsRectorFix::class ahead of RunsPintFix::class',
            'RunsPintFix modifies files while RunsPintCheck only verifies them.',
            'Parallel Pest execution remains opt-in',
            'PHPStan uses a 2G memory limit by default.',
            'Valid configured values include 512M, 4G, a byte count, or -1',
            'MAINTAINER_PEST_PARALLEL',
            'MAINTAINER_PHPSTAN_MEMORY_LIMIT',
        ]) {
            expect(text).toContain(phrase);
        }
    });
});

const expectedExamples = [
    String.raw`{
  "scripts": {
    "frontend-quality": "vp check",
    "frontend-tests": "vp test run",
    "types:vue": "vue-tsc --noEmit"
  }
}`,
    String.raw`vendor/bin/maintainer quality:fix`,
    String.raw`vendor/bin/maintainer quality:check --no-interaction`,
    String.raw`name: Code Quality

on:
  pull_request:
  push:

permissions:
  contents: read

jobs:
  check:
    name: Check
    runs-on: ubuntu-latest

    steps:
      - name: Check out the repository
        uses: actions/checkout@v6

      - name: Set up PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: "8.5"
          coverage: none
          tools: composer:v2

      - name: Install Composer dependencies
        run: composer install --no-interaction --no-progress --prefer-dist

      - name: Set up Node.js
        uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm

      - name: Install frontend dependencies
        run: npm ci

      - name: Run configured quality checks
        run: php vendor/bin/maintainer quality:check --no-interaction`,
    String.raw`- name: Run PHP checks
  run: php vendor/bin/maintainer quality:check --no-interaction --tool=pest --tool=pint --tool=phpstan`,
    String.raw`vendor/bin/maintainer quality:fix --tool=pint
vendor/bin/maintainer quality:check --tool=pest --tool=phpstan
vendor/bin/maintainer quality:check --tool=vite-plus-test`,
    String.raw`<?php

use ArtisanToolbox\Maintainer\Quality\Contracts\RunsPestCheck;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsPhpStanCheck;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsPintFix;

return [
    'quality' => [
        'fix' => [
            RunsPintFix::class,
        ],
        'test' => [
            RunsPestCheck::class,
            RunsPhpStanCheck::class,
        ],
    ],
];`,
    String.raw`'quality' => [
    'fix' => [
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsRectorFix::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsPintFix::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsVitePlusCheckFix::class,
    ],
    'test' => [
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsPestCheck::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsPintCheck::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsVitePlusCheck::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsVitePlusTest::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsVueTscCheck::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsPhpStanCheck::class,
    ],
],`,
    String.raw`'quality' => [
    'pest' => [
        'parallel' => true,
    ],
],`,
    String.raw`'quality' => [
    'phpstan' => [
        'memory_limit' => '4G',
    ],
],`,
];
