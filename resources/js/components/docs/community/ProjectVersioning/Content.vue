<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <p>
            The documentation site and the packages it documents have
            independent release histories.
        </p>
        <h2
            id="documentation-site"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Documentation site
        </h2>
        <p>
            The site follows
            <DocsLink href="https://semver.org/">Semantic Versioning</DocsLink>.
            The replacement application's
            <code>App\ArtisanToolbox::VERSION</code>, in
            <code>app/ArtisanToolbox.php</code>, owns its current version. The
            class implements Maintainer's <code>Versionable</code> and
            <code>WithReadmeHead</code> contracts and stays in the production
            <code>App\</code> PSR-4 directory so Maintainer can discover it. Its
            <code>readmeHead()</code> method owns generated README metadata.
            Keep the root <code>package.json</code> version synchronized when
            the configured release workflow updates frontend metadata.
        </p>
        <p>
            The replacement currently develops on <code>1.x</code> with an alpha
            version. This migration does not publish a release or change the
            production site. The legacy Astro publication retains its
            independent version in <code>docs_old/package.json</code>.
        </p>
        <ul>
            <li>
                <p>Patch releases correct or clarify existing documentation.</p>
            </li>
            <li>
                <p>
                    Minor releases add package documentation, guides, or site
                    capabilities without removing established URLs.
                </p>
            </li>
            <li>
                <p>
                    Major releases may reorganize public URLs or remove
                    documentation for unsupported package generations.
                </p>
            </li>
        </ul>
        <p>
            The replacement repository's existing tags use unprefixed versions,
            such as <code>1.0.0-alpha.1</code> and <code>1.0.0-alpha.2</code>.
            Preserve that convention when preparing its next release. Package
            repositories keep their own tag conventions.
        </p>
        <p>
            After editing <code>readmeHead()</code>, run
            <code
                >php vendor/bin/maintainer readme:update --no-interaction</code
            >
            from the replacement checkout. Keep manual README content outside
            the generated markers. The full application workflow lives in
            <code>docs/documentation/quality.md</code> in the workspace.
        </p>
        <h2
            id="package-documentation"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Package documentation
        </h2>
        <p>
            Every package follows its own version and compatibility policy. For
            a stable package, the badge in the navigation identifies the
            documented major generation.
        </p>
        <p>
            Packages without a stable release use an
            <code>In development</code> label in the replacement and the
            <code>WIP</code> badge in the legacy publication. Their pages
            describe the development checkout and identify examples as previews.
        </p>
        <p>
            For a stable package, the unversioned URL, such as
            <code>/docs/core</code> in the replacement or
            <code>/packages/core/</code> in the legacy publication, documents
            the latest supported release. When a new major version requires
            substantially different documentation, the previous generation is
            preserved under a versioned URL before the unversioned page moves
            forward.
        </p>
        <p>Documentation-only releases do not change any package version.</p>
    </ProseSection>
</template>
