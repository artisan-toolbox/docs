<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `Plan::query()->where('label', 'plans.starter')->get();`;
</script>

<template>
    <ProseSection>
        <h2
            id="storage-and-missing-translations"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Storage and missing translations
        </h2>
        <p>
            Assigning an attribute does not translate it before persistence. The
            database continues to contain <code>plans.starter</code>, so queries
            must use the stored key:
        </p>
        <CodeExample
            label="Storage and missing translations example 1"
            language="php"
            :code="example1"
        />
        <p>
            When Laravel cannot find a translation, it returns the stored string
            unchanged. This also allows literal values such as
            <code>Custom plan</code> to pass through when they do not match a
            translation key. A database <code>null</code> remains
            <code>null</code>.
        </p>
        <p>
            The resolved language line must be a string. Do not cast an
            attribute containing a translation group key such as
            <code>plans</code>; Laravel rejects array-valued translations for
            this string cast.
        </p>
        <p>
            Use this cast for application-owned labels. Store user-authored
            multilingual content in a dedicated localization structure instead,
            because this cast stores only one stable key or literal string.
        </p>
    </ProseSection>
</template>
