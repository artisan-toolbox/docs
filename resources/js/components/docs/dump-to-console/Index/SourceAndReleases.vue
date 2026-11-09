<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="source-and-releases"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Source and releases
        </h2>
        <ul>
            <li>
                <p>
                    <DocsLink href="https://github.com/artisan-toolbox/dump-to-console"
                        >Source code</DocsLink
                    >
                </p>
            </li>
            <li>
                <p>
                    <DocsLink href="https://packagist.org/packages/artisan-toolbox/dump-to-console"
                        >Packagist releases</DocsLink
                    >
                </p>
            </li>
        </ul>
    </ProseSection>
</template>
