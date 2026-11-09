<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `use Illuminate\\Support\\Arr;
use Illuminate\\Support\\Collection;

use function ArtisanToolbox\\Core\\sift_when;

$payload = Arr::sift([
    'profile' => new Collection([
        'name' => $user->name,
        'phone' => sift_when($includePrivateFields, $user->phone),
    ]),
]);`;
</script>

<template>
    <ProseSection>
        <h2
            id="sift-nested-iterables"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Sift nested iterables
        </h2>
        <p>
            <code>Arr::sift()</code> recursively visits nested iterables, including arrays,
            collections, and generators:
        </p>
        <CodeExample label="Sift nested iterables example 1" language="php" :code="example1" />
        <p>
            Supported nested iterable types are preserved. Removing a numeric entry does not reindex
            its siblings. Empty containers are retained after their rejected entries are removed.
        </p>
        <p>
            For example,
            <code
                >Arr::sift([2 =&gt; 'kept', 5 =&gt; sift_when(false, 'hidden'), 8 =&gt;
                'kept'])</code
            >
            returns keys <code>2</code> and <code>8</code>. If that array is later encoded as JSON,
            PHP may represent sparse numeric keys as object fields rather than a JSON list. Reindex
            with <code>array_values()</code> only when the consumer specifically requires a list.
        </p>
        <p>
            Only iterable values are traversed. Objects that do not implement
            <code>Traversable</code> remain unchanged.
        </p>
    </ProseSection>
</template>
