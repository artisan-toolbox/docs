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
import { computed } from 'vue';
import { Timezone } from '@artisan-toolbox/front-awesome/components';
import { usePreferences } from '@artisan-toolbox/front-awesome/preferences';

const { formatDate } = usePreferences();
const instant = new Date('2026-11-10T12:00:00Z');
const displayedTime = computed(() => formatDate(instant, {
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
}));
\x3C/script>

<template>
    <Timezone v-slot="{ timezone, timezones, setTimezone, pending, error }">
        <label for="preferred-timezone">Display timezone</label>
        <select id="preferred-timezone" :value="timezone" :disabled="pending"
            :aria-busy="pending" @change="setTimezone($event.target.value)">
            <option v-for="choice in timezones" :key="choice" :value="choice">
                {{ choice }}
            </option>
        </select>
        <p v-if="error" role="alert">{{ error }}</p>
    </Timezone>
    <time :datetime="instant.toISOString()">{{ displayedTime }}</time>
</template>`;
const carbon = `// Keep the default Carbon macro registration, or set false to disable it:
'preferences' => [
    'carbon_macro' => true,
],

// Inside a request that has passed through HandlePreferences:
$instant = \\Carbon\\Carbon::parse('2026-11-10T12:00:00Z');
$display = $instant->toPreferenceTimezone();

$display->format('H:i'); // 09:00 with America/Sao_Paulo selected
$instant->format('H:i'); // 12:00; the original object is unchanged`;
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
                in your Laravel, Inertia, and Vue application. Confirm that your Composer-installed
                source preview exports <code>Timezone</code> and <code>usePreferences</code>. These
                APIs are unreleased. Keep the application and database timezone fixed.
            </p>
        </ProseSection>
        <ProseSection id="select-and-format" title="Select a timezone and format an instant">
            <p>
                Add this component to a Vue page in your application. <code>Timezone</code> provides
                the confirmed <code>timezone</code>, supported <code>timezones</code>,
                <code>setTimezone()</code>, and save feedback. The component adds no markup.
            </p>
            <CodeExample label="Save the display timezone" language="vue" :code="selector" />
            <p>
                Choose <code>America/Sao_Paulo</code>. After the Inertia request succeeds, the
                defined instant displays as <code>09:00</code>. Choose <code>UTC</code> to display
                <code>12:00</code>. In both cases the time element's machine-readable value remains
                <code>2026-11-10T12:00:00.000Z</code>.
            </p>
        </ProseSection>
        <ProseSection id="format-with-the-saved-zone" title="Use the saved zone for presentation">
            <p>
                <code>usePreferences().formatDate()</code> formats a native Date or timestamp using
                the confirmed locale and timezone. The computed value above updates after either
                preference changes. Explicit formatting options override these defaults. A native
                Date's own local formatting uses the device timezone instead.
            </p>
            <p>
                Use the supplied server timezone identifiers, including <code>UTC</code>. Browser
                formatting requires Intl support for the selected zone. A change to the device
                timezone never silently saves an account preference. Show <code>error</code> and
                disable the selector while <code>pending</code> is true.
            </p>
        </ProseSection>
        <ProseSection id="convert-a-carbon-copy" title="Convert a Carbon copy on the server">
            <p>
                The Carbon macro is enabled by default in the package configuration. Call it after
                the preferences middleware resolves the request.
            </p>
            <CodeExample label="Present a converted Carbon copy" language="php" :code="carbon" />
            <p>
                The macro returns a copy in the selected timezone and preserves the instant. It does
                not mutate <code>app.timezone</code>, PHP's global timezone, or the source date.
                Carbon's default JSON serialization still represents the same UTC instant. Outside a
                preference-aware request, the macro uses the application timezone.
            </p>
            <p>
                Try the
                <DocsLink
                    :href="`${findNavigationItem(navigation, 'front-awesome/preferences').href}#install-browser-service`"
                    >shared preferences demo</DocsLink
                >
                and read the
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'front-awesome/preferences/reference').href
                    "
                    >preferences reference</DocsLink
                >
                before applying the saved zone to other date-formatting libraries.
            </p>
        </ProseSection>
    </article>
</template>
