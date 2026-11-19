<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const setup = `import { createPermit } from '@artisan-toolbox/permit';

// In the existing createInertiaApp setup callback, after the Inertia plugin:
app.use(createPermit());`;

const gates = `<script setup>
import { useGate } from '@artisan-toolbox/permit';

const gate = useGate();
</${'script'}>

<template>
    <Gate allows="reports::read">
        <p>The report list is available.</p>
    </Gate>

    <Gate :any="['reports::export', 'role::admin']">
        <p>Some report tools are available.</p>
    </Gate>

    <button type="button" :disabled="!gate.allows('reports::export')">
        Export reports
    </button>
</template>`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="register-the-plugin" title="Register the Vue plugin">
                <p>
                    Start with a Laravel 13 application using Inertia 3, Vue 3.5, and Vite. Install
                    Permit and its optional JavaScript package through
                    <DocsLink :href="findNavigationItem(navigation, 'permit/installation').href"
                        >Install Permit</DocsLink
                    >. Register the plugin on your Inertia application's Vue instance before
                    mounting.
                </p>
                <CodeExample
                    label="Register the Permit plugin"
                    language="javascript"
                    :code="setup" />
            </ProseSection>
            <ProseSection id="render-access" title="Render the actor's Gate decisions">
                <p>
                    Add the Reports group and the Administrator role from the
                    <DocsLink :href="findNavigationItem(navigation, 'permit/declarations').href"
                        >declaration guide</DocsLink
                    >. Put this example in a Vue page reached through your application session.
                    Grant the test user <code>reports::read</code> and reload. The first paragraph
                    appears. Grant <code>reports::export</code> to enable the export button.
                </p>
                <CodeExample
                    label="Show and disable controls from Gate decisions"
                    language="vue"
                    :code="gates" />
                <p>
                    The plugin provides the global <code>&lt;Gate&gt;</code> component and
                    <code>$gate</code> property. Use <code>useGate()</code> from Composition API.
                    <code>allows</code>, <code>allow</code>, and <code>check</code> require every
                    supplied ability. <code>denies</code> and <code>deny</code> succeed if any
                    requested ability is denied. <code>any</code> requires at least one grant.
                    <code>none</code> requires zero grants.
                </p>
                <p>
                    Each method accepts one key or an array. For an empty array,
                    <code>allows</code> and <code>none</code> return <code>true</code>.
                    <code>denies</code> and <code>any</code> return <code>false</code>. An absent
                    key evaluates to <code>false</code>. Pass one condition prop to the component.
                </p>
            </ProseSection>
            <ProseSection
                id="keep-server-authorization"
                title="Enforce authorization on the server">
                <p>
                    Permit shares the configured actor's Gate decisions in
                    <code>permitAbilities</code>. Inertia refreshes that prop on partial reloads.
                    Guests receive an empty map. The browser only sees decisions from the last
                    response. Authorize protected actions again in Laravel or use the
                    <DocsLink :href="findNavigationItem(navigation, 'permit/authorization').href"
                        >Permit middleware</DocsLink
                    >.
                </p>
                <p>
                    To edit a user's assignments from an Inertia page, follow
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'permit/management').href +
                            '#enable-the-editor'
                        "
                        >Connect the editor to Permit</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
