<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `use ArtisanToolbox\\DumpToConsole\\Concerns\\Dumpable;

class ReportBuilder
{
    use Dumpable;
}

$report = $builder
    ->dc()
    ->generate();`;
</script>

<template>
    <ProseSection>
        <h2
            id="fluent-dumps"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Fluent dumps
        </h2>
        <p>
            Use the package trait when an application class should support
            fluent console dumps:
        </p>
        <CodeExample
            label="Fluent dumps example 1"
            language="php"
            :code="example1"
        />
        <p>
            <code>dc()</code> returns the same object after sending it to the
            listener. Additional arguments are supported and are dumped
            alongside the object.
        </p>
    </ProseSection>
</template>
