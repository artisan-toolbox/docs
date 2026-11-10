<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PreferencesDemo from '@/components/demo/front-awesome/preferences/PreferencesDemo.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const middleware = `// bootstrap/app.php
use ArtisanToolbox\\FrontAwesome\\Preferences\\Http\\Middleware\\HandlePreferences;
use Illuminate\\Foundation\\Configuration\\Middleware;

->withMiddleware(function (Middleware $middleware): void {
    $middleware->web(append: [HandlePreferences::class]);
})`;
const blade = `<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        @frontAwesomePreferences
        {{-- Keep the script before styles and your Vite entry. --}}
    </head>
</html>`;
const plugin = `import { createFrontAwesome, createPreferences } from '@artisan-toolbox/front-awesome';
import { createLocalization } from '@artisan-toolbox/front-awesome/localization';
import translations from './generated/front-awesome-translations.json';

// Inside the existing createInertiaApp options:
withApp(app, { page }) {
    const preferences = createPreferences(page.props.preferences);
    const localization = createLocalization(translations);
    app.use(createFrontAwesome({ preferences, localization }));
}`;
const usage = `<script setup>
import { Appearance, Language, Timezone } from '@artisan-toolbox/front-awesome/components';
\x3C/script>

<template>
    <Appearance v-slot="{ appearance, dark, light, pending, error }">
        <p>Theme: {{ appearance }}</p>
        <button :disabled="pending" @click="dark()">Dark</button>
        <button :disabled="pending" @click="light()">Light</button>
        <p v-if="error" role="alert">{{ error }}</p>
    </Appearance>
    <Language v-slot="{ locale, locales, setLocale, pending, error }">
        <label>Language
            <select :value="locale" :disabled="pending"
                @change="setLocale($event.target.value)">
                <option v-for="choice in locales" :key="choice.locale" :value="choice.locale">
                    {{ choice.label }}
                </option>
            </select>
        </label>
        <p v-if="error" role="alert">{{ error }}</p>
    </Language>
    <Timezone v-slot="{ timezone, timezones, setTimezone, pending, error }">
        <label>Display timezone
            <select :value="timezone" :disabled="pending"
                @change="setTimezone($event.target.value)">
                <option v-for="zone in timezones" :key="zone" :value="zone">{{ zone }}</option>
            </select>
        </label>
        <p v-if="error" role="alert">{{ error }}</p>
    </Timezone>
</template>`;
const installUser = `php artisan install:user-preferences --model='App\\Models\\User'`;
const model = `use ArtisanToolbox\\FrontAwesome\\Preferences\\Concerns\\InteractsWithPreferences;
use ArtisanToolbox\\FrontAwesome\\Preferences\\Contracts\\HasPreferences;
use Illuminate\\Foundation\\Auth\\User as Authenticatable;

class User extends Authenticatable implements HasPreferences
{
    use InteractsWithPreferences;
}`;
const provider = `use App\\Models\\User;
use ArtisanToolbox\\FrontAwesome\\FrontAwesome;

public function boot(): void
{
    FrontAwesome::setPreferenceStore(User::class);
}`;
const custom = `php artisan make:preferences-store TenantPreferencesStore`;
const customProvider = `FrontAwesome::setPreferenceStore(\\App\\Http\\Preferences\\TenantPreferencesStore::class);`;
const carbon = `$instant = \\Carbon\\Carbon::parse('2026-11-10T12:00:00Z');
$local = $instant->toPreferenceTimezone();`;
const dates = `import { usePreferences } from '@artisan-toolbox/front-awesome';

const { formatDate } = usePreferences();
formatDate(new Date('2026-11-10T12:00:00Z'), {
    dateStyle: 'medium', timeStyle: 'short',
});`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection id="prerequisites" title="Start with Laravel and Inertia">
            <p>
                This how-to starts after
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                    >installation</DocsLink
                >
                in a Laravel 13 application with sessions, Inertia 3, and Vue 3.5. Run commands in
                the application root. Complete the
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/localization').href"
                    >localization guide</DocsLink
                >
                first to generate the translation catalog used below.
            </p>
            <p>
                Preferences are an unreleased source-preview API. Confirm that your installed
                package exports <code>createPreferences</code> and <code>Timezone</code>, and that
                Artisan lists the preference commands. The published alpha does not guarantee these
                additions.
            </p>
        </ProseSection>
        <ProseSection id="resolve-each-request" title="Resolve each request">
            <p>
                Append the middleware to the web group. It reads the active store, selects the
                Laravel request locale, and shares <code>preferences</code> with Inertia. The
                default store uses the current Laravel session. Reading defaults never saves them.
            </p>
            <CodeExample label="Append request preferences" language="php" :code="middleware" />
            <p>
                In the root Blade document, render the request language and run the appearance
                script before CSS. Remove competing appearance cookies, localStorage initialization,
                and theme scripts from your application. The optional directive argument is a CSP
                nonce.
            </p>
            <CodeExample
                label="Initialize language and appearance before paint"
                language="blade"
                :code="blade" />
            <p>
                A new session starts with <code>system</code> appearance, a supported language
                negotiated from <code>Accept-Language</code> with <code>app.locale</code> as
                fallback, and <code>app.timezone</code> as its display timezone.
            </p>
        </ProseSection>
        <ProseSection id="install-browser-service" title="Install the browser service">
            <p>
                The Preferences guides group
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'front-awesome/preferences/appearance').href
                    "
                    >appearance</DocsLink
                >,
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'front-awesome/preferences/language').href
                    "
                    >language</DocsLink
                >,
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'front-awesome/preferences/timezone').href
                    "
                    >timezone</DocsLink
                >, and
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'front-awesome/preferences/currency').href
                    "
                    >currency</DocsLink
                >
                controls under one backend integration.
            </p>
            <CodeExample
                label="Register backend-owned preferences"
                language="typescript"
                :code="plugin" />
            <p>
                Install preferences before localization. Applications that already own their
                transport and toast setup can install <code>preferences</code> and
                <code>localization</code> directly with <code>app.use()</code> in that order.
                Renderless selectors provide state and actions. Your application supplies their
                markup.
            </p>
            <CodeExample label="Build the display selectors" language="vue" :code="usage" />
            <p>
                Each action sends one Inertia PATCH and returns to the current page. The browser
                applies confirmed server values while preserving component state, scroll, query, and
                fragment. Display slot errors and disable controls while a change is pending.
                Language changes also refresh translated server props and internal package UI.
            </p>
            <PreferencesDemo />
        </ProseSection>
        <ProseSection id="store-on-the-user" title="Store preferences on the authenticated user">
            <p>
                This integration is optional. The installer generates a nullable JSON column on the
                selected model's table. Inspect the generated migration, connection, table, and
                column before running <code>php artisan migrate</code>. The installer does not run
                migrations or modify your model.
            </p>
            <CodeExample
                label="Generate the reviewable migration"
                language="bash"
                :code="installUser" />
            <CodeExample label="Implement the model contract" language="php" :code="model" />
            <CodeExample
                label="Select the model in AppServiceProvider"
                language="php"
                :code="provider" />
            <p>
                Guests continue to use their session. Signed-in users use their own account values
                and defaults. Guest preferences are never automatically copied into an account. The
                trait keeps unrelated JSON values and hides the storage column from normal model
                serialization.
            </p>
        </ProseSection>
        <ProseSection id="use-custom-storage" title="Implement custom storage">
            <p>
                Generate an implementation of <code>PreferencesStore</code>, then select its fully
                qualified class name in <code>AppServiceProvider::boot()</code>. Each of the eight
                getters and setters receives the current <code>Request</code>. Constructor
                dependencies resolve through Laravel's container.
            </p>
            <CodeExample label="Generate a request-aware store" language="bash" :code="custom" />
            <CodeExample label="Register the custom store" language="php" :code="customProvider" />
            <p>
                Front Awesome validates appearance, selectable locale, timezone, and optional
                currency before calling setters. Custom getters may return <code>null</code> to use
                the standard defaults.
            </p>
        </ProseSection>
        <ProseSection
            id="format-in-the-preferred-timezone"
            title="Format in the preferred timezone">
            <p>
                Keep the application and database timezone fixed. Convert dates only when presenting
                them. The Carbon macro returns a converted copy. It preserves the instant and leaves
                the original object unchanged. Outside a preference-aware request it uses the
                application timezone.
            </p>
            <CodeExample label="Convert a Carbon copy" language="php" :code="carbon" />
            <CodeExample
                label="Present dates in the saved timezone"
                language="typescript"
                :code="dates" />
            <p>
                Import <code>usePreferences</code> from
                <code>@artisan-toolbox/front-awesome</code> in JavaScript. A native
                <code>Date</code> uses the device timezone for local formatting, which can differ
                from the saved timezone. Vue I18n named date formats keep their explicit settings.
                Pass the saved <code>timeZone</code>
                when those formats should follow the preference.
            </p>
            <DocsLink
                :href="findNavigationItem(navigation, 'front-awesome/preferences/reference').href"
                >Read storage, validation, and timezone details</DocsLink
            >
        </ProseSection>
    </article>
</template>
