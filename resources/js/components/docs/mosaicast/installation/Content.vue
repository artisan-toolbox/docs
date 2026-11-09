<script setup>
import InstallCommand from '@/components/docs/InstallCommand.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import Requirements from '@/components/docs/Requirements.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import InstallPackage from '@/components/docs/mosaicast/Index/Installation.vue';
import FirstEvent from '@/components/docs/mosaicast/Index/FirstEvent.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const plugin = `import { createInertiaApp } from '@inertiajs/vue3';
import { createMosaicast } from '@artisan-toolbox/mosaicast';

void createInertiaApp({
    // Keep the application's existing page resolver and other options.
    withApp(app, { ssr }) {
        if (!ssr) {
            app.use(createMosaicast());
        }
    },
});`;
</script>

<template>
    <div data-document-content class="flex min-w-0 flex-col gap-10">
        <ProseSection>
            <p>
                Receive a Laravel event in your browser through an Inertia response. Start with this
                path before adding private broadcasts.
            </p>
        </ProseSection>
        <Requirements :items="page.requirements">
            <p>
                Use an existing Laravel application with Vue and Inertia 3. Run Composer and npm
                from its root. Keep a nonempty
                <code>APP_KEY</code> and working web sessions.
            </p>
            <p>
                Reverb, Echo, queues, and a broadcast server are optional for this first Inertia
                event. They are required only when you choose the corresponding broadcast delivery
                path.
            </p>
        </Requirements>
        <InstallPackage :page="page" :navigation="navigation" />
        <ProseSection id="install-the-frontend" title="Install the frontend client">
            <p>
                After Composer finishes, install the compiled JavaScript client from its vendor
                directory:
            </p>
            <InstallCommand
                label="Install the Mosaicast client"
                language="bash"
                :package="page.package"
                command="frontend" />
            <p>
                The command records <code>@artisan-toolbox/mosaicast</code> as a
                <code>file:vendor/artisan-toolbox/mosaicast</code> dependency. Composer ships the
                compiled ESM client and declarations in <code>dist/</code>.
            </p>
            <p>
                Set <code>install-links=true</code> in your application's <code>.npmrc</code>. Run
                Composer before npm in development, CI, and deployments. After replacing the
                Composer package, refresh the installed frontend copy with <code>npm ci</code>.
            </p>
        </ProseSection>
        <ProseSection id="register-the-client" title="Register the client">
            <p>
                In your existing Inertia entry point, register the plugin through
                <code>withApp</code>. Preserve your page resolver and existing plugins. If the entry
                point already has <code>withApp</code>, add the registration to that callback. If
                your entry point uses a custom <code>setup</code>, register
                <code>createMosaicast()</code> on the Vue app inside that callback instead. Inertia
                does not combine a custom <code>setup</code> with <code>withApp</code>.
            </p>
            <CodeExample
                label="Register Mosaicast for Inertia events"
                language="js"
                :code="plugin" />
            <p>
                No Echo instance is needed for Inertia delivery. Build your application with
                <code>npm run build</code>, or use its existing Vite development command.
            </p>
        </ProseSection>
        <div id="send-your-first-event" class="scroll-mt-28">
            <FirstEvent :navigation="navigation" />
        </div>
        <ProseSection id="next-steps" title="Next steps">
            <ol>
                <li>
                    Read
                    <DocsLink :href="findNavigationItem(navigation, 'mosaicast/vue-plugin').href"
                        >Vue plugin</DocsLink
                    >
                    for listener cleanup and diagnostics.
                </li>
                <li>
                    Use
                    <DocsLink
                        :href="findNavigationItem(navigation, 'mosaicast/inertia-delivery').href"
                        >Inertia delivery</DocsLink
                    >
                    for request boundaries.
                </li>
                <li>
                    For private broadcasts, follow
                    <DocsLink
                        :href="findNavigationItem(navigation, 'mosaicast/session-channels').href"
                        >session channels</DocsLink
                    >
                    to configure the broadcaster, Echo, authentication route, and running services.
                </li>
            </ol>
        </ProseSection>
    </div>
</template>
