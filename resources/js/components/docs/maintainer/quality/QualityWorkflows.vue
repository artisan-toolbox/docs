<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const applyFixes = String.raw`vendor/bin/maintainer quality:fix`;

const runChecks = String.raw`vendor/bin/maintainer quality:check --no-interaction`;

const phpChecks = String.raw`- name: Run PHP checks
  run: php vendor/bin/maintainer quality:check --no-interaction --tool=pest --tool=pint --tool=phpstan`;

const strictPhpStan = String.raw`php vendor/bin/maintainer quality:check --no-interaction --strict --tool=phpstan`;

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
            <p>
                When you accept the CI checks and they pass, the commit confirmation leads to the
                same action menu as a direct interactive check.
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
            <p>
                In Maintainer 1.14.0 and later, when an interactive check runs at least one tool,
                succeeds, and finds Git changes, Maintainer asks whether to create a commit. After
                you confirm, choose <strong>Commit</strong>, the default, or
                <strong>Commit and release</strong>. The second option uses the normal release
                workflow after the work commit succeeds. The release workflow handles its own
                review, push, and publication checks. Select all changes you intend to release
                because release preparation requires a clean working tree.
            </p>
            <h3
                id="github-actions"
                class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                GitHub Actions
            </h3>
            <p>
                If a project already delegates checks to Maintainer, use Maintainer as the quality
                gate for those tools in GitHub Actions. Call the same configured commands locally
                and in Actions so both use the project's tool selection, configuration files, and
                package scripts.
            </p>
            <p>
                Follow the
                <DocsLink href="/docs/maintainer/ci#github-actions">GitHub Actions guide</DocsLink>
                to call the reusable workflow or add the setup action to an existing job. The guide
                also shows how to verify the run in GitHub Actions.
            </p>
            <p>
                <code>quality:check</code> returns the first executed command&#x27;s non-zero exit
                code, so GitHub Actions fails the job. By default, missing binaries or configuration
                files are reported as <code>Skipped</code>. Check the result for each tool to
                confirm it ran, or require every selected tool with <code>--strict</code>.
            </p>
            <p>
                The <code>--no-interaction</code> option is required in CI. It selects the complete
                configured <code>quality.test</code> list without opening the interactive tool
                selector. To create intentionally smaller jobs, combine it with one or more
                <code>--tool</code> options, for example:
            </p>
            <CodeExample label="Run PHP checks in CI" language="yaml" :code="phpChecks" />
            <p>
                Use <code>--strict</code> for required checks when your installed Maintainer version
                supports it. Maintainer 1.14.0 includes this option. An empty selection, missing
                binary, or missing configuration file fails the command. For a PHPStan-only job,
                enable <code>RunsPhpStanCheck</code> in <code>quality.test</code> and install and
                configure PHPStan in the consuming project. Run this command from the project root.
                It exits successfully when the configured PHPStan check runs and passes.
            </p>
            <CodeExample label="Require PHPStan in CI" language="bash" :code="strictPhpStan" />
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
