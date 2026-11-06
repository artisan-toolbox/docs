<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <p>
            Core adds <code>sift()</code> macros to Laravel's <code>Arr</code>,
            <code>Collection</code>, and <code>LazyCollection</code> utilities,
            plus the namespaced <code>sift_when()</code> helper. Together they
            build arrays and collections whose entries depend on runtime
            conditions. A rejected value becomes an internal marker;
            <code>sift()</code> removes those markers recursively.
        </p>
        <p>
            Install <code>artisan-toolbox/core</code> if the application does
            not already receive it through another Artisan Toolbox package.
            Laravel discovers Core's service provider and registers the macros
            automatically; Composer autoloads the namespaced helper.
        </p>
        <p>
            This is useful for payloads, configuration fragments, and other
            arrays built outside Laravel API resources, where
            <code>$this-&gt;when()</code> is not available.
        </p>
    </ProseSection>
</template>
