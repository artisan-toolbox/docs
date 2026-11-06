<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="how-it-works"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            How it works
        </h2>
        <p>
            The client clones values with Symfony VarDumper, adds a timestamp
            and source context, and sends the payload over a reusable TCP
            connection. Opening the connection is synchronous and uses a 50 ms
            connection timeout. Writes use non-blocking mode after the
            connection opens. The listener uses Symfony's dump server protocol
            and Laravel's CLI dumper, preserving Laravel's rendering and editor
            links.
        </p>
        <p>
            The HTTP server, queue workers, scheduler, and Artisan commands can
            run as separate processes while sending their temporary debug values
            to the same console.
        </p>
    </ProseSection>
</template>
