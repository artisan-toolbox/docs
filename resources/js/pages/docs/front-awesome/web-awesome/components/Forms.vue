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
import SelectDemo from '@/components/demo/front-awesome/forms/SelectDemo.vue';
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
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <OtpInput label="Verification code" v-model="value" :length="6" />
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
import { Select, Option } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const value = ref('core');
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Select label="Package" v-model="value">
                <Option value="core">Core</Option>
                <Option value="front-awesome">Front Awesome</Option>
                <Option value="unavailable" :disabled="true">Unavailable</Option>
            </Select>
        </div>
        <div class="min-w-0">
            <output>Selected package: {{ value }}</output>
        </div>
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
import { Button, Option } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const value = ref('core');
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Combobox label="Package" v-model="value">
                <Option value="core">Core</Option>
                <Option value="front-awesome">Front Awesome</Option>
                <Option value="mosaicast">Mosaicast</Option>
            </Combobox>
        </div>
        <div class="min-w-0">
            <output>Selected package: {{ value }}</output>
        </div>
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
            <p>Enter a one-time code.</p>
            <DemoFrame
                data-catalog-demo="OtpInput"
                title="OTP Input example"
                :sources="[
                    { label: 'OTP Input basic example', language: 'vue', code: otpInputDemoSource },
                ]">
                <OtpInputDemo />
            </DemoFrame>
            <p>
                Expected result. Edit verification code to update Current value from the native
                input event. Reset restores the initial value.
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
            <p>Choose from a list of options.</p>
            <DemoFrame
                data-catalog-demo="Select"
                title="Select example"
                :sources="[
                    { label: 'Select basic example', language: 'vue', code: selectDemoSource },
                ]">
                <SelectDemo />
            </DemoFrame>
            <p>
                Expected result. Open Package and choose Front Awesome. The displayed selection
                changes. Unavailable cannot be selected.
            </p>
        </ProseSection>
        <ProseSection id="option" title="Option">
            <p>
                Option supplies Select choices, labels, values, and disabled state. Option is also
                usable in Combobox; retain that distinct scenario.
            </p>
            <p><DocsLink href="#select">See the Select example and source</DocsLink>.</p>
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
                Combine text entry with suggested choices. This example requires the Pro source
                preview and Web Awesome Pro 3.14.0.
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
                Expected result. Type part of a package name to filter local options. Select one to
                update Selected package. No server request is made.
            </p>
        </ProseSection>
        <ProseSection id="date-input" title="Date Input">
            <p>
                Enter a date in a form. This example requires the Pro source preview and Web Awesome
                Pro 3.14.0.
            </p>
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
                Choose a date from a calendar. This example requires the Pro source preview and Web
                Awesome Pro 3.14.0.
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
            <p>
                Select files for a form. This example requires the Pro source preview and Web
                Awesome Pro 3.14.0.
            </p>
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
    </article>
</template>
