<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const selector = `<script setup>
import { Currency } from '@artisan-toolbox/front-awesome/components';
import { useI18n } from 'vue-i18n';

const { n } = useI18n({ useScope: 'global' });
\x3C/script>

<template>
    <Currency v-slot="{ currency, currencies, setCurrency, pending, error }">
        <label for="preferred-currency">Currency</label>
        <select id="preferred-currency" :value="currency ?? ''" :disabled="pending"
            @change="setCurrency($event.target.value || null)">
            <option value="">No currency</option>
            <option v-for="code in currencies" :key="code" :value="code">{{ code }}</option>
        </select>
        <p v-if="error" role="alert">{{ error }}</p>
    </Currency>
    <p>{{ n(1234.5, 'currency') }}</p>
</template>`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection id="prerequisites" title="Start with persisted preferences">
            <p>
                Complete the
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/preferences').href"
                    >preferences setup</DocsLink
                >
                and install localization after preferences. This how-to uses the unreleased source
                preview's <code>Currency</code> component and the global Vue I18n composer.
            </p>
        </ProseSection>
        <ProseSection id="select-and-format-currency" title="Select and format currency">
            <CodeExample
                label="Save an optional currency and format a number"
                language="vue"
                :code="selector" />
            <p>
                The default is <code>null</code>. Selecting a code saves it through the same
                validated Inertia endpoint as the other preferences. Selecting No currency sends a
                literal JSON null. The server accepts current ISO 4217 codes from its bundled SIX
                List One snapshot and returns those codes as <code>currencies</code> in the shared
                preferences.
            </p>
            <p>
                The bundled snapshot was published on September 17, 2026. Its codes come from the
                <a
                    href="https://www.six-group.com/en/products-services/financial-information/market-reference-data/data-standards.html"
                    >SIX ISO 4217 maintenance agency</a
                >. Validation uses bundled data without runtime network requests or an Intl PHP
                extension dependency.
            </p>
            <p>
                The native named format <code>currency</code> follows the saved code and active
                locale. With <code>null</code>, it formats a decimal without a currency symbol. An
                explicit currency in an application-defined named format takes precedence. Unkeyed
                <code>n(value)</code> retains native Vue I18n behavior.
            </p>
            <p>
                This preference controls presentation. It does not convert amounts, perform
                exchange-rate calculations, or change values in your database.
            </p>
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/preferences').href +
                    '#preferences-demo'
                "
                >Try the shared preferences demonstration</DocsLink
            >
        </ProseSection>
    </article>
</template>
