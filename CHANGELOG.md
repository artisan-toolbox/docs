# Changelog

## Unreleased

### Documentation

- Adopt the published Filoquent `1.0.0-beta.3` release in the documentation application, package metadata, installation guide, and overview. Document `filoquent:status` as a released command alongside the existing health audit, including connection probes, effective Redis parameters, current upload counters, read-only behavior, and exit codes.

## [1.2.0] - 2026-11-13

### Features

- **Publish Filoquent alpha 1 docs and installation flow** (`d7aa472`)
  Published the Filoquent alpha 1 documentation and updated the documented installation flow to match the newly published `1.0.0-alpha.1` release (Alpha status), including guidance to install from Packagist and derive installation commands from the locked version. Removed/avoided the prior local-checkout/source-preview prerequisite from the installation narrative and documentation. This includes updating doc metadata (version, stability, summaries/requirements text), rewording multiple UI pages/tests from “development preview/unpublished preview” to “alpha release,” and refreshing the installation section to use the Packagist-based command path instead of the previous preview/source workflow.

## [1.1.0] - 2026-11-13

### Features

- **add Filoquent documentation pages and preview guide** (`0670420`)
  Adds new Filoquent documentation coverage, including a dedicated Filoquent package, multiple new documentation page classes (index, installation, files, configuration, health, storage lifecycle/recovery, garbage collection, development, rename-owners), and a corresponding preview guide/command wiring. Documentation registration is extended so the Filoquent documentation package participates in package-based documentation generation, and page slugs are extended/organized to include the new Filoquent section. For preview installation, adds an installation command set for the `filoquent` package that configures the Composer repository path to `packages/filoquent` and then requires `artisan-toolbox/filoquent:1.x-dev`, enabling executable “preview” setup steps for users. Additionally, the release documentation notes include editorial/navigation ordering requirements for package lists (alphabetical by displayed title while preserving prerequisite order for guide content within packages). User impact: users gain new Filoquent docs and a working preview installation path; navigation/catalog ordering may change but backend behavior should remain unaffected. Compatibility/migration: no code/config/API removals are implied; however, consumers that rely on the exact documentation package set or navigation ordering may see additional generated catalog entries and different ordering consistent with the new authoring rules.

### Fixes

- **defer docs font history scroll position and wheel target** (`0e10bbb`)
  Updates the docs UI behavior for the font history/history browser so that scroll position is deferred and the wheel interaction targets the correct element. This stabilizes the documentation history browser checks mentioned in the broader release notes and reduces UI flakiness during interaction. User impact is limited to the documentation frontend: browsing font history should behave more predictably without unexpected jumps or misdirected scroll wheel input. Compatibility/migration: no backend or API changes; only affects the documentation UI behavior.

## Unreleased

### Added

- Add a dedicated Filoquent upload middleware guide with the published generator command, a complete cast example, native attributes, named variants, and temporary-file ownership. Preserve the existing file guide anchor and link configuration to the new task guide.

- Introduce optional Filoquent configuration before the first file example in the Installation guide, with its defaults, publishing command, and a link to the complete configuration reference.
- Document Filoquent beta 2's optional repeatable `#[File(...)]` model configuration, inheritance, explicit-cast precedence, validation, and middleware. Describe backed SQL state enums and unchanged persisted values without requiring a new migration. Keep the executable cast quickstart and optional native declaration examples aligned with the published beta 2 release.
- Document every Filoquent environment setting, its default, configuration-cache refresh, and published beta 2 availability. Remove the unused placeholder setting from the current configuration example and explain how to update older published files.
- Register Dapter as an unreleased preview with local installation, identity examples, development checks, and package artwork. Keep its catalog entry and navigation in alphabetical order, and use its published Font Awesome duotone identity.

- Document Filoquent's persistent missing-table groups, daily SQL-backed error reporting, and explicit rename, restoration, or permanent-removal resolution. Add a controlled model, column, and table renaming guide with reversible Laravel migrations and preserved file paths.

- Document Filoquent's read-only file health audit, coverage and recovery limits, maintenance logs, and background scheduling for health, collection, and retirement retries.

- Document Filoquent's optional Redis upload journal, reserved logical database setup, forward migration, bounded SQL consolidation, delayed pending cleanup, and recovery limits.

- Filoquent documentation with executable Eloquent file installation, middleware variants, storage lifecycle, bounded cleanup, delayed orphan reconciliation, fixed model-and-field directories, configuration, development, package artwork, search, and shared page metadata.

### Changed

- Promote Front Awesome to Beta across the package catalog, guides, component examples, and contributor records. Preserve Maintainer-managed version identifiers and historical release records.
- Document Filoquent's Beta status and published `1.0.0-beta.2` release. Install it from Packagist, derive installation commands from the locked version, and remove the local-checkout prerequisite.
- Document Filoquent's complete SQLite, MySQL, and PostgreSQL dependency matrix, native-engine test commands, disposable worker databases, and explicit SQLite fixture limits.
- Explain schema-qualified PostgreSQL ownership, blocked upgrades of older unqualified receipts, and bounded table-route rotation around blocked garbage-collection groups.

- Use Filoquent's published duotone kit icon in documentation navigation and compact package tags.

- Replace Filoquent path relocation guidance with creation-only paths and persistent manifest ownership after model, field, or configuration changes.

- Document typed Filoquent filename policies through the `FileNaming` enum and retain the existing naming precedence and stored metadata contract.

- Refresh compatible npm dependencies and Composer-delivered frontend copies.

### Fixed

- Stabilize documentation history browser checks by establishing the deferred-font reading position and directing wheel input to the visible article gutter.

- Clarify that Filoquent release checks run after Maintainer updates the source version and must not require the previous version number.
- Explain Filoquent's automatic single-process PHPStan analysis on Windows, shared Testbench bootstrap constraint, and unchanged analysis scope.
- Clarify Filoquent physical ownership keys, committed callback failures, unavailable local-volume retries, UTC cleanup timestamps, and compatibility-aware contributor checks.

- List packages alphabetically across the home page, documentation index, package chooser, and sidebar while preserving the prerequisite order of guides within each package.

## [1.0.0] - 2026-11-12

### Features

- **Add Front Awesome preferences and localization documentation** (`05a0cec`)
  Adds new documentation covering Front Awesome preferences and localization. This feature matters for users who need to configure Front Awesome behavior and support multiple languages/locales correctly. Compatibility impact is documentation-only, but it enables more complete configuration understanding and reduces guesswork when enabling localization features.

- **Verify interactive docs in CI and migrate documentation structure** (`6e4f4a3`)
  Introduces CI verification for interactive documentation and migrates the documentation structure. This increases confidence that interactive UI behavior in the docs works as intended across environments. User impact includes fewer regressions reaching users, and improved documentation reliability. Compatibility: may require developers/maintainers to adapt to the new doc structure conventions and CI expectations.

### Fixes

- **Stabilize deferred controls and fragment navigation in docs** (`29f4038`)
  Improves frontend documentation behavior by stabilizing deferred controls and fixing fragment navigation issues. This helps ensure that when users navigate to URL fragments (e.g., hash-based routes) or rely on deferred UI controls, the correct content reliably loads and renders instead of exhibiting timing/ordering glitches. User impact is reduced navigation flakiness and fewer mis-positioned or stale fragment views during documentation browsing.

- **Keep Mosaicast message fields usable on mobile** (`ed6d3ed`)
  Fixes mobile usability for Mosaicast message fields so that message input/interaction remains usable on small screens. This addresses layout/interaction problems that likely caused fields to become hard to read, overlap, or fail expected interaction patterns on mobile. User impact is improved accessibility and reliability of message entry on mobile devices.

- **Align package guides and secure Vitest 5 toolchain** (`dec80bc`)
  Corrects documentation for package guides and updates the setup to align with and secure the Vitest 5 toolchain. This helps prevent test-toolchain drift and inconsistent developer/CI behavior while keeping guides accurate. Compatibility impact is primarily for documentation accuracy and ensuring the project consistently uses the intended Vitest 5 version for tests.

### Documentation

- **Update preferences docs for refactoring and isolation** (`df35cdd`)
  Updates documentation on preferences to reflect recent refactoring and isolation work. The main value is reducing confusion: developers can rely on accurate guidance about how preferences should be configured and how isolated/refactored behavior is intended to work. User impact is improved correctness of how-to instructions and fewer implementation mistakes when configuring preferences.

### Tests

- **Preserve reading position during history navigation in docs** (`c9b505c`)
  Updates documentation tests to ensure reading position is preserved when users navigate browser history (back/forward) or otherwise move through navigation events. This matters because history navigation commonly causes scroll/reader state resets; the test change locks in correct behavior so regressions are caught in CI. User impact is smoother “resume where I left off” reading across history traversal.

### Maintenance

- **Update docs ownership, standards, and Front Awesome pages** (`5854049`)
  Includes the changes introduced by commit 5854049: chore: update docs ownership, standards, and Front Awesome pages.

## Unreleased

- Cancel superseded fragment alignment on every navigation, including history visits back to the same URL.
- Wait for native accessible checkboxes before clicking their labels in application browser verification.
- Reserve the theme selector's final height during custom-element registration and wait for font layout before positioning documentation fragments.
- Preserve the browser history test's reading position during its Home click and verify departure through Inertia's public navigation event.
- Keep Mosaicast demonstration message fields readable on narrow screens by wrapping their action buttons. Verify native textbox geometry and text entry in the browser.
- Align the documentation toolchain with Vite Plus 1.6 and Vitest 5.1, restore Vue Test Utils 2.5, and fix its vulnerable formatting dependencies. Check moderate and higher npm advisories in CI.
- Require Front Awesome 1.0.0-alpha.2 and QZ Tray 1.4.0, and align feature availability with those releases and Maintainer 1.11.0. Keep the later Maintainer task-search feature marked as a development preview.

- Document equal viewport visibility and active-panel readiness for native and Vue component comparisons.
- Explain observable browser assertions for asynchronous wrapper initialization and delayed-loader regression coverage.
- Document the Playwright clipboard permissions required for real copy-button verification in Chromium headless shell.
- Explain registered-command analysis, complete CI matrix results, and validation of programmatic translation command options.

- Document translation exporter shutdown, including cancellation, process cleanup, and awaiting a programmatic Vite server before removing its working directory.

- Document the Front Awesome source preview's Laravel 13.36 minimum, the numeric JSON translation fix, and the upgrade required for earlier Laravel 13 applications.

- Document portable QZ Tray image fixtures and explicit native PHP decoding coverage for Windows without GD or Imagick.

- Document QZ Tray's Vite Plus 1.6 source-tooling requirements separately from compiled consumer compatibility, aligned Vitest packages, development-only CI dependencies, and image-width validation before decoding.

- Document build-host Node locale validation, full cached-page preference reconciliation, and nested authenticated PDF preview options. Keep public distribution checks separate from local Maintainer validation while the required QZ and Front Awesome APIs remain unpublished.

- Group Front Awesome appearance, language, timezone, and optional currency guides under Preferences. Adopt the public backend preference middleware and frontend service in the documentation application, demonstrate Inertia persistence and native Vue I18n formats, and link translation guides to language preference setup.

- Document wildcard locale discovery, ordered selector allowlists, availableLocales catalog compatibility, and the distinction between selectable languages and internal fallback catalogs.

- Document APP_FALLBACK_LOCALE as the default Front Awesome translation fallback.

- Demonstrate the simplified print workflow by default. Make confirmation between documents and the final report explicit options, and distinguish simulated missing submission responses from normal printing.

- Add optional Laravel-source Vue I18n localization guides, export and filter reference, HTML-language demonstration, and reactive printing guidance. Keep preview availability and native Portuguese translation limits explicit.

- Keep prose formatting outside the live print workspace so documentation list rules cannot inflate completed-job spacing. Demonstrate the compact review and summary layouts.

- Document the preview-first Front Awesome printing workspace, shared promise jobs, printer preferences, result states, and extension points as source-preview APIs. Add a reader-triggered demonstration using real PHP-generated ESC/POS, a two-page PDF, and ZPL previews with explicitly simulated submission.
- Document the optional Mike42-backed QZ Tray receipt writer and the adapter that renders a public print document without connecting to a printer. Keep setup prerequisites and learning order in the canonical page registry.

- Run the existing interactive documentation browser chain in CI against an isolated Laravel server with file sessions, after the production build and search checks. Keep the distribution lock prerequisite and all Maintainer checks.

- Clear stale clipboard feedback and ignore obsolete copy completions when a code example changes, while preserving copy focus. Preserve CRLF line endings in synchronized live demo source.
- Document rejection of sparse form-value arrays while preserving valid empty collections.

- Consolidate compound Web Awesome examples under their owner controls while retaining catalog discovery and historical anchors. Move Input and shared form binding guidance into Forms, with redirects from the former guide.
- Demonstrate two-way models, Inertia values and server errors, manual danger validation, collections and calendars through runnable examples with exact source. Expand Icon source, transformation and failure/recovery demos, and document supported named component models.

- Consolidate Button, Button Group, Page and Icon references in their category sections, preserving integration content, historical anchors and permanent legacy redirects.
- Use public Page as the base of documentation, home and sign-in layouts. Keep the existing reading/navigation contracts, native skip navigation and consistently sized header controls.
- Preserve direct and Inertia fragment destinations after native element initialization while retaining history scroll restoration.
- Tighten component status spacing, distinguish Page demo regions, fix programmatic Tooltip dismissal and restore Skeleton indicators. Add reader-controlled pulse/sheen effects and real browser regressions.

- Keep programmatically opened Popover demos visible by stopping the opening click before native outside-click dismissal. Synchronize the displayed source with all 90 live catalog demos, including the original wrappers.

- Consume public Front Awesome controls for editorial callouts, code copying, appearance selection, package identity labels, official icons, sign-in forms and interactive demo actions. Preserve existing domain ownership, routing, theme cookies and native controls where integration constraints require them.
- Fix sign-in step focus after processing completes. Add a compiler-based application usage inventory and desktop/mobile, light/dark browser checks for real clipboard behavior, theme persistence, Core controls, source presentation and isolated sign-in workflows.

- Place all catalog demos in one discreet responsive frame with measured width, presets, pointer/keyboard resizing, and deferred source highlighting. Preserve natural control geometry and fix Rating pointer selection/output. Add real local browser verification for every frame.

- Add working Vue examples and source snippets for all 90 Web Awesome 3.14 Core and Pro wrappers, with preview and licensing requirements, shared catalog destinations, and local reader-controlled media fixtures.
- Document the shared Tailwind host reset policy and wrapper verification requirements, including native comparisons without Preflight and interactive states.
- Install the licensed Pro runtime for reproducible documentation examples while keeping credentials in the configured environment.

## [1.0.0-beta.2] - 2026-11-07

### Features

- **defer highlighting and document brand logo generation** (`3779ea8`)
  Updated documentation to match the new deferred code highlighting and branding/logo generation behavior:
- Code examples now defer syntax highlighting until the example’s figure first intersects the viewport (with a 200px vertical margin). This preserves immediate plain text/copying, native disclosures/search content, and avoids importing highlighters (with no loading indicator) until the reader reaches the content.
- Highlighting behavior is designed to be resilient across scroll away/back, preserving admitted tokens/results and protecting against stale results when the source or language changes.
- DemoFrame behavior was documented: code examples remain mounted inside native `<details>` and start with `highlightEnabled=false`; highlighting is permanently enabled only after the reader opens “View the running source,” with reopening retaining completed tokens and preserving native disclosure interactions.
- Added guidance that `highlightEnabled` defaults to `true` for ordinary pages and should be controlled via the shared disclosure component rather than per-page switches; also notes that browsers without Intersection Observer may eagerly highlight eligible examples.
- Expanded/added documentation around brand wordmarks: `scripts/build-brand-logos.mjs` generates transparent, responsive WebP brand wordmark variants (widths 192/384/576) and associated theme metadata under `resources/js/assets/brand/`.
- Documented the intended rendering approach using the `BrandLogo` component with a single responsive image (`srcset`/`sizes`) rather than CSS-hidden dual wordmarks or multiple theme controllers.
- Documented how Vite outputs fingerprinted WebP assets to `public/build/assets` using `?no-inline`, and that immutable caching is compatible with these fingerprinted outputs.
- Documented the related build/generation workflow (including how `ignore-scripts=true` skips npm lifecycle hooks but generation can still be run explicitly) and warned that `dev`/`build` should fail if generation fails, with guidance to rerun the appropriate commands.

User impact: readers get better initial content accessibility/performance (immediate non-highlighted text/copy; less upfront work), and operators/developers get clearer instructions to reliably generate and serve responsive brand logos and apply correct caching/rendering patterns.

Compatibility/migration: ensure any custom disclosure/components follow the documented `highlightEnabled` control flow, and switch brand wordmark rendering to `BrandLogo`/responsive `srcset` usage rather than older per-page/per-theme hidden-wordmark patterns.

## [1.0.0-beta.1] - 2026-11-06

### Maintenance

- **Add AI standards and documentation skills** (`3c4140e`)
  Introduces new contributor “skill” documentation and supporting standards for Artisan Toolbox’s AI/agent tooling. Adds documentation-writing and documentation page-pattern guides under `.agents/skills/atb-documentation/` (including audience selection, Diataxis/page-pattern selection, preserving public contracts/links, verifying examples against APIs/behavior, dependency boundary guidance, navigation component coordination, and migration handling). Adds a package-development workflow standard under `.agents/skills/atb-package-development/` for implementing/fixing/reviewing Laravel packages, emphasizing contract preservation, regression testing, consumer adoption guidance, and release evidence. Adds corresponding AI-side skill documentation under `.ai/skills/` and adds new standards lock/sync tooling via `.ai/standards.lock.json` and `.ai/sync.mjs` so the AI can verify/pin expected file contents and safely synchronize managed standards bundles. Updates tooling expectations that consume these standards (primarily affecting contributor/CI automation). User-facing runtime behavior is not changed by this commit; the impact is on documentation authoring/review processes and any automation that enforces these standards.

## [Unreleased]

- Reject valueless maintenance scope options and explicit reader connection selectors in Filoquent commands to prevent unintended scans or cleanup against stale replicas.

- Reseal shared contributor standards as 1.0.6 after synchronizer formatting changed the bundle fingerprint. Synchronize the documentation application's installed manifest and lock, and update the installation and release examples.

- Configure frontend formatting with 100-column lines, closing brackets on the last attribute line, and a generated Ziggy file exclusion. Retain Tailwind sorting through the installed formatter's `stylesheet` option.

- Clarify that Page layout options are optional, including when registering the wrapper with the Vue Options API.

- Mark the Front Awesome `Page` wrapper as implemented in the Layout catalog, document its preview imports and native region behavior, and group its existing guide under Layout without changing its URL.

- Wrap long documentation breadcrumbs without horizontal scrolling. Keep separators with their destinations and preserve complete labels and keyboard-accessible ancestor links.

- Organize Front Awesome documentation into nested Web Awesome, Vue integration, appearance, and toast sections while preserving existing guide URLs and anchors. Add a categorized wrapper catalog with compact status tags, linked Popover information, basic examples, upstream references, and searchable implementation states. Keep larger group cards on the catalog overview. Use one native public Button per component to open Popover information and example links, and document the new public Tag, Tooltip, and Popover wrappers.

- Document the Front Awesome Icon preview with public imports, native Web Awesome attributes and accessibility, application-owned styling, upstream-derived props, and typed native load events. Register its guide after Input without changing the site icon integration.

- Make `docs` the only documentation source and application. Retire `docs_old` synchronization and legacy-checkout completion requirements in workspace guidance, the public policy, and shared contributor standards 1.0.5. Keep historical migration records and self-contained content coverage.

- Document Front Awesome's commented status and neutral branding ramps, physical Tailwind palette ownership, and the optional PrimeVue preset's color mappings, including Aura's orange and yellow warning groups.

- Rename the Front Awesome preview color-mode API to `Appearance`, `AppearancePreference`, the `appearance: true` plugin option, and the `appearance` slot property. Update examples, contributor guidance, and the migration from the removed `Theme` component and preference names. Preference values, actions, persistence, and lifecycle behavior remain unchanged.

- Document the dedicated Front Awesome `components/WebAwesome` exports and the retained component import paths.

- Document the Front Awesome Input preview with exclusive Vue and Inertia bindings, nested array fields, server errors, and native Web Awesome behavior. Add its registered guide after buttons and restore the overview's short installation command.

- Defer code highlighting until examples approach the viewport and demo sources are first opened. Preserve immediate plain text, copying, native disclosures, and search content without per-page configuration.
- Generate responsive WebP wordmarks through the normal build and render one theme-selected header image. Improve shared version-badge contrast and defer the Font Awesome kit. Add a scoped immutable-cache recipe for fingerprinted build assets while preserving security and font/SVG CORS headers.

- Document platform-specific Maintainer task search tests. Exercise fallback prompts on every platform and native keyboard and viewport behavior on macOS and Linux.

- Explain the first unmet prerequisite for queued demos without starting a connection or job. Document Nginx policy requirements for Horizon and WebAssembly, and the Laravel fallback needed by dynamic robots discovery.

- Document name and description search, keyboard selection, and the taller adaptive list in Maintainer's interactive `deploy:run` selector.

- Install the published Front Awesome `1.0.0-alpha.1` preview and public distributions of all documented packages through portable Composer and npm locks. Remove the required workspace checkout from Front Awesome installation instructions.
- Add a dependency-free distribution check before Composer installation in CI. Reject local lock locations without changing development aliases and document clean consumer verification.

- Run Horizon as the documentation server's only PM2 process and use the external WSS Software Reverb application for broadcasts. Apply PM2 after publication, allow graceful worker shutdown, and document private environment placeholders and separate scheduler ownership.
- Require complete backend Reverb credentials before accepting queued demos. Preserve early broadcast completion and isolate late request callbacks from newer demonstration runs.

- Add a versioned Deployer task that builds and verifies the documentation search index in the candidate release. Run it explicitly before migrations, process configuration, and publication, stopping deployment on either command failure.

- Add an interactive Core conditional-array example that executes the installed PHP helper. Show conditional nested fields, closure evaluation, retained falsy values, and preserved numeric keys with user-controlled requests, reset, and the actual running source.

- Derive the sitemap, visible breadcrumbs, and breadcrumb JSON-LD from registered documentation pages. Add Laravel Head site and page schemas, dynamic robots discovery, and noindex response headers for internal endpoints. Document maintenance and post-publication rendering checks with Vue SSR disabled.

- Use the published Pest, Inertia, and six package kit identities through the shared icon component, including duotone menu and guide tags. Add icons to every footer destination and isolate Font Awesome SVG replacement from Vue updates.
- Install Fontaine through Laravel Vite's native optimized font fallback and share its generated Instrument Sans stack with Tailwind and Web Awesome.

- Split QZ Tray's long overview into a short preview-first introduction and eight task guides, preserving historical overview anchors and technical content coverage.
- Generate installation instructions from locked dependency versions through one shared catalog, Vue component, and search adapter. Add the documented optional Echo Vue and PrimeVue dependencies to the documentation lock and prevent stale authored registry installs.
- Clarify Core's focused helpers, Maintainer's maintenance role, Mosaicast's session broadcasting and Front Awesome integration, and manual PM2 namespace migration. Add compact package glyphs for Font Awesome, icons at every navigation depth, denser desktop navigation, and dark native code scrollbars in both themes.

- Normalize both local Composer version aliases only in package displays, add package repository links to overview specifications and guide tags, and use Font Awesome throughout application controls. Link the landing page's tools to their official sites and prepare Inertia and Pest marks for kit upload.
- Highlight shared source and terminal examples with lazy Shiki grammars, an explicit language toolbar, and Tailwind token colors while preserving exact source, accessible copying, and search extraction.

### Changed

- Integrate the existing Font Awesome kit through WA's native kit attribute and one shared SiteIcon component. Add themed icons to navigation groups, search, code-copy controls, callouts, outlines, and supporting links while preserving labels and excluding decorative glyphs from search.
- Replace the unused Wayfinder packages and Vite generator with Ziggy's native Laravel JSON configuration and public Vue/JavaScript APIs. Generate login and account URLs by route name, preserve request methods, and support QZ Tray's direct route imports without a second configuration or generated route files.
- Add local server-side documentation search with a shared accessible dialog, ranked section links, code and table content, and a single deploy-time indexing command. Derive the corpus from the existing page registry and Vue sources, validate freshness, and publish the SQLite FTS5 artifact atomically without another service or Vue SSR.
- Show one "Documented version" value from the installed Composer package on overviews, guide tags, and cards. Normalize the artificial `1.999.999` version to `1.x-dev` dynamically without changing locked versions.
- Add versioned Artisan Toolbox documentation and package development skills, a dependency-free synchronizer with explicit version pins and drift checks, and a CI check. Install the shared standards in the documentation repository as the first consumer.
- Document package usage skill authoring, Composer distribution, Boost installation and refresh, consumer verification, and same-task maintenance of skills, guides, tests, and changelogs.
- Give every package a dedicated installation journey with prerequisites, backend-before-frontend setup, a first working example, and an expected result. Order guide menus by learning prerequisites and cover that order with request tests.
- Keep full package specifications on overviews and show compact tags on guides. Report actual Composer installation versions and identify local development branches separately from documented compatibility.
- Install all documented packages explicitly and consume QZ Tray's frontend from Composer. Check compatible updates of the main PHP and frontend dependencies, and replace the artificial Maintainer version with `1.x-dev`.
- Add real Mosaicast response demonstrations comparing native Laravel dispatch plus manual Inertia props with package listener delivery, including event objects and multiple event types. Share controlled demo frames, source views, actions, and cleanup.
- Install Horizon and Reverb, isolate demo jobs on their own worker queue, restrict job submission and monitoring to verified staff, and schedule Horizon metrics. Document the service prerequisites without starting or configuring deployed services.
- Strengthen workspace, documentation, and Mosaicast agent instructions with beginner journeys, dependency refreshes, public API reuse, documentation standards, and root-cause fixes without workarounds.
- Add an automatic, nested "On this page" outline with active-section tracking, native deep links, a desktop rail, and a mobile disclosure. Add clear navigation from documentation back to the landing page.
- Keep the mobile package menu in the viewport when opened from a deep guide section, with Escape dismissal and focus restoration.
- Complete the six-package and community-content migration with 52 registered documentation pages, preserved examples and anchors, source links, enum-bound legacy redirects, and standalone frontend fixtures.
- Replace the starter landing page with a responsive package catalog and shared public header and footer.
- Consume Front Awesome's quick-style preview through its public Composer and frontend entries, with a published application branding file, shared red palette, fonts, dimensions, shadows, and synchronized light and dark themes.
- Keep the active nested navigation destination visible without moving document scroll or keyboard focus.
- Require Node.js 24.11 or newer and align CI with Node.js 24. Document the local Front Awesome and Maintainer publication prerequisites for standalone installation.
- Align the application PHP requirement and managed README badge with the installed packages' PHP 8.5 minimum, including production.
- Open external web links in a new tab with `noopener noreferrer` through the shared documentation link component, preserving internal Inertia navigation and native email and telephone links.
- Standardize workspace contact metadata on `contact@atb.dev.br` and documentation references on `https://atb.dev.br`, with a repeatable source check and unchanged dependency versions.
- Migrate the complete Maintainer Versioning section with visible guide titles, local navigation, exact legacy redirects, and explicit availability guidance for the pending-push preview.
- Migrate Maintainer's complete Configuration section, including reference, template publishing, and SSH identity guides, with local navigation and exact legacy redirects.
- Share package guide headers that keep each guide title visible, and clarify application publication keys, SSH helper fallback, and Deployer authentication without a stored Maintainer identity.
- Refine the nested documentation sidebar with more label space, compact indentation, distinct package sections, and a quieter current-page marker in both themes.
- Group documentation navigation by registered slug hierarchy, with collapsible package and guide sections, automatic opening of the active branch, and separate page links and disclosure controls on desktop and mobile.

## [1.0.0-alpha.3] - 2026-11-05

### Build

- **Add PM2 config for Reverb process** (`d9ada2d`)
  Introduces a new PM2 ecosystem configuration file (`pm2.config.cjs`) that defines a `Reverb` process. The `Reverb` process runs the PHP `artisan` command with `reverb:start` using the `php` interpreter, sets the working directory to `/var/www/atb/current`, and uses `instances: 1` with `autorestart: true` and `max_memory_restart: '1G'` to improve runtime resilience. This matters for deployments using PM2 because it provides a standardized way to start and supervise the Reverb queue/server component. Compatibility impact is limited to environments adopting/using PM2 with this config; no code behavior is changed outside of the addition of the process definition.

## [1.0.0-alpha.2] - 2026-11-05

### Maintenance

- **Update example environment configuration** (`0ff8848`)
  Updates `.env.example` to reflect a production-oriented setup with different infrastructure services. Key changes include switching app metadata and runtime configuration (e.g., `APP_NAME` from "Laravel" to "Artisan Toolbox", `APP_ENV` from `local` to `production`, `APP_DEBUG` from `true` to `false`, and `APP_URL` from `http://localhost:8000` to `https://atb.dev.br`). Logging is adjusted to use daily rotation for `LOG_STACK` (while keeping `LOG_LEVEL=debug`). Queue/cache backends are changed from database to Redis (`QUEUE_CONNECTION=redis`, `CACHE_STORE=redis`), and mail configuration is switched from log-based delivery to SMTP using AWS SES (`MAIL_MAILER=smtp` with host `email-smtp.us-east-1.amazonaws.com` and port `465`). The example also updates `MAIL_FROM_ADDRESS` to `noreply@atb.dev.br` while preserving `MAIL_FROM_NAME` as `${APP_NAME}`.

Why it matters / user impact: developers using `.env.example` as a starting point will now run with production-like defaults and will be expected to provide/configure Redis and AWS SES SMTP details (whereas the previous example leaned on local/database-backed queues/caches and mail logging). This can affect local development and deployments that assumed database-backed queue/cache behavior and mail logging—those setups will need migration of environment variables and provision of the new external dependencies.

Compatibility / migration notes: if you previously used the example env for local development, you may need to override these values to restore database-backed queue/cache and `MAIL_MAILER=log` (or otherwise ensure Redis and AWS SES SMTP are reachable). Debugging behavior changes due to `APP_DEBUG=false` in the example.

## [1.0.0-alpha.1] - 2026-11-05

### Features

- **Add staff-only email-code login and restrict app routes** (`a25c6bf`)
  Implements a staff-only email-code login flow and changes routing access so only authorized staff can reach protected application routes. This is a behavior/security change that affects how users authenticate and which areas of the app they can access. Users who previously used non-staff accounts (or relied on broader route access) will no longer be able to reach the restricted routes; staff must use the email-code mechanism. Compatibility/migration: ensure staff accounts are provisioned/configured to pass the new staff-only checks and that any client-side expectations about accessible routes are updated accordingly.

- **Add mosaicast() helper for simplified event dispatch** (`7fbe802`)
  Introduces a `mosaicast()` helper to simplify event dispatch patterns. This is functional new code that likely reduces boilerplate for firing events across the Mosaicast system. User impact: developers gain a more convenient API for event dispatch; existing functionality should remain compatible unless there are naming conflicts (not indicated). Compatibility: no migration described—adopt the helper where appropriate without removing older mechanisms.

- **Add multi-domain Inertia guide and concurrency-safe deployment script** (`80e829e`)
  Adds guidance for multi-domain Inertia setups and introduces a concurrency-safe deployment script to reduce race conditions during deployments. User impact: helps teams configure Inertia across multiple domains correctly and improves deployment reliability. Compatibility/migration: deployment process should be updated to use the new script; ensure domain and Inertia settings follow the documented patterns.

### Fixes

- **Make share image deterministic with integer alpha blending** (`a8beff7`)
  Adjusts share-image generation to use integer alpha blending so the resulting rendered output is deterministic. This matters for reproducibility (e.g., consistent hashes in tests, stable CDN artifacts, and predictable social/share previews). User impact: share image content/appearance may change slightly to eliminate rounding/float nondeterminism; however, it should remain visually equivalent while becoming stable across environments. Compatibility: no API/migration changes are described; effects are limited to share-image generation outputs.

- **Disable system font lookup in QZ Tray PDF preview** (`71c7833`)
  Disables system font lookup in the QZ Tray PDF preview to avoid missing font warnings and to ensure bundled fonts are used. User impact: improves print/preview reliability and reduces noisy warnings; actual preview output should be more consistent across environments where fonts may be missing. Compatibility: should be transparent to users, but environments must rely on the bundled fonts as intended.

- **Add parallel execution configuration for Pest and update documentation** (`8d387ac`)
  Configures Pest to run tests in parallel and updates related documentation. This improves CI/local test performance and developer feedback speed. User impact: faster test runs; potential for surfacing data race/flakiness earlier. Compatibility: ensure tests are parallel-safe (shared state, database cleanup, static/global variables). Documentation helps indicate how to run/configure parallel execution.

### Documentation

- **Initialize new documentation** (`f503bec`)
  Adds an initial documentation foundation for the project. This provides baseline written guidance for how to use/develop the application and lays the groundwork for future organization and updates. User impact: improves discoverability of project knowledge but does not change runtime behavior. Compatibility: no migration needed.

- **Organize guides and document Vue components** (`bb3e123`)
  Reorganizes front-end documentation guides and adds documentation for Vue components. This helps developers understand the component library’s purpose and usage patterns, and makes it easier to navigate existing content. User impact: reduced onboarding friction for contributors working on the Vue/Inertia UI layer; no runtime/API behavior changes.

- **Refresh package guides and site navigation** (`8b280bc`)
  Updates package guides and the documentation site navigation structure. This improves how users find relevant pages and keeps guides aligned with current repository organization and package taxonomy. User impact: documentation-only; no code behavior changes.

- **Explain Maintainer PHAR validation** (`02b6801`)
  Adds documentation explaining how Maintainer PHAR validation works and what users/contributors should expect when validating/using the Maintainer PHAR artifact. This matters for security/trust and for correct setup of the maintainer tooling. User impact: clarifies verification steps, reducing risk of misuse; no runtime changes.

- **Improve documentation** (`e2bd291`)
  Applies general improvements to documentation content. While not specified in detail, this commit represents iterative documentation refinement (clarity, completeness, or correctness). User impact: documentation-only; no migration/runtime impact.

- **Update QZ Tray and Mosaicast docs with branch and CI details** (`8a689ec`)
  Updates QZ Tray and Mosaicast documentation to include branch and CI-related information. This helps contributors align local development/testing practices with the repository’s active branches and automated checks. User impact: documentation-only; no runtime/API changes.

- **Refine QZ Tray documentation for Composer-distributed frontend** (`a62c591`)
  Refines QZ Tray documentation to reflect how the frontend is distributed via Composer. This matters for installation and contributor instructions—users need accurate guidance on where assets come from and how to build/run them. User impact: reduces setup errors when using Composer-based distribution; documentation-only.

- **Add QZ Tray Connector documentation** (`b667f13`)
  Adds documentation for the QZ Tray Connector. This provides implementation/usage guidance for integrating connector functionality into the app. User impact: documentation-only; helps developers implement features correctly without changing the runtime code.

- **Add Mosaicast delivery guides and improve Core documentation references** (`a890e46`)
  Adds Mosaicast delivery guides and improves references from Core documentation to relevant sections. This helps users follow end-to-end guidance for message/event delivery and understand how Core concepts relate. User impact: documentation-only; no runtime behavior changes.

- **Add Mosaicast and Conditional Arrays documentation** (`ab7bfca`)
  Adds documentation covering Mosaicast and Conditional Arrays features. This clarifies intended behavior and usage for conditional rendering/logic patterns and event delivery concepts. User impact: documentation-only; improves contributor/user understanding without changing APIs.

- **Remove Axora documentation from the docs folder** (`a6418bf`)
  Removes Axora documentation from the documentation directory. User impact: documentation content becomes unavailable; contributors/users seeking Axora info should use an alternative location or updated docs (if any). Compatibility: documentation-only, but users relying on the removed pages may need to migrate to new documentation paths.

- **Add comprehensive Axora documentation** (`1a707c6`)
  Adds comprehensive documentation for Axora. This likely restores/expands coverage previously removed or missing. User impact: improves guidance and understanding; documentation-only. Compatibility: none for runtime—users should navigate to the new/updated Axora docs location.

- **Refine environment variable behavior and clarify delegation in Maintainer docs** (`780ff9d`)
  Refines explanations about environment variable behavior and clarifies delegation concepts within Maintainer documentation. User impact: reduces confusion when configuring the maintainer tooling and running release/quality workflows. Compatibility: documentation-only; no runtime/API changes.

- **Add deployment, versioning, and configuration documentation for Maintainer** (`3e30352`)
  Adds Maintainer documentation covering deployment, versioning, and configuration. This is important for consistent release/deployment practices and for correct configuration of maintainer-driven tooling. User impact: documentation-only; helps maintainers avoid incorrect settings. Compatibility: none.

- **Update documentation formatting and badge** (`2d77b81`)
  Adjusts documentation formatting (including badge updates) and fixes code formatting issues. User impact: documentation readability and correctness improvements; no runtime behavior changes.

- **Document translated model attributes in Core package** (`d35f621`)
  Documents translated model attributes for the Core package. This helps developers understand how translation/attribute mapping works and how to use those capabilities correctly. User impact: documentation-only; reduces implementation mistakes.

- **Update Maintainer documentation for 1.0 stable release** (`6e11aa1`)
  Updates Maintainer documentation to align with the 1.0 stable release guidance. This matters for contributors/maintainers as tool behavior, recommended workflows, or assumptions may change at the 1.0 milestone. User impact: clearer, correct operational instructions; documentation-only.

- **Update README and documentation links for clarity** (`788418e`)
  Updates README content and documentation links to improve clarity and navigation. User impact: easier onboarding and fewer dead/unclear links; documentation-only.

- **Add centralized documentation site structure and deployment configuration** (`29afffb`)
  Introduces a centralized documentation site (including initial structure, branding assets, documentation content, versioning policy, and deployment configuration). This is a documentation/infrastructure change that improves how users access and maintain project docs. User impact: better documentation experience and a clearer publication process; no runtime behavior changes.

### Refactoring

- **Enforce strict schema validation for changelog generation** (`52c449f`)
  Enforces strict schema validation during Maintainer release changelog generation. This matters because it prevents malformed/invalid changelog inputs from producing broken release notes and catches issues earlier in the release process. User impact: primarily affects maintainers/release pipeline; end users benefit indirectly via more reliable release documentation. Compatibility/migration: release tooling/input format must conform to the validated schema; any existing changelog generation inputs that were previously tolerated must be updated.

### Build

- **Expand CI test workflow with deps, assets, and quality gates** (`bd6e4ee`)
  Enhances the GitHub Actions test workflow to install additional dependencies and assets and to enforce stricter quality gates. The functional goal is to ensure CI more closely matches the project’s real build/test requirements by installing toolchains (PHP/Node with extensions), running composer and frontend install/build steps, and adding validation/quality checks. User impact: primarily reliability—developers get faster/earlier feedback in CI and fewer “works on my machine” discrepancies. Compatibility/migration: none for end users, but contributors should ensure required secrets/dependencies are available for the workflow (e.g., any npm token usage) and that local environment preparation aligns with CI.

## Unreleased

### Added

- Migrate the complete Maintainer fixes and CI checks guide to `/docs/maintainer/ci/quality`, with reusable accessible tables, smaller Vue sections, and an exact legacy redirect.
- Migrate the Maintainer Code Quality overview to `/docs/maintainer/ci` using shared documentation components and an exact legacy redirect.
- Add staff-only email-code login, session invalidation on logout, and an authenticated Log Viewer at `/logs`. Replace starter password, dashboard, and settings routes with the restricted access flow.
- Add the application's `ArtisanToolbox` version identity and Maintainer-managed README header, with an isolated CLI regression test for discovery, header synchronization, and repeated execution.
- Install published Maintainer 1.10, Rector, and Laravel Rector rules as development tooling, with a non-interactive Maintainer quality gate and separate Rector dry-run CI check.
- Add a public Inertia documentation catalog and the complete Maintainer 1.10 overview.
- Add reusable Vue components for page headers, specifications, requirements, prose, package cards, links, and code examples.
- Add responsive navigation, theme selection, clipboard feedback, and source references.
- Add Laravel Head metadata and reproducible branding, favicon, installation icon, and share-image generation.
- Document the migration sequence, authoring workflow, asset ownership, and decisions.
- Add Pest request coverage and Vite Plus component and icon-generation tests.

### Changed

- Link documentation footers to the corresponding Vue source files in the published `1.x` repository.
- Restrict staff access to `atb.dev.br`, including pending code challenges and log authorization.
- Generate the share image with integer alpha flattening after resizing to avoid native floating-point rounding differences between macOS and Linux. Keep exact artifact checks with compact filename and SHA-256 diagnostics.
- Configure the scoped Web Awesome Pro registry with environment-based authentication and install local file dependencies as packages while keeping dependency scripts disabled.
- Use the `1.x` branch for documentation development, GitHub source links, and push-triggered tests. Install locked dependencies in CI, isolate test services, and run Rector and Maintainer as explicit steps.
- Replace documentation array registries with immutable page and package definitions, a string-backed page enum with implicit 404 handling, and dedicated frontend resources.
- Generate canonical and social URLs from `APP_URL` and Laravel's named routes instead of a separate documentation origin.
- Require a package capability check before implementing documentation features, including Front Awesome's existing theme integration.
- Disable Inertia SSR in development and production and remove the SSR build script.
- Group browser icons and the web manifest under `public/favicons/`.
- Keep existing package destinations until each replacement is available.
