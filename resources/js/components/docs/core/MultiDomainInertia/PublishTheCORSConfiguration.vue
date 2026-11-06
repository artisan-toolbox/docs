<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `php artisan config:publish cors`;
</script>

<template>
    <ProseSection>
        <h2
            id="publish-the-cors-configuration"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Publish the CORS configuration
        </h2>
        <p>
            Laravel applications do not publish <code>config/cors.php</code> by
            default. Publish it when the file is not already present:
        </p>
        <CodeExample
            label="Publish the CORS configuration example 1"
            language="bash"
            :code="example1"
        />
    </ProseSection>
</template>
