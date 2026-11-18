# Dapter documentation and implementation review

The Dapter guides should help a Laravel and Vue developer install the preview, display records, and add one feature at a time. This review reorganizes the existing guides around those tasks and corrects defects found in the implementation. It preserves the unpublished `1.x` preview status and does not introduce the deferred vector or snapshot APIs.

## Reader journey and navigation

The starting environment is an existing compatible Laravel 13, Inertia 3, Vue, and Vite application, with a sibling Dapter checkout. The dedicated Installation guide connects Composer first, supplies Ziggy's server and global route configuration, installs the Composer-delivered frontend, and configures Vue source compilation. The overview then declares its own 23 fictional notebooks and displays Notebook 01 through Notebook 10. Its next page displays Notebook 11 through Notebook 20. No database, account, broadcaster, queue worker, or Pro grid is needed for this first result.

The package menu now has 12 direct task groups instead of 48 unrelated direct entries. Sources, pagination, Vue controls, search, filtering, sorting, actions, Resources, refresh, reference, and development keep their existing guide URLs. All 63 registered destinations and all 420 original static section identifiers remain present. `PageSlug` remains the only owner of editorial order and ancestry. Breadcrumbs, active ancestors, and the overview's task links consume that same hierarchy.

The existing shared navigation icon registry supplies a deliberate icon for each guide. Search uses a magnifying glass, filtering a funnel, sorting an ordered arrow, actions an edit symbol, and refresh circular arrows. Text labels remain visible. The existing public Front Awesome Icon renders the glyphs; no second icon library or custom resolver was added.

Search, filter, and sort guides now lead with a declaration, one visible control, rows, and the expected result. Searching for Pencil returns records 3 and 4. Searching for Eraser shows the empty state. Selecting tools returns records 3 and 4. Natural ascending name order puts Notebook 2 before Notebook 10. Clearing a control restores the source's first page. A separate Load more example appends 10, 20, then 23 notebooks. Fixed protocol demonstrations remain available, with request and response diagnostics in an optional disclosure.

The presentation reuses the existing headers, sections, links, source disclosures, semantic rows, and public Front Awesome controls. The optional Pro DataGrid remains a separate presentation choice. Sources and reference guides distinguish current Resources, action metadata, live channels, source-owned paging, and native write outcomes from older constraints. Proposed design and completed research remain under package development.

The search extractor now reads displayed PHP helper examples from the existing public `app/Demo` directory as well as `app/DataSources`. It never executes them. Tests reject non-PHP files, sibling directories, private-file symlinks, and cross-volume paths. A shared containment check also protects Vue source imports. The generated task navigation remains presentation metadata; its static explanation and every registered guide remain searchable. Exact editorial-parent assertions replace the obsolete assumption that every Dapter parent follows its URL prefix.

The official [PrimeVue DataTable guide](https://primevue.org/datatable/) informed the example-first progression and grouping by feature. Dapter remains headless and does not advertise PrimeVue component features.

## Implementation corrections

| Observed defect                                                                                 | Corrected behavior                                                                                                                                                                                                     |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A nullable object field was treated as absent, or unrelated property hooks ran during fallback. | The requested public field or get hook can return null without enumerating other properties. Private, missing, and plain uninitialized targets still fail configuration.                                               |
| Ordinary Collection Resource reads serialized raw rows unnecessarily.                           | Serialization is required only while a selected global transform or preset validates its rows. An ordinary Resource can project an otherwise opaque input.                                                             |
| A selected Collection handler returned equal clones instead of the original objects.            | Original object identity, contents, and duplicate multiplicities are preserved. Presets retain every filtered occurrence.                                                                                              |
| A permitted record action failed on a source with disjunctive predicates or scopes.             | Complete source predicates and bindings are grouped before the exact record selector. Scopes apply once and the source builder remains unchanged. No unauthorized write was demonstrated by the original reproduction. |
| An advertised action on a registered live source bypassed its context factory.                  | Dispatch restores the source with the fresh selected-guard actor and rechecks authorization, without issuing a channel ticket. Public read projection remains anonymous.                                               |
| An infinite append rejected different page-local record action targets.                         | Compatible action declarations merge their page-local targets. Incompatible source-wide metadata still rejects the append.                                                                                             |
| Automatic polling cleared a live overflow suspension.                                           | The same-channel suspension remains until successful explicit recovery or an admitted owner or descriptor change. A failed explicit reload stays suspended.                                                            |
| A retained protocol 1 paging command changed a replacement owner.                               | Obsolete commands return superseded. Commands remain useful across ordinary reads of their current owner.                                                                                                              |
| An Inertia visit cancelled before starting left an action pending.                              | Native pending state begins at the actual visit start and settles only started writes.                                                                                                                                 |

Public regressions first failed for the accepted bugs. Six negative TypeScript assertions were also narrowed so unrelated optional-access errors cannot satisfy the intended rejection. Compiler mutation checks establish that weakening the six constraints makes the assertions fail. Three Vue compiler annotations remain because removing each breaks extraction of the actual component's props.

## Additional alpha corrections

Fresh Astra reviews of the alpha candidate found further native-action and packaging defects. The earlier review reports retain their original HOLD verdicts; the later correction judgments identify the fixes they verified.

- Composer archives built from the working directory contained assets that a Git export omitted. The four frontend distribution files are now eligible for Git, the archive validator checks nested public exports and their maps, and CI checks the Git archive before building. A complete candidate export uses a private index and private object directory. Its contents match the working tree without changing the shared index or creating a commit. The old committed HEAD is not the candidate.
- String record identifiers containing braces, path separators, dot segments, or significant whitespace now retain their exact typed value in generated native action targets. Conflicting or malformed selectors fail validation. The guide includes a read-only public-API demo for five identifiers, including a real multipart upload.
- Native multipart actions preserve the original body selector before Laravel normalizes input. Query parameters cannot supply a missing body selector. Other fields still receive Laravel's normal trimming and empty-string conversion. The original form snapshot stays private to its request and is cleared after success or exceptions. A host route with precedence cannot read it through Dapter's helper or request attributes.
- Ordinary authentication and source authorization retain their 401 and concealing 404 responses before a missing live registration reports a configuration error. Registered action dispatch still restores its source through the configured context factory.
- Processing an older queued recipient reference no longer shortens a more recent private-channel admission. The old reference retains its own expiry.
- Eloquent record actions require an entity-preserving source. Admission rejects row bounds, grouping, HAVING, aggregate state, opaque expression or subquery selections, PostgreSQL DISTINCT ON, and deferred builder mutation, result, or clone callbacks before lookup SQL. Plain columns, qualified aliases, joins, whole-row DISTINCT, grouped OR predicates, and authorization scopes remain supported. Scopes run once and the original builder stays unchanged. Report reads and source-wide action behavior retain their existing contracts. The action guide explains the limitation and recommends an entity source with a Resource for calculated display fields.
- Release notes no longer claim that already implemented global operations, Resources, broadcasts, or polling are unavailable. Vector search and persisted snapshot traversal remain deferred research.

The final privacy judgment passed 12 independent checks. Four fresh Laravel kernels checked early and late HTTP-kernel resolution with cached and uncached routes. The final query judgment checked both record entry points, callback rejection before execution, zero SQL on unsupported projections, and unchanged source SQL and bindings. It verified PostgreSQL DISTINCT ON through Laravel's PostgreSQL grammar; this specific admission case was not a native PostgreSQL execution. The callback APIs were also checked against official Laravel 13.0.0 source.

## Review and evidence

Independent fresh reviewers used the user-requested GPT-6.2 Astra model. Backend and frontend verdicts cover the corrected contracts and their reproduced edge cases. An additional backend review found an uninitialized backing slot behind a readable null get hook; the final fix passed its 12-case real-driver matrix and all 32 nearby HTTP tests. The documentation review identified missing Ziggy setup and incomplete action, optional grid, and append examples. Those findings were corrected before final browser verification.

These are bounded local reviews from the same GPT model family. They do not establish cross-family agreement, remote CI, Windows compatibility, a published release, or a comprehensive security audit. The local baseline, review reports, red and green logs, preservation manifests, and decision trail are under `.audit/dapter-astra-review` at the workspace root.

## Executed package checks

| Check                                  | Result                                                                                                                                    |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Full Dapter quality suite              | Six checks passed, zero skipped; 688 PHP tests and 7,961 assertions; PHPStan, Pint, frontend checks and Vue types passed.                 |
| Native database suite                  | 453 tests and 12,050 assertions against isolated MySQL and PostgreSQL databases.                                                          |
| Frontend release                       | 512 runtime tests and 18 type tests, source and built consumers, real Vue templates, Bundler and NodeNext, stable and minimum peer lanes. |
| Uncached synchronous PHP type coverage | All 172 source files, 100 percent.                                                                                                        |
| Discovered public demo coverage        | 488 settings, 213 PHP tests and 2,089 assertions, 193 Vue tests in 16 files.                                                              |
| Focused guide HTTP checks              | 12 tests and 908 assertions, including all routes, ancestry, and new control results.                                                     |
| Navigation icon tests                  | 47 tests passed. The live page rendered all 62 guide SVGs without starting a data read.                                                   |
| Search extraction and navigation       | 74 extractor tests, including POSIX and Win32 path cases; 47 PHP tests and 98,850 assertions against the real corpus and navigation.      |
| Installed frontend copies              | Dapter 22, Front Awesome 171, Mosaicast 5, and QzTray 246 distributed files match their owning sources.                                   |
| Contributor standards                  | Dapter 1.0.6 and docs 1.1.0 checks passed.                                                                                                |

## Documentation and browser gates

The complete documentation CI passed six checks with zero skipped checks, 982 PHP tests and 108,671 assertions, and 1,300 Vue tests in 111 files. The production build and all 22 browser scripts passed. The browser chain covers the existing package demonstrations as well as the revised guides.

The guide check uses desktop and mobile layouts in light and dark themes. Across those four sessions, it checked all 63 guide destinations, all 62 guide icon SVGs, deep breadcrumbs, keyboard navigation, no eager reads, and no overflow. It made 64 explicit reads and 20 native inspections, including four file uploads. All five string selectors reached the exact record. Search, filters, natural sorting, pagination, and manual append produced their stated results. The browser run recorded no page errors.

A running development server recreated its normal Vite hot-file marker during an earlier production attempt. The final production run used Laravel's supported temporary hot-file override instead of stopping or restarting that server. After verification, the provider was restored to its exact preceding bytes. No unowned service was changed.

## Release recommendation and limits

The final independent Astra judgment is PASS for Git tree `5bf953ecc2df64056ab096c382e4128cf0e8ea6f`. The reviewer independently compared every one of its 212 archived files with the current source. The locally verified working-tree candidate is suitable for the maintainer's alpha release decision. No tag, push, publication, or deployment was performed. The release commit must include the complete reviewed change and all four `dist` files. The last committed HEAD still predates those distribution corrections.

The configured Ubuntu and Windows, stable and lowest dependency CI lanes still require execution on the eventual release commit. Local tests do not substitute for those remote results. Frontend minimum and stable peer consumers were executed locally. A fresh Composer installation using the eventual published alpha constraint remains a post-publication verification; current installation examples accurately identify the unpublished local preview.

The native database suite used isolated MySQL 8.4.11 and PostgreSQL 18.6 databases. The user's `public.vector` 0.8.7 installation and distance result of 1 were preserved. No vector or snapshot research schema is part of this delivery. The temporary demonstration worker belongs to this verification and is stopped at handoff.

The developer inherits one authoritative page hierarchy, focused public-API examples, regression checks for the accepted bugs, and archive validation that checks the actual release artifact. The Experience First and Minimize Reader Load principles drove task grouping and optional diagnostic disclosures. Prove It Works drove real route, upload, browser, and Git-export checks.

## Dependency refresh

The compatible Composer refresh changed Filoquent from 1.0.0-beta.4 to 1.0.0-beta.5 and Laravel MCP from 1.2.0 to 1.2.1. A temporary local-path runtime manifest preserved the existing Dapter and Front Awesome previews without changing the canonical stable Front Awesome constraint. Composer installation and discovery completed before npm refresh.

Both Web Awesome packages changed from 3.14.0 to 3.15.0. The final npm audit reports 19 high-severity transitive entries associated with the picomatch advisory. The registry still reports picomatch 4.0.7 as latest, within the affected range. No incompatible downgrade, forced pin, or clean-audit claim is part of this review. The resolved versions, audit response, and installed dependency tree remain in the local evidence.

Dapter's separate npm audit reports 13 high findings in the complete tooling tree and zero with development dependencies omitted. Do not apply that runtime result to the documentation application. Composer reports zero security advisories but identifies the abandoned development package `symplify/rule-doc-generator-contracts`, introduced through `driftingly/rector-laravel`. Its audit exit status remains nonzero for abandonment. These are recorded dependency risks, not clean-audit results.

The final evidence includes `alpha-release-final-judgment.md`, `closure-summary.json`, the `closure-*` gate logs, and the exact candidate manifest in `.audit/dapter-astra-review`. The final focused production guide check passed in all four layouts after the last static guide change. Its temporary provider override was restored byte for byte.
