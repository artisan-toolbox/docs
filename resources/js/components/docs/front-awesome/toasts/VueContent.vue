<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `<template>
  <button type="button" @click="copyReportLink">Copy link</button>
</template>

<script setup lang="ts">
import { useToast } from "@artisan-toolbox/front-awesome";

const toast = useToast();

async function copyReportLink() {
  await navigator.clipboard.writeText(window.location.href);
  await toast.show("Report link copied.", {
    variant: "success",
    icon: "check",
  });
}
\x3C/script>`;
const example2 = `import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    async notifySaved() {
      await this.$frontAwesome.toast.show("Report saved.", {
        variant: "success",
      });
    },
  },
});`;
const example3 = `import "@artisan-toolbox/front-awesome";`;
const example4 = `{
  "vue/no-undef-properties": ["error", { "ignores": ["$frontAwesome"] }]
}`;
</script>

<template>
    <ProseSection>
        <p>
            After you
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/vue-plugin').href"
                >register the Vue plugin</DocsLink
            >, use the toast service to respond to actions in the browser. Vue toasts use the same
            stack as toasts sent from Laravel.
        </p>
        <h2
            id="use-the-composition-api"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Use the Composition API
        </h2>
        <p>
            Call <code>useToast()</code> in component setup and call <code>show()</code> when you
            want to display a notification.
        </p>
        <CodeExample label="Use the Composition API example 1" language="vue" :code="example1" />
        <h2
            id="use-a-template-or-the-options-api"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Use a template or the Options API
        </h2>
        <p>
            The plugin exposes the same service as
            <code>$frontAwesome.toast</code>. In a template, call
            <code>$frontAwesome.toast.show(message, options)</code>. In an Options API method, use
            <code>this.$frontAwesome.toast.show(message, options)</code>.
        </p>
        <CodeExample
            label="Use a template or the Options API example 2"
            language="ts"
            :code="example2" />
        <h2
            id="toast-options"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Toast options
        </h2>
        <p>
            The second argument to <code>show()</code> is optional. Its type is
            <code>ToastOptions</code>.
        </p>
        <DocsTable caption="Toast options reference 1"
            ><thead>
                <tr>
                    <th scope="col">Option</th>
                    <th scope="col">Accepted values</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>variant</code></td>
                    <td>
                        <code>brand</code>, <code>success</code>, <code>warning</code>,
                        <code>danger</code>, or <code>neutral</code>. Defaults to
                        <code>neutral</code>.
                    </td>
                </tr>
                <tr>
                    <td><code>duration</code></td>
                    <td>
                        A non-negative integer in milliseconds. Use
                        <code>0</code> to wait for dismissal.
                    </td>
                </tr>
                <tr>
                    <td><code>icon</code></td>
                    <td>
                        An icon name or an object with <code>name</code> and optional
                        <code>library</code>, <code>family</code>, and <code>variant</code> strings.
                        Pass an icon to display one.
                    </td>
                </tr>
                <tr>
                    <td><code>size</code></td>
                    <td>
                        <code>xs</code>, <code>s</code>, <code>m</code>, <code>l</code>, or
                        <code>xl</code>. Defaults to <code>m</code>.
                    </td>
                </tr>
                <tr>
                    <td><code>allowHtml</code></td>
                    <td>Defaults to plain text. Set to <code>true</code> only for trusted HTML.</td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            In the browser, <code>show()</code> resolves when Web Awesome creates the toast. It
            rejects if the arguments are invalid or Web Awesome cannot load or create the toast.
            During server rendering, a valid call resolves without displaying a toast. The browser
            ignores malformed toast payloads received through Inertia or Mosaicast.
        </p>
        <h2
            id="check-types-and-lint-rules"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Check types and lint rules
        </h2>
        <p>
            The root package exports <code>ToastOptions</code>, <code>ToastIconOptions</code>, and
            <code>ToastService</code>. Use <code>import type</code> when declaring a shared options
            object or a wrapper around the service.
        </p>
        <p>
            The root package import also declares <code>$frontAwesome</code> in
            <DocsLink
                href="https://vuejs.org/guide/typescript/options-api.html#augmenting-global-properties"
                >Vue's component instance types</DocsLink
            >. Run <code>vue-tsc --noEmit</code> against the TypeScript project that includes your
            Vue files. If that project excludes the entry point that imports
            <code>createFrontAwesome()</code>, add a declaration file such as
            <code>resources/js/front-awesome.d.ts</code> and include it in the project's
            <code>tsconfig</code>.
        </p>
        <CodeExample label="Check types and lint rules example 3" language="ts" :code="example3" />
        <p>
            The ESLint rule
            <DocsLink href="https://eslint.vuejs.org/rules/no-undef-properties.html"
                ><code>vue/no-undef-properties</code></DocsLink
            >
            ignores names starting with <code>$</code> by default. If your Vue rules override that
            behavior and flag <code>$frontAwesome</code>, add the exact name to the rule's
            <code>ignores</code> list. Keep any existing entries.
        </p>
        <CodeExample
            label="Check types and lint rules example 4"
            language="json"
            :code="example4" />
    </ProseSection>
</template>
