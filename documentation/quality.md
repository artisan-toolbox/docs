# Run project quality checks

The application installs Maintainer, Rector, Laravel Rector rules, Pest, Pint, and Larastan/PHPStan as Composer development dependencies.
Development and CI require PHP 8.5 because Maintainer requires PHP 8.5.
Frontend checks use the existing Vite Plus and Vue tooling.

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

The project `.npmrc` routes `@web.awesome.me` packages to the Web Awesome Pro registry on Cloudsmith.
Before installing Pro dependencies locally, export `WEBAWESOME_NPM_TOKEN` in your shell.
npm reads this variable from the process environment, not Laravel's `.env` file.
The committed configuration contains only `${WEBAWESOME_NPM_TOKEN}`, never the token value.
GitHub Actions supplies the variable from its repository secret during `npm ci`.

`install-links=true` installs local `file:` dependencies as packages rather than directory links.
The existing `ignore-scripts=true` setting remains enabled.

Maintainer is installed under `vendor/bin/maintainer`.
Use the published Composer distribution and commit the lock file so another developer or CI can install the same package versions.
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

The PHP badge follows the production requirement, `^8.3`. Development and CI require PHP 8.5.
The release badge remains `in development`, and the tests badge follows `1.x`.

Keep the identity class in the root of the production `App\` PSR-4 directory.
Maintainer discovers it without a Laravel service binding and constructs it without arguments.
The application does not load this tooling class during normal requests, so Maintainer remains a development dependency.

`tests/Unit/MaintainerIntegrationTest.php` runs the installed standalone CLI against a temporary copy of the production application sources.
It regenerates a removed header, compares it with the committed README, preserves unmanaged content, verifies the exported version, and checks repeated execution.
The test also verifies that the real README stays unchanged.
The standalone binary preserves fixture isolation because the Composer proxy resolves the real consuming project from its autoload path.

## Run checks in GitHub Actions

The tests workflow installs locked Composer dependencies before running `npm ci` with Node.js 22.
The frontend installation receives `WEBAWESOME_NPM_TOKEN` from the repository secret with the same name.
Keep the token in GitHub secrets rather than repository files.
The current frontend dependencies do not require that token.

The workflow prepares the application key, clears cached configuration, and builds client assets.
It then runs `composer rector:check` and invokes Maintainer directly with `php vendor/bin/maintainer quality:check --no-interaction`.
This sequence preserves the checks provided by the local `composer ci:check` command.

The job uses `APP_ENV=testing`, array cache, session and mail stores, synchronous queues, and SQLite in memory.
Pest creates its own test schema, so this workflow does not migrate a persistent database.

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
Quality tools, including Maintainer and Deployer, are development dependencies and are absent after `composer install --no-dev`.
Run their commands from a development or deployment environment that installs those dependencies.

The user configures and executes deployment separately.
This tooling installation does not create `deploy.php`, SSH identities, server settings, releases, or commits.
