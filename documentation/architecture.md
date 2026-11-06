# Documentation architecture

The documentation application uses Laravel routes, Inertia responses, and Vue pages.
It exercises the same application stack as consuming projects.
Vue SSR is disabled in both PHP and Vite.

## Ownership

`PageSlug` is a string-backed enum of visitable pages. Its `page()` method selects a concrete page through an exhaustive match.
`Pages/` contains immutable definitions extending the abstract `Page` contract. Each definition names its enum identity, Vue component, title, description, source reference, and optional package.
`Packages/` contains immutable definitions extending the abstract `Package` contract. The same package object supplies catalog identity, overview specifications, requirements, and an explicit optional overview destination.
`Documentation` coordinates the six-package catalog and derives navigation from `PageSlug::cases()`.

Navigation is a recursive `NavigationNode` tree. The nearest registered nonempty slug prefix owns each descendant, while the index remains a top-level leaf.
Nodes expose `slug`, `title`, `href`, `active`, `activeAncestor`, and `children`; sibling order follows the enum.
This uses the existing URL hierarchy instead of a second parent registry that authors would need to keep synchronized.
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

The package also exports `Theme` and `createFrontAwesome({ theme: true })`. The documentation retains its existing single appearance controller because it additionally owns the server cookie and prepaint behavior. Installing the general Vue plugin would also initialize unrelated toast and Mosaicast lifecycles. The shared-theme guide explicitly supports an existing appearance manager. The controller synchronizes `dark`, `wa-dark`, and `wa-light`, validates persisted values, and follows operating-system changes in system mode. It does not introduce a second theme store.

The real styling demo consumes the Composer-installed public `Button.vue` export. It lives under `components/demo/front-awesome/`, can be resized, and sits next to the source example. It does not start network, printing, or background activity.

Site icons consume WA's public icon module through one application import. `SiteIcon` centralizes native attributes, decorative accessibility, typography-based sizes, and theme inheritance. The existing Font Awesome script and `data-fa-kit-code` derive from one public documentation configuration value. WA owns official icon resolution and caching. Uploaded mono and duotone icons use the configured kit's standard markup in a keyed, isolated child of the same component. Font Awesome may replace that child without taking ownership of Vue's wrapper. Package identity descriptors are shared by the menu and compact guide tags. The app's navigation map and callout variants own other presentation choices; package artwork and authored guide text remain separate. See [icon maintenance](icons.md).

The release lock consumes the published Front Awesome `1.0.0-alpha.1` preview and the other packages' public Composer distributions. npm installs the documented `file:vendor/artisan-toolbox/front-awesome` entry after Composer. Local development routing and aliases remain available, but release locks must pass the distribution check and an isolated consumer build. See [quality checks](quality.md#prepare-standalone-installation).

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
The existing `docs_old` publication remains authoritative until that cutover.

The application now has dedicated installation pages for all six packages, compact guide headers, and Composer-derived installation metadata. The registry has 65 documentation pages. Mosaicast's live response comparisons consume its public client and server APIs. Horizon separates normal jobs from the bounded demo queue, and Reverb supplies the optional broadcast path. Installing these integrations does not claim that their external services or a production worker have been started.

Horizon belongs to the documentation server and is its sole PM2 application. Broadcast delivery uses the external WSS Software Reverb application, which does not run Horizon for this site. Only public connection settings enter the frontend build. PM2 configuration is applied after publication so the Horizon process boots the new current release. Scheduler ownership remains separate. Follow [queue and broadcast operation](queues.md).

Additional package demos and production cutover remain separate units in [the migration plan](migration.md). Ziggy replacement is complete. See [Mosaicast demos](mosaicast-demos.md) and [queue operation](queues.md) for the implemented boundaries and verification.

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
