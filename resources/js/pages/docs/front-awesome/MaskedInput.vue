<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import MaskedInputDemo from '@/components/demo/front-awesome/forms/MaskedInputDemo.vue';
import MaskTemplatesDemo from '@/components/demo/front-awesome/forms/MaskTemplatesDemo.vue';
import demoSource from '../../../components/demo/front-awesome/forms/MaskedInputDemo.vue?raw';
import templateDemoSource from '../../../components/demo/front-awesome/forms/MaskTemplatesDemo.vue?raw';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const postalCodeExample = `<script setup>
import { ref } from 'vue';
import MaskedInput from '@artisan-toolbox/front-awesome/components/MaskedInput.vue';

const postalCode = ref('');
\x3C/script>

<template>
    <MaskedInput
        v-model="postalCode"
        label="Brazilian postal code"
        hint="Enter eight digits."
        mask="#####-###"
        inputmode="numeric"
        autocomplete="postal-code"
        name="postal_code" />
</template>`;
const cpfExample = `<script setup>
import { ref } from 'vue';
import { MaskedInput, useMaskTemplate } from '@artisan-toolbox/front-awesome';

const cpf = ref('');
\x3C/script>

<template>
    <MaskedInput v-model="cpf" :mask="useMaskTemplate().Brazilian.cpf()" label="CPF" name="cpf" />
</template>`;

const globalMaskExample = `<template>
    <MaskedInput v-model="cpf" :mask="$maskTemplates.Brazilian.cpf()" label="CPF" />
    <MaskedInput v-model="postalCode" :mask="postalCodeMask" label="Brazilian postal code" />
</template>

<script>
import { MaskedInput } from '@artisan-toolbox/front-awesome';

export default {
    components: { MaskedInput },
    data() {
        return { cpf: '', postalCode: '' };
    },
    computed: {
        postalCodeMask() {
            return this.$maskTemplates.Brazilian.cep();
        },
    },
};
\x3C/script>`;

const shelfExample = `<script setup lang="ts">
import { ref } from 'vue';
import { MaskedInput, type MaskTemplate } from '@artisan-toolbox/front-awesome';
import Button from '@artisan-toolbox/front-awesome/components/Button.vue';

const shelf = ref('');
const shelfTemplate: MaskTemplate = {
    mask: 'XX-##',
    tokens: { X: { accept: /[A-Z]/, transform: (letter) => letter.toUpperCase() } },
    guide: 'focus',
    valueMode: 'formatted',
    isComplete: (raw) => raw.slice(2) !== '00',
};
\x3C/script>

<template>
    <form @submit.prevent>
        <MaskedInput
            v-model="shelf"
            :mask="shelfTemplate"
            name="shelf"
            label="Shelf code"
            hint="Enter two letters and a number from 01 to 99."
            value-mode="raw"
            incomplete-message="Enter a shelf code ending in 01 to 99."
            required />
        <Button type="submit">Check shelf</Button>
        <p>Model value {{ shelf }}</p>
    </form>
</template>`;

const phoneRows = [
    ['landline() / mobile()', 'Local subscriber number', '3456-7890 / 98765-4321'],
    [
        'regionalLandline() / regionalMobile()',
        'Include the area code (DDD)',
        '(11) 3456-7890 / (11) 98765-4321',
    ],
    ['regionalPhone()', 'Either subscriber number with DDD', '(11) 98765-4321'],
    ['internationalPhone()', 'Include Brazil’s country code and DDD', '+55 (11) 98765-4321'],
    ['shortCode3() / shortCode4()', 'Three or four digits starting with 1', '190 / 1052'],
    ['shortCode5()', 'Five-digit carrier codes starting with 103 or 106', '10315 / 10621'],
    ['serviceCenter()', 'Eight digits starting with 300x or 400x', '3003-0100'],
    ['nonGeographicPhone()', 'Any of the five supported service prefixes below', '0800 123 4567'],
    ['tollFree() / sharedCost()', '0800 / 0300', '0800 123 4567 / 0300 123 4567'],
    ['donation() / premium()', '0500 / 0900', '0500 123 4567 / 0900 123 4567'],
    ['telemarketing()', '0303', '0303 123 4567'],
];

const identifierRows = [
    [
        'ipv4()',
        'Four decimal octets, each 0 to 255. Only zero itself may start with 0.',
        '192.0.2.1',
    ],
    [
        'ipv6()',
        'Eight hexadecimal groups, optional :: compression, optional dotted IPv4 tail.',
        '::ffff:192.0.2.1',
    ],
    ['ip()', 'Either address family.', '2001:db8::1'],
    ['hexColor()', '3, 4, 6, or 8 hexadecimal digits. Letters appear in uppercase.', '#A3C'],
    [
        'uuid()',
        '32 hexadecimal digits in five groups. Letters appear in lowercase.',
        '550e8400-e29b-41d4-a716-446655440000',
    ],
    [
        'macAddress()',
        'Six pairs of hexadecimal digits. Letters appear in uppercase.',
        'AA:BB:CC:DD:EE:FF',
    ],
];
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection>
            <DocsCallout variant="caution">
                <template #title>Development preview</template>
                <p>Run these examples with a Front Awesome checkout that exports MaskedInput.</p>
            </DocsCallout>
            <p>
                Use MaskedInput when users enter text with a known structure, such as a postal code
                or document number. The field formats the text as the user types and accepts
                selections, pasted text, and keyboard edits in one text box.
            </p>
            <p>
                Start with a Laravel application configured for Inertia, Vue, and Web Awesome.
                Follow the
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                    >Front Awesome installation guide</DocsLink
                >
                to set up Composer and Vite before adding the component to a Vue page.
            </p>
            <h2 id="format-a-postal-code">Format a postal code</h2>
            <CodeExample label="Brazilian postal code" language="vue" :code="postalCodeExample" />
            <p>
                Type or paste <code>01310100</code>. The field displays <code>01310-100</code>. The
                Vue model and a native form submit <code>01310100</code> as a string so the leading
                zero stays intact.
            </p>
            <h2 id="use-a-mask-template">Use a mask template</h2>
            <p>
                Use a Front Awesome preview that exports <code>useMaskTemplate</code>. Import it
                from the package root and pass a template to <code>:mask</code>.
                <code>useMaskTemplates</code> is an alias for the same function.
            </p>
            <CodeExample label="Format a CPF" language="vue" :code="cpfExample" />
            <p>
                Enter <code>01234567890</code>. The CPF field displays
                <code>012.345.678-90</code> and submits the string <code>01234567890</code>. Try the
                form with that CPF and <code>2001:db8::1</code>. The IP address keeps its colons in
                the submitted value.
            </p>
            <DemoFrame
                title="Submit a CPF and an IP address"
                :sources="[{ label: 'Vue example', language: 'vue', code: templateDemoSource }]">
                <MaskTemplatesDemo />
            </DemoFrame>
            <h3 id="use-mask-templates-through-the-vue-plugin">
                Use mask templates through the Vue plugin
            </h3>
            <p>
                After you
                <DocsLink href="/docs/front-awesome/vue-plugin"
                    >register the Front Awesome plugin</DocsLink
                >, use <code>$maskTemplates</code> in Vue templates and
                <code>this.$maskTemplates</code> in Options API methods and computed properties.
                Both expose the same catalog as <code>useMaskTemplate()</code>.
            </p>
            <CodeExample
                label="Use the Vue mask catalog"
                language="vue"
                :code="globalMaskExample" />
            <p>
                Enter <code>01234567890</code> and <code>01310100</code>. The fields show
                <code>012.345.678-90</code> and <code>01310-100</code>. The two models keep the
                original digit strings.
            </p>
            <h3 id="choose-a-brazilian-document-template">
                Choose a Brazilian document or postal code
            </h3>
            <p>
                Use <code>useMaskTemplate().Brazilian</code> for these formats.
                <code>cpf()</code> accepts 11 digits. <code>cnpj()</code> accepts ASCII letters and
                digits in the first 12 positions, converts letters to uppercase, and requires two
                final digits. For a legacy field that accepts only digits, use
                <code>cnpjLegacy()</code>. Both CNPJ templates display punctuation as in
                <code>12.345.678/0001-90</code>. Validate check digits and registration separately.
                <DocsLink
                    href="https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/cnpj-alfanumerico"
                    >Receita Federal CNPJ guidance</DocsLink
                >.
            </p>
            <p>
                <code>cep()</code> formats eight digits as <code>01310-100</code> and preserves the
                leading zero in the raw model. Use an address lookup to confirm the CEP exists.
                <DocsLink href="https://www.correios.com.br/enviar/precisa-de-ajuda/tudo-sobre-cep"
                    >Correios postal code guide</DocsLink
                >.
            </p>
            <h3 id="choose-a-brazilian-phone-template">Choose a Brazilian phone format</h3>
            <p>
                Use <code>useMaskTemplate().Brazilian.phone()</code> when one field accepts several
                domestic formats. A three-digit short code can also be the start of a longer number.
                If the form requires a particular kind of number, choose its template below so a
                shorter match cannot satisfy that requirement. These templates check the structure.
                Confirm allocation or reachability separately if your application needs it.
                <DocsLink
                    href="https://informacoes.anatel.gov.br/legislacao/resolucoes/2022/1641-resolucao-749"
                    >Anatel numbering rules</DocsLink
                >.
            </p>
            <DocsTable
                caption="Brazilian phone templates"
                :columns="['Brazilian method', 'Use for', 'Example display']"
                :rows="phoneRows" />
            <p>
                Landline numbers start with 2 through 6. Mobile numbers start with 7 through 9. The
                two DDD digits each range from 1 to 9. For
                <code>internationalPhone()</code>, include <code>55</code> in the model. The raw
                string <code>5511987654321</code> displays as <code>+55 (11) 98765-4321</code>.
            </p>
            <h3 id="choose-an-address-or-identifier">Choose an address or identifier</h3>
            <p>
                Call these methods directly on <code>useMaskTemplate()</code>. For IP addresses,
                type the dots and colons. Both value modes preserve them, so compressed IPv6
                addresses survive a form submission. Use a bare address without brackets, a port, a
                zone identifier, or a CIDR prefix length. A value such as
                <code>192.0.2.999</code> stays editable and reports <code>complete: false</code>.
            </p>
            <DocsTable
                caption="IP address and hexadecimal templates"
                :columns="['Method', 'Complete input', 'Example display']"
                :rows="identifierRows" />
            <p>
                The color, UUID, and MAC templates store the formatted string by default. Set
                <code>value-mode="raw"</code> to store only the hexadecimal digits. For example,
                <code>#A3C</code> becomes <code>A3C</code> in the model. UUID completion checks the
                grouping and hexadecimal characters.
            </p>
            <h3 id="set-template-defaults">Set template defaults</h3>
            <p>
                To share an application-specific format, pass a <code>MaskTemplate</code> object
                with a <code>mask</code> property. It accepts the same string, parts, array, or
                function you would pass directly to the field. Set <code>tokens</code>,
                <code>guide</code>, <code>guideChar</code>, <code>overwrite</code>,
                <code>prefix</code>, <code>suffix</code>, <code>inputMode</code>, or
                <code>valueMode</code> on the object to supply defaults. Explicit component props
                take precedence. The optional <code>isComplete(raw, formatted)</code> takes two
                strings and returns a boolean. The field calls it after the required mask positions
                are filled. A class instance can also implement <code>MaskTemplate</code> and be
                passed directly to <code>:mask</code>.
            </p>
            <p>
                In this Vue example, two letters identify an aisle and two digits identify a shelf.
                The same object works in JavaScript when you omit the type import and annotation.
            </p>
            <CodeExample label="Define a reusable shelf code" language="vue" :code="shelfExample" />
            <p>
                Enter <code>ab07</code>. The field displays <code>AB-07</code>. Its
                <code>value-mode="raw"</code> overrides the template default, so the model and
                native form hold <code>AB07</code>. Change the number to <code>00</code> and select
                <strong>Check shelf</strong>. The completion rule returns false and
                <code>incomplete-message</code> makes the browser block submission.
                <code>required</code> handles an empty field separately.
            </p>
            <h2 id="load-a-saved-value">Load a saved value</h2>
            <p>
                Keep the postal code as a string. Set
                <code>postalCode.value = '01310100'</code> during setup or after loading a record.
                The field displays <code>01310-100</code>, and the model and native form use
                <code>01310100</code>. Try <strong>Load saved postal code</strong> in the demo.
            </p>
            <p>
                In formatted mode, provide the value with punctuation. For example,
                <code>01.23</code> selects the dotted pattern from <code>['##-##', '##.##']</code>.
                Set the model to an empty string, <code>null</code>, or <code>undefined</code> to
                clear the field. Assigning a model value updates the display without firing
                <code>mask-change</code> or writing a value back to the model.
            </p>
            <h2 id="bind-an-inertia-form">Bind an Inertia form</h2>
            <p>
                Create an Inertia form with <code>useForm({ taxId: '' })</code>. Bind it with
                <code>:form="identificationForm"</code> and <code>field="taxId"</code>, as shown in
                the document example. For nested data, pass a path such as
                <code>field="contact.taxId"</code>.
            </p>
            <p>
                Raw mode stores characters from editable positions as a string. It preserves leading
                zeros and CNPJ letters. For phone numbers, place the country-code digits in editable
                positions when the application needs them in the stored value. Use
                <code>value-mode="formatted"</code> to keep punctuation and fixed affixes in the
                stored value.
            </p>
            <p>
                Initialize raw-mode fields with raw strings. If a record contains formatted data,
                convert it when you prepare the form or use formatted mode. Assignments to the form
                stay under the application's control, so loading a record keeps its saved values
                until the user edits the field.
            </p>
            <h2 id="describe-the-editable-positions">Describe the editable positions</h2>
            <p>
                Use <code>#</code> for an ASCII digit, <code>A</code> for a Unicode letter, or
                <code>*</code> for a Unicode letter or number. Other characters are literal. Use a
                backslash to escape a reserved character and square brackets to make a group
                optional. For example, <code>##[-##]</code> accepts two digits with an optional
                hyphen and two more digits.
            </p>
            <p>
                Add named tokens with <code>tokens</code>, or pass an object with a
                <code>parts</code> array for rules defined directly at each position. A string in
                the array is literal. A regular expression accepts one Unicode code point. An
                <code>accept</code> object can also transform the character before matching. Return
                one code point and keep the result stable if the transform runs again. Wrap parts in
                an <code>optional</code> object to make a group optional.
            </p>
            <h2 id="select-a-format-while-editing">Select a format while editing</h2>
            <p>
                Pass an ordered array of masks to select the pattern that accepts the most proposed
                input. Matching punctuation breaks a tie, followed by the order of the array. The
                document example below switches between CPF and CNPJ, including CNPJ with letters in
                its first 12 positions and numeric check digits in its last two.
                <DocsLink
                    href="https://normas.receita.fazenda.gov.br/sijut2consulta/anexoOutros.action?idArquivoBinario=76195"
                    >Receita Federal format specification</DocsLink
                >
            </p>
            <p>
                The document example defines <code>X</code> as a named token. Its transform converts
                letters to uppercase before checking each position.
            </p>
            <p>
                Pass a function when the application owns format selection. The function receives
                the proposed text and the current raw value, formatted value, and selection in
                UTF-16 offsets. Return a mask or an ordered array from a synchronous function. The
                phone example chooses the longer format when the proposed number reaches 11 digits.
            </p>
            <h2 id="configure-editing-and-submission">Configure editing and submission</h2>
            <ul>
                <li>
                    Set <code>guide="focus"</code> or <code>guide="always"</code> to show empty
                    positions. The default is <code>never</code>. Set <code>guide-char</code> to
                    customize the default underscore. Optional groups appear after the user enters a
                    character in the group.
                </li>
                <li>
                    Enable <code>overwrite</code> to replace a character when typing over it. The
                    default inserts at the caret.
                </li>
                <li>
                    Set <code>prefix</code> and <code>suffix</code> for fixed text. Raw values
                    contain only the characters entered into editable positions. Formatted values
                    include visible literals and affixes. Neither value includes guide characters.
                </li>
                <li>
                    Set <code>value-mode="formatted"</code> when the model or form needs the
                    punctuation. The default is <code>raw</code>. Use <code>:form</code> and
                    <code>field</code> in place of <code>v-model</code> for an Inertia form.
                </li>
                <li>
                    Set <code>default-value</code> to initialize an unbound control or specify a
                    native form reset value. A bound control displays its model at startup. Without
                    an explicit reset value, a native form reset restores the initial bound value.
                    The <code>mask-change</code> event reports <code>raw</code>,
                    <code>formatted</code>, and <code>complete</code> after a user edit.
                </li>
                <li>
                    Use <code>required</code> for a mandatory value. Set
                    <code>incomplete-message</code> to block native submission when the user enters
                    a value with unfilled required positions or a template's completion rule returns
                    false. Supply the message in the user's language. Enable
                    <code>clear-incomplete-on-blur</code> to clear a partial entry when the user
                    leaves the field. The default keeps partial entries. An optional group can stay
                    empty.
                </li>
                <li>
                    Give the field a visible label and a text hint with the expected format. Set
                    <code>inputmode</code> for the characters the user can enter. Use a text
                    keyboard for a field that accepts letters.
                </li>
            </ul>
            <p>
                Apply application validation when you submit. For example, check the CPF or CNPJ
                check digits on the server.
            </p>
            <h2 id="try-the-masks">Try the masks</h2>
            <DemoFrame
                title="Masked text fields"
                :sources="[{ label: 'Vue example', language: 'vue', code: demoSource }]">
                <MaskedInputDemo />
            </DemoFrame>
        </ProseSection>
    </article>
</template>
