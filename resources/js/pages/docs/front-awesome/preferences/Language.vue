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
import { Language } from '@artisan-toolbox/front-awesome/components';
\x3C/script>

<template>
    <Language v-slot="{ locale, locales, setLocale, pending, error }">
        <label for="preferred-language">Language</label>
        <select id="preferred-language" :value="locale" :disabled="pending"
            :aria-busy="pending" @change="setLocale($event.target.value)">
            <option v-for="choice in locales" :key="choice.locale" :value="choice.locale">
                {{ choice.label }}
            </option>
        </select>
        <p v-if="error" role="alert">{{ error }}</p>
    </Language>
</template>`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection id="prerequisites" title="Start with translations and preferences">
            <p>
                Complete the
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/preferences').href"
                    >preferences setup</DocsLink
                >
                and its localization prerequisites in your Laravel, Inertia, and Vue application.
                Install preferences before localization and generate the configured translation
                catalog. The persisted selector is an unreleased source-preview API; verify the
                <code>Language</code> export in your Composer-installed package.
            </p>
        </ProseSection>
        <ProseSection id="render-the-selector" title="Offer configured languages">
            <p>
                Add this component to a Vue page in your application. The renderless selector
                supplies the current <code>locale</code>, ordered <code>locales</code>, and
                <code>setLocale()</code>. Each choice contains its canonical browser tag in
                <code>locale</code> and its display <code>label</code>.
            </p>
            <CodeExample label="Save a language choice" language="vue" :code="selector" />
            <p>
                With English and Brazilian Portuguese configured, choose Brazilian Portuguese. After
                the Inertia request succeeds, <code>locale</code> is <code>pt-BR</code>,
                <code>html.lang</code> is <code>pt-BR</code>, and the Laravel request uses its
                corresponding source locale, <code>pt_BR</code>. Refresh the page to confirm that
                the active store retains the choice.
            </p>
        </ProseSection>
        <ProseSection id="keep-one-locale-owner" title="Let the server confirm the language">
            <p>
                Use the choices supplied by <code>locales</code>. Their order comes from the
                configured translation selection. Do not build another list from file names or pass
                Laravel's underscore identifiers to browser formatting APIs.
            </p>
            <p>
                With preferences installed, <code>setLocale()</code> sends one Inertia PATCH and
                returns to the current page while preserving state and scroll. The confirmed
                language updates <code>html.lang</code>, translated server props, localization, and
                internal package messages. Navigation and history synchronization apply received
                values without issuing another preference write.
            </p>
            <p>
                Keep the shared document language owner. Do not assign a second Vue I18n locale or
                change <code>html.lang</code> independently. Without the preferences service, the
                standalone localization selector changes browser language only; it does not persist
                the Laravel preference.
            </p>
        </ProseSection>
        <ProseSection id="show-save-feedback" title="Show save feedback and translated text">
            <p>
                Disable the select while <code>pending</code> is true and show its
                <code>error</code> when validation or transport fails. Keep the last confirmed
                language visible and allow a retry. Translation messages, placeholders, plural
                rules, and named number or date formats belong in the
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/localization').href"
                    >localization guide</DocsLink
                >.
            </p>
            <p>
                Try a saved language change in the
                <DocsLink
                    :href="`${findNavigationItem(navigation, 'front-awesome/preferences').href}#install-browser-service`"
                    >shared preferences demo</DocsLink
                >. Use the
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'front-awesome/preferences/reference').href
                    "
                    >preferences reference</DocsLink
                >
                for defaults and unsupported values.
            </p>
        </ProseSection>
    </article>
</template>
