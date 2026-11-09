<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `use ArtisanToolbox\\Mosaicast\\Facades\\Mosaicast;

Mosaicast::dispatch('orders.updated', [
    'orderId' => $order->id,
]);`;
const example2 = `mosaicast('orders.updated', ['orderId' => $order->id]);`;
</script>

<template>
    <ProseSection>
        <h2
            id="dispatch-an-event"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Dispatch an event
        </h2>
        <p>Use the facade while the web request is active:</p>
        <CodeExample label="Dispatch an event example 1" language="php" :code="example1" />
        <p>The <code>mosaicast()</code> helper provides the equivalent concise form:</p>
        <CodeExample label="Dispatch an event example 2" language="php" :code="example2" />
        <p>
            The event name is the client-side contract. Use stable, application-specific names. The
            <DocsLink :href="findNavigationItem(navigation, 'mosaicast/vue-plugin').href"
                >Vue listener API</DocsLink
            >
            receives either delivery path through <code>mosaicast().on()</code>.
        </p>
        <p>
            Use an associative array with string keys for the payload, or omit it when the event
            carries no data. The Vue client converts an empty array to <code>&#123;&#125;</code> and
            drops events with non-empty list payloads. PHP rejects an empty event name. Event
            objects define their own payload and cannot receive a separate non-empty payload
            argument.
        </p>
    </ProseSection>
</template>
