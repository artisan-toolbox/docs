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
        <ProseSection id="prepare-notifications" title="Prepare notifications">
            <p>
                Complete Installation and register the Vue plugin before sending a toast. Laravel
                flash delivery also needs an active web session and an Inertia response.
            </p>
            <p>
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/vue-plugin').href"
                    >Register the Vue plugin</DocsLink
                >.
            </p>
        </ProseSection>
        <ProseSection id="send-from-laravel" title="Send from Laravel">
            <p>
                Use the Laravel facade to configure notifications and choose flash or broadcast
                delivery. Broadcast delivery has additional Echo and queue prerequisites.
            </p>
            <p>
                <DocsLink
                    :href="findNavigationItem(navigation, 'front-awesome/toasts/laravel').href"
                    >Send toasts from Laravel</DocsLink
                >.
            </p>
        </ProseSection>
        <ProseSection id="send-from-vue" title="Send from Vue">
            <p>
                Use the Vue toast service for browser-side notifications and typed options. Toast
                services are integrations, not Vue wrappers for every Web Awesome toast component.
            </p>
            <p>
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/toasts/vue').href"
                    >Send toasts from Vue</DocsLink
                >.
            </p>
        </ProseSection>
    </article>
</template>
