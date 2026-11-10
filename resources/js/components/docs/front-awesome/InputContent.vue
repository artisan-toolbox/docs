<script setup>
import DemoFrame from '@/components/demo/DemoFrame.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import InertiaBindingDemo from '@/components/demo/front-awesome/forms/binding/InertiaBindingDemo.vue';
import CollectionBindingDemo from '@/components/demo/front-awesome/forms/binding/CollectionBindingDemo.vue';
import CalendarBindingDemo from '@/components/demo/front-awesome/forms/binding/CalendarBindingDemo.vue';
import ManualValidationDemo from '@/components/demo/front-awesome/forms/binding/ManualValidationDemo.vue';
import BridgeReuseDemo from '@/components/demo/front-awesome/forms/binding/BridgeReuseDemo.vue';

defineProps({ navigation: { type: Array, required: true } });

const inertiaBindingDemoSource = `<script setup>
import { useForm } from '@inertiajs/vue3';
import {
    Button,
    Checkbox,
    Input,
    Rating,
    Slider,
} from '@artisan-toolbox/front-awesome/components/WebAwesome';

const form = useForm({
    users: [{ email: 'ada@example.com' }],
    subscribed: false,
    score: 2,
    volume: 25,
});

function showErrors() {
    form.setError({
        'users.0.email': 'Email is already taken.',
        subscribed: 'Enable this option for the example.',
        score: 'Choose at least three stars.',
        volume: 'Choose a volume of at least 50.',
    });
}
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-5" data-docs-outline-exclude>
        <div class="grid min-w-0 gap-5 @sm:grid-cols-2">
            <div class="min-w-0">
                <Input
                    :form="form"
                    field="users.0.email"
                    type="email"
                    label="Email"
                    hint="Use your work email."
                    with-clear />
            </div>
            <div class="min-w-0">
                <Checkbox :form="form" field="subscribed">Receive release notes</Checkbox>
            </div>
            <div class="min-w-0"><Rating :form="form" field="score" label="Product rating" /></div>
            <div class="min-w-0">
                <Slider :form="form" field="volume" label="Volume" :min="0" :max="100" :step="5" />
            </div>
        </div>
        <div class="flex flex-wrap gap-2">
            <Button type="button" @click="form.users[0].email = 'grace@example.com'"
                >Use Grace's email</Button
            >
            <Button type="button" @click="showErrors">Simulate server errors</Button>
            <Button type="button" appearance="plain" @click="form.clearErrors()"
                >Clear server errors</Button
            >
            <Button type="button" appearance="plain" @click="form.reset()"
                >Reset form values</Button
            >
        </div>
        <output class="text-sm break-words"
            >Email: {{ form.users[0].email }}. Subscribed: {{ form.subscribed }}. Score:
            {{ form.score }}. Volume: {{ form.volume }}.</output
        >
    </div>
</template>
`;

const collectionBindingDemoSource = `<script setup>
import { useForm } from '@inertiajs/vue3';
import {
    Button,
    Option,
    Select,
    TagInput,
} from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { FileInput } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';

/** @type {{ country: string | null, topics: string[], attachments: File[] }} */
const initial = { country: 'br', topics: ['docs'], attachments: [] };
const form = useForm(initial);

function showErrors() {
    form.setError({
        country: 'Choose a destination country.',
        topics: 'Add a second topic.',
        attachments: 'Choose at least one local file.',
    });
}
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-5" data-docs-outline-exclude>
        <div class="min-w-0">
            <Select :form="form" field="country" label="Country" with-clear
                ><Option value="br">Brazil</Option><Option value="pt">Portugal</Option
                ><Option value="ca">Canada</Option></Select
            >
        </div>
        <div class="min-w-0">
            <TagInput
                :form="form"
                field="topics"
                label="Topics"
                hint="Type a topic and press Enter." />
        </div>
        <div class="min-w-0">
            <FileInput :form="form" field="attachments" label="Local attachments" multiple />
        </div>
        <div class="flex flex-wrap gap-2">
            <Button
                type="button"
                @click="
                    form.country = 'pt';
                    form.topics = ['vue', 'forms'];
                "
                >Use Portugal and two topics</Button
            >
            <Button type="button" @click="showErrors">Simulate collection errors</Button>
            <Button type="button" appearance="plain" @click="form.clearErrors()"
                >Clear collection errors</Button
            >
            <Button type="button" appearance="plain" @click="form.reset()"
                >Reset collection values</Button
            >
        </div>
        <output class="text-sm break-words"
            >Country: {{ form.country ?? 'none' }}. Topics: {{ form.topics.join(', ') || 'none' }}.
            Files: {{ form.attachments.map((file) => file.name).join(', ') || 'none' }}.</output
        >
        <p class="text-sm text-slate-500 dark:text-slate-400">
            Files stay in this browser. This demo does not submit or upload them.
        </p>
    </div>
</template>
`;

const calendarBindingDemoSource = `<script setup>
import { useForm } from '@inertiajs/vue3';
import { nextTick, useTemplateRef, watch } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { DateInput, DatePicker } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';

const form = useForm({ date: '2026-01-15' });
const calendar = useTemplateRef('calendar');

watch(
    () => form.date,
    async () => {
        await nextTick();
        await customElements.whenDefined('wa-date-picker');
        const element = calendar.value?.$el;
        if (form.date && element?.isConnected) element.goToDate(form.date);
    },
    { immediate: true },
);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-5" data-docs-outline-exclude>
        <div class="min-w-0">
            <DateInput
                :form="form"
                field="date"
                label="Delivery date"
                hint="Both controls share the same form field." />
        </div>
        <div class="min-w-0">
            <DatePicker ref="calendar" :form="form" field="date" class="max-w-full" />
        </div>
        <div class="flex flex-wrap gap-2">
            <Button type="button" @click="form.date = '2026-02-20'">Use February 20</Button>
            <Button
                type="button"
                @click="form.setError('date', 'Choose an available delivery date.')"
                >Simulate date error</Button
            >
            <Button type="button" appearance="plain" @click="form.clearErrors('date')"
                >Clear date error</Button
            >
            <Button type="button" appearance="plain" @click="form.reset()">Reset date</Button>
        </div>
        <output class="text-sm break-words">Delivery date: {{ form.date || 'none' }}.</output>
    </div>
</template>
`;

const manualValidationDemoSource = `<script setup>
import { computed, ref } from 'vue';
import {
    Button,
    Checkbox,
    Input,
    Rating,
} from '@artisan-toolbox/front-awesome/components/WebAwesome';

const name = ref('');
const accepted = ref(false);
const score = ref(0);
const validated = ref(false);
const nameFailure = computed(() =>
    validated.value && !name.value.trim() ? 'Enter a display name.' : false,
);
const choiceFailure = computed(() =>
    validated.value && !accepted.value
        ? ['Enable the example option.', 'You can change this value without submitting.']
        : false,
);
const scoreFailure = computed(() =>
    validated.value && score.value < 3 ? 'Choose at least three stars.' : false,
);

function reset() {
    name.value = '';
    accepted.value = false;
    score.value = 0;
    validated.value = false;
}
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-5" data-docs-outline-exclude>
        <div class="min-w-0">
            <Input
                v-model="name"
                label="Display name"
                hint="Validation belongs to this demo."
                :failed="nameFailure" />
        </div>
        <div class="min-w-0">
            <Checkbox v-model="accepted" :failed="choiceFailure"
                >Enable the example option</Checkbox
            >
        </div>
        <div class="min-w-0">
            <Rating v-model="score" label="Manual product rating" :failed="scoreFailure" />
        </div>
        <div class="flex flex-wrap gap-2">
            <Button type="button" @click="validated = true">Validate local values</Button>
            <Button type="button" appearance="plain" @click="reset">Reset local validation</Button>
        </div>
        <output class="text-sm break-words"
            >Name: {{ name || 'empty' }}. Enabled: {{ accepted }}. Rating: {{ score }}.</output
        >
    </div>
</template>
`;

const bridgeReuseDemoSource = `<script setup>
import { defineComponent, h, ref, useId } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { useFormBridge } from '@artisan-toolbox/front-awesome';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const BridgeTextField = defineComponent({
    name: 'BridgeTextField',
    props: {
        modelValue: String,
        form: [String, Object],
        field: String,
        fieldName: String,
        label: { type: String, required: true },
        failed: [Boolean, String, Array],
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const id = useId();
        const { value, errors, invalid } = useFormBridge(props, {
            emitValue: (next) => emit('update:modelValue', next),
        });
        return () =>
            h('div', { class: 'flex min-w-0 flex-col gap-2' }, [
                h('label', { for: id, class: 'text-sm font-medium' }, props.label),
                h('input', {
                    id,
                    value: value.value ?? '',
                    'aria-invalid': invalid.value ? 'true' : undefined,
                    'aria-describedby': errors.value.length ? \`\${id}-errors\` : undefined,
                    class: [
                        'min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-base outline-offset-2 dark:bg-slate-950',
                        invalid.value
                            ? 'border-red-600 text-red-700 focus:outline-red-600 dark:text-red-300'
                            : 'border-slate-300 focus:outline-brand-600 dark:border-slate-700',
                    ],
                    onInput(event) {
                        value.value = event.currentTarget.value;
                    },
                }),
                h(
                    'div',
                    {
                        id: \`\${id}-errors\`,
                        role: 'alert',
                        class: 'text-sm text-red-700 dark:text-red-300',
                    },
                    errors.value.map((message) => h('p', message)),
                ),
            ]);
    },
});

const nickname = ref('Ada');
const form = useForm({ nickname: 'Grace' });
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-5" data-docs-outline-exclude>
        <BridgeTextField v-model="nickname" label="Custom model field" />
        <BridgeTextField :form="form" field="nickname" label="Custom Inertia field" />
        <div class="flex flex-wrap gap-2">
            <Button
                type="button"
                @click="
                    nickname = 'Lin';
                    form.nickname = 'Margaret';
                "
                >Update both custom fields</Button
            >
            <Button
                type="button"
                @click="form.setError('nickname', 'This nickname is already taken.')"
                >Simulate custom field error</Button
            >
            <Button type="button" appearance="plain" @click="form.clearErrors()"
                >Clear custom field error</Button
            >
        </div>
        <output class="text-sm break-words"
            >Model: {{ nickname }}. Form: {{ form.nickname }}.</output
        >
    </div>
</template>
`;

const valueDomains = [
    ['Input', 'string | null | undefined', 'string | null | undefined'],
    ['Textarea, NumberInput, ColorPicker', 'string | null', 'string | null'],
    ['OtpInput', 'string', 'string'],
    ['Checkbox, Switch', 'boolean', 'boolean'],
    ['RadioGroup', 'string | number | null', 'string | number | null'],
    ['Rating', 'number', 'number'],
    ['Slider', 'number | null', 'number'],
    ['Select, Combobox in single mode', 'string | string[] | null', 'string | null'],
    ['Select, Combobox with multiple', 'string | string[] | null', 'string[] | null'],
    ['TagInput', 'string[] | string | FormData | null', 'string[]'],
    ['KnownDate, TimeInput', 'string | Date | null', 'string'],
    ['DateInput', 'string | Date | { from?: Date | null; to?: Date | null } | null', 'string'],
    [
        'DatePicker',
        'string | Date | { from?: string | Date | null; to?: string | Date | null } | null',
        'string',
    ],
    ['FileInput', 'File[]', 'File[]'],
];
</script>

<template>
    <ProseSection>
        <p>
            Bind a form control to a Vue value or an existing Inertia field. The Forms page owns
            this shared guide and the component examples below it. The historical Input URL and
            section anchors remain available for existing links.
        </p>
        <DocsCallout variant="caution">
            <template #title>Development preview</template>
            <p>
                This guide describes the shared binding API in the current Front Awesome checkout.
                These APIs may be absent from published alpha releases. Check your
                Composer-installed exports and refresh the frontend vendor copy after updating
                Composer.
            </p>
        </DocsCallout>
        <p>
            Start in the Laravel, Inertia 3, and Vue 3.5 application from
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                >Installation</DocsLink
            >. Complete Composer installation before the frontend vendor-file installation. Keep the
            Front Awesome Vite plugin and Web Awesome styles. Add the examples to a Vue page. The
            toast plugin is optional. Combobox, DateInput, DatePicker, and FileInput require the Pro
            entry point and licensed Web Awesome assets described in Installation.
        </p>

        <h3 id="use-v-model">Use v-model</h3>
        <p>
            Import Core wrappers from
            <code>@artisan-toolbox/front-awesome/components/WebAwesome</code> and Pro wrappers from
            <code>@artisan-toolbox/front-awesome/components/WebAwesome/Pro</code>. Existing
            <code>Input</code> imports from the components entry point and
            <code>@artisan-toolbox/front-awesome/components/Input.vue</code> remain supported.
            Direct <code>components/WebAwesome/Input.vue</code> imports also work.
        </p>
        <p>
            Use an ordinary Vue ref with <code>v-model</code>. The Input below starts with Ada. Edit
            the name to update its output. Every live example includes a resizable preview and its
            complete source under View source.
        </p>
        <slot />
        <p>
            The same default model binds the primary value of each form control. Checkbox and Switch
            bind booleans. Rating binds a number. TagInput commits an array of tags. CheckboxGroup
            only groups its children. Bind each child Checkbox, rather than adding a group model.
        </p>
        <p>
            Named models describe separate component state, such as <code>v-model:open</code>,
            <code>v-model:indeterminate</code>, or <code>v-model:inputValue</code>. They do not turn
            that state into an Inertia form field. See the component examples below and the
            Navigation examples for page and active-item models.
        </p>

        <h3 id="bind-an-inertia-form">Bind an Inertia form</h3>
        <p>
            Pass the object returned by <code>useForm()</code> through <code>:form="form"</code> and
            choose its data field with <code>field="users.0.email"</code>.
            <code>field-name="users.0.email"</code> remains supported. Both names refer to the same
            field. If you supply both, their values must match. Use either this form binding or
            <code>v-model</code> for a control's primary value.
        </p>
        <p>
            Initialize every containing object, array entry, and leaf before rendering. Dotted paths
            address existing own data properties, including array indexes. Missing fields, prototype
            paths, Inertia methods, and Inertia metadata are rejected. The bridge never creates
            missing containers. Replacing a containing array or object rebinds the control to the
            current field. Inertia's <code>form.reset()</code> restores its own defaults.
        </p>
        <DemoFrame
            title="Bind text, boolean, and numeric Inertia fields"
            :sources="[
                {
                    label: 'Inertia form binding example',
                    language: 'vue',
                    code: inertiaBindingDemoSource,
                },
            ]">
            <InertiaBindingDemo />
        </DemoFrame>
        <p>
            The initial values are ada@example.com, false, two stars, and volume 25. Edit any
            control to update its corresponding output. Use Grace's email changes the nested field.
            Reset form values restores those initial values. Simulate server errors adds four field
            errors locally. Clear server errors removes them. These actions make no request.
        </p>

        <h4 id="bind-collections">Bind selections, tags, and files</h4>
        <p>
            Initialize collection fields with the native value shape. This example starts with
            Brazil, the docs tag, and no files. Select a local file to display its filename. Use
            Portugal and two topics replaces the selection and tag array. Reset collection values
            restores the initial data. The files stay in the browser.
        </p>
        <DemoFrame
            title="Bind selections, tags, and local files"
            :sources="[
                {
                    label: 'Collection form binding example',
                    language: 'vue',
                    code: collectionBindingDemoSource,
                },
            ]">
            <CollectionBindingDemo />
        </DemoFrame>

        <h4 id="bind-dates">Bind a date input and calendar</h4>
        <p>
            DateInput and DatePicker below share the date field initialized to January 15, 2026.
            Choose another day or select Use February 20 to update both controls and the output.
            Simulate date error presents the same error at both controls. Clear date error removes
            it, and Reset date restores January 15. No date is submitted.
        </p>
        <p>
            The example watches the selected date and calls the calendar's public
            <code>goToDate()</code> method through its template ref. This reveals the selected month
            after a typed value, programmatic change, or reset. Native
            <code>focused-date</code> controls roving focus but does not navigate an existing month
            view. Moving keyboard focus alone does not select a date or change the Inertia field.
        </p>
        <DemoFrame
            title="Share an Inertia date between input and calendar"
            :sources="[
                {
                    label: 'Calendar form binding example',
                    language: 'vue',
                    code: calendarBindingDemoSource,
                },
            ]">
            <CalendarBindingDemo />
        </DemoFrame>

        <h3 id="display-server-errors">Display server errors</h3>
        <p>
            The bridge reads the exact dotted key in <code>form.errors</code>. In the examples
            above, Simulate server errors, Simulate collection errors, and Simulate date error use
            <code>form.setError()</code> to demonstrate this behavior locally. A real Inertia
            response uses the same error state. All 18 primary form controls support field errors
            and the manual <code>failed</code> prop.
        </p>
        <p>
            An error marks the native host with <code>aria-invalid</code> and applies Web Awesome
            danger tokens to its supported control parts. Controls with a native hint area display
            messages there while preserving the caller's hint for restoration. Rating and DatePicker
            use a shared external message frame because their native components have no hint slot.
            The frame keeps the same native host, focus, public methods, and component ref
            <code>$el</code> while errors change.
        </p>
        <p>
            Messages render as escaped text and share an associated error region. Clearing messages
            restores the ordinary hint and appearance. Web Awesome does not forward every host error
            relationship to the focused input or calendar day inside its Shadow DOM. That upstream
            accessibility limitation also applies here. The wrapper does not mutate private shadow
            content.
        </p>
        <p>
            Editing a field does not clear its server error. Your application owns error clearing
            through Inertia. Server errors and <code>failed</code> do not call
            <code>setCustomValidity()</code> or block a later submission. Native
            <code>required</code>, <code>pattern</code>, and other constraint validation retain
            their Web Awesome behavior.
        </p>

        <h4 id="manual-validation">Display manual validation</h4>
        <p>
            Supply <code>:failed="true"</code> to mark danger without an invented message. A string
            displays one message, and an array displays its messages. Manual messages merge after
            the Inertia field messages. Exact duplicate messages and whitespace-only messages are
            removed. Set <code>failed</code> to <code>false</code> or <code>[]</code> to clear
            manual failure. That does not suppress an existing Inertia error.
        </p>
        <p>
            Vue treats a bare <code>failed</code> attribute as true. Its Boolean prop casting also
            treats <code>:failed="''"</code> as true. Use false or an empty array when you intend to
            clear failure. A boolean-only failure keeps the caller's hint because it has no message
            to replace it.
        </p>
        <DemoFrame
            title="Validate local values without submitting"
            :sources="[
                {
                    label: 'Manual validation example',
                    language: 'vue',
                    code: manualValidationDemoSource,
                },
            ]">
            <ManualValidationDemo />
        </DemoFrame>
        <p>
            Start with an empty name, an unchecked option, and zero stars. Select Validate local
            values to show the computed messages. Enter a name, enable the option, and choose at
            least three stars to clear them. Reset local validation clears the values and the
            validation state. The demo's computed properties own these rules.
        </p>

        <h3 id="keep-web-awesome-behavior">Keep Web Awesome behavior</h3>
        <p>
            Pass native attributes, listeners, and slots directly. Input examples include
            <code>appearance</code>, <code>size</code>, <code>disabled</code>,
            <code>with-clear</code>, <code>@input</code>, <code>@change</code>, and
            <code>@wa-clear</code>. Native slot names such as <code>label</code>,
            <code>start</code>, <code>end</code>, and <code>hint</code> remain available where the
            upstream component supports them. Public option types derive from Web Awesome.
        </p>
        <p>
            The bridge adds no submission, trimming, number conversion, or validation rules.
            NumberInput values remain strings or null, despite the component's name.
            <code>Input type="number"</code> also retains the text bridge's string value domain. Use
            an explicit application conversion when your data model requires a number.
        </p>
        <p>
            For native HTML form association, a string <code>form="profile"</code> identifies the
            form's ID. An Inertia object uses that prop for data binding instead. Native
            <code>name</code> and HTML FormData behavior remain upstream behavior. DatePicker is not
            a native form-associated element. Its Inertia binding does not make it contribute an
            entry to native FormData.
        </p>
        <p>
            With Input, an undefined value displays as an empty string. An explicit
            <code>defaultValue</code> defines its native form-reset baseline. Otherwise, the initial
            bound value defines that baseline. A native HTML form reset updates the Vue owner too.
            Other controls retain their upstream reset domains, such as
            <code>defaultChecked</code> or a textual <code>defaultValue</code>. A Date or tag array
            is a current property input, not a textual reset attribute.
        </p>
        <p>
            Access <code>$el</code> on a component template ref to call a native method such as
            <code>focus()</code>. Form-control refs expose the underlying Web Awesome host even when
            an external error frame is present. Rating and DatePicker keep one stable presentation
            element around the native host. Without binding or manual validation, that element uses
            <code>display: contents</code> and has no group role. Activating validation preserves
            the existing host, selection, focus, and listeners. Target native classes and methods
            through the host rather than assuming it is the outermost DOM node.
        </p>

        <h3 id="binding-contract">Binding contract</h3>
        <ul>
            <li>
                The primary value has one owner. Combining <code>v-model</code> with an Inertia form
                binding throws an error. An Inertia binding requires both the form object and its
                field alias. Conflicting field aliases also throw.
            </li>
            <li>
                Input keeps its original strict contract and requires a binding. The other form
                wrappers also support their native unbound API without new required props.
            </li>
            <li>
                Use unmodified models. Modifiers such as <code>.number</code>, <code>.trim</code>,
                and <code>.lazy</code> are rejected. Native event timing remains authoritative.
            </li>
            <li>
                When bound, do not supply a competing live native value, checked state, or files
                property for the same primary value. Default reset props remain distinct.
            </li>
            <li>
                Field values must match the control's native domain. Numeric models accept finite
                numbers. Arrays require a valid value at every position. Sparse arrays with missing
                positions are rejected; empty collection arrays remain valid. Arrays, Date, File,
                and FormData values retain the current source references at the bridge boundary.
                Inertia can clone its own initial defaults.
            </li>
        </ul>
        <p>
            A setter can accept more types than a native event returns. A date setter accepts a
            Date, while its committed model value is a string. TagInput accepts strings, arrays, or
            FormData, while a committed tag edit returns a string array. This normalization is
            native behavior. The bridge does not stringify objects or clone current values.
        </p>
        <DocsTable
            caption="Primary form-control values accepted and committed by the bridge"
            :columns="['Control', 'Accepted setter input', 'Committed native value']"
            :rows="valueDomains" />
        <p>
            TypeScript checks field compatibility in both directions. The field's declared value
            must fit the setter domain and accept every native committed value. A Date-only field
            cannot accept a date control's string output. Declare a wider field when both are
            required. For controls that can commit null, declare a nullable field, such as
            <code>string | null</code> for a single Select. Multiple Select and Combobox fields must
            accept <code>string[] | null</code>. A bound null clears the current selection without
            replacing its reset default. In multiple mode, the native empty selection reads as an
            empty array. A plain string or array inferred from an initial value may be too narrow.
            Optional undefined values are supported only where the control's domain accepts them.
        </p>

        <h3 id="reuse-the-bridge">Reuse the bridge in a text control</h3>
        <p>
            Call the public <code>useFormBridge(props, options)</code> composable inside setup to
            reuse Input's strict text binding in your own control. Declare reactive
            <code>modelValue</code>, <code>form</code>, <code>field</code>, <code>fieldName</code>,
            and <code>failed</code> props, then provide an <code>emitValue</code> callback. The
            writable computed <code>value</code> routes edits to the owner. Computed
            <code>errors</code> and <code>invalid</code> describe presentation state. Your control
            owns its label, escaped error rendering, ARIA relationships, and styles.
        </p>
        <DemoFrame
            title="Reuse the public bridge in a custom text field"
            :sources="[
                {
                    label: 'Custom text bridge example',
                    language: 'vue',
                    code: bridgeReuseDemoSource,
                },
            ]">
            <BridgeReuseDemo />
        </DemoFrame>
        <p>
            The custom model field starts with Ada and the custom Inertia field starts with Grace.
            Edit either field to update its output. Update both custom fields changes them to Lin
            and Margaret. Simulate custom field error displays an error on the Inertia field. Clear
            custom field error removes it. This example uses native HTML rendering rather than a
            copied Web Awesome implementation.
        </p>
        <p>
            The bridge reads the active component's raw prop presence, so an explicitly undefined
            model differs from an absent binding. Outside component setup, provide
            <code>options.binding</code> as a getter for the current raw props. Include the
            <code>onUpdate:modelValue</code> listener in model mode.
        </p>
        <p>
            For a non-text control, use the generic overload with separate write and read guards,
            <code>acceptsWrite</code> and <code>acceptsRead</code>. Their type predicates infer the
            setter and committed types independently, even when the emit callback ignores its
            parameter. Omitting both guards selects the legacy text overload. Its
            <code>source</code> computed distinguishes <code>native</code>, <code>model</code>, and
            <code>form</code> owners. <code>isBound</code> identifies a bound owner. Set
            <code>optional: true</code> to support native unbound use, and inspect the source before
            reading or writing <code>value</code>. An unbound source has no bridge value.
            <code>modelName</code> selects a named model. <code>allowForm: false</code> keeps
            secondary state independent of primary form errors.
            <code>nativeAliases</code> identifies conflicting live native props.
            <code>componentName</code> identifies your control in errors.
        </p>
        <p>
            Root type exports include <code>FormBindingProps</code>, <code>FormBridgeValue</code>,
            <code>TextFieldName</code>, <code>FormBridgeFailed</code>,
            <code>ControlBindingProps</code>, <code>CompatibleField</code>,
            <code>ControlBridgeOptions</code>, and <code>FormBridgeSource</code>.
            <code>InputProps</code> and <code>InputAttributes</code> remain available. Legacy text
            field types preserve the original Input contract. Generated control types use the
            two-direction field check.
        </p>
        <p>
            See the
            <DocsLink href="https://webawesome.com/docs/components/input/"
                >Web Awesome Input reference</DocsLink
            >
            for native attributes, events, slots, and methods. See the
            <DocsLink href="https://inertiajs.com/docs/v3/the-basics/forms"
                >Inertia forms guide</DocsLink
            >
            for request submission and the server error lifecycle. Use the component catalog below
            for each control's live native behavior.
        </p>
    </ProseSection>
</template>
