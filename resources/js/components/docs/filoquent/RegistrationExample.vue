<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
const example = `use ArtisanToolbox\\Filoquent\\Filoquent;

$filoquent = app(Filoquent::class);

dump($filoquent === app(Filoquent::class));`;
</script>

<template>
    <ProseSection id="verify-registration" title="Verify registration">
        <p>
            After Composer installation, run this code inside a Laravel route or command in your
            application. No database, model, disk configuration, worker, or frontend build is
            required.
        </p>
        <CodeExample label="Verify the Filoquent singleton" language="php" :code="example" />
        <p>
            The dump is <code>true</code>. Both container resolutions return the same instance. This
            checks package registration without storing a file.
        </p>
    </ProseSection>
</template>
