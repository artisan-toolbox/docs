<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="enable-broadcasting-in-the-host-application"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Enable broadcasting in the host application
        </h2>
        <p>
            Mosaicast uses Laravel's configured broadcaster. To use Reverb, run
            <code>php artisan install:broadcasting</code>, configure the broadcast connection, and
            start the Reverb server in the target environment. Laravel's
            <DocsLink href="https://laravel.com/framework/docs/13.x/broadcasting"
                >broadcasting guide</DocsLink
            >
            covers installation, the authentication route, and Reverb's client configuration.
        </p>
        <p>
            Keep the broadcast authentication endpoint on middleware that can read the same Laravel
            session cookie as the Inertia pages. Laravel normally exposes
            <code>/broadcasting/auth</code> when broadcasting is installed; if that route is absent,
            register the application's channel routes using Laravel's normal broadcasting setup.
            Mosaicast registers its own channel rule automatically, including when Laravel caches
            HTTP routes, so the host application does not need to duplicate it in
            <code>routes/channels.php</code>.
        </p>
    </ProseSection>
</template>
