<script setup>
import InstallCommand from '@/components/docs/InstallCommand.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <ProseSection>
        <h2
            id="installation"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Installation
        </h2>
        <p>
            Start in the root of an existing Laravel application with Vue and
            Inertia 3. Install the backend package before the frontend client:
        </p>
        <InstallCommand
            label="Installation example 1"
            language="bash"
            :package="page.package"
            command="composer"
        />
        <p>
            Laravel discovers the package service provider automatically. Keep
            Laravel's session middleware on routes that call
            <code>Mosaicast::dispatch()</code>. For private broadcasts, enable
            the
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'mosaicast/session-channels')
                        .href
                "
                >broadcast authentication route</DocsLink
            >. Install and register the
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'mosaicast/vue-plugin').href
                "
                >Vue plugin</DocsLink
            >
            to receive events in the browser.
        </p>
    </ProseSection>
</template>
