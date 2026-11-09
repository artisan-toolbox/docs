<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
</script>

<template>
    <div class="flex min-w-0 flex-col gap-10">
        <ProseSection id="contribution-conventions" title="Contribution conventions">
            <p>
                Contributions must include automated tests for observable behavior and keep
                documentation synchronized with changed commands.
            </p>
            <p>
                The current dependency lock uses Symfony Filesystem, HttpFoundation, HttpKernel, and
                YAML 8.1.11. These patches address seven security advisories affecting the previous
                locked versions. Rebuild the PHAR after installing security updates so the
                distributed executable includes them. Run
                <code>composer audit --locked</code> to check the lockfile against current
                advisories. An abandoned development dependency can still appear as an audit warning
                without a vulnerability advisory.
            </p>
            <p>
                Prefer native PHP attributes whenever the framework or library provides an attribute
                equivalent to legacy metadata properties or configuration. Console commands should
                use Laravel's
                <code>Signature</code> and <code>Description</code> attributes instead of the
                <code>$signature</code> and <code>$description</code> properties. Use a legacy form
                only when no compatible attribute exists.
            </p>
        </ProseSection>
    </div>
</template>
