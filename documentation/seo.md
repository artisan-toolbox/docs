# Search discovery and page metadata

This guide explains how to maintain search discovery without a second page registry.
The application uses Laravel Head with Inertia and Vue. Vue SSR stays disabled.

## Add or change a page

1. Register the page in `PageSlug`, following its learning sequence. Use a nested slug when the page belongs below another registered page.
2. Set an accurate title and description in the page definition. Keep its source reference current.
3. Write the Vue content with shared documentation components and stable heading IDs.
4. Run the quality suite and build. Rebuild the local documentation search index and check its freshness as described in [Search](search.md).
5. Check the rendered breadcrumb, initial response metadata, and a client-side visit to the page.

The sitemap, visible breadcrumb, and breadcrumb JSON-LD follow the registered page automatically. Do not maintain separate URL or breadcrumb lists. An unregistered intermediate slug is not a page and receives no invented link. Titles come from the existing page definitions; sibling order continues to follow the enum.

The visible breadcrumb lives in `DocsLayout`, outside the authored article, search content, and page outline. `DocsBreadcrumbs` reuses the application's breadcrumb primitives, `DocsLink`, and Font Awesome separator. Its horizontal overflow remains keyboard accessible on narrow screens. Front Awesome supplies no documentation hierarchy API; the existing PHP registry owns that application-specific behavior.

## Metadata ownership

`APP_URL` owns the public origin. Laravel named routes own paths. Request host names and tracking query strings must not change canonical, sitemap, or structured-data URLs. A root URL with or without its final slash identifies the same home resource; Laravel Head renders its root canonical with a slash.

`AppServiceProvider` configures common Laravel Head defaults and static Inertia head globals. These include the site name, locale, favicons, manifest, theme colors, and 1200 × 630 social image at `public/images/brand/social-card.png`. Twitter uses Laravel Head's Open Graph image fallback, including alternative text. Do not add a parallel image configuration or frontend metadata manager.

`HomeController` supplies home metadata and `Organization` and `WebSite` schemas. `DocumentationController` supplies each page's metadata, `WebPage`, and `BreadcrumbList`. The visible trail and JSON-LD use `Documentation::breadcrumbs()`, with relative links for the UI and absolute links for structured data.

Use Laravel Head's installed schema builders and explicit `set('@id', ...)` identifiers. Add breadcrumb items individually so repeated labels cannot overwrite each other. Public schemas belong to the relevant response, not global defaults. Do not invent authors, ratings, publication dates, release versions, or a public search action for the JSON search endpoint.

The Blade document renders `@head`. Inertia's native `serverHead: true` integration adopts and replaces managed tags during client navigation and history visits. Keep Vue SSR disabled and do not add a second article renderer to Blade.

## Discovery endpoints

`GET /sitemap.xml` is the named `sitemap` route. It contains the named home route and every `PageSlug`, once, using XML escaping. It excludes aliases, authentication, admin screens, demos, JSON search, and static assets. It emits no `lastmod`, priority, or frequency values: there is no reliable per-page modification history to justify them.

`GET /robots.txt` is a Laravel response that advertises the named sitemap URL and permits crawling. Do not restore `public/robots.txt`, which would shadow the route at the web server. JavaScript and stylesheet assets remain crawlable so search engines can render the application.

An exact Nginx `/robots.txt` location must also forward missing physical files to Laravel. Verify the origin before evaluating a Cloudflare-managed response; content-signal comments alone do not advertise the sitemap. Follow [the Nginx procedure](nginx.md#forward-dynamic-robots-discovery-to-laravel) for the inspected server configuration and cache checks.

`PreventInternalIndexing` applies `X-Robots-Tag: noindex, nofollow` by route name to authentication, internal search, demo endpoints, QZ Tray connector APIs, Horizon, and Log Viewer. This includes successful responses, authentication redirects, and rendered validation or authorization errors. Route-name matching follows configured dashboard paths without excluding similarly named public guides. Authentication and authorization still control access; indexing directives are not access control.

Robots permits crawlers to fetch these URLs and observe their noindex response. A robots disallow would prevent that observation. Unknown routes still return their normal 404 status.

## Verify locally

Run from the documentation application:

```sh
composer ci:check
npm run build
php artisan docs:search:index --no-interaction
php artisan docs:search:index --check --no-interaction
```

`SearchMetadataTest` checks initial HTML for all registered pages, valid JSON-LD, social tags, hostile request hosts, tracking queries, renamed routes, and Inertia destination metadata. `SearchEngineDiscoveryTest` checks the complete sitemap, robots response, and internal response headers. Breadcrumb feature and component tests check hierarchy, labels, current-page semantics, and layout updates.

In a production-build browser session, verify a deep guide, its breadcrumb links, the landing page, and sign in. Use ordinary links and browser history. Confirm that each destination has one canonical and description, only its own schemas, and the expected robots directive. At a narrow width, check breadcrumb scrolling without page overflow. Inspect the social image and recent browser errors. These checks do not require signing in or sending an email.

## Verify after publishing

Local checks establish valid responses and browser behavior. They do not establish public crawlability, indexing, a rich result, or a ranking.

1. Fetch the published sitemap and robots endpoints. Confirm the canonical HTTPS origin and successful public asset responses.
2. Inspect home, a package overview, and a deep guide with Google Search Console's URL Inspection live test. Inspect the rendered HTML and screenshot for the actual heading, body text, code, navigation links, and breadcrumb.
3. Validate applicable structured data with Google's Rich Results Test. Valid schema does not guarantee a search presentation.
4. Submit the sitemap in Search Console and review indexing and canonical reports after crawling. Investigate reported exclusions rather than treating submission as indexing proof.
5. Check the published social image with the relevant platform preview tools. Platform caches can delay a changed preview.

The initial response contains metadata, structured data, and Inertia page data. The article body and its rendered links require JavaScript. Google can render JavaScript, but rendering may be delayed or fail, and other crawlers may not execute it. Keep assets accessible and use the live rendered-page inspection to assess the published application. Public indexing remains unverified until those checks run; this project does not promise identical indexing across crawlers.

## References

- [Laravel Head and Inertia](https://laravel.com/framework/docs/head#inertia)
- [Google sitemap construction](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google robots meta and response headers](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
