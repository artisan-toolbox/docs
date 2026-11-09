<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="delivery-sequence"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Delivery sequence
        </h2>
        <ol class="list-decimal pl-5">
            <li>
                <p>Call <code>Mosaicast::dispatch()</code> in a request.</p>
            </li>
            <li>
                <p>
                    If Inertia resolves <code>mosaicast</code>, the event appears in
                    <code>mosaicast.events</code>.
                </p>
            </li>
            <li>
                <p>
                    Otherwise, Mosaicast broadcasts to the current session's private channel after
                    Laravel builds the response and before it returns it.
                </p>
            </li>
            <li>
                <p>
                    In a job, capture
                    <code>Mosaicast::currentSessionIdentifier()</code> in the request and call
                    <code>Mosaicast::toSession($identifier)</code> or
                    <code>mosaicast()-&gt;toSession($identifier)</code> in the job.
                </p>
            </li>
        </ol>
        <p>
            Select the target on the server with
            <code>Mosaicast::currentSessionIdentifier()</code> during a session-backed request. Pass
            that opaque identifier to a job, then use
            <code>Mosaicast::toSession($identifier)-&gt;dispatch(...)</code>
            in the worker. The worker broadcasts directly to that session's private channel without
            another Inertia response.
        </p>
        <p>
            With broadcasting and Echo configured, the package authorizes the channel against the
            connecting browser's session. This also works for guests. The identifier is not a raw
            session ID or an application user ID, and channel authorization does not replace your
            application's permission checks before dispatch. Realtime broadcasts require a connected
            subscriber and do not provide durable replay or exactly-once delivery.
        </p>
        <p>
            The shared <code>mosaicastSessionIdentifier</code> prop is included in every Inertia
            response, including partial reloads that omit events. It lets the client keep its
            private channel current without consuming events that need the broadcast fallback.
        </p>
    </ProseSection>
</template>
