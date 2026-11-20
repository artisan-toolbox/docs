# Run package CI checks

Use this procedure when you change an Artisan Toolbox package or its workflow. Run the commands from the package checkout unless a step names a different directory.

## Run checks locally

1. Use the PHP version in `composer.json`. Run `composer install` to install the development tools. Keep a committed lockfile when the project uses one.
2. Run `php vendor/bin/maintainer quality:check --no-interaction --strict --tool=phpstan --tool=pint --tool=pest` from the package root. Use `php maintainer` in the Maintainer source checkout. Repeat `--tool` to select the checks the job needs. `composer test` delegates the PHP checks to the same CLI and runs package-specific checks such as complete source type coverage where configured.
3. For a package with frontend tooling, use a Node.js version supported by `package.json`. Run `npm ci` after Composer when the npm lock references `file:vendor/...` dependencies. Select `--tool=vite-plus-check --tool=vite-plus-test` when both tools are configured and the Maintainer CLI is installed. Node-only jobs use the equivalent npm scripts without a PHP dependency install. Run the package's build and distribution checks when it ships compiled assets.
4. Run the package-specific database, cache, or browser checks when the change affects them. Use disposable databases and services. Check the package's development guide for its required environment variables and browser engines.

Each command must return a nonzero exit code when its check fails. A type coverage result is complete only when the uncached report contains every eligible source file and meets the package threshold. Keep genuine upstream exclusions explicit. Missing tools, runtime errors, and partial reports do not count as coverage.

Set the Pest process count in `quality.pest.processes` inside `config/maintainer.php`. For a serial reproduction, set `MAINTAINER_PEST_PARALLEL=false` and rerun the same Maintainer check. The workspace keeps native Windows runs serial and uses bounded workers on Unix where the suite benefits. The Filoquent jobs that use MySQL or PostgreSQL set `MAINTAINER_PEST_PROCESSES=2` to limit concurrent database connections.

Vitest runs test files in parallel up to the worker limit in the owning Vite configuration. Keep per-file isolation for suites that register globals or mock modules. Give each worker a separate writable fixture when tests use files or services. Native backend configurations, filtered integration runs, coverage reports, dry-run Rector, and artifact verification retain their own commands.

Core, Dump to Console, Filoquent, Front Awesome, Mosaicast, Permit, and QZ Tray require Larastan `^3.12.1` for development. That Larastan release requires PHPStan `^2.2.14`, which includes the Windows Turbo parser fix. Filoquent, Front Awesome, and Permit also require Pest Type Coverage `^5.1.1`. This release requires PHPStan `^2.3.5` and uses the collected-data API available in PHPStan 2.3.6 and later.

For the documentation application, use `composer ci:assets` to build and verify search, then use `composer ci:check` for the quality checks. See [documentation quality checks](quality.md#run-the-complete-ci-gate) for the licensed registry and browser prerequisites.

## Maintain the Actions workflow

Core, Dapter, Dump to Console, Filoquent, Front Awesome, Mosaicast, Permit, QZ Tray, and the documentation application call the root `artisan-toolbox/maintainer` action pinned to the 1.14.3 release commit. Composer resolves the CLI independently of the action revision. Filoquent's local setup action selects the PHP extensions for each service and runs Testbench discovery. Front Awesome's local setup action reads the Node.js version from `.nvmrc` and passes the coverage driver to Maintainer. Its PHP compatibility jobs use `npm-install: 'false'` so the translation exporter can invoke Node.js without an npm install. The documentation job also installs npm separately so only that step receives the licensed registry token.

Dapter's compatibility job uses `composer-mode: none` to provision the tools and validate the manifest before it checks the Git archive. The job resolves Composer dependencies only after that check succeeds. In jobs that install npm dependencies separately, run npm after Composer and keep any package-specific prerequisite checks before `npm ci`.

- For new jobs that run only Maintainer checks, use the [reusable Maintainer CI workflow](https://atb.dev.br/docs/maintainer/ci#github-actions) when a compatible Git revision is available. Use the [setup action](https://atb.dev.br/docs/maintainer/ci#custom-ci-jobs) within an existing job when it owns services, required check names, private registry installation, or extra checks.
- When a package delegates a check to Maintainer, use the same Maintainer command for that check locally and in Actions. Run it non-interactively in Actions and use `--strict` for required tools when the installed version supports it. Preserve dedicated steps for checks outside Maintainer's configuration.
- Keep `tests.yml` and the names of checks used by branch protection or the release workflow stable. Run tests on pull requests and the package's maintained branches. Allow a manual run for debugging. Cancel superseded runs within a pull request. Allow pushes for different commits to finish independently so Maintainer can verify the exact prepared release commit.
- Set `contents: read`, pin third-party Actions to verified full commit SHAs, and disable `persist-credentials` for test checkouts. Keep credentials out of caches and logs. Keep secrets scoped to the step that needs them. See [GitHub's Actions security guidance](https://docs.github.com/en/actions/reference/security/secure-use).
- Use explicit runner images and job timeouts. Keep `fail-fast: false` for compatibility matrices so a failed lane does not hide results from another platform or dependency resolution.
- Use separate steps or `shell: bash` for consecutive commands in a Windows job. Each failure must stop the step, even when a later command would succeed.
- For compatibility jobs, resolve the package's declared constraints with `--prefer-lowest` and `--prefer-stable`. Keep the PHP and Laravel versions aligned with the supported matrix. Use a committed lock for the reproducibility job when one exists. Names in job logs should identify the tested runtime and dependency resolution.
- Cache downloaded public archives with keys tied to the manifest or lock and the relevant runtime. Resolve dependencies afresh in compatibility lanes. Keep installed trees, private packages, and credentials out of shared caches. Keep PHP-only lanes independent of npm when no PHP check consumes frontend assets.
- Keep quality, native-service, browser, and distribution checks in the workflow. Run independent PHP and frontend matrices separately when that avoids reinstalling the same frontend dependencies. Reuse the locked frontend suite across PHP dependency lanes only when its input is independent of their Composer resolution.

## Verify a workflow change

1. Run `actionlint` from the package checkout. In the shared workspace, run `npm run ci:lint-workspace` from `docs` to lint every sibling repository with a workflow.
2. Run the commands that changed locally. When the setup changes, install from a clean fixture and check what the next step can use. For a frontend job that consumes `file:vendor/...` dependencies, confirm that npm resolves and can import the package installed by Composer. Check the failure path when your change affects exit codes.
3. Inspect the GitHub Actions run for the changed commit. Confirm the affected jobs ran on the intended runners and that required check names still match branch protection. For a cache change, compare two successful runs on the same branch with the same inputs and lockfiles. Confirm that the later run restores the cache and still runs dependency installation. Local lint and command tests cover syntax and command behavior. GitHub runs verify runner setup, cache restore, and event behavior.

When changing the Maintainer helpers, use the `Tests` workflow in the Maintainer repository. Its Ubuntu and Windows jobs call the setup action from the checked-out commit. See the [Maintainer source development guide](https://atb.dev.br/docs/maintainer/development#test-the-ci-helpers) to also exercise the reusable workflow in a manual run.
