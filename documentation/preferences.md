# Preferences integration verification

This record covers the unreleased Front Awesome source preview integrated on November 10, 2026.
It supplements the public Preferences guides and does not describe a published stable release.

## Reader journey and reuse

The starting environment is a Laravel 13 application with PHP 8.5, Inertia 3, Vue 3.5,
sessions, Vite, and the Composer-installed Front Awesome preview. Composer installation
precedes npm installation through `file:vendor/artisan-toolbox/front-awesome`.

The existing dedicated Installation page remains the first package guide. Vue setup and
Laravel-source localization precede Preferences. The Preferences setup page explains the
web middleware, Blade prepaint directive, initial Inertia prop, and frontend installation
before its runnable selector example. Appearance, Language, Timezone, and Currency task
guides follow that setup, with storage and API reference last. Both translation guides
link to the language preference procedure.

The documentation application consumes public `createPreferences`, `createLocalization`,
`usePreferences`, and renderless selector exports. It installs preferences before
localization and retains its existing Mosaicast transport and toast setup. Its appearance
composable is now a thin adapter for package state, needed by the existing responsive
header and brand image. The previous cookie middleware, localStorage persistence, and
duplicate prepaint script were removed. Documentation prose stays English while package
UI and formats follow the saved language.

The first working example uses the default session store. Changing a selector sends one
Inertia PATCH and returns to the same page. A reload retains the selected preference.
The example preserves component input, scroll, query parameters, and the fragment.
No user model or application database migration was applied for this integration.

## Public contracts and decisions

`PreferencesStore` has Request-aware getters and setters for appearance, locale, timezone,
and nullable currency. `FrontAwesome::setPreferenceStore()` selects a custom implementation
or an authenticatable model implementing `HasPreferences`. The model trait writes only
the selected field, locks a fresh row on its own connection, and preserves unrelated
JSON bytes, including numbers beyond PHP integer precision. These narrow updates do not
fire model save events or alter timestamps.

`preferences.key` names the JSON column, shared Inertia property, and session namespace.
`preferences.guard` selects the same account for page reads and endpoint writes when an
application uses a nondefault authentication guard. Default selection remains the current
request guard. Guest preferences do not automatically overwrite account preferences.

The middleware shares selectable locales, timezone identifiers, currency codes, and four
resolved values on every Inertia response, including partial responses. Laravel source
locales retain their identity. The frontend canonicalizes browser aliases and maps locale
writes back to the server identity. The application locale is restored after the request,
including exceptions. Application and database timezone settings remain unchanged.

`toPreferenceTimezone()` returns a Carbon copy. Native Vue I18n named formats use
`d(value, 'preference')` and `n(value, 'currency')`. Null currency produces decimal output.
Explicit application formats and later native Composer additions remain intact. Unkeyed
native date and number formatting retains Vue I18n behavior. Appearance controls DOM
theme classes and is not a Vue I18n option.

Currency validation uses 178 codes from the SIX List One snapshot published September 17, 2026. The codes were independently compared with the official XML. There is no runtime
network request or required PHP Intl extension. Standard Laravel empty-string normalization
also permits an empty currency form field to resolve to null.

Both generators preserve existing files. The user installer produces a reviewable nullable
JSON migration without running it or editing a model. An explicitly configured model
connection is retained. A model inheriting the default connection also inherits the deployment
default when the migration runs. Scaffolding remains possible before the database exists,
with a schema-inspection warning. Table and column names are fixed in the generated file.

## Verification

The complete package PHP validation passed 164 tests and 525 assertions, PHPStan, Pint,
and 100 percent source type coverage. The analysis and type-coverage scripts now request
512 MB explicitly because the previous 128 MB process limit interrupted analysis.
Frontend validation passed 296 unit tests, lint, formatting, types, generated-resource
checks, and the production consumer build. Chromium passed 248 tests with two existing
licensed-runtime cases skipped in the Core configuration. Real base and optional PrimeVue
theme consumers and peer installation checks passed.

Package tests cover real request-forgery rejection, account and guest isolation, alternate
guards, validation before custom setters, session regeneration and invalidation, locale
restoration, already-resolved framework services, partial Inertia props, middleware priority,
safe redirects, Carbon copies, JSON number preservation, and overlapping SQLite writers.
Independent Astra review reproduced defects before their fixes and reran the regressions.

The documentation suite passed 509 PHP tests with 37,933 assertions and 670 JavaScript
tests. Formatting, static analysis, frontend types, and the production build passed.
Two real browser sessions at 1440 and 390 pixels verified locale negotiation, all four
preferences, null currency, native Vue I18n output, reload persistence, scroll and component
state, query and fragment retention, forged-request rejection, network failure recovery,
and browser history. Both screenshots were visually inspected.

The complete documentation browser chain also passed the component catalog, application,
isolated sign-in workflow, printing, localization, and preferences. Maintainer checks passed
in both repositories with six checks run and none skipped. Shared contributor standards,
demo synchronization, and the regenerated search index checks passed.

Generic browser scenarios that assert English native labels now declare `locale: 'en-US'`.
Without an Accept-Language header, using the laboratory's application locale is intentional.
Request-forgery verification uses a foreign-origin request without a token: Laravel 13
also accepts verified same-origin metadata, so a same-origin fetch without a token is not
an appropriate rejection test. Scroll is measured when the Inertia visit starts, after
the browser has positioned the clicked control.

The Composer source ZIP retained preference routes, PHP modules, currency data, all four
frontend components, language files, and the consumer skill while excluding installed
dependencies and generated build output. It contained 237 entries. The consuming Boost
installation discovered 16 skills, including `front-awesome-development`. That skill now
covers preference setup and storage. Its package-specific description applies to a request
for a saved language selector, not to an unrelated backend-only feature. The existing README
remains a concise installation and button example; the detailed feature belongs to central guides.

## Dependency refresh and limits

Compatible Composer updates were attempted for Artisan Toolbox packages, Laravel runtime,
Inertia, and PHP quality tools. No further lockfile version changes were needed in this
follow-up. npm update was attempted for the main frontend runtime and test dependencies
within existing constraints. Composer-delivered frontend copies were refreshed through
`npm ci --install-links`, followed by a Vite restart. No constraint was relaxed or forced.

The online npm audit reported five moderate development dependency paths through
`@vue/test-utils`, `js-beautify`, `editorconfig`, `glob`, and `minimatch`. Its suggested forced
change falls outside the declared test-utils constraint. No forced downgrade or dependency
override was applied. Offline installation reporting zero findings does not replace this
online audit result.

SQLite migrations and concurrent persistence were executed. MySQL, MariaDB, PostgreSQL,
and SQL Server migration checks compile their installed Laravel grammars; running those
database engines remains outside this verification. Native whole-session writes can race
across tabs unless the host enables suitable Laravel session blocking for all participating
routes. Browser serialization alone does not provide that guarantee. Nothing was published,
deployed, committed, or migrated against the application's user table by this task.

## Full change review follow-up

The subsequent review covered the complete package and documentation working trees,
including staged changes, source moves, installation workflows, printing, and published
dependency contracts. No merge-conflict entries or source conflict markers were found.
Two obsolete staged paths were removed after their replacements had already moved into
the feature modules. Negative TypeScript fixtures and legal notices remain intact.

Five behavior defects were reproduced and corrected:

- The preference-store generator accepted reserved PHP type names and the PHP 8.5 **PROPERTY** magic constant, then wrote invalid PHP. Its leaf-name validation now checks the native PHP token as well as semantic reserved types.
- Recursive configuration merging replaced an explicit empty locale list with wildcard discovery.
- PHP accepted locale aliases that collide under JavaScript Intl canonicalization and replaced the previous output.
- Supported early Inertia 3 releases could restore stale preferences from an active prefetch after a successful write.
- The default PDF preparation bridge dropped nested PDF request headers before fetching an authenticated resource.

The locale exporter now uses one shared JavaScript canonicalizer before either output
file changes. Node.js 24.11 and subprocess execution are required only on the asset/export
host. The configured `translations.node_binary` or `--node` option selects the executable;
Vite passes its own executable. Request middleware remains PHP-only. Cached and history
navigation reconciles the complete server page so translated PHP props also refresh.
Explicit `usePreferences().refresh()` remains a preferences-only partial reload.

After these fixes, package validation passed 188 PHP tests with 582 assertions, 304
frontend unit tests, PHPStan, Pint, and complete source type coverage. The Core coverage
run passed 552 tests with two existing licensed-runtime cases skipped. V8 reported
2,127 covered lines out of 2,282, or 93.2 percent, for the configured frontend source set.
This includes build-tool source that executes through PHP integration tests rather than
inside the instrumented browser process. It is not a claim of PHP runtime coverage.

Maintainer's six checks passed again in both repositories. The documentation retained
509 PHP tests and 670 JavaScript tests. Rector and both production builds passed. The
first documentation build needed network permission to fetch the configured Bunny fonts;
its DNS failure in the restricted environment was not a source-code defect. Catalog browser
checks now have a 30-second default timeout and optional `DOCS_BROWSER_TRACE=1` route
diagnostics instead of an unbounded state wait.

### Distribution remains blocked by unpublished APIs

The local Maintainer result does not make the remote workflow installable. The current
development Composer lock contains absolute workspace package paths and fails the
existing distribution gate. An isolated resolution with a clean `COMPOSER_HOME` produced
a portable candidate, but the resolved public artifacts do not provide the required APIs:

- Front Awesome `1.0.0-alpha.1`, commit `a55e06f`, lacks the printing and Web Awesome component subpaths used by the site.
- QZ Tray `1.3.0`, commit `2f8687f`, lacks `preparePrintDocument`, `renderPrintRequest`, their document types, and the PHP receipt writer.

That candidate was not integrated as a falsely working lock. Release QZ with the needed
APIs first, align Front Awesome's optional npm peer and Composer development minimum
with that release, then release the matching Front Awesome preview. Update the site's
minimum versions and regenerate both locks from those real releases. Finally verify an
isolated clean installation and the complete workflow. Keep the distribution check enabled.
No publication or invented version/reference is part of this review.
