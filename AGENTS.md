<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

## Foundational Context

This application is a Laravel application running on PHP 8.5. Always use the APIs that match the installed major version of each package — do not assume a version.

Before relying on a package's API, confirm its installed version:
- PHP packages: run `composer show --direct` to list direct dependencies with versions, or `composer show <vendor/package>` for a single package.
- JS packages: check `package.json` for the installed versions.

## Skills Activation

This project has domain-specific skills available in `**/skills/**`. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If a frontend change doesn't show in the UI or you get a "Unable to locate file in Vite manifest" error, run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Use `search-docs` before changes that depend on Laravel ecosystem APIs, behavior, configuration, or version-specific syntax. Skip it for copy-only edits and other changes where package documentation is irrelevant. Reuse sufficient results already in context instead of searching again.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Project Rules

- This project contains committed, area-grouped rules in `.ai/rules` when that directory exists, including path-scoped framework guidelines under `.ai/rules/boost`. Before you enter plan mode or create/edit any file, you MUST first: open @.ai/rules/index.md (it maps file globs to rule files), read every rule file whose globs cover the path(s) in scope, and run `grep -rin 'keyword' .ai/rules` to catch what a path match alone misses. Do not write code until you have read and are following every matching rule. If `.ai/rules` does not exist, continue without it.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.
- Activate the `deploying-to-cloud` skill whenever deploying to Laravel Cloud, configuring Cloud environments or resources, using the Cloud CLI, or troubleshooting Cloud deployments.

=== herd rules ===

# Laravel Herd

- The application is served by Laravel Herd at `https?://[kebab-case-project-dir].test`. Use the `get-absolute-url` tool to generate valid URLs. Never run commands to serve the site. It is always available.
- Use the `herd` CLI to manage services, PHP versions, and sites (e.g. `herd sites`, `herd services:start <service>`, `herd php:list`). Run `herd list` to discover all available commands.

=== tests rules ===

# Test Enforcement

- Add or update tests for behavior and logic changes when a test provides meaningful regression coverage.
- Pure copy, styling, and layout-only changes do not require new or updated tests.
- When test coverage applies, run the affected tests and ensure they pass.
- Test the changed behavior and its important failure modes, but do not add tests beyond them.
- Read the `testing-best-practices` skill before writing tests.

=== inertia-laravel/core rules ===

# Inertia

- Inertia creates fully client-side rendered SPAs without modern SPA complexity, leveraging existing server-side patterns.
- Components live in `resources/js/pages` (unless specified in `vite.config.js`). Use `Inertia::render()` for server-side routing instead of Blade views.
- ALWAYS use `search-docs` tool for version-specific Inertia documentation and updated code examples.
- IMPORTANT: Activate `inertia-vue-development` when working with Inertia Vue client-side patterns.

# Inertia v3

- Use all Inertia features from v1, v2, and v3. Check the documentation before making changes to ensure the correct approach.
- New v3 features: standalone HTTP requests (`useHttp` hook), optimistic updates with automatic rollback, layout props (`useLayoutProps` hook), instant visits, simplified SSR via `@inertiajs/vite` plugin, custom exception handling for error pages.
- Carried over from v2: deferred props, infinite scroll, merging props, polling, prefetching, once props, flash data.
- When using deferred props, add an empty state with a pulsing or animated skeleton.
- Axios has been removed. Use the built-in XHR client with interceptors, or install Axios separately if needed.
- `Inertia::lazy()` / `LazyProp` has been removed. Use `Inertia::optional()` instead.
- Prop types (`Inertia::optional()`, `Inertia::defer()`, `Inertia::merge()`) work inside nested arrays with dot-notation paths.
- SSR works automatically in Vite dev mode with `@inertiajs/vite` - no separate Node.js server needed during development.
- Event renames: `invalid` is now `httpException`, `exception` is now `networkError`.
- `router.cancel()` replaced by `router.cancelAll()`.
- The `future` configuration namespace has been removed - all v2 future options are now always enabled.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== pest/core rules ===

# Pest

- This project uses Pest. Create tests with `php artisan make:test --pest {name}`.
- Do not include the test suite directory in `{name}`. Use `SomeFeatureTest`, not `Feature/SomeFeatureTest`.
- Read the `testing-best-practices` skill for guidance on coverage, naming, structure, dependency isolation, and review.
- Do not delete tests or test files without approval. They are part of the application.

## Running Tests

- Run the narrowest set of tests that covers the change. Pass a file path or `--filter=testName` to `php artisan test --compact`.
- Rerun a test after each change to it.
- Run `vendor/bin/pest` to call the test runner directly. It accepts the same file path and `--filter=testName` arguments.

=== inertia-vue/core rules ===

# Inertia + Vue

Vue components must have a single root element.
- IMPORTANT: Activate `inertia-vue-development` when working with Inertia Vue client-side patterns.

</laravel-boost-guidelines>

## Maintainer integration

Keep the application version and managed README metadata in `App\ArtisanToolbox`.
After editing `readmeHead()`, run `php vendor/bin/maintainer readme:update --no-interaction`.
Keep manual README content outside the generated marker region.

| Invariant                                                                                                                                                                      | Enforcement                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| A production-autoloaded identity implements `Versionable` and `WithReadmeHead`, exposes `VERSION`, and generates the committed README head without changing unmanaged content. | `tests/Unit/MaintainerIntegrationTest.php`, included in the Maintainer Pest check. |
| The share image uses exact integer alpha blending, and published assets stay synchronized with their generated files.                                                          | `scripts/build-icons.test.mjs`, included in the Maintainer Vite Plus tests.        |

## Documentation authoring requirements

These application-specific rules complement the workspace guidance and remain outside the generated Laravel Boost block.

- Use the repository's `atb-documentation` and `atb-package-development` skills for their matching tasks. Their owning source is `documentation/agent-standards/`; `.ai/skills/` and `.agents/skills/` contain installed, versioned copies.
- Run `npm run standards:check` before completing a shared standards change. Follow `documentation/agent-standards.md` for versioning and synchronization. The shared skills include writing and prose review guidance without requiring personal skill installations.
- Follow `documentation/package-skills.md` when documenting package skills. Package sources under `resources/boost/skills/` own consumer guidance; generated agent copies are installation results. Do not describe a skill as available in a release until its Composer distribution and consumer discovery have been verified.
- Review package skills alongside API, configuration, command, compatibility, and workflow changes. Keep the public policy, current documentation pages, tests, and changelogs synchronized in the same task. Record unchanged guidance and verification blockers explicitly.

- Find and fix the cause of a documentation defect. Change the owning registry, content, package API, or shared component. Do not use page-specific CSS patches, duplicated metadata, copied internals, weakened checks, or fixture refreshes to conceal a defect.
- All documentation is owned by this `docs` application. `docs_old` is retired and must not be required, recreated, or synchronized.
- Before each content change, audit every affected package's beginner path. Record its starting environment, requirements, install commands, first runnable example, expected result, next guide, and verification. Use `documentation/authoring.md` as the completion checklist.
- Every package has a registered Installation page and an overview quickstart. Teach requirements, installation, first success, configuration, task guides, advanced topics, reference, and development in that order. Put configuration before first success when the example requires it. Sibling enum order expresses this sequence and must never be alphabetized.
- Keep editorial ancestry in `PageSlug::parent()`. Prefer the nearest registered URL prefix and use sparse enum overrides to preserve existing public URLs when grouping guides. Navigation, active ancestors, and breadcrumbs share that relationship. Component catalogs reuse one metadata source for visible statuses and search; implemented entries require actual public wrapper exports and real example anchors. Use compact wrapping pill Button controls with Popover information in group pages, retaining native WA keyboard and focus behavior. Preserve distinct `In progress` and `In future` states, and reserve larger cards for the catalog overview. Consume these public package APIs rather than copying their internals.
- Use specialized shared components for package overview identity, compact guide tags, requirements, prose, examples, callouts, and navigation. Large identity headers belong only on package overviews. Keep each child page's actual title visible.
- Use the single "Documented version" label for the Composer-installed version on package overviews, guides, and cards. Normalize only the exact local aliases `1.99.99` and `1.999.999` to `1.x-dev` in `PackageResource`; preserve other installed versions. This is a presentation rule. Never rewrite Composer manifests, aliases, or lockfiles to obtain that label. Reuse `PackageVersion` instead of displaying a second authored compatibility version or duplicating fallback logic.
- Verify public package exports before implementing documentation behavior. Record the export consumed or a concrete reason the behavior belongs in this application. Keep installed Composer versions and preview status distinct from documented compatibility.
- Each documentation task attempts compatible updates for installed Artisan Toolbox packages and main runtime and test dependencies. Run Composer before npm, refresh vendor frontend copies, and test the result. Record resolved changes, already-current dependencies, conflicts, and registry or permission blockers. User authorization in the current task governs dependency changes. Never fake a version bump, relax compatibility, or describe an unpublished checkout as a stable release.
- Follow the installed technical-writing skill and its prose review guidance. Use Diataxis document modes and official style sources. Record a missing capability and reviewed source before adding another skill.
- Keep active demos isolated under `components/demo/<package>/<section>/` and `app/Demo/<Package>/<Section>/`. Use public package APIs, wait for the reader's start action, and expose loading, failure, reset, and source behavior. Keep private credentials on the backend.
- Native Laravel or Inertia and Mosaicast comparisons share inputs, event counts, payloads, timing, sessions, and queue conditions. Show delivery behavior honestly. Add infrastructure only when the requested example requires it.
- Preserve rendered-content coverage when changing authored content. Review the current Vue pages and package behavior, update only affected fixture expectations after that review, and run the self-contained page checks. Historical migration fingerprints are provenance, not a dependency on the retired source checkout.
- Keep search derived from `PageSlug` and actual Vue content. Never add a second searchable-page registry, copied summaries, or manual index text. Give sections stable IDs, use the shared static content components, and run `php artisan docs:search:index --no-interaction` followed by its `--check` mode after content changes. Verify a body/code/table query and its destination where relevant. Fix extraction errors at the source or the shared adapter with tests; do not hide pages to make indexing pass. Follow `documentation/search.md` and build the release-local artifact before release activation.
- Use Laravel's `route()` in PHP and imports from `ziggy-js` for client-generated URLs. Reuse existing backend-provided navigation destinations. The Blade document owns one native Ziggy JSON configuration and `config/ziggy.php` owns its route-group filter; do not add another Inertia configuration, fixed browser location, custom loader, generated frontend route file, or Wayfinder integration. Preserve explicit HTTP methods and test named-route path changes. Follow `documentation/routing.md`.
- Use Font Awesome through `SiteIcon` for all application utility and brand icons, including shared starter components. Do not add Lucide, inline utility SVGs, or Unicode icon substitutes. Package artwork and background textures remain artwork. Use WA's native kit integration from `documentation.fontawesome_kit_code`. Preserve text labels and package artwork, keep decoration out of search, and avoid per-page SVGs, custom resolvers, duplicate kit identifiers, and animated decoration. Follow `documentation/icons.md`; verify actual SVG loading in the browser as well as tests that isolate the CDN boundary.

- Keep syntax highlighting inside the shared `CodeExample` and its finite language registry. Use Shiki text tokens rendered through Vue interpolation and literal Tailwind palette classes. Preserve exact authored source, clipboard behavior, and search extraction. Unknown languages remain plain text; grammar failures remain readable and explicit. Do not inject generated HTML, add prompt characters to commands, execute examples, or style blocks per page. Follow `documentation/code-examples.md`.

- Render named dependency installation instructions with `InstallCommand`, passing the package metadata explicitly through authored partials. `InstallationCommands` owns exact Composer-installed and npm-lock versions, command options, and Composer-before-npm order. Never hardcode registry dependency installs in Vue, rewrite lock aliases for display, read development-workspace locks in production, or add a second search recipe. SearchCatalog and the semantic adapter consume the same command data. Follow `documentation/authoring.md`; the installation instruction guard runs in the frontend suite.
- Keep package overviews short and task guides responsible for technical detail. Preserve historical hashes as clear links when moving sections, and test content ownership across the resulting guides. A large package overview must not repeat its installation, preview, security, or reference guides.

- Uploaded Font Awesome identities use `SiteIcon` with `kit` or `kit-duotone`, the published names, and the existing configured kit. Preserve the keyed inner container that isolates SVG replacement from Vue updates. Do not send uploaded names to WA's official resolver, invent asset URLs, or poll the global API. Keep package identities in `packageIcons.js` and verify real mono and duotone SVGs after navigation.
- Keep Fontaine in Laravel Vite's native optimized-font pipeline. Branding consumes `--font-instrument-sans`; do not add another font loader, Fontaine transform, or handwritten fallback metrics. Verify fresh generated font CSS and the resolved browser stack. Follow `documentation/assets.md`.
- Keep discovery derived from `PageSlug` and named routes. Use `Documentation::breadcrumbs()` for visible trails and JSON-LD, and Laravel Head for response-owned schemas. Never add a second page registry, static robots file, fake modification dates, or global public schemas that leak onto sign in. Preserve internal noindex headers, crawlable rendering assets, and disabled Vue SSR. Follow `documentation/seo.md`; initial metadata and local browser checks do not prove public article indexing.
- Keep the Deployer search gate in the versioned `resources/deployer/search.php` recipe. The local ignored `deploy.php` must import it and explicitly run `docs:search` after assets and optimization, before migrations, PM2, and publication. Preserve both when regenerating local deployment configuration. Use the candidate `release_path`, propagate command failures, and keep the artifact release-local. Follow `documentation/search.md`; executable deployment tests must use disposable localhost fixtures and never contact configured servers.
- Horizon runs only on the documentation server; broadcast delivery uses the external WSS Software Reverb application. Keep PM2 limited to one Horizon master with native graceful shutdown and apply its configuration after publication so `current` points to the new release. Scheduler ownership remains separate. Keep private credentials out of templates, browser props, Vite variables, source panels, logs, and committed files. Component tests must not inherit the development Reverb connection. Follow `documentation/queues.md` and preserve the executable process, credential-boundary, and early-completion lifecycle tests. Configuration readiness does not prove live service delivery.
- Preserve global development package routing and aliases. Run `composer distribution:check` before distributing a lock and keep the pre-Composer CI gate. Check package locations rather than version labels; remote previews remain valid when explicitly approved and pinned by the lock. Prove consumer compatibility using public archives and a clean Composer home, Composer before npm, actual exports, tests, build, and search indexing. Never substitute local copies into that proof, maintain a second production lock, relax project-wide stability, or claim portability while a required public export is missing. Follow `documentation/quality.md#prepare-standalone-installation`.

## Interactive component demos

- Render every live documentation example inside the shared `components/demo/DemoFrame.vue`. Keep viewport resizing, width presets, keyboard controls, source disclosure, and presentation in that component. Do not add nested native `resize` handles or one-off demo frames.
- Keep inline Web Awesome controls at their intrinsic width. Use ordinary block sibling cells inside demo stacks instead of stretching every control in a vertical flex layout. Rating computes pointer values from its host width, so verify clicks at the visible centers of every symbol at narrow and full preview widths.
- Use real native events from the installed component API. Verify the displayed application state after actual pointer and keyboard actions; dispatching a guessed synthetic event in Happy DOM is insufficient. Rating uses `change` for pointer selection.
- Keep example source self-contained and synchronized with the live component. Run `npm run demos:check`. Search indexes static frame source without indexing runtime-only demo state.
- Run `npm run test:browser` against a local documentation application after changing demos, frames, or interaction wiring. Set `DOCS_BASE_URL` for the local origin and `CHROMIUM_EXECUTABLE` when using a system browser. Preserve readable source and mounted demo state during resizing.
- Before replacing application controls, inspect `scripts/front-awesome-usage.mjs` and classify the fit in four levels. Preserve meaningful domain wrappers, native document semantics, Inertia routing and established focus ownership. Record retained controls with concrete source or browser evidence in `documentation/architecture.md`. Never force a substitution by modifying shadow internals or adding per-container reset patches.
- Review migrated groups visually at desktop and mobile sizes in light and dark themes. Verify actual focusable roles, state announcements and slotted utility spacing. Native host attributes alone do not establish accessibility, and native part comparisons alone do not establish application layout. The browser chain includes the catalog, actual application and isolated sign-in workflow; keep real clipboard success and failure coverage when changing CodeExample.
