# Run project quality checks

The application installs Maintainer, Rector, Laravel Rector rules, Pest, Pint, and Larastan/PHPStan as Composer development dependencies.
The application requires PHP 8.5 in production, development, and CI. Its installed Front Awesome, Core, and Mosaicast dependencies require that version, as does Maintainer's development tooling.
Frontend checks use the existing Vite Plus and Vue tooling.

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
3. Resolve the application's declared dependencies through their public distributions. Front Awesome may use the explicitly approved `^1.0@dev` preview exception while no stable release is available; keep the project-wide stability policy unchanged. The resulting lock pins its actual remote commit.
4. Run the distribution check and install Composer dependencies normally. If Composer changed a frontend package version, rerun its documented `npm install` command with all required `./vendor/` paths together and retain the updated npm lock. Then run `npm ci` against the Composer-delivered frontend directories.
5. Run the real quality suite, production build, and search indexing checks. Inspect the actual installed exports. A remote URL and a successful dependency installation do not establish that the application can build.
6. Only after those checks pass, integrate the verified manifest and lock changes into the application. Retain one release lock, not a parallel production manifest or lock file.

The 2026-11-06 release candidate resolves public archives for Core `1.2.1`, Dump to Console `1.1.1`, Maintainer `1.11.0`, Mosaicast `1.2.1`, QZ Tray `1.3.0`, and Front Awesome `1.0.0-alpha.1`. The Front Awesome archive at commit `a55e06f` supplies the consumed `./vite`, `./tailwind.css`, and `./web-awesome-tailwind` exports and its consumer skill. The application permits `^1.0@dev` for Front Awesome only; project-wide minimum stability remains `stable`. Composer installation, paired vendor-path npm installation, fresh `npm ci`, the complete quality gate, production build, and search indexing passed in an isolated consumer without sibling packages or private credentials. All six Maintainer checks ran with none skipped. The verified locks are the application's release locks; local Composer routing remains unchanged.

All six documented packages are explicit Composer dependencies. Web Awesome Core `3.14.0` is the selected styling dependency; this check does not establish Pro adapter compatibility. Package publication is a separate operator-approved action.

### Refresh dependencies before authoring

Attempt compatible updates of Artisan Toolbox packages, Laravel, Inertia, Laravel Head, Pest, and the frontend runtime and test tools before editing their documentation. Run Composer before refreshing the `file:vendor/` frontend copies. Record changed versions or why no update was possible. Do not force a major upgrade, rewrite a lock reference, or label a local branch as a stable release to make an update succeed.

The 2026-11-06 refresh checked the declared Laravel, Inertia, Head, Pest, Vue, Tailwind, and Vue test-tool ranges; they were already current within those ranges. The same change installed Horizon `5.50.1`, Reverb `1.12.0`, and the remaining documented packages. Reverb's supported dependency range required Composer to resolve Guzzle PSR-7 `2.x` instead of the previously locked `3.x`; no dependency constraint was bypassed.

The npm audit reports five moderate entries in the development-only Vue test utility dependency chain. The offered repair falls outside the declared test-tool range. No forced upgrade, transitive major override, or disabled audit is applied. Keep this recorded until the test utility publishes a compatible repair. The 2026-11-06 production-only audit reports no advisories.

See [Mosaicast demos](mosaicast-demos.md) for the running comparison and [queues](queues.md) for the Horizon worker requirements. Installing the packages does not start Redis, Reverb, or Horizon.

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

The browser step complements Maintainer's six configured checks; it does not replace them or the earlier distribution lock check. The current local development lock must pass that distribution check through a real public package resolution before the workflow can reach dependency installation. Passing local browser checks does not make a local-path lock portable.
