<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="verify-both-delivery-paths"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Verify both delivery paths
        </h2>
        <p>
            Dispatch an event from a route that renders an Inertia page and inspect the page's
            <code>mosaicast.events</code> prop. The listener should receive
            <code>source === "inertia"</code>; the client does not need to finish its WebSocket
            subscription before handling that response.
        </p>
        <p>
            Then dispatch from a job or a response that does not resolve
            <code>mosaicast</code>. A browser already subscribed to the matching private channel
            receives <code>source === "broadcast"</code>. Laravel broadcasting does not replay
            earlier messages. The
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'mosaicast/inertia-delivery').href +
                    '#delivery-behavior'
                "
                >delivery guide</DocsLink
            >
            covers synchronous broadcaster errors and
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'mosaicast/inertia-delivery').href +
                    '#background-jobs-and-deferred-work'
                "
                >session rotation</DocsLink
            >.
        </p>
        <p>
            When nothing arrives, check the path in order: the server produced the intended event
            and payload,
            <code>mosaicastSessionIdentifier</code> is present, the host application's Echo instance
            was passed to the plugin, <code>/broadcasting/auth</code> received the session cookie
            and accepted the channel, and the host broadcaster is connected to Reverb. If no
            authorization request appears, the plugin has not attempted a private subscription.
            Enable <code>debug</code> only in an environment where logging event payloads is
            acceptable.
        </p>
    </ProseSection>
</template>
