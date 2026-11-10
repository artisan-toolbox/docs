<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import LocalizationDemo from '@/components/demo/front-awesome/localization/LocalizationDemo.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const html = `<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">`;
const translations = `<?php
// lang/en/app.php
return [
    'welcome' => 'Welcome, :name!',
    'documents' => '{0} No documents|{1} One document|[2,*] :count documents',
];`;
const configuration = `// config/front-awesome.php
return [
    'translations' => [
        'include_application' => true,
        'locales' => ['*'],
    ],
];`;
const selectedLocales = `'translations' => [
    'include_application' => true,
    'locales' => ['en', 'es'],
],`;
const vite = `import { frontAwesome } from '@artisan-toolbox/front-awesome/vite';

frontAwesome({ webAwesome: 'core', translations: true });`;
const install = `import { createFrontAwesome } from '@artisan-toolbox/front-awesome';
import { createLocalization } from '@artisan-toolbox/front-awesome/localization';
import catalog from './generated/front-awesome-translations.json';

const localization = createLocalization(catalog, {
    numberFormats: {
        en: { money: { style: 'currency', currency: 'USD' } },
        es: { money: { style: 'currency', currency: 'EUR' } },
        'pt-BR': { money: { style: 'currency', currency: 'BRL' } },
    },
    datetimeFormats: {
        en: { short: { dateStyle: 'short', timeZone: 'UTC' } },
        es: { short: { dateStyle: 'short', timeZone: 'UTC' } },
        'pt-BR': { short: { dateStyle: 'short', timeZone: 'UTC' } },
    },
});

// In the existing createInertiaApp options:
withApp(app) {
    app.use(createFrontAwesome({ localization }));
}`;
const usage = `<script setup>
import { Language } from '@artisan-toolbox/front-awesome/components';
import { useLocalization } from '@artisan-toolbox/front-awesome/localization';
const { t, n, d } = useLocalization();
const exampleDate = new Date('2026-11-10T12:00:00Z');
\x3C/script>

<template>
    <Language v-slot="{ locale, locales, setLocale }">
        <button v-for="choice in locales" :key="choice.locale" type="button"
            :aria-pressed="locale === choice.locale" @click="setLocale(choice.locale)">
            {{ choice.label }}
        </button>
    </Language>
    <p>{{ t('app.welcome', { name: 'Ana' }) }}</p>
    <p>{{ t('app.documents', { count: 2 }) }}</p>
    <p>{{ n(1234.5, 'money') }}</p>
    <time>{{ d(exampleDate, 'short') }}</time>
</template>`;
const prepare = `php artisan front-awesome:export-translations
npx vue-tsc --noEmit`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection id="prerequisites" title="Start with the installed source preview">
            <p>
                This how-to starts in a Laravel 13, Inertia 3, and Vue 3.5 application after
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                    >installation</DocsLink
                >
                and
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/vue-plugin').href"
                    >Vue plugin registration</DocsLink
                >. Run commands in the application root. Composer installation comes before npm
                installation.
            </p>
            <p>
                Localization is an optional, unreleased source-preview API. Confirm that your
                Composer-installed frontend exports <code>./localization</code> and
                <code>Language</code>, and that Artisan lists
                <code>front-awesome:export-translations</code>. The published preview does not
                guarantee these additions. Vue I18n is delivered by this frontend package.
            </p>
            <p>
                Direct Artisan exports also require Node.js 24.11 or later and subprocess execution
                on the asset host. Vite passes its own Node executable. For a standalone command,
                configure translations.node_binary or pass --node when Node is outside PATH. This
                build-time validation rejects colliding browser locale aliases before changing the
                catalog or its TypeScript declaration. HTTP preference resolution remains PHP-only.
            </p>
        </ProseSection>
        <ProseSection id="set-the-html-language" title="Set the HTML language">
            <p>
                In your root Blade document, render Laravel's request locale as a browser language
                tag.
            </p>
            <CodeExample
                label="Render the request language in Blade"
                language="blade"
                :code="html" />
            <p>
                The <code>lang</code> attribute is the only active-locale source. Laravel's
                <code>pt_BR</code> becomes <code>pt-BR</code>. Keep middleware or your existing
                server action responsible for future request locales.
            </p>
        </ProseSection>
        <ProseSection id="select-public-messages" title="Enable application Laravel messages">
            <p>
                Create <code>lang/en/app.php</code> with these two messages. Add equivalent
                <code>app.php</code> files under <code>lang/es</code> and
                <code>lang/pt_BR</code> for translated greetings and counts.
            </p>
            <CodeExample label="Define Laravel messages" language="php" :code="translations" />
            <p>
                Publish configuration with
                <code>php artisan vendor:publish --tag=front-awesome-config</code>. Merge this
                global switch into the published file. With the default wildcard locale selection,
                it includes all eligible application languages. All exported messages enter the
                browser bundle. Optional file and key filters can narrow the export.
            </p>
            <CodeExample
                label="Enable the application language directory"
                language="php"
                :code="configuration" />
            <p>
                Front Awesome's own English, Spanish, and Brazilian Portuguese messages are always
                included. You need no application export settings when you only want package UI
                translation. The default <code>locales: ['*']</code> discovers eligible languages.
            </p>
            <p>
                To offer only English and Spanish, replace the wildcard with this ordered allowlist.
            </p>
            <CodeExample
                label="Limit selectable languages"
                language="php"
                :code="selectedLocales" />
            <p>
                The selector shows English, then Spanish, without Brazilian Portuguese. Internal
                package catalogs still include <code>en</code>, <code>es</code>, and
                <code>pt_BR</code>. Application messages are exported only for selected languages
                and the configured <code>APP_FALLBACK_LOCALE</code>, which defaults to English. The
                fallback can remain outside the selector.
            </p>
        </ProseSection>
        <ProseSection id="enable-export" title="Enable export in Vite">
            <p>
                Add <code>translations: true</code> to your existing Front Awesome Vite plugin call.
                Match <code>webAwesome</code> to the Core or licensed Pro edition your application
                uses.
            </p>
            <CodeExample
                label="Export before frontend import scanning"
                language="javascript"
                :code="vite" />
            <p>
                Normal Vite startup and production builds generate
                <code>resources/js/generated/front-awesome-translations.json</code> and a sibling
                <code>.d.ts</code> file. Add
                <code>/resources/js/generated/front-awesome-translations.*</code> to your
                application's <code>.gitignore</code>.
            </p>
            <p>
                If the PHP executable or application directory differs, pass
                <code
                    >translations: { php: '/absolute/path/to/php', artisan: 'artisan', cwd:
                    '/absolute/path/to/application' }</code
                >.
            </p>
        </ProseSection>
        <ProseSection id="install-localization" title="Install localization with the Vue plugin">
            <p>
                In your frontend entry, create localization from the generated JSON and pass it to
                your existing <code>createFrontAwesome()</code> call. Preserve your other options.
            </p>
            <CodeExample
                label="Install translations and Vue I18n formats"
                language="javascript"
                :code="install" />
            <p>
                Use canonical browser tags in format definitions, including <code>pt-BR</code>. Vue
                I18n owns number and date formatting. Omit separate <code>locale</code>,
                <code>messages</code>, and <code>legacy</code> options.
            </p>
        </ProseSection>
        <ProseSection id="translate-and-switch" title="Translate and switch language">
            <p>
                Use the public composable inside Vue setup. <code>Language</code> adds no element or
                styling. Its slot lets you build accessible language controls.
            </p>
            <CodeExample
                label="Render the first translated greeting"
                language="vue"
                :code="usage" />
            <p>
                With <code>html.lang</code> set to <code>en</code>, the paragraphs read
                <code>Welcome, Ana!</code> and <code>2 documents</code>. Selecting another language
                updates the HTML attribute, translated strings, and formats. Missing application
                messages use the configured fallback.
            </p>
            <p>
                With localization installed alone, language changes update the browser. To save a
                choice in Laravel, follow
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'front-awesome/preferences/language').href
                    "
                    >Language preferences</DocsLink
                >
                in the Preferences group. It connects this same selector to validated Inertia
                requests, the session or authenticated user store, and future request locales. The
                live demonstration below uses that integration.
            </p>
        </ProseSection>
        <LocalizationDemo />
        <ProseSection id="prepare-clean-ci" title="Prepare a clean type-check job">
            <p>
                Before standalone <code>vue-tsc</code> on a clean checkout, generate the catalog and
                its key declaration. Normal Vite dev and build commands already perform this step.
            </p>
            <CodeExample
                label="Generate before standalone type checking"
                language="sh"
                :code="prepare" />
            <p>
                After Composer updates a file-based frontend package, refresh its npm copy and
                restart Vite. Translation file edits during Vite development regenerate the catalog
                and reload the page. A failed export retains the last valid file and reports the
                error. Production export errors fail the build.
            </p>
            <p>
                Continue with the
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'front-awesome/localization/reference').href
                    "
                    >localization reference</DocsLink
                >
                for filters, placeholders, format schemas, native component coverage, and printing
                behavior.
            </p>
        </ProseSection>
    </article>
</template>
