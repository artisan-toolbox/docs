<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const settings = `// config/front-awesome.php
return [
    'translations' => [
        'node_binary' => 'node',
        'include_application' => false,
        'locales' => ['*'],
        'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),
        'include_files' => [],
        'exclude_files' => [],
        'include_regex' => ['path' => [], 'file' => []],
        'exclude_regex' => ['path' => [], 'file' => []],
        'exclude_keys' => [],
        'output' => resource_path('js/generated/front-awesome-translations.json'),
    ],
];`;
const catalog = `{
    "version": 1,
    "fallbackLocale": "en",
    "availableLocales": ["en"],
    "locales": {
        "en": {
            "sourceLocale": "en",
            "label": "English",
            "messages": {
                "front-awesome::printing.title": "Print documents"
            }
        }
    }
}`;
const filters = `'translations' => [
    'include_application' => true,
    'include_files' => ['en/app.php', 'es.json', 'vendor/example/en/messages.php'],
    'exclude_files' => ['*/private.php'],
    'include_regex' => ['file' => ['~^(app|navigation)\\.php$~']],
    'exclude_regex' => ['path' => ['~^vendor/internal/~']],
    'exclude_keys' => ['app.internal.*'],
],`;
const formats = `// resources/js/i18n-formats.d.ts
import 'vue-i18n';

export {};

declare module 'vue-i18n' {
    interface DefineNumberFormat {
        money: { style: 'currency'; currency: string };
    }
    interface DefineDateTimeFormat {
        short: { dateStyle: 'short'; timeZone: string };
    }
}`;
const overrides = `php artisan vendor:publish --tag=front-awesome-lang`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection id="scope" title="Scope">
            <p>
                This reference describes the optional localization APIs included in Front Awesome
                beta. The
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/localization').href"
                    >Laravel translation how-to</DocsLink
                >
                contains installation and the first runnable example. Browser localization uses Vue
                I18n's Composition API. Full request-locale transfer for server rendering is outside
                this browser contract.
            </p>
        </ProseSection>
        <ProseSection id="translation-configuration" title="Translation configuration">
            <p>
                The Laravel configuration key is <code>front-awesome.translations</code>. These are
                the defaults.
            </p>
            <CodeExample label="Translation export defaults" language="php" :code="settings" />
            <DocsTable
                caption="Translation settings"
                :columns="['Setting', 'Contract']"
                :rows="[
                    [
                        'node_binary',
                        'Node.js executable used only during export. Defaults to node. Requires Node.js 24.11 or later on the asset host; --node overrides this setting.',
                    ],
                    [
                        'include_application',
                        'false disables application messages. true enables eligible application files for selected locales and the configured fallback. File and key filters are optional.',
                    ],
                    [
                        'locales',
                        'Defaults to the single wildcard entry *. The wildcard discovers eligible locale directories, JSON files, and namespace overrides. An explicit ordered list limits selectable locales instead of adding to built-ins.',
                    ],
                    [
                        'fallback_locale',
                        'Application fallback when the requested locale has no message. Defaults to APP_FALLBACK_LOCALE, or en when unset. English remains the final fallback for package text.',
                    ],
                    [
                        'include_files',
                        'Optional allowlist of PHP and JSON paths relative to the application lang directory. Empty means all eligible files.',
                    ],
                    [
                        'exclude_files',
                        'Optional file exclusions. Exclusions take priority over inclusions.',
                    ],
                    [
                        'include_regex',
                        'Optional path and file lists of validated, delimited PCRE expressions. Inclusion globs and regular expressions combine with OR.',
                    ],
                    [
                        'exclude_regex',
                        'Optional path and file regular expressions. Any matching exclusion wins.',
                    ],
                    [
                        'exclude_keys',
                        'Optional dotted Laravel keys or glob patterns excluded from application exports.',
                    ],
                    [
                        'output',
                        'Application resource JSON path, with a sibling declaration file generated from the same keys.',
                    ],
                ]" />
            <p>
                Application filters cannot remove mandatory package messages. Internal catalogs
                always retain <code>en</code>, <code>es</code>, <code>pt_BR</code>, and the
                configured fallback, even when those languages are absent from the selector. PHP
                translation files execute as trusted Laravel application code during a build. The
                exporter does not provide a public HTTP endpoint.
            </p>
            <p>
                An explicit <code>['en', 'es']</code> list offers only English and Spanish in that
                order. An empty list, a wildcard mixed with locale tags, and partial globs such as
                <code>en*</code> are invalid. The wildcard must be the only entry.
            </p>
            <p>
                Published Front Awesome overrides can add discovered languages even when
                <code>include_application</code> is false. That switch still excludes application
                text globally. Application locale directories, JSON files, and other namespace
                overrides participate in discovery when application export is enabled. Application
                text is exported only for selected locales and the configured fallback, including a
                fallback hidden from the selector.
            </p>
        </ProseSection>
        <ProseSection id="file-and-key-selection" title="File and key selection">
            <p>
                File globs match paths relative to <code>lang_path()</code>, such as
                <code>en/app.php</code>, <code>es.json</code>, or
                <code>vendor/example/en/messages.php</code>. With
                <code>include_application: true</code> and empty filters, eligible files for
                selected languages and the configured fallback enter the catalog. The following
                optional filters narrow that selection. Regex <code>path</code> rules match the
                relative path, while <code>file</code> rules match only the basename. Expressions
                require PCRE delimiters. Inclusion rules combine with OR, and any exclusion wins.
            </p>
            <CodeExample label="Narrow an application export" language="php" :code="filters" />
            <p>
                Nested PHP group keys become <code>app.welcome</code>. Namespaced keys retain
                <code>front-awesome::printing.title</code>. JSON keys remain exact literal strings,
                including dots and spaces. A JSON entry takes precedence when it collides with a PHP
                key.
            </p>
        </ProseSection>
        <ProseSection id="export-command-and-vite" title="Export command and Vite">
            <p>
                Export requires Node.js 24.11 or later and permission to start a subprocess on the
                asset host. Before writing either generated file, it checks locale identifiers with
                the same Intl canonicalization helper used by the browser. Aliases such as iw and he
                cannot define separate catalogs that resolve to the same browser locale. An invalid
                locale, collision, or unavailable Node executable leaves both previous files intact.
                Ordinary PHP preference requests do not start Node or compile translations.
            </p>
            <p>
                <code>php artisan front-awesome:export-translations</code> writes the configured
                JSON catalog and a sibling <code>.d.ts</code> declaration.
                <code>--output</code> selects another catalog path. <code>--node</code> selects the
                Node.js executable. <code>--manifest</code> supplies dependency metadata for build
                tooling. Identical exports preserve the existing files. A failed export preserves
                the previous valid catalog and exits unsuccessfully.
            </p>
            <p>
                Programmatic Artisan calls accept strings or <code>null</code> for
                <code>--output</code> and <code>--node</code>. Booleans, arrays, and numbers return
                a failure before either generated file is replaced. A <code>null</code> value uses
                the configured default.
            </p>
            <p>
                <code>frontAwesome({ translations: true, webAwesome: 'core' })</code> enables export
                before Vite scans frontend imports. <code>translations</code> is disabled when
                omitted or false. Its object form accepts <code>php</code>, <code>artisan</code>,
                and <code>cwd</code> for a custom PHP executable, Artisan path, and Laravel working
                directory. Without <code>php</code>, the executable follows
                <code>PHP_BINARY</code> when defined, then <code>php</code>. Vite passes its current
                Node executable to the export command automatically.
            </p>
            <p>
                The plugin watches language files and relevant configuration, regenerates after
                changes, and reloads the browser after a changed catalog. An invalid edit reports a
                development error while retaining the last valid output. A later valid edit
                recovers. Production export failure stops the build. Restart Vite after package or
                service-provider changes outside the watched inputs.
            </p>
            <p>
                The generated JSON is an ordinary module, bundled with the application. The catalog
                has no runtime fetch. The abbreviated shape below shows one locale and one message.
                Real exports also contain the required built-in locales and complete package
                messages.
            </p>
            <CodeExample label="Versioned browser catalog" language="json" :code="catalog" />
            <p>
                Generated version 1 catalogs include <code>availableLocales</code> as the ordered
                selector choices. These entries are canonicalized and must match catalog locales.
                Unknown entries and duplicate canonical choices are rejected. Older version 1
                catalogs without this optional field retain all catalog locales as choices.
            </p>
        </ProseSection>
        <ProseSection id="public-browser-api" title="Public browser API">
            <p>
                <code>createLocalization(catalog, options?)</code> and
                <code>useLocalization()</code> are exported from
                <code>@artisan-toolbox/front-awesome/localization</code>. The created service is
                installed through <code>createFrontAwesome({ localization })</code>. The installed
                global is <code>$frontAwesome.localization</code>.
            </p>
            <DocsTable
                caption="Localization service"
                :columns="['Member', 'Contract']"
                :rows="[
                    ['locale', 'Readonly reactive canonical HTML language.'],
                    [
                        'locales',
                        'Selectable locale descriptors in availableLocales order, with locale, sourceLocale, and label.',
                    ],
                    [
                        't(key, replacements?)',
                        'Translate a Laravel key with scalar named replacements and choice count.',
                    ],
                    ['n(value, format?)', 'Format a number through Vue I18n and Intl.'],
                    ['d(value, format?)', 'Format a date through Vue I18n and Intl.'],
                    [
                        'webAwesomeError',
                        'Readonly reactive native-language loading error, if an import fails.',
                    ],
                    [
                        'retryWebAwesome()',
                        'Retry native Web Awesome translation loading after a failure.',
                    ],
                    [
                        'setLocale(locale)',
                        'Select an available locale by changing the root HTML lang attribute. Hidden internal locales are rejected.',
                    ],
                ]" />
            <p>
                The options use Vue I18n Composition configuration, including
                <code>numberFormats</code> and <code>datetimeFormats</code>. Locale-indexed options
                use canonical tags such as <code>pt-BR</code>. The catalog and HTML controller own
                <code>messages</code>, <code>locale</code>, and <code>legacy</code>.
            </p>
            <p>
                <code>Language</code> is available from
                <code>@artisan-toolbox/front-awesome/components</code> and
                <code>@artisan-toolbox/front-awesome/components/Language.vue</code>. Its default
                slot exposes <code>{ locale, locales, setLocale }</code>. It adds no wrapper,
                styles, persistence, or backend request.
            </p>
        </ProseSection>
        <ProseSection id="html-locale-ownership" title="HTML locale ownership">
            <p>
                The document's <code>html.lang</code> selects the language. Aliases such as
                <code>pt_BR</code> and <code>pt-br</code> normalize to <code>pt-BR</code>. Direct
                changes to the HTML attribute update the service and existing controls. Multiple
                selectors share this source. A server-rendered or directly assigned language remains
                authoritative even when absent from <code>availableLocales</code>. Selector choices
                limit <code>setLocale()</code>, not the HTML language or native Web Awesome's
                response to it.
            </p>
            <p>
                The browser also canonicalizes legacy tags such as <code>iw</code> to
                <code>he</code>. The catalog retains the Laravel source locale for plural rules. Two
                source entries that normalize to the same browser tag are rejected.
            </p>
            <p>
                Standalone localization follows HTML language. To persist language through Laravel
                and refresh server props with Inertia, install the
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'front-awesome/preferences/language').href
                    "
                    >Language preferences integration</DocsLink
                >. Its middleware shares selectable locales and resolves the next request language.
                Direct writes to a Vue I18n composer's locale bypass the HTML language contract.
            </p>
            <p>
                Services belong to their Vue applications. Unmount releases their subscriptions, and
                the last owner disconnects the document observer. The demonstration saves your
                language through Preferences while the documentation content remains English.
            </p>
        </ProseSection>
        <ProseSection id="laravel-message-syntax" title="Laravel message syntax">
            <p>
                Messages retain Laravel syntax. <code>:name</code>, <code>:Name</code>, and
                <code>:NAME</code> perform named replacement and casing.
                <code>t('app.documents', { count: 2 })</code> selects Laravel exact, interval, or
                implicit choice branches. For example,
                <code>{0} None|{1} One|[2,*] :count documents</code> returns
                <code>2 documents</code>.
            </p>
            <p>
                The adapter evaluates Laravel choices and replacements through Vue I18n message
                functions. Source text does not use Vue I18n's native interpolation or
                linked-message syntax. Literal braces, email addresses, and <code>@:</code> remain
                text. The browser accepts scalar replacements. PHP closures, objects, and custom
                server-side stringable handlers are outside the browser contract.
            </p>
            <p>
                Fallback messages use their source locale's Laravel choice rules. Laravel implicit
                plural rules can differ from Intl's plural rules. Source translation values remain
                in Laravel PHP or JSON files, including package overrides.
            </p>
        </ProseSection>
        <ProseSection id="editor-types" title="Editor types">
            <p>
                The exporter generates a sibling declaration that augments Vue I18n's
                <code>DefineLocaleMessage</code> with exported message keys. Include generated
                declarations in the application's TypeScript project. The generated files need to
                exist before a standalone <code>vue-tsc</code> run on a clean checkout.
            </p>
            <p>
                Named format completion uses Vue I18n's own format schema augmentation. A project
                using the how-to's <code>money</code> and <code>short</code> formats can declare the
                following file.
            </p>
            <CodeExample
                label="Declare Vue I18n named formats"
                language="typescript"
                :code="formats" />
            <p>
                JavaScript consumers need no handwritten declarations. Additional schema options
                follow the
                <DocsLink href="https://vue-i18n.intlify.dev/guide/advanced/typescript"
                    >Vue I18n TypeScript reference</DocsLink
                >.
            </p>
        </ProseSection>
        <ProseSection id="package-and-native-translations" title="Package and native translations">
            <p>
                Front Awesome exports its complete package-owned printing text in English, Spanish,
                and Brazilian Portuguese without requiring published language files. The optional
                publish tag copies the package language files to Laravel's standard override
                location.
            </p>
            <CodeExample
                label="Publish optional translation overrides"
                language="sh"
                :code="overrides" />
            <p>
                For example, an override belongs at
                <code>lang/vendor/front-awesome/pt_BR/printing.php</code>. Laravel merges these
                overrides into the exported package namespace.
            </p>
            <p>
                The Vite integration loads native Web Awesome translations from the edition selected
                by <code>webAwesome</code>. Package Brazilian Portuguese uses <code>pt_BR</code>,
                while native Web Awesome currently supplies its <code>pt</code> catalog for
                <code>pt-BR</code>. That upstream catalog contains European Portuguese wording and
                some untranslated strings. Native coverage is distinct from Front Awesome's
                translated messages. A native translation load failure leaves its English fallback
                and exposes <code>webAwesomeError</code>. <code>retryWebAwesome()</code> retries the
                import. Core and Pro imports use the selected edition's registry.
            </p>
        </ProseSection>
        <ProseSection id="printing-localization" title="Printing localization">
            <p>
                With localization installed, package printing labels, default titles, live errors,
                and visible job state react to HTML language changes. Custom
                <code>PrintingOptions.messages</code>, drawer message overrides, supplied titles,
                printer names, and external literal errors keep their supplied text. Explicit
                overrides take priority. Service overrides apply to job titles, errors, and results.
                Drawer overrides apply to presentation labels and controls.
            </p>
            <p>
                A settled <code>handle.finished</code> result preserves the strings captured at
                settlement. It is a historical snapshot. Live views can show the current locale.
                Standalone printing without localization retains English defaults.
            </p>
            <p>
                Changing language never connects, queues a job, prepares a document, changes a
                printer, submits, or retries a submission. Printing remains reader-triggered. The
                <DocsLink
                    :href="findNavigationItem(navigation, 'front-awesome/printing/reference').href"
                    >printing reference</DocsLink
                >
                describes the other service contracts.
            </p>
        </ProseSection>
    </article>
</template>
