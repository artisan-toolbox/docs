# Dapter Vue preview verification

This record covers the unpublished Phase 2 Vue experience. Protocol 1 remains the default. Global handlers, actions, multi-order, cursor paging, and live updates are outside this change.

## Beginner journey

The starting environment is an existing PHP 8.5 Laravel 13 application with Inertia 3, Vue 3.5.40 or later, and Ziggy 2.6.5 or later. Installation connects the sibling Dapter `1.x` checkout through Composer first. It then records `file:vendor/artisan-toolbox/dapter` and installs that frontend. The required Vue plugin, Dapter prebundling exclusion, web session, CSRF middleware, and named route precede listing examples.

The overview quickstart remains source-only protocol 1. Its fictional public Collection returns Notebook 01 through Notebook 10. Sources and Listing precede field declarations. Existing raw protocol 2 demos remain executable backend references. Their scope text now points to explicit protocol 2 Vue controls.

Three focused how-to guides follow composable ownership in the registry. Build declared Vue controls uses one composable owner, a child borrower, and two bound presentations. Its first result is Notebook 10 and Notebook 2 in both a table and a card grid. Search, false, zero, and selected null converge on Pencil case. A complete paper snapshot clears earlier criteria and selects size 4. Reset requests server defaults.

Validate rows and definitions separately keeps the category column while removing category operations. Save catalog navigation in the URL gives reading and comparison independent criteria, namespaces, and scroll regions. Every frame requires an initial start action and exposes sources, status, errors, and disposal. The navigation frame uses native Inertia `useRemember` for that reader choice because history restoration remounts the page. Its owners can then restore across Back and Forward. A full browser reload returns the frame to Start; starting again restores both URL namespaces. Dispose clears the remembered choice. Wire grammar remains in the protocol reference. Proposals and roadmap progress retain their separate pages. No existing URL or fragment moved.

## Reuse decisions

The public `DataAdapter` and `useDataAdapter` exports own requests, criteria, URL state, and lifecycle behavior. The documentation adds no controller or query engine. `Dapter.VueCatalog` declares public options and reuses the isolated four-record `FieldRecords` Collection. It changes no account, authentication state, or application record.

Presentation consumes public Front Awesome `Button`, `Input`, `Select`, and `Option` exports. Their click, model, disabled, and label contracts fit the controls. `DemoFrame` owns resizing and source disclosure. `CodeExample` displays exact state. Ordinary table, list, and region elements preserve native semantics. The card grid presents the same accepted records, without another local query pipeline.

The composable decoder narrows name search to contains while preserving scalar filters. The source-owned decoder removes other fields. Row validation remains independent. The shared consumer skill and README are reviewed by the frontend owner in this task.

## Verification design

`DapterVueDemoTest.php` executes the public endpoint and checks the exact initial envelope used by component tests. It covers search combined with false, zero, and null, complete replacement, source-only reset, and rejection of string zero for the numeric choice.

`VueDemos.test.js` checks reader-controlled mounting, one shared initial read, definition narrowing, debounced search combined with order, scalar preservation, replacement and reset, and disposal cancellation. Mocked component transport isolates wiring. HTTP and browser tests establish backend behavior.

Discovery follows the public `Omit` alias for composable options and discovers field capability members. The registry links all five new source props and corresponding composable options to executable examples. Factory coverage remains derived from public overloads. The page-preservation option is discovered from its owning public declaration and exercised against real offset reads. Browser artifact links must resolve to executable files. A consumer regression compares the complete delivered TypeScript and Vue runtime file sets and exact bytes between Composer and npm. It caught a newly formatted source file in a stale copied package during this task.

`test-dapter-vue-browser.mjs` uses the actual public endpoint and session CSRF headers. It checks both presentations, scalar values, replacement and reset, definition narrowing, reload scroll preservation, page scroll reset, independent namespaces, Back, Forward, and reload. It repeats at 1440 and 390 pixels in both themes and stores screenshots and summaries under ignored storage.

The navigation guide states the native Inertia limitation. A dispatched client visit can publish an older URL briefly before reconciliation. An already dispatched push can also leave a corrected history entry. The public SDK cannot atomically cancel or erase that accepted entry. The guide does not claim public cancellation or rewriting of encrypted history internals.

## Dependency refresh

The root ran a compatible Composer refresh before npm. A dry run exposed the proposed replacement of the local Dapter checkout, so the final dependency resolution used `--no-install --no-scripts`. Composer reported nothing to modify in the lock file and no security advisories. The remote replacement was not applied. The local vendor path remains explicit development wiring for these unpublished APIs. No compatibility constraint was relaxed.

The npm update found no newer versions within existing constraints and refreshed the Composer-delivered Dapter frontend copy. The byte-parity regression requires another refresh after any later source or formatting change. Installed local bytes do not establish public release availability.

The browser history run exposed a Front Awesome preference-reconciliation reload that pushed history and removed fragments. The fix belongs to Front Awesome's public preference integration. The first npm refresh still contained the remote Composer package, so it could not deliver the workspace fix. The root task then installed both workspace packages through a temporary Composer path manifest, with Front Awesome explicitly marked `1.x-dev`. The canonical manifest and lock stayed unchanged. Both frontend copies were refreshed after that installation and matched their Composer-delivered TypeScript and Vue source bytes. Package internals were not copied into the documentation application.

## Observed checks

- New public-route fixture and behavior tests passed with 4 tests and 20 assertions.
- Focused registration, fragment, and HTTP tests passed with 10 tests and 442 assertions.
- The focused Vue consumer, task-guide, discovered coverage, and runtime byte-parity checks passed with 18 tests across three frontend files.
- The final focused consumer, coverage, installation, task-guide, and roadmap suites passed with 61 tests. All eight Phase 2 tasks are complete; Phase 2a remains unavailable.
- All 6 new Vue component behavior tests passed after refreshing the package copy.
- Documentation `npm run types:check` and the production build passed with the new public Vue props and demos.
- The production-only Vue browser script passed all four width and theme sessions with 30 public source reads per session, no errors, and no horizontal document overflow. Entry scripts used hashed build assets and no Vite client. The checks include cold page 99 clamped to 2 with one reading-owner request and no normalization reread, malformed-state rejection without a reading-owner fetch, and exact two-owner restoration after full reload and Start.
- The mobile dark navigation screenshot was visually reviewed. The frames remain readable, use public Front Awesome controls, and keep the two scroll regions distinct.
- Root verification records the complete package and documentation checks, final asset rebuild, and full existing browser chain before completion.

## Final verification

| Surface                          | Observed result                                                                                                                                                                        |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dapter PHP                       | `composer test`: PHPStan zero errors, Pint, 100% type coverage, 235 tests and 1,327 assertions.                                                                                        |
| Native database reads            | 76 tests and 896 assertions against isolated MySQL and PostgreSQL databases, in addition to SQLite package coverage.                                                                   |
| Dapter frontend and distribution | `npm run release:build`: 259 checks, no type errors, seven standalone type tests, library and consumer builds, and actual packed source and built consumers with Bundler and NodeNext. |
| Peer compatibility               | Stable Inertia 3.11.0, Vue 3.5.45, Ziggy 2.7.0; declared minimum Inertia 3.0.3, Vue 3.5.40, Ziggy 2.6.5. Both installed consumer lanes passed.                                         |
| Package quality and archive      | Six Maintainer checks, zero skipped; Composer archive includes public Vue runtime and consumer skill; installed standards unchanged.                                                   |
| Documentation PHP                | 793 tests and 75,951 assertions, PHPStan and Pint.                                                                                                                                     |
| Documentation frontend           | 1,110 tests; Vue type check; 62 discovered settings with executable demo coverage.                                                                                                     |
| Front Awesome root-cause fix     | 309 frontend tests, 216 PHP tests and 718 assertions, frontend build/check, six Maintainer checks. The new actual-SDK regression failed before the fix and passed afterward.           |
| Boost consumer discovery         | The consuming documentation application lists `dapter-development` and `front-awesome-development` from their Composer packages.                                                       |

The final documentation `composer ci:check` passed Rector and all six Maintainer checks with zero skipped. All twelve production browser scripts passed. A separate smoke check of the final rebuilt roadmap found eight completed Phase 2 cards, Phase 2a not started, hashed build assets, and no page errors. The original development hot URL was restored; its refreshed preference module contains the correction and loads without page errors.

The independent correctness pass reproduced two compatibility regressions: decoded page sizes were not reflected by the paging controls, and the existing explicit row generic stopped compiling. Both fixes have red/green public API checks. Static, ref, and getter source calls retain the legacy row generic with a required row decoder. Definition inference remains independent. The comment review found no deletion candidates or unresolved flags. Removing the new Vue compiler annotation reproduced the installed macro compiler's unsupported conditional-type error; negative type directives remain executable rejection assertions.

The actual compiled browser coordinator also passed five isolated public-SDK scenarios: superseded generation, disposal, neighboring owners, a winning server visit, and queued work invalidated by that visit. Real WebCrypto kept history encrypted. Final URL and decrypted public page URL agreed; props, remembered state, live flash, foreign query parameters, and fragments survived. These instruments complement the executable Chromium checks; they do not claim browser popstate coverage by themselves.

The consumer skill was reviewed against a matching request to add protocol 2 Vue filters and URL state, and an unrelated generic Eloquent query request. Its scope selects the first and explicitly excludes the second. It keeps Boost optional. The Composer archive and actual consuming Boost discovery verify delivery; no external skill code was installed.

No approved Phase 1 PHP file was changed or baseline file removed. Canonical documentation Composer and npm locks remain byte-identical to the preserved Phase 1 baseline. The application intentionally consumes explicit local previews for this verification; an ordinary canonical Composer install can replace those local paths. No package was published, committed, pushed, or deployed. Remote CI and the Windows matrix were not run locally. Independent reviewers used the configured model family, so their agreement is not cross-family corroboration.

Model the Domain guided the single requested-state reducer and typed capabilities. Boundary Discipline kept unknown protocol and definition parsing at the transport boundary. Type System Discipline preserved explicit row overloads and rejected fabricated decoder types. Sequence Work into Verifiable Units separated controller checks, packed consumers, and real browser navigation. Prove It Works required real packed consumers and production browser assets. Fix Root Causes placed the history refresh correction in Front Awesome.
