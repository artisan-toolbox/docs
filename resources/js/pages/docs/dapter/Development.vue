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
const checks = `composer test
composer quality:check
composer distribution:check
npm run release:build
npm run standards:check`;
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
                    Composer runs PHPStan, Pint, PHP type coverage, and Pest. Maintainer runs Pest,
                    Pint, Vite Plus checks and tests, vue-tsc, and PHPStan without skipping tools.
                    The frontend release check also runs type tests, builds ESM with declarations
                    and source maps, builds a Vue and Inertia consumer, and installs an npm archive
                    in an isolated consumer.
                </p>
                <p>
                    PHPStan and Rector both include source and tests. The Eloquent fixture has no
                    factory, so its file skips only Rector's automatic HasFactory insertion rule.
                    Other transformations and type checks still apply to that fixture.
                </p>
                <p>
                    GitHub Actions runs the backend and frontend on Ubuntu and Windows with PHP 8.5,
                    Laravel 13, and Node.js 24. Both <code>prefer-lowest</code> and
                    <code>prefer-stable</code> Composer lanes run. The lower frontend lane installs
                    the minimum supported direct tool versions; it does not claim a transitive npm
                    dependency minimum. Windows PHPStan uses one worker to avoid shared Testbench
                    bootstrap writes.
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
                    Vue-aware checking for the source entry. Decoders may return application value
                    objects. Their native methods retain their behavior; plain object and array
                    structure is readonly.
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
                    <code>ArtisanToolbox\Dapter\Dapter</code> implements
                    <code>Versionable</code> and <code>WithReadmeHead</code>. Keep its
                    <code>VERSION</code> synchronized with <code>package.json</code>, and regenerate
                    the managed README header after changing <code>readmeHead()</code>:
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
