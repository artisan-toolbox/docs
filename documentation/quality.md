# Run project quality checks

The application installs Maintainer, Rector, Laravel Rector rules, Pest, Pint, and Larastan/PHPStan as Composer development dependencies.
The application requires PHP 8.5 or later in the PHP 8.x series. CI runs the quality, asset, and browser checks on PHP 8.5 and 8.6.
Frontend checks use the existing Vite Plus and Vue tooling.

From the documentation checkout, run `npm run types:check` to check the Vue application and the Dapter design reference. The reference checker compiles the displayed TypeScript definitions and their usage examples in one program. Each invalid example must produce a diagnostic on its own line of code. The definitions and the valid example must compile cleanly. Run `node scripts/check-dapter-reference-types.mjs` to check just that contract.

Dated verification entries preserve the results observed during each task. The [current dependency and consistency verification](#documentation-consistency-and-test-dependencies-on-2026-11-11) supersedes their earlier installation blockers and audit findings.

Formatting is configured in `vite.config.ts` under `fmt`: 100-column lines, four-space indentation, single quotes, semicolons, and closing brackets on the last attribute line. Attributes may share a line, and HTML whitespace sensitivity follows CSS display rules. The formatter excludes `.github/**`, `composer.json`, `resources/js/components/ui/*`, `resources/views/mail/*`, and `resources/js/ziggy.js`.
Tailwind class sorting covers `clsx`, `cn`, and `cva` and reads `resources/css/app.css` through `sortTailwindcss.stylesheet`, the option supported by the installed formatter.
From the documentation checkout, run `npx vp fmt vite.config.ts --check` to check the configuration file, or `npm run check` to check the project without rewriting files.

## Check shared agent standards

Run `npm run standards:check` from the documentation checkout. This dependency-free check verifies the selected standards version, source fingerprint, installed skills, and standalone checker.
GitHub Actions runs it after Node setup and before dependency installation.
The regular frontend tests cover the synchronizer's observable behavior and failure cases.
See [shared agent standards](agent-standards.md) for installation and version updates. Other adopting projects can run `node .ai/sync.mjs --check` in standalone CI.

## Check frontend dependency advisories

From the documentation checkout, run:

```bash
npm run audit:check
```

The command queries `npm audit --json --audit-level=moderate`. It fails for moderate,
high, and critical advisories, failed npm commands, registry errors, and unsupported
or inconsistent reports. Low and informational advisories retain npm's existing
threshold behavior. GitHub Actions runs this command after `npm ci`.

### Temporary picomatch exception

The approved exception accepts only
[GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) for
`picomatch`. It expires at **2026-11-25 03:00 UTC**, immediately after November 24
in `America/Sao_Paulo`. The check accepts a dependent package only when every
reachable moderate-or-higher advisory has that exact identity. A second advisory
on `picomatch`, an unrelated vulnerable dependency, or a mixed dependency chain
continues to fail. Cyclic npm dependency paths do not extend the exception.

An accepted report prints the advisory URL, affected package names, and expiration
before `Frontend dependency audit passed.` This accepts a known vulnerability;
it does not repair or remove the installed code. The advisory describes denial of
service through crafted repeated extglob patterns. Keep build and test glob
configuration under trusted repository control. Do not treat this exception as
evidence that arbitrary user-supplied patterns are safe.

At expiration, an affected report fails automatically. A clean report passes even
after that date. Review a published upstream repair, update within the declared
compatibility ranges, run the raw `npm audit` and project quality checks, and
remove the exception after confirming the advisory is resolved. Do not extend its
deadline automatically or run `npm audit fix --force` to bypass compatibility.

The exception lives in `scripts/check-npm-audit.mjs`. Its subprocess and graph tests
run in the existing frontend suite. Run the focused checks with:

```bash
npm test -- scripts/check-npm-audit.test.mjs
```

This contributor-only policy changes no package API, consumer skill, installation
journey, application control, or public demo. Existing package guides and shared
presentation remain applicable.

### Verification on 2026-11-17

The supplied Actions failure and a fresh raw audit both report 19 affected packages
from this one advisory. The latest published `picomatch` is `4.0.7`, which remains
affected. `npm audit fix --dry-run --ignore-scripts --json` changes nothing and
retains those findings. No forced repair or dependency downgrade was applied.

The real `npm run audit:check` passes with an explicit exception warning. Evaluating
that same registry report immediately before expiration accepts all 19 packages;
at the expiration instant, all 19 fail. The 37 focused tests pass, including mixed
advisories, cyclic paths, exact identity and expiration checks, low-severity
thresholds, malformed reports, process failures, and executable CLI cases.
The complete frontend suite passes 1,337 tests. Formatting, lint, shared standards,
the portable Composer lock check, production build, and search-index publication
and freshness checks pass.

`composer ci:check` passes Rector and all six Maintainer checks with none skipped:
985 PHP tests, Pint, frontend formatting and lint, 1,337 frontend tests, Vue type
checking, and PHPStan. The initial sandbox run failed six PostgreSQL comparison
tests because local service access was restricted. All 16 tests in that file and
the complete suite pass with local service access. No checks were disabled or
assertions changed. A new GitHub Actions run was not triggered by this task.

Compatible dependency refresh attempts ran from this checkout in this order:

```bash
composer update 'artisan-toolbox/*' laravel/framework inertiajs/inertia-laravel laravel/head 'pestphp/*' --with-all-dependencies --dry-run --no-scripts --no-interaction --no-progress
npm update --dry-run --ignore-scripts --json
```

Composer reports nothing to modify, install, update, or remove and no security
advisories. It still reports abandoned `symplify/rule-doc-generator-contracts`.
The npm dry run reports zero additions, removals, or changes. Installed package
versions, Composer-delivered frontend copies, dependency ranges, and both lockfiles
remain unchanged. Registry access required a retry outside the network sandbox.

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

The root manifest declares public package ranges and no local repositories. The release lock uses remote distributions for all installed Artisan Toolbox packages. Development routing can nevertheless write absolute `dist.type=path` entries during a later update. Such a lock requires the developer's workspace and cannot be distributed as a standalone installation.

Keep local routing and aliases available for development. Do not replace their version numbers merely to obtain a visual label. A release lock must resolve actual package archives or remote source revisions and must be verified independently of that routing. Never copy package internals into the application or bundle a second vendor tree to conceal missing public exports.

Before Composer installation in CI, `php scripts/check-distribution.php` checks the lock without loading the framework or installed dependencies. The same check is available as `composer distribution:check`. It rejects local paths in both runtime and development packages with package-name diagnostics, without printing repository URLs. It deliberately accepts development branches and any version number when the location is remote. It never edits the lock. The ordinary local quality suite remains available when intentionally working with a development lock; the distribution check is a separate release gate.

To prepare a portable lock:

1. Create an isolated checkout or temporary source copy without private environment files, installed dependencies, or sibling package directories.
2. Use a separate `COMPOSER_HOME` so development routing does not affect resolution. Keep the global configuration unchanged.
3. Resolve the application's declared dependencies through their public distributions. The application uses Front Awesome's DataView, scrollbar, and permission editor exports, the Dapter adapter, and QZ Tray's receipt writer and document preparation APIs. Allow prereleases through individual package constraints. Keep global Composer stability at `stable`.
4. Run the distribution check and install Composer dependencies normally. If Composer changed a frontend package version, rerun its documented `npm install` command with all required `./vendor/` paths together and retain the updated npm lock. Then run `npm ci` against the Composer-delivered frontend directories.
5. Run the real quality suite, production build, and search indexing checks. Inspect the actual installed exports. A remote URL and a successful dependency installation do not establish that the application can build.
6. Only after those checks pass, integrate the verified manifest and lock changes into the application. Retain one release lock, not a parallel production manifest or lock file.

The 2026-11-06 release candidate resolved public archives for Core `1.2.1`, Dump to Console `1.1.1`, Maintainer `1.11.0`, Mosaicast `1.2.1`, QZ Tray `1.3.0`, and Front Awesome `1.0.0-alpha.1`. The Front Awesome archive at commit `a55e06f` supplied the consumed `./vite`, `./tailwind.css`, and `./web-awesome-tailwind` exports and its consumer skill. That candidate permitted `^1.0@dev` for Front Awesome only, with project-wide minimum stability set to `stable`. Composer installation, paired vendor-path npm installation, fresh `npm ci`, the complete quality gate, production build, and search indexing passed in an isolated consumer without sibling packages or private credentials. All six Maintainer checks ran with none skipped. Those locks were the initial release locks. See the current verification below for their replacements; local Composer routing remains unchanged.

All six documented packages are explicit Composer dependencies. Web Awesome Core `3.14.0` is the selected styling dependency; this check does not establish Pro adapter compatibility. Package publication is a separate operator-approved action.

### Front Awesome DataView distribution verification on 2026-11-18

The supplied Actions log passes the approved npm audit exception, then fails the
production build because the locked Front Awesome `1.0.0-beta.2` archive does not
export `./data-view`. Local vendor and npm directories contained newer source,
which concealed the incompatible release lock. A complete source copy with a
clean `COMPOSER_HOME`, no sibling packages, and only public Composer archives
reproduces the missing export in the existing `DataViewDemo.test.js` suite.

The application now requires `^1.0.0-beta.3`. Composer resolves the published
archive at `c04d79707df35e2bfb66d663bede2fcf45e06103`; no development branch or
local source is substituted. The npm vendor-file metadata records the matching
beta. Only Front Awesome changes version. Composer installation precedes paired
installation of all four Artisan Toolbox frontend packages and a fresh `npm ci`.
The eight DataView demo and guide tests and the production build pass against
those public artifacts. The guide identifies the API as a published beta preview
and retains its existing URL, examples, and proposed-feature boundaries.

Rector, all 985 PHP tests, Pint, frontend formatting and lint, Vue type checking,
and PHPStan pass in that installation. The full frontend suite passes all 1,337
tests with `npm test -- --maxWorkers=2`. Default parallel runs encounter existing
five-second timeouts in documentation type and icon checks; the affected type
file also passes unchanged on its own. No timeout, assertion, or test selection
is weakened. Verification uses macOS, Herd PHP 8.5.12, and Node 26.5.0. It covers
this task's changes applied to the committed source snapshot; concurrent Dapter
authoring in the workspace is preserved and excluded from that isolated snapshot.

The isolated suite also exposes an unrelated environment dependency in the action
wire-fixture test: the example environment uses `https://atb.dev.br`, while the
fixtures deliberately use `https://atb.test`. PHPUnit now forces the synthetic
test origin through its server configuration, including when the parent process
inherits the production `APP_URL`. The existing action test fails before this
configuration and all five tests in its file pass afterward. Fixtures, application
routing, and the production origin remain unchanged.

The beginner path still starts in a supported Laravel/Inertia/Vue application,
installs Composer packages before vendor-file frontend packages, configures the
public plugin and styles, and renders `FrontAwesomeWelcome` with the expected
`Hello from Front Awesome` Button. Its dedicated Installation route, overview,
and links remain in their existing learning sequence. DataView consumes the
public export with a compatible Dapter alpha adapter; no application-specific
replacement or copied package implementation is added. Package consumer skills
need no API edits for this application-only dependency selection.

The compatible Composer refresh dry run offers only Front Awesome beta.2 to
beta.3. A subsequent `npm update --dry-run --ignore-scripts --json` reports zero
additions, removals, or changes. Composer still reports abandoned
`symplify/rule-doc-generator-contracts`. The optional post-update `boost:update`
hook needs ignored local Boost installation state, which the clean copy does not
contain; the regular `composer install` path used by CI passes. No install hook,
audit, or test assertion is disabled. The npm audit check passes with only the
previously approved advisory and expiration. Search-index publication and its
freshness check pass. A new remote Actions run is not part of this verification.

### Artisan Toolbox release refresh on 2026-11-18

The release lock resolves Core `1.3.0`, Dapter `1.0.0-beta.2`, Dump to Console `1.2.0`, Filoquent `1.0.0-beta.6`, Front Awesome `1.0.0-beta.5`, Maintainer `1.12.0`, Mosaicast `1.3.0`, Permit `1.0.0-beta.1`, and QZ Tray `1.5.0` from public Packagist archives. An isolated Composer update also checked Laravel, Inertia, Laravel Head, and Pest within the existing constraints. Those versions held. Composer updated `guzzlehttp/psr7` to `3.5.0` and `paragonie/constant_time_encoding` to `v3.1.5` while resolving the lock. It reported no security advisories and still flagged the abandoned `symplify/rule-doc-generator-contracts` dependency.

After Composer installation, npm refreshed the four vendor-file dependencies used by the site and installed the resulting lock with `npm ci`. The npm refresh dry run offered unrelated transitive updates, which were outside the package refresh. The registry audit passed without an advisory exception.

Permit adds a published assignment-table migration to the documentation app. The beta shares Gate decisions with signed-in readers through its Inertia middleware. The editor demo keeps the public Front Awesome component and its isolated endpoint for fictional accounts. Permit management routes are disabled in the site.

`composer ci:check` passed Rector and all six Maintainer checks on PHP 8.5.12 and Node 24.22.2. Pest passed 1,060 tests and Vite Plus passed 1,362 with two workers. The Maintainer archive is tagged `1.12.0`. Its bundled executable prints `Maintainer 1.11.0` and is the executable used by the CI checks. The Composer distribution check, shared agent standards, production build, search index freshness, and Dapter coverage for 510 discovered settings also passed.

The browser workflow uses `localhost` because the Font Awesome kit accepts that origin. It uses database cache on a disposable SQLite database because the live demos read fixture state across requests. It runs `php scripts/setup-dapter-literal.php` to create the separate SQLite search fixture. It builds the frontend for a loopback Reverb instance and starts that instance with a generated secret. A Redis service and a worker process the same `demos` queue that the site uses. The browser scripts exercise private channel authorization, queued updates, and Reverb delivery without contacting the site's broadcaster.

The live browser script checks the fixture mutation response before waiting for its event. If the guest request limit returns HTTP 429, it waits for the server's `Retry-After` interval and resubmits once. The script still requires a successful mutation and the actual socket event.

The browser run passed 22 scripts. A focused rerun with the rate-limit handling passed the live script, including 44 resource, live, and polling views. Both runs used the Front Awesome beta.5 archive, Chromium, and the local test infrastructure above.

The installation routes still come first in the shared navigation. The guide checks use these starting environments and first results.

| Package           | Starting environment and install order                                                                                       | First result and next guide                                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Core              | Laravel 13 with Composer                                                                                                     | `Arr::sift()` yields only Ada's name. Continue to conditional arrays.                                                         |
| Dapter            | Laravel, Inertia, Vue, Vite, and a web session. Install Composer packages before npm and configure Ziggy.                    | The public notebook source lists and pages records. Continue to source declarations.                                          |
| Dump to Console   | A Laravel application and a local listener. Install with Composer before running the listener.                               | The terminal receives `Hello from Laravel` while the route returns `Response unchanged`. Continue to usage and configuration. |
| Filoquent         | Laravel 13 with a clean database and a writable filesystem. Install with Composer before migrating.                          | Saving and reading the file yields `true` and `Hello Filoquent`. Continue to file attributes and variants.                    |
| Front Awesome     | Laravel, Inertia, Vue, and Vite. Install Composer packages before npm and load the public plugin and styles.                 | The Button renders in the welcome example. Continue to the component catalog.                                                 |
| Maintainer        | A Composer project. Git and GitHub CLI are used for the relevant workflows.                                                  | The CLI lists `config:publish` and `quality:check`. Continue to configuration publishing.                                     |
| Mosaicast         | Laravel with Inertia, Vue, and a working session. Install Composer packages before npm and register the client.              | The listener receives the event through Inertia in the same visit. Continue to Vue integration.                               |
| Permit            | Laravel with an Eloquent user provider and a development database. Install with Composer and migrate before checking a Gate. | The quickstart returns `false` before a grant and `true` after it. Continue to declarations.                                  |
| QZ Tray Connector | Laravel with Vue and Vite. Install Composer packages before npm.                                                             | The browser renders a ZPL label preview. Continue to connection setup for printing.                                           |

### Simple pagination on narrow screens

GitHub Actions stopped at the page-width assertion in `test-dapter-paging-browser.mjs` on the first 390-pixel layout for commit `0a3d3ce`. Local Chromium reproduced the same assertion at 375 pixels, where the unbroken `StoreOptions::pagingMode(PagingMode::Simple)` expression widened the simple pagination guide to 387 pixels. The guide now uses two inline code spans within the shared prose component. Its live examples still use the public Dapter adapter and the existing Front Awesome controls.

The new 375-pixel check failed before the wording change and passed afterward in both themes. The corrected document also fits at 320, 360, and 390 pixels. The test reports the guide, theme, document width, and viewport width when overflow occurs.

The beginner path still uses Laravel 13, PHP 8.5, Inertia 3, Vue, and a web session. Install Dapter through Composer before npm, then expose the data route through Ziggy. The examples return Notebook 01 and Notebook 02 on the first page and Notebook 03 and Notebook 04 after Next. The guide links to cursor pagination. The consumer skill still applies because the Dapter API and setup are the same.

The compatible Composer refresh offered no updates. The npm dry run offered four unrelated transitive patches. This layout fix keeps the dependency locks at their tested versions.

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

From `docs`, build the client assets and build and verify the documentation search index:

```bash
composer ci:assets
```

Then run the quality checks:

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

### Keep request recording out of tests

`phpunit.xml` forces `INERTIA_DEVTOOLS_ENABLED=false` before Laravel boots, including when the developer's environment enables it.
The PHPUnit server variable takes precedence over inherited environment values in Laravel's configuration loader.
This keeps Inertia's recorder disabled when a test switches the application environment to `local`, as the Horizon access tests do.
Tests therefore leave the development history in `storage/inertia-devtools` untouched and avoid decoding its metadata index during request handling.
Local browser development retains Inertia's automatic recording behavior.
See [Inertia's DevTools configuration](https://inertiajs.com/docs/v3/advanced/devtools#enabling-devtools) for the upstream switch.

From the documentation checkout, run the regression and Horizon access tests with PHP's 128 MB memory limit:

```bash
php -d memory_limit=128M vendor/bin/pest tests/Feature/InertiaDevToolsTest.php tests/Feature/HorizonAccessTest.php
```

The tests pass for the `testing`, `local`, and `production` environments without DevTools response headers or recorded files.
The regression uses a temporary storage path and removes it after each case, so a failure cannot modify the developer's history.

The November 17, 2026 dependency refresh attempted the compatible Composer dry run before `npm outdated --offline --json`.
Offline Composer resolution lacked cached Packagist metadata, and npm lacked cached metadata for `@vueuse/core`.
No dependency versions or frontend vendor copies changed during this fix.
Package APIs, consumer skills, and beginner installation journeys remain unchanged.

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

The tests workflow checks the distribution lock and Composer manifest before installing locked dependencies. It caches public Composer archives and runs `npm ci` with Node.js 24 after Composer. Use the standalone verification procedure above when refreshing release dependencies.
The frontend installation receives `WEBAWESOME_NPM_TOKEN` from the repository secret with the same name. It disables npm lifecycle scripts and uses the separate frontend audit command. The workflow leaves npm caching disabled because the installation includes licensed Web Awesome Pro archives. Fork pull requests lack the registry secret and fail at installation with an explicit diagnostic.

The workflow generates an application key and runs `composer ci:assets` and `composer ci:check`. Each PHP job has a 35-minute limit to allow for Chromium dependency installation and the full browser suite. Rerun the workflow through the Actions tab when investigating a runner failure. See the [shared package CI guide](package-ci.md) for checkout, cache, and compatibility conventions.

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

After the build, search, and quality checks, CI installs Chromium using the Playwright version in the npm lock. The browser suite runs against a disposable Laravel server with a local Reverb server and Redis queue worker. The step uses the same localhost origin for `APP_URL` and `DOCS_BASE_URL`, file sessions for request-forgery protection, and a migrated SQLite file under the runner temporary directory. It checks service readiness before launching Playwright and stops the three processes when the step exits. The suite intercepts sign-in requests in the browser.

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

## Front Awesome DataView checker portability on 2026-11-17

The supplied Windows Actions log for Front Awesome commit `eb8770944aa226e76d24d26384710f6002b56b6c`
passes PHP tests, formatting, and ordinary Vue analysis, then fails in
`scripts/check-data-view-types.mjs`. The script directly launches the Unix npm executable
at `node_modules/.bin/vue-tsc`. A failed launch leaves no diagnostic strings, and adding
the absent streams produces `NaN`. Writing that number hides the original process error.
Node documents the platform distinction in
[spawning Windows command files](https://nodejs.org/api/child_process.html#spawning-bat-and-cmd-files-on-windows).

The checker now launches the installed `vue-tsc/bin/vue-tsc.js` with `process.execPath`.
It propagates launch errors and combines only diagnostic strings. All five existing
negative contract checks and temporary-fixture cleanup remain active. Two subprocess
regressions reproduce the original `ERR_INVALID_ARG_TYPE` before the fix and pass afterward.
They run the real compiler without npm executable shims in a path containing spaces,
and verify missing-compiler diagnostics and cleanup after failure.

Package validation passes `composer test`, including PHPStan, Pint, uncached 100 percent
PHP type coverage, and 216 tests with 719 assertions. `npm run check`, 319 frontend tests,
and the consumer build pass. The actual CI command,
`php vendor/bin/maintainer quality:check --no-interaction`, passes all six checks with none
skipped. The standalone negative checker also passes with Node 24.22.2. Native Windows
and a new remote Actions run remain pending. These checks ran on macOS with Herd PHP 8.5.12.
Initial subprocesses selected a broken Homebrew PHP 8.4 installation; a process-local
PATH selecting Herd resolved that environment failure. Parallel checks required local
loopback access outside the sandbox. No project assertions or machine configuration changed.

The contributor how-to reuses `DevelopmentContent` and `ProseSection`. The reviewed beginner
journey remains an existing supported Laravel/Inertia/Vue application, Composer before
vendor-file npm installation, the dedicated Installation page, and its self-contained
`FrontAwesomeWelcome` Button example, followed by component guides. The overview toast
continues to require the Vue plugin and a web session. Documentation validation passes
31 Front Awesome content tests, 11 journey and DataView feature tests, formatting and lint
for the changed guide, shared standards, the production build, and search indexing with
its freshness check. No browser interaction or runtime API changed. The README and
`front-awesome-development` consumer skill need no edit because contributor tooling is
outside their adoption guidance. Both repository changelogs describe the fix.

Dependency refresh was attempted from the documentation checkout in Composer-before-npm order:

```bash
composer update 'artisan-toolbox/*' laravel/framework inertiajs/inertia-laravel laravel/head pestphp/pest pestphp/pest-plugin-laravel --with-all-dependencies --dry-run --no-scripts --no-interaction --no-progress
npm outdated --json
```

Packagist resolution failed with curl error 6, and npm registry resolution failed with
`ENOTFOUND`. Installed versions include Front Awesome 1.0.0-beta.2, Laravel 13.43.0,
Inertia Laravel 3.7.0, and Pest 5.3.7. No dependency update or frontend-copy refresh completed;
manifests, lockfiles, and installed package copies were retained. No compatibility constraint
was relaxed, and the DataView guide still labels its working checkout as an unpublished preview.

## Front Awesome type-coverage compatibility on 2026-11-16

The supplied Actions log for Front Awesome commit `53539724e40f1a8c003f835207153a7a12b48b8a`
resolves PHPStan 2.3.6 and Pest type-coverage plugin 5.1.0. All six Maintainer checks pass,
including 306 frontend tests and ordinary PHPStan analysis. The separate `composer test:types`
step then fails because the plugin calls `AnalyserResult::getCollectedData()`, which is absent
in PHPStan 2.3.6. The [upstream release](https://github.com/phpstan/phpstan/releases/tag/2.3.6)
includes the collected-data streaming change. Composer's current published plugin versions
list 5.1.0 as the latest stable version, so no verified stable plugin upgrade resolves this pair.

The source checkout temporarily required `phpstan/phpstan: ^2.2.8 <2.3.6` under `require-dev`.
The current [package CI requirements](package-ci.md#run-checks-locally) use Pest Type Coverage
5.1.1 or later in the 5.x series with its compatible PHPStan dependency.
The `test:types` script retains `--min=100` and the 512 MB memory limit, and adds `--no-cache`.
The plugin caches analysis by source-content hash; unchanged source can reuse results from
another dependency installation. This initially masked the failure locally. An uncached
2.3.6 run in the disposable project reproduces the exact missing-method exception.
No vendor patch, exception suppression, ignored type error, or removed CI lane is used.
The existing type-coverage command is the behavioral regression gate rather than a new test
that merely repeats the manifest constraint.

Two disposable Composer projects reproduce the workflow's production `laravel/framework:13.*`
requirement, development Testbench `11.*` requirement, clean Composer homes, package discovery,
and fresh dependency resolution. With the bound, the stable lane resolves Laravel 13.42.0,
Testbench 11.3.0, Pest 5.3.6, type-coverage plugin 5.1.0, and PHPStan 2.3.5. The lowest lane
resolves Laravel 13.40.0, Testbench 11.0.0, Pest 5.0.0, type-coverage plugin 5.0.0, and PHPStan
2.2.8. Both pass `composer test`: analysis, formatting, uncached 100 percent type coverage,
and 216 PHP tests with 718 assertions. These are resolved lane versions, not a newly declared
minimum Laravel version.

The old Symfony Translation dependency in the lowest lane emits a PHP 8.5 deprecation before
the subprocess JSON response. Herd overrides the attempted scan-directory diagnostic setting.
Only the disposable exporter fixture redirects `display_errors` to stderr before autoloading;
`E_ALL` and the diagnostic remain enabled, and the JSON assertions are unchanged. Production
CI uses its production INI. The committed exporter fixture is not modified. Generated PHPStan
caches stay outside both checkouts so Pint never formats generated containers.

As a negative control, removing one private parameter type in the disposable source makes
`--min=100 --no-cache` fail at 99.1 percent. The original source is restored afterward.
The actual package checkout also passes `composer test` with 216 tests and uncached 100 percent
coverage, plus all six Maintainer checks with none skipped, including 306 frontend tests and
Vue type checking. Composer manifest validation passes. Native Windows and a new GitHub
Actions run remain to be verified by CI; local checks run on macOS with Herd PHP 8.5.12.

The contributor how-to reuses `DevelopmentContent`, `ProseSection`, and the existing command
reference. The beginner path remains an existing supported Laravel/Inertia/Vue application,
Composer before vendor-file npm installation, the dedicated Installation page and public
Button quickstart, then Vue integration and task guides. No installation command, runtime API,
shared presentation component, registry order, anchor, or preview/release status changes.
The concise README and consumer skill were reviewed and need no edit because this is only
source-development tooling. Both changelogs describe the change.

Documentation verification passes 33 frontend content tests, 17 PHP journey/preference tests,
formatting/lint for the changed guide, the production build, and search indexing with its
freshness check. Dependency refresh was attempted in the required
Composer-before-npm order. The compatible Composer dry run is blocked by the locked local
Dapter `1.x-dev`, which has no matching public repository version. npm's range query reports
only `@vue/test-utils` 2.5.1 to 2.6.0 as an available selected direct update; it is unrelated
and was not applied. No documentation manifests, lockfiles, installed vendor frontend copies,
or compatibility constraints change. The guide continues to consume its installed public
exports; no frontend package source changed in this task. These results do not claim that
the full documentation suite or a portable Dapter installation was verified again.

## Filoquent type-coverage compatibility on 2026-11-16

The supplied Actions log for Filoquent commit `e7a4621` resolves PHPStan `2.3.6`
and Pest type-coverage plugin `5.1.0`. Analysis, formatting, and Rector pass, but
uncached type coverage fails because the plugin calls the removed
`AnalyserResult::getCollectedData()` method. A fresh disposable installation
reproduces that same exception. The earlier local verification used PHPStan
`2.3.5` and did not exercise the new dependency resolution.

Filoquent temporarily required `phpstan/phpstan: ^2.3.5 <2.3.6` in `require-dev`.
The current [package CI requirements](package-ci.md#run-checks-locally) use Pest Type Coverage
5.1.1 or later in the 5.x series and retain the PHPStan 2.3.5 minimum for generic analysis.
Keep `composer test:types` uncached with `--min=100`.
See the [upstream PHPStan release](https://github.com/phpstan/phpstan/releases/tag/2.3.6)
and the related Front Awesome compatibility investigation above.

From the package checkout root, `composer update` applies the development bound.
Run `composer test` afterward. Fresh stable and minimum projects reproduce the
workflow's Laravel `13.*` and Testbench `11.*` preparation commands without an
existing lock. Both select PHPStan `2.3.5` and type-coverage plugin `5.1.0`, pass
PHPStan, Rector, Pint, uncached 100 percent type coverage, and 434 tests with
2,362 assertions. The 27 skips require explicit native database or Redis services.
Stable resolves Laravel `13.42.0`, Testbench `11.3.0`, Pest `5.3.5`, and Rector
`2.8.5`; minimum resolves Laravel `13.40.0`, Testbench `11.0.0`, Pest `5.3.4`,
and Rector `2.8.4`. These are observed lane versions, not new runtime minimums.
The minimum lane retains an existing Symfony Translation nullable deprecation.
No source patch, vendor patch, new suppressions, weakened test, or removed matrix
lane is needed. Linux, Windows, native databases, and native Redis were not rerun
locally for this development-tool constraint change.

The contributor guide reuses its existing shared presentation and command
examples. Consumer installation, the dedicated Installation page, overview
quickstart, middleware examples, and bundled Boost skill need no API changes.
The documentation dependency refresh was attempted with Composer before npm.
Composer remains blocked by the concurrent unavailable remote Dapter `1.x-dev`.
The npm dry run offers 15 compatible updates, which were not applied; lock-based
frontend installation reports already current. No documentation dependency or
lockfile changed in this task. Full documentation CI passes all six checks,
including 619 PHP tests and 839 frontend tests. Build and search index publication
and freshness checks pass.

## Filoquent native test connection disposal on 2026-11-16

The supplied PostgreSQL prefer-lowest Actions log reports 64 failures sharing
`FATAL: sorry, too many clients already`. The package's native test setup opens a
fresh Laravel application connection per test. Framework connection and manager
cycles, retained models, and callbacks can outlive container flushing, leaving
PDO sessions open until garbage collection. The original complete local suite did
not reproduce the runner's capacity failure. A deterministic native regression
retains old Connection objects across application reloads instead of relying on
GC timing. It observes five sessions after reload where only two are expected.

The expected two sessions are one independent observer and the fresh application
writer. Before the fix, three old managed writer/reader sessions also remain.
Counts are scoped to the random worker database, excluding other workers and
administration connections. The regression opens aliases after hook registration,
uses separate reader and writer handles, allows later teardown callbacks to query
SQL, and checks that retained Connection objects have no raw PDO handles after
application destruction. It passes 28 assertions after the repair.

The native TestCase now captures the original DatabaseManager during environment
setup and registers cleanup before later teardown callbacks. Final disposal
iterates the manager's current connections, detaches their transaction managers,
and calls Laravel's disconnect API. Capturing the original manager preserves
tests that later replace the DB facade with a mock. Detaching disposed transaction
managers prevents disconnect from repeating a deliberately failed rollback
notification after the test has already asserted the primary observer exception.
No exception is caught or suppressed by this cleanup. The worker's independent
administration PDO remains responsible for dropping its one random database at
process shutdown. SQLite-only execution and package runtime behavior are unchanged.

Stable and minimum native projects pass all configured quality gates, including
uncached 100 percent type coverage. Full PostgreSQL suites use two workers and
explicit random order with seeds `1794850026` and `1794850027` in both lanes.
Each run passes 466 tests with 2,642 assertions and four MySQL-only skips. Both
MySQL lanes pass 458 tests with 2,542 assertions and four PostgreSQL-schema skips.
The PostgreSQL server retains `max_connections=100`. Sampling every 100 ms observes
at most four worker sessions across two worker databases. Final SQL reports no
worker databases or sessions. Native runs use real private Redis; no Redis tests
are skipped. Temporary services and owned databases are removed afterward.

Validation runs on macOS with Herd PHP 8.5.12, PostgreSQL 18.6, MySQL 8.4.11, and
Redis 8.10.2. The supplied CI uses PostgreSQL 18.7 and Redis 7.4; those versions and
Linux/Windows still require the next Actions execution. The default SQLite package
suite passes 434 tests with 28 explicit native/service skips. The minimum lane
retains the existing Symfony Translation nullable deprecation. The standalone
framework-cycle probe and native regression prove retained-session cleanup, not
an exact local replay of the CI's 100-client exhaustion.

Contributor guidance reuses the existing development page and shared presentation.
Consumer installation, the overview first-file example, package source, runtime
configuration, workflow matrix, worker count, README, and consumer Boost skill need
no changes. Filoquent's rendered guide checks pass. The documentation production
build passes. Initial global documentation checks were blocked by concurrently authored Dapter
Protocol content with a dynamic CallExpression in a static searchable example.
After that separate work was corrected, the final full documentation CI passes
all six checks with 658 PHP tests and 873 frontend tests. Search publication and
freshness also pass. This task does not alter the Dapter implementation.
The required compatible dependency refresh was attempted with Composer before
npm. Remote resolution still cannot find the concurrent Dapter `1.x-dev`; the npm
dry run offers 15 updates, not applied, and lock-based frontend copies are already
current. No documentation dependency constraints or lockfiles change here.

## DataView completion verification on 2026-11-18

The consumer journey starts in Laravel 13.36 or later within 13.x, PHP 8.5,
Inertia 3, Vue 3.5, Vite, a web session, and CSRF protection. Install Front Awesome
and Dapter through Composer before installing their vendor frontend dependencies.
Configure the public Vite plugin, styles, and Ziggy route before the first table.
The tutorial defines 23 notebooks and displays ten initially. Its next page shows
notebooks 11 through 20. Task guides then cover layouts, query controls, ordering,
selection, paging, actions, adapter state, live updates, and the API reference.
Both former development routes and their eight section destinations remain usable.

Dapter 1.0.0-alpha.1 and Front Awesome 1.0.0-beta.3 are published prereleases.
The published Front Awesome package contains the original three-layout DataView.
The additional controls, selection, grouping, localization, and recovery behavior
are unreleased Front Awesome changes. The documentation checks the imported public
component before mounting these additions and keeps the released examples usable.
The beta installation command explicitly allows both prereleases on Composer's
default-stable hosts. It does not lower the application's overall stability policy.

The compatible refresh ran Composer before npm. Composer updated Front Awesome
from beta.2 to beta.3; Dapter and the main Laravel, Inertia, Head, and Pest
dependencies were current. The npm range dry run was current. A stale Front Awesome
development copy of Dapter had eight older files despite its alpha.1 version label.
Refreshing that copy restored source parity. The DataView type checker now rejects
such stale Composer/npm copies with an actionable installation message. Public
peer constraints and canonical vendor-file dependencies remain intact.

The documentation was built and exercised with the actual beta.3 Composer archive
and its matching npm copy, then with an explicitly installed local `1.x-dev`
candidate. Each passed four production-browser sessions at 390 and 1440 pixels in
light and dark themes. The portable public Composer lock was restored byte for
byte after each candidate installation. The local preview remains installed;
no candidate version was fabricated or published.

The implementation keeps query validation, transport, state restoration, polling,
and live updates in Dapter. Typed slots carry the exact borrowed handle. Selection
uses current occurrences and honors a parent that rejects an update. Applications
still scope prefilled keys and map authorized action operands explicitly. Native
selection controls do not contribute fields to a containing application form.
Native disclosure and layout controls expose their state on the focusable node;
Web Awesome host attributes alone did not establish that behavior. Document IDs
remain distinct across Vue roots. The ordering editor uses Web Awesome tokens and
was checked at 320 and 375 pixels in RTL without horizontal overflow.

Front Awesome passed PHPStan, Pint, full PHP type coverage, 216 PHP tests with
719 assertions, 322 frontend unit tests, and 389 Chromium tests. Two existing
licensed Pro cases remain unavailable in that package's Core test installation.
Vue type checks include actual macro compilation and invalid public API examples.
Build, optional-peer consumers, and base and PrimeVue theme consumers passed.
The final spacing refinement also passed the focused browser and style checks.
Dapter passed its complete PHP command with 689 tests, 7,971 assertions, PHPStan,
Pint, and full type coverage. Its runtime source was not changed.

The complete documentation CI passed all six Maintainer checks and Rector, with
1,016 PHP tests, 119,263 assertions, and 1,347 frontend tests. The demo checker
covered 488 Dapter settings with 213 backend and 193 frontend checks. Standards,
portable distribution, source synchronization, production build, and search-index
publication and freshness checks passed. Real HTTP search found guide prose,
source code, and reference-table content at their registered destinations. The
existing time-limited picomatch advisory exception was retained without extension.
Boost discovered the archived package skill and refreshed an identical consumer
copy. Dapter's README and skill example returned their documented two products.

Independent Astra reviews produced browser repros for the input, selection,
numeric, form, and accessibility defects, and a clean-host dependency solve for
the installation correction. Review used the same model family at the user's
request. Polling used real requests. Controlled Echo tests cover the new DataView
push demo's subscription lifecycle. A separate desktop production run also
verified actual private authorization, acknowledgement, and `dapter.updated`
delivery on the same socket and channel. The selected `notebook:1` kept its
identity while its Resource and selection footer changed, with no additional
listing request. Stop closed the connection; no separate unsubscribe frame was
observed. The general Dapter live suite verified 44 Resource, live, and polling
scenarios with actual transport. Hardware IMEs, assistive technology applications,
and complete SSR hydration were not exercised. No commit, release, or deployment
was performed.

The final `npm run test:browser` completed all 22 scripts in one uninterrupted
production run. This includes the four DataView sessions after the spacing
refinement, the component catalog, application forms, printing, localization,
preferences, native paging and writes, actual Dapter live transport, infinite
loading, PostgreSQL comparisons, literal search, and guide navigation. The original
Vite hot-file reference was restored after the run.

A final smoke check also exercised the active Vite development preview. Its cached
beta.3 transform was invalidated through the existing configuration watcher without
changing configuration content. The preview then exposed the candidate controls,
returned a real listing response, and rendered the final ordering spacing without
browser errors.

## Vector search and UUID browser state preview, 2026-11-18

The unpublished Dapter preview adds exact PostgreSQL pgvector L2 field filtering.
It accepts prepared float32 coordinates and an inclusive server-owned distance
limit. Source scopes, existing ordering, counts, and paging remain in force.
Embedding generation, relevance ranking, approximate retrieval, and snapshots are
outside this contract. The focused [vector guide](../resources/js/pages/docs/dapter/VectorSearch.vue)
uses executable code snippets and native package tests without an interactive
vector demo, as requested. The demo checker permits only the exact vector settings
listed by that exception and continues to discover the full public API.

Ordinary protocol 2 navigation stores immutable UUID snapshots in localStorage.
The default lifetime is 240 minutes. A source can override the duration or supply
a Carbon deadline and a query key. SHA-256 versions include source, ancestor, and
trait declarations. Configuration and external dependencies are excluded from
this simplified version. The authorized server checks the accepted version before
applying restored criteria. Expired or missing references return to defaults.
Portable share links import a fresh local UUID. Front Awesome consumes the same
handle and offers a JSON vector input without a second persistence implementation.

The reader starts from a supported Laravel 13, PHP 8.5, Inertia 3, Vue 3, and Vite
application. Composer precedes vendor-file npm installation. Dapter's Installation
page and existing notebook quickstart remain before task guides. The first page
contains Notebook 01 through Notebook 10. The collection-backed navigation and
DataView examples need no PostgreSQL service. PostgreSQL, pgvector, a matching
vector column, and prepared embeddings are prerequisites only for vector search.
Public exports and existing shared documentation components supply the examples.
The walkthrough continues through field search or the focused state guide.

Dapter passed its full Composer validation with 753 tests and 8,135 assertions,
PHPStan, Pint, and 100 percent type coverage. Its Maintainer gate ran all six
checks without skips, including 552 frontend runtime and type tests. Distribution
checks verified packed source and built consumers with stable and minimum peers,
Bundler and NodeNext resolution, and the current consumer skill. PostgreSQL 18.6
with pgvector 0.8.7 passed 11 native tests and 83 assertions in an isolated local
database. Regression tests cover class changes, deployment races, elapsed Carbon
deadlines, decimal threshold precision, and effective read and write connections.

Front Awesome passed 216 PHP tests and 719 assertions, PHPStan, Pint, full type
coverage, 322 frontend unit tests, its consumer build, and all six Maintainer
checks. Its broad Chromium run passed 389 tests and retained the two existing
licensed Pro skips. One unchanged printing scenario exceeded its 15-second test
deadline while other checks were running. The same printing file passed all 16
tests in isolation without code or timeout changes. The affected DataView file
passed all 34 tests, including automatic cleanup of an invalid UUID reference.

Documentation coverage discovered 510 Dapter settings and passed 215 PHP tests
with 2,100 assertions plus 192 frontend checks. The final documentation frontend
run passed 1,354 tests across 115 files with bounded workers. The final focused
PHP run passed 62 tests and 113,743 assertions, covering every file that failed
in the earlier broad run. That earlier run passed 1,024 of 1,031 tests before the
new ancestry expectation, temporary font-manifest interference, and concurrent
Permit catalog updates were resolved. It was not rerun in full. The late protocol
header prose passed three focused frontend tests. Types, PHPStan, Pint, formatting,
lint, and demo synchronization passed. Search publication and freshness checks
passed after the final protocol text.

The Vue navigation, paging, composed-source, and DataView browser scripts passed
in desktop and mobile sizes with light and dark themes. They verify actual HTTP,
UUID storage, expiration, history, scroll restoration, and portable import in a
separate browser context. The final Vue run also checks that the vector guide
starts no requests, has no interactive demo, exposes its code, and has a working
search destination. A final active Vite smoke verified UUID navigation and an
`s1.` share link with no console or page errors. The original `public/hot` file
was restored without a configuration touch.

The compatible Composer dry run proposed three transitive patch updates but also
replaced the installed unpublished Front Awesome preview with published beta.3,
which lacks the required new API. Public manifests and locks were preserved.
Temporary Composer manifests installed the local package previews before npm
refreshed their vendor-file copies. Those manifests were removed from the
repositories and index. Installed direct npm dependencies already matched their
compatible wanted versions. New majors and the pinned Vite Plus release were not
forced. Checks used the existing Herd PHP 8.5 executable because the Homebrew
launcher references a missing tidy library. No system installation was changed.
Both current Composer archives include their consumer skills, and Boost discovers
both installed skills. Manual request review matches Dapter vector and state work
and Front Awesome DataView controls while excluding unrelated database indexing.

Independent Astra review reproduced and corrected the version race, native
threshold rounding, effective-PDO dimension validation, and interpolated-brace
hash defects. A separate same-family review checked the decision trail and
corrected a report link to the actual focused passing run. Evidence and the
append-only trail remain under the workspace's local
`.audit/dapter-vector-state/` directory. Concurrent Permit and pre-existing
DataView changes were preserved. No commit, release, or deployment was performed.

### Front Awesome scrollbar source preview

The beginner path starts in an existing Laravel, Inertia, Vue, and Vite app.
The Installation guide still puts Composer before the vendor-file npm command,
then configures Vite and Web Awesome Core. Its first page renders a styled
`Hello from Front Awesome` button and links to the Button guide. The scrollbar
example follows both imports in the shared theme guide. It reuses
`DemoFrame` and the public `fa-scrollbar` class. A named native section owns
keyboard focus and scrolling.

From the documentation root, the compatible dependency checks ran in this order.

```sh
composer update 'artisan-toolbox/*' laravel/framework inertiajs/inertia-laravel laravel/head 'pestphp/*' --with-all-dependencies --dry-run --no-scripts --no-interaction --no-progress
npm outdated vue '@inertiajs/vue3' '@inertiajs/vite' tailwindcss vite-plus '@vue/test-utils' happy-dom --json --fetch-retries=0 --cache /tmp/fa-scrollbar-npm-cache
npm install --dry-run --ignore-scripts --no-audit --no-fund --fetch-retries=0 --cache /tmp/fa-scrollbar-npm-cache ./vendor/artisan-toolbox/front-awesome ./vendor/artisan-toolbox/dapter ./vendor/artisan-toolbox/mosaicast ./vendor/artisan-toolbox/qztray
```

Packagist and the npm registry were unavailable by DNS. The npm installation
dry run also reported an unresolved Inertia peer. The local verification copy of
`tailwind.css` came from packing the Composer-linked Front Awesome checkout and
matched it byte for byte. No dependency versions or locks changed for this
preview. The build used Tailwind 4.3.5, Vue 3.5.45, Inertia Vue 3.11.0, and Web
Awesome Pro 3.15.0.

The Front Awesome consumer build and theme suite passed with Web Awesome Core
and optional PrimeVue. A separate build with the installed licensed Web Awesome
Pro passed the same light, dark, keyboard, and forced-color checks. On the
documentation build, Chromium loaded the Installation guide and the shared
theme demo. End brought Notification 12 into view in both panels. The computed
colors differed across the modes and returned to `auto` in forced colors.
The demo fit a 390 px viewport and exposed the exact live source. The full
`composer ci:check`, `npm run build`, and `npm run demos:check` passed.

The broader documentation browser chain reached and passed the Front Awesome
demo check. A later Dapter script required a `.test` hostname. Resuming against
a local `.test` hostname passed the action, composed read, and paging checks.
The live demo returned HTTP 401 with the temporary array cache. The infinite
cursor demo counted one additional read and the guide navigation check found
64 links against an expectation of 63. The permission editor browser check
timed out while waiting for the unsaved-change count. The scrollbar demo uses
a static list.

### Vue scrollbar directive and brand variant

The Installation guide, the first public Button example, and the shared theme
prerequisites still precede the scrollbar example. The guide shows plugin
registration and the directive. The live documentation frame uses the public
CSS class. This lets the site retain its separate preferences, flash, and
Mosaicast setup. The package fixture installs the plugin and exercises the
directive itself.

`npm run test:scrollbar` passed in Playwright Firefox 159.0 and WebKit 27.2
on macOS. Both engines followed local Tailwind brand values through light and
dark mode. End scrolled the named region, and a reactive variant change kept
the region scrolled. The browser test also checked the neutral directive and
an unstyled control. The Chromium production theme suite checked system
styling in forced colors. The full Chromium package run passed 424 tests, with
two skips. The workflow runs the Firefox and WebKit check alongside the
existing Chromium coverage.

The dependency refresh repeated the Composer dry run and the two npm commands
above in that order. Composer and npm registry DNS failed. The vendor-copy npm
dry run reported the unresolved Inertia peer. Packing the Composer-linked
Front Awesome source supplied the stylesheet for the documentation build.
The build, documentation CI checks, and Front Awesome browser catalog passed.
The rendered scrollbar frame matched the brand token in both modes and fit a
390 px viewport. Boost discovered the updated skill, and the Composer archive
contained the skill, directive, and stylesheet.

### Overlay scrollbar directive and options

The shared theme guide follows the existing Composer-first installation and
Button quickstart. The example uses `v-scrollbar.brand`, and the documentation
frame uses the exported directive without replacing the site's preference and
realtime plugins. The public modifier selects the thumb token. An options
binding updates the OverlayScrollbars instance on the existing viewport.

The package pins OverlayScrollbars 2.17.1. The Composer-compatible refresh
attempt and `npm outdated` checks could not resolve their registries. A targeted
lock-only npm install resolved the new package. The documentation lock retains
the Composer vendor path. The installed frontend copy was refreshed from the
packed Composer-linked source and the resolved OverlayScrollbars distribution.

The browser fixture checks the five theme colors, reactive option removal,
native scroll events and coordinates, sticky layout, and Vue HTML replacement
in Firefox and WebKit. The production theme fixture checks resize-driven axis
changes and toggles forced colors while the region is scrolled. Chromium
keeps the scroll position when the native bar replaces the overlay. The built
documentation demo verifies thumb expansion, named keyboard scrolling, local
brand colors, and fit at 390 px.

### Dedicated scrollbar guide

Appearance and branding lists the scrollbar guide after branding. The
installation and first Button example still precede the shared theme
prerequisites. The original shared-theme fragment resolves to the registered
scrollbar guide. Its live frame uses the public Select and Option wrappers and
the public directive interface. The demo source and the quickstart are
searchable through the same guide.

The compatible Composer dry run and `npm outdated` commands above could not
resolve Packagist or the npm registry. The installed Front Awesome manifest,
public directive entry, runtime, and stylesheet match the Composer-linked
source. OverlayScrollbars 2.17.1 is installed. The build and
`composer ci:check` passed without lock changes for this guide.

Chromium followed the previous fragment, scrolled both panels with the
keyboard, changed both thumbs without resetting the scroll position, toggled
auto-hide, and scrolled by clicking the track. The catalog browser run passed.
The frame also fit a 390 px viewport. The Boost skill links to the new guide.

### Brand scrollbars for documentation navigation

The sidebar and the desktop outline reuse the Front Awesome directive on
their existing scroll regions. The welcome page and article use document
scrolling for links, browser history, and active headings. This adoption
changes the documentation shell. The package's API, installation, and first
Button example still follow the documented path.

The compatible Composer and npm refresh checks above failed to resolve
their registries. The installed Front Awesome manifest, entry point,
directive, and stylesheet matched the Composer-linked source.
OverlayScrollbars 2.17.1 was present.

The production build, `composer ci:check`, and browser application check passed. Chromium scrolled
the sidebar and the desktop outline without moving the article. The mobile
menu remained fixed and Escape restored focus to its trigger. The outline
returned to document flow on mobile. Deep links and Inertia history kept
their existing scroll behavior.

### Front Awesome scrollbar default

The scrollbar guide remains under Appearance and branding. A reader starts in a
Laravel 13 application with Inertia, Vue, and Vite. The Installation guide
puts Composer before npm, then loads the frontend styles and renders the
`Hello from Front Awesome` Button. The Button guide follows the installation
example. For scrollbars, the shared theme and Vue plugin precede the first
example. The new configuration example shows how to change the color of bare
`v-scrollbar` in the existing `withApp` hook.

The DataView table, print paper stage, and permission editor use the package
directive on their existing HTML viewports. The outer print drawer scrolls
inside Web Awesome's shadow DOM. Documentation navigation has its own explicit
brand modifier.

The compatible Composer dry run and npm refresh check failed to resolve
Packagist and the npm registry. No dependency versions changed. The affected
frontend files in the npm copy were refreshed from the Composer-linked source.
Front Awesome reports 1.0.0-beta.3 and the new option is a source preview.
OverlayScrollbars 2.17.1 is installed.

Both production builds, Front Awesome's PHP and frontend checks, and
`composer ci:check` in the documentation passed. Browser checks covered
the app default and explicit neutral override in light and dark on Firefox
and WebKit. Chromium verified the native DataView table and horizontal
overlay under the shared theme, the print preview, and the permission
editor. The documentation browser checks exercised navigation and the
interactive scrollbar demo. The document printing demo completed without
contacting QZ. The permission demo saved and reloaded a change and opened a
read-only account on mobile. Its browser context now requests English so the
English assertions are independent of the host locale.

The frontend coverage run passed 783 tests with two skips. It measured
90.38% statement coverage and 94.5% line coverage for `scrollbar.ts`.

## Permit catalog and minimum dependencies

The Permit `prefer-lowest` job reported seven PHPStan 2.2.8 errors. Conditional array unpacking
erased the distinction between each named catalog field and the union of all field values.
Building the required fields first and adding `icon` when present preserved the array shapes.
An isolated install matched the logged dependency versions. PHPStan reported zero errors after
the change. The public editor test verifies localized ordering and optional icons. It checks
the same response with discovery pointed at an empty path and the catalog loaded from cache.

The [shared package development skill](agent-standards/skills/atb-package-development/SKILL.md#check-for-the-same-failure-across-packages)
now requires a cross-package check. The audit covered all nine packages in the documentation
catalog. Core, Dump to Console, Front Awesome, Mosaicast, and QZ Tray did not use the affected
shape construction. Their installed analyzers passed. Their installed extensions require a
newer analyzer than 2.2.8, so these passes cover the installed resolutions. Dapter and Filoquent
use conditional unpacking and passed with PHPStan 2.3.5, the lower bound in both manifests.
Maintainer's comparable expression builds a list of flags. Its PHPStan 2.3.5 check passed.

Permit passed its PHP checks with the lowest and installed stable dependencies. The stable
checkout also passed its six Maintainer checks, Vite+ release build, and committed distribution
comparison. The PostgreSQL and Redis integration test passed with disposable local services.
`actionlint` accepted the workflow. The GitHub-hosted matrix and the MariaDB and Memcached
service pair still need a runner with those services.

The documentation dependency refresh attempted the Composer dry run before the npm dry run.
Packagist and npm failed to resolve their registry hosts, so the existing locks and installed
copies supplied validation. The documentation Pest and Vitest suites and the standalone standards
checks in `docs`, Dapter, Filoquent, and Permit all passed.

## Core continuous integration and distribution

The lowest and stable Composer resolutions both failed PHPStan with a 128 MB PHP memory limit
in clean local checkouts. After raising the static analysis limit, Pest's stable type coverage
still returned 100% and exit code zero despite two workers running out of memory. The JSON
report omitted `CoreServiceProvider.php` and `HandleInertiaCrossDomainVisits.php`.

Core now sets a 2 GB PHPStan limit and a 512 MB Pest type coverage limit. The coverage command
runs without the Pest result cache and fails if any PHP file in `src/` is missing from the JSON
report. It rejected the incomplete report and accepted the report containing all nine files.
PHPStan, Pint, type coverage, and 29 Pest tests passed with both dependency resolutions.
The Dapter type coverage command also returned success after memory errors at 128 MB. The
[Dapter review](#dapter-continuous-integration-and-distribution) covers that fix. QZ Tray
reproduced the PHPStan memory failure and now uses a 2 GB analysis limit. See the
[shared CI verification](#shared-ci-verification) for the follow-up checks.

The Ubuntu stable job installs a Git ZIP of the checked-out Core commit into a temporary Laravel
13 application through Composer. The check confirms automatic package discovery by running
`Arr::sift()` and inspects the installed Boost skill file. The valid ZIP passed. Excluding the
skill from the archive made the check fail. `actionlint` accepted the workflow. The hosted
run for `cc64f81` passed both Windows jobs. Both Ubuntu jobs reported all nine files before
the cleanup step failed because Rector had replaced `unlink()` with Laravel's `File` facade.
The coverage command runs as a standalone script and now uses a concrete `Filesystem` instance
for cleanup. The fixed command passes locally in both Composer resolutions. A Rector dry run
leaves the cleanup intact. The [initial workflow run](https://github.com/artisan-toolbox/core/actions/runs/44629689450)
records the failing jobs.

The documentation dependency dry runs used Composer before npm. Composer proposed Permit
`1.0.0-beta.2` and `guzzlehttp/psr7` `3.5.1`. The documentation's direct Vite+ pin remains
`1.6.0`. The Composer-delivered npm copy dry run proposed reinstalling Front Awesome at the same
version. These unrelated package updates were left pending.

## Dapter continuous integration and distribution

The Windows lowest job spent 110 to 156 seconds building and verifying the frontend distribution
across three successful workflow runs. The npm archive tests started a separate Node process for
each runtime proof. Inertia kept those processes alive for its two-second form success indicator.
The archive fixtures now set that indicator to expire immediately in their isolated processes.
[Most recent baseline run](https://github.com/artisan-toolbox/dapter/actions/runs/44431096563)

Five alternating before-and-after runs on macOS with Node 24.22.2 used the same archive, compiler,
and resolved peers. The median for `npm run check:dist` fell from 57.48 to 23.97 seconds, a 58%
reduction. The ranges were 54.90 to 60.22 seconds before and 22.33 to 26.21 seconds after. Each run
passed the same source and built runtime proofs and both TypeScript resolution modes against both
peer sets. These timings measure the local archive check. The next hosted run will measure the
effect on the full workflow.

The matrix keeps separate gates for PHPStan, Pint, Pest, PHP type coverage, frontend checks,
and package distributions. `npm test` runs the frontend runtime and type tests together.
An invalid assignment added to a disposable type-only test made that command fail. The release
and CI commands now run the type tests once per job.

At 128 MB, the original Pest type coverage process returned success even though its JSON report
contained just one of 177 source files. The new coverage check uses 512 MB and fails if the
uncached report omits any file. It rejected the captured incomplete report. The installed stable
and freshly resolved lowest PHP dependencies pass analysis, formatting, 100% type coverage over
all 177 files, and 757 Pest tests. The lowest resolution also exposed a Symfony Translation
deprecation on the standard output of the locale fixture. Its command now sends PHP diagnostics
to standard error so the test can decode the JSON response and assert all three outcomes.

The native suite passed 464 tests with disposable MySQL 8.4 and PostgreSQL 18 with pgvector 0.8.7.
The local Maintainer gate passed all six checks. Both frontend resolutions passed all 552 tests
and the release build. The stable release build reproduced the Git distribution. Both Git and
Composer archives passed the package rules. `actionlint` accepted both workflows.

The cross-package check reproduced the same false success in QZ Tray. At 128 MB, one of eight
files reached its report after a worker ran out of memory. All eight appeared at 512 MB.
Core already enforces report completeness. Permit reported all 31 files at 512 MB. Dump to
Console, Mosaicast, and Filoquent reported every eligible file. The Pest plugin excludes files
containing `trait `, which also excluded one command in Front Awesome because the text appears
in a user-facing string. Maintainer has no Pest type coverage command. The QZ Tray and Front
Awesome findings remain open in their owning packages.

Front Awesome's translation subprocess passed with the same Symfony Translation version.
Filoquent and Maintainer passed their comparable subprocess checks with installed dependencies.

The beginner path uses a Laravel application with Inertia, Vue, Vite, and session middleware.
The Installation guide places Composer and Ziggy before the Composer-delivered npm package and
Vite configuration. The quickstart test exercises the public read route and verifies the first ten
notebooks, subsequent pages, and the end of the listing. The overview links to field search and
shared Vue controls. The contributor edit reuses the existing guide components and adds no public
API, demo, or consumer skill requirement. The Dapter demo check verified 510 settings and passed
216 PHP tests and 192 frontend tests with the isolated PostgreSQL comparison fixture. The full
documentation suites passed 1,061 PHP tests and 1,362 frontend tests.

The documentation dependency dry runs used Composer before npm. Composer proposed Core 1.4.0,
Permit 1.0.0-beta.2, and `guzzlehttp/psr7` 3.5.1. npm proposed reinstalling the same
Composer-delivered Front Awesome version. The direct Vite+ pin resolves to 1.6.0. The validation
used the existing locks and installed copies.

The Dapter stable lockfile returned zero npm advisories. The `vue@3.5.40` compatibility test
resolution reported the same server-renderer advisory against two package entries. The patched
3.5.42 release is within Dapter's declared Vue range. All five workspace lockfiles that include
the renderer resolve 3.5.45. [Vue security advisory](https://github.com/advisories/GHSA-g2v6-rqmx-r4w6)

## Shared CI verification

The [package CI guide](package-ci.md) defines the common checks and documents the platform and service requirements. `npm run ci:lint-workspace` validated the ten workflow checkouts with `actionlint`. Running it against an isolated malformed workflow produced a nonzero exit code.

Dump to Console, Mosaicast, and QZ Tray resolved published Core archives in both Composer compatibility lanes. The package type coverage checks reject a successful Pest process that reports only part of the source inventory. A QZ Tray run at 128 MB reproduced the false success with one file out of eight. The new check analyzed all eight. Permit reported all 31 source files with its existing 512 MB command. Front Awesome's check declares the two files that Pest omits. Filoquent's Redis, MySQL, and PostgreSQL checks still execute against disposable services.

The documentation's portable lock installed in a separate source copy with an isolated Composer home. The locked build, search publication and freshness checks, dependency audit, Rector, and all six Maintainer checks passed. Pest ran 1,061 tests. Vite Plus ran 1,362 tests. The focused guide suite ran 124 tests across installation, overview, and contributor content. The Dump to Console overview uses concrete values that can be sent to its local listener without an application model. Those pages continue to use the existing documentation components and the packages' public entry points.

The compatible dependency dry runs ran Composer before npm. Composer proposed Core `1.4.0`, Permit `1.0.0-beta.2`, and `guzzlehttp/psr7` `3.5.1`. npm proposed 15 version updates and a same-version reinstall of the Composer-delivered Front Awesome copy. The installation and checks used the committed lockfiles. The GitHub-hosted Windows and browser jobs for the changed workflows require a fresh run to verify timing and runner behavior.

### Published package refresh and bounded test workers

The package registry describes the published Core 1.4.1, Dapter 1.0.0-beta.3,
Dump to Console 1.2.1, Filoquent 1.0.0-beta.7, Front Awesome 1.0.0-beta.6,
Maintainer 1.14.3, Mosaicast 1.3.1, Permit 1.0.0-beta.2, and QZ Tray 1.5.1
releases. The installation routes still lead to working examples. The
permission editor guide and browser check exercise the published catalog
icons and role navigation through the existing demo and public editor.

The compatible Composer update preview found the application lock current.
After `composer install`, a single `npm install --package-lock-only` with
the four `./vendor/artisan-toolbox/` paths synchronized the Composer-delivered
frontend packages. The npm refresh aligned the Vue runtime and compiler at
3.5.46. The Vite+ and Vite core pins remain at 1.6.0. A clean `npm ci` and
`npm run audit:check` passed with the refreshed lock.

The Maintainer gate ran all six tools with zero skips. Pest passed 1,061 tests
and Vitest passed 1,362 tests. The production build and search freshness check
passed. The Dapter demo check verified 510 discovered settings. The Front
Awesome demo check verified its source frames, and Chromium verified the
permission editor's grant, save, and CSV export flow.

Five alternating calls through the same Maintainer CLI compared serial Pest
with four processes in Dapter on macOS. The median fell from 9.54 to 3.71
seconds. Serial runs ranged from 7.85 to 12.79 seconds, and parallel runs from
3.35 to 5.91 seconds. Each run passed all 758 tests and 8,146 assertions.
Core, Dump to Console, and Mosaicast had overlapping ranges and retain serial
defaults. These local timings cover the runtime suite. The hosted matrix also
includes setup, analysis, distribution, and Windows runners.

### PHP 8.6 documentation verification

The catalog covers the nine Artisan Toolbox releases that test PHP 8.5 and 8.6.
Each release tag on GitHub matches its Composer lock reference. PHP 8.5 remains
the minimum in the PHP 8.x series.

The [package learning paths](#artisan-toolbox-release-refresh-on-2026-11-18) now
start on either tested PHP version. Chromium on Herd opened every package
overview and installation guide, checked the displayed Composer command against
its release, and ran the Dapter quickstart through Notebook 11 on the second page.
The guides use the existing requirements, navigation, and installation components.
The published Maintainer executable reports `1.14.4` with `--version`.

Run `composer update --with-all-dependencies --dry-run --no-scripts` from `docs` to
check compatible versions. The refresh found the lock current and reported no
advisories. Composer still reports `symplify/rule-doc-generator-contracts` as
abandoned. After `composer install --no-scripts`, `npm update --dry-run --ignore-scripts`
proposed reinstalling same-version Vitest dependencies. The four installed npm
copies match their Composer distributions. The npm advisory check passed.

`composer ci:check` passed on PHP 8.5.13 and 8.6.0. Each run passed Rector and
all six Maintainer checks, including 1,061 Pest tests and 1,362 Vitest tests.
PHPStan reported zero analysis errors on both runtimes. Its optional macOS Turbo
extension failed to load on PHP 8.6.

The production build and search index freshness check passed. The local search
endpoint returned guide sections for `PHP 8.6`. The Dapter coverage check verified
510 settings and ran the backend and frontend demos.

## DataView table feedback preview on 2026-11-23

The [table feedback example](../resources/js/pages/docs/front-awesome/DataViewLayouts.vue)
uses the development checkout delivered through Composer. It checks for the new public
prop before starting a source. With the published beta.9, the example shows its source
and explains which checkout supports interactive feedback.

From `docs`, a Composer dry run for `artisan-toolbox/*`, Laravel, Inertia and Pest
proposed Front Awesome beta.9, Inertia Laravel 3.8.0 and five transitive updates.
The npm dry run for Vue, Inertia, Playwright, Vue Test Utils and Vite Plus reported
the selected packages up to date. The browser check used an npm package built
from `vendor/artisan-toolbox/front-awesome` and installed locally with `--no-save`.
The documentation lockfiles moved to Front Awesome beta.9, which fits the three-column
schedule at 390 pixels. The other Composer packages retained their locked versions.

Chromium exercised the production build at 390 and 1440 pixels in light and dark
themes. A delayed notebook search showed four skeleton rows after a four-record page.
Clearing a search with no matches showed the configured two rows. Opening the empty
source produced one message cell spanning the two data columns and the selection column.
Searching the documentation index for `skeleton` returned the `table-feedback` section.

After publication, a targeted Composer update and npm vendor-path refresh moved
the Front Awesome locks to beta.10. A clean npm install, dependency audit, build,
search index check, and Maintainer quality checks passed against the published
package on PHP 8.6. The DataView browser suite verified the table feedback demo
at both widths in both themes using that package.
