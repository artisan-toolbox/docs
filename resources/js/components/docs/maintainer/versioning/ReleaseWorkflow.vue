<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
</script>

<template>
    <div class="contents">
        <ProseSection id="release-workflow" title="Release workflow">
            <p>After version selection, Maintainer:</p>
            <ol class="flex list-decimal flex-col gap-3 pl-5">
                <li>
                    writes the selected version to the PHP version constant and
                    offers to sync the root <code>package.json</code>;
                </li>
                <li>runs the optional before-versioning callback;</li>
                <li>
                    builds context from commits and the diff since the baseline;
                </li>
                <li>
                    generates release notes and validated changelog entries;
                </li>
                <li>updates the managed README header;</li>
                <li>
                    runs every configured <code>quality.fix</code> command
                    non-interactively, including
                    <code>vp check --fix</code> when available;
                </li>
                <li>
                    offers to run every configured
                    <code>quality:check</code> contract non-interactively;
                </li>
                <li>stages the generated and automatically formatted files;</li>
                <li>optionally opens an HTML review of the proposal;</li>
                <li>creates <code>chore(release): prepare VERSION</code>;</li>
                <li>pushes the commit to <code>origin</code>;</li>
                <li>publishes with <code>gh release create</code>.</li>
            </ol>
            <p>
                Alpha and beta versions use GitHub's prerelease flag. A missing
                changelog is created; subsequent releases are prepended and
                grouped by Conventional Commit category.
            </p>
            <p>
                If the project root contains a regular
                <code>package.json</code> file tracked by Git, Maintainer asks
                whether to sync it. The default answer is no. If you accept,
                Maintainer sets the top-level <code>version</code> field to the
                exact release version, such as <code>1.2.0-beta.1</code>. The
                update runs before the before-versioning callback and becomes
                part of the release commit. The prompt covers only
                <code>package.json</code>. If the manifest is invalid or the
                write fails, Maintainer aborts the release and rolls back the
                changes.
            </p>
            <p>
                Automatic fixes run after <code>CHANGELOG.md</code> is written
                and before any release file is staged. Maintainer then asks
                whether to run the configured checks, defaulting to yes. The
                release controls its own commit, so its internal non-interactive
                <code>quality:fix</code> invocation never offers to create a
                separate quality commit. Unavailable tools are skipped using the
                normal <code>quality:fix</code> and
                <code>quality:check</code> rules. If an available fixer or
                accepted check returns a failure, Maintainer aborts the release
                before committing and restores the original worktree.
            </p>
            <p>
                Every GitHub release title uses
                <code>TAG - compact outcome</code>, for example
                <code>1.2.0 - Add deployment health checks</code>. Maintainer
                adds the exact selected tag itself and normalizes AI output that
                already contains a version. Before creating the release commit
                or publishing, the generated title opens in a multiline editor
                so you can read and refine it. The edited title must keep the
                exact selected tag and a non-empty, single-line outcome of at
                most 100 characters.
            </p>
            <p>
                Git remains authoritative for changelog hashes. Unknown AI
                hashes are discarded, and every omitted real commit receives a
                deterministic entry derived from its subject. A release with no
                commits since the baseline stops before content generation.
            </p>
            <p>
                Changelog generation requests strict structured output so
                providers that support strict schemas enforce the allowed
                Conventional Commit types. Maintainer also validates the
                response locally. An invalid type aborts the release and
                identifies the affected commit, received value, and allowed
                types. This error indicates an invalid response field; it does
                not establish that the changelog exceeded a size limit.
            </p>
        </ProseSection>
    </div>
</template>
