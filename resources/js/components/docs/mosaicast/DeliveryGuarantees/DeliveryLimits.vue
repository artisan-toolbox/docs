<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="delivery-limits"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Delivery limits
        </h2>
        <p>
            Broadcasting does not replay an event to a client that joins after
            it was sent. A request that both rotates its session and omits
            <code>mosaicast.events</code> from a partial response can broadcast
            before the client subscribes to the new channel. Include the event
            prop in that response when immediate delivery matters.
        </p>
        <p>
            Mosaicast dispatches broadcasts synchronously. A broadcaster
            exception can fail the request or job. See
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'mosaicast/inertia-delivery')
                        .href + '#delivery-behavior'
                "
                >delivery behavior</DocsLink
            >.
        </p>
        <p>
            A queued job targeting an expired or rotated session may publish to
            the old channel. Session invalidation prevents new authorization for
            that channel with a server-backed session driver, but existing
            WebSocket subscriptions may still receive events. Recheck
            application authorization before sending sensitive data. Neither the
            opaque identifier nor the session guard provides application
            authorization; the host app remains responsible for deciding which
            data the event may reveal.
        </p>
    </ProseSection>
</template>
