<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `[
    'sessionIdentifier' => '9c9206cc5d38f284d87ca2cb6ad30b6c63a948b9960773742634793ed99f2681',
    'events' => [
        [
            'name' => 'orders.updated',
            'payload' => [
                'orderId' => 123,
            ],
        ],
    ],
]`;
</script>

<template>
    <ProseSection>
        <h2
            id="request-requirements"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Request requirements
        </h2>
        <p>
            No Mosaicast-specific middleware needs to be registered. Routes that
            use implicit <code>Mosaicast::dispatch()</code> still need Laravel's
            normal session middleware, such as the <code>web</code> group.
            Mosaicast reads the current session when used and listens to
            Laravel's <code>RequestHandled</code> event to broadcast pending
            events. Without an active session, implicit dispatch throws a
            <code>LogicException</code>; use an explicit
            <code>toSession()</code> target outside a request.
        </p>
        <p>
            The package registers the <code>mosaicast</code> Inertia shared prop
            automatically when <code>inertiajs/inertia-laravel</code> is
            installed. Its payload has this shape:
        </p>
        <CodeExample
            label="Request requirements example 1"
            language="php"
            :code="example1"
        />
        <p>
            The <code>events</code> array preserves dispatch order. Resolving
            the prop consumes only the events already queued; an event
            dispatched later in the same request remains pending for broadcast
            fallback.
        </p>
        <p>
            The package also shares a top-level
            <code>mosaicastSessionIdentifier</code> prop through Inertia's
            <code>always()</code> behavior. It contains the same opaque
            identifier, or <code>null</code> when no session is available. It is
            included in partial Inertia responses even when
            <code>mosaicast</code> is omitted, so the Vue client can keep its
            private-channel subscription in sync without consuming queued
            events.
        </p>
        <p>
            With Inertia Laravel 3.x, a full-page response that resolves the
            <code>mosaicast</code> prop for an active session includes
            <code>mosaicastInitialPage</code> in the page's flash data. Inertia
            keeps flash data out of browser history, so the Vue client can
            distinguish a fresh document from a restored page. Subsequent
            Inertia visits omit this marker.
        </p>
        <p>
            <code>sessionIdentifier</code> is derived from the current Laravel
            session ID and CSRF token. It is a lowercase 64-character SHA-256
            HMAC. Private-channel authorization still requires the matching
            session cookie. <code>toSession()</code> accepts only that format,
            preventing malformed channel names.
        </p>
    </ProseSection>
</template>
