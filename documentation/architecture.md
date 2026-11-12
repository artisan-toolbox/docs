# Documentation architecture

The documentation application uses Laravel routes, Inertia responses, and Vue pages.
It exercises the same application stack as consuming projects.
Vue SSR is disabled in both PHP and Vite.

## Ownership

`PageSlug` is a string-backed enum of visitable pages. Its `page()` method selects a concrete page through an exhaustive match.
`Pages/` contains immutable definitions extending the abstract `Page` contract. Each definition names its enum identity, Vue component, title, description, source reference, and optional package.
`Packages/` contains immutable definitions extending the abstract `Package` contract. The same package object supplies catalog identity, overview specifications, requirements, and an explicit optional overview destination.
`Documentation` coordinates the six-package catalog and derives navigation from `PageSlug::cases()`.

Navigation is a recursive `NavigationNode` tree. `PageSlug::parent()` owns ancestry, while the index remains a top-level leaf.
Nodes expose `slug`, `title`, `href`, `active`, `activeAncestor`, and `children`; sibling order follows the enum.
The parent defaults to the nearest registered nonempty URL prefix. Sparse enum overrides preserve public guide URLs when editorial groups change. Navigation, active ancestors, and breadcrumbs share this relationship, so grouped links and breadcrumb structured data agree. Parent-graph tests reject cycles and verify that every page appears exactly once. Vue receives the resulting tree rather than maintaining another menu.

`DocsBreadcrumbs` wraps long trails onto additional lines. Each separator stays with its destination, and individual labels can wrap within the available width. All ancestor links and the current-page label remain visible without horizontal scrolling. The navigation landmark adds no extra tab stop; keyboard users reach its links directly.
One recursive Vue component renders real page links and separate disclosure buttons, with unique control IDs and exact current-page semantics.
The shared recursive lookup serves page-level guide links as well as the layout, so consumers do not depend on a flat list.

Page-level navigation has a separate boundary. `DocsTableOfContents` derives its ordered section and subsection links from anchored headings inside the rendered page slot. It handles both shared sections and raw authored headings without duplicating their titles in PHP or a frontend registry. The footer and explicitly excluded demo subtrees do not participate. The component owns active-section tracking, the mobile disclosure, and listener cleanup; page changes replace that state. A wide viewport places the same outline in a sticky right rail.

Front Awesome's public component exports were inspected before this addition. They provide buttons, theme integration, and toasts, but no article outline API. This component remains application-specific because its scope is the documentation article and its responsive navigation. The package continues to own shared styling. The documentation logo and explicit sidebar/footer links return to the named home destination.

The shared header reports its rendered height through `ResizeObserver` and releases that observer on unmount. The layout uses the measurement as a CSS variable consumed by Tailwind utilities for navigation placement and heading clearance. This accounts for wrapped controls instead of assuming an 80-pixel header. The mobile package panel stays in the viewport during deep reading, and Escape restores focus to its toggle.

`DocsLink` owns outbound-link behavior. It compares web destinations with the current browser origin, keeps root-relative links on Inertia, and adds `_blank` with `noopener noreferrer` only for external HTTP(S) destinations. Protocol-relative links are classified before root-relative navigation. No document-level click interception is required.

Laravel implicitly binds the route's string to `PageSlug`. Unknown values return 404 before the controller executes.
The index case has an empty value and is the controller's default for `/docs`.
`DocumentationController` resolves the enum's page, applies Laravel Head metadata, and returns its Inertia component.

`PageResource` and `PackageResource` transform the objects into the existing frontend fields.
The controller explicitly resolves the resources with the request so Inertia receives `page.title` and an ordinary package list without a `data` wrapper.
Domain definitions do not build transport arrays.

`InstallationCommands` resolves exact Composer-installed versions and npm versions from the documentation application's lock. `PackageResource` supplies the named recipes, and `InstallCommand` renders them through the shared code component. Explicit props carry that metadata into nested partials. `SearchCatalog` passes the same package resource to the static extractor, whose adapter follows the component's visible-content branch. There is no second recipe implementation in JavaScript or fallback to workspace-only files. Only the two exact local aliases are normalized in presentation; Composer metadata stays intact.

Vue pages own authored content and compose reusable presentation components.
Generic components receive props and slots.
The public layout alone reads shared Inertia navigation and page metadata.
This keeps requirements, specifications, prose, and code examples reusable outside a specific page.

The root Blade document mounts Inertia and renders head tags.
It does not author documentation content.

## Authoring decision

The first unit compared ordinary Vue composition with compiling Markdown imports into Vue components.
Vue composition is the initial approach because it fits the requested stack and needs no additional content compiler.
The Maintainer overview proves the component contracts on existing content.
Long prose may justify Markdown support later, but the migration does not introduce a custom component language.

PHP owns metadata. Documentation Vue pages do not write title or description tags.
Laravel Head emits the initial tags, shares the destination tags with Inertia, and owns canonical and social metadata.
The client uses `serverHead: true` to adopt and update those tags.

Search discovery uses the same page registry. The sitemap lists the named home route and every `PageSlug`; `Documentation::breadcrumbs()` derives registered ancestors for both the shared layout and Laravel Head's breadcrumb schema. Public structured data belongs to its controller response. Dynamic robots advertises the sitemap, while route-name-based response headers keep internal endpoints out of indexing. See [Search discovery and page metadata](seo.md) for ownership, tests, and the public rendering checks required with Vue SSR disabled.

## Page resolution decision

The refinement compared an enum's `page()` method with explicit route binding that supplies the abstract `Page` to the controller.
Enum resolution keeps the mapping visible and uses Laravel's existing invalid-enum handling.
An explicit binding would need its own invalid-value handling, index defaults, and provider registration.
A request-dependent container binding would also hide which route selects the page.
The implementation therefore uses `show(..., PageSlug $slug = PageSlug::Index)` and `$slug->page()`.

The abstract classes provide immutable typed metadata shared by concrete definitions.
Separate interfaces with the same fields would add no behavior to this implementation.
Each concrete page's `SLUG` references an enum case rather than repeating a slug string.
Tests verify that every case resolves the matching page and an existing Vue component.

## URL ownership

`APP_URL`, read through `config('app.url')`, is the application's origin and scheme.
The public production origin is `https://atb.dev.br`; public contact and security reporting use `contact@atb.dev.br`.
Laravel's URL generator uses that origin even when a request arrives on a different hostname or protocol.
`PageSlug::url()` generates paths through named routes. Canonical URLs never concatenate a `/docs` path in the controller.
Social image URLs use Laravel's asset helper.
Laravel Head preserves the configured scheme, including HTTP during local development.

PHP uses Laravel's `route()` helper. Ziggy exposes the same named routes to JavaScript; it is not a PHP route generator.

The root Blade document emits Ziggy's native JSON before the application entry. The installed `ziggy-js` helper discovers it on first use, including direct imports in consuming packages. `ZiggyVue` installs without another configuration object or fixed location snapshot. `config/ziggy.php` owns the feature-group filter. Login and account links use named routes; existing PHP-generated documentation destinations remain backend-owned. There are no generated frontend route files or Wayfinder dependencies. See [frontend routing](routing.md) for the workflow and checks.
There is no separate `documentation.url` setting.
QZ Tray has a short preview-first overview and dedicated installation, security, connection, printing, preview, compatibility, tooling, and development guides. Former overview fragments remain concise links to their owning guides. Frozen-content tests verify technical material across that collection rather than requiring a duplicated long overview.

All six packages now have local overview and guide destinations. Legacy public paths redirect to these named routes.

## Package reuse

Before adding a documentation feature, inspect the relevant Artisan Toolbox package's public components, composables, and backend APIs.
Prefer consuming those APIs to building a documentation-specific replacement.
Record the chosen export or the concrete reason for application-specific behavior.
Keep consumer dependencies installed through Composer and documented `file:vendor/artisan-toolbox/<package>` frontend entries.

Front Awesome supplies the public Vite plugin, `tailwind.css`, and `web-awesome-tailwind` entries. The application publishes and owns `resources/css/branding.css` through `front-awesome-branding`. Its complete brand ramp follows the logo's red, with slate neutrals, Instrument Sans, system monospace, spacing, radii, and complete shadows. Tailwind and Web Awesome read these shared inputs. Do not copy the package's generated adapter or combine it with the standalone Web Awesome style entry.

Laravel Vite supplies the font files, optimized Fontaine fallback, and `--font-instrument-sans` stack through `@fonts`. Branding consumes that variable once, and Tailwind and WA share it without a second font transform. See [font maintenance](assets.md#maintain-the-font-fallback).

The package also exports `Appearance` and `createFrontAwesome({ appearance: true })`. The documentation retains its existing single appearance controller because it additionally owns the server cookie and prepaint behavior. Installing the general Vue plugin would also initialize unrelated toast and Mosaicast lifecycles. The shared-theme guide explicitly supports an existing appearance manager. The controller synchronizes `dark`, `wa-dark`, and `wa-light`, validates persisted values, and follows operating-system changes in system mode. It does not introduce a second theme store.

The real styling demo consumes the Composer-installed public `Button.vue` export. It lives under `components/demo/front-awesome/`, can be resized, and sits next to the source example. It does not start network, printing, or background activity.

Site icons consume Front Awesome's public Icon wrapper, which registers the selected WA runtime when it mounts. `SiteIcon` centralizes native attributes, decorative accessibility, typography-based sizes, and theme inheritance. The existing Font Awesome script and `data-fa-kit-code` derive from one public documentation configuration value. WA owns official icon resolution and caching. Uploaded mono and duotone icons use the configured kit's standard markup in a keyed, isolated child of the same component. Font Awesome may replace that child without taking ownership of Vue's wrapper. Package identity descriptors are shared by the menu and compact guide tags. The app's navigation map and callout variants own other presentation choices; package artwork and authored guide text remain separate. See [icon maintenance](icons.md).

The release lock consumes the published Front Awesome `1.0.0-alpha.2` preview, QZ Tray `1.4.0`, and the other packages' public Composer distributions. npm installs the documented `file:vendor/artisan-toolbox/front-awesome` entry after Composer. Local development routing and aliases remain available, but release locks must pass the distribution check and an isolated consumer build. See [quality checks](quality.md#prepare-standalone-installation).

## Component adoption

The application consumes Front Awesome through its Composer-installed public exports. Existing domain components keep their contracts. `DocsCallout` owns editorial variants and uses Callout. `CodeExample` owns exact source, highlighting and announcements while CopyButton owns clipboard execution. The header uses Select and Option with the existing appearance controller. Package identity labels use Tag, and official SiteIcon rendering uses Icon while uploaded-kit rendering retains its isolated subtree. Login uses Input's Inertia form bridge and Button. Core options use Checkbox, Mosaicast uses Input, and catalog actions use Button.

Fragment navigation waits at the documentation layout boundary for the rendered WA hosts to register and finish their first native update, then for `document.fonts.ready` to complete font layout. The documented [Inertia navigation event](https://inertiajs.com/docs/v3/advanced/events) distinguishes initial loads and visits from history restoration. Initial and visit fragments are positioned after that readiness boundary; history retains Inertia's recorded reading position. Every navigation advances a layout-local revision, including history visits that do not start alignment. A superseded revision, changed destination, or disconnected layout cancels stale positioning. The revision also protects a reader who leaves and returns to the same URL while fonts are pending. This corrects geometry measured before asynchronously upgraded examples or fonts reach their final layout, without per-component scroll adjustments or manual history restoration.

PublicSiteHeader reserves the theme selector's existing 44 px control height on its host. Option elements can register before the selector and otherwise expand its temporary light DOM to three rows. That transient height previously increased the header and fragment offset by 64 px. The application owns this header layout; it continues to consume the public Select and Option exports. Browser verification defers registration and font delivery to check final header and fragment geometry without widening the positioning tolerances.

The three active shells use the public Page wrapper directly. DocsLayout and Welcome put PublicSiteHeader in the native header slot and keep their existing content in a default-slot div. Login preserves its isolated flex canvas inside Page. The native skip link targets the unique light-DOM `main-content` landmark, with one shared focused style through the public part. Page owns header stickiness; PublicSiteHeader owns its measured content height. A hidden native label part keeps the appearance selector accessible without reserving an empty label row, and its public control-height token matches the header's 44px controls.

The documentation keeps its application-owned mobile navigation and two outline breakpoints. Native Page navigation would replace the anchored mobile panel with a modal Drawer and change the sidebar scroll owner. That is a different interaction contract. Page itself does not override `--spacing`, so its header/default-slot composition preserves the Tailwind unit. The nested Page demo uses `navigation-toggle` instead of `data-toggle-nav`, whose upstream desktop helper also matches an ancestor Page.

Button, Button Group, Page and Icon references live in their upstream Actions, Layout and Media categories. Their former standalone routes are permanent aliases to those categories. Alias responses omit a fragment so browsers retain historical incoming hashes; canonical authored links use the component's category anchor. Existing integration contracts and subheadings remain in shared content partials within those sections. There is no second sidebar entry or searchable page for the same reference.

The adoption review has four levels. A possible visual resemblance is not sufficient to change document or interaction semantics.

| Fit                 | Candidates                                                                                                                                            | Decision                                                                                                                                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Obvious             | Code copying, form actions, catalog action buttons and official icon rendering                                                                        | Consume CopyButton, Button and Icon. Keep exact source, labels, events, IDs and explicit button types.                                                                                                        |
| Logical             | Editorial callouts, theme selection, package labels, text fields and boolean options                                                                  | Consume Callout, Select, Option, Tag, Input and Checkbox inside existing owners. Preserve the appearance cookie, form objects, validation and reset behavior.                                                 |
| Possible            | Card framing, passive observer components and segmented sign-in codes                                                                                 | Retain the current one-link cards, tested observers and single code field. These substitutions remove little application policy or change editing behavior. They require an observed benefit before adoption. |
| Requires adaptation | Search modal, source disclosure, custom toggle controls, breadcrumbs, mobile Drawer, Tree navigation, DataGrid reference tables and Appearance plugin | Retain their current owners and native semantics. The concrete constraints below prevent a safe direct substitution.                                                                                          |

Web Awesome 3.14 uses the component property `--spacing` on AccordionItem, Card, Details, Dialog, Divider and Drawer. Tailwind also uses `--spacing` as its numeric utility unit. A container override can therefore enlarge padding and gaps in its slotted Tailwind content. A search prototype produced 80px for `pt-4` instead of 16px. Capturing and resetting the unit created a variable cycle in a direct `.fa-theme` child; compiler aliasing changed font-only local scopes. The application retains its existing search modal and native source disclosure instead of adding container-specific resets or changing the shared branding contract.

Search also retains its native field and retry button. Reka's focus scope compares its deepest active element with light-DOM tab candidates. A Web Awesome shadow input did not satisfy that boundary comparison, and actual Tab navigation escaped the modal. Search still protects shortcuts originating inside other shadow controls by inspecting the event's composed path.

Button's host attributes are not all forwarded to its internal focusable button in the installed upstream version. Accessible button names come from slotted text or a labeled icon. Native disclosure controls, preview preset buttons with `aria-pressed`, and the resize separator retain their state directly on the focusable element. Breadcrumbs retain Inertia links and a plain current-page label; BreadcrumbItem's internal anchor or button cannot express both without changing routing or nesting interactive content.

The existing appearance controller additionally owns the cookie used by Blade prepaint. Installing the general Front Awesome plugin would also change Mosaicast and flash-toast ownership. A Select replacement does not require that larger integration migration. Static reference tables remain tables with captions and row headers, and navigation remains derived from PageSlug.

`scripts/front-awesome-usage.mjs` inventories the reachable import graph and Vue template AST. It excludes authored source strings and raw imports, and identifies unused starter files separately. Run it after a migration to review actual controls rather than counting files. The browser suite verifies 1440px and 390px layouts in both themes, actual clipboard execution and failures, theme cookies, modal keyboard behavior, Core requests, source spacing and mocked sign-in responses. Login focus follows both the current step and processing state, so a newly rendered disabled field is not focused prematurely. Test sign-in responses never send mail or create authentication records.

## Learning journey ownership

The sidebar is an editorial learning sequence expressed once through enum order.
Every package has an overview quickstart and a registered Installation page.
Requirements and installation precede first success. Required configuration precedes the example that needs it. Task guides precede advanced explanations, reference, and contributor development.
Alphabetic sorting would lose this dependency order, so navigation retains author decisions.

Specialized shared components own overview identity, compact guide tags, requirements, examples, callouts, and navigation.
The large identity header belongs only to the package overview, while each child page preserves its visible task title.
Package definitions own documented version, compatibility, and stability. Composer supplies separate evidence about the application installation, including branch aliases and previews. One does not overwrite the other.

Demos use public package exports and remain isolated under `components/demo/<package>/<section>/` and `app/Demo/<Package>/<Section>/`.
Active behavior waits for a reader action. Native Laravel or Inertia comparisons with Mosaicast share inputs, payloads, counts, timing, session, and queue conditions.
Infrastructure is added only for the requested behavior, and private credentials remain server-side.

Documentation changes fix the owner of a defect. Page-specific CSS patches, duplicated metadata, copied internals, forced dependency versions, and weakened checks do not resolve missing prerequisites or broken contracts.
Each task audits the beginner path and attempts compatible Artisan Toolbox and main runtime and test dependency updates. The task record states actual changes, already-current results, conflicts, and blockers, followed by verification.
The application keeps its existing component and registry boundaries because they give these decisions one reviewable owner.

## Migration boundaries

The catalog preserves all six package identities. Every legacy content page has a replacement or explicit historical alias. The root landing page uses the same catalog. Inspect `PageSlug::cases()` when auditing registered pages.
The `/packages/{slug}` redirect uses implicit enum binding, so only registered pages redirect. Unknown paths remain 404. Historical aliases and former community paths are explicit named-route redirects; trailing slashes preserve the same destination.

Source references point to the corresponding Vue file on the documentation repository's `1.x` branch. Changes must be published with those files so the collaboration links resolve in the public checkout.
The `docs` repository is the only documentation source and application. The retired `docs_old` checkout no longer exists and is not required for authoring, synchronization, or validation. Historical redirects and migration records remain supported independently of that source checkout.

The application now has dedicated installation pages for all six packages, compact guide headers, and Composer-derived installation metadata. `PageSlug::cases()` supplies the current registered page inventory. Mosaicast's live response comparisons consume its public client and server APIs. Horizon separates normal jobs from the bounded demo queue, and Reverb supplies the optional broadcast path. Installing these integrations does not claim that their external services or a production worker have been started.

Horizon belongs to the documentation server and is its sole PM2 application. Broadcast delivery uses the external WSS Software Reverb application, which does not run Horizon for this site. Only public connection settings enter the frontend build. PM2 configuration is applied after publication so the Horizon process boots the new current release. Scheduler ownership remains separate. Follow [queue and broadcast operation](queues.md).

The [migration record](migration.md) preserves earlier decisions. New package demos and deployment work are separate tasks in the current application. Ziggy replacement is complete. See [Mosaicast demos](mosaicast-demos.md) and [queue operation](queues.md) for the implemented boundaries and verification.

## Documentation search

`PageSlug` remains the only page registry. `docs:search:index` exports its metadata to the Node extractor in `scripts/documentation-search.mjs`, which reads Vue compiler ASTs without executing source or enabling SSR. Imported authored partials, code strings, table values, requirements, and section IDs produce the search corpus. Shared component adapters own content semantics; unsupported visible expressions fail instead of silently disappearing.

`DocumentationSearchIndex` creates a release-local SQLite FTS5 artifact with atomic replacement and content-based freshness. The application database, queues, and Redis do not own the index. HTTP queries open it read-only and return bounded ranked section links and plain-text excerpts. Missing indexes fail explicitly without starting a rebuild. The shared public header composes the Reka dialog and existing `DocsLink` navigation.

See [search maintenance](search.md) for authoring, the deploy command, supported content, freshness checks, and failure recovery. Package APIs and consumer skills are unchanged because the search corpus and interaction belong to the documentation application.

## SEO limitation

The browser receives metadata in the initial response without Vue SSR.
The article body still requires JavaScript.
This tradeoff follows the explicit decision to disable SSR.
Page indexing and link-preview verification remain cutover checks, even when head-tag tests pass.

The package integration follows the [Laravel Head documentation](https://laravel.com/framework/docs/head).

## Shared form binding and compound examples

Data-entry demos consume Front Awesome's public shared models and Inertia form bridge rather than repeating native event adapters. The Forms category owns the former Input guide, complete with historical fragment destinations and redirect coverage. All bound controls present server messages and danger state; manual models demonstrate the public failed input. Viewport resizing uses the shared frame's container context, so local responsive grids use container query variants rather than the outer browser's breakpoints.

Companion exports remain discoverable in the single component catalog but point to one complete owning scenario. The source checker follows actual mounted partials, verifies owner imports, and includes supplemental Icon and form binding demos. It rejects duplicate and orphan scenarios. The named-model reference is checked against the Composer-installed semantic definitions. Documentation imports component APIs through the package's supported frontend entries; test-only contract inspection reads installed source metadata.

Rating and DatePicker have no native hint slot. Their shared validation presentation keeps a stable, dedicated presentation element and native host. The inactive element uses display:contents without group semantics, and the public component ref still resolves to the host. A neutral element avoids collisions with application styles targeting generic spans. This bounded DOM change prevents value, focus, and listener loss when validation is enabled after mounting an unbound control. Direct-parent selectors are not preserved for those two outer roots. Other form controls retain native hint presentation. No private Shadow DOM mutation is used.
