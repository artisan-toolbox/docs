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

const configuration = `'preferences' => [
    'key' => 'preferences',
    'store' => \\ArtisanToolbox\\FrontAwesome\\Preferences\\Stores\\CookiePreferenceStore::class,
    'cookie_lifetime' => 525600,
    'guard' => null,
    'carbon_macro' => true,
],`;
const sessionStorage = `use ArtisanToolbox\\FrontAwesome\\FrontAwesome;
use ArtisanToolbox\\FrontAwesome\\Preferences\\Stores\\SessionPreferenceStore;

// In AppServiceProvider::boot():
FrontAwesome::setPreferenceStore(SessionPreferenceStore::class);`;
const contract = `namespace ArtisanToolbox\\FrontAwesome\\Preferences\\Contracts;

use Illuminate\\Http\\Request;

interface PreferencesStore
{
    public function getAppearance(Request $request): ?string;
    public function setAppearance(Request $request, string $appearance): void;
    public function getLocale(Request $request): ?string;
    public function setLocale(Request $request, string $locale): void;
    public function getTimezone(Request $request): ?string;
    public function setTimezone(Request $request, string $timezone): void;
    public function getCurrency(Request $request): ?string;
    public function setCurrency(Request $request, ?string $currency): void;
}`;
const modelContract = `interface HasPreferences
{
    public function getFrontAwesomePreference(string $name): ?string;
    public function setFrontAwesomePreference(string $name, ?string $value): void;
}`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection id="configuration" title="Configuration">
            <p>
                Persistent cookie storage is available starting with Front Awesome
                <code>1.0.0-beta.2</code>. Version <code>1.0.0-beta.1</code> and earlier default to
                <code>SessionPreferenceStore</code>.
            </p>
            <p>
                These Front Awesome beta settings belong to
                <code>config/front-awesome.php</code>. Follow the
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/preferences').href"
                    >preferences how-to</DocsLink
                >
                before using this reference.
            </p>
            <CodeExample label="Preference defaults" language="php" :code="configuration" />
            <p>
                <code>key</code> names both the user's JSON column and the top-level Inertia prop.
                It also namespaces cookies and session storage. Use the same configured value
                everywhere. Choose an unused ASCII identifier with a letter or underscore first and
                at most 63 characters. Dotted paths and prototype keys are rejected.
            </p>
            <p>
                <code>store</code> selects a concrete <code>PreferencesStore</code> class or an
                authenticatable Eloquent model implementing <code>HasPreferences</code>.
                <code>FrontAwesome::setPreferenceStore()</code> sets this option through a public
                registration API. Selection is explicit. Merely implementing the model contract does
                not change the default cookie store.
            </p>
            <p>
                <code>guard</code> defaults to <code>null</code>, which uses the request's default
                authentication guard. With account storage and an alternate guard such as
                <code>auth:staff</code>, set <code>preferences.guard</code> to <code>staff</code>.
                Both page reads and the preference endpoint must resolve the same account.
            </p>
            <p>
                <code>carbon_macro</code> enables <code>toPreferenceTimezone()</code>. An existing
                application macro with that name is preserved. It converts a copy of mutable Carbon,
                immutable Carbon, and Laravel Carbon, using the request preference or the
                application timezone outside a preference-aware request.
            </p>
        </ProseSection>
        <ProseSection id="cookie-storage" title="Persistent browser storage">
            <p>
                The default <code>CookiePreferenceStore</code> stores appearance, locale, timezone,
                and currency in separate cookies. Each write changes only its own cookie, so
                overlapping writes to different preferences do not replace each other. Concurrent
                writes to the same preference still follow response arrival order.
            </p>
            <p>
                <code>cookie_lifetime</code> is a positive integer number of minutes, defaulting to
                <code>525600</code> (365 days) from the most recent write to that preference. Reads
                do not renew expiration. Zero, negative, and noninteger lifetimes are rejected.
                Missing cookies use negotiated defaults without saving them. Clearing currency
                expires its cookie. Browser storage policies or clearing site data can remove
                cookies earlier.
            </p>
            <p>
                Keep Laravel's <code>EncryptCookies</code> and
                <code>AddQueuedCookiesToResponse</code> middleware in the <code>web</code> group.
                Cookies are encrypted and signed by Laravel, always HttpOnly, and inherit its cookie
                jar defaults from <code>session.path</code>, <code>session.domain</code>,
                <code>session.secure</code>, and <code>session.same_site</code>. The backend reads
                preferences before rendering the Blade appearance script; no browser storage
                controller is needed. Session lifetime and login expiration remain independent.
            </p>
            <p>
                Names follow <code>{session.cookie}_front_awesome_{preferences.key}_{field}</code>.
                Keep <code>session.cookie</code> distinct between applications sharing a cookie
                scope. Changing that name or <code>preferences.key</code> selects a different
                namespace.
            </p>
            <p>
                For a local check, select Dark in the preferences demo, then remove only the Laravel
                session cookie in browser developer tools. Reload the page. Appearance remains
                <code>dark</code> while Laravel creates a new session. Removing the appearance
                preference cookie restores <code>system</code> on the next request.
            </p>
        </ProseSection>
        <ProseSection id="upgrade-session-storage" title="Upgrade from session storage">
            <p>
                Applications without an explicit store selection use cookies after upgrading to
                <code>1.0.0-beta.2</code> or later. If published configuration still selects
                <code>SessionPreferenceStore</code>, change <code>preferences.store</code> to
                <code>CookiePreferenceStore::class</code>. Add <code>cookie_lifetime</code> only to
                override the merged default. No database migration or frontend change is required.
            </p>
            <p>
                On the first preference-aware request, the cookie store moves existing string
                preferences from an active legacy session into cookies and removes their session
                fields. An existing cookie takes priority and clears its legacy session field.
                Expired sessions cannot be recovered. Account values remain in the configured model
                and are never copied into guest cookies.
            </p>
            <p>
                For temporary preferences, explicitly select <code>SessionPreferenceStore</code>. It
                preserves the original behavior: session regeneration retains choices; invalidation
                or expiry clears them. Its whole-session writes still require Laravel session
                blocking on all participating routes to avoid stale writes between tabs.
            </p>
            <CodeExample
                label="Keep temporary session preferences"
                language="php"
                :code="sessionStorage" />
        </ProseSection>
        <ProseSection id="storage-contracts" title="Storage contracts">
            <CodeExample label="Request-aware storage contract" language="php" :code="contract" />
            <p>
                Getters return the saved string or <code>null</code>. Missing or invalid saved
                values use defaults. Existing cookie values are not rewritten when invalid; active
                legacy session strings are migrated as described above. The HTTP boundary validates
                setters before invoking your store. Direct application calls to a custom store
                remain your responsibility. Stores must use the supplied request and must not retain
                a previous request, user, or resolved preference in process-global state.
            </p>
            <CodeExample
                label="Authenticated model contract"
                language="php"
                :code="modelContract" />
            <p>
                Model keys are <code>appearance</code>, <code>locale</code>, <code>timezone</code>,
                and <code>currency</code>. The provided <code>InteractsWithPreferences</code> trait
                reads the configured JSON column, preserves unrelated entries, and writes one
                validated field at a time. It uses the model's connection, a transaction, and a
                fresh row lock. It updates the column without saving unrelated dirty attributes from
                the authenticated model.
            </p>
            <p>
                Only the four public preferences are shared. The trait hides the JSON column from
                ordinary model serialization, including an <code>auth.user</code> prop. A custom
                model implementation must keep private metadata out of its own serialization. No
                stored preferences are copied between users or promoted from guest cookies.
            </p>
        </ProseSection>
        <ProseSection id="defaults-and-validation" title="Defaults and validation">
            <p>
                Appearance accepts <code>system</code>, <code>light</code>, and <code>dark</code>.
                Its default is <code>system</code>. Timezones use PHP's supported IANA identifiers,
                including <code>UTC</code>, with <code>app.timezone</code> as the default. The
                browser's timezone never silently replaces the saved value.
            </p>
            <p>
                Currency defaults to <code>null</code>. A non-null value must be an uppercase
                current ISO 4217 code from the bundled SIX List One snapshot. Null clears the
                preference. Standard Laravel empty-string normalization also resolves an empty
                currency field to null. It does not affect stored amounts or perform currency
                conversion. The middleware returns the supported codes as <code>currencies</code>.
            </p>
            <p>
                Locale writes accept the selectable locales from the translation exporter. The
                default <code>translations.locales: ['*']</code> discovers languages. An ordered
                allowlist restricts choices. Fallback-only catalogs stay available to translation
                lookup without becoming selector choices. PHP uses source names such as
                <code>pt_BR</code>, while HTML and frontend state use canonical tags such as
                <code>pt-BR</code>.
            </p>
            <p>
                When no valid locale is saved, the resolver examines <code>Accept-Language</code> in
                quality order, ignores zero-quality ranges, and first tries an exact supported tag,
                then a supported variant of its base language. Ties follow selectable order.
                Missing, wildcard, or unmatched input falls back to <code>app.locale</code>. This
                application default can be active even when it is not offered as a selectable
                choice.
            </p>
            <p>
                The middleware captures and restores Laravel's locale around each request, including
                exceptions. It does not change <code>app.timezone</code> or the PHP default
                timezone. The HTML <code>lang</code> attribute remains the source used by Vue I18n
                and Web Awesome after the server confirms a locale change.
            </p>
        </ProseSection>
        <ProseSection id="inertia-and-slots" title="Inertia and slot APIs">
            <p>
                The CSRF-protected web route <code>front-awesome.preferences.update</code> accepts a
                PATCH containing exactly one preference. Unknown fields, multiple fields, arrays,
                invalid nulls, invalid choices, and unsafe return paths cause no store writes. The
                browser service sends a local return path in <code>X-Front-Awesome-Return</code>.
                Successful writes and validation failures redirect to that page with status 303.
                Validation errors use the <code>frontAwesomePreferences</code> bag.
            </p>
            <p>
                Shared preferences are included on partial Inertia responses. The public payload
                contains <code>appearance</code>, <code>locale</code>, <code>timezone</code>,
                <code>key</code>, <code>updateUrl</code>, <code>locales</code>,
                <code>timezones</code>, <code>currency</code>, and <code>currencies</code>. Pass the
                initial prop to <code>createPreferences()</code>. With a custom key, pass
                <code>page.props.your_key</code>. The service remembers that key for later
                responses.
            </p>
            <div class="overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th>Component</th>
                            <th>Default slot values</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Appearance</td>
                            <td>
                                <code
                                    >appearance, system(), light(), dark(), toggle(), pending,
                                    error</code
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>Language</td>
                            <td><code>locale, locales, setLocale(locale), pending, error</code></td>
                        </tr>
                        <tr>
                            <td>Timezone</td>
                            <td>
                                <code
                                    >timezone, timezones, setTimezone(timezone), pending,
                                    error</code
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>Currency</td>
                            <td>
                                <code
                                    >currency, currencies, setCurrency(currency), pending,
                                    error</code
                                >
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>
                <code>locales</code> contains objects with <code>locale</code>,
                <code>sourceLocale</code>, and <code>label</code>. <code>timezones</code> contains
                supported identifiers. <code>pending</code> and <code>error</code> belong to the
                selector's field. Actions return void. Read errors from the slot or service instead
                of catching a returned promise.
            </p>
            <p>
                <code>usePreferences()</code> exposes reactive appearance, resolved appearance,
                locale, timezone, pending state, errors, selector choices, setters, and
                <code>formatDate()</code>. The service is also available at
                <code>$frontAwesome.preferences</code>. Install it once per Vue application.
                Standalone <code>appearance: true</code> retains its existing localStorage behavior
                when backend preferences are not installed.
            </p>
            <p>
                The service serializes writes within one tab. It applies confirmed values after the
                redirected response, and preserves state, scroll, query, and fragment. A network
                failure can happen after a write commits. Refresh from the server before assuming a
                failed response means the preference was not saved.
            </p>
            <p>
                Cached and history visits reconcile the full page with the server so translated PHP
                props follow the confirmed language, including Inertia 3.0 releases without
                cached-visit metadata. An explicit <code>refresh()</code> reloads only the
                preference prop. Cache detection also covers in-flight prefetches without canceling
                unrelated prefetch work owned by the application.
            </p>
        </ProseSection>
        <ProseSection id="sessions-and-database-support" title="Sessions and database support">
            <p>
                The session cookie normally identifies a server-side session. The cookie driver
                stores its encrypted data in cookies. The array driver does not persist across
                ordinary requests. With <code>SessionPreferenceStore</code>,
                <code>session()->regenerate()</code> retains preferences and
                <code>session()->invalidate()</code> clears them. Persistent preference cookies are
                separate from every session driver and survive either operation. Follow Laravel's
                logout flow to invalidate the authentication session without extending its lifetime.
            </p>
            <p>
                Laravel saves complete session payloads. With <code>SessionPreferenceStore</code>,
                serial writes in one tab do not guarantee concurrent cross-tab durability. Hosts
                that need this guarantee must configure
                <a href="https://laravel.com/docs/13.x/session#session-blocking"
                    >session blocking</a
                >
                for all participating routes with a supported session driver and lock-capable cache.
                Locking only the preference PATCH cannot protect it from an unrelated page request
                that saves an older session payload.
            </p>
            <p>
                The installer generates <code>json(...)->nullable()</code> without a
                database-specific JSON default. Laravel maps it to JSON on MySQL and PostgreSQL,
                text on SQLite, and <code>nvarchar(max)</code> on SQL Server. MariaDB uses Laravel's
                MySQL-compatible grammar. SQLite migrations and behavior are executed in package
                tests. Other grammars are checked through SQL compilation, which does not establish
                live-engine compatibility. Review the migration against your production engine
                before migrating.
            </p>
            <p>
                The model trait preserves unrelated JSON fields through a fresh-row transaction.
                SQLite has no row-level <code>FOR UPDATE</code>; its normal write locking and retry
                behavior still apply. Existing outer transactions determine their own retry
                behavior. The package does not promise multi-device live synchronization.
            </p>
        </ProseSection>
        <ProseSection id="timezone-semantics" title="Timezone semantics">
            <p>
                A timezone changes how an instant is displayed. It does not change that instant.
                Laravel's default Carbon JSON serialization remains UTC. JavaScript's native date
                formatting uses the browser's zone unless you supply an explicit
                <code>timeZone</code>. A stored timezone can differ from the browser's zone.
            </p>
            <p>
                <code>formatDate(value, options)</code> formats a Date or millisecond timestamp with
                the confirmed locale and timezone. For Vue I18n <code>d()</code>, pass the
                preference timezone in the formatter options when desired. Existing named formats
                with explicit zones retain their configured behavior. Neither approach changes
                storage, Eloquent dates, or the application's clock.
            </p>
            <p>
                Installing localization after preferences adds the native Vue I18n named formats
                <code>preference</code> for dates and <code>currency</code> for numbers. Use
                <code>d(value, 'preference')</code> and <code>n(value, 'currency')</code> through
                either <code>useLocalization()</code> or the global <code>useI18n()</code> composer.
                Formats follow confirmed timezone and currency changes reactively. A null currency
                produces a decimal without a currency symbol. Existing named formats inherit missing
                timezone and currency values, while explicit format settings take precedence.
                Unkeyed native <code>d(value)</code> and <code>n(value)</code> keep Vue I18n
                defaults.
            </p>
        </ProseSection>
    </article>
</template>
