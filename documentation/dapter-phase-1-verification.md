# Dapter backend v2 documentation verification

This record covers the unpublished Phase 1 backend preview. It does not describe a new public release or completion of the Vue field-control phase.

## Beginner journey

The starting environment is an existing PHP 8.5 Laravel 13 application with Inertia 3, Vue 3.5.40 or later, and Ziggy 2.6.5 or later. A Dapter `1.x` checkout sits beside the application. The Installation page runs Composer first, then records `file:vendor/artisan-toolbox/dapter` before npm installation. The application retains its Laravel web session and CSRF middleware, exposes `dapter.data` through Ziggy, and excludes the source package from Vite dependency prebundling.

The overview's self-contained `Dapter.Quickstart` source explicitly permits public reads and provides 23 fictional notebooks. Its first observable result is Notebook 01 through Notebook 10. The Sources and Listing guides execute that source and paging behavior through the real public route. The Options and Access guides establish declarations and policy before more advanced field usage. These existing v1 examples continue to pass their HTTP and component checks.

The backend field journey continues through search, ordering, declared choices, typed values, and inherited declarations. Its fixed raw-v2 demos define four fictional records and require reader action before any request. Source registration is optional and follows conventional source discovery. The v2 protocol reference documents the complete delivered grammar separately from future design contracts. The Vue `DataAdapter` and `useDataAdapter` remain v1.

## Reuse and contracts

The field demos consume the installed public Dapter source contracts, immutable `StoreOptions`, repeatable attributes, source aliases, driver registry, and HTTP endpoint. They do not implement a second query engine. `FieldRecords` contains isolated fictional data. No reader account, role, application table, external service, queue, or broadcaster is changed.

Presentation reuses `DemoFrame`, `CodeExample`, and the existing raw Inertia HTTP transport. The installed public Front Awesome exports were inspected. `Button` supports actual click and disabled state, while `Spinner` and `Tag` fit request status and HTTP results. Each guide mounts at most four fixed scenarios. An additional empty-selection button belongs to the null filter's own Reject-policy example. There is no new presentation dependency in Dapter.

The canonical fixture file preserves empty JSON objects, boolean false, numeric zero, null, and fractional values. HTTP tests send original object-preserving JSON instead of converting empty objects to PHP lists. They caught the active null-only filter normalization failure before it was corrected in the package. The same source now returns its null matches successfully. Registered driver examples add an observable driver marker, so conventional fallback cannot impersonate a successful custom factory selection.

Reflection discovers public `StoreOptions` methods, PHP declaration attributes, configuration keys, generator options, and both public registry APIs. The existing TypeScript discovery still covers frontend props and factory overloads. The coverage command runs each linked backend and frontend behavior file, rather than treating a registry entry as execution evidence.

The design pages retain advanced operation, Resource, identity, and channel contracts as proposals. The current backend v2 subset reports unidentified records and a null channel. Native source order stays opaque in the response. Selected effective order uses `kind: terms`, while editable requested order keeps `kind: fields`. The preserved v1 endpoint keeps its original response shape.

## Dependency refresh

The root task ran the compatible Composer refresh before npm. The remote Dapter reference changed from `9871fd5` to `3618599`. Other targeted Composer versions were already current. npm resolved `@vue/test-utils` 2.5.1 to 2.6.0, Playwright 1.65.0 to 1.65.1, and Ziggy 2.6.5 to 2.7.0, with compatible transitive updates. No constraint was relaxed and no local branch was described as a stable release.

For actual implementation verification, the root task installed the local Dapter package through a temporary Composer path manifest. Its vendor directory points to the workspace source. A public-contract parity regression also exposed a stale npm copy whose future-version probe still sent version 2 while Composer supplied version 3. Refreshing the copied package makes that regression pass. The Installation guide requires a Vite restart after copied-package refreshes because the active module cache can retain older bytes.

The temporary manifest and lock were removed from the documentation repository and archived in the workspace audit directory. The canonical Composer lock retains portable remote locations. The installed local vendor path is development-only wiring, not a published package release.

## Executed checks

The focused authoring checks passed before root review. The final results below include the review fixes and the complete application checks.

| Check                                         | Result                                                                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dapter:demos:check`                  | All 47 discovered settings covered. 93 HTTP and backend tests passed with 898 assertions. Six frontend demo files passed 79 tests.          |
| New field HTTP checks                         | 28 tests passed, including all 24 primary scenarios, empty-list rejection, zero-match bounding, and unchanged v1 behavior.                  |
| Dapter content and fixture-page suites        | 43 tests passed after current scope claims were synchronized. The coverage regression suite adds seven passing checks.                      |
| Documentation registration and fragment tests | Six tests passed with 386 assertions.                                                                                                       |
| `npm run types:check`                         | Passed.                                                                                                                                     |
| PHPStan                                       | Zero errors with `--debug`. The default worker process could not open its local TCP listener under the sandbox.                             |
| `npm run build`                               | Passed.                                                                                                                                     |
| Search index build and `--check`              | Passed and current.                                                                                                                         |
| New field browser script                      | Passed all 24 primary scenarios and the additional Reject-policy request in four sessions at 1440 and 390 pixels, in light and dark themes. |

The browser checks exercise actual HTTP responses, request-forgery tokens, exact outgoing selections, expected IDs, base and filtered counts, unidentified metadata, Reset, no automatic reads, no horizontal document overflow, and no browser errors. Screenshots and session summaries are under ignored `storage/app/browser-verification/dapter-fields`. The mobile dark search guide was visually inspected after execution. Chromium required an unsandboxed local browser process because the sandboxed launch aborted.

The complete `npm run test:browser` chain passed with production assets. It covered listing, authority, protocol, source boundaries, the Front Awesome catalog, application and sign-in flows, printing, localization, preferences, and all field scenarios. Listing verified 16 scenarios, 54 pages, and 539 decoded rows. Authority, protocol, and source-boundary checks each passed four sessions. The Vite hot file was restored after the run. The earlier protocol failure exposed stale copied contract bytes and a stale Vite module graph. Reinstalling the Composer-delivered npm package and restarting the actual TypeScript Vite configuration corrected both. A separate application readiness fixture requires hashed production module URLs, so its full verification used built assets rather than HMR.

The native package journey separately measured SQLite 3.45.2, MySQL 8.4.11, and PostgreSQL 18.6. The field guides record the tested collation and null-order differences rather than claiming identical comparisons across engines. That journey is package-owned automated evidence, not a simulated browser response.

## Final root verification

| Check                                | Observed result                                                                                                                         |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Dapter `composer test`               | 235 PHP tests and 1,327 assertions passed. PHPStan reported zero errors, Pint passed, and PHP type coverage was 100%.                   |
| Native backend journey               | 76 tests and 896 assertions passed across arrays, Collections, SQLite, MySQL, and PostgreSQL.                                           |
| Dapter `composer quality:check`      | All six configured checks passed, with none skipped.                                                                                    |
| Dapter `npm run release:build`       | 191 runtime tests and four type assertions passed. ESM, declarations, source and built consumers, and the installed npm archive passed. |
| Dapter Composer distribution         | All 75 PHP source files and the exact consumer skill were present. Native test configuration was excluded.                              |
| Documentation `composer test`        | 783 PHP tests and 73,111 assertions passed. Pint and PHPStan passed.                                                                    |
| Documentation `composer ci:check`    | Rector and all six configured quality checks passed, with none skipped.                                                                 |
| Documentation `npm test`             | 1,099 tests passed across 90 files.                                                                                                     |
| Documentation `npm run test:browser` | The complete built-asset chain passed, including all 24 new field scenarios in four viewport and theme sessions.                        |
| Documentation build and distribution | Build passed. The canonical Composer lock uses portable package locations.                                                              |
| Contributor standards                | Dapter standards 1.0.6 and documentation standards 1.1.0 both reported zero pending files. No shared standards were changed.            |
| Boost discovery                      | The consuming documentation application discovered `dapter-development` from `artisan-toolbox/dapter`.                                  |

Independent review reproduced and corrected three defects. Invalid nonnull choices for a null-only filter now return validation 422 before source work. Unsupported native UUID text operations and JSON ordering fail configuration before counts. Replacing a retained read or write PDO invalidates the driver before catalog or listing queries. Each fix has a focused regression test. A second independent review reran the original probes and found no unresolved implementation defect. Its guidance correction preserves null-only `IS NULL` support on existing native columns.

The Phase 1 roadmap tasks are complete in the local preview. Phase 2 frontend controls and later capabilities retain their separate gates. The native CI workflow is configured but was not run on GitHub in this task. No release, deployment, push, or merge was performed. The review used the configured GPT-6.1 Sol model throughout, so independent reviews did not add cross-family model diversity.

## Principles applied

Model the Domain kept fixed requests and expected outcomes in one case registry. Test Behavior, Not Implementation drove public HTTP requests and actual browser controls. Prove It Works required observed server bytes, returned IDs, counts, and browser state. The technical-writing and prose-review skills kept working how-to guides separate from proposed explanations.
