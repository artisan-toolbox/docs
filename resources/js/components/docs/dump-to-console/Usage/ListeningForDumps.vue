<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `php artisan dump:listen`;
const example2 = `php artisan dump:listen --host=tcp://127.0.0.1:9913`;
</script>

<template>
    <ProseSection>
        <h2
            id="listening-for-dumps"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Listening for dumps
        </h2>
        <p>Run the listener by itself:</p>
        <CodeExample
            label="Listening for dumps example 1"
            language="bash"
            :code="example1"
        />
        <p>
            The client and listener use <code>tcp://127.0.0.1:9912</code> by
            default. To change both, set <code>DUMP_TO_CONSOLE_HOST</code> as
            described in
            <DocsLink href="#configuration">Configuration</DocsLink>. The
            <code>--host</code> option changes only the listener for that
            invocation. Use it when the client already sends dumps to that
            endpoint:
        </p>
        <CodeExample
            label="Listening for dumps example 2"
            language="bash"
            :code="example2"
        />
        <p>
            The package also adds a <code>dumps</code> process to
            <code>php artisan dev</code>.
        </p>
    </ProseSection>
</template>
