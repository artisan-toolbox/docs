<script setup>
import ComparisonDemo from '@/components/demo/dapter/comparisons/ComparisonDemo.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import localeDeclaration from '../../../../../app/DataSources/Dapter/ComparisonsLocaleFluent.php?raw';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Prepare a Collection source">
                <p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    in your Laravel, Inertia, Vue, and Vite application. These APIs are an
                    unpublished preview. Use protocol 2 for declared operations. The fixed examples
                    require no account, database, broadcaster, or worker. Locale ordering
                    additionally requires PHP intl with the requested ICU locale available.
                </p>
                <p>
                    The frames use the public Dapter endpoint and Front Awesome Button, Spinner, and
                    Tag exports. Follow
                    <DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                        >Front Awesome installation</DocsLink
                    >
                    before copying their presentation. Dapter remains independent of that
                    presentation package.
                </p>
            </ProseSection>
            <ProseSection id="declare-locale" title="Declare an explicit locale">
                <p>
                    Create this source file in your application. Copy Records.php from the source
                    disclosure into app/Demo/Dapter/Comparisons to match its namespace, or replace
                    the import with your own fixed Collection source.
                </p>
                <CodeExample
                    label="app/DataSources/Dapter/ComparisonsLocaleFluent.php"
                    language="php"
                    :code="localeDeclaration" />
                <p>
                    Declare ValueType::String and SortType::Locale, then pass FieldOptions with
                    LocaleOptions('pt-BR'). Keep another mode such as String when the source must
                    remain readable without intl. The server publishes the canonical locale, valid
                    locale, actual locale, and ICU version after admission. A valid ICU parent
                    fallback is allowed. For pt_BR, validLocale may be pt and actualLocale may be
                    root.
                </p>
                <p>
                    The comparison uses tertiary strength, Unicode normalization, and disabled
                    numeric text collation. These settings are fixed. Requests select a declared
                    sort type, never a locale or Collator setting. Invalid locales, invented
                    regions, keywords, misplaced settings, and missing required settings fail
                    configuration.
                </p>
            </ProseSection>
            <ProseSection id="expected-order" title="Check accents, nulls, and stable ties">
                <p>
                    The six rows are composed café, decomposed cafe followed by U+0301, cafe, null,
                    item 2, and item 10. Portuguese ascending order returns IDs 4, 3, 1, 2, 6, 5.
                    Normalization makes IDs 1 and 2 equal, so their original order survives. Numeric
                    text collation stays disabled, so item 10 precedes item 2. Descending order
                    returns 5, 6, 1, 2, 3, 4. Null comes first ascending and last descending.
                </p>
                <p>
                    Select Start to send the displayed request. Opening a guide performs no read.
                    Inspect the actual rows, total and filtered counts, and
                    capabilities.fields.name.order.locale. Reset cancels pending work and clears the
                    response. The next frames verify equivalent attributes and captured
                    dapter.declarations configuration. The temporary configuration is restored after
                    capture.
                </p>
            </ProseSection>
            <ComparisonDemo scenario="LocaleFluent" />
            <ComparisonDemo scenario="LocaleAttribute" />
            <ComparisonDemo scenario="LocaleConfig" />
            <ProseSection id="literal-comparisons" title="Keep search and other sorts independent">
                <p>
                    Native and Regular use PHP scalar comparison. String uses strcmp. Natural uses
                    strnatcmp. Numeric accepts numeric scalar domains and uses numeric comparison.
                    On this fixture, Native, Regular, and String return 4, 3, 2, 1, 6, 5. Natural
                    returns 4, 3, 2, 1, 5, 6. Numeric score ordering returns 4, 3, 2, 5, 1, 6, with
                    stable ties.
                </p>
                <p>
                    This source explicitly calls strictLiteralSearch(), so literal search is
                    case-sensitive, accent-sensitive, and composition-sensitive. The composed café
                    input below returns ID 1 only. The default source policy ignores case and
                    accents. Locale order never changes that result. Locale is available for offset
                    and simple Collection paging. Cursor ordering retains Native comparisons,
                    including lexical strcmp for strings. Invalid UTF-8 and failed Collator
                    operations fail the read rather than produce equal ties.
                </p>
            </ProseSection>
            <ComparisonDemo scenario="LiteralComparison" />
            <ProseSection id="next-guide" title="Check the source contract">
                <p>
                    Use
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/comparison-capabilities').href
                        "
                        >source comparison capabilities</DocsLink
                    >
                    to check unavailable combinations. SQL ordering keeps its database-native
                    collation and null policy.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
