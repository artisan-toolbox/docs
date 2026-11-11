<script setup>
import { computed } from 'vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';

const props = defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const htmlDiffsHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/versioning/html-diffs').href,
);
const referenceHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/configuration/reference').href,
);
const example1 = 'vendor/bin/maintainer commit';
const example2 = 'vendor/bin/maintainer push';
const example3 = 'vendor/bin/maintainer push --branch=1.x --yes --no-interaction';
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection>
            <p>Run the interactive commit workflow:</p>
            <CodeExample label="Create a commit" language="bash" :code="example1" />
        </ProseSection>
        <ProseSection id="review-and-select-files" title="Review and select files">
            <p>
                Maintainer first offers to open the
                <DocsLink :href="htmlDiffsHref">HTML diff workflow</DocsLink> in the browser. Its
                searchable multi-select then lists modified, staged, deleted, renamed, and untracked
                files, with every change selected by default.
            </p>
            <p>
                The selection replaces the current staging-area selection. Selected files are staged
                with their complete working-tree contents; previously staged files that are not
                selected remain in the working tree but become unstaged.
            </p>
        </ProseSection>
        <ProseSection id="write-the-message" title="Write the message">
            <p>Choose one of three modes:</p>
            <ul>
                <li>write a message manually in the multiline editor;</li>
                <li>generate a Conventional Commit message from the selected status and diff;</li>
                <li>add user context before generating the message from the same changes.</li>
            </ul>
            <p>
                AI generation uses <code>ai.providers.commit_message</code>. Configure that provider
                and its credentials through the
                <DocsLink :href="referenceHref">Configuration Reference</DocsLink>
                before selecting an AI mode.
            </p>
            <p>
                For large selections, Maintainer limits the amount of status, diff, and optional
                context sent to the provider. It prioritizes source changes over generated files and
                dependency lock files in large diffs and marks omitted details in the prompt. If the
                provider rejects the request because it exceeds the model’s context window,
                Maintainer retries once when it can send a smaller prompt. All selected changes
                remain staged in full.
            </p>
            <p>
                The final commit message always opens in a multiline editor before Git creates the
                commit. AI modes prefill the editor with the generated result so you can read,
                refine, or replace it; manual mode opens the same editor empty.
            </p>
        </ProseSection>
        <ProseSection id="push-the-commit" title="Push the commit">
            <p>
                After Git creates the commit, Maintainer offers to push
                <code>HEAD</code> to <code>origin</code>. The default is no, and pushing always
                requires confirmation.
            </p>
            <p>
                The complete workflow requires interactive input. It does not create a commit when
                no files are selected or when message generation fails.
            </p>
        </ProseSection>
        <ProseSection id="push-existing-commits" title="Push existing commits">
            <p>Maintainer 1.11.0 includes this pending-push workflow.</p>
            <p>Open the pending-push workflow without creating another commit:</p>
            <CodeExample label="Push existing commits" language="bash" :code="example2" />
            <p>
                Maintainer checks origin and lists local branches with outgoing commits. Select a
                branch, review its destination and commit summaries, and confirm the push.
                Confirmation defaults to no. A clean working tree is not required. The workflow
                leaves your files, index, and checked-out branch intact.
            </p>
            <p>
                The selection is a branch push. Git sends the reviewed branch tip and its ancestors,
                rather than an arbitrary subset of commits. A branch that tracks origin uses that
                upstream branch name. A branch without an upstream targets the same branch name on
                origin. A missing destination creates a branch and includes its complete history in
                the review.
            </p>
            <p>For automation, name the branch and confirm explicitly:</p>
            <CodeExample label="Push a named branch" language="bash" :code="example3" />
            <p>
                Maintainer rejects detached HEAD, missing origin, upstreams on another remote, and
                divergent histories. Fetch or reconcile divergent branches separately before trying
                again. Push uses the reviewed commit and an explicit destination ref. Origin must
                resolve to one matching fetch and push URL. URL aliases are resolved once by Git,
                and configured mirror, extra push refspecs, and automatic tag pushes cannot expand
                the operation. Remote failures return a failing exit code and leave local commits
                available to retry.
            </p>
            <p>
                Immediately before pushing, Maintainer rechecks the reviewed state and pins the
                destination's expected previous commit. Concurrent remote updates, rewinds,
                deletions, and branch creation fail the push instead of changing what you reviewed.
                The workflow accepts only fast-forward ancestry and uses standard Git upload and
                receive commands. It does not use custom
                <code>remote.origin.uploadpack</code> or
                <code>remote.origin.receivepack</code> commands.
            </p>
        </ProseSection>
    </article>
</template>
