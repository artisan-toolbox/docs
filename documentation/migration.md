# Laravel documentation migration

This plan tracks the migration from `docs_old` to the Laravel application in `docs`.
The published documentation stays authoritative until the replacement passes its migration checks.

## Workflow for the first unit

- [x] Read the Principles section of the poteto-mode skill.
- [x] Phase A: Frame.
- [x] Phase B: Design the workflow.
- [x] Phase C: Run the loop.
- [x] Phase D: Keep the audit trail.
- [x] Phase E: Verify and hand back.

Work in small, verifiable units. Discuss the next unit before expanding the migration.
Record decisions and evidence in [decisions.tsv](decisions.tsv).

## Scope and baseline

The source has 53 pages across six packages and shared project guides.
It uses 50 Markdown files and three MDX files.
The MDX pages import Astro package cards.
The existing source includes unpublished changes that must survive the migration.

The destination starts with Laravel 13, Inertia 3, Vue 3, Tailwind 4, Vite Plus, and Pest 5.
The initial baseline passes 21 PHP tests with two existing skips and passes `npm run check`.
The `docs` directory did not contain Git metadata during the first inventory.
The refinement unit starts from the local `f503bec` commit, `init new docs`.
Verify upstream source paths before changing the migration-source references to public editing links.

## Accepted constraints

- Keep Laravel, Vue, and Inertia as the application stack.
- Disable Vue SSR in development and production.
- Write new Vue components with JavaScript and `<script setup>`.
- Style components with Tailwind utilities.
- Use Laravel Head for page metadata, icons, canonical URLs, and structured data.
- Use Ziggy instead of Wayfinder for frontend routes.
- Install package dependencies through Composer before installing frontend dependencies from `file:vendor/artisan-toolbox/<package>`.
- Let Maintainer own README headers, validation, commits, releases, and Deployer integration.
- Use self-hosted Reverb, Horizon, and server-side search when their migration unit is ready.
- Keep frontend code free of private credentials.
- Keep the landing page at `/`, the documentation entry point at `/docs`, and packages under `/docs/<package>`.
- Keep a source-file link on every documentation page.
- Reuse documentation components for headers, requirements, specifications, prose, examples, and demos.
- Keep demo components and backend helpers isolated by package and section under explicit `Demo` or `demo` directories.
- Start active demos only after a user action. Provide resize controls and the source that causes the demonstrated behavior.
- Keep English content, responsive layouts, and light, dark, and system themes.

## Units and completion checks

1. **Disable SSR and record the process.** Verify that an initial document request makes no SSR HTTP call. Verify that Vite does not register the SSR endpoint.
2. **Build the documentation foundation.** Define a small page contract and reusable Vue components. Serve `/docs` and one package overview through Inertia. Verify metadata, source links, mobile layout, and theme changes.
3. **Migrate branding and browser icons.** Copy approved PNGs and authoritative package SVGs. Generate icon sizes reproducibly. Verify the generated files and Laravel Head output.
4. **Install the consumer toolchain.** Integrate Artisan Toolbox packages, Ziggy, Maintainer, Rector, PHPStan, and Vite Plus checks. Remove obsolete starter wiring in the same unit as its replacement.
5. **Migrate content by package.** Preserve requirements, examples, stability, heading anchors, and internal links. Cover old URLs with redirects. Compare the page inventory before the cutover.
6. **Add demos.** Start with one small example. Verify user-controlled startup, resizing, source display, independent loading, and failure states before extending the pattern.
7. **Add search and background services.** Choose the local search engine, build an idempotent index command, and verify that content updates refresh the index. Add Horizon and self-hosted Reverb for features that need them.
8. **Prepare deployment and cutover.** Configure Deployer through Maintainer. Verify canonical metadata, sitemap, robots rules, redirects, production builds, search, and operational access. A production deployment is a separate approved action.

An unchecked unit is planned work, not an implemented feature.

## Throughput checkpoint

- **Blocking first steps.** Inventory source content and assets, capture baseline checks, disable SSR, and settle the Vue page contract before migrating pages.
- **Independent workstreams.** Read-only content and Laravel inventories can run in parallel. Page implementation follows the agreed component contract.
- **Shared mutable state.** One owner updates routes, package manifests, the page catalog, and shared components. Preserve existing changes in `docs_old`.
- **Smallest safe decomposition.** Migrate one package overview first. Use its real requirements and examples to prove reuse before migrating the remaining pages.

## Decisions still open

- How much Markdown to support inside Vue-authored documentation.
- The visual direction of the landing page and documentation shell.
- The search engine and production service topology.
- The release source for unpublished workspace packages.

## SEO without Vue SSR

Laravel Head can deliver metadata in the initial HTML and update it during Inertia navigation.
The article body still needs JavaScript when rendered by Vue without SSR.
Do not describe metadata alone as complete SEO verification.
Verify crawler access, article indexing, links, structured data, and performance before the public cutover.

The implementation references are the [Inertia SSR guide](https://inertiajs.com/docs/v3/advanced/server-side-rendering) and the [Laravel Head guide](https://laravel.com/framework/docs/head).

## First-unit verification

The first unit delivers `/docs`, the complete Maintainer overview at `/docs/maintainer`, reusable Vue presentation components, migrated artwork, grouped browser icons, and Laravel Head integration.
It does not complete the remaining migration units.

Verification completed on November 5, 2026:

- `composer ci:check` passes formatting, lint, Vue type checking, 31 frontend and icon-generation tests, PHPStan level 7, and 33 PHP tests. Two existing PHP tests remain skipped by the starter configuration.
- `npm run build` produces the client bundle. There is no SSR build script.
- The SSR regression test fails before disabling SSR and passes afterward without making an HTTP request to an SSR renderer.
- A POST to `/__inertia_ssr` through the real Vite middleware stack returns 404. The plugin does not register an SSR endpoint.
- Existing legacy navigation tests pass, with nine tests covering package discoverability and sidebar behavior.
- Browser inspection verifies desktop and 390 px layouts, visible loaded brand images, theme selection, code-copy success, active navigation, and the mobile menu closing after navigation.
- Browser inspection verifies the title suffix, canonical URL, one description tag, and grouped icon URLs after Inertia navigation. The observed page has no horizontal overflow or browser warnings and errors.
- The generated files match the checked-in artwork, including the opaque touch icon, maskable safe area, ICO entries, and share-image dimensions.

Independent review confirmed the Maintainer content matches its source and found one authoring mismatch.
`ProseSection` now supports headingless introductory prose and has tests for both forms.
The comment review removed narration and boilerplate while retaining static-analysis contracts and the Node test-environment directive.

The local shell initially selected a broken Homebrew PHP executable.
Validation used Herd PHP 8.5 explicitly and a temporary command-path shim for subprocesses.
PHPStan needs a 512 MB limit in this environment, which is now part of the configured command.

Remaining release checks include publishing the replacement source, updating source links, reviewing body indexing without SSR, completing redirects and the sitemap, and configuring the production services.

## Refine the documentation model

This unit implements the requested adjustments before the next migration stage:

- [x] Ground the current page flow and compare enum resolution with explicit route binding.
- [x] Choose typed page and package definitions, with an enum selecting the page and resources shaping frontend data.
- [x] Remove `documentation.url` and generate canonical and social URLs from `APP_URL` and named routes.
- [x] Replace array registries with immutable page and package objects while preserving the existing frontend contract.
- [x] Verify implicit enum 404s, page identity, resource shapes, and request-origin independence.
- [x] Update agent guidance and the authoring process to check for reusable Artisan Toolbox capabilities.
- [x] Run the complete validation suite and inspect the resulting diff.

The page/package/resource contract was the blocking work. Backend implementation and contributor guidance had separate owners. One owner updated shared URL configuration and routes. The delivery replaces the old registry and its callers together.

`composer ci:check` passes 31 frontend and asset tests, 36 PHP tests, formatting, lint, Vue type checking, and PHPStan level 7. The same two inherited PHP skips remain. `npm run build` and all nine legacy navigation tests pass.
The canonical-origin regression fails before the change and passes afterward. A separate test changes the named route's path and verifies that canonical, navigation, and package destinations follow it.
Independent source review found no correctness or comment issues. Front Awesome's existing `Theme` component was checked and recorded for the consumer-package integration unit; this refinement changes documentation policy rather than installing that package.

## Install Maintainer and quality tooling

The user prioritizes Maintainer and quality tooling before their first server deployment. The user owns deployment configuration and execution. This unit does not publish a deployment recipe or connect to the server.

- [x] Inspect Maintainer's public quality contracts, the existing application checks, and the published package metadata.
- [x] Install the published Maintainer distribution, Rector, and its Laravel rules as development dependencies.
- [x] Preserve Pest, Pint, PHPStan, and Vite Plus configuration and connect them to the Maintainer quality workflow.
- [x] Add a Rector configuration and a non-mutating CI check.
- [x] Run the installed Maintainer workflow and verify that every configured check executes.
- [x] Document local commands, development requirements, and the deployment ownership boundary.

Dependency and lock-file updates have one owner. Configuration follows the existing public workflow contracts rather than introducing a custom runner. The verification gate is the actual installed CLI executing the application's tools, followed by the existing production build.

The lock records published ZIP distributions for Maintainer 1.10.0, Deployer 8.0.5, Rector 2.8.4, and Laravel Rector 2.7.3. A temporary clean Composer home avoided the developer machine's path-repository override; the project does not acquire an absolute local source path.
Maintainer's application Rector template supplies the rules. The application configuration omits the obsolete `withSetProviders()` call because Rector 2.8 detects installed set providers through `withComposerBased()`.
Rector found only three redirects that can use Laravel's equivalent `permanentRedirect()` API. The existing redirect tests continue to verify the 301 status and destinations.

`composer ci:check` passes the Rector dry run and all six Maintainer checks, with zero tools skipped. Pest reports 36 passing tests and two inherited skips; Vite Plus reports 31 passing frontend and asset tests. PHPStan, Pint, formatting, lint, Vue type checking, the client build, and strict Composer validation pass.
The installed Maintainer also runs the selected Rector fixer without interaction, with zero pending changes and no follow-up commit. Independent scoped source review found no actionable issues.

One release-artifact observation remains. Composer installs Maintainer 1.10.0, while the distributed CLI's `--version` output displays 1.9.0. The quality commands were verified by execution; this unit does not rebuild or release the Maintainer package.
See [the quality workflow](quality.md) for the installed commands. No deployment recipe, SSH identity, server configuration, commit, release, or production deployment is created by this unit.

## Align the documentation branch and CI workflow

Keep documentation changes and GitHub source links on `1.x`, matching the renamed remote default branch.
Preserve the quality checks while making each CI installation, preparation, build, and validation step explicit.

- [x] Inspect local work and the remote branch without changing existing commits or staged files.
- [x] Rename the local branch, configure `origin/1.x` tracking, and update `origin/HEAD`.
- [x] Update source links, existing assertions, and the workflow push filter to `1.x`.
- [x] Configure locked dependency installation, isolated test services, npm caching, and step-scoped frontend credentials.
- [x] Validate the workflow and execute the affected tests, Rector, Maintainer checks, and client build.

Git references and workflow changes have one owner. Existing request and component tests cover source-link behavior.
The verification gate includes all six Maintainer checks and a separate Rector dry run because the installed Maintainer version exposes Rector only as a fixer.

The remote advertises `1.x` as its default branch. The local branch tracks `origin/1.x`, `origin/HEAD` points to it, and no active branch references retain the previous name.
Source-link assertions pass for `1.x`. Actionlint 1.7.12 validates the workflow, and locked Composer and npm installation succeeds.

The client build and Rector dry run pass with PHP 8.5 and Node.js 22.23.4.
Pest reports 36 passing tests and two inherited skips. The complete Maintainer run then stops on Pint's `array_indentation` finding in a local `deploy.php` that appeared during validation and is outside this unit's edits.
The scoped PHP files pass Pint. Running the remaining four Maintainer checks separately passes formatting, lint, 31 frontend and asset tests, Vue type checking, and PHPStan with zero selected tools skipped.
The workflow keeps its complete gate unchanged. GitHub Actions has not been run remotely.

An earlier required dirty-file Pint run also adjusted statement indentation in the newly present deployment recipe. No deployment settings or secrets were changed, and subsequent validation does not edit the recipe.
Independent scoped review finds no actionable correctness or comment issues.

## Complete the Maintainer application identity

Installing Maintainer and its quality checks did not provide a consuming application identity for versioning or README generation.
The user identifies the missing `ArtisanToolbox` implementation of `Versionable` and `WithReadmeHead`.

- [x] Reproduce the missing identity with the installed `readme:update` command.
- [x] Add a behavioral regression and confirm that it fails before the implementation.
- [x] Compare a direct identity class with manifest-derived metadata and select the public contract composition.
- [x] Add `App\ArtisanToolbox`, generate the README head, and document its ownership.
- [x] Verify the regression, CLI idempotence, required quality checks, and scoped diff.

The direct class is the selected design. Manifest parsing would add filesystem coupling and failure paths for two compatibility labels.
The class owns a literal `1.0.0-alpha.1` version and a public `Head` builder. It has no container binding, runtime integration, or dependency on Maintainer internals.
The alpha version records the replacement's current migration stage without publishing a release.

The regression executes the installed standalone distribution in an isolated project fixture, using the application's production autoload mapping and sources.
It removes the fixture header before execution, compares the generated result with the committed header, preserves added manual content, and checks a second execution.
It also verifies that the real README stays unchanged. Calling the Composer proxy inside a fixture would resolve the real consuming project instead.

Before the fix, both the real command and regression fail because no production-autoloaded class implements `Versionable`.
README generation now succeeds and preserves the complete existing installation and contributor guidance outside its managed region.

The focused regression passes with eight assertions. `composer ci:check` passes Rector and all six Maintainer tools with zero tools skipped.
Pest reports 37 passing tests and the two inherited skips; the frontend and asset suite reports 31 passing tests.
Pint, formatting, lint, Vue type checking, and PHPStan pass. The previous local deployment-recipe formatting finding does not block this run.
Independent scoped correctness and comment review finds no actionable issues. The identity regression is part of the normal Pest gate, so omitting the consuming identity or leaving the README header stale now fails CI.
