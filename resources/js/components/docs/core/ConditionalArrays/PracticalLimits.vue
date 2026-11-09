<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="practical-limits"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Practical limits
        </h2>
        <p>
            <code>sift()</code> is for constructing data, not filtering an existing domain
            collection by predicate. Use Laravel's <code>filter()</code> when the decision depends
            on each item. Do not rely on a particular concrete type for custom
            <code>Traversable</code> objects: Core preserves arrays, Collections, and
            LazyCollections, but represents other traversables lazily to avoid consuming or
            reconstructing them incorrectly.
        </p>
        <p>
            Core registers <code>sift</code> as a Laravel macro on <code>Arr</code>,
            <code>Collection</code>, and <code>LazyCollection</code>. If another package defines a
            macro with the same name, review the registration order and keep one owner for that
            public API.
        </p>
    </ProseSection>
</template>
