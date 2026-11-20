<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="development"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Development
        </h2>
        <p>
            Run <code>composer analyse</code> from the package root. Larastan uses the package's
            <code>config/</code> directory to recognize valid <code>env()</code> calls, including
            those in local Maintainer configuration.
        </p>
        <p>
            Larastan 3.12.1 or later in the 3.x series supplies PHPStan 2.2.14 or later in the 2.x
            series. Both CI runners use that requirement, which includes the Windows Turbo parser
            fix for missing PHPDoc comments.
        </p>
        <p>
            Run <code>composer test</code> to check analysis, formatting, type coverage, and runtime
            behavior. Actions tests PHP 8.5 and 8.6 on Ubuntu and Windows with the lowest and stable
            dependency resolutions. The type coverage command requires a complete report for the
            files Pest can analyze.
        </p>
    </ProseSection>
</template>
