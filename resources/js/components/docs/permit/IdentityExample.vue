<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const identity = `use ArtisanToolbox\\Permit\\Permit;

dump(app(Permit::class) instanceof Permit);
dump(Permit::VERSION);`;
</script>

<template>
    <ProseSection id="verify-package-identity" title="Verify package identity">
        <p>
            After installation, run <code>php artisan tinker</code> from your Laravel application
            root. Paste this example into the Tinker prompt:
        </p>
        <CodeExample label="Resolve the Permit identity" language="php" :code="identity" />
        <p>
            The output contains <code>true</code> and your installed version, such as
            <code>"1.0.0-beta.3"</code>. Laravel resolves the shared Permit instance through its
            automatically discovered service provider.
        </p>
    </ProseSection>
</template>
