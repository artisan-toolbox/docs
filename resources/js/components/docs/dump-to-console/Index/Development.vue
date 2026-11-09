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
            On Windows, Dump to Console's CI requires PHPStan 2.2.8 or later in the 2.x series. This
            version fixes a Turbo parser bug that can drop PHPDoc comments during static analysis.
        </p>
    </ProseSection>
</template>
