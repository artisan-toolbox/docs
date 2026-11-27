<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const validationExample = `use ArtisanToolbox\\Core\\Brasilian\\DocumentType;
use ArtisanToolbox\\Core\\Brasilian\\PhoneType;
use ArtisanToolbox\\Core\\Brasilian\\Rules\\DocumentRule;
use ArtisanToolbox\\Core\\Brasilian\\Rules\\PhoneRule;
use Illuminate\\Support\\Facades\\Validator;

$input = [
    'tax_id' => '12.ABC.345/01DE-35',
    'contact' => '(11) 98765-4321',
];

$validated = Validator::make($input, [
    'tax_id' => ['required', new DocumentRule(DocumentType::Cnpj)],
    'contact' => ['required', new PhoneRule(PhoneType::RegionalMobile, PhoneType::RegionalLandline)],
])->validate();

dump($validated);`;

const formattingExample = `use ArtisanToolbox\\Core\\Brasilian\\Document;
use ArtisanToolbox\\Core\\Brasilian\\DocumentType;
use ArtisanToolbox\\Core\\Brasilian\\Phone;
use ArtisanToolbox\\Core\\Brasilian\\PhoneType;

$document = Document::from('12abc34501de35', DocumentType::Cnpj);
$phone = Phone::from('+5511987654321', PhoneType::InternationalPhone);

dump($document->unmask(), $document->mask());
// '12ABC34501DE35', '12.ABC.345/01DE-35'

dump($phone->unmask(), $phone->mask());
// '5511987654321', '+55 (11) 98765-4321'`;

const fakeExample = `use ArtisanToolbox\\Core\\Brasilian\\Document;
use ArtisanToolbox\\Core\\Brasilian\\DocumentType;
use ArtisanToolbox\\Core\\Brasilian\\Phone;
use ArtisanToolbox\\Core\\Brasilian\\PhoneType;

$taxId = Document::fake(DocumentType::Cnpj)->unmask();
$phone = Phone::fake(PhoneType::RegionalMobile)->mask();

dump(Document::isValid($taxId, DocumentType::Cnpj)); // true
dump(Phone::isValid($phone, PhoneType::RegionalMobile)); // true`;

const phoneTypes = [
    ['Landline / Mobile', '3456-7890 / 98765-4321'],
    ['RegionalLandline / RegionalMobile', '(11) 3456-7890 / (11) 98765-4321'],
    ['InternationalPhone', '+55 (11) 3456-7890 / +55 (11) 98765-4321'],
    ['ShortCode3 / ShortCode4 / ShortCode5', '190 / 1052 / 10315'],
    ['ServiceCenter', '3003-0100 / 4004-0200'],
    ['SharedCost / Telemarketing / Donation', '0300 123 4567 / 0303 123 4567 / 0500 123 4567'],
    ['TollFree / Premium', '0800 123 4567 / 0900 123 4567'],
];
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />

        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection>
                <p>
                    Start with a Laravel application running Core <code>1.5.0</code> or later.
                    Follow the
                    <DocsLink :href="findNavigationItem(navigation, 'core/installation').href"
                        >Core installation guide</DocsLink
                    >. Run the PHP examples in a Laravel route or command. They require no database
                    or frontend setup.
                </p>
            </ProseSection>

            <ProseSection id="validate-form-input" title="Validate form input">
                <p>
                    Pass one enum case to require a specific type, several to accept any of those
                    types, or omit the cases to accept every type. Use the same rule objects in a
                    form request. Laravel's <code>required</code> and <code>nullable</code> rules
                    control whether the field may be empty.
                </p>
                <CodeExample
                    label="Validate a CNPJ and a phone with DDD"
                    language="php"
                    :code="validationExample" />
                <p>
                    The dump contains both input strings as submitted. Change the CNPJ's final
                    digits to <code>36</code> or replace the phone with <code>190</code>. Validation
                    reports an error for the changed field.
                </p>
                <p>
                    <code>DocumentType::Cpf</code> accepts CPF. <code>DocumentType::Cnpj</code>
                    accepts numeric and alphanumeric CNPJ. Both cases verify the check digits. CNPJ
                    letters can appear in the first 12 positions. The final two positions are
                    digits. The rules accept strings, preserving leading zeros in the input.
                </p>
                <p>
                    To customize the rule messages, set
                    <code>document</code> or <code>phone</code> in
                    <code>lang/vendor/core/&lt;locale&gt;/validation.php</code>. Include
                    <code>:attribute</code> where the field name should appear.
                </p>
                <p>
                    See the
                    <DocsLink
                        href="https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf/view"
                        >Receita Federal manual for CNPJ check digits</DocsLink
                    >
                    for the calculation.
                </p>
            </ProseSection>

            <ProseSection id="store-and-display-values" title="Store and display values">
                <p>
                    Parse the validated string with <code>Document::from()</code> or
                    <code>Phone::from()</code>. Pass the same type cases as in the validation rule.
                    Either class accepts raw strings and strings in its display mask. International
                    phones also accept compact <code>+55</code> numbers.
                </p>
                <CodeExample
                    label="Store raw values and display masks"
                    language="php"
                    :code="formattingExample" />
                <p>
                    Store the result of <code>unmask()</code> as a string. It keeps leading zeros,
                    uppercase CNPJ letters, and the international country code. Use
                    <code>mask()</code> for display and the <code>type</code> property to inspect
                    the selected enum case. Omit the type arguments to detect the type from the
                    input.
                </p>
                <p>
                    For invalid input, <code>from()</code> throws
                    <code>InvalidArgumentException</code>, <code>tryFrom()</code> returns
                    <code>null</code>, and <code>isValid()</code> returns <code>false</code>.
                </p>
            </ProseSection>

            <ProseSection id="choose-phone-types" title="Choose phone types">
                <DocsTable
                    caption="Supported Brazilian phone formats"
                    :columns="['PhoneType cases', 'Example display']"
                    :rows="phoneTypes" />
                <p>
                    Local and regional landlines start with 2 through 6 after any DDD. Mobile
                    numbers start with 7 through 9. Each DDD digit ranges from 1 to 9. A five-digit
                    short code starts with 103 or 106.
                </p>
                <p>
                    Combine enum cases for grouped formats. For example, use both regional cases for
                    a field that requires a DDD. When a value fits several cases,
                    <code>Phone::from()</code> uses the first case you pass. By default it
                    recognizes a service center before a local landline.
                </p>
                <p>
                    If the form uses Front Awesome, pair the rule with the
                    <DocsLink
                        :href="
                            findNavigationItem(
                                navigation,
                                'front-awesome/web-awesome/components/forms/masked-input',
                            ).href + '#choose-a-brazilian-phone-template'
                        "
                        >corresponding Brazilian phone mask</DocsLink
                    >.
                </p>
            </ProseSection>

            <ProseSection id="generate-test-values" title="Generate test values">
                <p>
                    Call <code>fake($type)</code> in tests and factories. It returns a value object
                    of the requested type. Generated CNPJ examples contain letters.
                </p>
                <CodeExample label="Generate test values" language="php" :code="fakeExample" />
                <p>
                    Both checks return <code>true</code>. The APIs check format and document check
                    digits. Confirm document registration, phone allocation, or reachability
                    separately when your application requires it.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
