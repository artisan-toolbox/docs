# Run project quality checks

The application installs Maintainer, Rector, Laravel Rector rules, Pest, Pint, and Larastan/PHPStan as Composer development dependencies.
The application requires PHP 8.5 in production, development, and CI. Its installed Front Awesome, Core, and Mosaicast dependencies require that version, as does Maintainer's development tooling.
Frontend checks use the existing Vite Plus and Vue tooling.

Dated verification entries preserve the results observed during each task. The [current dependency and consistency verification](#documentation-consistency-and-test-dependencies-on-2026-11-11) supersedes their earlier installation blockers and audit findings.

Formatting is configured in `vite.config.ts` under `fmt`: 100-column lines, four-space indentation, single quotes, semicolons, and closing brackets on the last attribute line. Attributes may share a line, and HTML whitespace sensitivity follows CSS display rules. The formatter excludes `.github/**`, `composer.json`, `resources/js/components/ui/*`, `resources/views/mail/*`, and `resources/js/ziggy.js`.
Tailwind class sorting covers `clsx`, `cn`, and `cva` and reads `resources/css/app.css` through `sortTailwindcss.stylesheet`, the option supported by the installed formatter.
From the documentation checkout, run `npx vp fmt vite.config.ts --check` to check the configuration file, or `npm run check` to check the project without rewriting files.

## Check shared agent standards

Run `npm run standards:check` from the documentation checkout. This dependency-free check verifies the selected standards version, source fingerprint, installed skills, and standalone checker.
GitHub Actions runs it after Node setup and before dependency installation.
The regular frontend tests cover the synchronizer's observable behavior and failure cases.
See [shared agent standards](agent-standards.md) for installation and version updates. Other adopting projects can run `node .ai/sync.mjs --check` in standalone CI.

## Verify public contact metadata

The public contact address is `contact@atb.dev.br` and the canonical publication origin is `https://atb.dev.br`.
From the documentation checkout, run `node scripts/update-public-contacts.mjs --check` to find stale public references across the workspace. Check mode is the default and does not write files; use `--write` only to apply the documented replacements.
The command preserves URL paths, dependency versions, transactional sender addresses, and authentication fixtures. It excludes live environments, secret and credential paths, dependencies, caches, generated artifacts, and Git metadata.
The existing frontend test suite verifies read-only checking, repeated execution, protected paths, and NGINX template collision handling. Package metadata tests and real README synchronization validate the generated headers separately.

See [staff access](access.md) for email-code login, mail delivery requirements, SQLite sessions, and protected log viewing.

## Work on the documentation branch

Use `1.x` for documentation changes and track `origin/1.x` in your local checkout.
GitHub source links use the same branch.
The tests workflow runs on pushes to `1.x` and on pull requests.

### Filoquent workspace maintenance

Filoquent uses `1.x` as its default development branch. Local checkouts track `origin/1.x`, the tests workflow covers version branches and pull requests, and release changelog updates and README status badges target `1.x`.

In the shared PhpStorm workspace, `.idea/workspace.xml` registers `filoquent/composer.json` in `ComposerConfigs`. Keep its PSR-4 source and test roots in `.idea/ArtisanToolbox.iml` aligned with the package manifest, including the workbench namespaces. Installed vendor packages belong in the PHP include paths in `.idea/php.xml` and `.idea/workspace.xml`, with matching module exclusions so dependencies remain library code. Reload changed files from disk after updating these local IDE settings.

This maintenance changes repository and IDE configuration. It does not establish a released file-storage API or change consumer installation instructions.

Verification on November 12, 2026 confirmed that GitHub exposes only `1.x` and uses it as the default branch. The local checkout tracks `origin/1.x`. Workflow parsing checks, five PSR-4 mappings, installed vendor paths, and PhpStorm inspections passed. The complete package suite passed PHPStan, Pint, type coverage, and eight tests with eleven assertions, using Herd's PHP 8.5. Consumer skill guidance required no change because the package API and installation steps were unchanged.

The documentation dependency refresh attempted a compatible Composer dry run before the npm check. Offline resolution lacked cached Packagist metadata and npm metadata for `@inertiajs/vite`. No documentation dependencies or lockfiles changed. This contributor-only update does not change package guides, application components, rendered content, or search entries.

## Install dependencies

Run Composer before npm:

```bash
composer install
npm ci
```

Use Node.js 24.11 or newer. CI uses Node.js 24 to match Front Awesome's declared engine requirement.

Before activating a release, run `php artisan docs:search:index --no-interaction` and its `--check` mode after the frontend dependencies are available. GitHub Actions builds and checks the same release-local index. See [search maintenance](search.md) for content authoring, deployment order, SQLite FTS5 requirements, and failure recovery.

### Prepare standalone installation

The root manifest declares public package ranges and no local repositories. The release lock uses remote distributions for all six Artisan Toolbox packages. Development routing can nevertheless write absolute `dist.type=path` entries during a later update. Such a lock requires the developer's workspace and cannot be distributed as a standalone installation.

Keep local routing and aliases available for development. Do not replace their version numbers merely to obtain a visual label. A release lock must resolve actual package archives or remote source revisions and must be verified independently of that routing. Never copy package internals into the application or bundle a second vendor tree to conceal missing public exports.

Before Composer installation in CI, `php scripts/check-distribution.php` checks the lock without loading the framework or installed dependencies. The same check is available as `composer distribution:check`. It rejects local paths in both runtime and development packages with package-name diagnostics, without printing repository URLs. It deliberately accepts development branches and any version number when the location is remote. It never edits the lock. The ordinary local quality suite remains available when intentionally working with a development lock; the distribution check is a separate release gate.

To prepare a portable lock:

1. Create an isolated checkout or temporary source copy without private environment files, installed dependencies, or sibling package directories.
2. Use a separate `COMPOSER_HOME` so development routing does not affect resolution. Keep the global configuration unchanged.
3. Resolve the application's declared dependencies through their public distributions. Front Awesome uses the explicitly approved `^1.0.0-alpha.2@dev` preview range while no stable release is available; keep the project-wide stability policy unchanged. The resulting lock pins its actual remote commit. The QZ Tray minimum is `^1.4.0` because the application uses its receipt writer and document preparation APIs.
4. Run the distribution check and install Composer dependencies normally. If Composer changed a frontend package version, rerun its documented `npm install` command with all required `./vendor/` paths together and retain the updated npm lock. Then run `npm ci` against the Composer-delivered frontend directories.
5. Run the real quality suite, production build, and search indexing checks. Inspect the actual installed exports. A remote URL and a successful dependency installation do not establish that the application can build.
6. Only after those checks pass, integrate the verified manifest and lock changes into the application. Retain one release lock, not a parallel production manifest or lock file.

The 2026-11-06 release candidate resolved public archives for Core `1.2.1`, Dump to Console `1.1.1`, Maintainer `1.11.0`, Mosaicast `1.2.1`, QZ Tray `1.3.0`, and Front Awesome `1.0.0-alpha.1`. The Front Awesome archive at commit `a55e06f` supplied the consumed `./vite`, `./tailwind.css`, and `./web-awesome-tailwind` exports and its consumer skill. That candidate permitted `^1.0@dev` for Front Awesome only, with project-wide minimum stability set to `stable`. Composer installation, paired vendor-path npm installation, fresh `npm ci`, the complete quality gate, production build, and search indexing passed in an isolated consumer without sibling packages or private credentials. All six Maintainer checks ran with none skipped. Those locks were the initial release locks. See the current verification below for their replacements; local Composer routing remains unchanged.

All six documented packages are explicit Composer dependencies. Web Awesome Core `3.14.0` is the selected styling dependency; this check does not establish Pro adapter compatibility. Package publication is a separate operator-approved action.

### Refresh dependencies before authoring

Attempt compatible updates of Artisan Toolbox packages, Laravel, Inertia, Laravel Head, Pest, and the frontend runtime and test tools before editing their documentation. Run Composer before refreshing the `file:vendor/` frontend copies. Record changed versions or why no update was possible. Do not force a major upgrade, rewrite a lock reference, or label a local branch as a stable release to make an update succeed.

The 2026-11-06 refresh checked the declared Laravel, Inertia, Head, Pest, Vue, Tailwind, and Vue test-tool ranges; they were already current within those ranges. The same change installed Horizon `5.50.1`, Reverb `1.12.0`, and the remaining documented packages. Reverb's supported dependency range required Composer to resolve Guzzle PSR-7 `2.x` instead of the previously locked `3.x`; no dependency constraint was bypassed.

The 2026-11-06 npm audit reported five moderate entries in the development-only Vue test utility dependency chain. The offered repair fell outside the declared test-tool range. That task applied no forced upgrade, transitive major override, or disabled audit. Its production-only audit reported no advisories. The current verification below records the later repair and zero-advisory result.

See [Mosaicast demos](mosaicast-demos.md) for the running comparison and [queues](queues.md) for the Horizon worker requirements. Installing the packages does not start Redis, Reverb, or Horizon.

### Front Awesome test toolchain verification on 2026-11-11

Front Awesome's source checkout pins Vite Plus and its Vite core alias to `1.6.0`, with bundled Vitest `5.1.0` and matching Playwright and V8 coverage adapters. The previous Vitest `4.1.11` override caused a `cacheDir` startup failure after a forced audit update. Removing that override and aligning the toolchain restores the same test command. Legacy browser-context imports now use `vite-plus/test/browser`, and generators use the public `vite-plus/fmt` export instead of an undeclared transitive formatter. Core scenarios were regenerated, and two existing Pro fixtures were reformatted with that formatter without changing their scenarios.

A clean `npm ci` and a separate `npm audit --json` report zero vulnerabilities and no conflicting peers. The checkout explicitly denies unnecessary `fsevents` install scripts. The inspected `2.3.3` archive contains its native macOS binary, and a real file-change event succeeds after installation with scripts denied. npm still reports the upstream `node-domexception` deprecation. `npm run check`, the consumer build, and the base and PrimeVue browser theme checks pass. The theme inventory records the already-resolved Tailwind `4.3.5` after those checks. Combined Node and Chromium coverage passes 552 tests, with 91.82% statement, 88.46% branch, 90.35% function, and 93.02% line coverage. Two existing Pro tests remain skipped because the licensed package is unavailable. `composer test` passes PHPStan, Pint, 100% PHP type coverage, and 188 PHP tests.

The 304 Node tests also pass on Node `24.11.0`, the package's minimum declared runtime, using Vitest `5.1.0`. `php vendor/bin/maintainer quality:check --no-interaction` completes all six configured checks with none skipped. The full coverage run uses the local Node `26.5.0` runtime and Chromium `156.0.8078.47`. Local commands select the working Herd PHP 8.5 executable because the default Homebrew PHP is missing `libtidy`.

The beginner path remains an existing Laravel application with Inertia, Vue, and Vite, followed by requirements, Composer installation, vendor-file npm installation, the public Vite plugin, and styles. The Installation example defines a public Button, a Laravel route, and the expected `Hello from Front Awesome` result, then links to Web Awesome setup. The overview's first toast requires the Vue plugin and an active web session. The installation route, ordered navigation, examples, and guide links pass their content tests. Shared `ProseSection`, `CodeExample`, and `DocsLink` components own the contributor guide's presentation. No package runtime API changed, so the concise README and consumer skill require no edit. This source-tooling update does not describe a new public release.

Dependency refresh attempts ran Composer before npm. From the documentation root, `composer update 'artisan-toolbox/*' laravel/framework inertiajs/inertia-laravel laravel/head 'pestphp/*' --with-all-dependencies --dry-run --no-scripts --no-interaction --no-progress` proposes only QZ Tray `1.3.0` to `1.4.0` and reports no advisories. That unrelated update was not applied. Composer continues to report abandoned `symplify/rule-doc-generator-contracts`. `npm outdated vue '@inertiajs/vue3' '@inertiajs/vite' tailwindcss vite-plus '@vue/test-utils' happy-dom --json` finds the declared direct ranges current, including this application's separate exact Vite Plus `1.4.0` pin. `npm install --dry-run --ignore-scripts ./vendor/artisan-toolbox/front-awesome ./vendor/artisan-toolbox/mosaicast ./vendor/artisan-toolbox/qztray` proposes only removal of an unused `@emnapi/runtime` copy. Initial sandbox requests failed DNS resolution; registry-backed retries succeeded. No documentation dependency files were changed by this task, and existing work was preserved. All 670 documentation frontend tests, formatting, lint, the production build, and search indexing with its freshness check pass.

### Front Awesome minimum Laravel verification on 2026-11-11

The updated source preview requires `illuminate/translation:^13.36`, which makes Laravel `13.36.0` the minimum full-framework version. Earlier Laravel 13 releases renumber numeric JSON translation keys through `array_merge()`. Laravel [13.36.0](https://github.com/laravel/framework/releases/tag/v13.36.0) preserves those keys. A disposable Laravel `13.30.0` setup reproduces the original test failure and exports `123` as `0` and `0` as `1`. The unchanged regression passes on `13.36.0`. Applications on Laravel 13.0 through 13.35 must update within Laravel 13.x before upgrading this source preview. This approved compatibility change belongs in the next preview release; no release was published.

The isolated Composer setup uses a clean Composer home, public dependency archives, the current package manifest, and the same `laravel/framework:13.*`, Testbench `11.*`, and `composer update --prefer-lowest --prefer-dist --no-interaction --no-progress --no-scripts` constraints as CI. It resolves Laravel `13.36.0` and Carbon `3.8.4`. `composer test` passes PHPStan, Pint, 100% PHP type coverage, and all 188 PHP tests with 582 assertions. A PHPStan stub supplies the `@param-closure-this static` contract omitted by old Carbon versions and already present in current Carbon. It ignores no errors and changes no macro behavior. PHP diagnostics go to stderr in the disposable setup so the old Symfony Translation deprecation cannot corrupt subprocess JSON. Error reporting remains enabled. The numeric regression and CI workflow are unchanged.

The main checkout remains on Laravel `13.42.0`. Its complete PHP suite and all six Maintainer checks pass, with no Maintainer checks skipped. The managed README badge is regenerated from `FrontAwesome::readmeHead()`. The README, consumer skill, shared requirements, localization prerequisites, and both changelogs describe the new minimum and upgrade path. The beginner path remains an existing compatible Laravel, Inertia, Vue, and Vite application, Composer before vendor-file npm installation, then the public Button example and Web Awesome setup. Existing examples and shared presentation remain unchanged. Documentation verification passes 43 relevant PHP tests, including the updated requirements assertion, all 670 frontend tests, formatting, lint, production build, and search indexing with its freshness check.

The Composer source archive contains the exact updated consumer skill and dependency constraint. A separate consumer installs that archive as the explicitly unpublished `dev-minimum-check` version with Laravel `13.36.0` and Boost `2.10.4` as a development dependency. Boost discovers `front-awesome-development` from the installed vendor directory, and its contents match the owning source, including the `^13.36` prerequisite. Manual request review selects this skill for exporting Laravel translations through Front Awesome and excludes an unrelated database-index task. Generated skill copies in the shared application are not edited.

The documentation dependency refresh again runs Composer before npm. The Composer dry run proposes only QZ Tray `1.3.0` to `1.4.0` and reports no advisories; that unrelated application update is not applied. Composer still reports abandoned `symplify/rule-doc-generator-contracts`. The npm range check finds the direct dependencies current, including the separate exact Vite Plus `1.4.0` pin. Refreshing the three vendor frontend entries in dry-run mode proposes only removal of unused `@emnapi/runtime`. No documentation manifest or lock changes belong to this minimum-version update. Existing unrelated edits remain intact.

### Front Awesome exporter shutdown verification on 2026-11-11

The Windows CI failure occurs while deleting a translation fixture after Vite shutdown. Cancelling `execFile()` rejects its promise before the exporter process has necessarily closed. The plugin now waits for the child's native `close` event, cancels pending work, removes its watcher listener, and awaits the export loop. Its `closeBundle` hook returns that shutdown promise to Vite. The fix keeps process-resource ownership in the plugin and preserves the original error when invalid executable arguments create no child.

A real controlled exporter reproduces the premature return in an isolated copy of the previous runtime. Its process is still alive when `server.close()` resolves. The unchanged regression passes with the fix and verifies that intentional cancellation sends no translation error. All seven translation integration tests pass on Node `24.11.0` and the local Node `26.5.0` runtime. The complete Maintainer gate passes 188 PHP tests, 306 frontend tests, formatting, lint, Vue types, and PHPStan, with six checks run and none skipped. The consumer build passes. Validation runs locally on macOS; the actual Windows Actions job still needs to confirm its filesystem cleanup.

The central guide and package consumer skill explain awaiting `server.close()` before deleting a programmatic server's working directory. The Composer source archive includes the exact runtime and updated skill. An isolated Laravel `13.36.0` consumer installs the explicitly unpublished `dev-shutdown-final` archive, and Boost `2.10.4` discovers the skill from its vendor directory. Installed runtime and skill bytes match the owning source. Manual request review selects the skill for Front Awesome translation-server shutdown and excludes an unrelated database-index task. No shared generated skill copies are edited.

The beginner path remains Laravel 13.36 or later within 13.x with Inertia, Vue, and Vite, Composer before vendor-file npm installation, the public Button example with its expected `Hello from Front Awesome` result, and Web Awesome setup. The installation route, prerequisites, navigation order, and example remain unchanged. Existing shared prose components own presentation. All 670 documentation frontend tests, 12 relevant PHP journey and localization tests, formatting, lint, production build, and search indexing with its freshness check pass.

The documentation refresh again runs Composer before npm. The Composer dry run proposes Front Awesome `1.x-dev` from `89b282a` to `0251a5f` and QZ Tray `1.3.0` to `1.4.0`, with no security advisories. Those archive updates do not include this uncommitted shutdown fix and remain part of the existing application dependency work. Composer still reports abandoned `symplify/rule-doc-generator-contracts`. The npm range check finds the declared direct ranges current, including the separate Vite Plus `1.4.0` pin. The vendor-copy installation dry run proposes only removing unused `@emnapi/runtime`. No dependency manifests or lockfiles are changed by this shutdown task, and existing unrelated edits are preserved.

### Front Awesome registered-command analysis verification on 2026-11-11

The next Windows stable job passes all 306 frontend tests, including exporter shutdown, then reports four PHPStan errors in translation option validation. Reviewing all four jobs in [Actions run 43089255868](https://github.com/artisan-toolbox/front-awesome/actions/runs/43089255868) shows Ubuntu lowest passing, Ubuntu stable passing quality and type coverage before cancellation during browser installation, and Windows lowest cancelled during frontend tests. The old fail-fast policy hid the remaining results. CI now lets every matrix job finish.

Local PHPStan and Larastan versions already match the failing job. The difference is command discovery: local analysis does not initially load the package commands. Registering `FrontAwesomeServiceProvider` during PHPStan bootstrap reproduces the same four errors before the fix and keeps that analysis active on every platform. The command reads the underlying Symfony input before validating it. Laravel's normal option accessor delegates to that same input, but Larastan narrows registered CLI options to strings or null. Programmatic `ArrayInput` calls can still supply booleans, arrays, or numbers. Six real Artisan tests preserve rejection messages and both generated artifacts for those values. No analyzer checks are disabled, and public command names, options, defaults, and failure messages remain unchanged.

Clean disposable installations replicate the workflow's production Framework requirement, Testbench constraint, dependency resolution, and package discovery. Both the lowest set with Laravel `13.36.0` and the stable set with Laravel `13.42.0`, PHPStan `2.3.5`, and Larastan `3.15.0` pass `composer test`: zero analysis errors, Pint, 100% PHP type coverage, and 194 PHP tests. The local Maintainer gate passes all six checks with none skipped. Combined Node and Chromium coverage passes 554 tests, with two existing licensed Pro tests skipped, 91.85% statement, 88.42% branch, 90.36% function, and 93.05% line coverage. Base and PrimeVue production theme consumers and the package build pass. These local checks cover the browser and build stages cancelled in Actions; the updated native Windows job still requires a new run.

The contributor guide documents consistent service-provider bootstrap and complete matrix results. The reference documents nullable string options and programmatic validation. The consumer skill and concise README need no edit because supported usage, requirements, and recovery procedures are unchanged. The existing Laravel, Inertia, Vue, Composer-before-npm, public Button, expected result, and next-guide beginner path remains intact. Shared prose components and registered navigation remain the owners. Documentation passes 670 frontend tests, 12 relevant PHP tests, formatting, lint, build, and search indexing with its freshness check.

The documentation refresh runs Composer before npm. Its Composer dry run proposes the already-published Front Awesome source preview from `89b282a` to `722fb60` and QZ Tray `1.3.0` to `1.4.0`, with no security advisories; it still reports abandoned `symplify/rule-doc-generator-contracts`. These existing application dependency changes are not mixed into the command-analysis fix. The npm check finds the direct declared ranges current, including Vite Plus `1.4.0`; the vendor-copy dry run proposes only removing unused `@emnapi/runtime`. Existing manifests, lock edits, and unrelated work remain preserved.

### Front Awesome headless clipboard verification on 2026-11-11

[Actions run 43092296728](https://github.com/artisan-toolbox/front-awesome/actions/runs/43092296728) confirms both Windows dependency lanes and Ubuntu lowest pass. Ubuntu stable passes package quality, PHP type coverage, theme consumers, and PHP execution coverage, then fails one of 556 frontend cases. The copy-button success event never arrives because the Chromium headless test context has no explicit clipboard permissions. The unchanged test reproduces the same failure locally with Playwright's bundled Chromium headless shell, rather than the system Chromium used for earlier checks.

The Playwright provider now grants `clipboard-read` and `clipboard-write` through `contextOptions`. All 22 upstream interaction tests pass in headless shell. The success test retains the trusted click, emitted value, and success-state assertions, and also reads the real clipboard to verify its contents. The existing missing-source error test remains active. This uses the supported [Vitest Playwright context configuration](https://vitest.dev/config/browser/playwright#contextoptions) and [Playwright permissions API](https://playwright.dev/docs/api/class-browsercontext#browser-context-grant-permissions). Package runtime APIs, dependencies, and Vitest 5 remain unchanged.

The complete Node and bundled Chromium headless shell coverage run passes 554 tests, with two existing licensed Pro tests skipped. Coverage remains 91.85% for statements, 88.42% for branches, 90.36% for functions, and 93.05% for lines. Maintainer passes all six checks with none skipped, including 194 PHP tests, 306 Node tests, formatting, lint, Vue types, and PHPStan. The package build passes. These local checks run on macOS; Ubuntu stable still needs a new native Actions run. Documentation passes all 670 frontend tests, 12 relevant PHP journey and localization tests, formatting, lint, build, and search indexing with its freshness check. The initial documentation frontend attempt used the broken default system PHP; rerunning with the working Herd PHP path passes without source changes.

The contributor guide explains the test permissions. The consumer skill and README need no edit because this change only configures package tests. The beginner path remains an existing Laravel, Inertia, Vue, and Vite application, Composer before vendor-file npm installation, the public Button example displaying `Hello from Front Awesome`, then Web Awesome setup. The overview's first toast still requires Vue plugin registration and an active web session. Existing installation routes, navigation, public examples, and shared prose components remain unchanged.

The documentation refresh runs Composer before npm. The Composer dry run proposes Front Awesome `1.x-dev` from `89b282a` to the published `1e6d40e` preview and QZ Tray `1.3.0` to `1.4.0`, with no security advisories. It still reports abandoned `symplify/rule-doc-generator-contracts`. The declared direct npm ranges are current, including the documentation application's separate Vite Plus `1.4.0` pin. The vendor-copy installation dry run proposes only removing unused `@emnapi/runtime`. These application dependency changes do not contain the uncommitted test correction and are not applied by this task. Existing manifest, lock, and unrelated documentation edits remain intact.

### Front Awesome asynchronous checkbox verification on 2026-11-11

[Actions run 43104602003](https://github.com/artisan-toolbox/front-awesome/actions/runs/43104602003) passes both Windows dependency lanes and Ubuntu lowest. Ubuntu stable passes clipboard coverage and fails only the checkbox's initial `checked` assertion. The test waits for native registration, a Vue tick, one animation frame, and the native update promise. Those conditions do not wait for the wrapper's asynchronous module loader and property application.

The checkbox scenario now runs against both the public wrapper and the real native element through the shared adapter with a controlled pending loader. Keeping the immediate assertion reproduces the same `expected false to be true` failure. The corrected assertion waits for the combined public result: `checked: true`, `defaultChecked: false`, and the submitted `consent: 'yes'` value. Both scenarios then retain every click, unrelated-render, explicit-update, prevented-reset, normal-reset, and final FormData assertion. All 14 adapter tests pass. The pending-loader scenario imports the real upstream module itself and also passes in isolation with `--repeats 20`. The loader gate uses explicit release rather than a sleep. Package runtime code, dependencies, public APIs, and Vitest 5 remain unchanged.

The same incomplete import wait appears in 13 browser readiness helpers. Each now calls [Vitest's `vi.dynamicImportSettled()`](https://vitest.dev/api/vi#vi-dynamicimportsettled) before native update checks. This waits for the actual imports rather than assuming that registration or a frame completes module loading. The controlled loader still requires the observable property assertion after its explicit release. The public and deferred components share Vue's `Component` type for render selection, with no type assertion.

The contributor guide explains module loading and [observable asynchronous assertions](https://vitest.dev/api/expect#expect-poll), preserving the existing shared prose presentation. The consumer skill and README need no edit because normal installation, property bindings, methods, and reset behavior are unchanged; this task corrects package test synchronization. The reviewed beginner path remains an existing compatible Laravel, Inertia, Vue, and Vite application, Composer before vendor-file npm installation, the public Button example displaying `Hello from Front Awesome`, and Web Awesome setup. The overview toast still requires the Vue plugin and a web session. Installation routes, prerequisite order, navigation, and examples remain intact.

The documentation refresh runs Composer before npm. The Composer dry run proposes Front Awesome `1.x-dev` from `89b282a` to the published `ddc0a46` preview and QZ Tray `1.3.0` to `1.4.0`, with no security advisories. Composer still reports abandoned `symplify/rule-doc-generator-contracts`. The declared direct npm ranges remain current, including the documentation application's separate Vite Plus `1.4.0` pin. The vendor-copy installation dry run proposes only removing unused `@emnapi/runtime`. These existing application dependency updates do not include the uncommitted test fix and are not applied by this task. Existing manifests, locks, and unrelated documentation work are preserved.

The broader import wait also exposes invalid parity-test geometry. The native and Vue columns are each 720 pixels wide with a 24-pixel gap, but the default browser viewport is only 414 pixels wide. A new visibility assertion fails deterministically with `expected 1464 to be less than or equal to 414`. The upstream TabGroup implementation initializes selection through an IntersectionObserver, so the offscreen wrapper can have no active panel when comparison starts. The parity suite now uses a 1600-by-1000 viewport, checks that both examples fit horizontally, and waits for each group's public active panel before comparing states, colors, dimensions, and parts. All original comparisons remain active; no CSS override or runtime workaround conceals the missing panel.

The completed Node and bundled Chromium headless shell coverage run passes 555 tests, with two existing licensed Pro tests skipped. Coverage is 91.85% for statements, 88.42% for branches, 90.36% for functions, and 93.05% for lines. All 69 native/Vue parity groups pass. The generated action-test reference preserves the checkbox scenario and updates its parameterized title through the owning generator; no coverage reference is removed. The final adapter file passes all 14 tests. Maintainer then passes all six checks with none skipped, including 194 PHP tests, 306 Node tests, formatting, lint, Vue types, and PHPStan. PHP type coverage is 100%, and the package build passes. Documentation passes 670 frontend tests, 12 relevant PHP tests, formatting, lint, build, and search indexing with its freshness check. The documentation build is rerun with the working Herd PHP path after the default system PHP fails to load its missing libtidy dependency. Validation runs locally on macOS; the next native Actions run must confirm the final changes.

### QZ Tray maintenance verification on 2026-11-11

The package source pins Vite Plus and its Vite core alias to `1.6.0` and uses bundled Vitest `5.1.0` without an older runner override. A clean `npm ci --ignore-scripts` reports no advisories or peer conflicts. All 313 frontend tests pass on Node `22.18.0`, `24.11.0`, and the local Node 26 runtime. The compiled ESM and CommonJS connector entries pass the emulated connection test on Node `20.19.0`, preserving consumer compatibility. `composer test` passes static analysis, formatting, full type coverage, and 67 PHP tests. The image regression fails before the fix under a 32,000-dot ImageMagick limit. Disposable Composer setups reproduce the leaked `app()` helper with the original CI command and verify its absence after Framework and Testbench move to development requirements.

During that maintenance check, the application still installed public QZ Tray `1.3.0`; the PHP writer and updated source tooling were source previews. The beginner path remained an existing Laravel application with Vite and optional Vue, Composer before vendor-file npm installation, configuration publication, and a reader-triggered `renderZpl()` preview of `Hello`. The documented ZPL and dimensions also generated an inspected 800-by-1200 PNG containing `Hello`, using the compiled public API and a local response for the shipped WASM asset. Continue through security setup before physical printing. The Installation route, ordered navigation, guide links, and Vue content tests passed. Existing shared documentation components owned presentation. The consumer skill remained accurate because public APIs, installation, image-width limits, and buffer preservation were unchanged.

The dependency refresh ran Composer before npm. From the documentation root, `composer update 'artisan-toolbox/*' laravel/framework inertiajs/inertia-laravel laravel/head 'pestphp/*' --with-all-dependencies --dry-run --no-scripts --no-interaction --no-progress` found no compatible lock changes or security advisories. Composer still reports abandoned `symplify/rule-doc-generator-contracts`. `npm outdated vue '@inertiajs/vue3' '@inertiajs/vite' tailwindcss vite-plus '@vue/test-utils' happy-dom --json` found the direct ranges current; this application's separate exact Vite Plus pin remains `1.4.0`. `npm install --dry-run --ignore-scripts ./vendor/artisan-toolbox/front-awesome ./vendor/artisan-toolbox/mosaicast ./vendor/artisan-toolbox/qztray` resolved without changing the installed package versions. The offline attempt lacked cached Inertia metadata; the registry-backed attempt succeeded. Existing manifest and lock edits were preserved.

That documentation frontend check passed all 670 tests, formatting, lint, production build, and search indexing with its freshness check. `composer ci:check` passed Rector but stopped after one of 509 PHP tests failed. The existing printing demo requested `ArtisanToolbox\QzTrayConnector\Escpos`, which was absent from the installed public `1.3.0` archive. The other 508 PHP tests passed. This source-preview dependency was a release blocker at that point; no copied implementation, weakened assertion, or forced stable version concealed it. The Maintainer checks after Pest did not run in that failed workflow. The current verification below confirms that the published `1.4.0` archive resolves this blocker.

The Windows follow-up exposed an extensionless temporary image in the successful receipt test. The native Mike42 loader selects supported formats by filename extension, so the test now uses a real one-pixel `black-pixel.png` fixture. An explicit native-decoder assertion reproduces the original failure on the local machine despite available GD and Imagick, then passes with the corrected fixture. The receipt assertion checks every image, padding, feed, and horizontal-rule byte. No runtime API, decoder selection, production requirement, or consumer skill changes are needed. The existing beginner path and public examples remain valid.

The project `.npmrc` routes `@web.awesome.me` packages to the Web Awesome Pro registry on Cloudsmith.
Before installing Pro dependencies locally, export `WEBAWESOME_NPM_TOKEN` in your shell.
npm reads this variable from the process environment, not Laravel's `.env` file.
The committed configuration contains only `${WEBAWESOME_NPM_TOKEN}`, never the token value.
GitHub Actions supplies the variable from its repository secret during `npm ci`.

`install-links=true` installs local `file:` dependencies as packages rather than directory links.
The existing `ignore-scripts=true` setting remains enabled.

Maintainer is installed under `vendor/bin/maintainer`.
For standalone use, use published Composer distributions and commit the lock file so another developer or CI can install the same package versions.
The lock file must not depend on a developer's absolute workspace path.

### Documentation consistency and test dependencies on 2026-11-11

The application now installs public archives for Front Awesome `1.0.0-alpha.2` and QZ Tray `1.4.0`, alongside Core `1.2.1`, Dump to Console `1.1.1`, Maintainer `1.11.0`, and Mosaicast `1.2.1`. Preferences, localization, wrapper, printing, and receipt guides identify the released APIs instead of requiring unpublished checkouts. Front Awesome remains an alpha. Maintainer's searchable task selector is available only on the development branch after `1.11.0`; the released command uses ordinary selection.

The compatible Composer refresh uses a separate `COMPOSER_HOME` and the existing declared ranges. `composer update 'artisan-toolbox/*' laravel/framework inertiajs/inertia-laravel laravel/head 'pestphp/*' --with-all-dependencies --dry-run --no-scripts --no-interaction --no-progress` reports no lock changes or security advisories. A separate application copy installs the lock from public archives without local package routing. Its Front Awesome preference middleware and QZ Tray `Escpos` class autoload successfully. Composer still reports the abandoned `symplify/rule-doc-generator-contracts` package.

The forced npm audit repair downgraded Vue Test Utils to `2.4.11` and left four moderate advisories. The application restores `@vue/test-utils:^2.5.1`. Its `js-beautify` dependency still requests vulnerable dependency ranges, so scoped overrides select `editorconfig:^4.0.0` and `glob:^14.0.5` only beneath that package. The lock resolves EditorConfig `4.0.0`, glob `14.0.5`, and minimatch `11.0.8`. Actual Vue Test Utils HTML rendering and a js-beautify CLI fixture with glob expansion and EditorConfig indentation and final-newline settings pass. Revisit the overrides when js-beautify declares corrected ranges.

Vite Plus and its Vite core alias are both pinned to `1.6.0`, which supplies Vitest `5.1.0`. There is no independent Vitest override. Incremental installation encountered peers from the former toolchain; resolving the lock in a clean temporary directory and running `npm ci` succeeds without `--force` or `--legacy-peer-deps`. Composer installation precedes frontend installation and the vendor-file package refresh. npm still reports the upstream `node-domexception` deprecation.

Run `npm run audit:check` after dependency changes. It checks the full dependency tree and fails on moderate or higher advisories. The fresh installation and this gate report zero vulnerabilities. GitHub Actions runs the same gate after `npm ci`.

The complete local `composer ci:check` passes Rector and all six Maintainer checks with none skipped, including 509 PHP tests and 670 frontend tests on Vitest `5.1.0`. Shared standards, 90 public demo exports, 87 demo frames, the production build, and search indexing with its freshness check also pass. The production-build browser chain verifies all 80 catalog owners, 90 implemented exports, light and dark themes, 1440 px and 390 px layouts, actual clipboard behavior, search, navigation, focus, printing previews, localization, and persisted preferences. The printing check generates real PHP receipt and two-page PDF previews without contacting QZ Tray. Representative desktop and mobile screenshots were inspected.

The six package Installation routes and beginner journeys retain Composer-before-npm order, defined example inputs, expected results, and links to the next guide. Existing public package exports provide the demos; no package implementation is copied into the application. Package usage APIs have not changed in this task, so the consumer skills' existing API procedures remain applicable. Front Awesome's branch-preview wording remains owned by its package source and is not rewritten in installed vendor copies.

The application browser test measures the reading position after a real wheel action and waits for Inertia to save it. It clicks the already-visible Home link at its measured center and checks the departure position through `inertia:before`, then verifies exact restoration after Back. Playwright's normal locator click can scroll the slotted sticky link before dispatching pointer events, changing the test's precondition. A trial-only click reproduced that change without navigation. The physical click preserves the original reading position; no application history behavior or restoration tolerance is changed. Keep `public/hot` temporarily out of the way when verifying production assets locally, and restore it after the browser run.

## Run the complete CI gate

```bash
composer ci:check
```

The command first runs Rector in dry-run mode.
It then clears Laravel's cached configuration and asks Maintainer to run the complete configured check workflow without interaction.
The checks are Pest, Pint, Vite Plus formatting and lint, Vite Plus tests, Vue type checking, and PHPStan.
PHPStan uses level 7 and the existing 512 MB memory limit.

The application's existing Pest configuration, Pint preset, PHPStan paths, and frontend scripts remain in place.
Maintainer discovers the existing package scripts, including `vp test run --config vite.test.config.js`.

Maintainer reports unavailable checks as skipped rather than failing them.
Install development dependencies and frontend dependencies before running the gate, and confirm that every listed tool executes.
Do not treat a successful exit code with skipped tooling as complete validation.

## Run one workflow

Run all Maintainer checks without the preceding Rector dry run:

```bash
composer quality:check
```

Run the Rector check alone:

```bash
composer rector:check
```

Open the Maintainer menu:

```bash
php vendor/bin/maintainer
```

Maintainer 1.10 exposes Rector in its fix workflow, not as a separate check contract.
The explicit Composer dry-run command gives CI Rector coverage without modifying files.

## Maintain the application version and README

`App\ArtisanToolbox` in `app/ArtisanToolbox.php` implements Maintainer's public `Versionable` and `WithReadmeHead` contracts.
Its `public const string VERSION` owns the documentation application's version, independently of the versions of the documented packages.
The initial version is `1.0.0-alpha.1` because the replacement application is still under migration.
This declaration does not publish a release or create a Git tag.

Edit `readmeHead()` to change the README logo, title, descriptions, or badges.
Then regenerate the managed header:

```bash
php vendor/bin/maintainer readme:update --no-interaction
```

Maintainer replaces only the region between its `MAINTAINER:README_HEAD` markers.
Keep installation commands and contributor guidance outside that region.
Repeated execution leaves the README unchanged when the header is current.

The PHP badge follows the production requirement, `^8.5`.
The release badge remains `in development`, and the tests badge follows `1.x`.

Keep the identity class in the root of the production `App\` PSR-4 directory.
Maintainer discovers it without a Laravel service binding and constructs it without arguments.
The application does not load this tooling class during normal requests and declares Maintainer as development tooling. Some installed Artisan Toolbox distributions also require Maintainer transitively at runtime. Check the resolved dependency graph rather than assuming it disappears from a production installation.

`tests/Unit/MaintainerIntegrationTest.php` runs the installed standalone CLI against a temporary copy of the production application sources.
It regenerates a removed header, compares it with the committed README, preserves unmanaged content, verifies the exported version, and checks repeated execution.
The test also verifies that the real README stays unchanged.
The standalone binary preserves fixture isolation because the Composer proxy resolves the real consuming project from its autoload path.

## Run checks in GitHub Actions

The tests workflow checks the distribution lock and installs locked Composer dependencies before running `npm ci` with Node.js 24. Use the standalone verification procedure above when refreshing release dependencies.
The frontend installation receives `WEBAWESOME_NPM_TOKEN` from the repository secret with the same name.
Keep the token in GitHub secrets rather than repository files.
The Web Awesome Pro dependency requires a licensed registry token. Fork pull requests do not automatically receive repository secrets and need an authorized trusted workflow to install that dependency.

The workflow prepares the application key, clears cached configuration, and builds client assets.
It then runs `composer rector:check` and invokes Maintainer directly with `php vendor/bin/maintainer quality:check --no-interaction`.
This sequence preserves the checks provided by the local `composer ci:check` command.

The PHP quality steps use `APP_ENV=testing`, array cache, session and mail stores, synchronous queues, and SQLite in memory. Pest creates its own test schema. The [browser step](#verify-interactive-documentation-in-ci) overrides sessions with file storage and migrates a disposable SQLite file for its real HTTP requests.

## Apply fixes

```bash
composer quality:fix
```

The configured fixes run Rector, Pint, and Vite Plus in that order.
The Rector configuration follows Maintainer's application template and the installed Laravel version.
Review the diff after running fixes.
Interactive Maintainer workflows can offer subsequent checks and a commit; those actions require their own interactive selection.

To run only Rector without interactive follow-up, use:

```bash
php vendor/bin/maintainer quality:fix --tool=rector --no-interaction
```

## Build before deployment

```bash
npm run build
```

This produces the client assets with Vue SSR disabled.
Pest, Rector, Pint, and PHPStan are development dependencies and are absent after `composer install --no-dev`. Maintainer may remain through runtime package dependencies; that does not make its underlying quality tools available.
Run quality commands from a development or deployment environment that installs all required tooling, and confirm that no checks are skipped.

The user configures and executes deployment separately. The local `deploy.php` remains ignored by Git; it imports the versioned `resources/deployer/search.php` recipe and explicitly runs `docs:search` after optimization and before migrations and publication. It applies PM2 afterward so the Horizon master starts from the new current release. Preserve that import and order when regenerating server configuration. See [the Deployer search gate](search.md#use-the-deployer-recipe) and [queue operation](queues.md) for setup, failure behavior, and verification.

The search integration does not configure SSH identities, change server settings, or execute a deployment.

After publication, follow [the Nginx verification guide](nginx.md) if Horizon's browser dashboard, WebAssembly previews, or dynamic robots discovery fail while the application and workers remain available. Server headers and exact-match static locations can override otherwise correct application behavior.

## Consult archived migration checks

```bash
npm run test:migration
```

This command is archived migration tooling and requires historical source files that are no longer present in the workspace. It is not a current documentation completion check. Do not recreate `docs_old` to run it. Use the self-contained `npm test` suite and the normal quality, build, and search checks when maintaining the `docs` application.

## Verify interactive documentation in CI

After the production build and search checks, CI installs Playwright Chromium and runs the catalog, application, and sign-in browser chain against a disposable local Laravel server. The step sets `APP_URL` and `DOCS_BASE_URL` to the same localhost origin, uses file sessions for actual request-forgery protection, and migrates an isolated SQLite file under the runner temporary directory. It stops the server when the step exits. It does not start mail, Redis, broadcasting, or external services. Sign-in requests remain intercepted by the browser harness.

The browser step complements Maintainer's six configured checks; it does not replace them or the earlier distribution lock check. The committed lock resolves public Composer archives, including Front Awesome 1.0.0-alpha.2, QZ Tray Connector 1.4.0, and Maintainer 1.11.0. The Front Awesome and QZ Tray archives include the APIs used by the print demo. Front Awesome is in beta; its installed version remains separate from package stability. Passing local browser checks does not establish a successful remote workflow run.

For catalog failures, set `DOCS_BROWSER_TRACE=1` to print the current route. The harness
uses a 30-second default timeout so a failed state expectation cannot wait indefinitely.

The deferred-font history case positions Skeleton before measuring the departure scroll. Fonts remain blocked throughout the visit and Back restoration. Native fragment scrolling can leave the page at its lower limit while custom elements finish layout, so the case establishes its reading position explicitly. The separate readiness case verifies automatic fragment alignment after fonts load.

History checks send wheel input to the visible padding of `main-content` and verify the actual hit target first. A heading's coordinates can be outside the viewport during deferred layout, and a nested demo can own its own scrolling. Keep the real wheel action, Inertia's saved-position check, and the exact Back restoration assertions. Increasing the timeout does not correct an invalid starting position or input target. See Playwright's [mouse coordinates and wheel behavior](https://playwright.dev/docs/api/class-mouse#mouse-wheel).

The November 12, 2026 verification attempts `composer update 'artisan-toolbox/*' laravel/framework inertiajs/inertia-laravel pestphp/pest pestphp/pest-plugin-laravel --with-dependencies --dry-run --no-scripts --no-interaction` before `npm update @inertiajs/vue3 @inertiajs/vite vue playwright @vue/test-utils vite-plus --dry-run --ignore-scripts --offline --cache /private/tmp/atb-docs-npm-cache`. Composer cannot resolve Packagist through the sandbox DNS, and npm lacks cached metadata for `@inertiajs/vite`. No dependencies or lockfiles change. Installed vendor-file package manifests match their Composer sources. This test-only correction leaves package APIs, beginner installation journeys, and consumer skill guidance unchanged.

The same verification reproduces the timeout with Skeleton outside the viewport and the document at its lower scroll limit. The corrected case passes when that starting geometry is imposed deliberately. `composer ci:check` passes Rector and all six Maintainer checks, including 539 PHP tests and 688 frontend tests. The production build, search indexing and freshness check, shared standards, demo synchronization, and all six browser scripts pass. The Vite hot-file marker is restored after testing production assets. GitHub-hosted execution remains pending the next push.

## Front Awesome beta promotion on 2026-11-13

Front Awesome is classified as Beta in the shared package registry, overview, installation, component catalog, preference, localization, printing, theme, and development guides. The package owns its beta README badge and consumer skill. Current guidance uses a package-scoped `^1.0@beta` installation constraint. Maintainer still owns release version changes: this task preserves `FrontAwesome::VERSION`, the npm package version, locked Front Awesome versions, and historical release records. It does not publish a beta tag.

The beginner journey starts in an existing Laravel 13.36 or later within 13.x application with PHP 8.5, Inertia 3, Vue 3.5, Vite, Tailwind 4, and Node.js 24.11 or later. The dedicated Installation page completes Composer before vendor-file npm installation, the public Vite plugin, and styles. Its self-contained `FrontAwesomeWelcome` page and public route produce the `Hello from Front Awesome` button, followed by the Button guide. The existing overview toast requires the Vue plugin and an active web session. Rendered-content tests retain the prerequisites, commands, executable Vue example, expected results, links, and anchors. Existing public Button, Callout, and DataGrid exports remain the owning APIs; only stability wording and sample status values change. Historical migration fingerprints stay intact, with explicit current expectations in their tests.

Package verification passes `composer test` with PHPStan, Pint, 100 percent source type coverage, and 194 PHP tests. All six Maintainer quality checks also pass, including 306 frontend tests and Vue type analysis. The README header was regenerated with `php vendor/bin/maintainer readme:update --no-interaction`. A Composer candidate archive contains the exact updated `front-awesome-development` skill and excludes installed dependencies. The documentation application's installed Boost discovers and parses that archived skill, then its native SkillWriter refreshes a selected copy in an isolated consumer fixture with the expected Markdown normalization. A request to install Front Awesome beta and show a toast selects the package-specific installation and plugin guidance; an unrelated request to create a Laravel migration falls outside its description. A fresh public beta installation remains pending Maintainer's version/tag workflow.

Documentation verification passes the affected PHP tests, all Front Awesome frontend tests, formatting and lint, Vue types, PHPStan, the production build, and demo synchronization for 90 public exports and 87 frames. Search indexing and freshness checks pass. Direct browser verification passes 18 checks across the overview, installation, catalog, Data Viz, Feedback, preferences, localization, printing, and development pages, using 1440-pixel light and 390-pixel dark layouts. The complete documentation suites were attempted: the observed PHP run passes 537 of 539 tests and the frontend run passes 686 of 688, with the failures confined to concurrent Filoquent changes whose installed beta version differs from their alpha expectations. The full browser chain fails during navigation with an execution-context error; the targeted Front Awesome checks pass. These results do not claim a clean full-site gate or a remote CI run. Concurrent Filoquent and Dapter work is preserved.

Dependency refresh attempts ran Composer before npm without changing this task's dependency constraints or versions. `composer update 'artisan-toolbox/*' laravel/framework inertiajs/inertia-laravel laravel/head 'pestphp/*' --with-all-dependencies --dry-run --no-scripts --no-interaction` fails to resolve `repo.packagist.org`. `npm update --dry-run --ignore-scripts --no-audit --no-fund --fetch-retries=0 --cache /tmp/front-awesome-beta-npm-cache` encounters registry DNS failures and reports an unresolved Inertia peer tree. No forced resolution, dependency bump, or vendor frontend refresh is claimed. Existing installed frontend exports supply validation.
