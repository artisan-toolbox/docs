<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="verify-the-integration"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Verify the integration
        </h2>
        <p>
            From one configured origin, follow an Inertia link to the other host
            and inspect the browser network panel. The initial cross-host
            request should return <code>409</code> with
            <code>X-Inertia-Location</code>; the browser should then perform a
            full document navigation to that URL. A link within the same host
            should remain a normal client-side Inertia visit.
        </p>
        <p>
            If the browser blocks the initial request, verify the exact origin,
            request path, allowed headers, exposed response headers, and
            credential settings in <code>config/cors.php</code>. Also confirm
            that a reverse proxy is not consuming <code>OPTIONS</code> before
            the request reaches Laravel.
        </p>
    </ProseSection>
</template>
