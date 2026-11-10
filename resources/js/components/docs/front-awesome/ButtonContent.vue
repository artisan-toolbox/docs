<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `<template>
  <Button variant="brand" type="submit">Save changes</Button>
</template>

<script setup lang="ts">
import { Button } from "@artisan-toolbox/front-awesome/components";
\x3C/script>`;
</script>

<template>
    <ProseSection data-component-reference="button">
        <p>
            After
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/web-awesome').href"
                >configuring Web Awesome</DocsLink
            >, import <code>Button</code> from
            <code>@artisan-toolbox/front-awesome/components</code> in a Vue page. The default slot
            becomes the button content.
        </p>
        <CodeExample label="Buttons and button groups example 1" language="vue" :code="example1" />
        <p>
            The wrapper passes attributes such as <code>variant</code>, <code>type</code>, and
            <code>disabled</code> to <code>&lt;wa-button&gt;</code>. It registers the custom element
            when the Vue component mounts in the browser. The button follows the application's Web
            Awesome theme.
        </p>
        <p>
            Bind boolean flags such as <code>disabled</code> and <code>loading</code> as booleans. A
            false value leaves the corresponding HTML boolean attribute absent, including before the
            custom element registers and during server rendering. Changing the value updates the
            same element; a false flag does not enable a loading or disabled state.
        </p>
        <p>
            For supported attributes, see the
            <DocsLink href="https://webawesome.com/docs/components/button/"
                >Web Awesome button reference</DocsLink
            >.
        </p>
        <p>
            In the current checkout, Web Awesome wrappers live under
            <code>resources/js/components/WebAwesome</code>. The public
            <code>@artisan-toolbox/front-awesome/components/WebAwesome</code>
            entry exports <code>Button</code>, <code>ButtonGroup</code>, and <code>Input</code>.
            Individual exports also use this directory, such as
            <code>@artisan-toolbox/front-awesome/components/WebAwesome/Button.vue</code>. The
            existing components entry and direct component imports remain compatible. Check the
            installed package exports before using the new paths in an older preview.
        </p>
        <p>
            Give a button accessible slotted text or a labeled Icon. In Web Awesome 3.14, attributes
            on the custom-element host are not all forwarded to its internal focusable button. Check
            the actual accessible name and state. Keep native buttons for custom disclosures or
            toggle controls that require <code>aria-expanded</code> or <code>aria-pressed</code> on
            that focusable element. Do not patch shadow internals to transfer those attributes.
        </p>
    </ProseSection>
</template>
