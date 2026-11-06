<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `php vendor/bin/maintainer readme:update`;
const contributorChecks = `composer install
npm ci
composer test
php vendor/bin/maintainer quality:check --no-interaction
npm run build`;
</script>

<template>
    <ProseSection>
        <h2
            id="versioning"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Versioning
        </h2>
        <p>
            Mosaicast is maintained on the <code>1.x</code> branch. GitHub
            Actions runs tests for pushes to version branches and for pull
            requests. Review the
            <DocsLink
                href="https://github.com/artisan-toolbox/mosaicast/blob/1.x/CHANGELOG.md"
                >changelog</DocsLink
            >
            before upgrading.
        </p>
        <h3
            id="dispatcher-class"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Dispatcher class
        </h3>
        <p>
            Starting with 1.2, the facade and the
            <code>mosaicast()</code> helper use
            <code>ArtisanToolbox\Mosaicast\Delivery\MosaicastDispatcher</code>.
            Update any direct injection, helper return types, and container
            bindings that referenced
            <code>ArtisanToolbox\Mosaicast\Mosaicast</code>. The root class
            holds the package version and README configuration for Maintainer.
        </p>
        <p>
            For the same upgrade, switch CommonJS consumers to ES module imports
            and refresh the Composer-delivered JavaScript dependency. The
            channel identifier now includes the session's CSRF token. Reload
            open clients, drain jobs that target old identifiers, and pass the
            session token if you call
            <code>SessionBroadcastChannel::identifier()</code> or
            <code>name()</code> directly. See the
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'mosaicast/session-channels')
                        .href + '#session-lifecycle'
                "
                >session lifecycle</DocsLink
            >
            for details.
        </p>
        <h3
            id="readme-header"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            README header
        </h3>
        <p>
            Maintainer generates the README header from
            <code>ArtisanToolbox\Mosaicast\Mosaicast::readmeHead()</code> during
            releases. To regenerate it locally, install Composer development
            dependencies and run this command from the package checkout.
        </p>
        <CodeExample
            label="README header example 1"
            language="bash"
            :code="example1"
        />
        <p>
            Edit the release class to change the header. Maintainer replaces the
            marked block and preserves the rest of the README.
        </p>
        <h3
            id="build-the-package"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Build the package
        </h3>
        <p>
            For the unreleased development toolchain on the package's
            <code>1.x</code> branch, use PHP 8.5 and Node.js 24.11 or later
            within the Node.js 24 series, matching CI. From the package
            checkout, install Composer dependencies before npm dependencies, run
            the checks, and rebuild the distributed client:
        </p>
        <CodeExample
            label="Validate and build the package checkout"
            language="bash"
            :code="contributorChecks"
        />
        <p>
            Successful checks exit without errors. The build writes the ESM
            client, IIFE bundle, and type declarations to <code>dist/</code>.
            Keep Vite+ 1.5.0, its Vite core alias at 1.5.0, and the bundled
            Vitest 5.1.0 aligned when refreshing dependencies. See the
            <DocsLink href="https://viteplus.dev/guide/upgrade-project"
                >Vite+ update guide</DocsLink
            >. These contributor requirements do not change how applications
            install the compiled Composer-delivered client.
        </p>
    </ProseSection>
</template>
