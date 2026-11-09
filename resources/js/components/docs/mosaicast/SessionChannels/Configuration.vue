<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `MOSAICAST_SESSION_CHANNEL_KEY=your-long-random-secret`;
const example2 = `php artisan vendor:publish --tag=mosaicast-config`;
const example3 = `return [
    'broadcasting' => [
        'guard' => 'mosaicast-session',
        'session_channel_key' => env('MOSAICAST_SESSION_CHANNEL_KEY', env('APP_KEY')),
        'session_channel_prefix' => 'mosaicast.sessions',
    ],
];`;
</script>

<template>
    <ProseSection>
        <h2
            id="configuration"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Configuration
        </h2>
        <p>
            The session channel key defaults to <code>APP_KEY</code>. The application must have a
            non-empty key before Mosaicast can derive identifiers. Set
            <code>MOSAICAST_SESSION_CHANNEL_KEY</code> when the session-channel secret must be
            distinct from the application encryption key:
        </p>
        <CodeExample label="Configuration example 1" language="dotenv" :code="example1" />
        <p>Publish the package configuration to customize the guard name or channel prefix:</p>
        <CodeExample label="Configuration example 2" language="bash" :code="example2" />
        <CodeExample label="Configuration example 3" language="php" :code="example3" />
        <p>
            Mosaicast registers its guard automatically. Do not use this guard for application
            authorization: it represents only a valid browser session and has no application user or
            permissions.
        </p>
        <p>
            When changing <code>session_channel_prefix</code>, set the Vue plugin's
            <code>channelPrefix</code> option to the same value. The browser uses
            <code>mosaicast.sessions</code> by default.
        </p>
    </ProseSection>
</template>
