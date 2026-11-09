<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `php artisan vendor:publish --tag=front-awesome-config`;
const example2 = `<?php

return [
    'webawesome' => [
        'toast' => [
            'icons' => [
                'success' => ['name' => 'tick', 'library' => 'my-icons'],
                'neutral' => null,
            ],
        ],
    ],
];`;
</script>

<template>
    <ProseSection>
        <p>
            Front Awesome loads its PHP defaults when Laravel discovers the package. Publish the
            file to customize those defaults in your application.
        </p>
        <CodeExample label="Package configuration example 1" language="sh" :code="example1" />
        <p>
            Laravel copies the file to <code>config/front-awesome.php</code>. If your deployment
            caches configuration, rebuild the config cache after editing the file.
        </p>
        <p>
            The separate <code>front-awesome-branding</code> publish tag copies the optional
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/shared-theme').href +
                    '#publish-the-branding-file'
                "
                >shared-theme branding file</DocsLink
            >
            to <code>resources/css/branding.css</code>. The PHP configuration does not select a
            stylesheet, palette, or color mode.
        </p>
        <h2
            id="default-toast-icons"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Default toast icons
        </h2>
        <p>
            The <code>webawesome.toast.icons</code> map contains one entry per variant. Laravel
            reads the map when a
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/toasts/laravel').href"
                >toast factory</DocsLink
            >
            sends a toast without an explicit icon.
        </p>
        <DocsTable caption="Default toast icons reference 1"
            ><thead>
                <tr>
                    <th scope="col">Variant</th>
                    <th scope="col">Default icon</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>brand</code></td>
                    <td><code>bell</code></td>
                </tr>
                <tr>
                    <td><code>success</code></td>
                    <td><code>circle-check</code></td>
                </tr>
                <tr>
                    <td><code>warning</code></td>
                    <td><code>triangle-exclamation</code></td>
                </tr>
                <tr>
                    <td><code>danger</code></td>
                    <td><code>circle-exclamation</code></td>
                </tr>
                <tr>
                    <td><code>neutral</code></td>
                    <td><code>circle-info</code></td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            Each entry accepts an icon name, an array with <code>name</code> and optional
            <code>library</code>, <code>family</code>, and <code>variant</code> strings, or
            <code>null</code> to disable the default for that variant. You can keep just the
            overrides in the application's file.
        </p>
        <CodeExample label="Default toast icons example 2" language="php" :code="example2" />
        <p>
            In this example, a Laravel success toast uses the
            <code>tick</code> icon from <code>my-icons</code>. Register custom icon libraries in the
            browser before displaying toasts. A Laravel neutral toast has no icon by default.
            Variants omitted from the map retain the package defaults. An explicit icon on a toast
            takes priority over the configuration.
        </p>
        <p>
            For toasts created with the Vue service, pass an icon in the
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/toasts/vue').href +
                    '#toast-options'
                "
                ><code>show()</code> options</DocsLink
            >. Set the stack position and Echo options in the
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/vue-plugin').href"
                >Vue plugin</DocsLink
            >.
        </p>
    </ProseSection>
</template>
