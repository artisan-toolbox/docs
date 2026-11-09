<script setup>
import DocsTable from '@/components/docs/DocsTable.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="delivery-behavior"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Delivery behavior
        </h2>
        <DocsTable caption="Delivery behavior reference 1"
            ><thead>
                <tr>
                    <th scope="col">Final response</th>
                    <th scope="col">Delivery</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Inertia response with <code>mosaicast</code> resolved</td>
                    <td><code>mosaicast.events</code> shared prop</td>
                </tr>
                <tr>
                    <td>Partial reload that omits <code>mosaicast</code></td>
                    <td>
                        Private session broadcast channel; the identifier still arrives in
                        <code>mosaicastSessionIdentifier</code>
                    </td>
                </tr>
                <tr>
                    <td>Redirect, download, JSON, or other non-Inertia response</td>
                    <td>Private session broadcast channel</td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            The broadcast fallback runs synchronously before Laravel returns the response. A
            broadcast connection or driver error can fail the request. The same errors can fail a
            job that broadcasts to an explicit session.
        </p>
    </ProseSection>
</template>
