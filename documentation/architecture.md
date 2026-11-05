# Documentation architecture

The documentation application uses Laravel routes, Inertia responses, and Vue pages.
It exercises the same application stack as consuming projects.
Vue SSR is disabled in both PHP and Vite.

## Ownership

`PageSlug` is a string-backed enum of visitable pages. Its `page()` method selects a concrete page through an exhaustive match.
`Pages/` contains immutable definitions extending the abstract `Page` contract. Each definition names its enum identity, Vue component, title, description, source reference, and optional package.
`Packages/` contains immutable definitions extending the abstract `Package` contract. The same package object supplies catalog identity, overview specifications, requirements, and an explicit optional overview destination.
`Documentation` coordinates the six-package catalog and derives navigation from `PageSlug::cases()`.

Laravel implicitly binds the route's string to `PageSlug`. Unknown values return 404 before the controller executes.
The index case has an empty value and is the controller's default for `/docs`.
`DocumentationController` resolves the enum's page, applies Laravel Head metadata, and returns its Inertia component.

`PageResource` and `PackageResource` transform the objects into the existing frontend fields.
The controller explicitly resolves the resources with the request so Inertia receives `page.title` and an ordinary package list without a `data` wrapper.
Domain definitions do not build transport arrays.

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
Laravel's URL generator uses that origin even when a request arrives on a different hostname or protocol.
`PageSlug::url()` generates paths through named routes. Canonical URLs never concatenate a `/docs` path in the controller.
Social image URLs use Laravel's asset helper.
Laravel Head preserves the configured scheme, including HTTP during local development.

PHP uses Laravel's `route()` helper. Ziggy exposes the same named routes to JavaScript; it is not a PHP route generator.
There is no separate `documentation.url` setting.
Published URLs for unmigrated packages are retained migration destinations, separate from the replacement application's origin.

## Package reuse

Before adding a documentation feature, inspect the relevant Artisan Toolbox package's public components, composables, and backend APIs.
Prefer consuming those APIs to building a documentation-specific replacement.
Record the chosen export or the concrete reason for application-specific behavior.
Keep consumer dependencies installed through Composer and documented `file:vendor/artisan-toolbox/<package>` frontend entries.

Front Awesome already exports `Theme` and `createFrontAwesome({ theme: true })` for theme selection and persistence.
The documentation's inherited appearance controller must be replaced by that integration when the consumer-package unit installs Front Awesome.
This metadata and routing refinement does not introduce another theme controller or change the current theme UI.

## Migration boundaries

The catalog preserves all six package identities.
Only migrated pages use new local `/docs` destinations.
Unmigrated guides and packages retain the canonical live URLs.
Legacy redirects are exact so an overview redirect cannot swallow guide URLs.

Source references point to existing GitHub content during migration.
The public replacement must publish its Vue sources and update these links before cutover.
The existing `docs_old` publication remains authoritative until that cutover.

Search, demos, Maintainer integration, Reverb, Horizon, Ziggy replacement, the final landing page, and deployment are separate units in [the migration plan](migration.md).

## SEO limitation

The browser receives metadata in the initial response without Vue SSR.
The article body still requires JavaScript.
This tradeoff follows the explicit decision to disable SSR.
Page indexing and link-preview verification remain cutover checks, even when head-tag tests pass.

The package integration follows the [Laravel Head documentation](https://laravel.com/framework/docs/head).
