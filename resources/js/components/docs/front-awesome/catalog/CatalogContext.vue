<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <p>
            Start in the Laravel, Inertia, and Vue application from
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                >Installation</DocsLink
            >. Complete Composer before frontend installation and
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/web-awesome').href"
                >Web Awesome setup</DocsLink
            >. Keep its Vite plugin and styles. Add examples to a Vue page.
        </p>
        <p>
            <strong>Published preview.</strong> Front Awesome 1.0.0-alpha.2 includes all 73 Core and
            17 Pro wrappers in the Web Awesome 3.14.0 baseline, including Input, Page, Icon, and
            both Web Awesome barrel entries. Code Highlighter 3.15 remains planned. Front Awesome is
            an alpha release; its API can change before the first stable release. Wrappers forward
            native properties and events. Data-entry controls share <code>v-model</code> and Inertia
            form binding, including server errors and manual <code>failed</code> states. See
            <DocsLink
                :href="`${findNavigationItem(navigation, 'front-awesome/web-awesome/components/forms').href}#use-v-model`"
                >Forms binding</DocsLink
            >
            for value types and limits. Other mutable native state uses
            <DocsLink
                :href="`${findNavigationItem(navigation, 'front-awesome/web-awesome/components').href}#named-models`"
                >named models</DocsLink
            >, such as <code>v-model:open</code>, where supported. Compound exports remain
            individually discoverable and share one complete example with their owning component.
        </p>
        <p>
            Pro examples require a licensed Web Awesome Pro 3.14.0 installation and the Pro runtime
            selected in
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/web-awesome').href +
                    '#choose-core-or-pro'
                "
                >Web Awesome setup</DocsLink
            >. Import Pro wrappers and their TypeScript props from
            <code>@artisan-toolbox/front-awesome/components/WebAwesome/Pro</code>. Core imports
            remain separate. A missing Pro installation produces an explicit setup error. A wrapper
            does not grant a Pro license. Keep registry credentials outside browser code.
        </p>

        <p>
            In progress means wrapper work has started but is not available. In future means a
            planned Vue wrapper with no release date. Upstream availability is separate. Pro
            components require Web Awesome Pro access; wrappers do not grant a license.
        </p>
    </ProseSection>
</template>
