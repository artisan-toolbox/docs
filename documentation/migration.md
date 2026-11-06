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

## Fix cross-platform share-image generation

The Linux CI run fails the published-asset synchronization test for `social-card.png`.
Reconstructing the complete generated PNG from the supplied log isolates 25 color samples that differ from the published macOS image by one level; alpha and dimensions match.
Separate and fused float32 blend models reproduce the complete Linux and macOS PNGs respectively, including compression.

- [x] Reconstruct and validate both PNGs, then isolate resize, blend arithmetic, and compression.
- [x] Add a focused regression before the fix. The old generator produces blue 48 where exact blending requires 49.
- [x] Compare processing shapes and select materialized resize, integer flattening, and explicit centered padding.
- [x] Regenerate the published share image and preserve exact file synchronization checks with compact SHA-256 diagnostics.
- [x] Run the complete quality gate and review the scoped changes.

Flattening before resizing changes the wordmark edges. Using a contain resize for padding shifts an odd-height wordmark by one pixel.
The selected pipeline preserves the existing placement and avoids the native float32 composition path.
Regeneration changes three color samples by one level, with the same 1200 by 630 dimensions and alpha channel.

The regression now passes. Before regeneration, the exact synchronization test still rejects the stale published image and reports its filename and checksums.
After regeneration, all 14 asset tests pass without tolerances or skipped asset tests.

The client build and `composer ci:check` pass with PHP 8.5 and Node.js 22.23.4.
Rector and all six Maintainer tools pass, with zero tools skipped. Pest reports 37 passing tests and two inherited skips; frontend and asset tests report 32 passing tests.
Independent scoped review finds no actionable correctness or comment issues.
Validation of the corrected pipeline is local; the remote Linux job has not been rerun in this unit.

## Add staff email-code access and protected logs

The user requests a hidden `/login` entry point, email-code authentication restricted to `atb.dev.br`, SQLite sessions, and authenticated header links for logs and logout.
The application uses Laravel's session guard with its own challenge flow because Fortify does not provide this email-code flow out of the box.
Fortify routes and obsolete starter dashboard, password, and settings implementations are removed from the active application.

- [x] Install OPCodes Log Viewer as a production dependency and protect its UI, API, and downloads with authentication and the shared staff-domain gate.
- [x] Implement hashed session challenges, ten-minute expiry, five attempts, rate limits, different replacement codes, and session rotation on login and logout.
- [x] Refuse logging mail transports and exclude submitted codes from flashed validation input.
- [x] Add reusable account header links and a responsive email/code login form with expired-challenge recovery.
- [x] Verify SQLite session persistence and session locking on ordinary GET requests as well as authentication requests.
- [x] Replace obsolete feature tests with closed-endpoint assertions and run the complete quality gate.

Security review reproduced a stale-session race: an unlocked GET could restore a challenge after a concurrent failed verification deleted it.
Global session blocking fixes that boundary. Three HTTP regressions fail with blocking disabled and pass with it enabled, using real SQLite-backed cache locks.
Frontend regressions also reproduce and fix a stale code-entry screen after the server clears the challenge.

The complete quality gate passes Rector and six Maintainer tools with 93 PHP tests and 41 frontend tests, with no skipped tools or tests.
Email delivery is tested with notification fakes and failure cases; production requires a configured real mail transport.
See [staff access](access.md) for operational setup and the authentication contract.

## Correct the staff email domain

The user corrects the allowed domain to `atb.dev.br`. Update the shared policy, validation message, form, fixtures, and documentation together.
Previously issued challenges for the former domain are rejected, and its authenticated users cannot access logs.
The complete quality gate passes 96 PHP tests and 41 frontend tests, all six Maintainer tools, Rector, and the client build.

## Check the preliminary publication and resume content migration

The user confirms the preliminary deployment works and requests a quick sensitive-data check before resuming migration.
Gitleaks 8.30.1 scans all 32 available commits with redacted reporting and finds zero secrets.
The current revision contains 332 tracked files. The tracked environment example uses empty values or placeholders for credential fields.
Sensitive environment files, database files, private keys, and Maintainer secret files are absent from the available Git history.
The existing local PM2 edit is outside this change.

Front Awesome's public `1.x` distribution resolves to commit `1ed4592`, which exports Button and style entries but not the Theme, Vue plugin, or Vite integration present in the local package checkout.
Its JavaScript peer constraint also predates the current Mosaicast version. Integration is deferred until a compatible distribution is available.
The exploratory Composer dependency was removed through Composer; application dependency files match their baseline.

- [x] Scan the versioned tree and available history without printing sensitive values.
- [x] Verify the public Front Awesome consumer surface and record the distribution mismatch.
- [x] Migrate the Maintainer Code Quality overview, keeping its detailed guide on the current public site.
- [x] Point page source references at the published application's Vue files and enforce source existence.
- [x] Run focused coverage, the complete quality gate, and the client build.

The implementation extends the existing page enum, readonly page definition, resources, and shared Vue components.
It does not add a second content compiler or expose maintenance commands through a public demo endpoint.

The new overview is available at `/docs/maintainer/ci`; `/packages/maintainer/ci` redirects through the named documentation route.
Navigation includes stable page slugs and supplies its generated relative links to the Vue page, without adding a new Wayfinder caller.
The focused regressions fail before implementation and pass afterward. The full gate passes Rector and all six Maintainer tools with zero tools skipped, and the client build passes.
Independent scoped source and comment review finds no actionable issues. The detailed quality guide remains the next content page to migrate.

## Migrate the detailed quality workflow guide

Move the complete legacy `ci/quality` guide to `/docs/maintainer/ci/quality`, preserving its command examples, heading anchors, workflow semantics, and configuration contracts.

- [x] Ground the content against the installed Maintainer public contracts and commands.
- [x] Extend the existing page registry and migrate the guide using shared documentation components.
- [x] Connect internal navigation and the exact legacy redirect through named routes.
- [x] Verify rendered content, metadata, redirects, source references, and the complete application quality gate.

Throughput checkpoint:

- Blocking first steps. Read the entire source and verify the installed package behavior before migrating examples.
- Independent workstreams. The implementation has one owner; process documentation and independent content review remain separate.
- Shared mutable state. Page registration, redirect updates, and link fixtures have one writer.
- Smallest safe decomposition. Keep the existing page and package contracts; split long static content into cohesive Vue sections and use a shared table only for presentation.

The page preserves seven heading anchors and all ten code examples, independently compared against the legacy source.
The arbitrary frontend test script alias is normalized to English in both sources without changing script discovery behavior.
The new `DocsTable` consumes caption, column labels, and text rows with an optional formatting slot. Its workflow summary and requirements table are two concrete consumers.
Table presentation stays local to the documentation application; no compatible public package export provides this documentation-specific presentation.
The page shell remains 60 lines, and requirements, workflows, and configuration have cohesive sections.

Focused regressions fail before implementation and pass after migration. The complete gate passes Rector and all six Maintainer tools, with 100 PHP tests and 47 frontend tests and no skipped tooling or tests.
The client build passes. Independent scoped review finds no correctness, content-preservation, accessibility, or comment issues.

Concurrent local dependency changes are preserved outside this unit. The Composer lock now references Maintainer `1.999.999` through an absolute local path; normalize that entry to a public distribution before committing the lock for server installation.

## Group documentation navigation by hierarchy

Replace the flat menu with nested package and guide sections while continuing to use the existing page registry.

- [x] Compare registered slug-prefix nesting with explicit parent metadata.
- [x] Introduce a typed recursive navigation tree and migrate every flat-list consumer.
- [x] Render nested lists with separate page links and accessible disclosure buttons.
- [x] Verify active ancestry, route changes, collapse behavior, mobile navigation, and generated destinations with focused tests.
- [x] Complete the application quality gate and independent scoped review.

Throughput checkpoint:

- Blocking first steps. Inspect the existing page registry, layout, guide links, and relevant public package exports before choosing the tree shape.
- Independent workstreams. Compare two read-only designs; assign one implementation owner while process documentation and independent review remain separate.
- Shared mutable state. The navigation DTO, Vue renderer, and all former flat-list callers have one implementation owner.
- Smallest safe decomposition. Derive parents from registered slug segments, preserve enum order and named routes, and share one recursive renderer and lookup.

The menu now groups Maintainer, Code Quality, and Fixes and CI Checks into three levels.
The index remains a top-level leaf; missing intermediate prefixes attach to the nearest registered ancestor.
The active path opens automatically, readers can collapse it, and only the exact current page is marked current.
Disclosure buttons preserve the mobile menu; page links close it.

The package inspection found no compatible published public navigation-tree export for this documentation-specific page registry. The application retains ownership without copying package internals or adding a dependency.
Focused tests failed before implementation and pass afterward, with 19 PHP tests and 13 frontend tests covering the changed behavior.
The client build passes. Browser policy blocks local-file previews, so native keyboard activation and visual wrapping have not been observed in a browser during this unit. No server or alternate browser surface was started to bypass that restriction.

The complete quality gate passes Rector and all six Maintainer tools, with 101 PHP tests, 55 frontend tests, and no skipped tooling or tests.
PHPStan identified a redundant null comparison in the initial prefix lookup. Selecting the longest registered ancestor directly removes that condition without suppressing analysis or weakening tests.
Independent scoped review found no actionable correctness, accessibility, or comment issues. It independently reran the 19 backend and 13 focused frontend tests; no source comments required deletion.

## Refine the nested menu presentation

Keep the existing navigation tree and interactions while improving available label width, hierarchy, spacing, active states, and theme consistency.

Throughput checkpoint:

- Blocking first steps. Observe the actual application and inspect layout widths before changing presentation.
- Independent workstreams. Compare two read-only visual designs; keep implementation under one owner and browser verification under the parent.
- Shared mutable state. Only the implementation owner edits the two navigation components; process documentation remains parent-owned.
- Smallest safe decomposition. Reuse the existing recursive tree and disclosure state. Limit changes to sidebar presentation and optional rendering depth; avoid new dependencies or backend changes.

- [x] Observe the cramped desktop sidebar in the application served by Herd at `atb.test`.
- [x] Refine the shared navigation presentation and document its conventions.
- [x] Verify desktop and mobile, both themes, keyboard controls, and existing automated checks.

Both read-only designs converged on a wider sidebar and compact indentation. The implementation combines that geometry with editorial spacing for root sections and a leading marker on the exact current page.
The desktop column is 18rem with 1rem lateral padding, and each nested level adds a compact guide gutter. Optional rendering depth distinguishes root sections without changing the server contract or expansion state.
Front Awesome has no public recursive documentation navigation export. The existing shared application component remains the owner; no dependency or backend change is required.

The actual Herd application was reviewed at desktop widths of 1280 and 1440 pixels and a mobile width of 390 pixels, in light and dark themes. Navigation labels fit without sidebar horizontal overflow. Enter collapses a section and Space expands it. Disclosure clicks preserve the open mobile menu, and selecting a guide closes it.
The complete quality gate passes Rector and all six Maintainer tools with 101 PHP tests and 55 frontend tests. The client build passes.
Independent review identified two contrast issues in the initial refinement, affecting the light-theme disclosure icon and dark-theme footer text; both colors were corrected. No comments or suppressions required deletion.

## Migrate the complete configuration section

Move the Configuration overview, reference, publishing guide, and SSH keys guide together, retaining examples, section anchors, source references, and links to unmigrated deployment pages.

Throughput checkpoint:

- Blocking first steps. Read all four legacy pages and check the documented workflows against Maintainer's public integration contracts and tests.
- Independent workstreams. One owner implements the page registry, Vue content, and tests; a read-only reviewer grounds package semantics while the parent maintains process documentation and verifies the application.
- Shared mutable state. Registry, route redirects, related overview links, and frontend fixtures remain with one implementation owner. Parent-owned legacy prose corrections are communicated to that owner.
- Smallest safe decomposition. Reuse existing page definitions, resources, code examples, prose sections, and navigation. Consolidate repeated guide headers without introducing a content compiler or new dependency.

- [x] Migrate four pages with exact redirects, local links, visible guide titles, and collaboration links.
- [x] Preserve security guidance and correct any source inaccuracies demonstrated by package behavior.
- [x] Verify content, route metadata, navigation, the complete quality gate, and the actual browser experience.

Credential and configuration examples remain static and copyable. This unit does not execute configuration publishing, display SSH keys, generate identities, or perform deployment actions in the documentation application.

The four pages preserve all nine code examples and thirteen section anchors, independently compared with the legacy source. The reference page composes three cohesive sections for defaults, encryption and environment, and secrets and resolution.
The reusable `PackageGuideHeader` composes the existing header and specifications without replacing a guide's visible title with the package wordmark. The Code Quality overview and detailed quality guide consume the same header.

Maintainer's exported contracts, encryption support, and SSH helpers supply the documented integration APIs; no public package component provides the site's guide presentation. No package internals or dependencies were copied into the application.
Source and migrated prose now distinguish publication's template `APP_KEY` from runtime custom encryption keys, helper fallback only for an absent configuration key, and Deployer's independent authentication when no Maintainer identity is stored. The relevant public implementation files match the documented `1.10.0` tag.

Focused tests passed after the shared-header test first failed without its implementation. The complete gate passes Rector and all six Maintainer tools with 105 PHP tests and 68 frontend tests. The final SSH lifecycle wording also passes the twelve Configuration frontend tests. The client build passes.
The legacy site's complete validation also passes content checks, formatting, production build, and nine tests.
The actual Herd application was verified through all four pages, with visible guide headings, source links, local navigation, and responsive code scrolling. The reference and SSH guides have no page overflow at 390 pixels; the expanded section fits the desktop sidebar.
Independent scoped source and comment review found no actionable defects. No comments or suppressions required deletion; illustrative placeholder comments remain inside the preserved public code example and its test fixture.

Existing external Deployment links remained on the former canonical publication domain because that section had not migrated. Live verification of that former domain failed with DNS resolution errors during this unit; local migrated destinations were verified successfully.

## Update public contacts and migrate Versioning

Update the contact email to `contact@atb.dev.br` and the canonical publication origin to `https://atb.dev.br` throughout the workspace before migrating the five Versioning guides.

Throughput checkpoint:

- Blocking first steps. Inventory public source references and generated README owners, update contact metadata, and verify the source sweep before continuing the migration.
- Independent workstreams. One owner updates package metadata and validates consuming packages. A read-only investigation grounds Versioning against package source and release tags; one other owner then implements the five pages. The parent owns process documentation, independent review, and browser validation.
- Shared mutable state. The workspace source sweep hands documentation ownership back before page implementation starts. Package artifact rebuilding uses an isolated archive of committed source and excludes local development credentials.
- Smallest safe decomposition. Exact contact replacements preserve dependency versions and URL paths. The next section reuses existing typed page definitions, shared guide headers, and static examples without introducing live Git mutations.

- [x] Update public source references, contact policies, Composer author metadata, managed README sources, and workspace guidance.
- [x] Validate package metadata and generated artifacts, and retain a safe repeatable contact check.
- [x] Migrate all five Versioning pages with examples, anchors, exact redirects, and internal guide links.
- [x] Verify complete quality gates, content parity, and browser navigation.

Authentication fixtures and `noreply` sender identities retain their distinct purposes. No Git history, Git identity, live environment configuration, SSH keys, tokens, or deployed server settings are changed.

The source sweep updates public author/contact metadata in six package manifests and seven Composer locks without changing dependency versions or content hashes. Package README sources, generated headers, security policies, contributor guidance, the legacy site origin, and its renamed NGINX template use the new public identity. A changed-file comparison confirms that existing package metadata changes are limited to the approved exact replacements.
The retained Node command `scripts/update-public-contacts.mjs` checks without writing by default and has three behavior tests for protected paths, explicit updates and repeated execution, and NGINX destination collisions. The temporary inventory's path fence was tightened to exclude secret and credential files; the changed-file audit contains no protected configuration. Generated outputs and dependencies are validated separately rather than rewritten by the command.

Maintainer's distributable initially retained the former domain. Its rebuild uses committed public source at `5a3241cbf03d4d1cf29e58c9a44643fcb9172c5b` with five reviewed contact-only overlays and installed dependencies in an isolated temporary directory. Local development environment and secret overrides are excluded. The original binary's hash is checked before replacing it so a concurrent change cannot be overwritten. Public artifact entries independently confirm the new origin and contact; distributed executable checks pass, and real README updates report all six headers already synchronized.
Full package validation passes 541 PHP tests across Core, Front Awesome, Dump to Console, QZ Tray, Mosaicast, and Maintainer, plus their configured static analysis and formatting checks. The five Laravel packages also pass type coverage. Initial sandbox loopback restrictions are resolved by rerunning with permitted local subprocess access, without changing tests or tool configuration. The legacy site passes content validation, formatting, its production build, and nine output tests.

The five Versioning pages preserve twelve exact code examples and eighteen anchors, independently compared with the updated legacy source. The pending-push workflow is explicitly a current `1.x` preview added after `1.10.0`. Production autoload remains required for discovery even when the integration is used only by development tooling. Exact legacy redirects include the historical project-integration alias.

The user's external-link refinement is centralized in `DocsLink`. External HTTP(S) and protocol-relative destinations open `_blank` with `noopener noreferrer`; same-origin, hash, relative, mail, and telephone destinations retain their appropriate behavior. Direct outbound layout and overview links now consume the same component. Six focused failures reproduced the missing policy before implementation. Independent source review finds no remaining issue.

The complete documentation gate passes Rector and all six Maintainer tools with 111 PHP tests and 100 frontend tests. The client build and repeatable contact check pass. The actual Herd application verifies all five pages, the preserved anchors and examples, desktop/mobile layout, and the pending-push preview wording. A real click on the GitHub link opens a second browser tab while preserving the documentation tab. No Git workflow from a documentation example is executed.

## Complete the package-content migration during the unattended cycle

The user authorizes a sustained cycle while away. The exit condition is that every legacy package page resolves to its registered Laravel replacement or documented exact alias, preserves its examples and anchors, and passes content, routing, frontend, formatting, static analysis, and browser checks. Publication and live maintenance operations remain outside this cycle.

The inventory contains 47 Markdown package sources. Thirteen replacement routes are registered at the start, including `/docs`; the remaining package work consists of seven Maintainer pages, four Core pages, two Dump to Console pages, five Mosaicast pages, two QZ Tray pages, and fourteen Front Awesome pages. The historical Maintainer project-integration source is an alias to its migrated Versioning guide.

Throughput checkpoint:

- Blocking first steps. Read each package source, identify compatibility and preview status, and define the content-verification contract before registering replacements.
- Independent workstreams. Content owners write disjoint package directories and page definition files. The parent alone integrates the shared enum, route redirects, catalog metadata, process documentation, and validation results.
- Shared mutable state. Each content owner publishes a separate registration manifest. Shared components and migration tooling have one designated owner; no worker edits the central registry or another owner's pages.
- Smallest safe decomposition. Verify complete package units before the next wave, reuse the existing Vue component contracts, and use an offline conversion aid only to produce ordinary editable Vue source. The runtime gains no Markdown compiler or content language.

- [x] Finish the Maintainer Deployment guides, command index, and development guide.
- [x] Migrate Core, Dump to Console, and Mosaicast content.
- [x] Migrate QZ Tray and Front Awesome content.
- [x] Integrate exact aliases and verify all legacy package destinations.
- [x] Complete quality gates, independent content review, and browser validation.
- [x] Replace the starter landing page after package content is verified.
- [x] Migrate Getting Started, the package chooser, and project policy/versioning pages.
- [x] Integrate Front Awesome quick styles through public consumer entries and publish application branding.
- [x] Verify real shared styles, theme persistence, preview resizing, and every documentation route at desktop and mobile widths.

Keep a checkpoint in `decisions.tsv` for every accepted unit, failed gate, and resulting fix. Do not run publishing, SSH identity display, Git commit/push/release, PM2, deployment, or real mail operations from documentation examples.

The registry now has 52 documentation pages and the application has a separate public landing page. All legacy package content, Getting Started pages, and project guides have replacements. Historical Maintainer and QZ Tray aliases remain redirects. The source preservation tests cover rendered prose, headings, code, tables, anchors, and links. A separate workspace suite checks source fingerprints and the offline conversion aid without making standalone CI depend on `docs_old`.

Independent content reviews compared all 34 package pages added in this cycle against their legacy sources. Public release records corrected an initial assumption based on stale local Git tags. Dump to Console `1.1.0`, Mosaicast `1.2.0`, and QZ Tray `1.2.0` are published stable releases. Maintainer examples added after public `1.10.0` retain explicit preview wording. Front Awesome remains work in progress.

Front Awesome's public Tailwind wrapper and Web Awesome runtime now share the application's complete red brand ramp, slate neutrals, Instrument Sans, spacing, radii, and shadows. The existing cookie-aware appearance controller remains the sole mode owner and also synchronizes Web Awesome classes. The real button demo is independently resizable. Its browser values confirm shared font inputs and mode-specific brand colors.

The latest complete gate passes Rector and all six Maintainer tools with 122 PHP tests, 206 frontend tests, and no skipped tools. The workspace migration suite passes 30 tests. The legacy site passes its content check, formatting, production build, and nine output tests. The final replacement build uses Node.js 24.22.2 to meet the new package engine requirement. Desktop and 390 px browser audits visit all 52 documentation routes with one visible heading, source references, and no page-level horizontal overflow. The active deep menu item is revealed without scrolling the document.

This completes content migration, not publication. Front Awesome's requested quick-style exports are still an unpublished local preview, and the existing Maintainer preview also uses a sibling path repository. The current lock cannot install from a standalone documentation checkout. Publish the required versions and refresh the locks before CI or deployment, following [quality checks](quality.md#prepare-standalone-installation). No package publishing, commits, pushes, production deployment, or live maintenance actions were performed. Full-text search, broader live demos, Ziggy replacement, and Reverb/Horizon setup remain distinct integration work.

The installed runtime packages require PHP 8.5. The application's former PHP 8.3 constraint and managed badge have been raised to match them, including production. Composer refreshed only the root lock hash and platform declaration, with all locked package metadata unchanged. The production platform check passes. Node.js 24.11 or newer is also required for assets.

See [the unattended handoff report](unattended-report.md) for the verification evidence and remaining work.

## Standardize beginner journeys and live package evidence

The 2026-11-06 refinement responds to inconsistent setup paths, oversized repeated metadata, and missing practical examples.

- Every package now has a dedicated installation page. Five new typed pages bring the registry to 57 pages. The enum's editorial order puts installation before dependent guides; request tests enforce the intended package and Maintainer subsection order.
- Package overviews keep their full specifications. Child guides use compact badges, and cards and headers disclose the actual Composer installation. Installed versions remain distinct from documented compatibility. Missing packages and local previews are explicit.
- All six documented packages are installed explicitly. Front Awesome and Maintainer use honest `1.x-dev` path previews instead of the former artificial Maintainer version. Published Core, Dump to Console, Mosaicast, and QZ Tray distributions remain separate from local source.
- Compatible updates were attempted for Artisan Toolbox, Laravel, Inertia, Head, Pest, Vue, Tailwind, and test tools. The existing declared main dependency ranges were already current. Horizon and Reverb were installed normally; Composer resolved Reverb's supported Guzzle dependency without bypassing constraints. New public author metadata was normalized with the retained contact checker without other lock changes.
- Workspace, documentation, and Mosaicast agent rules now require ordered learner journeys, prerequisites, backend-before-frontend setup, copyable first success with an expected result, shared public components, compatible dependency refresh attempts, and root-cause fixes. The installed technical-writing skill and official Diataxis and Google standards are reused instead of installing unknown skill code.
- Mosaicast has three user-started real Inertia comparisons. They show native Laravel dispatch plus an explicit manual response prop beside public package listeners. Named events, event objects, and multiple event types produce one, one, and three deliveries in the real browser. The queued path captures its session target on the server, is staff-only, and waits for an actual private subscription before enqueueing.
- `DemoFrame` centralizes source display and resizing. Container queries make the inner comparison stack when its own frame narrows, independently of the page viewport. `DemoAction` consumes the public Front Awesome button for the response demos, queued demo, and branding preview.
- Horizon has separate normal and demo supervisors. Dashboard and API authorization require verified staff in every environment, and metric snapshots are scheduled. Reverb and Echo are integrated; no service or deployed configuration was started or changed. See [queue operation](queues.md) and [Mosaicast demos](mosaicast-demos.md).

Independent review found two remaining learner gaps after the first implementation. Mosaicast's overview still used an undefined model variable and omitted the request trigger. Its shared first-event tutorial now defines order 42, registers before the preserved-state user visit, returns an Inertia page, and cleans up its listener. Front Awesome installation now ends with public Core setup, a runnable button page, a production build, and a visible result. Both fixes are synchronized to the legacy source. The documented Front Awesome snippets also build in an isolated consumer.

Legacy Markdown formatting changed two code blocks' whitespace and quote style. The Vue examples were synchronized to that formatted source before refreshing only the affected example fixtures and fingerprints. Original unrelated entries and source integrity checks remain intact. Demo widgets are excluded from static article parity through the same explicit content boundary used by the page outline, and their behavior has its own tests and live browser proof.

The complete gate passes 160 PHP tests and 259 frontend tests, including the shared-standards checks added during the cycle, plus Rector and all six Maintainer tools with none skipped. The workspace source/converter suite passes 32 tests. The legacy site passes content checking, formatting, build, and eleven output tests. All six installation pages were visited on desktop and at 390 pixels with compact headers, ordered sections, and no page-level overflow. Real browser response demos produced counts of 1/1, 1/1, and 3/3; the queue path has backend and client lifecycle coverage but no claim of a live worker run.

The production-only npm audit reports no advisories. Five moderate entries remain in the development-only Vue test utility chain; the offered repair is outside the declared range. No forced override or disabled check was used. Standalone CI/deployment still requires publishing the local package previews and refreshing their locks. This refinement does not publish packages, commit, push, deploy, or send live mail.

Fresh-production verification exposed a Front Awesome wrapper bug masked by warm module state: false loading/disabled values could become present HTML boolean attributes before Web Awesome upgraded the element. The package now declares its public Boolean props at runtime and uses declarative presence/absence attributes. Its original component fails the SSR regression, the corrected unit suite passes 25 tests, and a clean production consumer starts enabled with no false loading attribute. The package's PHP/static/type suite passes 21 tests and full type coverage. A dedicated browser regression file was added; live consumer behavior was driven through the controlled browser rather than claiming that separate browser test command ran.

The correction is consumed through the Composer package and npm's vendor-file installation. The installed source is byte-identical to the package source. A fresh production document then delivered all three examples with counts 1/1, 1/1, and 3/3. The configured public font download initially failed inside the restricted build environment after npm cleared its cache; a permitted clean build downloaded those fonts and completed. The existing development marker was restored after production verification. No server process or deployment was started or stopped.

A second review found broken relative links in the newly added legacy Mosaicast installation page. Its sibling links and self-fragment were corrected. Two built-output regressions now resolve every local installation destination and fragment for Mosaicast and Front Awesome. The Mosaicast case failed on the previous generated HTML and both cases pass after the fix. Source fingerprints and only the affected documented examples/paragraphs were updated intentionally.

## Add deploy-time local full-text search

The user prioritizes maintainable index additions and accepts one stable command run during deployment. `PageSlug` remains the only page registry. Contributors keep writing ordinary Vue pages and imported partials, without copied search text or per-page search registration.

The architecture comparison considered safe Vue AST extraction and real client DOM mounting. AST extraction was selected because it does not execute component setup, couple deployments to the test runner, require a browser or service, or enable SSR. The DOM candidate contributed the need to preserve actual authored slots and source semantics. Only GPT-family models were configured and available, so no cross-family judge is claimed.

The resulting `php artisan docs:search:index --no-interaction` command exports the PHP registry to the installed Vue compiler and creates a release-local SQLite FTS5 artifact. It indexes titles, descriptions, anchored sections, prose, literal code, requirements, and tables. Complete regeneration handles additions, changes, shared partials, and deletions. Content hashing makes unchanged rebuilds idempotent. `--check` verifies freshness without writing. Validated temporary files publish by atomic rename; failures preserve the prior artifact. Runtime requests are read-only and never start indexing.

Throughput checkpoint and ownership followed during this unit:

- Ground the existing enum, Vue content, public package exports, installed compiler, SQLite availability, and shared header before choosing the index shape.
- Compare two isolated design candidates. The parent owns extraction, process documentation, CI, integration, and browser validation. Backend and frontend owners edit disjoint files against one written contract.
- Prove extraction against all registered pages before treating the shape as viable. Verify public query behavior and atomic rebuilds with real SQLite, then drive the actual header on desktop and mobile.

All 57 pages produce 347 documents, including 57 page roots and 296,655 characters of searchable body text. Independent review demonstrated future-authoring gaps involving caller slots, code notes, static kebab props, runtime text directives, and nested heading validation. Shared fixes and regression tests close those gaps without page-specific exceptions. The current corpus remains byte-identical after those corrections.

The shared public header now supplies an accessible Reka search dialog, keyboard shortcut, debounce, cancellation, stale-response protection, safe text results, and failure recovery. Search returns at most twelve results with three sections per page and canonical section links. The endpoint is rate limited and returns no-store/noindex headers, including rate-limit responses. Missing or invalid artifacts return a generic unavailable response.

The complete gate passes Rector, 192 PHP tests with 18,860 assertions, 290 frontend tests, formatting, lint, Vue types, and PHPStan. All six Maintainer tools execute with none skipped. The production client build passes. The real index command and freshness check pass; repeated execution reports current content without rewriting the artifact. Shared standards checks report zero pending files.

Browser verification covers table terms, code identifiers, an empty result, the landing entry point, Cmd+K autofocus, Escape focus restoration, and actual result navigation to the visible section. At 390 pixels, the dialog is 358 pixels wide with 16-pixel side margins and no page overflow. The viewport was reset afterward. No service, queue, deployment, or credential operation was performed.

Composer then npm compatible-refresh dry runs failed registry DNS resolution. No dependencies or locks were changed in this unit. Existing installed contributor skills remain accurate because they already delegate this application workflow to the authoring guide; no package API or consumer skill change is needed. The legacy site has no corresponding search implementation to synchronize.

Follow [search maintenance](search.md) for deployment prerequisites and failure recovery. CI builds and checks the same artifact. Full-text search is implemented; Ziggy replacement, broader demos, SEO completion, standalone preview publication, and operational verification remain separate work.

## Replace Wayfinder with native Ziggy routing

The user selects the second remaining migration unit. Replace Wayfinder with `ziggy-js` while preserving Laravel route names, URL paths, request methods, backend-owned documentation links, and QZ Tray's public client integration.

Grounding found no active imports of generated Wayfinder routes. Its Composer package, npm Vite plugin, Vite configuration, and 86 ignored generated TypeScript files remained. The live frontend route literals were in the passwordless login and account links. The existing documentation registry, search endpoint, demos, resources, and canonical metadata already derive their URLs from named Laravel routes.

Two isolated designs compared native Blade JSON discovery with Inertia-shared configuration. Native `@routes(json: true)` was selected because installed Ziggy 2.6.5 reads that element automatically and initializes the configuration for both direct imports and the Vue plugin. Plugin-only props would not configure QZ Tray's independent import. No custom loader, second route prop, static location snapshot, or generated route file is needed. Only GPT-family models were configured and available; the parent compared the designs without claiming a cross-family judge.

The implementation installs Composer `tightenco/ziggy` and declares npm `ziggy-js` with `^2.6.5`. PHP and JavaScript resolve version 2.6.5. The root Blade JSON precedes Vite, and `app.ts` installs `ZiggyVue` without options. `config/ziggy.php` filters feature groups while retaining both QZ Tray connector routes. Login forms, their documentation destination, the full-document Logs anchor, and the POST sign-out button now import the public route helper. Backend-generated documentation navigation remains unchanged.

Wayfinder's Composer and npm packages, Vite plugin, generated sources, and obsolete path ignores were removed in the same unit. Generated sources were backed up locally before removal, and dependency changes were compared with a pre-task manifest/lock snapshot. The Composer version changes are limited to removing Wayfinder and adding Ziggy. The npm package version change is limited to removing its Wayfinder plugin; Ziggy 2.6.5 already existed transitively and is now a direct dependency. Existing Artisan Toolbox frontend packages remain Composer consumers, not copied internals.

Laravel Boost refreshed its generated guidelines with `--no-discover --ignore-skills`. The old Wayfinder block disappeared and a byte comparison confirmed that custom instructions outside the generated marker survived. The application-specific routing rule and [routing workflow](routing.md) now own future authoring guidance. Existing shared skills and package usage guides remain accurate because package APIs are unchanged; the legacy site has no matching application routing integration to synchronize.

Focused tests passed 44 PHP tests covering Ziggy metadata and authentication, plus 17 frontend tests. A path-mutation test initially expected Laravel's `setUri('/guides')` to strip its leading slash; it does not. Using ordinary unprefixed URI values corrected that test setup without changing the application. Direct public helper tests verify JSON discovery before a Vue helper runs, shared Vue configuration, nested slugs, query parameters, renamed auth paths, and preserved visit methods. An independent reviewer reran the focused tests and probed default absolute QZ Tray URLs and live browser-location matching, with no actionable defect or suppressions found.

The complete gate passes Rector, 196 PHP tests with 18,942 assertions, 295 frontend tests, formatting, lint, Vue types, and PHPStan. All six Maintainer tools execute with none skipped. Production build and Composer validation pass; Composer retains the existing expected warning about an exact local preview constraint. Shared standards and public contacts report zero pending changes. Comparing route inventories confirms that all 67 HTTP names, paths, and methods are unchanged. The search index and its freshness check still report current content.

The actual browser receives one application/json route configuration with thirteen allowed names and no fixed location. Its email, verification, and sign-out routes retain POST, and Logs retains its optional view parameter. Navigating from login to documentation and back works without browser errors or warnings. No real email, authentication session, signing request, printer, queue, service, release, push, or deployment operation was performed. A browser heading-selector option was unsupported by the automation API; the observed exact heading name was used to complete verification without changing application code.

Read-only compatible update attempts for Artisan Toolbox and the main PHP and frontend dependencies failed registry DNS resolution. The explicitly requested Ziggy installation succeeded through permitted registry access, while npm reused its installed cache. No unrelated package versions or compatibility constraints were changed. Deployment uses the ordinary Composer, npm, and build sequence; Ziggy requires no route-generation command. SEO completion, broader demos, standalone preview publication, operational verification, and production cutover remain separate work.

## Integrate the existing Font Awesome kit with Web Awesome

The user supplied the browser kit script in the root Blade view. Both that script and WA's native `data-fa-kit-code` attribute now derive from one public configuration value. The installed WA 3.14.0 default library owns SVG resolution and caching. A custom Font Awesome SVG bridge was considered and rejected because it would add script readiness, prefix conversion, serialization, and cache ownership without improving this integration. Front Awesome's public exports were reviewed; it has no Icon wrapper, so the application's small `SiteIcon` component owns presentation through the public WA icon module.

Shared navigation, page outlines, search, code-copy controls, callouts, and supporting links use the same component. Text labels, package artwork, and authored guide text remain intact. A small visual map adds symbols to major navigation groups and selected second-level sections without creating another content registry. Tailwind font sizes and WA's square canvas avoid competing physical width utilities. Decorative icons, including aliased imports, remain outside the search corpus. The existing index freshness check still reports current content.

WA was already installed transitively. The application now declares it directly because it imports its public module. Comparing the lock before and after this change confirms no installed package version changed. An initial npm command interpreted the dotted scope as a nested manifest key; npm rejected that invalid specification before installation. The manifest was corrected explicitly and the offline cached install completed. Broad compatible Composer and npm dry runs failed registry DNS resolution, so no unrelated dependency refresh is claimed.

The root-document tests verify one kit configuration on the landing page, documentation, and login. Focused Vue tests exercise native attributes, accessible labels, reactive props, and the installed library's kit resolver. Ordinary component tests isolate the external SVG renderer with one shared stub; the dedicated icon tests disable it. Actual production-browser verification loaded all 54 visible and mounted icons as shadow SVGs, including GitHub brands. Dark and light themes were checked. At 390 pixels the expanded menu begins below the header and has no horizontal overflow. The production tab reports no browser warnings or errors. The original theme, viewport, and Vite development marker were restored after verification; no service was started or stopped.

The complete application gate passes Rector, 199 PHP tests with 18,957 assertions, 298 frontend tests, formatting, lint, Vue types, and PHPStan. All six Maintainer tools execute with none skipped, and the production build passes. An independent review found no actionable issue. [Icon maintenance](icons.md), authoring guidance, architecture, search policy, and the application agent rules document the integration. Shared contributor and package skills were reviewed and remain accurate because no package API changed. There is no corresponding legacy-site UI to synchronize. No live email, printer, queue, release, push, or deployment operation was performed.

## Refine package metadata, brand links, and code examples

The landing and package chooser already shared `PackageResource` and `PackageVersion`. The reported local alias `1.99.99` was missing from the display rule, which previously handled only `1.999.999`. Both exact aliases now display as `1.x-dev` at that shared boundary; neighboring releases remain unchanged. A regression failed before the change. Current Composer installation metadata agrees with the lock, and the Composer lock remains byte-identical to the task's starting snapshot. This normalization never changes dependency requirements, local aliases, or locked versions.

Overview specifications and compact guide tags now consume the existing package `repositoryUrl`, with an accessible GitHub link through `DocsLink`. Every application utility and brand icon uses `SiteIcon`, including starter controls. Lucide was removed, the Laravel starter mark uses its official Font Awesome brand icon, and the existing background texture remains artwork. An architecture test protects that boundary. The landing's Laravel, Vue, Inertia, Tailwind, and Pest links open their official sites in safe new tabs. Laravel, Vue, and Tailwind use verified official brand glyphs. Inertia and Pest await user-supplied uploaded names; their normalized single-path SVGs and source notes are in [the upload folder](assets/fontawesome/README.md). No fake brand or undocumented custom CDN URL was introduced.

The shared `CodeExample` now uses Shiki 4.6.0 with the JavaScript regex engine and selected grammar imports. The architecture comparison rejected highlight.js plus extra Vue and Blade grammars in favor of the bundled TextMate grammars that cover all fourteen authored labels. One finite registry owns aliases, toolbar metadata, and grammar loaders. The custom dark palette maps to literal Tailwind classes. Vue renders token text without HTML injection, while source slices preserve whitespace, Unicode, CRLF, and trailing lines. Unknown languages remain plain text. Failed loads remain readable and retryable, and old asynchronous results cannot replace newer props. The existing search adapter and authored language classes remain unchanged.

Full-suite verification caught changed authored language classes and the expected extra repository link in Maintainer's older overview test. Original language classes were restored. The test now verifies the additional repository link separately while preserving every legacy content destination. No content fixture was refreshed. Independent review also reproduced WA overwriting a labeled spinner's status role. The status now belongs to a wrapper around a decorative icon and a screen-reader loading message. Its native-element regression fails without the fix and passes with it; the test attaches to the document so Lit can complete its real connection lifecycle.

The final gate passes Rector, 203 PHP tests with 18,999 assertions, 340 frontend tests, formatting, lint, Vue types, and PHPStan. All six Maintainer tools execute with none skipped. The production build passes. Search indexing and freshness checks report current content; standards 1.0.4 and public contacts report zero pending files. Shiki and its dependencies were added and Lucide removed without changing any preexisting npm package version. Compatible broad refreshes remained read-only: Composer could not resolve Packagist DNS, and the offline npm refresh could not resolve a complete Inertia peer tree. No force option, relaxed constraint, or unrelated version bump was used.

The production browser verified highlighted shell and PHP blocks, package repository links, the landing's installed versions, and all three available brand icons. At 390 pixels, long examples scroll inside focusable code panes without overflowing the page, and the compact repository link remains available. The dark code palette remains readable with the light site theme. Copy controls announce success; the browser's isolated clipboard read returned empty, so exact clipboard contents are established by component tests rather than claimed as browser proof. The production tab has no warnings or errors. The original theme, viewport, and development marker were restored. No server, worker, mail, printer, push, release, or deployment was operated. Shared contributor and package skills remain accurate; these application presentation changes have no legacy-site content counterpart.

## Refine navigation and package learning journeys

The requested refinement covers compact branded symbols, complete menu icon coverage, denser navigation, native code scrollbar styling, lock-backed installation examples, package purpose explanations, and QZ Tray's page structure. Changes remain in the documentation application and its contributor tooling. Relevant package implementations and consumer skills were inspected before changing prose. `docs_old` is absent from this workspace, so this cycle uses the existing frozen migration fixtures and cannot claim a synchronized legacy source checkout. That directory was not recreated.

Core's overview and package chooser now explain its focused helpers, which do not justify separate packages. The chooser distinguishes Maintainer's maintenance, quality, versioning, and release role from business behavior while retaining the fact that production-autoloaded identity classes implement its contracts. The explanation states that the project uses those workflows itself. Mosaicast's overview leads with private session broadcasts independent of an HTTP response and explains server-selected session targets, authorization, workers, and delivery limits. The Vue plugin guide documents Front Awesome's public `mosaicast: { echo }` option as an alternative registration. PM2's guide explains that renaming a namespace does not migrate old owned processes and may require verified manual cleanup and restart. Existing package APIs and consumer skills remain unchanged.

QZ Tray's overview now introduces local previews, provides installation and a runnable first label, and links to dedicated procedures. Eight new guides separate security, connection, printing, three preview formats, frontend tooling, and development. Installation remains first, followed by security before connection and printing. Former overview IDs remain links to their owning guides. Technical prose, tables, and examples are checked across that guide collection; the frozen legacy fixture was not rewritten. The first label also has an isolated, user-triggered demo under `components/demo/qztray/preview/`, reusing `DemoFrame` and `DemoAction`. Its public `renderZpl()` call produces a local PNG without connecting to QZ Tray. Loading, failure, retry, clear, stale results, source visibility, and resizing remain within the demo boundary.

`InstallationCommands` owns exact versions and a small set of package installation recipes. Composer versions come from the installed metadata, and registry frontend versions come from the documentation lock. `PackageResource`, the reusable `InstallCommand`, and `SearchCatalog` share those values. Explicit props carry metadata through partials. The two exact local aliases normalize only in labels and command presentation. The generic package-selection placeholder and Composer-installed frontend file paths remain valid. A guard rejects named registry installs authored directly in Vue. Historical fixture examples retain their source text and mark only intentional dynamic recipes; their PHP-backed helper derives packages from the existing catalog rather than maintaining another list.

The initial optional dependency fallback to a Composer package's lock was rejected after inspecting distribution rules: Front Awesome excludes that lock from its archive. Echo Vue 2.6.3, PrimeVue 4.5.5, and PrimeUIX Themes 2.0.3 were therefore installed as documentation development dependencies. Every recipe now reads the documentation lock, with no archive-dependent fallback or unused provenance field. No preexisting npm package version changed. The six Composer package aliases changed to `1.999.999` in concurrent workspace configuration during this cycle; the agents did not write those manifests or locks and left that configuration intact. Live pages and installation commands correctly display `1.x-dev`.

Every sidebar page link now has a Font Awesome icon from one root and task map, including deep nesting and a safe document fallback for newly registered tasks. Desktop rows measure 32 pixels, while mobile targets retain 44 pixels. Reduced group margins and panel padding remove excess space. The shared code block uses Tailwind utilities for a dark color scheme, thin native scrollbars, and explicit colors even within the light site theme. Native overflow and keyboard access remain intact. Six compact monochrome package symbols were derived from existing artwork as single-path, 512-high upload SVGs. Source fingerprints and portable checks cover format, winding, and 16 and 24 pixel rendering. The optional macOS authoring script is separate from Linux builds. Font Awesome names and uploader acceptance remain pending user upload.

Independent review reproduced an extractor mismatch when an installation command was unavailable: invisible labels and slots were indexed although the UI hid them. A failing regression confirmed it, and the adapter now follows the exact visible branch. Rector required `File::delete` in the new isolated lock test. The full suite also exposed an old QZ order expectation and catalog tests that expected raw local aliases. Those expectations now cover the requested route order and documented presentation rule. All existing technical fixture checks remain strict. PHP is required on the frontend test runner's path for the shared command fixture; the local broken Homebrew binary was bypassed with the existing Herd PHP 8.5 executable, without changing system installations.

The final gate passes Rector, 209 PHP tests with 23,216 assertions, 392 frontend tests, formatting, lint, Vue types, and PHPStan. All six Maintainer tools execute with none skipped, and the production build passes. The search index and its freshness check are current, and standards 1.0.4 and public contacts report zero pending files. Read-only broad Composer and npm refresh attempts were blocked by registry DNS and unavailable offline peer metadata; no forced resolution or unrelated upgrade was used.

The production browser loaded all icons on 66 sidebar links, including the home link, with no missing SVGs, page overflow, warnings, or errors. The code example from the supplied screenshot has a thin dark scrollbar in the light theme. At 390 pixels the menu begins directly below the measured header, Escape restores focus, and the preview remains within the page. A real `renderZpl()` action produced an 800 by 1200 PNG; clear removed it. Searching for `qztray.authentication_required` returned the new security guide and navigated to its `#signing-errors` section. The original appearance, viewport, and development marker were restored. No worker, server, email, authentication flow, printer, push, release, or deployment was operated.

## Connect published kit identities and optimized font fallbacks

The user supplied the published mono names `pest` and `inertia`, and duotone names `atb-core`, `atb-dump-to-console`, `atb-front-awesome`, `atb-maintainer`, `atb-mosaicast`, and `atb-qztray`. The landing page now uses the mono marks, while package roots and compact guide tags share one identity map. Home, Documentation, and Contact complete the footer's icon coverage. Existing color artwork and wordmarks remain separate from these compact identities.

The architecture comparison confirmed that WA's installed default library cannot resolve uploaded kit families. Official families still use WA. Uploaded families use Font Awesome's documented `fa-kit` and `fa-kit-duotone` markup through the same `SiteIcon` API. A stable outer wrapper owns labels, attributes, font size, and the 1.25em canvas. Its keyed inner container isolates SVG replacement from Vue. Changing family or name removes the entire old kit-owned subtree, rather than patching an `i` element that Font Awesome may already have replaced. A global-JavaScript-API-to-WA bridge was rejected because it would add readiness handling, serialization, and shadow-root duotone styling. No guessed asset URL, second cache, polling, or HTML injection was added.

Five component regressions failed before the custom branch existed and pass after it. They cover the supplied markup, simulated SVG replacement, label and size updates, family changes, and unmount. Navigation tests cover all six published package identities; the footer test requires an icon beside every readable destination. Independent review found no actionable issue and reran the forty focused tests.

Fontaine 1.0.3 was installed as a development dependency. Laravel Vite 3.2.1 already supports it through optimized font fallbacks, so the existing Bunny declaration explicitly enables that feature and retains normal weights 400, 500, and 600. Branding consumes the generated `--font-instrument-sans` stack, which also feeds WA body and heading fonts. A separate Fontaine transform would duplicate the native pipeline and was not added. The fresh generated CSS contains a local Arial fallback with ascent 93.49%, descent 24.09%, line gap 0.00%, and size adjustment 103.76%. This verifies the generated fallback, not a measured layout-shift improvement. No preexisting npm package version changed; one existing optional dependency flag changed with the new dependency tree. SSR remains disabled.

The final gate passes Rector, 209 PHP tests with 23,216 assertions, 403 frontend tests, formatting, lint, Vue types, and PHPStan. All six Maintainer tools execute with none skipped, and the production build passes. Search indexing and freshness checks report current content. Shared standards 1.0.4 and public contacts report zero pending files. Read-only broad dependency refreshes remain blocked by registry DNS and incomplete offline peer metadata; the requested Fontaine installation used the official registry successfully without forced resolution or unrelated upgrades.

The actual production document contains the optimized font CSS and resolves the expected primary, metric fallback, and generic font stack. Its inline metric values match the build output. The browser rendered Pest and Inertia with `fak` SVGs and all six package symbols with two-path `fakd` SVGs, retaining secondary opacity 0.4. Footer icons loaded, Inertia navigation retained the package identities, and a guide tag used the same Core mark as its menu entry. The light theme at 390 pixels has no page overflow. The production tab reports no warnings or errors. A font-face-set enumeration was unsupported by the browser tool; verification used the actual inline CSS and resolved style instead. The original theme, viewport, and development marker were restored, with no manual service or deployment operation.

The icon guide, font maintenance guide, architecture, upload records, changelog, and application agent rules now describe these decisions. Shared contributor and consumer package skills remain accurate because package APIs are unchanged. No corresponding legacy-site integration was modified.

## Search discovery, breadcrumbs, and structured data

This cycle adds a named sitemap with home and all 65 registered documentation pages, dynamic robots discovery, and route-name-based internal noindex response headers. The static robots file was removed so the Laravel route can answer. Public assets remain crawlable. The sitemap emits only canonical destinations and does not invent modification times. Authentication redirects, validation failures, forbidden admin responses, successful staff screens, and configurable dashboard paths are covered by real HTTP tests.

`Documentation::breadcrumbs()` derives registered ancestors from the existing enum hierarchy. The layout reuses breadcrumb primitives, `DocsLink`, and Font Awesome; the same data supplies Laravel Head's `BreadcrumbList`. Home owns `Organization` and `WebSite`; documentation responses own `WebPage` and their trail. Schemas do not enter global defaults. Existing provider defaults continue to own social images and native Twitter fallback. `documentation/seo.md`, the architecture and authoring guides, local agent instructions, and changelog describe maintenance and verification. Shared contributor and package skills remain accurate; no public package API, authored package content, dependency, or legacy-site feature changed. `docs_old` remains absent and was not recreated.

The full quality gate passed Rector, 371 PHP tests with 24,234 assertions, 407 frontend tests across 53 files, Pint, frontend formatting and lint, Vue types, and PHPStan. All six Maintainer tools ran with none skipped. An independent review reran the 162 SEO feature tests with 1,018 assertions and found no actionable issues. New schema tests first failed on missing schemas. Feature requests share the test container, so navigation tests explicitly reset Laravel Head's scoped runtime data between requests; production code uses the native request lifecycle. Rector's first pass requested Laravel's resolve helper in three affected files; those changes were applied before the successful gate.

Production browser checks confirmed the deep guide trail, home and documentation destinations, history back/forward, initial sign-in metadata, and sign-in-to-docs navigation. Canonical and description tags remained unique; only destination schemas survived and the login noindex directive was removed on return to public docs. At 390 pixels, the trail scrolls within its own region without page overflow; focus and an actual horizontal keyboard scroll were observed. The first mobile screenshot exposed a light native scrollbar; shared Tailwind thin themed styling fixed it. The affected 17 Vue tests and full frontend formatting/lint passed afterward, followed by a fresh successful build. Production browser logs had no warnings or errors; two earlier Lit development warnings belong to the pre-build session. Screenshots: `/private/tmp/atb-seo-breadcrumb-production.png` and `/private/tmp/atb-seo-breadcrumb-mobile.png`.

Search indexing and freshness checks reported current content. Standards 1.0.4 and public contact checks reported zero pending files. Compatible dependency refresh attempts remained dry runs: Composer could not resolve Packagist DNS and offline npm could not resolve the complete Inertia peer tree. No forced resolution, constraint change, local alias rewrite, or dependency update was made. The original development marker and browser viewport were restored. No authentication submission, email, server, worker, printer, commit, push, release, or deployment action occurred.

Vue SSR remains disabled. Initial HTML contains metadata and JSON-LD, while article text requires JavaScript rendering. The post-publication URL Inspection, rich-result validation, sitemap submission, and indexing review in `documentation/seo.md` remain to be performed on the public deployment; local checks do not prove crawler indexing.

## Run Core conditional arrays in the documentation

This cycle adds a real backend demonstration to the existing Conditional Arrays guide. Two independent designs compared a bounded JSON computation with the existing Mosaicast partial-visit pattern. JSON through the installed Inertia 3 `useHttp()` helper keeps a pure Core example independent of the documentation controller, navigation, and page props. The selected request contains two booleans and selects parts of a fixed fictional payload. The response reports submitted options, the actual sifted payload, and whether the optional contact closure ran. The demonstration accepts no executable input and uses no user records, database models, or external services.

`app/Demo/Core/ConditionalArrays/` owns validation and PHP execution through the installed public `sift_when()` helper and `Arr::sift()` macro. The named POST endpoint has web CSRF protection, request throttling, private no-store responses, and the existing internal noindex policy. Ziggy exports only the new `demo.core.*` group alongside its existing filter. Route-renaming tests verify the exported destination. No duplicate package helper, marker, or browser implementation was introduced.

The isolated Vue component reuses `DemoFrame`, `DemoAction` and its public Front Awesome button, and `CodeExample`. Actual Vue, controller, and request files supply the source disclosure through raw imports. The first run preserves false, null, zero, and an empty string while omitting the contact and the middle item. Core preserves the sparse numeric keys, so the actual JSON shows an object; including the middle item produces a list. The UI labels the last submitted options separately from inputs for the next run. No request starts on mount, option changes, or reset.

Native `useHttp()` validation resolves without a success value, successful requests advance form defaults, and a canceled request can settle after a replacement begins. Explicit initial defaults and a local run identity account for those behaviors. The demo phase remains the visible-state owner so a late native completion cannot remove the newer run's busy state. Actual native-helper tests replace only the HTTP client boundary and cover late success and validation responses, reset, retry, duplicate suppression, and unmount cancellation. Native checkbox labels have 44-pixel touch targets.

The first complete gate detected the intentionally added heading and prose in the strict migration parity check. After reviewing the new section and existing authored content, its explicit expected additions were registered in that test. Frozen source fixtures were not changed; all original examples, prose, headings, tables, requirements, and destinations remain checked. The affected 26 parity tests then passed. The repeated full gate passed Rector, 382 PHP tests with 24,320 assertions, 414 frontend tests across 54 files, Pint, frontend formatting and lint, Vue types, and PHPStan. All six Maintainer checks ran with none skipped, and the production build passed. Independent correctness and comment reviews found no actionable issues and no comment deletions.

The production browser ran the initial all-off case, both options enabled, and contact-only input against the actual Laravel endpoint. Results confirmed closure evaluation, retained values, nested contact inclusion, sparse keys, and JSON-list output. The guide URL, canonical, and structured-data identities stayed unchanged. The actual PHP source disclosure opened and reset cleared output and selections. At 390 pixels, the light-theme page had no horizontal overflow and both labels measured 44 pixels. Native frame dragging reduced its width from 671 to 326 pixels; the example still ran without page overflow, and the frame was restored. Recent production logs had no warnings or errors. Screenshots are `/private/tmp/atb-core-demo-production.png`, `/private/tmp/atb-core-demo-mobile-light.png`, and `/private/tmp/atb-core-demo-resized.png`.

Search indexing published the new static section, and its freshness check passed. Searching for `fictional profile` returned the guide's `try-conditional-arrays` section and reached that heading below the sticky header. Interactive controls and results stay excluded from the search corpus. Standards 1.0.4 and public contact checks reported zero pending files. Compatible dependency refreshes remained dry runs and were blocked by Packagist DNS and offline npm peer resolution. SHA-256 checks confirmed that both dependency manifests and both locks remained identical to their task-start versions, preserving local aliases.

The maintenance procedure is in `documentation/core-demos.md` and linked from the authoring guide. Package public APIs and usage skills remain unchanged. `docs_old` is absent, so no legacy checkout synchronization is claimed and that directory was not recreated. The original theme, viewport, frame width, and Vite development marker were restored. No authentication submission, mail, queue, broadcaster, printer, commit, push, release, deployment, or server operation occurred. Vue SSR remains disabled.

## Gate deployment on the release search index

This cycle connects the existing index command to the application's deployment workflow. The local server-specific `deploy.php` is ignored by Git, so application-owned search logic belongs in the new `resources/deployer/search.php` recipe. The local file imports it and explicitly runs `docs:search` after optimization and before migrations, PM2 configuration, publication, and reload. No host, user, path, PM2, or service setting was changed. The recipe import and gate must be retained when an operator regenerates that local file.

Two initial designs compared native Artisan tasks with a publication hook. A publication hook would run after PM2 in the current sequence and disappear with hooks disabled. The selected recipe is one ordinary Deployer task with two ordered commands: create the index, then check its freshness. Both commands use the configured PHP executable and the candidate release's working directory, with non-interactive flags and visible command output. Exceptions propagate normally, so build failure prevents checking, and either failure prevents all later migration, PM2, publication, and reload stages. The task never uses Deployer's current-release fallback and the artifact remains release-local.

The installed Deployer 8.0.5 passes its `cwd` argument to the runner without expanding template placeholders. The executable regression exposed a literal `{{release_path}}` directory before the recipe used `get('release_path')`. Tests then proved exact candidate context, including a spaced local fixture path. They deliberately configure `release_or_current_path` to the old current location, whose sentinel Artisan file must never execute.

`DocumentationSearchDeploymentTest` uses real Deployer Task, Context, ScriptManager, and ProcessRunner APIs through an isolated PHP subprocess and a disposable localhost fixture. It disables hooks, substitutes only external Artisan behavior, and uses harmless fixture markers for other deployment stages. Repeated success verifies command order and options; parameterized build and check failures leave the previous current symlink and artifact intact and never reach later stages. The first regression failed before the recipe existed. Native CLI execution required a worker socket blocked by the sandbox, so these tests use the native task APIs directly without a worker server. Existing feature tests separately exercise the real Vue corpus, unchanged rebuilds, stale checking, and atomic artifact publication.

All three new tests pass with 40 assertions. The complete gate passes Rector, 385 PHP tests with 24,360 assertions, 414 frontend tests across 54 files, Pint, frontend formatting and lint, Vue types, and PHPStan. All six Maintainer checks ran with none skipped. The production build passes, and local Artisan build and freshness commands both report a current index. Independent review found no actionable correctness or documentation issues, no comment deletions, and no suppressions.

Both implementation and independent parent inspection verified the actual local deployment's expanded order without executing its tasks. The parent inspected the effective task graph with hooks disabled; `/private/tmp/atb-search-deploy-order.json` records vendors, npm installation, asset build, optimization, search, migration, PM2, publication symlink, and reload in order with zero executed callbacks. The implementation owner also inspected Deployer's native tree output. No deployment, remote connection, PM2 command, server process operation, authentication, email, commit, push, or release action was performed outside disposable test fixtures.

The search maintenance guide now explains the recipe import, explicit sequence, failure behavior, release-local storage, and manual repair context. The quality guide, local agent rules, and changelog describe the same ownership. No package public API or usage skill changed, and no authored public page or legacy fixture changed. `docs_old` remains unavailable and was not recreated. Standards 1.0.4 and public contact checks report zero pending files. Compatible dependency dry runs remain blocked by Packagist DNS and offline npm peer resolution; hashes confirm both dependency manifests and both locks match their task-start state. Existing local version aliases were preserved. There is no new index implementation, scheduled indexing service, or Vue SSR change.

## Use documentation Horizon with external WSS Reverb

The operator clarified process ownership during this cycle: Horizon runs only on the documentation server, and broadcast delivery uses the separate WSS Software Reverb application. That Reverb application does not run Horizon for the documentation. The initial idea of managing Reverb, Horizon, and a scheduler together was superseded. The documentation PM2 ecosystem now contains only `Horizon ATB`; no scheduler or local Reverb server is added.

The existing PHP interpreter, current-release working directory, singleton count, automatic restart, and memory threshold remain. Horizon receives a 90-second shutdown allowance and `treekill: false` so its native master can drain supervisors and workers. The installed Horizon command explicitly handles SIGINT; inspecting only its signal trait initially missed that entry-point handler, and the conclusion was corrected before implementation. The shutdown allowance exceeds the actual 60-second maximum supervisor timeout. A regression loads the real CJS through Node and compares the configuration with native Horizon provisioning; it failed against the previous Reverb-only process and passed after the change.

The local ignored deployment sequence now publishes before applying PM2 and running the existing reload stage. This ensures the stable current-release path points to the new code when Horizon boots. The search gate still runs before migrations and publication. The disposable search deployment fixture follows the same stage order. Read-only inspection of the actual local task graph verified search, migration, symlink publication, PM2, and reload in that order; no callbacks ran. A failure while applying PM2 happens after activation and does not undo the publication switch. The operational guide documents that boundary and separate scheduler ownership.

The user supplied application credentials for the private documentation environment and subsequently configured the external host. Only the documentation application's private environment was edited; the separate Reverb application's files were not changed. The public example contains empty ID, key, secret, and host placeholders, HTTPS/443 defaults, and public Vite references. No credential values appear in this record. Readiness checks reported complete backend and frontend configuration, without printing their values. The secret is absent from the example, Git-visible repository files, and generated frontend assets; the private environment remains ignored. There is no Vite secret variable. No copy of the private environment was created.

Backend demo readiness now requires application ID, key, secret, host, the Reverb broadcaster, and Redis's queue driver. Missing application ID or secret previously accepted the request; both regressions first returned 200 and now reject work without queuing. The readiness boolean does not expose private values or claim service health. Tests use synthetic credentials and verify the rendered response does not contain their private values.

A second regression covers a fast worker delivering before the initiating HTTP response finishes. Previously, after that completion allowed reset and a new run, any late success, error, cancellation, or finish callback from the older request could replace the newer run's state or listeners. Late errors or cancellation also erased an already observed completion. Captured run identities and completed-state checks now protect those paths. Tests exercise the public Mosaicast plugin with Echo and Inertia boundaries isolated. The demo and guide now describe a queued session event without promising delivery after the response; either network order is valid. No package implementation was copied.

Filling the private development connection also revealed that ordinary component imports could construct Echo from that environment. A regression replaced the network constructor and failed before native Vite Plus test overrides cleared the development key and host. The test then passed without contacting Reverb. This isolation applies only to tests; production builds use the configured public endpoint.

Independent review passed 27 focused PHP tests with 154 assertions and 11 queued-demo frontend tests, finding no actionable issues or comments requiring deletion. The complete gate passed Rector, 393 PHP tests with 24,398 assertions, 421 frontend tests across 55 files, Pint, frontend formatting and lint, Vue types, and PHPStan. All six Maintainer checks ran with none skipped. The production build passed, and the real index build and freshness commands both reported current content. Standards 1.0.4 and public contact checks reported zero pending files. Compatible dependency dry runs remained blocked by registry DNS and offline peer resolution; the manifests and locks match their recorded hashes.

Queue operation, demo maintenance, architecture, search/deployment order, quality guidance, local agent instructions, the template, and changelog now describe the same ownership. Package APIs and usage skills remain unchanged. The absent legacy checkout was not recreated; frozen content fixtures remain unchanged. No live PM2, worker, Reverb server, scheduler, authenticated demo job, email, SSH, commit, push, release, or deployment action was performed. Actual deployed Horizon-to-WSS delivery and cross-session non-delivery remain operator verification steps in `documentation/queues.md`.

## Verify public distributions and prepare the Front Awesome preview

This cycle investigates standalone installation while preserving the operator's global Composer routing and local aliases. The root manifest declares public ranges without repository overrides, but all six Artisan Toolbox entries in the workspace lock use absolute path distributions with the local `1.999.999` alias. Composer installation from that lock depends on the workspace. The stale two-package preview description in the quality guide and README was corrected.

A temporary consumer copy contains Git-visible application sources and public example configuration, without the private environment, vendor directories, sibling packages, or database records. A separate Composer home, cache, and empty authentication configuration prevent local routing from affecting dependency resolution. The first public resolution rejected Front Awesome's stable constraint because Packagist offered only `1.x-dev`. The operator explicitly permitted a Front Awesome-only `^1.0@dev` preview. That exception was applied only in the temporary candidate while compatibility remained under verification; global stability and development routing were not changed.

The public candidate resolved Core 1.2.1, Dump to Console 1.1.1, Maintainer 1.11.0, Mosaicast 1.2.0, QZ Tray 1.2.0, and Front Awesome 1.x-dev at commit 1ed4592, all as remote ZIP distributions. Composer installation, package discovery, application key generation using the public template, and npm ci succeeded. Actual frontend build then failed because the public Front Awesome archive lacks the `./vite` export. It also lacks the consumed `./tailwind.css` and `./web-awesome-tailwind` entries. Those exports exist in the local staged package changes. A public-archive PHP run passed 386 of 393 tests; seven request tests failed because that unsuccessful asset build produced no Vite manifest. No fake manifest or copied package implementation was used to conceal the failure. Standalone compatibility remains unproven until the required package source is published and this consumer workflow passes.

One initial Composer invocation accidentally used the application directory. Its resolution failed before lock changes; the subsequent install reported nothing to install, update, or remove and regenerated autoload metadata. Hash checks immediately confirmed both manifests and both locks unchanged at that point. The verification was rerun with an explicit temporary working directory. The main Composer lock, npm manifest, and npm lock still match their task-start hashes. The only main Composer manifest change is the optional distribution-check script; no root dependency resolution was substituted after a failed public build.

`scripts/check-distribution.php` is a dependency-free pre-install guard. It reads a lock without Composer autoload, rejects local source and archive locations in runtime and development collections, and reports only package names rather than URLs or credentials. It checks location, not version labels, and accepts remote development branches and the local-alias number when a package actually has a remote archive. The GitHub workflow runs it before Composer installation, and `composer distribution:check` exposes the same operation. The guard's 33 process tests passed with 140 assertions, including missing or malformed input, source-only packages, remote archives, local paths, safe diagnostics, and a vendor-free project. Independent review found no actionable issues or comment deletions. The current workspace lock correctly fails this release guard; the isolated public lock passes it, which by itself does not establish a working build.

The Front Awesome candidate contains two local commits beyond its published origin reference plus 36 prepared feature files. The feature scope covers shared Tailwind and Web Awesome branding, token generation, public Vite and stylesheet entries, optional PrimeVue integration, boolean button attributes, consumer tests, documentation, and public contacts. The package's release and testing skills were followed without committing, pushing, tagging, or publishing. Composer test passed 21 tests with 52 assertions and 100 percent type coverage; frontend unit tests passed 25 cases, browser tests passed 2 cases, and production builds and Core/optional PrimeVue theme consumers passed. All six Maintainer checks ran. Licensed Pro compatibility was not tested and is not claimed. The staged candidate was preserved during verification. The bundled consumer skill and changelog then received focused wording corrections: explicit preview installation, public exports and canonical links, application build validation, and removal of contributor-only maintenance commands. Native YAML/link/export checks, npm check, and four focused PHP tests passed afterward.

Concurrent Mosaicast documentation added a package-build subsection and Vite Plus upgrade link. The strict parity tests identified the additional heading and destination. After checking the authored commands against the package manifests, lock, build configuration, and CI, explicit expectations were added for the heading position, two paragraphs, example, and link. Frozen source fixtures and the existing Core demo expectations remain unchanged. Historical public-contact prose in two package changelogs was corrected without producing self-referential replacement wording. The 26 focused parity tests passed and the public-contact checker returned zero pending files.

The final local application gate passed Rector, 426 PHP tests with 24,538 assertions, 421 frontend tests across 55 files, Pint, frontend formatting and lint, Vue types, and PHPStan. All six Maintainer checks ran with none skipped. Local production build, actual search indexing and freshness, Composer validation, standards 1.0.4, and contact checks passed. These local checks use the existing development packages and must not be described as a successful public consumer build.

Anonymous read-only production inspection returned HTTP 200 for robots.txt and HTTP 404 for sitemap.xml and docs/core. This does not establish public rendering or indexing of the new implementation. No server deployment, authenticated job, or Search Console submission was performed.

Publication approval was requested specifically for a commit and push to the Front Awesome 1.x branch, including its two local commits and prepared feature changes, without a stable tag or release. The package-release skill requires explicit approval for push or publication. Approval remains pending at this checkpoint. Once the preview contains the required exports, rerun the isolated public archive installation, quality checks, build, and indexing; only then adopt the verified portable root lock and update the central installation guide from checkout instructions to the public preview. The user retains control of production deployment and live Horizon-to-WSS verification.

## Keep alpha publication and deployment with the operator

After explicit preview commit/push approval, the Maintainer commit workflow was opened in Front Awesome. The operator then reserved alpha publication and deployment. The workflow was canceled at its initial diff-review prompt, before file selection or commit creation. Read-only checks confirmed the package HEAD and the staged diff hash still match the validated baseline. No commit, push, tag, release, or deployment was performed.

The Front Awesome candidate is ready for the operator's alpha workflow on the basis of its recorded local validation. This does not claim a remote GitHub Actions result. The documentation application's local quality gate and build also pass, but its standalone distribution gate still rejects the existing development path lock. After the operator publishes the candidate, resolve and install that public alpha in the isolated consumer, verify the required exports, build, tests, and search, then adopt the portable lock before calling the documentation application ready for independent CI or deployment. The preview exception remains approved; publication and deployment remain operator-owned.

## Consume the published Front Awesome alpha

The operator published Front Awesome `1.0.0-alpha.1` at `a55e06f`. A separate Composer home, cache, and empty authentication configuration installed that public ZIP in the temporary consumer without workspace siblings. The archive contains the public Vite, Tailwind, Web Awesome adapter, Button, and consumer skill entries used by the documentation. The first public build passed. The complete gate then exposed one first-success test that hardcoded the local `1.x-dev` label. It now derives the actual installed command and version; PHP coverage separately verifies normalized aliases, ordinary releases, and the alpha version. The mandatory path-repository command was removed. Four reviewed paragraph changes explain the published preview and frontend refresh while preserving all nine examples, anchors, and frozen parity data.

The initial verified public lock was adopted without reinstalling local Composer packages or changing global routing. During review, a concurrent update added public Mosaicast `1.2.1`, QZ Tray `1.3.0`, and Constant Time Encoding `3.1.4`. Those changes were preserved and copied into the isolated consumer for a fresh exact-lock installation. Front Awesome remains `1.0.0-alpha.1`; Core is `1.2.1`, Dump to Console `1.1.1`, and Maintainer `1.11.0`. Only Front Awesome uses the approved `^1.0@dev` exception; the project's minimum stability remains stable.

An npm lock-only install retained stale file-package metadata, and a name-based npm update attempted to resolve the unpublished Mosaicast npm name from the public registry. No force or peer-check bypass was used. Rerunning the documented installation with all three explicit vendor paths refreshed the native lock correctly. Fresh npm ci then installed Front Awesome, Mosaicast, and QZ Tray with versions matching their Composer-delivered package manifests. The final npm lock was integrated only after comparing all four root dependency-file hashes against the captured concurrent-update baseline.

The latest isolated consumer passed Rector, 427 PHP tests with 24,541 assertions, 421 frontend tests across 55 files, Pint, frontend formatting and lint, Vue types, and PHPStan. All six Maintainer checks ran with none skipped. The production build, actual search build and freshness check, distribution preflight, and Composer validation passed. The workspace also passed its complete quality gate, build, index/freshness, standards 1.0.4, and public contact checks. Independent review found no actionable correctness issues and no changed comments requiring removal. No package implementation was copied into the application, and no private environment or authentication file was copied into the consumer.

These are local executions against actual public distributions, not a claim that remote GitHub Actions ran. Alpha publication was performed by the operator. No commit, push, tag, release, server deployment, authenticated demo job, email, SSH, or live Horizon/Reverb check was performed in this cycle. The operator retains deployment and the live queue/broadcast verification documented in queues.md.
