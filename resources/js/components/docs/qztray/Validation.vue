<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="php-static-analysis"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            PHP static analysis
        </h2>
        <p>
            Run <code>composer analyse</code> from the package repository. The
            <code>phpstan.neon.dist</code> configuration analyzes <code>src/</code>,
            <code>config/</code>, and <code>routes/</code> at level 7. A local
            <code>phpstan.neon</code>, when present, takes precedence.
        </p>
        <p>
            The Composer plugin
            <code>phpstan/extension-installer</code> automatically registers the Larastan and Carbon
            extensions. Do not add their <code>extension.neon</code> files to the local
            configuration's <code>includes</code> list: doing so loads them twice and prevents
            PHPStan from running.
        </p>
        <h2
            id="php-validation"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            PHP validation
        </h2>
        <p>
            Frontend tests live in <code>tests/Frontend/</code>, separate from the distributed
            source in <code>resources/js/</code>. PHP tests remain in
            <code>tests/Feature/</code> and <code>tests/Unit/</code>. Vite Plus discovers
            <code>tests/Frontend/**/*.test.ts</code>; formatting, linting, and TypeScript checks
            include these files. Declaration generation includes only <code>resources/js/</code>,
            and Git export rules exclude tests from Composer archives. Run
            <code>npm run check</code>, <code>npm run test</code>, and <code>npm run build</code> to
            validate the frontend.
        </p>
        <p>
            Run <code>composer test</code> for the complete PHP validation suite: static analysis,
            formatting, type coverage, and Pest tests. The service provider tests cover empty
            credential defaults, application configuration overrides, both credential publish tags,
            the container singleton, and command registration. HTTP tests cover the named endpoints,
            successful PEM responses, certificate configuration errors, and validity boundaries
            using a fixed public certificate fixture and a controlled clock. Signing tests verify
            SHA-512 signatures using generated test keys and cover exact payload preservation,
            configuration errors, OpenSSL failures, authentication, and CSRF. The removed scaffold
            views and translations are not part of the connector's supported features.
        </p>
        <p>
            An isolated PHP test loads the service using only root and declared production
            dependency autoloaders, guarding against development-only interfaces leaking into
            runtime code. Frontend tests reject malformed HTTP successes, verify Buffer snapshots,
            and exercise the actual QZ SDK's signing error boundary through an emulated transport.
            PDF engine tests use the real legacy distribution in Node for Node 20 compatibility;
            browser builds retain the modern distribution. CI includes frontend checks on Node 20.19
            and 22.18 for Ubuntu and Windows in addition to the PHP matrix's Node 24 runtime.
        </p>
        <p>
            Credential publishing tests resolve source paths and verify the published file contents
            for both supported tags in unique temporary directories, so they do not depend on
            Windows or Unix path separators or interfere with parallel test workers.
        </p>
        <h2
            id="resources"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Resources
        </h2>
        <ul>
            <li>
                <p>
                    <DocsLink href="https://github.com/artisan-toolbox/qztray"
                        >Source code</DocsLink
                    >
                </p>
            </li>
            <li>
                <p>
                    <DocsLink href="https://github.com/artisan-toolbox/qztray/blob/1.x/CHANGELOG.md"
                        >Changelog</DocsLink
                    >
                </p>
            </li>
            <li>
                <p>
                    <DocsLink
                        href="https://github.com/artisan-toolbox/qztray/blob/1.x/.github/CONTRIBUTING.md"
                        >Contributing</DocsLink
                    >
                </p>
            </li>
            <li>
                <p>
                    <DocsLink
                        href="https://github.com/artisan-toolbox/qztray/blob/1.x/.github/SECURITY.md"
                        >Security policy</DocsLink
                    >
                </p>
            </li>
            <li>
                <p>
                    <DocsLink href="https://github.com/artisan-toolbox/qztray/blob/1.x/LICENSE.md"
                        >License</DocsLink
                    >
                </p>
            </li>
        </ul>
        <h2
            id="documentation-and-contact"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Documentation and contact
        </h2>
        <p>
            The canonical documentation is available at
            <DocsLink :href="findNavigationItem(navigation, 'qztray').href">atb.dev.br</DocsLink>.
            Contact the project at
            <DocsLink href="mailto:contact@atb.dev.br">contact@atb.dev.br</DocsLink>.
        </p>
    </ProseSection>
</template>
