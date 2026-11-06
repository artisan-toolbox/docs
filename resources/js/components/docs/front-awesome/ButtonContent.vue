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
const example2 = `<template>
  <ButtonGroup v-bind="group">
    <Button v-bind="save">Save changes</Button>
    <Button type="button">Cancel</Button>
  </ButtonGroup>
</template>

<script setup lang="ts">
import {
  Button,
  ButtonGroup,
  type ButtonGroupProps,
  type ButtonProps,
} from "@artisan-toolbox/front-awesome/components";

const group = {
  label: "Form actions",
  orientation: "vertical",
} satisfies ButtonGroupProps;
const save = { variant: "brand", type: "submit" } satisfies ButtonProps;
\x3C/script>`;
</script>

<template>
    <ProseSection>
        <p>
            After
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/web-awesome')
                        .href
                "
                >configuring Web Awesome</DocsLink
            >, import <code>Button</code> from
            <code>@artisan-toolbox/front-awesome/components</code> in a Vue
            page. The default slot becomes the button content.
        </p>
        <CodeExample
            label="Buttons and button groups example 1"
            language="vue"
            :code="example1"
        />
        <p>
            The wrapper passes attributes such as <code>variant</code>,
            <code>type</code>, and <code>disabled</code> to
            <code>&lt;wa-button&gt;</code>. It registers the custom element when
            the Vue component mounts in the browser. The button follows the
            application's Web Awesome theme.
        </p>
        <p>
            Bind boolean flags such as <code>disabled</code> and
            <code>loading</code> as booleans. A false value leaves the
            corresponding HTML boolean attribute absent, including before the
            custom element registers and during server rendering. Changing the
            value updates the same element; a false flag does not enable a
            loading or disabled state.
        </p>
        <p>
            For supported attributes, see the
            <DocsLink href="https://webawesome.com/docs/components/button/"
                >Web Awesome button reference</DocsLink
            >.
        </p>
        <h2
            id="group-related-buttons"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Group related buttons
        </h2>
        <p>
            Use <code>ButtonGroup.vue</code> to group buttons. Give the group a
            <code>label</code> so assistive technologies can identify it. The
            default slot contains the buttons. Set <code>orientation</code> to
            <code>vertical</code> to stack them.
        </p>
        <CodeExample
            label="Group related buttons example 2"
            language="vue"
            :code="example2"
        />
        <p>
            The wrappers combine Vue's HTML attributes with Web Awesome's
            TypeScript declarations for template completion and option checking.
            All wrapper attributes are optional. If you omit
            <code>orientation</code>, the group uses Web Awesome's horizontal
            default. Use <code>ButtonProps</code> or
            <code>ButtonGroupProps</code> to check an object before passing it
            with <code>v-bind</code>. Vue forwards the attributes and listeners
            to the Web Awesome element. The group registers
            <code>wa-button-group</code> when it mounts in the browser.
        </p>
        <p>
            See the
            <DocsLink
                href="https://webawesome.com/docs/components/button-group/"
                >Web Awesome button group reference</DocsLink
            >
            for group behavior and attributes.
        </p>
    </ProseSection>
</template>
