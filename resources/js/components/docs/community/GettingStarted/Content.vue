<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `composer require artisan-toolbox/<package>`;
</script>

<template>
    <ProseSection>
        <p>
            Artisan Toolbox is a collection of focused Laravel packages and
            developer tools. Each package can be adopted independently, while
            shared foundations live in the Core package.
        </p>
        <h2
            id="requirements"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Requirements
        </h2>
        <p>
            Requirements vary by package. Check the package page before
            installing it. The current package generation targets:
        </p>
        <ul>
            <li><p>PHP 8.5 or later</p></li>
            <li><p>Laravel 13 components</p></li>
            <li><p>Composer 2</p></li>
        </ul>
        <h2
            id="install-a-package"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Install a package
        </h2>
        <p>
            Packages are distributed through Packagist and installed with
            Composer:
        </p>
        <CodeExample
            label="Install a package example 1"
            language="bash"
            :code="example1"
        />
        <p>
            Replace <code>&lt;package&gt;</code> with the package name, such as
            <code>core</code> or <code>dump-to-console</code>.
        </p>
        <p>
            Packages with frontend features may also require an npm dependency.
            For QZ Tray Connector, install
            <code>artisan-toolbox/qztray</code> with Composer and register its
            bundled frontend using
            <code>npm install ./vendor/artisan-toolbox/qztray</code>, which
            records a
            <code>file:vendor/artisan-toolbox/qztray</code> dependency, and then
            follow its
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'qztray').href +
                    '#quickstart'
                "
                >quickstart</DocsLink
            >
            to configure credentials and Ziggy routes.
        </p>
        <h2
            id="next-step"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Next step
        </h2>
        <p>
            Read
            <DocsLink
                :href="
                    findNavigationItem(
                        navigation,
                        'getting-started/choose-a-package',
                    ).href
                "
                >Choose a Package</DocsLink
            >
            for a quick comparison, or browse the complete
            <DocsLink :href="findNavigationItem(navigation, '').href"
                >package catalog</DocsLink
            >.
        </p>
    </ProseSection>
</template>
