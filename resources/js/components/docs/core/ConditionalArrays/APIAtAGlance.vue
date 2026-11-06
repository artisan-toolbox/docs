<script setup>
import DocsTable from '@/components/docs/DocsTable.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="api-at-a-glance"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            API at a glance
        </h2>
        <DocsTable caption="API at a glance reference 1"
            ><thead>
                <tr>
                    <th scope="col">API</th>
                    <th scope="col">Input</th>
                    <th scope="col">Result</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <code>sift_when(bool $condition, mixed $value)</code>
                    </td>
                    <td>A direct value or zero-argument closure</td>
                    <td>
                        The value when allowed; an internal exclusion marker
                        when rejected
                    </td>
                </tr>
                <tr>
                    <td><code>Arr::sift(iterable $items)</code></td>
                    <td>An iterable with integer or string keys</td>
                    <td>A new array</td>
                </tr>
                <tr>
                    <td><code>Collection::sift()</code></td>
                    <td>A Collection</td>
                    <td>A new Collection</td>
                </tr>
                <tr>
                    <td><code>LazyCollection::sift()</code></td>
                    <td>A LazyCollection</td>
                    <td>A new, lazy LazyCollection</td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            Import <code>sift_when()</code> with its namespace. The
            <code>sift()</code> methods are Laravel macros registered by Core,
            so no import is needed for them.
        </p>
    </ProseSection>
</template>
