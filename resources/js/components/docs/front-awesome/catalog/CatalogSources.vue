<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
</script>

<template>
    <ProseSection id="catalog-scope" title="Catalog scope">
        <p>
            Inventory reviewed on 2026-11-09 against the
            <DocsLink href="https://webawesome.com/docs/">official Web Awesome groups</DocsLink>
            and the Core 3.14.0 custom-elements manifest. All 73 Core elements from that baseline
            appear once, alongside 17 documented Pro elements. Code Highlighter is an additional
            upstream 3.15 experimental element, outside the 3.14.0 baseline.
        </p>
        <p>
            The catalog tracks planned Vue wrapper coverage. Core and Pro describe upstream access,
            separately from implementation status.
        </p>
    </ProseSection>
</template>
