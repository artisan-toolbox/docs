<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `$user = dc(User::findOrFail($id));

$values = dc('first', 'second');

$named = dc(user: $user, permissions: $user->getAllPermissions());`;
</script>

<template>
    <ProseSection>
        <h2
            id="dumping-values"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Dumping values
        </h2>
        <p>
            Like Laravel's <code>dump()</code> helper, <code>dc()</code> returns the values it
            receives. Unlike <code>dump()</code>, it sends the rendered value to the listener
            instead of writing into the current process output.
        </p>
        <CodeExample label="Dumping values example 1" language="php" :code="example1" />
        <p>
            Multiple positional values are labeled <code>1</code>, <code>2</code>, and so on. Named
            arguments keep their names. A single value is returned directly. Multiple values are
            returned as an array with the original keys. Calling <code>dc()</code> without arguments
            sends a small marker and returns <code>null</code>.
        </p>
        <p>
            Delivery is best effort. If the listener is unavailable or a value cannot be prepared or
            written, the dump is silently discarded. Debugging should not become the production
            incident it was investigating.
        </p>
    </ProseSection>
</template>
