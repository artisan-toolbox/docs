<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `use Illuminate\\Support\\Arr;

use function ArtisanToolbox\\Core\\sift_when;

$payload = Arr::sift([
    'name' => $user->name,
    'email' => sift_when($canViewEmail, fn () => $user->email),
]);`;
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
            When <code>$canViewEmail</code> is <code>false</code>, <code>$payload</code> contains
            only <code>name</code>.
        </p>
    </ProseSection>
</template>
