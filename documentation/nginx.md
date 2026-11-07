# Verify the documentation virtual host

Use this guide when the Laravel deployment succeeds but browser features or crawler discovery fail behind Nginx. The operator owns server changes and reloads. These snippets match the inspected ATB virtual host and shared `nginxconfig.io` includes; inspect the active configuration before applying them elsewhere.

## Allow the installed browser runtimes

The deployed Horizon dashboard uses Vue's runtime template compiler, which evaluates JavaScript through `new Function`. The QZ Tray ZPL preview initializes WebAssembly. The inspected policy permits neither operation:

```text
default-src 'self' http: https: ws: wss: data: blob: 'unsafe-inline'; frame-ancestors 'self';
```

Keep one enforcing Content Security Policy header. Adding a more permissive second header does not override the first policy. Changing Laravel middleware or adding an HTML meta policy cannot relax a restrictive Nginx or proxy policy.

The following Nginx map retains the existing policy for other virtual hosts, permits WebAssembly for ATB, and permits JavaScript evaluation only for ATB's Horizon path. It retains the existing source list; it is a compatibility adjustment, not a replacement security policy design. If `horizon.path` changes, update the path match too.

Create `/etc/nginx/conf.d/atb-content-security-policy.conf` inside the existing `http` configuration include:

```nginx
map "$server_name:$request_uri" $atb_content_security_policy {
    default "default-src 'self' http: https: ws: wss: data: blob: 'unsafe-inline'; frame-ancestors 'self';";
    ~^atb[.]dev[.]br:/horizon(?:/|[?]|$) "default-src 'self' http: https: ws: wss: data: blob: 'unsafe-inline'; script-src 'self' http: https: ws: wss: data: blob: 'unsafe-inline' 'unsafe-eval'; frame-ancestors 'self';";
    ~^atb[.]dev[.]br: "default-src 'self' http: https: ws: wss: data: blob: 'unsafe-inline'; script-src 'self' http: https: ws: wss: data: blob: 'unsafe-inline' 'wasm-unsafe-eval'; frame-ancestors 'self';";
}
```

The inspected first `server_name` is `atb.dev.br`. Using the original `$request_uri` preserves the path match after Laravel's internal rewrite to `/index.php`. The expression matches `/horizon`, its query string, and child routes, but not similarly prefixed documentation paths.

In `/etc/nginx/nginxconfig.io/security.conf`, replace only the existing `add_header Content-Security-Policy` directive with:

```nginx
add_header Content-Security-Policy $atb_content_security_policy always;
```

Keep the other security headers and file access rules. The inspected `/etc/nginx/nginx.conf` loads `conf.d/*.conf` in the `http` context before `sites-enabled/*`. The map must be loaded before using its variable. Inspect header inheritance if another location defines its own `add_header` directives, and check Cloudflare for any additional enforcing policy.

Back up the affected configuration before editing. After reviewing all changes, validate syntax with `nginx -t`. Reload through the operator's service procedure only after that succeeds. No application deploy or Horizon restart is required for a header-only adjustment.

Reload `/horizon/dashboard` and confirm its UI appears without an evaluation error. Reload `/docs/qztray` before selecting **Preview label**: a failed renderer initialization can remain attached to the current page instance. Confirm the Hello image appears. Inspect the actual document headers to confirm that ordinary documentation pages have `wasm-unsafe-eval` without JavaScript `unsafe-eval`, and that the Horizon response has its scoped exception.

## Forward dynamic robots discovery to Laravel

The inspected `/etc/nginx/nginxconfig.io/general.conf` contains an exact `/robots.txt` location with only `log_not_found off`. That location bypasses the Laravel fallback and returns 404 when the physical file is absent. Laravel owns this response through `RobotsController`; do not restore a static file containing a second sitemap URL.

Replace that location with:

```nginx
location = /robots.txt {
    log_not_found off;
    try_files $uri /index.php?$query_string;
}
```

This include is shared. Existing physical robots files still take precedence; virtual hosts without a file now use their application's front controller. Review that behavior for each consuming virtual host before applying the shared change. Keep the existing PHP location and application fallback intact. Validate Nginx syntax and reload through the same operator procedure.

First verify the origin directly from the server, using its configured Cloudflare Origin CA certificate:

```sh
curl --cacert /etc/nginx/ssl/cloudflare-origin-ca.pem \
  --resolve atb.dev.br:443:127.0.0.1 \
  --fail --silent --show-error https://atb.dev.br/robots.txt
```

The expected origin response is HTTP 200 and contains:

```text
User-agent: *
Allow: /

Sitemap: https://atb.dev.br/sitemap.xml
```

Then inspect the public URL. Cloudflare's managed robots feature may prepend content-signal comments and directives; those do not replace the expected sitemap line. If the origin is correct but the public response remains stale, purge only the cached `/robots.txt` URL through the operator's Cloudflare workflow and fetch it again. Keep the operator's crawler preferences unchanged.

The sitemap's unstyled XML message is normal. Verify HTTP 200, valid XML, the canonical HTTPS origin, and one URL per registered page. A correct sitemap does not establish rendered article indexing; follow [the SEO publication checks](seo.md#verify-after-publishing).

## Cache only fingerprinted build assets

The versioned recipes are `resources/nginx/immutable-assets.conf` and `resources/nginx/immutable-cache.conf`. They require Nginx 1.29.3 or later for native `add_header_inherit merge`; the inspected server runs 1.30.6. Do not remove that directive to make the recipe load on an older server: the local cache header would otherwise replace inherited security headers.

Copy `immutable-cache.conf` to `/etc/nginx/nginxconfig.io/atb-immutable-cache.conf` and `immutable-assets.conf` to `/etc/nginx/nginxconfig.io/atb-immutable-assets.conf`. In the ATB virtual host only, include the location rules after `security.conf` and before `general.conf`:

```nginx
include nginxconfig.io/security.conf;
include nginxconfig.io/atb-immutable-assets.conf;
include nginxconfig.io/general.conf;
```

Keep other virtual-host directives and includes in their existing order. An earlier generic static-file regular expression would take precedence over this recipe. The two asset locations share one cache policy. The font/SVG location also preserves the existing `Access-Control-Allow-Origin: *` behavior; other assets retain their existing CORS behavior. Native header merging preserves the virtual host's CSP, HSTS, and other security headers without copying their definitions.

Only direct files under `/build/assets/` with Vite's eight-character content hash and a supported static extension receive `public, max-age=31536000, immutable`. Unversioned images, HTML, JSON, manifests, login, logs, Horizon, and robots discovery do not qualify. Missing files return 404 rather than Laravel HTML, and the immutable header does not use `always`, so error responses do not receive it. Keep new output naming conventions synchronized with the recipe if the build configuration changes.

Reserve `/build/assets/` for Vite output. The rule checks the filename pattern; Nginx does not recalculate a file's content hash. Never place manually named mutable files or uploads in that directory. Vite emits a different asset URL when its content changes.

Back up the virtual host and any existing snippet before applying changes. Run `nginx -t`, then reload through the operator workflow. Verify actual origin responses for one JavaScript file, stylesheet, font, and WebAssembly file from the active build manifest. Each successful response must have one consistent immutable cache policy and retain the security headers. Fonts and SVGs must keep their CORS header. Check a missing fingerprinted file returns 404 without immutable caching; confirm `/`, `/robots.txt`, an unversioned brand image, and the Reverb virtual host retain their previous cache policies.

A graceful reload completes after its command returns. Wait for a fresh origin request to show the new policy before checking the full response set. Use a bounded readiness check, and restore the backup if the expected policy never appears. An immediate request can still reach an old worker.

Then verify public response headers. Existing CDN entries can retain their old policy until refreshed; newly emitted hashes use new URLs after deployment. Do not apply the year-long policy to all Cloudflare responses or purge unrelated cached content. Content-hashed files are replaced by new URLs, so normal deployments do not require a global cache purge.

Check origin and CDN error responses separately. The verified origin 404 has no immutable cache header. Cloudflare can apply its own negative-cache lifetime; the inspected public 404 responses use `max-age=14400`. This recipe does not change that CDN behavior.

## Verify the queue separately

A functioning Horizon dashboard and a running worker are different checks. The **Queue one job** button requires staff authorization and both server and browser configuration before any job is submitted. Follow [the disabled-button procedure](queues.md#diagnose-a-disabled-queue-button), then [verify a real completion](queues.md#confirm-a-queued-completion) and isolation between independent browser sessions.

## References

- [MDN Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy)
- [MDN script-src and WebAssembly](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src)
- [Nginx map context and matching](https://nginx.org/en/docs/http/ngx_http_map_module.html)
- [Nginx response headers and inheritance](https://nginx.org/en/docs/http/ngx_http_headers_module.html)
- [Cloudflare managed robots.txt](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)
