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
import { Appearance } from '@artisan-toolbox/front-awesome/components';
\x3C/script>

<template>
    <Appearance v-slot="{ appearance, system, light, dark, toggle, pending, error }">
        <fieldset :disabled="pending" :aria-busy="pending">
            <legend>Appearance</legend>
            <button type="button" :aria-pressed="appearance === 'system'" @click="system">
                Use device setting
            </button>
            <button type="button" :aria-pressed="appearance === 'light'" @click="light">
                Light
            </button>
            <button type="button" :aria-pressed="appearance === 'dark'" @click="dark">
                Dark
            </button>
            <button type="button" @click="toggle">Switch light and dark</button>
        </fieldset>
        <p v-if="error" role="alert">{{ error }}</p>
    </Appearance>
</template>`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection id="prerequisites" title="Start with persisted preferences">
            <p>
                This how-to starts after the
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/preferences').href"
                    >preferences setup</DocsLink
                >
                in your Laravel, Inertia, and Vue application. Keep its middleware, prepaint Blade
                directive, and browser service installed. These APIs, including
                <code>Appearance</code>, are included in Front Awesome beta.
            </p>
        </ProseSection>
        <ProseSection id="render-the-selector" title="Render appearance controls">
            <p>
                Add this component to a Vue page in your application.
                <code>Appearance</code> renders its slot without adding markup or styles. Native
                buttons provide keyboard interaction; <code>aria-pressed</code> identifies the saved
                choice.
            </p>
            <CodeExample label="Save an appearance choice" language="vue" :code="selector" />
            <p>
                Select Dark. After the Inertia request succeeds, the saved value is
                <code>dark</code> and the document uses dark mode. Reload the page to confirm the
                same choice. The active store determines whether the choice belongs to the session
                or the explicitly configured authenticated user.
            </p>
        </ProseSection>
        <ProseSection id="follow-device-appearance" title="Follow the device setting">
            <p>
                <code>system()</code> saves <code>system</code>. The document then follows the
                device's light or dark preference without saving each device change.
                <code>light()</code> and <code>dark()</code> save explicit modes.
                <code>toggle()</code> switches from the currently resolved mode to the opposite
                explicit mode. It does not cycle through all three choices.
            </p>
            <p>
                Keep one appearance owner per document. The preferences setup supplies it and paints
                the confirmed choice before Vue mounts. Application styles still define the palette.
                Avoid a second cookie or localStorage theme controller.
            </p>
        </ProseSection>
        <ProseSection id="handle-pending-and-errors" title="Keep save feedback visible">
            <p>
                <code>pending</code> covers an active preference request. Disable controls while it
                is true and display <code>error</code> when saving fails. The selector continues to
                report the confirmed choice; a failed request does not prove that a new value was
                saved. Keep the message visible and allow the reader to retry.
            </p>
            <p>
                Try the
                <DocsLink
                    :href="`${findNavigationItem(navigation, 'front-awesome/preferences').href}#install-browser-service`"
                    >shared preferences demo</DocsLink
                >, then consult the
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'front-awesome/preferences/reference').href
                    "
                    >preferences reference</DocsLink
                >
                for storage and recovery behavior.
            </p>
        </ProseSection>
    </article>
</template>
