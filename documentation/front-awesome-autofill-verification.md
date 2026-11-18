# Form autofill and OTP verification

This record explains the unreleased form-control corrections verified on November 17, 2026.
The reported environment was Chromium with the 1Password browser extension.
Tests use fictional values and the installed Web Awesome Core and licensed Pro 3.14.0 implementations.
The actual 1Password extension and its vault were not exercised.

## Cause and implementation

The wrapper originally committed only host `input` events. Web Awesome also updates its
value on `change`, noncomposed native input, and `formStateRestoreCallback`, but these
paths do not all produce a host `input` event. A silent native value write can bypass
the host property entirely.

A private shared observer now integrates native host events, Lit lifecycle updates, and the associated form's
click, Enter, and submit boundaries. The reviewed public `validationTarget` or `input` supplies the
native value for comparison. The adapter reads that target and writes only the public
host value, `setValue`, and `updateValidity` APIs. It does not mutate shadow markup,
poll credentials, replace upstream methods, or call protected `performUpdate`.

Snapshots distinguish the last synchronized native value, last accepted owner, and last rendered
host value. A newer host write takes precedence over stale native text. A native-only
fill is adopted before an unrelated render can erase it. Model commits are deduplicated.
Inferred post-render commits wait for Vue to flush and verify the binding identity, owner value,
and rich-value snapshot. Newer synchronous and queued application updates win. Native events
and submission boundaries remain synchronous. Input watches its actual owner value explicitly;
owner-capture bookkeeping cannot add reactive dependencies to that watcher. Reset defaults remain independent.

Input, OtpInput, NumberInput, and Textarea opt into single-native-field adoption. KnownDate,
TimeInput, and Pro DateInput observe accepted serialized host values only, preserving Date and
range setters. Segmented native fields are never joined by this observer. Select/Combobox search
text and TagInput drafts remain separate from their committed selection or tag domains.
OTP adoption re-reads the public setter's filtered value before publishing or committing it.
The wrapper commits before `wa-complete` callers while retaining the original event,
completion threshold, and cancelable opt-in autosubmit.

Lifecycle observation waits for actual registration and upgrade, then verifies the registered
constructor. HappyDOM's `upgrade()` is a no-op for detached existing elements; those raw hosts
retain the original event binding without invoking nonexistent lifecycle methods. Real-browser
registration and lifecycle behavior remains covered. No emulator-wide native-component import
or lifecycle mock was retained.

The design uses [Lit reactive controllers](https://lit.dev/docs/composition/controllers/)
and the installed Web Awesome implementation. The activation coverage includes
`element.click()`, which [1Password documents for automatic submission](https://www.1password.dev/web/compatible-website-design).
These sources justify the observed integration points; they do not establish a tested
extension version or a universal event sequence.

Two independent design reviews converged on lifecycle observation plus submission
boundaries. An event-only alternative cannot retain silent native fills through a
later render. A forced synchronous Lit render was rejected because the installed
declaration marks `performUpdate` protected.

## Reproduction and regression coverage

Run from the `front-awesome` checkout:

```sh
npm run test:browser -- tests/frontend/input.browser.test.ts
```

Before the first fix, both change-only credential tests failed with:

```text
AssertionError: expected '' to be 'reader@example.com' // Object.is equality
AssertionError: expected '' to be 'example-password' // Object.is equality
```

After adding only `change` handling, the broader five-path matrix still failed with:

```text
Tests  5 failed | 12 passed (17)
AssertionError: expected '' to be 'filled-password' // Object.is equality
```

Before the equal-valued binding review, the combined focused suite passed 86 Core cases and
92 licensed Pro cases, including the six Pro DateInput cases. Input retained its original
27 passing cases; the scalar suite added 52 and Core dates added seven.
The expanded scalar baseline failed 31 of 44 cases before integration.
Four of seven Core date cases originally submitted correct native FormData with stale Inertia data.

Coverage includes email/password fills, Vue and Inertia ownership, original host events,
listener order, clear deduplication, noncomposed input, autocomplete/history restoration,
public host writes, silent native writes, unrelated renders, validation, native FormData,
external forms, submitter identity, Enter, prevented reset, and raw upstream unbound parity.
OTP tests retain `001234`, verify the actual single native text input's `one-time-code` and
numeric-keyboard hints, exercise alphanumeric filtering, and check completion and cancellation.
Two rounds of independent review found different queued and synchronous owner races. Both
have failing-before-fix regressions and now preserve newer Vue and Inertia application values.

## Beginner path and documentation reuse

The starting application has Laravel 13.36 or later within 13.x, PHP 8.5, Inertia 3,
Vue 3.5, Vite, and Node.js 24.11 or later. Front Awesome 1.x remains beta.
The registered overview links to the dedicated Installation page. The installation
sequence remains Composer, Composer-delivered npm dependencies, Vite and theme setup,
the `FrontAwesomeWelcome` Button example, build, and the first visible button.
The overview's toast example separately requires the Vue plugin and a web session.
The Forms guide follows installation and setup and already demonstrates public Input
bindings with defined values and observable output.

This task reuses those existing public components, shared guide layout, and form demo.
The shared binding demo test verifies a change-only fill through public Input. The OTP demo
now uses a named POST form, stable field identity, explicit autocomplete, manual example
submission, and reset. Its code is not a backend verifier. The focused browser script exercises
three fill modes at desktop/mobile widths in both themes and checks the actual native hints.
No new package control, duplicate package implementation, route, or public option was introduced. Overview and installation content remain accurate; no learning
sequence or ancestry change is needed.

The consumer skill now explains autofill and script-submission limits. Boost discovery
in the documentation application lists `front-awesome-development` from the installed
Composer package. The package's archive exclusions retain `resources/boost/skills`.
Matching form-integration requests fit that skill; unrelated database queries do not.
No release archive or agent selection accuracy evaluation is claimed for this
uncommitted development snapshot.

## Dependency refresh and environment

The compatible Composer refresh attempt used:

```sh
composer update 'artisan-toolbox/*' laravel/framework inertiajs/inertia-laravel laravel/head pestphp/pest pestphp/pest-plugin-laravel larastan/larastan laravel/pint --with-all-dependencies --minimal-changes --dry-run --no-scripts --no-interaction
```

The default Homebrew PHP 8.4 executable could not load `libtidy.58.dylib`. Retrying with
Herd PHP 8.5.12 reached resolution but failed DNS for Packagist in the sandbox.
The subsequent lockfile install could not download the two requested GitHub archives.
Existing Composer workspace symlinks remained intact. This task did not author Composer version changes.

After that Composer attempt, the compatible offline npm refresh included the Artisan
Toolbox packages, Web Awesome, Inertia Vue, Vue, Vite Plus, Vue Test Utils, and Playwright.
It failed to resolve cached Inertia metadata. No compatibility constraint was relaxed.
An offline `npm ci` encountered incomplete cache archives; retrying with network access
restored all 382 locked packages. Later `npm ci` refreshes copy the current Composer
package sources. This task did not author npm dependency version or lockfile changes. Other work in this
shared checkout changed lockfiles during the session, including Fortify and vue-i18n updates;
those edits were preserved.

PHP-dependent checks use Herd's PHP 8.5.12. Local browser servers and parallel PHP
checks require execution outside the sandbox's local-port restriction. The documentation
build needs network access for its existing Bunny Fonts pipeline.

## Equal-valued binding regression

A later independent Astra review found that equal values could hide a binding change.
If a silent native fill was pending when the component switched `field` or `form`, the
observer could accept the new binding by value equality and write the old fill into it.
The original eight-case Chromium probe reproduced this for Input, OtpInput, Textarea,
and NumberInput, using either a field switch or a new Inertia form instance.

Captured owners now expose `sameOwner()` independently of `unchanged()`. The observer
rejects inference across binding identities. Both adapters reapply the new binding even
when values match. A true rebind invalidates the rendered baseline and requests an ordinary
public Lit update, so a no-op value setter cannot leave stale native text available for
adoption. No native input assignment or protected update API was added.

The permanent regression matrix adds 16 cases for the four controls, both binding changes,
and both Vue-before-Lit and Lit-before-Vue scheduling orders. The original code failed all 16. The corrected scalar suite passed all 68 cases, including its original 52 tests.
Each new case checks both owners, host/native values, FormData, submission, and a subsequent
successful fill into the new binding.

A fresh Astra review reran the unchanged original eight-case probe successfully and passed
109 focused browser tests, including the model-adapter ownership contracts. Its verdict was
approval with the existing provider, transport, and programmatic-submission limits below.

The compatible dependency-refresh probe ran Composer before npm in read-only offline mode.
Composer could not load uncached Packagist metadata. npm could not resolve cached Inertia
Vue metadata and reported `ERESOLVE` for Dapter's compatible `^3.0.3` peer requirement.
Neither probe changed dependency constraints or lockfiles. A successful `npm ci` then
refreshed the Composer-installed frontend copy for integration checks.

## Validation after the binding correction

| Check                                    | Result                                                                          |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| Original independent failing probe       | All eight Chromium scenarios passed.                                            |
| New binding regressions                  | All 16 failed against the previous code and passed with the correction.         |
| Complete Core browser suite              | 354 passed; two existing skips.                                                 |
| Focused Core and licensed Pro matrices   | 102 Core and 108 Pro cases passed.                                              |
| Complete frontend unit suite             | 313 passed.                                                                     |
| PHP, PHPStan, Pint, type coverage        | 216 tests, 718 assertions, and 100% type coverage passed.                       |
| Core frontend check                      | Formatting, lint, types, theme, generators, inventory, and translations passed. |
| Licensed Pro checks                      | Vue/TypeScript and all 17 generated wrappers passed with Pro 3.14.0.            |
| Package and documentation builds         | Passed.                                                                         |
| Complete documentation frontend suite    | 1,239 passed; two Dapter roadmap assertions failed in one file.                 |
| Canonical Forms route                    | Passed, with 16 assertions.                                                     |
| Demo synchronization and search indexing | Passed, including search check mode.                                            |
| Live OTP example and login               | Desktop/mobile and both themes passed; login requests were intercepted.         |
| Consumer skill discovery                 | Boost listed the updated Composer-delivered skill.                              |

The two documentation failures are in `DapterPages.test.js`. Concurrent Dapter roadmap
edits now describe phase 6 completion and expose 57 completed tasks, while those assertions
still expect the previous phase summary and 53 tasks. The other 104 files passed, including
the affected Front Awesome guide and OTP demo tests. This correction does not edit Dapter's
roadmap or its tests. The complete documentation suite is therefore not green in this checkout.

The final focused V8 run executed 102 Core cases. `observeTextAutofill.ts` reached
98.11% line, 88.98% branch, and 100% function coverage. Its uncovered lines are the explicit
unsupported-value and unavailable-form-API errors. Input reached 96.66% line coverage.
These results describe the focused run, not package-wide coverage.

The reviewed four source files and regression test retained the exact SHA-256 fingerprints
recorded by the final Astra reviewer. The documentation-installed copies of all four source
files matched the package sources byte for byte. The temporary link to the licensed Pro
installation was removed after verification. No release, publication, or commit was made.

Throughput checkpoint: the equal-valued rebind correction stayed within the four existing
observer/adapter files. One shared ownership predicate and the existing public writer avoid
per-component native-input workarounds. The reusable browser matrix proves both scheduling
orders and later valid edits without requiring password-manager vault access.

## Initial validation before the binding review

| Check                                    | Result                                                                                                                                   |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Focused Core and licensed Pro matrices   | 86 Core and 92 Pro cases passed.                                                                                                         |
| Complete Core browser suite              | 338 passed; two existing skips.                                                                                                          |
| Complete frontend unit suite             | 313 passed.                                                                                                                              |
| PHP, PHPStan, Pint, type coverage        | 216 tests, 718 assertions, and 100% type coverage passed.                                                                                |
| Core frontend check                      | Formatting, lint, types, theme, generators, inventory, and translations passed.                                                          |
| Licensed Pro checks                      | Wrapper generation and Vue/TypeScript passed with Pro 3.14.0.                                                                            |
| Package and documentation builds         | Passed.                                                                                                                                  |
| Complete documentation frontend suite    | 1,241 passed across 105 files, with no unhandled errors.                                                                                 |
| Canonical Forms route                    | Passed, with 16 assertions.                                                                                                              |
| Demo synchronization and search indexing | Passed, including search check mode.                                                                                                     |
| Live OTP example                         | Three fill modes passed at 1440 and 390 pixels in both themes, with actual native recognition hints, leading-zero submission, and reset. |
| Live login                               | Desktop/mobile and both themes passed with intercepted requests and no real authentication emails.                                       |

The focused V8 run executes the 86 Core autofill cases. `observeTextAutofill.ts` reaches
97.97% line, 89.42% branch, and 100% function coverage. Its uncovered lines are the explicit
unsupported-value and unavailable-form-API errors. Input reaches 96.62% line coverage.
Package-wide percentages from this subset do not represent complete package coverage.

Earlier concurrent runs timed out in existing DataView and printing cases. Isolated
repetitions and the final complete suites passed without changing those tests. Earlier
documentation runs exposed concurrent Dapter source-copy and demo-coverage changes.
The initial documentation suite passed; this task did not replace those checks or change
their feature implementation.

Current `/.vitest/` attachments are ignored by Git and excluded from Composer archives.
`git check-ignore` and `git check-attr export-ignore` verified both rules. Two staged
images generated by this task's failed printing attempt were removed from staging;
other staged work was preserved.

Fix Root Causes led to one shared observer. Model the Domain preserved Date setters
and rich tag/selection domains. Type System Discipline checks unknown native values
and derives the controller type from the installed API. Prove It Works required actual
visible, owner, and submitted browser values, including independent red-to-green races.

## OTP recognition sources

OtpInput already defaults to `autocomplete="one-time-code"`. Its numeric mode keeps one
native `type="text"` input with `inputmode="numeric"`. The demo declares a stable host ID,
name, and label; a plain Input can declare the same autocomplete and keyboard hints with
its own required length and pattern. A numeric model is unsuitable for leading-zero codes.

The public guide links the [1Password design guidance](https://www.1password.dev/web/compatible-website-design),
[Google's OTP form guidance](https://developer.chrome.com/docs/modern-web-guidance/guides/forms/sms-otp-form),
[Mozilla's autocomplete reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete#one-time-code),
and [Apple's verification-code guidance](https://developer.apple.com/documentation/authenticationservices/securing-logins-with-icloud-keychain-verification-codes).
All describe standard field intent or compatible markup, not a guarantee that every provider
can generate or suggest every code. No vendor-specific recognition attribute was added.
WebOTP retrieval, SMS transport, saved TOTP credentials, and provider availability remain
separate from the component's field recognition and model synchronization.

## Limits

A completely silent native write has no immediate event. It is reconciled at the next
observed render or ordinary form interaction. Scripts must update the bound Vue or
Inertia state directly when submitting without such a boundary.

`form.submit()` bypasses submit listeners. A silent native write followed immediately
by required `requestSubmit()` can fail validation before any submit event exists.
A public host assignment also needs Web Awesome's normal render before native
validation observes the new text. Independent Chromium probes confirmed that the
immediate required host-assignment limit also exists in the raw Web Awesome element.
Neither limitation is hidden by intercepting or replaying submission.
