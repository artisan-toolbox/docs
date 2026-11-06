<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `<?php

return [
    'paths' => ['*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        env('APP_URL', 'http://localhost'),
        env('ADMIN_URL', 'http://admin.localhost'),
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [
        'x-inertia',
        'x-inertia-location',
    ],

    'max_age' => 0,

    'supports_credentials' => false,
];`;
</script>

<template>
    <ProseSection>
        <h2
            id="allow-trusted-application-origins"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Allow trusted application origins
        </h2>
        <p>
            Cover the routes involved in navigation and expose the Inertia
            response headers to the browser:
        </p>
        <CodeExample
            label="Allow trusted application origins example 1"
            language="php"
            :code="example1"
        />
        <p>
            List exact trusted origins. Do not combine wildcard origins with
            credentialed requests. If the hosts must share an authenticated
            session, configure Laravel's session cookie domain, Sanctum stateful
            domains when applicable, the frontend credentials option, and
            <code>supports_credentials</code> together. These settings form one
            security boundary and should not be enabled independently.
        </p>
        <p>
            Narrow <code>paths</code> and <code>allowed_methods</code> when the
            application's routing structure permits it. The broad values above
            support navigation across all web routes.
        </p>
    </ProseSection>
</template>
