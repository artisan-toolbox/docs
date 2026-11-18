# Dapter Phase 6 verification

Phase 6 adds explicit Collection locale ordering and PostgreSQL plain-text full-text filters to the unpublished Dapter preview. Consumers retain existing literal comparisons, native ordering, source scope, Resources, actions, live replacements, polling, and infinite windows. Maintainers inherit one admitted comparison result used by execution and capability metadata.

All four Phase 6 cards passed their acceptance gates. The roadmap reports 57 of 61 completed cards. The four Phase 7 research cards remain pending and are the next authorized task.

## Public contract

- `LocaleOptions(locale)` opts a String Collection field into ICU ordering through `FieldOptions.locale`. Fluent, attribute, and captured configuration declarations share validation. Offset and simple reads support this mode. Cursor ordering remains Native.
- Locale requires optional PHP intl and an available explicit locale. ICU parent inheritance is permitted. Tertiary strength, normalization on, and numeric collation off are fixed policies. Null placement and stable ties remain intact. Malformed UTF-8, including a singleton row, fails before handlers. Literal matching remains sensitive to case, accents, and composition.
- `FullTextOptions(configuration)` selects an explicit schema-qualified PostgreSQL text-search configuration through `FieldOptions.fullText` or a fixed `SearchTarget.fullText`. `MatchType::FullText` uses bound plain text, not a tsquery expression. Active input is at most 512 UTF-8 bytes and excludes NUL. Existing empty-input clearing remains available.
- PostgreSQL full-text is a filter. It adds no rank output or rank order. Existing ordering, offset/simple/cursor traversal, mandatory predicates, and count definitions remain in force. Stopwords and stemming follow the declared configuration. A matching GIN expression index is an optional application-owned performance aid, not an extension or correctness prerequisite.
- Admission probes the effective execution PDO. Absence narrows unused optional controls. Selected unavailable modes fail before handlers, counts, or rows. Required unavailable declarations fail configuration. Probe failures remain failures. PostgreSQL guards cover connection routing, role, database, backend, version, and search path. Connections with `beforeExecuting` callbacks reject admitted full-text, including unused optional declarations, because those callbacks run after builder guards.
- Collection, MySQL, and SQLite full-text remain unavailable. SQL Locale ordering remains unavailable. Arbitrary regex has no admitted enum or control. A valid filter followed by forged regex fails before calling `source()`; no SQL result is moved into PHP for comparison.
- Frontend definitions retain exact immutable comparison policies. Decoder narrowing cannot alter retained policy, expand finite operations, or derive operations from Resource fields. Current, borrowed, and stale controls preserve these restrictions.

## Executed validation

| Gate                                   | Result                                                                                                                                                |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dapter `composer test`                 | 523 tests, 2,640 assertions; PHPStan and Pint passed                                                                                                  |
| Dapter `composer quality:check`        | Six checks passed, zero skipped; 490 frontend tests in 21 files                                                                                       |
| Native database suite                  | 292 tests, 2,183 assertions; the explicit native XML includes the new comparison file                                                                 |
| Uncached synchronous PHP type coverage | All 167 source files, 100 percent                                                                                                                     |
| Frontend release validation            | 490 runtime tests, 16 type tests, real Vue templates, source and built consumer checks                                                                |
| Packed real Vue validation             | Both entry points with Bundler and NodeNext, stable and minimum peer lanes                                                                            |
| Documentation `composer ci:check`      | 943 PHP tests, 102,341 assertions; 1,241 frontend tests in 105 files; six checks, zero skipped                                                        |
| Discovered Dapter demo coverage        | 483 settings; 194 PHP tests and 1,773 assertions; 179 Vue tests in 14 files                                                                           |
| Full browser regression chain          | All 20 current scripts passed against production assets, including prior Dapter actions, paging, live, and infinite behavior                          |
| Comparison browser examples            | Nine scenarios at 1440 and 390 pixels, light and dark; 36 actual requests, no eager reads, unavailable scenarios, page overflow, or JavaScript errors |
| Contributor standards                  | Dapter and docs installed standards checks passed                                                                                                     |
| Composer distribution                  | 207 archive entries; all 186 public source, frontend, contract, and skill files match current bytes                                                   |
| Boost consumer discovery               | Actual installed Boost discovery found the updated skill; matching and unrelated request metadata reviewed                                            |

Local native evidence uses PostgreSQL 18.6, MySQL 8.4.11, SQLite 3.45.2, PHP 8.5.12, and ICU 77.1. The CI database job targets PostgreSQL 18 and MySQL 8.4. This local task did not run remote CI or Windows.

Stable packed peers were Inertia Core/Vue 3.11.0, Vue 3.5.45, and Ziggy 2.7.0. Minimum peers were Inertia Core/Vue 3.0.3, Vue 3.5.40, and Ziggy 2.6.5.

## Proofs and corrections

Two executable architecture candidates were compared before implementation. PostgreSQL filter-only search was selected over a larger MySQL index/parser admission policy. Available-locale validation and immutable admitted declarations were retained from the other candidate. No cross-family reviewer was available; independent reviews used fresh agents from the configured GPT family.

Independent frontend and comment reviews found no actionable issue. The backend review reproduced required configuration failures incorrectly taking optional-selection precedence. That defect was fixed and independently rechecked. Full unchanged package tests then found eager capability validation and unnecessary option cloning. The getter again returns its cached profile, actual SQL admission performs binding validation, and unchanged options retain their identity. Existing tests were preserved.

An executable mutation proof removes the UTF-8 guard only in memory. The current Collection driver rejects the malformed singleton; the mutant returns its malformed row. Native tests use real split read/write PDOs and verify handler changes to routing, transactions, role, and search path, plus catalog/expression failures and connection callbacks.

The mobile browser found unbroken source paths and an environment assignment overflowing prose. The owning guides now use wrapping shared code presentation. The source-copy instructions also place the helper in its actual namespace directory. No CSS override or assertion was used to hide overflow.

Concurrent Front Awesome OTP work exposed an outdated shared test selecting Submit instead of Reset and a browser assertion selecting the viewport-width output. Real browser input preserved `001234` and reset correctly. The documentation example now explicitly resets its application model and submitted state. The unit tests preserve the original initial-value assertion, and the browser check targets the actual OTP output. Front Awesome package sources were not changed by this task.

## Consumer documentation and reuse

The dedicated Installation route and overview quickstart remain the beginner entry points. Composer still precedes the `file:vendor/artisan-toolbox/dapter` frontend install. The first notebook example retains its documented first ten rows out of 23. New focused guides follow field ordering and advanced queries; the capability matrix is a reference. APIs remain labeled unpublished previews.

The nine examples use public Dapter declarations and routes, existing DemoFrame and code presentation, and public Front Awesome Button, Spinner, and Tag components. The capability matrix uses the shared documentation table. Comparison behavior stays in Dapter because it depends on its source admission and paging contracts; no concrete shared Core capability required a change.

The optional PostgreSQL documentation fixture uses a dedicated connection and five fictional documents. Four belong to its visible scope. Opening the page does not query PostgreSQL. Setup is explicit, transactional, repeatable, ownership-marked, and refuses unexpected rows. Executable verification proved these refusal paths and restored the fixture. The table is retained for the local demo; reader application data and authentication were not changed.

## Dependency refresh

The documentation Composer refresh stayed within declared constraints. Fortify changed from 1.42.0 to 1.43.0, Horizon from 5.51.0 to 5.52.0, Passkeys from 0.2.1 to 0.3.0, Reverb from 1.13.0 to 1.14.0, Tinker from 3.1.0 to 3.2.0, and Sail from 1.70.0 to 1.71.0. Laravel was already current at 13.43.0. Vue I18n and four transitive Intlify packages changed from 11.4.21 to 11.4.22. npm reported zero vulnerabilities.

Canonical stable constraints were not relaxed. A temporary runtime manifest restored local Dapter and Front Awesome preview path installations after resolution. Composer discovery ran before npm. Generated frontend copies were refreshed; Dapter source/contracts, Front Awesome source, and Mosaicast/QzTray distributed files were compared with their owning Composer packages.

## Limits and handoff

Herd compiles intl into the available PHP binary. Missing-intl behavior was exercised through an isolated class-availability seam; an actual extension-free runtime was unavailable. Boost evidence establishes distribution, discovery, and metadata relevance, not an automated agent-routing benchmark.

Ordinary and native Testbench runs share generated configuration and must run serially. A concurrent attempt exposed that shared directory; the final native result above comes from the serial run. Synchronous uncached type coverage records every analyzed source file.

The workspace remains uncommitted. No push, release, deployment, or publication was performed. The local audit directory records baselines, executable probes, decisions, reviews, commands, and results. Concurrent Front Awesome and documentation work is preserved.

Final rendered checks confirmed 57 completed cards, all four Phase 6 cards completed, four Phase 7 cards pending, unchanged joined row occurrences, and the ten-row version 1 quickstart out of 23 records. The task-owned demo worker stopped, the dedicated queue is empty, and the existing Horizon supervisor remains present. The captured development marker was restored only after its Vite client endpoint returned HTTP 200. All 2,597 baseline files remain present.
