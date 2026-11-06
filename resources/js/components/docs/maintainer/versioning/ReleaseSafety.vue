<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
</script>

<template>
    <div class="contents">
        <ProseSection id="ai-context-limits" title="AI context limits">
            <p>
                Diffs are divided into fragments of at most 24,000 characters,
                with no more than 16 fragments analyzed. Generated output,
                dependencies, coverage, lockfiles, and minified assets are
                recorded as omitted rather than copied into prompts. When the
                limit truncates analysis, Maintainer tells the operator to
                review the remaining changes.
            </p>
        </ProseSection>
        <ProseSection id="failure-and-rollback" title="Failure and rollback">
            <p>
                Before the release commit is pushed, a failure restores the
                captured starting <code>HEAD</code> and removes untracked
                release files. On platforms with <code>pcntl</code>,
                <code>SIGTERM</code> performs the same rollback and exits with
                status <code>143</code>.
            </p>
            <p>
                After a successful push, Maintainer does not attempt local
                rollback because local changes cannot safely undo remote state.
            </p>
        </ProseSection>
    </div>
</template>
