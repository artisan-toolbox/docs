<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `if ($request_method = OPTIONS) {
    rewrite ^ /index.php last;
}`;
</script>

<template>
    <ProseSection>
        <h2
            id="forward-nginx-preflight-requests-when-needed"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Forward Nginx preflight requests when needed
        </h2>
        <p>
            Some Nginx configurations answer <code>OPTIONS</code> requests
            before Laravel can add its CORS headers. When that applies, forward
            preflight requests to the front controller:
        </p>
        <CodeExample
            label="Forward Nginx preflight requests when needed example 1"
            language="nginx"
            :code="example1"
        />
        <p>
            Configure CORS in one layer only. When Nginx already returns the
            complete and correct CORS response, Laravel does not also need to
            process the preflight.
        </p>
    </ProseSection>
</template>
