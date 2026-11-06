<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `[Mosaicast] Session identifier: 8b1f…
[Mosaicast] Subscribing to private channel: mosaicast.sessions.8b1f…
[Mosaicast] Private channel subscribed: mosaicast.sessions.8b1f…
[Mosaicast] Inertia event: { ... }
[Mosaicast] Broadcast event: { ... }`;
</script>

<template>
    <ProseSection>
        <h2
            id="diagnostic-output"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Diagnostic output
        </h2>
        <p>With <code>debug: true</code>, the plugin logs:</p>
        <CodeExample
            label="Diagnostic output example 1"
            language="text"
            :code="example1"
        />
        <p>
            If the Echo instance is not provided or the private-channel
            authorization fails, the plugin logs the reason as an error.
        </p>
        <p>
            Diagnostics include event payloads. Enable <code>debug</code> only
            where console output may safely contain the event's application
            data.
        </p>
        <p>
            Do not log, persist, or expose the raw Laravel session ID. Mosaicast
            only uses its HMAC-derived identifier.
        </p>
    </ProseSection>
</template>
