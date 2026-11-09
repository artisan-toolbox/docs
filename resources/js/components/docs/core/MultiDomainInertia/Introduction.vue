<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <p>
            Browsers cannot complete a normal Inertia XHR visit when navigation crosses hosts. For
            example, a link from
            <code>app.example.com</code> to <code>admin.example.com</code> leaves the origin used by
            the current page even though both hosts belong to the same Laravel application.
        </p>
        <p>
            <code>HandleInertiaCrossDomainVisits</code> compares the destination host with the
            previous URL. When an Inertia <code>GET</code> request crosses hosts, it returns an
            Inertia location response with status <code>409</code> and an
            <code>X-Inertia-Location</code> header. Inertia then performs a full document visit to
            the destination. Non-Inertia requests, non-<code>GET</code> requests, and same-host
            visits continue through the middleware unchanged.
        </p>
        <p>
            The comparison uses hostnames. A change in scheme or port on the same host passes
            through. Laravel uses the request's
            <code>Referer</code> header to resolve the previous URL, with the session's previous URL
            as a fallback when available. If neither supplies a previous URL, Laravel uses the
            current site's root URL.
        </p>
        <p>
            Use this middleware only when one Laravel application serves multiple trusted domains or
            subdomains.
        </p>
    </ProseSection>
</template>
