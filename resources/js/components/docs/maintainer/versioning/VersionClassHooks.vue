<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
</script>

<template>
    <div class="contents">
        <ProseSection id="version-class" title="Version class">
            <p>
                The version class must either live directly in a production
                PSR-4 namespace declared under <code>autoload.psr-4</code> or be
                included by a production <code>autoload.classmap</code> entry in
                the project's <code>composer.json</code>. Classes in nested
                PSR-4 namespaces and development-only autoload mappings are not
                considered. Classmap entries may point to a PHP file or a
                directory; directories are inspected recursively.
            </p>
            <p>
                Declaring <code>public const string VERSION</code> is optional:
                Maintainer creates it when absent and updates it when present.
                Existing constants must be public, string-typed, and use
                <code>MAJOR.MINOR.PATCH</code>, optionally followed by
                <code>-alpha</code>, <code>-alpha.N</code>, <code>-beta</code>,
                or <code>-beta.N</code>. Other formats, including
                <code>v</code> prefixes, release candidates, build metadata,
                missing components, and leading zeros, are rejected.
            </p>
            <p>
                During <code>release:create</code>, if the class has no version
                constant, the current version falls back to the latest valid
                GitHub release and then to <code>MAJOR.0.0</code>.
            </p>
        </ProseSection>
        <ProseSection id="versioning-hooks" title="Versioning hooks">
            <p>
                <code>BeforeVersioning::beforeVersioning($current, $next)</code>
                runs after Maintainer writes the PHP version constant and
                applies any confirmed <code>package.json</code> version update.
                Files changed by this callback become part of the release
                commit. If it or another pre-push step fails, Maintainer resets
                the repository to the original <code>HEAD</code> and removes
                untracked release files.
            </p>
            <p>
                <code>AfterVersioning::afterVersioning($current, $next)</code>
                runs only after the release commit is pushed and the GitHub
                release is published. Remote work cannot be rolled back
                automatically at this stage.
            </p>
            <p>
                Both callbacks run inside a visible terminal spinner and receive
                the same transition: the previous version and the selected
                version.
            </p>
        </ProseSection>
    </div>
</template>
