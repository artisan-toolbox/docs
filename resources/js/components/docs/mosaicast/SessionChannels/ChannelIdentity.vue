<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `HMAC-SHA-256(session ID + NUL + session CSRF token, session channel key)`;
const example2 = `private-mosaicast.sessions.{session-identifier}`;
</script>

<template>
    <ProseSection>
        <h2
            id="channel-identity"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Channel identity
        </h2>
        <p>Mosaicast derives an opaque session identifier with HMAC-SHA-256:</p>
        <CodeExample label="Channel identity example 1" language="text" :code="example1" />
        <p>
            Mosaicast sends only the derived identifier. It reads the ID and CSRF token from the
            session that Laravel already loaded. By default, the private channel name is:
        </p>
        <CodeExample label="Channel identity example 2" language="text" :code="example2" />
        <p>
            Laravel adds the <code>private-</code> prefix to its wire-level channel name. Pass
            <code>mosaicast.sessions.&#123;identifier&#125;</code> without that prefix to Echo's
            <code>private()</code> method. The Vue plugin does this using the identifier received in
            Inertia props.
        </p>
        <p>
            The opaque identifier is a lowercase, 64-character SHA-256 HMAC. Private-channel
            authorization still requires the matching session cookie. A queued job may carry the
            identifier to address a specific session. Keep it out of URLs, logs, and long-term
            storage.
        </p>
    </ProseSection>
</template>
