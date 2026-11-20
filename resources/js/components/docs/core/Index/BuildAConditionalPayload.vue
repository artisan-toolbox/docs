<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `use Illuminate\\Support\\Arr;

use function ArtisanToolbox\\Core\\sift_when;

$payload = Arr::sift([
    'name' => 'Ada',
    'email' => sift_when(false, fn () => 'ada@example.test'),
]);

dump($payload);`;
</script>

<template>
    <ProseSection>
        <h2
            id="build-a-conditional-payload"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Build a conditional payload
        </h2>
        <CodeExample
            label="Build a conditional payload example 1"
            language="php"
            :code="example1" />
        <p>
            Run this example in a Laravel route or command after installing Core. The dump contains
            exactly <code>['name' =&gt; 'Ada']</code>.
        </p>
    </ProseSection>
</template>
