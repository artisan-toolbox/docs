<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({ navigation: { type: Array, required: true } });

const modelExample = `<script setup>
import { ref } from 'vue';
import { Input } from '@artisan-toolbox/front-awesome/components';

const name = ref('Ada');
\x3C/script>

<template>
  <Input v-model="name" label="Name" with-clear />
  <output>{{ name }}</output>
  <button type="button" @click="name = 'Grace'">Use Grace</button>
</template>`;

const formExample = `<script setup>
import { useForm } from '@inertiajs/vue3';
import { Input } from '@artisan-toolbox/front-awesome/components';

const form = useForm({ users: [{ email: 'ada@example.com' }] });
\x3C/script>

<template>
  <Input
    :form="form"
    field-name="users.0.email"
    label="Email"
    type="email"
    hint="Use your work email."
  />
  <output>{{ form.users[0].email }}</output>
  <button type="button" @click="form.users[0].email = 'grace@example.com'">
    Use Grace's email
  </button>
  <button type="button" @click="form.setError('users.0.email', 'Email is already taken.')">
    Show a server error
  </button>
  <button type="button" @click="form.clearErrors('users.0.email')">Clear the error</button>
  <button type="button" @click="form.reset()">Reset values</button>
</template>`;

const bridgeExample = `<script setup>
import { useFormBridge } from '@artisan-toolbox/front-awesome';

const props = defineProps({
  modelValue: String,
  form: [String, Object],
  fieldName: String,
});
const emit = defineEmits(['update:modelValue']);
const { value, errors, invalid } = useFormBridge(props, {
  emitValue: (next) => emit('update:modelValue', next),
});

function update(event) {
  value.value = event.currentTarget.value;
}
\x3C/script>

<template>
  <input :value="value ?? ''" :aria-invalid="invalid || undefined" @input="update" />
  <span v-for="message in errors" :key="message" role="alert">{{ message }}</span>
</template>`;
</script>

<template>
    <ProseSection>
        <p>
            Start in the Laravel, Inertia 3, and Vue 3.5 application from
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                >Installation</DocsLink
            >. Keep its Vite plugin and Web Awesome styles. Add the examples to a Vue page in that
            application. The toast plugin is not required.
        </p>
        <DocsCallout variant="caution">
            <template #title>Development preview</template>
            <p>
                This guide describes the Input API in the current Front Awesome checkout. Confirm
                that your Composer-installed package exports
                <code>components/Input.vue</code>. Older published previews may not include it.
                Refresh the frontend package copy after updating Composer, as described in
                Installation.
            </p>
        </DocsCallout>
        <h2 id="use-v-model">Use v-model</h2>
        <p>
            Import <code>Input</code> from the components entry point or
            <code>@artisan-toolbox/front-awesome/components/Input.vue</code>. Give each input
            exactly one binding mode. This example uses an ordinary Vue ref.
        </p>
        <p>
            The current checkout also exports
            <code>@artisan-toolbox/front-awesome/components/WebAwesome</code>
            and
            <code>@artisan-toolbox/front-awesome/components/WebAwesome/Input.vue</code>. Web Awesome
            wrappers share that directory. The existing imports above remain compatible.
        </p>
        <CodeExample label="Bind an input with v-model" language="vue" :code="modelExample" />
        <p>
            The input and output initially show Ada. Typing changes the output. Selecting Use Grace
            changes both to Grace. The Web Awesome clear button changes the value to an empty
            string.
        </p>
        <h2 id="bind-an-inertia-form">Bind an Inertia form</h2>
        <p>
            Pass the object returned by <code>useForm()</code> as <code>form</code> and a string
            <code>field-name</code>. Do not add <code>v-model</code> in this mode. Dotted paths
            address nested objects and array indexes, such as <code>users.0.email</code>. Initialize
            the field and its containing objects or array entries before rendering the input.
        </p>
        <CodeExample label="Bind a nested Inertia field" language="vue" :code="formExample" />
        <p>
            The input initially shows ada@example.com. Typing updates
            <code>form.users[0].email</code>. Selecting Use Grace's email updates the input. Reset
            values restores ada@example.com. Replacing the containing array or the bound form also
            updates the input.
        </p>
        <h2 id="display-server-errors">Display server errors</h2>
        <p>
            Select Show a server error to display Email is already taken. The bridge reads the exact
            dotted key in <code>form.errors</code>, marks the input with <code>aria-invalid</code>,
            and colors its control, label, hint, and focus indicator with the application's Web
            Awesome danger tokens. Clearing the error restores the ordinary appearance and hint.
            Error text is rendered as text, not HTML.
        </p>
        <p>
            Editing a field does not clear its server error. The Inertia form owns that error until
            your application clears or replaces it. Server errors do not call
            <code>setCustomValidity()</code> or prevent another submission. Web Awesome's
            <code>required</code>, <code>pattern</code>, and other native constraints retain their
            existing behavior.
        </p>
        <h2 id="keep-web-awesome-behavior">Keep Web Awesome behavior</h2>
        <p>
            Pass Web Awesome attributes and listeners directly, including
            <code>appearance</code>, <code>size</code>, <code>disabled</code>,
            <code>with-clear</code>, <code>@input</code>, <code>@change</code>, and
            <code>@wa-clear</code>. Slots retain their Web Awesome names, including
            <code>label</code>, <code>start</code>, <code>end</code>, and <code>hint</code>. Inertia
            errors temporarily take the hint position. Component options come from the upstream Web
            Awesome types rather than a separately maintained list.
        </p>
        <p>
            Values follow <code>wa-input</code> and remain strings or null, including for
            <code>type="number"</code>. This bridge does not add trimming, number conversion,
            validation rules, or automatic form submission. Use Web Awesome attributes for native
            browser behavior.
        </p>
        <h2 id="binding-contract">Binding contract</h2>
        <p>
            An undefined value displays as an empty string. An explicit
            <code>defaultValue</code> sets Web Awesome's native form-reset baseline. Without it, the
            initial bound value is the baseline. Resetting the containing HTML form updates the Vue
            owner as well as the Web Awesome input. Inertia's <code>form.reset()</code> continues to
            use the Inertia form's own defaults.
        </p>
        <p>
            To call a Web Awesome method such as <code>focus()</code>, access <code>$el</code> on
            the Vue component's template ref. The wrapper's single root is the underlying
            <code>wa-input</code> element.
        </p>
        <ul>
            <li>
                Use either <code>v-model</code> or <code>:form="form"</code> with
                <code>field-name</code>. Both modes together, or neither mode, throw an error.
            </li>
            <li>
                Use unmodified <code>v-model</code>. This first text bridge rejects modifiers such
                as <code>.number</code>, <code>.trim</code>, and <code>.lazy</code> rather than
                applying value transformations or changing Web Awesome's event timing.
            </li>
            <li>
                Supply both the Inertia form and its field name. An incomplete pair throws an error.
            </li>
            <li>
                The bridge owns the live value. Do not pass a competing
                <code>value</code> attribute.
            </li>
            <li>
                A string <code>form="profile"</code> keeps Web Awesome's association with an HTML
                form ID in v-model mode.
            </li>
        </ul>
        <h2 id="reuse-the-bridge">Reuse the bridge in a text control</h2>
        <p>
            Call <code>useFormBridge(props, options)</code> inside Setup when another text control
            needs the same binding contract. Pass reactive props and an
            <code>emitValue</code> callback. The composable returns a writable computed
            <code>value</code>, a computed array of <code>errors</code>, and a computed
            <code>invalid</code> flag. This example demonstrates the data binding with a native
            input. It does not add Web Awesome rendering or danger styles.
        </p>
        <CodeExample label="Reuse the text form bridge" language="vue" :code="bridgeExample" />
        <p>
            Use this wrapper with either <code>v-model</code> or an Inertia <code>form</code> and
            <code>field-name</code>, as above. The bridge reads the active component's prop presence
            to distinguish an explicitly undefined model from an absent binding. Outside a
            component, supply <code>options.binding</code> as a getter returning the current raw
            props, including the <code>onUpdate:modelValue</code> listener in model mode.
        </p>
        <p>
            TypeScript consumers can import <code>FormBindingProps</code>,
            <code>FormBridgeValue</code>, and <code>TextFieldName</code> from the root entry, and
            <code>InputProps</code> or <code>InputAttributes</code> from the components entry. The
            binding type describes the two exclusive modes. Text field names derive from Inertia's
            dotted paths and select string, null, or optional string fields. Input attributes derive
            from the installed Web Awesome types, excluding implementation state and the replaced
            live-value attribute.
        </p>
        <p>
            See the
            <DocsLink href="https://webawesome.com/docs/components/input/"
                >Web Awesome Input reference</DocsLink
            >
            for its attributes, events, slots, and public methods, and the
            <DocsLink href="https://inertiajs.com/docs/v3/the-basics/forms"
                >Inertia forms guide</DocsLink
            >
            for submission and error lifecycle behavior.
        </p>
    </ProseSection>
</template>
