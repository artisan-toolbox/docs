<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const checks = `composer install
npm install
npm run build
composer test
npm run check
npm test -- --run`;
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
                    Start in the Permit package checkout with PHP 8.5, Composer, and npm. Use
                    Node.js ^20.19, ^22.18, or >=24.11. Run these commands from the package root,
                    where its own <code>composer.json</code> and <code>package.json</code> live:
                </p>
                <CodeExample label="Build and validate Permit" :code="checks" />
                <p>
                    Composer installs PHP dependencies before npm prepares the frontend. The
                    frontend build produces the JavaScript entry point and TypeScript declarations
                    consumed through <code>file:vendor/artisan-toolbox/permit</code>.
                </p>
                <p>
                    Keep package behavior covered by its Pest suite. The shared Laravel laboratory
                    complements those tests when evaluating real application discovery and container
                    resolution.
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
                    Permit adopts shared Artisan Toolbox contributor standards version
                    <code>1.1.0</code>. Run the standalone synchronization check from the package
                    root:
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
