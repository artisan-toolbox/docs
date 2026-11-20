<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });

const checks = `composer install
composer test
composer test:distribution`;
</script>

<template>
    <ProseSection>
        <h2
            id="development"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Development
        </h2>
        <p>
            Run the checks from the Core checkout with PHP 8.5, Composer, and Git. The distribution
            check also needs the PHP Zip extension and access to the Composer dependency registry.
        </p>
        <p>The commands below describe the Maintainer 1.14.3 integration on Core's 1.x branch.</p>
        <CodeExample label="Validate Core and its distribution" :code="checks" />
        <p>
            <code>composer test</code> runs <code>composer quality:check</code> and type coverage.
            The quality check uses Maintainer's strict mode for PHPStan, Pint, and Pest. It fails if
            a required tool cannot run. Pest runs serially by default for this small suite. Set
            <code>MAINTAINER_PEST_PARALLEL=true</code> to try two workers on Unix.
        </p>
        <p>
            Type coverage must report all PHP files in <code>src/</code> and meet the 100%
            threshold. The distribution check installs a ZIP of the checked-out commit in a
            temporary Laravel 13 application. It verifies that Laravel discovers Core,
            <code>Arr::sift()</code> works, and the package contains the Boost skill.
        </p>
        <p>
            GitHub Actions tests the lowest and stable Composer dependency resolutions on Ubuntu and
            Windows. The root <code>artisan-toolbox/maintainer</code> action sets up PHP and
            Composer, validates the manifest in strict mode, and installs dependencies with
            <code>--no-scripts</code>. It caches Composer downloads. Core runs Testbench discovery
            after installation, then runs <code>composer quality:check</code> in each matrix entry.
            Type coverage runs on Ubuntu, and the distribution check runs on Ubuntu with stable
            dependencies.
        </p>
        <p>
            Maintainer requires a successful <code>tests.yml</code> push run for the exact release
            commit. Each pushed commit gets its own run. New commits on a pull request cancel its
            previous run. Use <strong>Run workflow</strong> on the <strong>Actions</strong> tab to
            start a manual run for debugging.
        </p>
        <p>
            Core requires Larastan 3.12.1 or later in the 3.x series for development. This minimum
            resolves PHPStan 2.2.14 or later in the 2.x series on Ubuntu and Windows. It includes
            the Turbo parser fix for missing PHPDoc comments on Windows.
        </p>
    </ProseSection>
</template>
