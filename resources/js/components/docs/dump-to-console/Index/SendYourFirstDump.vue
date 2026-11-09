<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `php artisan dump:listen`;
const example2 = `$order = dc(Order::find($id));

dc(orderId: $order?->id);`;
</script>

<template>
    <ProseSection>
        <h2
            id="send-your-first-dump"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Send your first dump
        </h2>
        <p>Start the listener in a terminal:</p>
        <CodeExample label="Send your first dump example 1" language="bash" :code="example1" />
        <p>Send values from the application with the <code>dc()</code> helper:</p>
        <CodeExample label="Send your first dump example 2" language="php" :code="example2" />
        <p>
            The terminal shows each value and its source location when available. The helper returns
            the values it receives, so it works inline. An unavailable listener does not interrupt
            the application.
        </p>
    </ProseSection>
</template>
