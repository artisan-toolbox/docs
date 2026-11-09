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
        <ProseSection id="before-you-start" title="Before you start">
            <p>
                Complete Installation in an existing Laravel application with Inertia, Vue, and
                Vite. The Button wrapper needs no toast plugin.
            </p>
            <p>
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                    >Install Front Awesome</DocsLink
                >.
            </p>
        </ProseSection>
        <ProseSection id="register-the-plugin" title="Register the Vue plugin">
            <p>
                Enable toast notifications, appearance controls, or Echo support through the public
                Vue plugin. Follow the guide for each feature's prerequisites.
            </p>
            <p>
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/vue-plugin').href"
                    >Register the Vue plugin</DocsLink
                >.
            </p>
        </ProseSection>
        <ProseSection id="configure-laravel" title="Configure Laravel">
            <p>
                Publish the optional Laravel configuration when you need to change default toast
                icons.
            </p>
            <p>
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/configuration').href"
                    >Configure default toast icons</DocsLink
                >.
            </p>
        </ProseSection>
    </article>
</template>
