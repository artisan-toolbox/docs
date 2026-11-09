<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `use Illuminate\\Support\\Arr;

use function ArtisanToolbox\\Core\\sift_when;

$payload = Arr::sift([
    'name' => $user->name,
    'email' => sift_when($canViewEmail, fn (): string => $user->email),
    'statistics' => sift_when(
        $request->boolean('with_statistics'),
        fn (): array => $statistics->for($user),
    ),
]);`;
</script>

<template>
    <ProseSection>
        <h2
            id="build-a-conditional-array"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Build a conditional array
        </h2>
        <p>Import the helper explicitly so it does not compete with global application helpers:</p>
        <CodeExample label="Build a conditional array example 1" language="php" :code="example1" />
        <p>
            When a condition is <code>false</code>, <code>sift_when()</code> returns an internal
            marker instead of the supplied value. <code>Arr::sift()</code> recognizes that marker
            and removes its key. Values such as <code>null</code>, <code>false</code>,
            <code>0</code>, and empty strings are retained when their conditions pass.
        </p>
        <p>
            The second argument may be a direct value or a zero-argument closure. When the condition
            is <code>true</code>, the helper invokes the closure immediately at the
            <code>sift_when()</code> call. When it is <code>false</code>, the closure is never
            invoked. For an ordinary array, <code>sift_when()</code> calls happen while the array is
            built; inside a LazyCollection generator, they happen when that generator is iterated.
            Passing a direct expression such as <code>$service-&gt;calculate()</code> evaluates it
            before the helper can check the condition, so wrap expensive expressions in a closure.
        </p>
        <p>
            <code>sift_when()</code> does not remove values by itself. Always pass the complete
            structure through <code>sift()</code>; otherwise its internal marker will remain in the
            result.
        </p>
    </ProseSection>
</template>
