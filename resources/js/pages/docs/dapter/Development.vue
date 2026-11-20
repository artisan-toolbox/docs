<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const setup = `composer install
npm ci`;
const checks = `composer quality:check
composer test:types
composer distribution:check
npm run build
npm run build:consumer
npm run check:dist
npm run standards:check`;
const phpstan = `includes:
    - vendor/artisan-toolbox/dapter/extension.neon`;
const minimumPeers = 'DAPTER_CONSUMER_PEERS=minimum npm run check:dist';
const gitArchive = `npm run build
git diff --exit-code HEAD -- dist
mkdir -p build/distribution
git archive --format=zip --output=build/distribution/dapter-git.zip HEAD
php scripts/check-composer-distribution.php build/distribution/dapter-git.zip`;
const readme = 'php vendor/bin/maintainer readme:update --no-interaction';
const logo = 'python3 scripts/build-logos.py';
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="setup" title="Prepare the package checkout">
                <p>
                    Use PHP ^8.5, Composer, and Node.js >=24.11.0. From the Dapter package root,
                    run:
                </p>
                <CodeExample label="Install development dependencies" :code="setup" />
            </ProseSection>
            <ProseSection id="checks" title="Run the complete checks">
                <CodeExample label="Validate the backend and frontend" :code="checks" />
                <p>
                    Both PHPUnit configurations set a 512M memory limit for the test process. The
                    complete Testbench suite can exceed PHP's 128M default even when an individual
                    test passes. This setting applies to direct Pest runs and the Pest process
                    started by Maintainer. CI starts PHP at 128M to verify that the project supplies
                    its own test budget. Your application and system PHP configuration stay
                    unchanged.
                </p>
                <p>
                    For a manual version bump, run <code>npm install --package-lock-only</code> and
                    then <code>npm run release:build</code> from the Dapter package root. Commit the
                    npm lockfile and any changes to <code>dist</code> with the version bump. The
                    built entry embeds the version from <code>package.json</code>.
                </p>
                <p>
                    After committing and before tagging, run these commands from the same directory.
                    The diff should be empty. The archive check confirms that frontend entries, PHP
                    resources, and the consumer skill are present.
                </p>
                <CodeExample
                    label="Verify the committed frontend build and Git archive"
                    :code="gitArchive" />
                <p>
                    CI performs this Git check before installing dependencies. The Ubuntu stable
                    lane also compares the shipped files with a fresh build. A passing local
                    Composer archive alone does not verify what a Git-backed tag will distribute.
                </p>
                <p>
                    <code>composer test</code> runs PHPStan, Pint, PHP type coverage, and Pest. The
                    coverage check gives Pest 512 MB and requires every PHP file in
                    <code>src/</code> to appear in its uncached report with 100% type coverage
                    across the source tree. <code>composer quality:check</code> runs the PHP and
                    frontend suites through Maintainer. Pest uses four processes on Unix and runs
                    serially on Windows.
                </p>
                <p>
                    The configuration integration test publishes <code>dapter.php</code> and builds
                    the Laravel config cache in a temporary application. Use a private application
                    directory for tests that write either file so other Pest workers can boot from
                    the shared Testbench skeleton.
                </p>
                <p>
                    <code>npm run release:build</code> runs the same frontend checks in the release
                    hook. Vitest runs the runtime and type tests together. The release build then
                    builds ESM with declarations and source maps, builds a Vue and Inertia consumer,
                    and installs the npm archive in an isolated consumer. The archive check can
                    resolve runtime peers from an empty npm cache.
                </p>
                <p>
                    The default archive check runs both stable and minimum supported runtime peer
                    lanes. To run only the minimum lane, use the optional contributor command from
                    the package root. The minimum lane derives its versions from the declared peer
                    lower bounds. It currently pins Inertia Vue and Core 3.0.3, Vue 3.5.40, and
                    Ziggy 2.6.5 in the isolated consumer. The stable lane resolves peers within the
                    declared constraints. Both lanes check native Vite, ESM, and strict source and
                    built consumers with Bundler and NodeNext resolution.
                </p>
                <CodeExample label="Validate minimum runtime peers" :code="minimumPeers" />
                <p>
                    The archive check creates a temporary directory alias and resolves its real path
                    before starting Vite. This covers Windows temporary-directory aliases such as
                    <code>RUNNER~1</code> while retaining Vite's filesystem restrictions. The check
                    verifies the resolved root and loads the actual consumer modules. The isolated
                    Node processes set the Inertia form success indicator to expire immediately so
                    they can exit as soon as the assertions finish.
                </p>
                <p>
                    PHPStan and Rector both include source and tests. The Eloquent fixture has no
                    factory, so its file skips only Rector's automatic HasFactory insertion rule.
                    Other transformations and type checks still apply to that fixture. Composer's
                    analysis task uses a 2G memory limit, matching Maintainer's default.
                </p>
                <p>
                    Testbench registers Dapter's provider explicitly so Larastan checks the
                    generator's declared arguments even with a cold discovery manifest. If you
                    installed Composer dependencies with <code>--no-scripts</code>, run
                    <code>composer prepare</code> to refresh package discovery before the complete
                    checks.
                </p>
                <p>
                    GitHub Actions runs the backend and frontend on Ubuntu and Windows with PHP 8.5,
                    Laravel 13, and Node.js 24. Both <code>prefer-lowest</code> and
                    <code>prefer-stable</code> Composer lanes run. The lower frontend lane installs
                    the minimum supported direct tool versions, Vue 3.5.40, Inertia Vue and Core
                    3.0.3, and Ziggy 2.6.5. It does not claim a transitive npm dependency minimum.
                    Vue 3.5.40 preserves public prop extraction and shared slot handle identity.
                    Windows PHPStan uses one worker to avoid shared Testbench bootstrap writes. The
                    configuration check publishes the real file and caches its defaults on both
                    platforms.
                </p>
                <p>
                    Open the failing job in Actions and expand the Maintainer quality step to find
                    the failing tool. PHP type coverage, builds, and distribution checks have their
                    own steps. Each matrix job can run for up to 20 minutes.
                </p>
                <p>
                    Keep both Composer lanes when changing driver types. The Eloquent driver retains
                    its Model bound through query preparation and cloning so PHPStan can resolve
                    hydrated rows with the minimum supported dependencies too. A passing check with
                    the locally installed versions does not replace the lower dependency lane.
                </p>
            </ProseSection>
            <ProseSection id="phpstan" title="Analyze private framework entry points">
                <p>
                    This optional preview integration requires PHPStan 2.3, either directly or
                    through Larastan. Install the analyzer as development tooling in the consuming
                    Laravel application. Dapter does not require PHPStan or Larastan at runtime.
                </p>
                <p>
                    With <code>phpstan/extension-installer</code> installed and allowed in Composer,
                    the next Composer install or update discovers Dapter's
                    <code>extra.phpstan.includes</code> automatically. Without the installer, add
                    this public configuration to the application's <code>phpstan.neon</code>. Remove
                    the manual include if you later enable automatic discovery, because PHPStan
                    rejects duplicate includes:
                </p>
                <CodeExample
                    label="Enable Dapter's optional PHPStan integration"
                    language="yaml"
                    :code="phpstan" />
                <p>
                    Run the application's existing PHPStan command. Private methods marked with
                    <code>Action</code>, <code>GlobalFilter</code>, or <code>GlobalOrder</code> are
                    recognized as framework entry points and do not report
                    <code>method.unused</code>. Ordinary unused private helpers still report that
                    error. The extension preserves all other analysis rules and does not validate
                    handler signatures or replace Dapter's runtime declaration checks.
                </p>
            </ProseSection>
            <ProseSection id="native-backends" title="Run the native backend journey">
                <p>
                    The package's phpunit.native.xml.dist runs the same HTTP acceptance cases on
                    arrays, Collections, SQLite, MySQL, and PostgreSQL. The dedicated
                    backend-databases workflow provisions MySQL 8.4 and PostgreSQL 18 services.
                    Local verification recorded SQLite 3.45.2, MySQL 8.4.11, and PostgreSQL 18.6.
                    These are measured fixture versions, not a claim about every patch release.
                </p>
                <p>
                    Before running the native configuration, provision disposable databases whose
                    names start with dapter_. Supply DAPTER_MYSQL_DATABASE and DAPTER_PGSQL_DATABASE
                    plus each service's HOST, PORT, USERNAME, and PASSWORD variables. The suite
                    recreates its own dapter_native_records table inside those databases. Run php
                    vendor/bin/pest --configuration=phpunit.native.xml.dist from the Dapter package
                    root. Missing services or unsafe database names fail the native gate rather than
                    skipping it. The default SQLite suite does not replace that native gate.
                </p>
                <p>
                    The journey checks identical base inputs, scope preservation, total and filtered
                    counts, literal metacharacters, strict values, native comparison differences,
                    default and selected ordering, and rejection before protected source work. The
                    documentation's
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/field-search').href"
                        >field search guide</DocsLink
                    >
                    records the observed collation policy. The default Vue adapter remains on
                    protocol v1. Explicit protocol 2 enables the delivered field controls, URL
                    namespaces, and targeted scrolling.
                </p>
            </ProseSection>
            <ProseSection id="typescript" title="Maintain the frontend contract">
                <p>
                    The Vite entry exposes TypeScript source from
                    <code>resources/js/index.ts</code>. The optional
                    <code>@artisan-toolbox/dapter/dist</code> entry exposes the generated ESM build
                    after <code>npm run build</code>. Generated <code>.d.ts</code> declarations and
                    declaration maps accompany that build. Vue, Inertia Vue and Core, and Ziggy are
                    runtime peers for the implemented headless adapter. Use one entry point
                    consistently. Do not mix a source-entry handle with a component from the built
                    entry, or the reverse.
                </p>
                <p>
                    TypeScript checks strict null handling, indexed access, exact optional
                    properties, unused symbols, and module syntax. Consumer checks cover Bundler and
                    NodeNext resolution for the component and its decoded slot types, unsupported
                    props, readonly records, source-only unknown rows, and the existing version. Use
                    Vue-aware checking for the source entry. Native action options use the exact
                    installed Inertia types with Bundler resolution. NodeNext uses
                    compiler-generated conservative native options from the minimum supported
                    Inertia 3.0.3 declarations, because the SDK public declaration graph has
                    extensionless imports. The distribution check regenerates and verifies that
                    compatibility declaration. NodeNext does not promise newer SDK-only fields such
                    as Page.rescuedProps; Bundler exposes the installed version's fields. Both modes
                    retain consumer InertiaConfig augmentation for errors, shared page props, and
                    flash data. Runtime callbacks still receive native objects. Runtime peers and
                    supported versions remain unchanged. Decoders may return application value
                    objects. Their native methods retain their behavior; plain object and array
                    structure is readonly.
                </p>
                <p>
                    From the package root, <code>npm run native-types:generate</code> regenerates
                    the NodeNext baseline from an isolated installation of the exact minimum public
                    Inertia SDK. <code>npm run native-types:check</code> verifies the generated file
                    without changing it. Both commands require registry access and remove their
                    temporary installation afterward. The minimum packed-consumer lane runs the same
                    verification.
                </p>
                <p>
                    Consuming Vite applications must use the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/installation').href +
                            '#vite-config'
                        "
                        >required Vue source configuration</DocsLink
                    >. After refreshing their copied frontend dependency types, restart the Vite
                    development process with <code>--force</code> before checking updated APIs.
                </p>
            </ProseSection>
            <ProseSection id="functional-demos" title="Verify every delivered setting">
                <p>
                    Use the package's Dapter implementation skill for each change. Every delivered
                    option, configuration key, attribute, factory mode, command option, and frontend
                    prop needs a functional public-API example in this documentation application.
                    Prefer the supported Front Awesome components. Keep fixtures isolated and wait
                    for the reader's Start action.
                </p>
                <CodeExample
                    label="Run from the documentation application root"
                    code="npm run dapter:demos:check" />
                <p>
                    The check discovers the implemented settings and verifies their coverage
                    registry, then runs the real package-backed demo tests and frontend interaction
                    tests. A new setting without a demo fails this gate.
                </p>
                <CodeExample
                    label="Verify the live demos against the local documentation application"
                    code="DOCS_BASE_URL=https://atb.test npm run test:dapter" />
                <p>
                    Start the local documentation application and install Playwright Chromium before
                    running this browser check. It loads every declared scenario through the real
                    endpoint and compares its records with the native Front Awesome grid. Keep
                    source edits and fixture-generating PHP tests idle during this run to avoid
                    development hot reloads. Package tests and the complete validation suite remain
                    required.
                </p>
            </ProseSection>
            <ProseSection id="identity" title="Maintain the version and README">
                <p>
                    <code>ArtisanToolbox\Dapter\Dapter</code> implements <code>Versionable</code>,
                    <code>BeforeVersioning</code>, and <code>WithReadmeHead</code>. When you run
                    <code>php vendor/bin/maintainer release:create</code> from the package root,
                    Dapter writes the selected version to <code>package.json</code> and
                    <code>package-lock.json</code>. It runs
                    <code>npm run release:build</code> before Maintainer commits the release. If
                    either npm command fails, the release stops before the commit and tag.
                </p>
                <p>
                    Regenerate the managed README header after changing <code>readmeHead()</code>.
                </p>
                <CodeExample label="Regenerate the README header" :code="readme" />
                <p>
                    Keep manual README content outside the generated markers. Use
                    <code>1.x</code> for development and changelog automation.
                </p>
            </ProseSection>
            <ProseSection id="artwork" title="Maintain the package artwork">
                <p>
                    The logo shows stored data passing through a coral adapter into a page. It uses
                    the shared charcoal tile, cream, coral, and peach palette. The three SVG
                    variants live in <code>logo/</code> and contain vector paths, including the
                    wordmark.
                </p>
                <CodeExample label="Rebuild the package logos" :code="logo" />
                <p>
                    The builder needs Python, fonttools, and macOS Avenir Next Bold. Use
                    <code>--font</code> and <code>--font-number</code> to select an equivalent local
                    font explicitly. The workspace Font Awesome export registry owns the duotone
                    conversion and validation. The published icon uses
                    <code>fa-kit-duotone fa-atb-dapter</code>. The documentation consumes it through
                    the shared <code>SiteIcon</code> package map. See the
                    <DocsLink
                        href="https://docs.fontawesome.com/web/add-icons/upload-icons/prep-icons"
                        >Font Awesome upload requirements</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
