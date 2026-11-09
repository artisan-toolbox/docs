<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `php artisan vendor:publish --tag="dump-to-console-config"`;
const example2 = `DUMP_TO_CONSOLE_HOST=tcp://127.0.0.1:9913`;
</script>

<template>
    <ProseSection>
        <h2
            id="configuration"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Configuration
        </h2>
        <p>
            Publish the configuration when the listener endpoint or
            <code>artisan dev</code> integration must change:
        </p>
        <CodeExample label="Configuration example 1" language="bash" :code="example1" />
        <p>
            Set the endpoint for both the client and the listener in
            <code>.env</code>:
        </p>
        <CodeExample label="Configuration example 2" language="dotenv" :code="example2" />
        <p>
            If the application caches its configuration, rebuild the cache and restart long-running
            processes so they use the new endpoint.
        </p>
        <p>
            To run the listener separately from <code>php artisan dev</code>, set
            <code>register_dev_command</code> to <code>false</code> in the published
            <code>config/dump-to-console.php</code> file.
        </p>
    </ProseSection>
</template>
