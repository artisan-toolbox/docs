<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const applyFixes = String.raw`vendor/bin/maintainer quality:fix`;

const runChecks = String.raw`vendor/bin/maintainer quality:check --no-interaction`;

const githubWorkflow = String.raw`name: Code Quality

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
        run: php vendor/bin/maintainer quality:check --no-interaction`;

const phpChecks = String.raw`- name: Run PHP checks
  run: php vendor/bin/maintainer quality:check --no-interaction --tool=pest --tool=pint --tool=phpstan`;

const selectedTools = String.raw`vendor/bin/maintainer quality:fix --tool=pint
vendor/bin/maintainer quality:check --tool=pest --tool=phpstan
vendor/bin/maintainer quality:check --tool=vite-plus-test`;
</script>

<template>
    <div class="flex min-w-0 flex-col gap-10">
        <ProseSection id="apply-fixes" title="Apply fixes">
            <CodeExample label="Apply automated fixes" language="bash" :code="applyFixes" />
            <p>
                The default order is Rector, Pint, then the package script containing
                <code>vp check --fix</code>. After every successful interactive fix workflow,
                Maintainer offers to run the complete configured
                <code>quality:check</code> workflow, defaulting to yes. When the checks succeed or
                are declined, Maintainer asks whether to commit the resulting changes if at least
                one fixer ran and the working tree is dirty. Only an explicit confirmation starts
                the commit workflow and its optional diff review. Non-interactive runs do not prompt
                for checks or offer to create a commit.
            </p>
        </ProseSection>
        <ProseSection id="run-ci-checks" title="Run CI checks">
            <CodeExample label="Run CI checks" language="bash" :code="runChecks" />
            <p>
                The default order is Pest, Pint test, the package scripts containing
                <code>vp check</code>, <code>vp test</code>, and <code>vue-tsc --noEmit</code>, then
                PHPStan. The check workflow never modifies the selection based on availability:
                configured but unavailable commands remain visible and report why they were skipped.
            </p>
            <h3
                id="github-actions"
                class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                GitHub Actions
            </h3>
            <p>
                Use one non-interactive Maintainer invocation as the job&#x27;s quality gate. In
                consuming projects, Composer installs Maintainer under <code>vendor/bin</code>;
                there is no project-root <code>maintainer</code> executable. Invoke it as
                <code>php vendor/bin/maintainer</code>, after installing every PHP and frontend
                dependency required by the configured checks:
            </p>
            <CodeExample
                label="GitHub Actions quality workflow"
                language="yaml"
                :code="githubWorkflow" />
            <p>
                Adapt the Node.js version and package-manager install command to the consuming
                project&#x27;s lock file. Projects without configured frontend checks can omit the
                Node.js and frontend dependency steps.
            </p>
            <p>
                <code>quality:check</code> returns the first executed command&#x27;s non-zero exit
                code, so GitHub Actions fails the job naturally. Missing binaries or configuration
                files are reported as <code>Skipped</code> and do not fail the workflow.
                Consequently, the job must install every dependency and retain every configuration
                file that CI is expected to enforce; a successful job does not prove that a skipped
                tool ran.
            </p>
            <p>
                The <code>--no-interaction</code> option is required in CI. It selects the complete
                configured <code>quality.test</code> list without opening the interactive tool
                selector. To create intentionally smaller jobs, combine it with one or more
                <code>--tool</code> options, for example:
            </p>
            <CodeExample label="Run PHP checks in CI" language="yaml" :code="phpChecks" />
        </ProseSection>
        <ProseSection id="select-a-subset" title="Select a subset">
            <p>
                Pass <code>--tool</code> once or repeat it. Tool names are scoped to their workflow:
            </p>
            <CodeExample label="Select workflow tools" language="bash" :code="selectedTools" />
            <p>
                The interactive menu uses the configured FQCN values internally. Direct invocations
                accept either the command&#x27;s short name or its FQCN.
            </p>
        </ProseSection>
    </div>
</template>
