<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="session-lifecycle"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Session lifecycle
        </h2>
        <p>
            The channel changes when Laravel rotates the session ID or CSRF token, or when the
            application rotates the channel key. Inertia sends the current identifier even on
            partial reloads that omit events. The Vue plugin switches to the new channel or leaves
            the old one when the response has no session identity.
        </p>
        <p>
            Use a server-backed session driver such as database or Redis when logout must revoke new
            subscriptions. After Laravel invalidates or expires the stored session, presenting the
            old cookie can start a new guest session, but its new CSRF token cannot authorize the
            old channel. A rotation that leaves the old session record intact does not revoke that
            record. The cookie session driver cannot revoke replay of an earlier, still-valid cookie
            containing the session data.
        </p>
        <p>
            Invalidating a Laravel session does not disconnect WebSocket subscriptions that the
            broadcaster already accepted. Jobs that send sensitive data must recheck application
            authorization before publishing, especially if they captured the target before logout.
            The Mosaicast guard identifies a browser session and cannot grant access to application
            data.
        </p>
        <p>
            Mosaicast 1.2 replaces the ID-only channel identifiers used by earlier releases. Before
            deploying the upgrade, drain or discard queued notifications that target the old
            identifiers. After deploying, reload open clients so they subscribe to the new channels.
        </p>
        <p>
            Outside a request, pass only an identifier captured with
            <code>Mosaicast::currentSessionIdentifier()</code> to
            <code>Mosaicast::toSession()</code>. The method rejects arbitrary values rather than
            allowing server code to emit to malformed channel names.
        </p>
    </ProseSection>
</template>
