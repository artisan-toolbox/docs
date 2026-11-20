<script setup>
import { computed } from 'vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const props = defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const qualityHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/ci/quality').href,
);

const reusableWorkflow = `name: tests
on:
  push:
    branches: ['1.x']
  pull_request:
  workflow_dispatch:
permissions:
  contents: read
jobs:
  quality:
    uses: artisan-toolbox/maintainer/.github/workflows/ci.yml@MAINTAINER_COMMIT_SHA`;

const customWorkflow = `name: tests
on:
  push:
    branches: ['1.x']
  pull_request:
permissions:
  contents: read
jobs:
  tests:
    name: Pest (\${{ matrix.resolution }})
    runs-on: ubuntu-24.04
    timeout-minutes: 25
    strategy:
      fail-fast: false
      matrix:
        resolution: [prefer-lowest, prefer-stable]
    services:
      redis:
        image: redis:7-alpine
        ports: ['6379:6379']
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
      - uses: artisan-toolbox/maintainer@MAINTAINER_COMMIT_SHA
        with:
          php-extensions: pdo_sqlite, redis
          composer-mode: \${{ matrix.resolution }}
      - run: php vendor/bin/maintainer quality:check --no-interaction --strict --tool=pest
        env:
          REDIS_HOST: 127.0.0.1
          REDIS_PORT: '6379'`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />

        <ProseSection>
            <p>
                The Code Quality group separates commands that modify files from checks intended for
                continuous integration. Open
                <strong>Code Quality</strong> from the interactive menu, choose
                <strong>Fix</strong> or <strong>CI Check</strong>, and then select from the commands
                configured for that workflow.
            </p>
            <ul>
                <li>
                    <DocsLink :href="qualityHref">Fixes and CI checks</DocsLink>: install,
                    configure, select, and run the supported tools.
                </li>
            </ul>
            <p>
                Maintainer always runs the consuming project's binaries, configuration files, and
                package scripts. Dependencies bundled inside the Maintainer PHAR are isolated and
                are never used to analyze or modify the consuming project.
            </p>
        </ProseSection>

        <ProseSection id="run-a-workflow" title="Run a workflow">
            <p>Run the configured CI checks:</p>
            <CodeExample label="Run CI checks" code="vendor/bin/maintainer quality:check" />
            <p>Run the configured fixes:</p>
            <CodeExample label="Run automated fixes" code="vendor/bin/maintainer quality:fix" />
            <p>
                The
                <DocsLink :href="qualityHref">Fixes and CI checks guide</DocsLink>
                covers tool requirements, configuration, selection, and workflow behavior.
            </p>
        </ProseSection>

        <ProseSection id="github-actions" title="Run checks on GitHub Actions">
            <p>
                Maintainer 1.14.2 introduced the root CI action for GitHub.com. Start with a GitHub
                repository that has a Composer project, a configured Maintainer quality check, and
                an installed Maintainer CLI that lists <code>--strict</code> in
                <code>quality:check --help</code>. The Composer version of the CLI and the Git
                revision of the helper are independent.
            </p>
            <p>
                Save this example as <code>.github/workflows/tests.yml</code> in the consuming
                repository. Replace <code>MAINTAINER_COMMIT_SHA</code> with the full SHA of a
                Maintainer commit that contains <code>action.yml</code> at the repository root.
                Change <code>1.x</code> to your maintained branch if needed.
            </p>
            <CodeExample
                label="Call the Maintainer CI workflow"
                language="yaml"
                :code="reusableWorkflow" />
            <p>
                The <strong>Check quality</strong> job installs PHP 8.5 and Composer dependencies,
                then runs the configured checks in strict mode. A failed check or an unavailable
                required tool fails the job. When a lockfile is present, Composer installs its
                recorded versions. To install Node.js and run <code>npm ci</code> after Composer,
                set <code>node-version: '24'</code> in the calling job's <code>with</code> block.
            </p>
            <p>
                Set <code>runner</code>, <code>timeout-minutes</code>,
                <code>working-directory</code>, <code>php-version</code>, or
                <code>php-extensions</code> to adjust the job. The job runs on
                <code>ubuntu-24.04</code> with a 25-minute timeout by default. Use
                <code>quality-tool</code> to select one configured tool or
                <code>maintainer-entrypoint</code> to specify a different PHP entry point relative
                to the project directory. The default is <code>vendor/bin/maintainer</code>.
            </p>
        </ProseSection>

        <ProseSection id="custom-ci-jobs" title="Add setup to an existing job">
            <p>
                Replace <code>MAINTAINER_COMMIT_SHA</code> with the full SHA of a Maintainer commit
                that contains <code>action.yml</code> at the repository root.
            </p>
            <p>
                Call the setup action after checkout to keep your existing job names, matrices,
                services, and project steps. This example runs a configured Pest suite with Redis
                under two Composer dependency resolutions. Each matrix entry must install its own
                dependencies and pass its own check.
            </p>
            <CodeExample
                label="Set up a Composer compatibility matrix"
                language="yaml"
                :code="customWorkflow" />
            <ul>
                <li>
                    Set <code>composer-mode</code> to <code>install</code> (default),
                    <code>prefer-lowest</code>, <code>prefer-stable</code>, or <code>none</code>.
                    <code>prefer-lowest</code> also prefers stable dependencies. Use
                    <code>none</code> to run your own Composer commands after setup.
                </li>
                <li>
                    Set <code>composer-version</code> to change the Composer version from
                    <code>v2</code>. Set <code>composer-validation</code> to <code>strict</code>,
                    <code>no-check-publish</code>, or <code>no-check-lock</code> to validate before
                    installing. Validation defaults to <code>none</code>.
                </li>
                <li>
                    Set <code>php-version</code>, <code>php-extensions</code>,
                    <code>php-ini-values</code>, or <code>php-coverage</code> for the tools your job
                    requires. Set <code>working-directory</code> for a Composer project in a
                    subdirectory.
                </li>
                <li>
                    Set <code>composer-scripts: 'false'</code> or
                    <code>npm-scripts: 'false'</code> to suppress install scripts for that package
                    manager. With <code>node-version</code> set, use
                    <code>npm-install: 'false'</code>
                    to set up Node.js and keep control of the npm installation. If you install
                    Composer yourself, install it before running npm when the project uses
                    <code>file:vendor/...</code> dependencies.
                </li>
            </ul>
        </ProseSection>

        <ProseSection id="dependency-caches" title="Configure download caches">
            <p>
                Both helpers cache Composer download archives by default. The key includes the
                runner platform, PHP version, Composer mode, and dependency file contents. Composer
                still installs dependencies on a cache hit. Set <code>composer-cache</code> to
                <code>false</code> when installing private or licensed Composer packages.
            </p>
            <p>
                npm download caching defaults to off. Enable <code>npm-cache</code> for public npm
                dependencies. For a private registry, keep caching off and scope the registry token
                to your own installation step. Pass cache switches as YAML booleans to the workflow
                and as quoted strings to the setup action.
            </p>
        </ProseSection>

        <ProseSection id="verify-ci-run" title="Verify a CI run">
            <ol class="flex list-decimal flex-col gap-3 pl-5">
                <li>
                    Run <code>actionlint</code> from the consuming repository and run the same
                    <code>quality:check</code> command locally with the project's selected tools.
                </li>
                <li>
                    In GitHub Actions, open the run for your change. If you use the reusable
                    workflow, expand <strong>Check quality</strong>. Confirm the runner and
                    dependency versions, then check the log for every tool you expect to run.
                </li>
                <li>
                    After a cache change, run the workflow again on the same branch with the same
                    lockfiles and inputs. Confirm the cache is restored and dependency installation
                    still runs.
                </li>
            </ol>
            <p>
                To start a run yourself, the workflow must include <code>workflow_dispatch</code>
                on the default branch, and you need write access to the repository. In the
                <strong>Actions</strong> tab, select the workflow, choose
                <strong>Run workflow</strong>, and select the branch with your change.
            </p>
        </ProseSection>
    </article>
</template>
