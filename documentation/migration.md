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
The `docs` directory does not yet contain Git metadata.
Do not fabricate branch names, commit URLs, or release status from this directory.

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
