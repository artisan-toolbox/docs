# Maintain documentation search

Documentation search runs on the application server using SQLite FTS5. It searches registered page titles, section headings, authored prose, code examples, requirements, and table values. Results link to the matching section. The application needs no search daemon, external search account, or browser-visible credential.

## Add or update searchable content

Write the page normally and register it in `PageSlug`. Import its authored Vue partials as usual. Do not add search summaries, keywords, a second page list, or a separate model for each guide.

From the documentation application root, rebuild after changing content:

```sh
php artisan docs:search:index --no-interaction
```

The command discovers every registered page and its imported content. A changed shared partial updates every page that uses it. Removing a page from the registry removes its search results on the next successful build. A source file that disappears while its page remains registered fails the command instead of silently losing the guide.

Check freshness without writing:

```sh
php artisan docs:search:index --check --no-interaction
```

This exits unsuccessfully when the artifact is missing, invalid, or differs from the current extracted content. An unchanged rebuild preserves the existing artifact. Search requests never rebuild it.

## Run during deployment

Use PHP 8.5 with PDO SQLite and FTS5, Node.js 24.11 or later, and the project's installed frontend dependencies. The extractor uses the compiler shipped with the installed Vue package. Composer must run before npm because frontend package entries come from Composer distributions.

Run these steps in the new release directory before activating it:

```sh
composer install --no-interaction --prefer-dist --optimize-autoloader
npm ci
npm run build
php artisan docs:search:index --no-interaction
php artisan docs:search:index --check --no-interaction
```

Keep frontend build dependencies available until indexing finishes. Runtime search needs PHP and the generated SQLite file; it does not need Node, npm, a worker, Redis, or Horizon. A production Composer installation may use the project's normal `--no-dev` policy after accounting for its other deployment requirements.

The default artifact is `bootstrap/cache/documentation-search.sqlite`, configured by `documentation.search_index`. It belongs to the release, alongside that release's source. Do not share the artifact between releases or commit it. A rollback restores the previous release and its matching index. The existing [standalone package publication requirements](quality.md#prepare-standalone-installation) still apply.

Index creation writes a unique temporary SQLite file in the same directory, validates it, closes it, and publishes it by rename. Extraction or publication failure leaves the last good artifact in place. The command returns a failure exit code so a deployment can stop before switching traffic. The cache directory must be writable by the deployment user, and the final artifact must be readable by the PHP application user. Temporary files created by a terminated process are not used as live indexes; a later invocation builds a new candidate.

### Use the Deployer recipe

The versioned application recipe is `resources/deployer/search.php`. It registers `docs:search`, which runs the build command followed by its read-only freshness check. Both commands run from `release_path`, using Deployer's configured PHP executable. The task requires the candidate release and never falls back to the active release.

The server-specific `deploy.php` is intentionally ignored by Git. Keep the search recipe import when creating or regenerating that local file:

```php
import(__DIR__.'/resources/deployer/search.php');
```

Keep the search task as an explicit deployment stage after dependencies, assets, and application optimization, and before migrations and release publication. PM2 starts Horizon after publication so its current-release path points to the new code. The relevant part of this application's sequence is:

```php
'deploy:vendors',
'npm:install',
'npm:build',
'artisan:storage:link',
'artisan:optimize',
'docs:search',
'artisan:migrate',
'deploy:publish',
'pm2:config',
'artisan:reload',
```

The gate is part of the task sequence rather than a hook. Disabling hooks does not skip it. An unsuccessful build stops before the freshness check; an unsuccessful check also stops deployment. In either case, the subsequent migration, PM2, publication, and reload stages do not run. The active release and its index remain available. The gate does not roll back tasks that completed earlier, including dependency installation or asset building in the candidate release.

Keep `bootstrap/cache/documentation-search.sqlite` release-local. Do not add it to shared files or directories. A failed candidate can be rebuilt using the existing idempotent command after correcting its prerequisites. To repair an index outside a pending deployment, run the Artisan commands directly from the intended release directory.

`DocumentationSearchDeploymentTest` loads the real recipe through Deployer with a disposable localhost fixture. It verifies command arguments, candidate working directory, repeated execution, and failure before publication with hooks disabled. The current-release symlink and artifact remain unchanged on either failure. The existing index feature tests verify the real Vue extraction, freshness checking, and atomic artifact publication.

Server process configuration and release activation remain owned by the deployment operator. There is no recurring index job to configure for repository-authored content.

## Follow the authoring contract

The extractor reads Vue syntax through `vue/compiler-sfc`. It does not execute component setup, evaluate arbitrary JavaScript, render Vue on the server, or start a demo.

- Write prose in normal Vue templates and imported authored Vue partials.
- Authored partials may forward static props and use ordinary default or named slots, including fallback slot text. Caller-owned slot text and notes in `CodeExample` are indexed. Runtime scoped slots require a shared semantic adapter, as already provided for `DocsTable` cells.
- Give every section a stable heading ID. `ProseSection` uses its existing `title` and `id` props; ordinary `h2` through `h6` elements use their existing `id` attributes.
- Keep code in `CodeExample` with a literal string, template literal, or `String.raw` template. Literal bindings and static props forwarded through partials are supported.
- Keep bound `DocsTable` columns and rows as literal arrays. Formatting in its cell slot does not change the searchable values. Ordinary authored HTML tables also work.
- Pass package requirements through the existing `page.requirements` metadata. They need no duplicate search data.
- Keep user-specific output and active behavior in the existing demo directories. Demo components, `data-docs-outline-exclude` regions, and explicitly marked `data-search-exclude` regions are excluded. Put a useful explanation and static example in the surrounding guide.

Package catalog cards and package header controls are presentation metadata; the corresponding registered overview already supplies their searchable title and description. Navigation helpers, link destinations, event handlers, classes, and copy-button messages are not content.
`SiteIcon` is presentation too. Its glyph names and decorative markup are excluded through one shared adapter, including aliases used by authored components.

The Front Awesome wrapper catalog supplies article content rather than package navigation metadata. Its shared `ComponentCatalog` and `CatalogOverview` adapters read the same `components/docs/front-awesome/catalog/components.json` data as the rendered status tags, Popover information, and overview cards. Component names, all three implementation states, purposes, upstream editions, and version notes remain searchable. Implemented tag targets must resolve to real authored section headings. Unavailable wrappers have no invented implementation anchor. Group examples remain ordinary static `CodeExample` content.

Unknown visible expressions, runtime prose directives such as `v-if`, `v-show`, and `v-text`, unsupported content-producing components, missing imports, import cycles, and duplicate anchors fail extraction. The same checks apply inside headings. Fix the source or extend the owning shared content adapter with behavior tests. Do not suppress the error by copying article text into search metadata or by excluding the whole guide. New authored Vue partials need no adapter or registration. A new shared component needs an adapter only when its visible content is generated from props rather than its authored slot.

## Search behavior

The shared public header opens search through its button or Cmd+K / Ctrl+K outside editable fields. Type between 2 and 120 characters. The dialog debounces requests, cancels obsolete work, reports loading and failures, and supports normal Tab and Enter link navigation. Escape closes it and returns focus.

`GET /docs/search?q=...` returns JSON with ranked page and section links and plain-text excerpts. The endpoint accepts literal Unicode words and prefixes, not SQL or advanced FTS operators. Punctuation separates tokens, making commands and identifiers searchable. It does not provide spelling correction, semantic embeddings, or a chat response. Results are bounded and page titles and headings receive greater weight than body text.

The public endpoint allows 60 requests per minute per rate-limit identity. It returns at most 12 results and three sections per page, so a long guide cannot occupy the whole result list. Responses are not cached or indexed by crawlers. An unavailable or incompatible artifact returns HTTP 503 with a generic message. Technical details stay in server logs. Run the index command from the correct release directory, inspect its exit status, and retry the search after it succeeds.

## Verify changes

```sh
php artisan test --compact tests/Feature/DocumentationSearchTest.php tests/Feature/DocumentationSearchIndexTest.php
npm test -- scripts/documentation-search.test.mjs resources/js/components/docs/search
php artisan docs:search:index --no-interaction
php artisan docs:search:index --check --no-interaction
composer ci:check
```

Verify a body-only term, a code identifier, and a table value. For example, `maintainer_ssh_key`, `circle-info`, and `phpstan.dist.neon` should lead to their actual guide sections. After adding, changing, or removing a page or shared partial, rebuild and confirm the new content replaces the old content. Test the header, keyboard focus, result navigation, and narrow layouts in the real application.

The implementation follows the official [SQLite FTS5 reference](https://www.sqlite.org/fts5.html), [PHP PDO SQLite API](https://www.php.net/manual/en/class.pdo-sqlite.php), [Vue SFC compiler API](https://github.com/vuejs/core/blob/main/packages/compiler-sfc/README.md), and [Reka Dialog API](https://reka-ui.com/docs/components/dialog).
