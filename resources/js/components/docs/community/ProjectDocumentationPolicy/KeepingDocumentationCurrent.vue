<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="keeping-documentation-current"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Keeping documentation current
        </h2>
        <h3
            id="laravel-migration"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Laravel migration
        </h3>
        <p>
            The replacement's <code>1.x</code> repository supplies the Vue
            source references shown in documentation page footers. Each
            registered page names its actual Vue file, and a registry test
            verifies that the source exists. The migrated Maintainer Code
            Quality section lives under <code>/docs/maintainer/ci</code>. The
            Configuration overview, reference, publishing guide, and SSH keys
            guide live under <code>/docs/maintainer/configuration</code>. Local
            migration does not imply production cutover.
        </p>
        <p>
            Package guide pages reuse a shared header that keeps each guide
            title visible beside its package specifications. Package overview
            wordmarks do not replace detailed guide titles. Migrate related
            section pages together where practical, retaining code examples,
            anchors, exact legacy redirects, and destinations for guides that
            remain on this site.
        </p>
        <p>
            The complete Versioning section is migrated under
            <code>/docs/maintainer/versioning</code>, including commits, HTML
            diffs, releases, and project integration. The pending-push feature
            is explicitly labeled as a preview on the current
            <code>1.x</code> branch after <code>1.10.0</code>. Preserve
            production-autoload discovery requirements even when integration
            classes are used only by development tooling. The replacement's
            shared <code>DocsLink</code> opens external HTTP(S) destinations in
            a new tab with <code>noopener noreferrer</code>. Internal
            destinations, local anchors, email links, and telephone links retain
            their appropriate navigation behavior.
        </p>
        <p>
            The replacement application provides operator access through
            <code>/login</code> using single-use email codes restricted to
            <code>atb.dev.br</code>. It uses SQLite-backed sessions and protects
            the Log Viewer UI, API, and downloads at <code>/logs</code>.
            Password, registration, dashboard, and settings endpoints are
            unavailable. Configure a real mail transport; login codes must never
            be written to logs. The full workflow lives in
            <code>docs/documentation/access.md</code>.
        </p>
        <p>
            The workspace <code>docs</code> directory contains the replacement
            Laravel, Vue, and Inertia application. The existing site in
            <code>docs_old</code> remains the published content source until
            cutover. The replacement's authoring workflow, architecture, asset
            process, and staged migration plan live under
            <code>docs/documentation</code> in the workspace.
        </p>
        <p>
            Keep package changes synchronized with this site and any
            corresponding migrated Vue pages during the transition. Migrate
            requirements, examples, heading anchors, and links before adding an
            exact legacy redirect. Unmigrated pages retain their current public
            URLs.
        </p>
        <p>
            The replacement disables Vue SSR, uses JavaScript Vue setup
            components and Tailwind, and delegates documentation metadata to
            Laravel Head. Shared components own page headers, specifications,
            requirements, prose, code examples, and navigation. Browser icons
            and the manifest live under <code>public/favicons/</code> in the
            replacement.
        </p>
        <p>
            The replacement models visitable pages with a string-backed slug
            enum, immutable page and package definitions, and Laravel resources
            for frontend serialization. Named routes generate application URLs
            using <code>APP_URL</code>; published destinations for unmigrated
            guides stay on this site until their replacements exist.
        </p>
        <p>
            Its navigation follows the nearest registered nonempty slug prefix.
            For example, <code>maintainer/ci/quality</code> belongs to
            <code>maintainer/ci</code>, under <code>maintainer</code>. Keep
            sibling order in the enum and do not maintain a separate Vue menu
            registry. The index remains a top-level link. Separate disclosure
            buttons expand sections; page links navigate and close the mobile
            menu. The active branch opens automatically, and only the current
            page receives current-page semantics. See
            <code>docs/documentation/authoring.md</code> for the authoring
            workflow.
        </p>
        <p>
            Preserve space for nested labels, compact guide indentation, and
            distinct package sections in the replacement sidebar. Highlight only
            the current page, allow long titles to wrap, and retain 44-pixel
            touch targets. Review the actual application at desktop and mobile
            widths in both themes when changing this presentation.
        </p>
        <p>
            Before implementing a documentation feature, inspect Artisan
            Toolbox's public components, composables, and backend APIs. Prefer
            consuming those capabilities over creating site-specific duplicates,
            and record the reuse decision in the same task. For example, inspect
            Front Awesome's <code>Theme</code> component and theme plugin before
            adding or changing theme selection. Consume its public
            <code>@artisan-toolbox/front-awesome/tailwind.css</code> entry point
            for shared tokens. Run
            <code>php artisan vendor:publish --tag=front-awesome-branding</code>
            to publish the application-owned
            <code>resources/css/branding.css</code> overrides and import them
            after the shared theme. Current checkout features may require a
            local preview until the package release publishes them. Follow the
            documented Composer-first consumer installation and use public
            package entry points.
        </p>
        <p>
            Every package task must inspect and update the relevant content in
            this repository as part of the same change. This includes public
            features, bug fixes, commands, configuration, compatibility,
            workflows, extension points, architectural decisions, deprecations,
            migrations, and breaking changes.
        </p>
        <p>
            Before a package task is complete, its documentation must accurately
            describe current behavior, examples, requirements, stability, and
            compatibility. Pull requests to this repository must pass content
            validation, formatting, and the production build.
        </p>
        <p>
            The replacement application's <code>composer ci:check</code> runs a
            Rector dry run followed by Maintainer's complete PHP and frontend
            quality workflow. Development and CI use PHP 8.5 with Composer
            development dependencies installed. Maintainer and Deployer are
            development tools; the user owns deployment configuration and
            execution separately from the documentation migration.
        </p>
        <p>
            The replacement's <code>App\ArtisanToolbox</code> implements
            Maintainer's public <code>Versionable</code> and
            <code>WithReadmeHead</code> contracts. It owns the application
            version and generated README metadata. After editing
            <code>readmeHead()</code>, run
            <code
                >php vendor/bin/maintainer readme:update --no-interaction</code
            >
            from the replacement checkout. Its isolated CLI regression test
            verifies production discovery, README synchronization, preserved
            manual content, and repeated execution.
        </p>
        <p>
            The replacement application uses the <code>1.x</code> branch for
            development and GitHub source links. Its tests workflow runs on
            pushes to <code>1.x</code> and on pull requests. CI installs locked
            Composer dependencies before <code>npm ci</code>, builds client
            assets, and runs Rector and Maintainer as separate steps. Test
            services use array stores, synchronous queues, and SQLite in memory.
        </p>
        <p>
            The replacement's <code>.npmrc</code> configures the scoped Web
            Awesome Pro registry and reads its authentication token from
            <code>WEBAWESOME_NPM_TOKEN</code>. Export the variable in the local
            shell before installing Pro dependencies. npm does not read
            Laravel's <code>.env</code> file. CI supplies the variable from a
            repository secret. The configuration enables
            <code>install-links</code> for local package dependencies and keeps
            dependency lifecycle scripts disabled.
        </p>
        <p>
            The replacement generates its share image by resizing the wordmark
            before integer alpha flattening and explicit padding. Its asset
            tests verify exact blending, repeated generation, and matching
            SHA-256 digests for published artifacts. Keep these exact checks
            when changing the generator; the workflow is documented in
            <code>docs/documentation/assets.md</code>.
        </p>
    </ProseSection>
</template>
