<script setup>
import InputContent from '@/components/docs/front-awesome/InputContent.vue';
import FormBindingNotice from '@/components/docs/front-awesome/FormBindingNotice.vue';
import ComboboxDemo from '@/components/demo/front-awesome/forms/ComboboxDemo.vue';
import DateInputDemo from '@/components/demo/front-awesome/forms/DateInputDemo.vue';
import DatePickerDemo from '@/components/demo/front-awesome/forms/DatePickerDemo.vue';
import FileInputDemo from '@/components/demo/front-awesome/forms/FileInputDemo.vue';
import InputDemo from '@/components/demo/front-awesome/forms/InputDemo.vue';
import CheckboxDemo from '@/components/demo/front-awesome/forms/CheckboxDemo.vue';
import CheckboxGroupDemo from '@/components/demo/front-awesome/forms/CheckboxGroupDemo.vue';
import ColorPickerDemo from '@/components/demo/front-awesome/forms/ColorPickerDemo.vue';
import KnownDateDemo from '@/components/demo/front-awesome/forms/KnownDateDemo.vue';
import NumberInputDemo from '@/components/demo/front-awesome/forms/NumberInputDemo.vue';
import OtpInputDemo from '@/components/demo/front-awesome/forms/OtpInputDemo.vue';
import RadioGroupDemo from '@/components/demo/front-awesome/forms/RadioGroupDemo.vue';
import RatingDemo from '@/components/demo/front-awesome/forms/RatingDemo.vue';
import RichTextEditorDemo from '@/components/demo/front-awesome/forms/RichTextEditorDemo.vue';
import SelectDemo from '@/components/demo/front-awesome/forms/SelectDemo.vue';
import OptionDemo from '@/components/demo/front-awesome/forms/OptionDemo.vue';
import SliderDemo from '@/components/demo/front-awesome/forms/SliderDemo.vue';
import SwitchDemo from '@/components/demo/front-awesome/forms/SwitchDemo.vue';
import TagInputDemo from '@/components/demo/front-awesome/forms/TagInputDemo.vue';
import TextareaDemo from '@/components/demo/front-awesome/forms/TextareaDemo.vue';
import TimeInputDemo from '@/components/demo/front-awesome/forms/TimeInputDemo.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CatalogContext from '@/components/docs/front-awesome/catalog/CatalogContext.vue';
import ComponentCatalog from '@/components/docs/front-awesome/catalog/ComponentCatalog.vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
const example1 = `<script setup>
import { ref } from 'vue';
import { Button, Input } from '@artisan-toolbox/front-awesome/components';

const name = ref('Ada');
\x3C/script>

<template>
    <form class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude @submit.prevent>
        <div class="min-w-0"><Input v-model="name" label="Name" with-clear /></div>
        <div class="flex flex-wrap gap-2">
            <Button type="button" @click="name = 'Grace'">Use Grace</Button>
            <Button type="reset" appearance="plain">Reset name</Button>
        </div>
        <output>{{ name }}</output>
    </form>
</template>
`;

const checkboxDemoSource = `<script setup>
import { ref } from 'vue';
import { Checkbox, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const checked = ref(false);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Checkbox v-model="checked">Receive release updates</Checkbox>
        </div>
        <div class="min-w-0">
            <output aria-live="polite">Enabled: {{ checked }}</output>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="checked = false">Reset</Button>
        </div>
    </div>
</template>
`;
const checkboxGroupDemoSource = `<script setup>
import { ref } from 'vue';
import { CheckboxGroup, Checkbox } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const email = ref(false);
const dashboard = ref(false);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <CheckboxGroup label="Updates" hint="Choose one or both channels.">
                <Checkbox name="email" v-model="email">Email</Checkbox>
                <Checkbox name="dashboard" v-model="dashboard">Dashboard</Checkbox>
            </CheckboxGroup>
        </div>
        <div class="min-w-0">
            <output>Email: {{ email }}. Dashboard: {{ dashboard }}.</output>
        </div>
    </div>
</template>
`;
const colorPickerDemoSource = `<script setup>
import { ref } from 'vue';
import { ColorPicker, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const initialValue = '#4f46e5';
const value = ref(initialValue);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <ColorPicker label="Accent color" v-model="value" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">Current value: {{ value }}</output>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="value = initialValue">Reset</Button>
        </div>
    </div>
</template>
`;
const knownDateDemoSource = `<script setup>
import { ref } from 'vue';
import { KnownDate, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const initialValue = '2026-11-09';
const value = ref(initialValue);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <KnownDate label="Document date" v-model="value" locale="en-GB" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">Current value: {{ value }}</output>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="value = initialValue">Reset</Button>
        </div>
    </div>
</template>
`;
const numberInputDemoSource = `<script setup>
import { ref } from 'vue';
import { NumberInput, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const initialValue = '2';
const value = ref(initialValue);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <NumberInput label="Quantity" v-model="value" :min="1" :max="10" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">Current value: {{ value }}</output>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="value = initialValue">Reset</Button>
        </div>
    </div>
</template>
`;
const otpInputDemoSource = `<script setup>
import { ref } from 'vue';
import { OtpInput, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const initialValue = '';
const value = ref(initialValue);
const submitted = ref('');

function resetExample() {
    value.value = initialValue;
    submitted.value = '';
}
\x3C/script>

<template>
    <form
        id="otp-example-form"
        method="post"
        class="flex min-w-0 flex-col gap-4"
        data-docs-outline-exclude
        @submit.prevent="submitted = value"
        @reset="resetExample">
        <div class="min-w-0">
            <OtpInput
                id="otp-example-code"
                name="verification_code"
                label="Verification code"
                autocomplete="one-time-code"
                type="numeric"
                v-model="value"
                :length="6"
                required />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">Current value: {{ value }}</output>
        </div>
        <div v-if="submitted" class="min-w-0">
            <output aria-live="polite"
                >Submitted code: {{ submitted }}. No request was sent.</output
            >
        </div>
        <div class="min-w-0">
            <div class="flex flex-wrap gap-2">
                <Button type="submit">Submit example</Button>
                <Button type="reset" appearance="plain">Reset</Button>
            </div>
        </div>
    </form>
</template>
`;
const radioGroupDemoSource = `<script setup>
import { ref } from 'vue';
import { RadioGroup, Radio } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const value = ref('stable');
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <RadioGroup label="Release channel" v-model="value">
                <Radio value="stable">Stable</Radio>
                <Radio value="preview">Preview</Radio>
            </RadioGroup>
        </div>
        <div class="min-w-0">
            <output>Selected channel: {{ value }}</output>
        </div>
    </div>
</template>
`;
const ratingDemoSource = `<script setup>
import { ref } from 'vue';
import { Rating, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const initialValue = 3;
const value = ref(initialValue);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Rating label="Package rating" v-model="value" :max="5" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">Current value: {{ value }}</output>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="value = initialValue">Reset</Button>
        </div>
    </div>
</template>
`;
const selectDemoSource = `<script setup>
import { ref } from 'vue';
import { Checkbox, Icon, Select } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const cityId = ref(1);
const strictSearch = ref(false);
const cityGroups = [
    {
        label: 'Northeast',
        options: [
            { id: 1, name: 'Salvador', icon: 'location-dot' },
            { id: 4, name: 'São Luís', icon: 'location-dot', disabled: true },
            { id: 3, name: 'Recife', icon: 'location-dot' },
        ],
    },
    {
        label: 'Southeast',
        options: [{ id: 2, name: 'São Paulo', icon: 'location-dot' }],
    },
];
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <Select
            v-model="cityId"
            label="City"
            :options="cityGroups"
            grouped
            option-value="id"
            option-label="name"
            :strict-search="strictSearch">
            <template #option="{ label, option }">
                <Icon slot="start" :name="option.icon" aria-hidden="true" />
                {{ label }}
            </template>
        </Select>
        <Checkbox v-model="strictSearch">Match case and accents</Checkbox>
        <output aria-live="polite">Selected city ID: {{ cityId }} ({{ typeof cityId }})</output>
    </div>
</template>
`;
const optionDemoSource = `<script setup>
import { ref } from 'vue';
import { Option } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import '@web.awesome.me/webawesome-pro/dist/components/select/select.js';

const value = ref('still');
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <wa-select label="Water" value="still" @change="value = $event.currentTarget.value">
            <Option value="still">Still</Option>
            <Option value="sparkling">Sparkling</Option>
            <Option value="flavored" disabled>Flavored (unavailable)</Option>
        </wa-select>
        <output aria-live="polite">Selected water: {{ value }}</output>
    </div>
</template>
`;
const sliderDemoSource = `<script setup>
import { ref } from 'vue';
import { Slider, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const initialValue = 3;
const value = ref(initialValue);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Slider label="Team size" v-model="value" :min="1" :max="10" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">Current value: {{ value }}</output>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="value = initialValue">Reset</Button>
        </div>
    </div>
</template>
`;
const switchDemoSource = `<script setup>
import { ref } from 'vue';
import { Switch, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const checked = ref(false);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Switch v-model="checked">Enable notifications</Switch>
        </div>
        <div class="min-w-0">
            <output aria-live="polite">Enabled: {{ checked }}</output>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="checked = false">Reset</Button>
        </div>
    </div>
</template>
`;
const tagInputDemoSource = `<script setup>
import { ref } from 'vue';
import { TagInput, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const initialValue = ['laravel', 'vue'];
const value = ref([...initialValue]);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <TagInput label="Keywords" v-model="value" placeholder="Add a keyword" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">Current value: {{ value.join(', ') }}</output>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="value = [...initialValue]">Reset</Button>
        </div>
    </div>
</template>
`;
const textareaDemoSource = `<script setup>
import { ref } from 'vue';
import { Textarea, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const initialValue = 'Ready for review.';
const value = ref(initialValue);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Textarea label="Release notes" v-model="value" :rows="3" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">Current value: {{ value }}</output>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="value = initialValue">Reset</Button>
        </div>
    </div>
</template>
`;
const timeInputDemoSource = `<script setup>
import { ref } from 'vue';
import { TimeInput, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const initialValue = '09:30';
const value = ref(initialValue);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <TimeInput label="Meeting time" v-model="value" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">Current value: {{ value }}</output>
        </div>
        <div class="min-w-0">
            <Button type="button" @click="value = initialValue">Reset</Button>
        </div>
    </div>
</template>
`;

const comboboxDemoSource = `<script setup>
import { ref } from 'vue';
import { Combobox } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';

const value = ref('core');
const packageGroups = [
    {
        label: 'Foundations',
        options: [{ id: 'core', name: 'Core' }],
    },
    {
        label: 'Frontend',
        options: [
            { id: 'front-awesome', name: 'Front Awesome' },
            { id: 'mosaicast', name: 'Mosaicast' },
        ],
    },
];
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <Combobox
            v-model="value"
            label="Package"
            :options="packageGroups"
            grouped
            option-value="id"
            option-label="name" />
        <output aria-live="polite">Selected package: {{ value }}</output>
    </div>
</template>
`;
const dateInputDemoSource = `<script setup>
import { ref } from 'vue';
import { DateInput } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const value = ref('2026-11-09');
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <DateInput
                label="Release date"
                v-model="value"
                min="2026-11-01"
                max="2026-11-30"
                today="2026-11-09" />
        </div>
        <div class="min-w-0">
            <output>Selected date: {{ value }}</output>
        </div>
        <div class="min-w-0">
            <Button @click="value = '2026-11-09'">Reset date</Button>
        </div>
    </div>
</template>
`;
const datePickerDemoSource = `<script setup>
import { ref } from 'vue';
import { DatePicker } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const value = ref('2026-11-09');
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <DatePicker
                aria-label="Release date"
                v-model="value"
                min="2026-11-01"
                max="2026-11-30"
                today="2026-11-09" />
        </div>
        <div class="min-w-0">
            <output>Selected date: {{ value }}</output>
        </div>
        <div class="min-w-0">
            <Button @click="value = '2026-11-09'">Reset date</Button>
        </div>
    </div>
</template>
`;
const fileInputDemoSource = `<script setup>
import { ref } from 'vue';
import { FileInput } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const files = ref([]);
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <FileInput
                label="Local text files"
                accept=".txt,text/plain"
                :multiple="true"
                v-model="files" />
        </div>
        <div class="min-w-0">
            <output>{{
                files.length ? files.map((file) => file.name).join(', ') : 'No files selected'
            }}</output>
        </div>
        <div class="min-w-0">
            <Button @click="files = []">Clear selection</Button>
        </div>
    </div>
</template>
`;

const richTextEditorDemoSource = `<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { RichTextEditor } from '@artisan-toolbox/front-awesome/components/WebAwesome/Pro';

const initialValue = '<p>Release notes</p>';
const body = ref(initialValue);
const submitted = ref(null);

function submit(event) {
    submitted.value = new FormData(event.currentTarget).get('body');
}
\x3C/script>

<template>
    <form
        class="flex min-w-0 flex-col gap-4"
        data-docs-outline-exclude
        @submit.prevent="submit"
        @reset="submitted = null">
        <div class="min-w-0">
            <RichTextEditor
                v-model="body"
                :default-value="initialValue"
                name="body"
                label="Release notes"
                hint="Select text to format it."
                toolbar="bold italic"
                required />
        </div>
        <div class="min-w-0">
            <output class="break-words">Current HTML: {{ body }}</output>
        </div>
        <div v-if="submitted !== null" class="min-w-0">
            <output class="break-words">Submitted HTML: {{ submitted }}</output>
        </div>
        <div class="min-w-0">
            <div class="flex flex-wrap gap-2">
                <Button type="submit">Submit example</Button>
                <Button type="reset" appearance="plain">Reset editor</Button>
            </div>
        </div>
    </form>
</template>
`;

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <CatalogContext :navigation="navigation" />
        <FormBindingNotice />
        <ProseSection id="components" title="Component status" :prose="false">
            <ComponentCatalog group="forms" :navigation="navigation" />
        </ProseSection>
        <ProseSection id="input" title="Input">
            <p>
                To format postal codes, document numbers, or phone numbers as users type, see
                <DocsLink href="/docs/front-awesome/web-awesome/components/forms/masked-input"
                    >MaskedInput</DocsLink
                >.
            </p>
            <InputContent :navigation="navigation">
                <DemoFrame
                    data-catalog-demo="Input"
                    title="Input example"
                    :sources="[{ label: 'Input basic example', language: 'vue', code: example1 }]">
                    <InputDemo />
                </DemoFrame>
            </InputContent>
        </ProseSection>
        <ProseSection id="checkbox" title="Checkbox">
            <p>Toggle an independent choice.</p>
            <DemoFrame
                data-catalog-demo="Checkbox"
                title="Checkbox example"
                :sources="[
                    { label: 'Checkbox basic example', language: 'vue', code: checkboxDemoSource },
                ]">
                <CheckboxDemo />
            </DemoFrame>
            <p>Expected result. Toggle the control to update Enabled. Reset returns it to false.</p>
        </ProseSection>
        <ProseSection id="checkbox-group" title="Checkbox Group">
            <p>Label related checkbox choices.</p>
            <DemoFrame
                data-catalog-demo="CheckboxGroup"
                title="Checkbox Group example"
                :sources="[
                    {
                        label: 'Checkbox Group basic example',
                        language: 'vue',
                        code: checkboxGroupDemoSource,
                    },
                ]">
                <CheckboxGroupDemo />
            </DemoFrame>
            <p>
                Expected result. Email and Dashboard toggle independently under one accessible group
                label. The group does not create a combined form value.
            </p>
        </ProseSection>
        <ProseSection id="color-picker" title="Color Picker">
            <p>Choose a color value.</p>
            <DemoFrame
                data-catalog-demo="ColorPicker"
                title="Color Picker example"
                :sources="[
                    {
                        label: 'Color Picker basic example',
                        language: 'vue',
                        code: colorPickerDemoSource,
                    },
                ]">
                <ColorPickerDemo />
            </DemoFrame>
            <p>
                Expected result. Edit accent color to update Current value from the native input
                event. Reset restores the initial value.
            </p>
        </ProseSection>
        <ProseSection id="known-date" title="Known Date">
            <p>Represent a known calendar date.</p>
            <DemoFrame
                data-catalog-demo="KnownDate"
                title="Known Date example"
                :sources="[
                    {
                        label: 'Known Date basic example',
                        language: 'vue',
                        code: knownDateDemoSource,
                    },
                ]">
                <KnownDateDemo />
            </DemoFrame>
            <p>
                Expected result. Edit document date to update Current value from the native input
                event. Reset restores the initial value.
            </p>
        </ProseSection>
        <ProseSection id="number-input" title="Number Input">
            <p>Enter a numeric value.</p>
            <DemoFrame
                data-catalog-demo="NumberInput"
                title="Number Input example"
                :sources="[
                    {
                        label: 'Number Input basic example',
                        language: 'vue',
                        code: numberInputDemoSource,
                    },
                ]">
                <NumberInputDemo />
            </DemoFrame>
            <p>
                Expected result. Edit quantity to update Current value from the native input event.
                Reset restores the initial value.
            </p>
        </ProseSection>
        <ProseSection id="otp-input" title="OTP Input">
            <p>
                Enter a one-time code as a string. OtpInput displays segments over one native text
                input. Its default <code>autocomplete="one-time-code"</code> identifies the field's
                purpose. The numeric mode sets <code>inputmode="numeric"</code> while preserving
                leading zeros. Use a stable name, ID, and visible label inside a form.
            </p>
            <DemoFrame
                data-catalog-demo="OtpInput"
                title="OTP Input example"
                :sources="[
                    { label: 'OTP Input basic example', language: 'vue', code: otpInputDemoSource },
                ]">
                <OtpInputDemo />
            </DemoFrame>
            <p>
                Expected result. Fill 001234, then choose Submit example. Both outputs retain all
                six characters. This demo does not verify a real code or send a request. Reset
                clears the value and submitted result. Automatic submission remains opt-in.
            </p>
            <p>
                The same <code>one-time-code</code> token is recommended by
                <DocsLink href="https://www.1password.dev/web/compatible-website-design"
                    >1Password</DocsLink
                >,
                <DocsLink
                    href="https://developer.chrome.com/docs/modern-web-guidance/guides/forms/sms-otp-form"
                    >Google's OTP form guide</DocsLink
                >, and
                <DocsLink
                    href="https://developer.apple.com/documentation/authenticationservices/securing-logins-with-icloud-keychain-verification-codes"
                    >Apple Password AutoFill</DocsLink
                >. Mozilla documents it in the
                <DocsLink
                    href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete#one-time-code"
                    >autocomplete reference</DocsLink
                >. These are recognition hints. Suggestions depend on the browser, operating system,
                provider, and saved code or supported message source. Do not add invented
                provider-specific attributes or use a number input for codes.
            </p>
            <p>
                For a single-box design, use Input with <code>type="text"</code>,
                <code>inputmode="numeric"</code>, and <code>autocomplete="one-time-code"</code>.
                Keep the code in a string field and declare your required length and pattern.
                Alphanumeric OtpInput codes use <code>type="alphanumeric"</code> and the text
                keyboard. WebOTP SMS retrieval is a separate optional application integration;
                adding autocomplete does not request an SMS or generate a code.
            </p>
        </ProseSection>
        <ProseSection id="radio-group" title="Radio Group">
            <p>Choose one value from related options.</p>
            <DemoFrame
                data-catalog-demo="RadioGroup"
                title="Radio Group example"
                :sources="[
                    {
                        label: 'Radio Group basic example',
                        language: 'vue',
                        code: radioGroupDemoSource,
                    },
                ]">
                <RadioGroupDemo />
            </DemoFrame>
            <p>
                Expected result. Choose Preview or Stable. Only one radio remains selected and
                Selected channel reflects its value.
            </p>
        </ProseSection>
        <ProseSection id="radio" title="Radio">
            <p>
                Radio supplies choices and values inside RadioGroup. The group owns the selected
                value.
            </p>
            <p><DocsLink href="#radio-group">See the RadioGroup example and source</DocsLink>.</p>
        </ProseSection>
        <ProseSection id="rating" title="Rating">
            <p>Choose a rating value.</p>
            <DemoFrame
                data-catalog-demo="Rating"
                title="Rating example"
                :sources="[
                    { label: 'Rating basic example', language: 'vue', code: ratingDemoSource },
                ]">
                <RatingDemo />
            </DemoFrame>
            <p>
                Expected result. Click a star to update Current value from the native change event.
                Reset restores the initial value.
            </p>
        </ProseSection>
        <ProseSection id="select" title="Select">
            <p>
                In Front Awesome <code>1.0.0-beta.12</code> or later, pass an array through
                <code>options</code>. By default, each item supplies both the value and the label.
                For object items, use <code>option-value</code> and <code>option-label</code> to
                read named properties. When no label mapping applies, Vue displays the item itself.
                Use <code>v-model</code> or an Inertia form binding to receive the original value
                type.
            </p>
            <p>
                Give each option a unique value. Select skips items whose resolved value is
                <code>undefined</code>. Set <code>disabled: true</code> on an object item to make
                the option unavailable. An empty or omitted <code>options</code> array displays
                <strong>No options</strong> when you open the list.
            </p>
            <p>
                <code>grouped</code> defaults to <code>false</code>. Enable it to pass an array of
                groups, each with an <code>options</code> array and an optional <code>label</code>.
                TypeScript apps can import <code>OptionGroup&lt;T&gt;</code> from
                <code>@artisan-toolbox/front-awesome</code>. Select places a divider between visible
                groups and renders each label as a <code>&lt;small&gt;</code> heading above its
                choices. Search keeps groups with matching options and hides empty groups and their
                dividers.
            </p>
            <DemoFrame
                data-catalog-demo="Select"
                title="Select example"
                :sources="[
                    { label: 'Select basic example', language: 'vue', code: selectDemoSource },
                ]">
                <SelectDemo />
            </DemoFrame>
            <p>
                Open <strong>City</strong> and type <code>sao</code>. Press Arrow Down to skip the
                disabled São Luís option and focus São Paulo. Press Enter to select São Paulo. The
                output shows <code>2 (number)</code>. If you move focus to a result while the list
                is opening, the result keeps focus.
            </p>
            <p>
                Search ignores case and accents by default. Enable
                <strong>Match case and accents</strong> to set <code>strict-search</code>. Open City
                again. The same query yields no matches, while <code>São</code> finds São Paulo.
                Changing the search leaves the selected city ID in place. Press Escape to close the
                list and return focus to City.
            </p>
            <p>
                When upgrading from beta.11, move each default-slot option's value and label into
                the
                <code>options</code> array. Use <code>#option</code> for custom content. The slot
                receives <code>value</code>, the display string <code>label</code>, and the original
                item as <code>option</code>. Use the slot to customize an individual option. The
                example reads <code>option.icon</code> to add a decorative icon alongside the label.
            </p>
            <p>
                Open <strong>City</strong> to see Northeast and Southeast. Type
                <code>Paulo</code> to see São Paulo under Southeast. Clear the search to restore
                both groups and the divider. Search matches option labels, so typing
                <code>Southeast</code> shows <strong>No matching results</strong>.
            </p>
            <p>
                To reuse property names across the application, set
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'front-awesome/vue-plugin').href +
                        '#set-default-option-properties'
                    "
                    >defaults in the Vue plugin</DocsLink
                >.
            </p>
        </ProseSection>
        <ProseSection id="option" title="Option">
            <p>
                Use the standalone <code>Option</code> wrapper with the native Select or Combobox
                element. Import the parent element from the Web Awesome edition configured for your
                application. This example uses Pro. With Core, import the native Select from
                <code>@awesome.me/webawesome</code>.
            </p>
            <DemoFrame
                data-catalog-demo="Option"
                title="Option example"
                :sources="[
                    { label: 'Option basic example', language: 'vue', code: optionDemoSource },
                ]">
                <OptionDemo />
            </DemoFrame>
            <p>
                Open <strong>Water</strong> and select <strong>Sparkling</strong>. The output shows
                <code>sparkling</code>. Flavored remains disabled.
            </p>
        </ProseSection>
        <ProseSection id="slider" title="Slider">
            <p>Choose a value along a range.</p>
            <DemoFrame
                data-catalog-demo="Slider"
                title="Slider example"
                :sources="[
                    { label: 'Slider basic example', language: 'vue', code: sliderDemoSource },
                ]">
                <SliderDemo />
            </DemoFrame>
            <p>
                Expected result. Edit team size to update Current value from the native input event.
                Reset restores the initial value.
            </p>
        </ProseSection>
        <ProseSection id="switch" title="Switch">
            <p>Toggle a setting on or off.</p>
            <DemoFrame
                data-catalog-demo="Switch"
                title="Switch example"
                :sources="[
                    { label: 'Switch basic example', language: 'vue', code: switchDemoSource },
                ]">
                <SwitchDemo />
            </DemoFrame>
            <p>Expected result. Toggle the control to update Enabled. Reset returns it to false.</p>
        </ProseSection>
        <ProseSection id="tag-input" title="Tag Input">
            <p>Enter a collection of tags.</p>
            <DemoFrame
                data-catalog-demo="TagInput"
                title="Tag Input example"
                :sources="[
                    { label: 'Tag Input basic example', language: 'vue', code: tagInputDemoSource },
                ]">
                <TagInputDemo />
            </DemoFrame>
            <p>
                Expected result. Edit keywords to update Current value from the native input event.
                Reset restores the initial value.
            </p>
        </ProseSection>
        <ProseSection id="textarea" title="Textarea">
            <p>Enter multiple lines of text.</p>
            <DemoFrame
                data-catalog-demo="Textarea"
                title="Textarea example"
                :sources="[
                    { label: 'Textarea basic example', language: 'vue', code: textareaDemoSource },
                ]">
                <TextareaDemo />
            </DemoFrame>
            <p>
                Expected result. Edit release notes to update Current value from the native input
                event. Reset restores the initial value.
            </p>
        </ProseSection>
        <ProseSection id="time-input" title="Time Input">
            <p>Enter a time value.</p>
            <DemoFrame
                data-catalog-demo="TimeInput"
                title="Time Input example"
                :sources="[
                    {
                        label: 'Time Input basic example',
                        language: 'vue',
                        code: timeInputDemoSource,
                    },
                ]">
                <TimeInputDemo />
            </DemoFrame>
            <p>
                Expected result. Edit meeting time to update Current value from the native input
                event. Reset restores the initial value.
            </p>
        </ProseSection>
        <ProseSection id="combobox" title="Combobox">
            <p>
                Combine text entry with suggested choices. Use Front Awesome
                <code>1.0.0-beta.12</code> or later and licensed Web Awesome Pro assets. Combobox
                uses its native text field to search the options.
            </p>
            <DemoFrame
                data-catalog-demo="Combobox"
                title="Combobox example"
                :sources="[
                    { label: 'Combobox basic example', language: 'vue', code: comboboxDemoSource },
                ]">
                <ComboboxDemo />
            </DemoFrame>
            <p>
                Open <strong>Package</strong> to see Foundations and Frontend. Type
                <code>front</code> to see Front Awesome under Frontend. The committed value stays
                <code>core</code> until you select Front Awesome. The output then shows
                <code>front-awesome</code>. See the
                <DocsLink href="#select">Select example</DocsLink> for the shared
                <code>grouped</code> prop, option mappings, and <code>#option</code>
                slot.
            </p>
        </ProseSection>
        <ProseSection id="date-input" title="Date Input">
            <p>Enter a date in a form. This example uses the licensed Web Awesome Pro runtime.</p>
            <DemoFrame
                data-catalog-demo="DateInput"
                title="Date Input example"
                :sources="[
                    {
                        label: 'Date Input basic example',
                        language: 'vue',
                        code: dateInputDemoSource,
                    },
                ]">
                <DateInputDemo />
            </DemoFrame>
            <p>
                Expected result. Choose a date in November 2026 to update the ISO date below. Dates
                outside the minimum and maximum are unavailable. Reset date restores November 9.
            </p>
        </ProseSection>
        <ProseSection id="date-picker" title="Date Picker">
            <p>
                Choose a date from a calendar. This example uses the licensed Web Awesome Pro
                runtime.
            </p>
            <DemoFrame
                data-catalog-demo="DatePicker"
                title="Date Picker example"
                :sources="[
                    {
                        label: 'Date Picker basic example',
                        language: 'vue',
                        code: datePickerDemoSource,
                    },
                ]">
                <DatePickerDemo />
            </DemoFrame>
            <p>
                Expected result. Choose a date in November 2026 to update the ISO date below. Dates
                outside the minimum and maximum are unavailable. Reset date restores November 9.
            </p>
        </ProseSection>
        <ProseSection id="file-input" title="File Input">
            <p>Select files for a form. This example uses the licensed Web Awesome Pro runtime.</p>
            <DemoFrame
                data-catalog-demo="FileInput"
                title="File Input example"
                :sources="[
                    {
                        label: 'File Input basic example',
                        language: 'vue',
                        code: fileInputDemoSource,
                    },
                ]">
                <FileInputDemo />
            </DemoFrame>
            <p>
                Expected result. Select one or more local text files. Their names appear below.
                Clear selection removes them. This example reads no file contents and uploads
                nothing.
            </p>
        </ProseSection>
        <ProseSection id="rich-text-editor" title="Rich Text Editor">
            <p>
                Rich Text Editor requires Front Awesome beta.13 or later and licensed Web Awesome
                Pro 3.15.0 or later. The upstream editor is experimental. Complete the Pro edition
                setup in
                <DocsLink
                    :href="`${findNavigationItem(navigation, 'front-awesome/web-awesome').href}#choose-core-or-pro`"
                    >Web Awesome setup</DocsLink
                >
                before using the example.
            </p>
            <p>
                Bind the document with <code>v-model</code> or <code>:form</code> and
                <code>field</code>. The editor emits serialized HTML by default. Use
                <code>format="markdown"</code> to read, write, and submit Markdown. Set
                <code>default-value</code> for native form reset. Use a value binding for stored
                content and sanitize user-authored HTML before rendering it in your application.
            </p>
            <DemoFrame
                data-catalog-demo="RichTextEditor"
                title="Rich Text Editor example"
                :sources="[
                    {
                        label: 'Rich Text Editor basic example',
                        language: 'vue',
                        code: richTextEditorDemoSource,
                    },
                ]">
                <RichTextEditorDemo />
            </DemoFrame>
            <p>
                Select “Release notes” and choose Bold. The current HTML shows
                <code>&lt;strong&gt;</code>. Submit the example to see the HTML from native form
                data. Reset restores the starting text and clears the submitted output.
            </p>
        </ProseSection>
    </article>
</template>
