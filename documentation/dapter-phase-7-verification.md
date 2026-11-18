# Dapter Phase 7 and literal search verification

The user requested the final research phase and a default search that finds the case and accent variants of João. The strict option belongs to the DataSource. This change delivers that source-owned literal policy and records native vector and pagination research for the unpublished Dapter preview. All four Phase 7 research cards are complete, and the roadmap reports 61 of 61 completed cards.

## Delivered literal contract

String Contains, Equals, StartsWith, and EndsWith ignore case, accents, and canonical decomposition by default in field and fixed global searches. `StoreOptions::strictLiteralSearch()`, `#[StrictLiteralSearch]`, and captured `dapter.declarations.strict_literal_search` select strict matching. Explicit fluent false overrides inherited strict declarations. Strict matching preserves case, accents, composition, and string boundaries. Names returned to the reader and submitted search strings remain unchanged.

There is no frontend switch, prop, request key, or new policy metadata. Existing exact request validation rejects client overrides. Numeric and boolean equality, finite filters, sorting, Resources, actions, and FullText dictionary semantics retain their own contracts. Changing the source policy invalidates cursor and retained live definition fingerprints.

Collection and SQLite use canonical decomposition, the generated Unicode 16.0.0 Mark ranges, and lowercase. The explicit Symfony normalizer polyfill dependency avoids a mandatory intl extension. SQLite registers a deterministic scalar function on the execution PDO. Filtering, counts, and paging remain SQL operations, with a per-value PHP callback and no promise that an ordinary index accelerates the expression. PostgreSQL and MySQL use admitted native expressions. MySQL's collation has additional equivalences such as ø/o and ł/l; the guide and tests describe this limitation rather than promising identical matching for all Unicode across engines.

Custom drivers declaring string literal search must explicitly honor the policy and advertise `DriverCapabilities::literalSearchPolicy`. Drivers without these operations retain their existing prerequisites. SQL literal declarations reject connections with registered `beforeExecuting` callbacks, including unused declarations and strict mode, because callbacks can alter execution after admission. Capability getters remain pure. Admission checks the effective execution PDO before handlers, counts, or rows.

Seven public examples cover the default, fluent strict mode, the attribute, captured configuration, inherited false override, an aware custom driver, and SQLite. The guides start with the Laravel 13 and unpublished-preview requirements, install the backend before the frontend, define their fictional records, show expected IDs, and link the next task. They reuse DemoFrame, CodeExample, and public Front Awesome Button, Spinner, and Tag exports. The existing protocol transport remains appropriate for fixed HTTP requests. No duplicate component implementation was added.

## Research outcome

Native vector feasibility passed on PostgreSQL 18.6 with pgvector 0.8.7. The user installed the extension, and a retained PDO confirmed its version and distance result. A declared `public.vector(3)` column produced exact L2 ranks `10,20,30,40,50`, scoped total 6, and filtered 5. Revoking ID 20 changed these to `10,30,40,50`, total 5, and filtered 4. Fifteen malformed prepared inputs were rejected before a query. Native casts rejected wrong dimensions and non-finite literals. Offset pages, simple lookahead, tied distance/ID seeks, and a different prepared vector matched their expected results. A configured MySQL 8.4.11 connection refused vector compilation before vector SQL.

The original missing-extension observation is historical evidence. It was superseded by the successful native runs after installation. Probe failures are reported separately from confirmed absence. The fixture had only its primary-key index. Its EXPLAIN output establishes the tested plan, without a latency, ANN recall, throughput, or production capacity claim. Installed Laravel vector helpers use cosine distance, while this experiment explicitly uses native L2. Neither raw SQL seek nor scope predicates establish a Dapter cursor, authenticated token, or Laravel Gate integration.

The pagination experiment used distinct reader and writer sessions with committed barriers. Nine scenarios covered unchanged data, inserts above the high-water bound, gap inserts, value updates, mutable ordering, deletion, revocation, identity reuse, and combined mutations. The combined next window was `30,10` for the high-water candidate and `40,70` for persisted keys and frozen output. Keys returned current values; frozen output retained captured values while suppressing absent or currently unauthorized identities.

Identity reuse exposed a correctness gap. Keys admitted a replacement entity with the same primary key, while frozen output replayed the deleted entity's payload. Both prototypes explicitly report `production_safe=false`. A proven no-reuse identity contract or generation identity is required. The symbolic query descriptor and unchecked serializer revision are additional gaps. Fresh-session recovery and restart outcomes for principal, scope, expiry, and missing metadata passed, but do not establish a production authorization handle.

Storage observations read the same initial capture three times. Each candidate held six entries and shared one metadata row. Logical JSON text payload was 42 bytes for keys and 300 bytes for frozen entries. Key relation allocation was 40,960 bytes and frozen allocation 49,152 bytes; shared metadata allocation was 49,152 bytes. These physical figures include relation/index allocation and the frozen relation's additional storage overhead. They exclude the ownership-marker table. They are not independent benchmark runs or a capacity estimate.

Public vector retrieval and snapshots remain deferred. An implemented driver, typed rank and cursor contract, authorization and generation boundaries, retention, quotas, cleanup, and demonstrated operating cost must precede adoption. Current public enums and capability shapes advertise neither feature. Functional forged-request demos return HTTP 422 `unsupported_operation`; PHP tests verify rejection before source acquisition. This evidence-backed deferral satisfies the research phase's exit contract.

## Executed gates

| Gate                                   | Result                                                                                                                                       |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Dapter full backend suite              | 614 tests and 7,567 assertions; PHPStan and Pint passed                                                                                      |
| Dapter native database suite           | 453 tests and 12,050 assertions                                                                                                              |
| Dapter complete quality suite          | Six checks passed, zero skipped                                                                                                              |
| Uncached synchronous PHP type coverage | All 169 source files, 100 percent                                                                                                            |
| Frontend release                       | 501 runtime tests and 18 type tests; source and built consumers with Bundler and NodeNext, real Vue templates, stable and minimum peer lanes |
| Discovered demo coverage               | 488 settings; 213 PHP tests and 2,089 assertions; 193 Vue tests across 16 files                                                              |
| New production browser proof           | Four layouts; 36 UI requests, 28 global requests, 32 Unicode-preservation requests; zero browser errors, overflow, or eager reads            |
| Composer distribution                  | 209 archive entries; all 188 public source, frontend, contract, and skill files match current bytes                                          |
| Consumer skill discovery               | Actual Boost discovery includes source-owned literal sensitivity and excludes unrelated generic Eloquent requests                            |
| Contributor standards                  | Dapter 1.0.6 and docs 1.1.0 checks passed                                                                                                    |
| Installed frontend copies              | Dapter 22, Front Awesome 171, Mosaicast 5, and QzTray 246 files match their owning sources                                                   |

Documentation CI passed all six checks with zero skipped, including 973 PHP tests and 108,237 assertions, 1,256 frontend tests in 107 files, Pint, lint, formatting, Vue type checks, and PHPStan. All 21 scripts in the complete production browser regression chain passed. The task-owned demo worker exited successfully, and the demo queue is empty. The final production build showed 61 of 61 completed cards at desktop light and mobile dark widths. The first example returned ten of 23 fictional notebooks; joined append preserved both row occurrences. Default, strict, inherited false override, and SQLite searches passed with disclosures matching current source bytes. The live Vite marker was restored only after its client endpoint returned HTTP 200. Closure details are recorded in the final audit.

## Review and corrections

Independent backend review reproduced the SQLite folded-empty prefix/suffix defect using a combining-mark-only input. The fix retains non-null matching when the folded needle is empty. Public regression tests cover both policies, four operators, field/global searches, counts, scope, nulls, and paging. A fresh review passed 416 cross-backend comparisons and 112 additional Portuguese comparisons. Existing tests that observed native collation behavior remain intact; separate explicit strict tests now assert the source-owned contract.

Independent documentation review found that bare fixture statements could continue after a schema collision and create an ownership marker over existing data. Both published fixture files now run atomically and the README supplies fail-fast psql commands. Actual collision tests preserved sentinel rows and created no additional relations or ownership markers. Fresh provisioning and the exact published vector baseline, revoked, and nine-scenario snapshot commands then passed. The inherited false-override example also now discloses its parent attribute and child declaration. Comment review retained type contracts, Unicode provenance, and negative type assertions while removing repeated narration.

Fresh independent reviewers used the configured GPT family. No cross-family reviewer was available. Local results do not claim remote CI, Windows validation, or a published release.

## Dependencies and environment

The required Composer refresh changed canonical Guzzle from 8.5.1 to 8.5.2. The installed runtime was already on 8.5.2. Other main dependencies were current within their constraints. A temporary local-path Composer manifest refreshed Dapter's explicit normalizer dependency and preserved the canonical stable Front Awesome constraint. Composer discovery completed before npm installation. The temporary manifest and lock were moved to the private audit directory.

The npm refresh resolved no new versions. Its audit reports 19 high-severity transitive entries originating in the picomatch advisory. The registry's latest picomatch was 4.0.7, within the reported affected range. Suggested audit changes included incompatible downgrades. No forced dependency change or clean-audit claim was made; the registry response, dependency tree, and audit JSON remain in the task evidence.

All four task-owned research schemas were removed only after checking their exact ownership markers. The user's `public.vector` 0.8.7 extension remains installed. Fictional documentation fixtures remain available for reader-triggered demos. The preservation manifest tracks 2,643 baseline files. The old internal LiteralSearchExpression file was intentionally replaced by the admitted comparison implementation. Unrelated workspace work was preserved.

The local decision trails, native results, review reports, command logs, and browser evidence are under `.audit/dapter-phase-7` and `.audit/dapter-search-sensitivity` at the workspace root. Public portable commands and sanitized results are under `docs/scripts/dapter-research`.
