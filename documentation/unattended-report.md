# Unattended migration report

The requested outcome was to finish migrating the existing documentation into Laravel, Vue, and Inertia and apply Front Awesome's new quick styles. The content migration and local styling integration are complete. Publication remains a separate step.

This report records the earlier content-migration checkpoint. Later refinements added five installation pages and deploy-time local full-text search, bringing the registry to 57 pages. Horizon and Reverb are installed, with live service validation still separate. Ziggy now replaces the former Wayfinder integration. Use the current [architecture](architecture.md), [search workflow](search.md), and latest [migration entries](migration.md) for present status; the counts and remaining-work section below describe the historical checkpoint.

## What readers receive

The application has a public landing page and 52 registered documentation pages. Each documentation page has a unique title, requirements where applicable, local guide navigation, and a link to its Vue source. The landing page also links to its source. External web links open a new tab through the shared link component.

| Section                                       | Canonical documentation pages |
| --------------------------------------------- | ----------------------------: |
| Documentation catalog                         |                             1 |
| Maintainer                                    |                            19 |
| Core                                          |                             4 |
| Dump to Console                               |                             2 |
| Mosaicast                                     |                             5 |
| Front Awesome                                 |                            14 |
| QZ Tray Connector                             |                             2 |
| Getting Started and package chooser           |                             2 |
| Project, documentation policy, and versioning |                             3 |

All 47 legacy package Markdown sources are represented by 46 canonical package pages and the historical Maintainer project-integration alias. Existing examples, prose, headings, anchors, tables, and links have preservation coverage. QZ Tray's long guide is split into cohesive authored components. Getting Started and project content have also migrated. The legacy publication is retained until the explicit cutover.

The menu preserves its nested structure, separate disclosure buttons, and mobile behavior. Deep links now reveal their active item by scrolling only the desktop sidebar. Requirements come from PHP package metadata rather than duplicated frontend lists.

## Shared branding

The application consumes Front Awesome through Composer and its documented frontend exports. It uses the public Vite plugin, Tailwind wrapper, and Web Awesome runtime. `resources/css/branding.css` was published through the package command and is application-owned.

The palette uses the logo's red with slate neutrals. Instrument Sans, system monospace, spacing, radii, and complete shadows are configured through shared theme inputs. The existing appearance manager remains the sole owner because it also handles the server cookie and prepaint behavior. It synchronizes Tailwind and Web Awesome classes and follows system preference changes.

The live styling demo imports the actual Front Awesome button. It is isolated under `resources/js/components/demo/front-awesome/`, has a resizable frame, and sits next to its source example. Browser inspection confirms Instrument Sans on both Tailwind and Web Awesome. The button uses the configured dark red with white text in light mode and a pale red with dark text in dark mode. Resizing the frame from 335 to 213 pixels wraps the elements without page overflow.

## Validation

| Check                            | Observed result                                                              | Local evidence                                |
| -------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------- |
| Complete quality gate            | Rector passes; all six Maintainer tools execute; none skipped                | `/private/tmp/atb-final-platform-ci.txt`      |
| Pest                             | 122 passing tests and 15,907 assertions                                      | Same gate log                                 |
| Normal frontend suite            | 206 passing tests across 30 files                                            | Same gate log                                 |
| Workspace source/converter suite | 30 passing tests                                                             | `/private/tmp/atb-final-workspace-tests.txt`  |
| Production client build          | Passes using Node.js 24.22.2                                                 | `/private/tmp/atb-final-brand-build.txt`      |
| Legacy publication               | Content, formatting, build, and nine output tests pass                       | `/private/tmp/atb-final-legacy-tests.txt`     |
| Desktop routes                   | All 52 pages mount with one heading, source references, and no page overflow | `/private/tmp/atb-browser-route-audit.json`   |
| Mobile routes                    | All 52 pages mount without page overflow at 390 pixels                       | `/private/tmp/atb-mobile-route-audit.json`    |
| Actual shared styling            | Computed fonts, colors, mode classes, and radius checked in both modes       | `/private/tmp/atb-shared-branding-modes.json` |

The ordinary frontend suite is self-contained. Raw legacy source checks belong to the explicit workspace suite, which requires `docs_old` and its dependencies. Rendered fixture tests were also exercised in an isolated temporary documentation checkout without that sibling repository.

The final public-contact check found two former author email fields reintroduced by published dependency metadata in `composer.lock`. The retained updater normalized those fields to `contact@atb.dev.br`. A parsed comparison confirmed all other lock metadata and dependency versions were unchanged. The repeatable check now reports zero pending files, and Composer validates the lock.

Independent package-content reviews compared the 34 package pages added in this cycle against their legacy sources. A separate integration review ran scoped tests and compared all 13 installed Front Awesome public entry files with Composer source. It found the inherited Node 22 CI setting did not meet the package's Node 24.11 requirement. CI and engine metadata now use the supported Node version, and the full gate was repeated successfully. Comment review recommended zero deletions and found no scoped suppressions.

The review model was `gpt-6.1-sol`. Only GPT-family models were available, so this is independent-agent review rather than a review by another model family. The append-only [decision log](decisions.tsv) records accepted units, corrected assumptions, and verification evidence.

## Before a standalone deploy

Production requires PHP 8.5, matching the installed Front Awesome, Core, and Mosaicast packages. The application manifest, lock platform requirement, and Maintainer-managed README badge now state that minimum. Asset builds require Node.js 24.11 or newer. Composer's production platform check passes on the current PHP 8.5 environment.

**The current dependency lock requires sibling package checkouts.** Front Awesome's quick-style exports are not yet in its public distribution. Composer therefore uses the explicit relative `../front-awesome` preview. The existing local Maintainer `1.999.999` dependency is preserved through an explicit `../maintainer` repository. This also prevents the current isolated GitHub Actions checkout from installing those dependencies.

Publish the required package changes, replace the local preview constraints/repositories with the chosen public versions, and refresh Composer and npm locks in that order. Verify the exported styling entries from the installed distribution, then repeat the quality gate and production build. Follow [standalone installation](quality.md#prepare-standalone-installation). No package was published during this run.

## Remaining application work

Content completion does not complete every item in the original application plan. Local full-text search and automated indexing, broader live package demos, the Wayfinder-to-Ziggy replacement, and Reverb/Horizon operational integration still need their own implementation and validation. The current static styling demo makes no claim about those services.

Vue SSR remains disabled. Laravel Head supplies initial metadata, but article bodies still require JavaScript. Verify indexing and previews during publication; complete content and passing metadata tests do not establish crawler behavior.

No commits, pushes, releases, production deploys, real printing, server maintenance, or live email operations were performed. Existing local server configuration and package implementation changes were preserved.
