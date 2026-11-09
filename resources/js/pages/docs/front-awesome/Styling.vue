<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection id="choose-a-theme" title="Choose a theme">
            <p>
                After Installation and Web Awesome setup, use the optional shared Tailwind theme to
                coordinate application tokens and Web Awesome.
            </p>
            <p>
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/shared-theme').href"
                    >Use the shared Tailwind theme</DocsLink
                >.
            </p>
        </ProseSection>
        <ProseSection id="customize-branding" title="Customize branding">
            <p>
                Set colors, fonts, spacing, radius, shadows, and Web Awesome exceptions in the
                application-owned branding file.
            </p>
            <p>
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/branding').href"
                    >Customize branding</DocsLink
                >.
            </p>
        </ProseSection>
        <ProseSection id="add-primevue" title="Add PrimeVue styling">
            <p>
                PrimeVue is optional. Use its styled preset only when your application already needs
                PrimeVue components.
            </p>
            <p>
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/primevue').href"
                    >Style PrimeVue components</DocsLink
                >.
            </p>
        </ProseSection>
        <ProseSection id="maintain-the-theme" title="Maintain the theme">
            <p>
                Review token ownership and the compatibility record before upgrading Web Awesome or
                adopting an untested Pro release.
            </p>
            <p>
                <DocsLink
                    :href="findNavigationItem(navigation, 'front-awesome/theme-maintenance').href"
                    >Maintain the shared theme</DocsLink
                >.
            </p>
        </ProseSection>
    </article>
</template>
