<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="authorization-requirements"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Authorization requirements
        </h2>
        <p>
            Mosaicast registers the channel authorization rule and the
            <code>mosaicast-session</code> guard automatically. The guard identifies the current
            session through its HMAC identifier; the channel rule admits only an identifier that
            matches it. This works for guests and signed-in users, but it does not grant any
            application permissions.
        </p>
        <p>
            Use the same Echo/Reverb connection and authorization endpoint as other private channels
            in the application. A subscription to
            <code>mosaicast.sessions.&#123;identifier&#125;</code> requires the matching session ID
            and CSRF token in the current Laravel session. Guest sessions receive a token from
            Laravel when they start.
        </p>
        <p>
            If the browser never requests channel authorization, verify that the Inertia page
            contains <code>mosaicastSessionIdentifier</code>, an Echo instance is passed to
            <code>createMosaicast</code>, and broadcasting is enabled. If authorization is rejected,
            verify that <code>/broadcasting/auth</code> receives the session cookie, the requested
            channel name uses the configured prefix, and any cross-origin setup permits stateful
            requests from the frontend origin.
        </p>
    </ProseSection>
</template>
