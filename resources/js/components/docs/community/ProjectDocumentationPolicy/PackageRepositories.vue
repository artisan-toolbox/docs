<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="package-repositories"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Package repositories
        </h2>
        <p>Each package repository keeps a concise README containing:</p>
        <ul>
            <li><p>the package purpose;</p></li>
            <li><p>the installation command;</p></li>
            <li><p>a minimal usage example;</p></li>
            <li><p>compatibility and stability information;</p></li>
            <li>
                <p>
                    links to this documentation, contribution guidance, security policy, changelog,
                    and license.
                </p>
            </li>
        </ul>
        <p>
            Detailed guides, configuration references, troubleshooting information, and
            architectural explanations belong here. This separation keeps package landing pages
            useful without forcing maintainers to update the same long-form content twice.
        </p>
        <p>
            The canonical public documentation URL is
            <code>https://atb.dev.br</code>. Each package README must link to its corresponding page
            under this URL.
        </p>
        <p>
            Use <code>contact@atb.dev.br</code> for public contact metadata and security reporting.
            Transactional sender addresses and authentication fixtures keep their separate purposes.
            The documentation application's repeatable workspace contact check is documented in
            <code>docs/documentation/quality.md</code>; it does not inspect live credentials or
            modify dependency versions.
        </p>
        <h3
            id="package-overviews"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Package overviews
        </h3>
        <p>
            Start each package overview with its purpose, stability, and documented version. Follow
            with requirements, installation, a minimal example with an expected result, and links to
            detailed guides. For packages in development, describe the checkout and label examples
            as previews.
        </p>
        <p>
            In the documentation application, maintain package names, summaries, versions,
            stability, and requirements in
            <code>app/Documentation/Packages/</code>.
            <code>app/Documentation/Documentation.php</code> owns the catalog.
            <code>app/Documentation/PageSlug.php</code> owns page identities and sidebar order. The
            home page, package catalog, and package chooser consume that shared catalog. These
            definitions are the only active package catalog and page registry.
        </p>
        <h3
            id="sidebar-appearance"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Sidebar appearance
        </h3>
        <p>
            The documentation sidebar distinguishes section headings, package groups, and page links
            through typography, spacing, and nested guide lines. Highlight only the current page,
            allow long titles to wrap, and open the active branch automatically. Version badges use
            neutral colors. Development packages retain a visible stability label.
        </p>
        <p>
            Use Tailwind utilities and the shared tokens consumed through Front Awesome's public CSS
            entry points in the documentation application.
            <code>DocsLayout</code> and <code>DocsNavigationItem</code> own the sidebar. Keep
            keyboard focus visible and mobile touch targets at least 44 pixels high in both themes.
        </p>
        <p>
            Before changing these styles, check a deeply nested guide such as
            <DocsLink :href="findNavigationItem(navigation, 'maintainer/deployment/pm2').href"
                >PM2 configuration</DocsLink
            >
            in both light and dark themes. Verify that:
        </p>
        <ul>
            <li>
                <p>the current page is distinguishable and its active branch is expanded;</p>
            </li>
            <li>
                <p>
                    Tab shows a visible focus outline, and Enter expands or collapses a focused
                    group;
                </p>
            </li>
            <li>
                <p>
                    long labels and badges fit without horizontal scrolling at a viewport width of
                    390 pixels;
                </p>
            </li>
            <li>
                <p>
                    the mobile menu opens, scrolls to all links, and closes after a page is
                    selected.
                </p>
            </li>
        </ul>
        <h3
            id="readme-badges"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            README badges
        </h3>
        <p>
            Use the Shields.io <code>flat-square</code> style and keep badges in this order:
            Release, PHP, Laravel, Node.js, Tests, and Docs. Use the GitHub release badge for
            published packages and an <code>in development</code> badge before the first release.
        </p>
        <p>
            Show PHP and Laravel when they apply to the installation. Show Node.js when the package
            documents a supported frontend version range. Match the version constraints in the
            package manifests and keep all supported ranges visible. Point Tests to the package's
            GitHub Actions workflow and Docs to the package's canonical documentation page.
        </p>
        <p>
            Update the badges in the package's <code>readmeHead()</code> method and run
            <code>php vendor/bin/maintainer readme:update</code> from its checkout. In the
            Maintainer source checkout, run <code>php maintainer readme:update</code>.
        </p>
    </ProseSection>
</template>
