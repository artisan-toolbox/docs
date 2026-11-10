# Add a documentation page

Use this workflow to add a page to the Laravel documentation application.
Start from [the migrated Maintainer overview](../resources/js/pages/docs/maintainer/Maintainer.vue).

For package usage skills, follow [Add and maintain a package usage skill](package-skills.md).
Use the versioned `atb-documentation` skill for this workflow. See [shared agent standards](agent-standards.md) for installation, updates, and CI checks.
Review affected skills whenever public APIs, commands, configuration, compatibility, installation, or recommended usage change.
Update them with the implementation, tests, central guides, migrated pages, and changelog in the same task.
If a reviewed skill needs no edit, record why its existing guidance remains accurate.

## Plan the beginner journey

Audit the affected package's current Vue pages in `docs` before changing them. Record the learner's starting environment, prerequisite pages, installation actions, first example, expected result, and next guide.
Every package needs a dedicated Installation page and an overview quickstart.
The overview opens with purpose, stability, and documented version, followed by requirements, installation, first success, configuration, task guides, advanced explanations, reference, and development.
Move configuration before the first example when that example requires it.

Keep one procedure for the common supported setup. State where commands run, install backend dependencies before frontend dependencies, and explain required sessions, authentication, broadcasters, workers, or hardware before the example uses them.
Define inputs instead of assuming that application models or variables exist.
Show executable public API code and its visible expected result.

Use `atb-documentation` and its bundled writing and prose review guidance. Personal technical-writing skills may supplement this shared standard.
Separate tutorials, how-to guides, reference, and explanations.
[Diataxis tutorial guidance](https://diataxis.fr/tutorials/) informs the first successful learning path.
[Google's procedure guidance](https://developers.google.com/style/procedures) informs ordered steps and expected outcomes.
[Google's code sample guidance](https://developers.google.com/style/code-samples) informs examples alongside project-specific code style.
Record a concrete missing capability and a reviewed source before adding another skill. Existing installed guidance does not need an external duplicate.

Write for the reader's task in clear English. Choose one Diataxis mode per guide and link to other modes for background or reference.
Use active voice, descriptive links, sentence-case headings, and the exact public API names.
Follow the package formatter for executable examples. Define inputs, show expected results, and check links and stable heading anchors.
State actual compatibility and failure behavior. Remove stale recommendations rather than leaving conflicting procedures in place.

## Register the page

1. Inspect the owning package's public components, composables, and backend APIs for capabilities the documentation can consume.
2. Record the reuse decision. Use an existing package export when it fits the feature, or document the concrete reason for application-specific behavior.
3. Create the Vue page under `resources/js/pages/docs/<package>/` with `<script setup>` and JavaScript.
4. Add a unique string-backed case to `app/Documentation/PageSlug.php` and map it to the concrete page in `page()`.
5. Create an immutable definition under `app/Documentation/Pages/` extending `Page`. Use its enum case in `SLUG` and supply the component, title, description, source reference, and optional package.
6. For a package overview, reuse or add a concrete `Package` definition under `app/Documentation/Packages/`. Put documented version, stability, and requirements there. Set its explicit overview enum when the overview becomes available.
7. Keep the catalog version separate from the documented version. A `1.x` catalog badge does not replace a guide's `1.10` compatibility statement.
8. Confirm that the enum resolves the matching page and an existing Vue component. Unknown slugs return 404 through Laravel's implicit enum binding and must never become filesystem paths.

Use [the Maintainer page definition](../app/Documentation/Pages/MaintainerPage.php) and [package definition](../app/Documentation/Packages/MaintainerPackage.php) as examples.
The coordinator derives navigation from enum cases.
Do not add another navigation list in Vue.
All package overviews and guides now use local registered destinations.

### Place the page in the menu

Use `PageSlug::parent()` as the single owner of editorial ancestry.
It uses the nearest registered nonempty URL prefix by default. For example, `maintainer/ci/quality` appears under `maintainer/ci`, which appears under `maintainer`.
Declare a parent override in the enum when a new editorial group must preserve an existing guide URL. Front Awesome's existing Button, Input, and Icon guides use this option to join their component groups without redirecting published links.
A page without a registered parent appears at the top level. Keep the parent graph acyclic. Navigation, active ancestors, and breadcrumbs follow the same relationship.
The empty index slug stays a top-level link. Enum declaration order determines sibling order.
That order is an editorial learning sequence. Place Installation first beneath each package, then prerequisites and guided tasks before advanced explanations, reference, and development. Never alphabetize siblings or create a second menu list.

For Web Awesome wrapper guides, keep the group overview separate from complete component guides. Group pages use compact wrapping pill Buttons and interactive Popover information panels from Front Awesome's public exports. Buttons own native keyboard and focus behavior; Tag remains a noninteractive label. Each component has one status control that opens its information panel. Implemented panels link to real sections with basic examples and expected results, with full guides and upstream references when available. `In progress` and `In future` controls open information with an upstream reference, without a fake example destination. Keep implementation status separate from Core or Pro access and published preview availability. Reserve larger group cards for the catalog overview. Update the shared catalog and its search adapter together when adding a wrapper.

`resources/js/components/docs/front-awesome/catalog/components.json` owns the component inventory, status presentation, and wrapper state. Group pages under `resources/js/pages/docs/front-awesome/web-awesome/components/` own basic examples. Full component guides retain their existing URLs, contracts, and anchors. When a wrapper becomes available, update its catalog state, add its actual section and public API example, and verify the control destination, inventory coverage, search output, and package export together.

`Documentation::navigation()` returns one recursive tree of `NavigationNode` objects, including named-route destinations, exact current-page state, ancestor state, and children.
`DocsNavigationItem` renders each branch. Its page link navigates; its separate button expands or collapses children without navigating or closing the mobile menu.
The active branch opens on initial load and subsequent route changes. Readers can collapse it afterward.
Only the exact page link receives `aria-current="page"`.

Keep package sections visually distinct from guide links. Reserve enough sidebar width for nested labels, use compact indentation and quiet vertical guides, and highlight only the current destination with a tinted background and leading marker.
Allow long labels to wrap rather than truncating them. Preserve 44-pixel touch targets, independent disclosure buttons, and visible keyboard focus in both themes.
Check the real application at desktop and mobile widths after changing menu presentation; rendered component tests do not establish visual quality.

### Navigate within a page

`DocsTableOfContents` builds the "On this page" outline from anchored `h2` and `h3` elements inside the page content. Existing `ProseSection` headings and authored heading elements both participate. Give each section a stable, unique `id` and a descriptive title. Subsections appear beneath their preceding section; do not maintain a second list of section labels or links.

The outline appears in a sticky right rail on wide screens and in a disclosure before the article on smaller screens. Native anchor links preserve deep links and browser history. The active section follows scrolling, and navigation to another Inertia page replaces the outline and closes its disclosure. The footer is outside the collection boundary. Mark demo containers with `data-docs-outline-exclude` when their internal headings must remain separate from the guide.

The documentation logo, sidebar's "Back to home" link, and shared footer's "Home" link use the supplied named-route home destination.
The mobile package menu opens in a scrollable panel below the sticky header, so it remains reachable after scrolling a long guide. Escape closes the panel and returns focus to its menu button.
The shared header reports its actual height with `ResizeObserver`. The documentation layout uses that measurement for panel placement and heading scroll margins, including narrow screens where header controls wrap. Do not replace it with a fixed pixel offset.

Use `findNavigationItem()` from `resources/js/lib/docsNavigation.js` when a page needs a destination from this tree.
Add coverage for the generated hierarchy, active ancestors, collapse behavior, and mobile link selection when changing navigation.

`PageResource` and `PackageResource` own frontend field names and derived links.
Keep serialization out of the definitions and preserve the existing unwrapped Inertia prop structure.

Use `DocsLink` for documentation destinations, including source references, repositories, and package registry links. Outbound HTTP(S) links, including protocol-relative URLs, open in a new tab with `noopener noreferrer`. Same-origin links, local anchors, email links, and telephone links retain their native behavior; root-relative page links use Inertia.
Do not duplicate external-link attributes across guide pages or intercept every click with a document-level handler.

For appearance selection, inspect Front Awesome's public `Appearance` export and `createFrontAwesome({ appearance: true })` before creating a selector or appearance controller.
Install and consume the package through its documented entry points. Keep one appearance controller per document.

## Compose the page

Use the shared components in `resources/js/components/docs/`:

For icons in site controls and documentation chrome, use the shared `SiteIcon` component and follow [icon maintenance](icons.md). Keep text labels and use the native WA kit configuration; do not add another library or per-page SVG resolver. Decorative icons must remain outside the search corpus.

| Component            | Responsibility                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `PageHeader`         | One accessible page heading, description, and optional theme artwork.                                  |
| `PackageGuideHeader` | Overview identity or a visible guide title and description with compact package tags.                  |
| `PackageSpecs`       | Overview package specifications with the documented version, stability, and repository.                |
| `PackageBadges`      | Compact package identity, documented version, stability, and repository on child pages.                |
| `PackageVersion`     | Shared installed-version display and explicit missing or unavailable version states.                   |
| `Requirements`       | A reusable requirements section from an ordered array of strings.                                      |
| `ProseSection`       | A section with an optional anchored heading and shared prose styles.                                   |
| `InstallCommand`     | Lock-backed installation instructions using the same exact command for display, clipboard, and search. |
| `CodeExample`        | Language-aware syntax highlighting, exact source, scrolling, and accessible copy feedback.             |
| `PackageCard`        | A package identity and its documentation destination.                                                  |
| `DocsLink`           | Inertia navigation for local URLs and ordinary links for external destinations.                        |
| `DocsTable`          | A captioned table with escaped text, column headings, and keyboard-accessible horizontal scrolling.    |
| `DocsCallout`        | A titled information, note, tip, caution, or danger message with consistent semantic styling.          |

Follow [code example maintenance](code-examples.md) for supported languages, highlighting, exact clipboard content, and safe fallbacks.

`DocsLayout` supplies branding, responsive navigation, theme selection, the main landmark, and the source reference.
The application selects this layout for `docs/` components.
Do not wrap the page in another layout instance.

Use `PackageGuideHeader` with the registered `page` prop for package pages. It composes `PageHeader` with `PackageSpecs` on the overview and `PackageBadges` on child pages, keeping the actual guide title visible.
Reserve the large identity header and heading artwork for package overview pages. Child pages use the visible task title and compact shared package tags. A package wordmark must not replace a configuration, quality, or other detailed guide title.
Use one "Documented version" value on overviews, child pages, and package cards. It is the actual Composer-installed version, independent of manually authored compatibility requirements and stability. `InstallationCommands::composerVersion()`, shared by `PackageResource` and installation recipes, dynamically displays the exact local aliases `1.99.99` and `1.999.999` as `1.x-dev` for every package; preserve every other Composer version unchanged. Never rewrite the lockfile to change a displayed label, fall back to a catalog version, or add a second compatibility version badge. Keep missing packages and unavailable versions explicit. Overview specifications and compact guide tags link to the package repository through `DocsLink`; use the existing `repositoryUrl` resource field rather than authoring repository URLs in pages. Development versions retain their branch label, and unpublished APIs remain identified as previews in the guide content.

When migrating a section, keep its overview and directly related guides in the same verifiable unit where practical. Preserve heading anchors and code examples, switch links only after the destination is registered, and add exact legacy redirects.
Check examples against the documented package version, including any difference between a command's requirements and a helper's fallback behavior. Correct demonstrated inaccuracies in the owning Vue pages and examples in `docs`.

For example, compose a section with normal Vue markup:

```vue
<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
</script>

<template>
    <ProseSection id="installation" title="Installation">
        <p>Install Maintainer as a development dependency:</p>
        <CodeExample
            label="Install Maintainer"
            code="composer require --dev artisan-toolbox/maintainer:^1.10" />
    </ProseSection>
</template>
```

Use Tailwind utilities and slots for page-specific content.
Extract a component when two real callers share presentation or interaction behavior.
Keep component inputs explicit. Do not read a page's metadata inside a generic content component.
Use `ProseSection` without a heading for introductory paragraphs that need the same prose styling.

For tables, pass `caption`, an ordered `columns` array of labels, and `rows` as arrays of cell text to `DocsTable`.
The optional `cell` slot receives `value`, `rowIndex`, and `columnIndex` when a cell needs formatting such as `<code>`.
Keep HTML out of cell strings. The quality guide uses the same table for the workflow summary and binary requirements.
For authored tables containing links or richer cells, provide semantic `<thead>` and `<tbody>` markup through the default slot. Keep the caption and scrolling behavior on `DocsTable`.
Supply package requirements from `page.requirements`. The PHP package definition owns them; do not duplicate compatibility arrays in Vue partials. Pass requirements explicitly through page-specific components.
For nonpackage pages, leave the definition's package unset and use `PageHeader` without package specifications.
Split long guides into cohesive page-specific sections under `components/docs/<package>/<section>/`, while keeping reusable presentation in `components/docs/`.

Markdown support is deferred. Do not introduce custom component markers or a second content compiler without a concrete authoring need.

## Keep search current

Registered pages and their imported authored Vue partials enter search automatically. Give headings stable IDs and keep searchable code and table values static through the existing shared components. Follow [the search authoring contract](search.md#follow-the-authoring-contract); never maintain a second page list or copied search summaries.

After adding, changing, or removing content, run `php artisan docs:search:index --no-interaction` and `php artisan docs:search:index --check --no-interaction`. Search body text, a code identifier, and a table value when relevant, then verify the returned section links. A shared component with new content semantics needs one shared extraction adapter and behavior tests. Extraction failures stop indexing and preserve the previous artifact; fix the source rather than hiding the page. Deployment must create the release-local index before activating that release.

## Set metadata and source references

Set page metadata in its typed PHP definition and shared package metadata in its package definition.
`DocumentationController` supplies the resolved title, description, canonical URL, and Open Graph values to Laravel Head.
The root Blade document prints `@head`; Inertia's `serverHead` option updates these tags during navigation.
Do not add a Vue `<Head>` or a title callback to a documentation page.

Set each page's `sourcePath` to its Vue file relative to the repository root.
The footer uses **View page source on GitHub** and the configured `1.x` source URL.
The Laravel application now has a published source checkout, so collaboration links point to its Vue pages.
The page-registry test checks that every referenced source file exists.

Configure the application origin with `APP_URL`; do not add a second documentation URL setting.
Generate page URLs through `PageSlug::url()` and the named Laravel routes.
Use Laravel's `route()` in PHP and Ziggy for JavaScript consumers of those routes.
Follow [the frontend routing workflow](routing.md) when a component needs to generate a URL. The initial Blade document supplies Ziggy's native JSON configuration; do not generate frontend route files or maintain a second configuration through Inertia props. Keep form methods explicit and consume existing backend-provided navigation destinations directly.
Tracking parameters do not belong in canonical URLs.
The sitemap and both visible and structured breadcrumbs follow `PageSlug` automatically. Keep registered ancestor titles accurate and do not add another URL list. Follow [the SEO maintenance guide](seo.md) for response-owned schemas, internal noindex rules, initial metadata checks, and post-publication rendering verification with Vue SSR disabled.
Use registered local destinations for migrated guides. The generic legacy package redirect resolves only valid enum cases. Add an explicit alias only when an old path differs from the registered slug.

## Maintain existing content

The `docs` repository is the only documentation source and application. `docs_old` has been retired and no longer exists. Do not recreate it or make legacy synchronization a task requirement.

1. Read the current registered Vue page and its authored partials before editing.
2. Verify its purpose, stability, documented version, requirements, commands, explanations, heading anchors, and links against the package's public behavior.
3. Update the owning page, shared component, or registry and preserve working historical URLs.
4. Compare rendered content and examples with the intended behavior. Confirm code blocks render as text and links remain usable.
5. Update the affected content expectations and changelog in the same task.

Normal frontend tests compare rendered headings, prose, examples, links, and tables against self-contained committed fixtures. Review the content before changing those expectations. Historical source hashes and migration records document earlier verification; they do not require a legacy checkout for current authoring.

The offline converter and `npm run test:migration` suite are archived migration tooling. They require historical source files if intentionally used for archaeology and are not part of current documentation completion checks.

## Keep demos independent

For a complete small backend example, follow [the Core demo maintenance guide](core-demos.md). It covers a bounded JSON request, public package execution, native Inertia HTTP handling, actual source imports, and reset verification. Use a transport that matches the behavior being taught; Mosaicast's response demonstrations continue to use Inertia visits.

Demos have a separate ownership boundary:

- Put Vue demos under `resources/js/components/demo/<package>/<section>/`.
- Put their backend helpers under `app/Demo/<Package>/<Section>/`.
- Give each demo its own controlled loading, error, and reset behavior.
- Start animations, connections, jobs, printing, and other active behavior only after a user action.
- Provide responsive resizing and the source responsible for the behavior.
- Protect all server actions on the backend. Never pass private keys or service credentials to the browser.
- Keep small application integration tests here and full package behavior tests in the owning package.

Do not add a shared demo runtime before the first demo establishes a need for one.
`SharedBrandingDemo` is the first static consumer example. It imports the actual Front Awesome button and places it beside Tailwind utilities, with an independently resizable frame. Its adjacent guide shows the source. Passive styling requires no start action; active demos must still wait for the reader.

Native Laravel or Inertia and Mosaicast comparisons use identical inputs, payloads, event counts, timing, session, and queue conditions.
Describe observed delivery behavior and limits. Add infrastructure only when the requested example requires it, and do not infer performance improvements from a delivery illustration.

## Refresh dependencies

Each documentation task attempts compatible updates for installed Artisan Toolbox packages and the main runtime and test dependencies.
Inspect current requirements and resolved versions first. Run Composer before npm and refresh Composer-delivered frontend copies before testing. A same-version local file dependency can remain stale after an incremental npm install. Verify the actual installed sources. Use a clean frontend installation when necessary, and restart the development server after refreshing copies so its node_modules transforms are rebuilt.
Record the exact commands and actual changes, including already-current results, dependency conflicts, and unavailable registries or other blockers.
Stay within declared compatibility constraints. Never fake a version bump, force an unpublished preview into a stable requirement, or relax compatibility to make a refresh appear successful.
Use the task's existing authorization for dependency changes and preserve unrelated work.

## Verify the change

A documentation defect must be fixed at its owning source. Do not use page-specific CSS, copied package internals, duplicate metadata, skipped checks, or refreshed fixtures to hide a missing prerequisite or broken contract.
Review the complete beginner path for every affected package:

1. Confirm purpose, stability, documented version, requirements, and preview status against the package.
2. Follow the dedicated Installation page from its stated environment and directory.
3. Run the first example with defined inputs and check the documented expected result.
4. Follow the next guide and inspect prerequisite order in the real menu.
5. Confirm that shared components own repeated presentation and that examples, anchors, links, and advanced content remain intact.
6. Record dependency refresh outcomes and any verification that remains blocked.
7. Review affected package skills and changelogs. Update consumer guidance in the same change or record why it remains accurate.

Then validate the application:

1. Run the affected Pest and Vite Plus tests while developing.
2. Add tests for the page's public response, metadata, meaningful interactions, and applicable failure states.
3. Run `composer ci:check` and `npm run build` before completing the unit.
4. Inspect direct loading and Inertia navigation in the browser.
5. Check light, dark, and system themes, visible keyboard focus, code copying, and the mobile menu.
6. Check that a 390 px viewport has no page-level horizontal scrolling.

`npm test` uses `vite.test.config.js` to test Vue components without starting Laravel's development plugins or regenerating route files.
Icon-generation tests use Node rather than a simulated browser.

Run `npm run icons:build` after updating approved brand assets.
See [brand asset maintenance](assets.md) for source ownership and generated paths.

## Keep installation examples current

Use the shared `InstallCommand` for named Composer and npm registry installs. Pass the serialized package explicitly, including through nested authored partials:

```vue
<InstallCommand :package="page.package" command="composer" label="Install Core" />
```

`App\Documentation\InstallationCommands` owns the small set of command recipes. Keys such as `composer`, `frontend`, `broadcast`, `setup`, `security`, and `primevue` identify a package's supported installation tasks. Add a recipe there when a new guide needs another command. `PackageResource` supplies that data to the page and `SearchCatalog` supplies the same data to extraction. No page, search adapter, or test fixture reconstructs dependency versions independently.

Composer versions come from the installed metadata produced by the lock. Registry frontend versions come only from this application's `package-lock.json`. The optional Echo Vue and PrimeVue integrations are installed as development dependencies so their examples also have a reproducible locked source. A vendor `file:` dependency follows its Composer-installed package rather than an invented npm registry version. Install Composer dependencies before frontend files are copied.

The local aliases `1.99.99` and `1.999.999` display as `1.x-dev` in labels and generated commands. This never rewrites the Composer manifests, aliases, or lock. Missing dependencies produce an explicit unavailable message instead of a fabricated pin or silent unversioned install. Explanations belong in the component's existing slot, which is visible only with an available command. The search adapter follows that same branch.

The frontend guard in `scripts/installation-instructions.test.mjs` rejects named registry installation commands authored directly in Vue. The generic `artisan-toolbox/<package>` selection example and documented vendor file installs remain valid. The strict migration fixtures retain historical code and mark only intentional dynamic installation examples with their recipe key. Their test helper reads the real PHP catalog through Composer and requires PHP on the test runner's path. It derives packages from the existing catalog, not another hand-maintained list.

After a dependency update, rebuild the search index before release activation. The index's freshness check detects changed command text. Run the version-mutation tests, shared component tests, extractor tests, and the full Maintainer checks. Verify the displayed command, copied source, and search destination in the actual application.

## Keep package overviews focused

An overview explains the package's purpose and provides a short route to first success. Put detailed connection, printing, preview, security, configuration, and contributor procedures in task guides. Keep requirements and installation before actions that depend on them. For QZ Tray, the overview's local label preview needs no printer or signing key; printing and signing follow their own explicit setup.

When moving a section, keep its historical overview ID as a concise destination link and retain stable headings in the owning guide. Verify the old links and ensure technical prose, tables, and examples have one clear owner. Update collection-level migration coverage rather than copying the same reference back into the overview to satisfy an old snapshot.

## Verify Web Awesome wrappers against upstream

Before marking a wrapper implemented, inspect its public export and run its live Vue example. Keep the shared component catalog as the only editorial inventory. Edition access, wrapper implementation, preview availability, and verification status are separate facts.

Review every documented example against the installed upstream reference. Record the component, example heading, inputs, actions, expected result, and actual verification outcome. Exercise native and wrapped elements with the same inputs, theme, viewport, light or dark mode, and Tailwind reset. Compare computed styles and geometry as well as interaction, keyboard navigation, focus, accessibility semantics, events, slots, and native methods. An inert HTML render cannot verify a scripted interaction. Mark unavailable network, clipboard, media, licensing, and browser capabilities explicitly.

Compile optional-prop Vue examples and meaningful invalid examples against upstream types. Test aliases, boolean presence, richer properties, registration timing, and native current values separately from form reset defaults. Prefer shared generation and adaptation to component-specific CSS or repeated fixes. Package `AGENTS.md` owns the detailed acceptance contract; package tests own runtime coverage.

Each implemented component needs an executable Vue example using public imports, supplied inputs, a visible expected result, and a link to its upstream reference. Place live examples under `components/demo/front-awesome/<group>/`, alongside source shown by the shared `CodeExample`. Start active operations only after the reader acts. Preserve the existing Installation and setup journey, then link to category examples and detailed guides. Keep compatibility and preview labels accurate after refreshing Composer and frontend vendor copies.

## Present responsive live examples

Use the shared `components/demo/DemoFrame.vue` for every live example. It owns compact, wide, and fluid width presets, a draggable keyboard-operable separator, the measured width, and source disclosure. Keep the frame quiet so the component remains the focus. Do not put a second native resize handle inside an example.

Keep controls in ordinary block sibling cells inside demo stacks. Stretching an inline control can separate its pointer hit area from its visible content. Rating is a concrete regression case. Test every visible star at compact and full widths, then check the displayed value after the native `change` event. Do not infer event names from another form control or treat a synthetic event as proof of real pointer behavior.

Run `npm run demos:sync` after reviewing a Front Awesome example change and `npm run demos:check` before completion. The source synchronization tool follows mounted demos and partials, validates catalog ownership, and maintains exact authored source, including CRLF line endings, template strings, and trailing blank lines. Complementary exports share one complete owner scenario while retaining their own catalog entries and anchors. Supplemental binding and Icon examples use the same frame and source checks. Keep shorter introductory quickstarts in their owning task guides, rather than as a second copy of a live demo. The search adapter reads the canonical frame's static source list and excludes its live slot, retaining code search without dynamic demo state. The first source is the live SFC. For an additional imported helper, use its exact filename as the source label, such as `Helper.vue`; the checker resolves that file recursively from the live SFC import graph. Do not introduce a second source registry.

After a local documentation application is running, run `DOCS_BASE_URL=https://your-site.test npm run test:browser`. Install the Playwright Chromium browser, or set `CHROMIUM_EXECUTABLE` to a system Chromium executable. This browser check verifies all catalog frames, viewport controls, actual Rating pointer selection and output, mobile overflow, and browser exceptions. It writes screenshots under `storage/app/browser-verification/`. It complements the owning package's native parity, interaction, reset, and coverage suites.

The reviewed beginner path remains an existing Laravel, Inertia, Vue, and Vite application, then requirements, Composer installation, frontend vendor-file installation, the Front Awesome Vite plugin and styles, the first public Button example, Web Awesome setup, and the grouped catalog. The expected first result is a styled Hello from Front Awesome button. The existing Installation route and subsequent guide destinations remain intact. Public wrappers provide the demonstrations; viewport and source presentation belong to the documentation application.

Keep rich current properties separate from textual reset attributes. A Tag Input array and a date/time Date are native property inputs. Do not copy either object into a string `defaultValue`. Compare native and wrapped form resets, and provide an explicit default in the upstream-supported type when a quickstart needs one.

Classify application component substitutions as obvious, logical, possible or requiring adaptation. Inspect the reachable template inventory with `node scripts/front-awesome-usage.mjs`. Prefer public package components inside existing domain owners. Keep a native control when its semantics or framework integration do not match, and record the concrete reason in [architecture](architecture.md#component-adoption). Do not count authored code strings or unreachable starter components as application adoption.

Review every migrated group visually in desktop and mobile layouts and both themes, including open, focused, loading, error and success states where relevant. Run the complete `npm run test:browser` chain. The application and sign-in scripts write screenshots under `storage/app/browser-verification/adoption`. Inspect the images; a passing overflow or event assertion does not establish visual quality. Sign-in POSTs must be intercepted by the test and never reach mail or authentication services.

Preserve actual execution coverage when delegating behavior to a package. CodeExample's unit checks own exact source delivery and feedback events; the browser suite must still execute the real CopyButton clipboard path and verify success, denied access and an unavailable API. Check actual accessible roles and states rather than attributes on a custom-element host alone. Include slotted Tailwind padding and local branding when reviewing container components, because native `--spacing` can collide with the utility unit.

### Review nested Page and feedback examples

Use the public Page as the base of the active shells. Keep application-owned navigation state, article refs and responsive outline placement in DocsLayout. Use native slot attributes on actual children, preserve a unique focusable `main-content` target, and verify the native skip link by keyboard. Keep header spacing in PublicSiteHeader and native header sticking in Page.

Give embedded Page regions visible boundaries and labels. Use the native `navigation-toggle` slot for a nested preview; the upstream `data-toggle-nav` desktop helper can also match an ancestor Page. Verify the nested mobile menu without opening the application's navigation. Test initial fragment destinations, sticky headings and responsive slots in the actual application.

Preserve a component's native display mode when sizing its host. Skeleton's flex display stretches its indicator; a `block` utility collapses that indicator even when the host has an explicit height. Demonstrate static, pulse and sheen modes with reader-controlled animation. Verify the painted indicator, not just its host rectangle. For Tooltip or Popover method controls, keep the opening click from immediately reaching native outside-click dismissal and check sustained visibility after the transition.

For data-entry demonstrations, prefer the public shared binding over hand-written native event copies. Exercise both model and Inertia ownership, compatible dotted fields, programmatic updates, native interactions, reset, server errors and manual `failed` validation. Verify message content and danger appearance in light and dark themes. Check the actual hit area of intrinsic controls after adding error messages. Keep native reset defaults distinct from current state. Use named models for genuine mutable native state and document read-only observations separately. Keep the named model reference synchronized with the installed package definitions through its contract test.
