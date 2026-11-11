<script setup>
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
</script>

<template>
    <DocsCallout variant="info">
        <template #title>Shared form binding</template>
        <p>
            Data-entry controls support <code>v-model</code> or an Inertia <code>form</code> with
            <code>field</code>. The existing <code>field-name</code> spelling remains available.
            Choose one binding source per control.
        </p>
        <p>
            Form errors provide messages and a danger state. For manual validation,
            <code>failed</code> accepts a boolean, a message or a list of messages. Grouping
            components such as Checkbox Group use the bindings of their child controls.
        </p>
        <p>
            See the <DocsLink href="#use-v-model">live model example</DocsLink>,
            <DocsLink href="#bind-an-inertia-form">Inertia binding demos</DocsLink> and
            <DocsLink href="#display-server-errors">error handling</DocsLink> below. These APIs are
            included in Front Awesome 1.0.0-alpha.2.
        </p>
    </DocsCallout>
</template>
