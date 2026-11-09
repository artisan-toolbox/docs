<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `php artisan vendor:publish --tag="core"`;
const example2 = `php artisan vendor:publish --tag="core-config"
php artisan vendor:publish --tag="core-migrations"
php artisan vendor:publish --tag="core-views"
php artisan vendor:publish --tag="core-lang"
php artisan vendor:publish --tag="core-assets"`;
const example3 = `php artisan migrate`;
</script>

<template>
    <ProseSection>
        <h2
            id="published-resources"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Published resources
        </h2>
        <p>
            The features above work without publishing resources or running migrations. Run the
            following command to publish all bundled resources together.
        </p>
        <CodeExample label="Published resources example 1" language="bash" :code="example1" />
        <p>
            Individual publish tags are available for configuration, migrations, views,
            translations, and public assets:
        </p>
        <CodeExample label="Published resources example 2" language="bash" :code="example2" />
        <p>
            The bundled migration creates a <code>core_placeholder</code> table. Run it only if you
            need that table in a development application.
        </p>
        <CodeExample label="Published resources example 3" language="bash" :code="example3" />
    </ProseSection>
</template>
