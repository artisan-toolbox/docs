<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `use function ArtisanToolbox\\Core\\sift_when;

$fields = collect([
    'name' => $user->name,
    'email' => sift_when($includePrivateFields, $user->email),
]);

$payload = $fields->sift();`;
const example2 = `use Illuminate\\Support\\LazyCollection;

use function ArtisanToolbox\\Core\\sift_when;

$payload = LazyCollection::make(function () use ($includePrivateFields, $user) {
    yield 'name' => $user->name;
    yield 'email' => sift_when($includePrivateFields, fn (): string => $user->email);
})->sift();`;
</script>

<template>
    <ProseSection>
        <h2
            id="preserve-collection-behavior"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Preserve collection behavior
        </h2>
        <p>
            Call <code>sift()</code> directly on a Collection to receive a new
            Collection without modifying the original instance:
        </p>
        <CodeExample
            label="Preserve collection behavior example 1"
            language="php"
            :code="example1"
        />
        <p>
            <code>LazyCollection::sift()</code> also returns a new
            LazyCollection. Its source is not consumed until the result is
            iterated:
        </p>
        <CodeExample
            label="Preserve collection behavior example 2"
            language="php"
            :code="example2"
        />
        <p>The recursive result follows the same rules:</p>
        <ul>
            <li><p>arrays remain arrays</p></li>
            <li><p>Collections remain Collections</p></li>
            <li><p>LazyCollections remain lazy</p></li>
            <li>
                <p>
                    other <code>Traversable</code> implementations are wrapped
                    in a lazy Generator because their concrete types cannot be
                    reconstructed safely
                </p>
            </li>
        </ul>
        <p>
            <code>Arr::sift()</code> returns an array and follows PHP's array
            key rules. A numeric string key such as <code>'2'</code> becomes the
            integer key <code>2</code>. An object used as a key in a generator
            causes a <code>TypeError</code> when Core writes that key to the
            result array.
        </p>
        <p>
            <code>Arr::sift()</code> consumes a top-level generator to produce
            that array. A generator nested inside another structure remains lazy
            until it is iterated, and should be treated as a one-pass iterable.
        </p>
    </ProseSection>
</template>
