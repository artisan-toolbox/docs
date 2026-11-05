# Documentation architecture

The documentation application uses Laravel routes, Inertia responses, and Vue pages.
It exercises the same application stack as consuming projects.
Vue SSR is disabled in both PHP and Vite.

## Ownership

`app/Documentation/Documentation.php` owns package identity, page metadata, and available documentation destinations.
`DocumentationController` resolves a registered slug, applies Laravel Head metadata, and returns its Inertia component.
Unknown slugs return 404 before component resolution.

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
