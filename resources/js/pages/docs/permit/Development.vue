<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const checks = `composer install
npm ci
composer test
npm run release:build
git diff --exit-code -- dist`;
const sharedCache = `PERMIT_INTEGRATION_DB=pgsql PERMIT_INTEGRATION_CACHE=redis php vendor/bin/pest tests/Feature/AuthorizationIntegrationTest.php
PERMIT_INTEGRATION_DB=mariadb PERMIT_INTEGRATION_CACHE=memcached php vendor/bin/pest tests/Feature/AuthorizationIntegrationTest.php`;
const standards = 'npm run standards:check';
const logos = 'python3 scripts/build-logos.py';
const readme = 'php vendor/bin/maintainer readme:update --no-interaction';
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="checks" title="Run package checks">
                <p>
                    Start in the Permit package checkout with PHP 8.5 and Composer. Use Node.js
                    24.11 or later in the Node.js 24 release line to match CI. Run these commands
                    from the package root, where its own <code>composer.json</code> and
                    <code>package.json</code> live.
                </p>
                <CodeExample label="Build and validate Permit" :code="checks" />
                <p>
                    Composer installs PHP dependencies before npm installs from the frontend lock
                    file. The release build runs the Vite+ checks, Vitest, and TypeScript analysis.
                    It builds the JavaScript and type declarations and verifies the distribution
                    imports. The final command reports any changes to the committed files in
                    <code>dist/</code>.
                </p>
                <p>
                    Keep package behavior covered by its Pest suite. The shared Laravel laboratory
                    complements those tests when evaluating real application discovery and container
                    resolution.
                </p>
                <p>
                    Maintainer runs Pest with two workers on Unix and serially on Windows. Each
                    Testbench test gets its own temporary bootstrap directory before Laravel
                    registers service providers. The test removes that directory during teardown.
                    Keep cache setup in the base test case so parallel processes cannot write to the
                    same <code>services.php</code>.
                </p>
                <p>
                    When changing refactoring rules, run
                    <code>php vendor/bin/rector process --dry-run</code> before
                    <code>composer test</code>. The test user models in
                    <code>tests/Fixtures</code> use direct Eloquent inserts. The factory rule is
                    scoped to exclude those fixtures. The <code>test:types</code> script gives
                    Pest's type coverage workers a 512 MB memory limit.
                </p>
                <p>
                    GitHub Actions runs the test matrix on Linux and Windows with the lowest and
                    stable Composer dependency resolutions. If one matrix entry fails, the remaining
                    entries run to completion. Use the manual <strong>Run workflow</strong> control
                    on the <strong>Actions</strong> tab to start a fresh run.
                </p>
                <p>
                    CI also runs the authorization integration test with PostgreSQL and Redis, and
                    with MariaDB and Memcached. To reproduce either job, start the matching services
                    on their default local ports and enable their PHP extensions. Create the
                    <code>permit_testing</code> database with <code>permit_test</code> as the test
                    username and password.
                </p>
                <CodeExample label="Run the shared-cache integration test" :code="sharedCache" />
            </ProseSection>
            <ProseSection id="standards" title="Check contributor standards">
                <p>
                    Run the standalone check from the package root. It reports the installed version
                    of the shared contributor standards and any pending files.
                </p>
                <CodeExample label="Check installed contributor standards" :code="standards" />
                <p>
                    The package's <code>.ai/sync.mjs</code> tool keeps its generated
                    <code>.ai</code> and <code>.agents</code> guidance synchronized. Update those
                    copies through that tool and preserve specialized package skills. The same check
                    runs in CI.
                </p>
            </ProseSection>
            <ProseSection id="artwork" title="Rebuild package artwork">
                <p>
                    Use Python with <code>fontTools</code> installed. The package script defaults to
                    Avenir Next Bold at font index <code>0</code> in macOS's
                    <code>/System/Library/Fonts/Avenir Next.ttc</code>. On another system, pass
                    <code>--font</code> and <code>--font-number</code> explicitly. Run from the
                    Permit package root:
                </p>
                <CodeExample label="Rebuild the Permit logos" :code="logos" />
                <p>
                    <code>scripts/build-logos.py</code> recreates the light, dark, and icon SVGs in
                    <code>logo/</code>. Copy these three full-color files into the documentation
                    application's <code>public/images/packages/permit/</code> directory.
                </p>
                <p>
                    The workspace builder at
                    <code>artifacts/fontawesome-upload/scripts/build.py</code> owns the monochrome
                    and duotone upload exports. The existing Font Awesome kit publishes the duotone
                    identity as <code>atb-permit</code>. The documentation uses its shared
                    <code>SiteIcon</code> mapping with <code>family="kit-duotone"</code>.
                </p>
            </ProseSection>
            <ProseSection id="identity" title="Maintain the package identity">
                <p>
                    <code>ArtisanToolbox\Permit\Permit</code> implements Maintainer's
                    <code>Versionable</code> and <code>WithReadmeHead</code> contracts. Its
                    <code>VERSION</code> constant declares the source version. Composer's
                    <code>1.x-dev</code> branch label remains separate from that constant and from a
                    published release. The identity also implements <code>BeforeVersioning</code>.
                    Before Maintainer proceeds with versioning, this hook runs
                    <code>npm run release:build</code> from the package root. That command checks
                    formatting, lint, frontend types, tests, build outputs, and distribution
                    imports. A failed command stops versioning.
                </p>
                <p>
                    Edit <code>readmeHead()</code> for managed package metadata. Then regenerate the
                    README from the package root:
                </p>
                <CodeExample label="Regenerate the Permit README head" :code="readme" />
                <p>
                    Keep manual README content outside the generated markers. Package artwork lives
                    under <code>logo/</code>; synchronize its theme variants with the central
                    documentation when the artwork changes.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
