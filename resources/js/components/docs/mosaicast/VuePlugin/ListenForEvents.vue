<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `import { mosaicast } from "@artisan-toolbox/mosaicast";

const stop = mosaicast().on("orders.updated", (payload, source) => {
  console.log(payload.orderId);
  console.log(source); // "inertia" or "broadcast"
});

// Later, for example when a component is unmounted:
stop();`;
const example2 = `const onOrderUpdated = (
  payload: Record<string, unknown>,
  source: "inertia" | "broadcast",
) => {
  console.log(payload, source);
};

mosaicast().on(".orders.updated", onOrderUpdated);
mosaicast().off("orders.updated", onOrderUpdated);`;
</script>

<template>
    <ProseSection>
        <h2
            id="listen-for-events"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Listen for events
        </h2>
        <p>
            Use <code>mosaicast()</code> anywhere in the client application
            after importing it from the package. <code>on()</code> returns an
            unsubscribe callback, and <code>off()</code> removes a specific
            listener.
        </p>
        <CodeExample
            label="Listen for events example 1"
            language="ts"
            :code="example1"
        />
        <p>
            Register component listeners during component setup and call the
            returned function on unmount. The plugin itself registers navigation
            and Echo subscriptions during installation; Vue lifecycle hooks such
            as <code>onMounted()</code> belong inside components or composables.
        </p>
        <p>Laravel Echo-style leading dots are accepted too:</p>
        <CodeExample
            label="Listen for events example 2"
            language="ts"
            :code="example2"
        />
        <p>
            The event name is identical for shared-prop and broadcast delivery.
            A Laravel event object without <code>broadcastAs()</code> uses its
            class name, such as <code>App\Events\OrderUpdated</code>; register
            its short class name (<code>OrderUpdated</code>) when the class is
            in the default <code>App\Events</code> namespace. For events in
            other namespaces, register the full class name to avoid matching
            another event with the same short class name. A
            <code>broadcastAs()</code> method uses its returned value.
        </p>
    </ProseSection>
</template>
