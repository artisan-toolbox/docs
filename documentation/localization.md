# Laravel-source localization documentation record

## Scope and source ownership

This record documents the optional localization APIs included in Front Awesome `1.0.0-alpha.2`. The how-to serves application developers adding translations to an existing Laravel application. The reference describes configuration and browser contracts. The public guide remains separate from this contributor record.

Laravel PHP and JSON files own translated text. Front Awesome exports a versioned JSON resource and a sibling Vue I18n message-key declaration. The documentation application consumes `createLocalization`, `useLocalization`, and `Language` through Composer-delivered frontend exports. It does not copy the locale controller, message adapter, language catalog, or native Web Awesome registry.

The live demonstration owns only example inputs, layout, and restoration of the entering HTML language. It uses `Language` from `@artisan-toolbox/front-awesome/components`, `Button` from the public Web Awesome barrel, and `useLocalization` from `@artisan-toolbox/front-awesome/localization`. The article remains English. Leaving the page restores its entering `html.lang`. No printer, server locale, or saved language preference is changed.

## Beginner journey audit

The learner starts with an existing Laravel 13.36 or later within 13.x, Inertia 3, Vue 3.5, Vite, PHP 8.5, and supported Node application. Front Awesome remains an alpha preview. The installed Composer version is displayed through shared package metadata. Localization additions are included in the published `1.0.0-alpha.2` preview.

The existing overview and dedicated Installation guide retain their Composer-before-npm procedure and first Button example. Its observable result remains the Hello from Front Awesome button. Localization remains optional and does not add an exporter prerequisite to ordinary wrappers.

The ordered localization path is Installation, Web Awesome setup, Vue integration, then Translate the browser from Laravel. Its child reference follows the how-to. The registry places localization before printing. `PageSlug` owns this order and ancestry. No second frontend menu was introduced.

The first localization example starts with a Blade HTML language and ordinary `lang/en/app.php` messages. The global application switch includes the entire language directory by default. File and key filters, including PCRE path or basename rules, are optional. Vite exports before scanning frontend imports. The existing Vue plugin installs the generated catalog. The first result is `Welcome, Ana!` and `2 documents` in English, followed by translated controls and Intl-formatted values after selection. Before standalone clean-checkout `vue-tsc`, the learner runs the exporter. The next guide is the localization reference, followed by printing when the application needs it.

## Reuse and writing decisions

The new pages use the shared `PackageGuideHeader`, `ProseSection`, `CodeExample`, `DocsTable`, `DocsLink`, and `DemoFrame`. The package's public renderless selector provides locale actions. Application-specific code restores the entering language because the documentation content is English, which is a site concern rather than a package locale policy.

The installed `atb-documentation` and `atb-package-development` skills supply contributor standards. Existing technical-writing and prose-review guidance supplies Diataxis and sentence review. No external skill was installed. Public API guidance was added to the owning `front-awesome-development` Boost skill instead of generated consumer copies. The package README needs no change because optional localization does not alter its concise installation or first wrapper example.

Model the Domain kept locale state in the package controller and displayed the public descriptors rather than introducing a parallel selector state. Test Behavior, Not Implementation led the demo tests to assert rendered translations, browser HTML, and Intl output through public controls. Prove It Works required the actual registered routes, frontend public plugin, and search artifact checks.

## Dependency refresh

The parent task owns Composer and npm manifests, lockfiles, copied frontend packages, and the consuming Vue/Vite installation. Its compatible Composer refresh resolved Laravel Framework 13.40 to 13.42, Fortify 1.41 to 1.42, Horizon 5.50.1 to 5.51, and Serializable Closure 2.1 to 2.2. npm refresh and complete package/application checks are recorded by the parent task. This delegated documentation change does not modify dependency constraints or lockfiles.

## Verification

- The PHP 8.5 executable at `/Users/allancarvalho/Library/Application Support/Herd/bin/php85` ran `vendor/bin/pest tests/Feature/FrontAwesomeLocalizationDocumentationTest.php tests/Feature/DocumentationJourneyTest.php --compact`. All 12 tests passed with 61 assertions. They cover actual Inertia routes, source files, package identity, ancestry, and learning order.
- `npm test -- resources/js/components/demo/front-awesome/localization/LocalizationDemo.test.js resources/js/components/docs/FrontAwesomePages.test.js` passed 33 tests across both files. The demonstration uses the public plugin, selector, composable, and Intl format configuration. It verifies HTML updates, three locale outputs, external attribute changes, and restoration on unmount.
- `php artisan docs:search:index --no-interaction` successfully published the content-derived search artifact after adding the registered pages. Its `--check` mode reported the artifact current after formatting. Queries for `include_regex`, `retryWebAwesome`, and `implicit choice` returned the expected reference sections for configuration, native loading, and Laravel syntax.
- `vp fmt` formatted the affected localization and shared guidance files. Targeted Pint checks passed for the new page definitions, registry, and journey tests.
- `scripts/test-localization-browser.mjs` provides browser verification at desktop and mobile widths. It checks translated messages, number/date output, direct HTML aliases, no saved preference or implicit requests, and language restoration after Inertia navigation. Run it after the parent task builds the consuming application.

Complete frontend, PHP, build, browser, package distribution, and Boost discovery validation remain owned by the parent task. This record does not claim that metadata validation proves consumer discovery or a published release.

## Final consumer verification

The compatible npm refresh installed Vue I18n 11.4.18 through Front Awesome and retained the declared runtime/test constraints. It updated concurrently 10.0.6 to 10.0.7, @rolldown/pluginutils 1.0.1 to 1.1.0, @testing-library/user-event 14.6.8 to 14.6.9, ansi-regex 6.5.0 to 6.6.0, slice-ansi 10.0.0 to 10.0.1, commander 15.0.0 to 15.1.0, and ws 8.22.1 to 8.22.2. npm reported five moderate advisories in the resolved dependency graph. No forced major updates were applied.

Composer ran before npm. A normal npm install retained stale file-dependency copies. The final refresh used npm ci with install-links after restoring every Artisan Toolbox dependency and resolved lock path to file:vendor/artisan-toolbox. Inspection confirmed the installed locale parser and printing workflow flags match their public package sources. The local Vite process was restarted with a valid loopback URL and an explicit supported PHP executable. Its backend remains the existing Herd application.

The actual first application example passed through the real Laravel exporter, a clean Vite build, and createLocalization. The generated app.welcome key rendered Welcome, Ana!, and app.documents with count 2 rendered 2 documents. Both generated resource files are ignored by Git in the documentation application.

Final validation passed as follows.

- Front Awesome composer test passed 36 tests and 135 assertions, PHPStan, Pint, and 100 percent source type coverage. Its npm check and production build passed. The unit suite passed 265 tests.
- The combined frontend coverage run passed 512 tests. Two unrelated licensed-component cases remained skipped in the Core configuration. Coverage measured 94.71 percent statements, 90.83 percent branches, 90.64 percent functions, and 95.52 percent lines. The localization directory measured 97.12 percent lines. These are observed coverage values, not performance claims.
- A temporary local link to the documentation application's installed licensed Web Awesome Pro distribution allowed the Pro typecheck and all six localization/printing-localization browser cases to run. All passed. The link was removed afterward. This verifies the changed integration, not every Pro component scenario.
- Real theme consumer and peer-installation checks passed. Maintainer quality checks passed in both repositories, each with six checks run and none skipped.
- The documentation PHP suite passed 490 tests and 33,943 assertions. Its JavaScript suite passed 673 tests. Typecheck, formatter/linter, production build, standards synchronization, and shared demo checks passed.
- The complete documentation browser chain passed for the component catalog, application, isolated sign-in workflow, printing, and localization. The localization script exercised six selections at desktop and mobile widths, external HTML aliases, actual Intl formatting, and language restoration after navigation. The harness isolates the site's existing realtime socket and Boost development-log endpoint, while still rejecting any new application action request from selection. Screenshots at 1440 and 390 pixels were visually inspected.
- The search artifact was regenerated from current content and its check passed. Existing learner routes and the dedicated Installation page remain available.
- Composer archive inspection found installed dependencies in working-tree archives. The package export rules now exclude node_modules, vendor, build, and coverage. A new 205-file source archive retained all three language catalogs, frontend runtime, generated English compatibility messages, and the consumer skill. Boost in the consuming Laravel application discovered front-awesome-development among its 16 available skills. Its description and examples match a Laravel-source language-selector request and do not apply to unrelated backend-only work.

Independent contract review reproduced and corrected numeric JSON key handling, exact dotted PHP key precedence, application JSON keys that imitate the package namespace, and legacy locale canonicalization. Regression checks failed before the corresponding fixes and passed afterward. The separate source locale still controls Laravel plural selection. The configured application fallback is followed by English for package text. Existing printing behavior from the concurrent printing task was preserved through an explicit file-ownership handoff.

Native Web Awesome Portuguese remains its upstream pt catalog, which contains European wording and some untranslated strings. Front Awesome's own package text has dedicated pt_BR translations. Plain-text t calls are supported; Vue I18n VNode interpolation and PHP object or closure replacements are outside this adapter's contract. No package was published or deployed.

## Application fallback environment follow-up

The default translations.fallback_locale now reads env('APP_FALLBACK_LOCALE', 'en'). The configuration reference, consumer skill, and changelogs use the same default. Isolated Laravel command regressions verify an unset variable, es, and pt_BR, including canonical pt-BR export. The configured cases failed before the change and pass afterward. The full package PHP suite passes 39 tests and 138 assertions with PHPStan, Pint, and complete source type coverage. The affected documentation checks pass 33 tests, and its production build and search-index check pass.

## Selectable locale follow-up

The localization how-to and reference now distinguish selector choices from internal catalogs. The default `translations.locales` value is `['*']`. Discovery includes Front Awesome package and published override languages, plus application locale directories, JSON files, and other namespace overrides when `include_application` is enabled. An explicit `['en', 'es']` list offers only English and Spanish in that order. Internal `en`, `es`, `pt_BR`, and configured fallback catalogs remain available. Application messages require the global opt-in and are exported only for selected languages and the configured fallback. Empty lists, mixed wildcard lists, and partial globs are invalid.

The generated version 1 JSON example includes `availableLocales`. The reference and consumer skill preserve compatibility with older version 1 catalogs without that field, which offer all catalog locales. They describe canonicalization, unknown and duplicate choice rejection, and the restriction of `setLocale` to selectable languages. HTML language remains authoritative when the server selects a hidden locale, including for native Web Awesome. The `APP_FALLBACK_LOCALE` default and existing native Portuguese limitations remain unchanged.

The learner path remains an existing Laravel 13, Inertia 3, and Vue 3.5 application, Composer installation before npm, the dedicated Installation page, Vue plugin registration, Blade language setup, application export opt-in, Vite export, and the public composable example. The existing example defines `Ana` and count `2`, with expected results `Welcome, Ana!` and `2 documents`. The new ordered allowlist example expects English then Spanish without Brazilian Portuguese in the selector. The next destination remains the localization reference. Existing shared CodeExample, ProseSection, DocsTable, and public Language APIs are reused. No duplicate application implementation was added.

Targeted Vite Plus formatting passed for both localization pages. Both SFC scripts and templates parsed and compiled through the installed Vue compiler. The existing documentation Feature test was attempted with the default `php`, but that Homebrew PHP executable could not start because `libtidy.58.dylib` is missing. No tests were changed for these copy-only edits. The coordinating task owns supported-PHP test execution, dependency refresh, generated consumer copies, complete validation, and browser verification for the implementation. Those outcomes must be recorded before considering the follow-up complete.

The locale-selection follow-up passed the complete package PHP suite with 45 tests and 171 assertions, PHPStan, Pint, and complete source type coverage. All 272 frontend unit tests, seven localization and printing browser tests, package checks, and the package production build passed. The documentation passed 490 PHP tests, 673 frontend tests, type checking, its production build, and six real browser locale selections. Search indexing was regenerated and checked. Independent review found no remaining flags and reran eight relevant PHP and eight frontend cases. The dependency refresh stayed within the declared constraints and updated Guzzle, its PSR-7/promises dependencies, Laravel Pint, Reverb, and Collision; npm ci then refreshed the Composer-delivered frontend copies.
