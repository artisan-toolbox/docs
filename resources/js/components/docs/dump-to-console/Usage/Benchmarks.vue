<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `use Illuminate\\Support\\Benchmark;

$report = Benchmark::dc(fn () => $service->generateReport());`;
</script>

<template>
    <ProseSection>
        <h2
            id="benchmarks"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Benchmarks
        </h2>
        <p>
            The package registers <code>Benchmark::dc()</code> to measure a
            callback once, dump its duration and result, and return the result:
        </p>
        <CodeExample
            label="Benchmarks example 1"
            language="php"
            :code="example1"
        />
    </ProseSection>
</template>
