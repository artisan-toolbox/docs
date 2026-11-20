<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const requiredWorkflows = String.raw`<?php

return [
    'release' => [
        'workflow' => ['tests.yml', 'coverage.yml'],
    ],
];`;

const automaticPackageVersion = String.raw`{
  "maintainer": {
    "syncVersion": true
  }
}`;
</script>

<template>
    <div class="contents">
        <ProseSection id="release-workflow" title="Release workflow">
            <p>After version selection, Maintainer:</p>
            <ol class="flex list-decimal flex-col gap-3 pl-5">
                <li>
                    writes the selected version to the PHP version constant and can sync the root
                    <code>package.json</code>;
                </li>
                <li>runs the optional before-versioning callback;</li>
                <li>builds context from commits and the diff since the baseline;</li>
                <li>generates release notes and validated changelog entries;</li>
                <li>updates the managed README header;</li>
                <li>
                    runs every configured <code>quality.fix</code> command non-interactively,
                    including <code>vp check --fix</code> when available;
                </li>
                <li>
                    offers to run the configured <code>quality.test</code> checks with
                    <code>quality:check</code>;
                </li>
                <li>stages the generated and automatically formatted files;</li>
                <li>optionally opens an HTML review of the proposal;</li>
                <li>creates <code>chore(release): prepare VERSION</code>;</li>
                <li>pushes the commit to <code>origin</code>;</li>
                <li>waits for all required GitHub Actions workflows;</li>
                <li>publishes with <code>gh release create</code>.</li>
            </ol>
            <p>
                After publication, Maintainer runs the optional after-versioning callback. Alpha and
                beta versions use GitHub's prerelease flag. Maintainer creates a changelog if needed
                and prepends new releases with entries grouped by Conventional Commit type.
            </p>
            <p>
                In Maintainer 1.14.0 and later, a successful interactive publication offers to
                deploy the published tag if the project root contains <code>deploy.php</code>,
                <code>deploy.maml</code>, <code>deploy.yaml</code>, or <code>deploy.yml</code>. The
                default answer is no. If you accept, Maintainer opens <code>deploy</code> with the
                detected recipe and exact release tag. If deployment fails, the command reports the
                deployment failure and the GitHub release remains published.
            </p>
            <p>
                Set <code>release.workflow</code> in <code>config/maintainer.php</code> to a
                workflow filename such as <code>tests.yml</code>. The workflow must run on pushes to
                the release branch. Maintainer waits for success on the exact prepared commit before
                publishing a tag for that commit.
            </p>
            <p>
                Maintainer 1.14.0 accepts a list of required workflows. If coverage runs in its own
                workflow, add both filenames to your existing configuration. For example, use this
                <code>release</code> section when <code>tests.yml</code> and
                <code>coverage.yml</code> both run on pushes to your release branch.
            </p>
            <CodeExample
                label="Require tests and coverage before publishing"
                language="php"
                :code="requiredWorkflows" />
            <p>
                Run <code>php vendor/bin/maintainer release:create</code> from the project root.
                Expect status updates for both workflows. Maintainer creates the tag after both push
                runs pass on the exact release commit. If coverage is a job in
                <code>tests.yml</code>, use the single filename and make the workflow require a
                successful result from that job.
            </p>
            <p>
                During the wait, Maintainer shows the workflow, branch, commit, elapsed time, and
                run link when it becomes available. It reports whether GitHub has created the run,
                queued it, started it, or finished it. When GitHub provides job details, Maintainer
                shows the running jobs and their active steps.
            </p>
            <p>
                If the wait or publication fails, stay on the prepared commit and choose
                <strong>Versioning › GitHub releases</strong> from the menu. Maintainer shows the
                pending version and asks whether to resume. To invoke the same workflow directly,
                run <code>php vendor/bin/maintainer release:create --resume</code>. Rerun that
                commit if the runner or network interrupted CI. If CI found a defect, fix it and
                prepare a new release commit. The required workflows share a 15-minute wait.
                Maintainer reuses the reviewed title and notes when resuming.
            </p>
            <p>
                If the project root contains a regular
                <code>package.json</code> file tracked by Git, Maintainer asks whether to sync it by
                default. The default answer is no. If you accept, Maintainer sets the top-level
                <code>version</code> field to the exact release version, such as
                <code>1.2.0-beta.1</code>. The update runs before the before-versioning callback and
                becomes part of the release commit. The prompt covers only
                <code>package.json</code>. If the manifest is invalid or the write fails, Maintainer
                aborts the release and rolls back the changes.
            </p>
            <p>
                Maintainer 1.14.0 inserts a missing <code>version</code> as the first property in
                <code>package.json</code>. If the property already exists, Maintainer updates it in
                place.
            </p>
            <p>
                To synchronize automatically in Maintainer 1.14.0 and later, add
                <code>maintainer.syncVersion</code> with the JSON boolean <code>true</code> to the
                tracked root <code>package.json</code>. During <code>release:create</code>, expect
                the selected version to appear before the before-versioning callback. Omit the
                setting or set it to <code>false</code> to keep the confirmation prompt.
            </p>
            <CodeExample
                label="Synchronize package.json automatically"
                language="json"
                :code="automaticPackageVersion" />
            <p>
                Automatic fixes run after <code>CHANGELOG.md</code> is written and before any
                release file is staged. Maintainer then asks whether to run the configured checks,
                defaulting to yes. The release controls its own commit, so its internal
                non-interactive <code>quality:fix</code> invocation never offers to create a
                separate quality commit. Unavailable tools are skipped using the normal
                <code>quality:fix</code> and <code>quality:check</code> rules. If an available fixer
                or accepted check returns a failure, Maintainer aborts the release before committing
                and restores the original worktree.
            </p>
            <p>
                Every GitHub release title uses
                <code>TAG - compact outcome</code>, for example
                <code>1.2.0 - Add deployment health checks</code>. Maintainer adds the exact
                selected tag itself and normalizes AI output that already contains a version. Before
                creating the release commit or publishing, the generated title opens in a multiline
                editor so you can read and refine it. The edited title must keep the exact selected
                tag and a non-empty, single-line outcome of at most 100 characters.
            </p>
            <p>
                In Maintainer 1.14.0 and later, the AI returns the release outcome and sections of
                changes as structured data. Maintainer adds the version to the title and renders the
                Markdown headings and bullets.
            </p>
            <p>
                Git remains authoritative for changelog hashes. Unknown AI hashes are discarded, and
                every omitted real commit receives a deterministic entry derived from its subject. A
                release with no commits since the baseline stops before generating changelog entries
                or release notes.
            </p>
            <p>
                Changelog generation requests strict structured output so providers that support
                strict schemas enforce the allowed Conventional Commit types. Maintainer also
                validates the response locally. An invalid type aborts the release and identifies
                the affected commit, received value, and allowed types. This error indicates an
                invalid response field; it does not establish that the changelog exceeded a size
                limit.
            </p>
        </ProseSection>
    </div>
</template>
