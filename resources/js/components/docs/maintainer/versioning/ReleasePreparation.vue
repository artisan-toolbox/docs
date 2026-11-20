<script setup>
import { computed } from 'vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const props = defineProps({
    navigation: { type: Array, required: true },
});

const integrationHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/versioning/project-integration').href,
);
</script>

<template>
    <div class="contents">
        <ProseSection id="requirements" title="Requirements">
            <p>Before starting, Maintainer requires:</p>
            <ul>
                <li>a completely clean Git working tree;</li>
                <li>
                    a major branch named <code>0.x</code>, <code>1.x</code>, <code>2.x</code>, and
                    so on;
                </li>
                <li>
                    a class exposed by the production Composer PSR-4 or classmap autoloader that
                    implements <code>Versionable</code>;
                </li>
                <li>authenticated GitHub CLI access;</li>
                <li>a supported semantic version when the version constant already exists;</li>
                <li>
                    configured AI providers and credentials for generating the release notes and
                    changelog.
                </li>
            </ul>
            <p>
                See
                <DocsLink :href="integrationHref">Project Integration</DocsLink>
                for the version class, lifecycle hooks, and managed README header.
            </p>
        </ProseSection>
        <ProseSection id="find-the-release-baseline" title="Find the release baseline">
            <p>
                Maintainer reads published GitHub releases, ignores drafts and unsupported tags, and
                selects the highest valid version for the branch major. A missing local release tag
                is fetched explicitly from <code>origin</code>, supporting shallow and
                <code>--no-tags</code> clones.
            </p>
            <p>
                When <code>0.x</code> has no release, initial choices are <code>0.1.0</code>,
                <code>0.1.0-alpha.1</code>, and <code>0.1.0-beta.1</code>. Other majors begin at
                <code>MAJOR.0.0</code> with equivalent prerelease choices.
            </p>
        </ProseSection>
        <ProseSection id="version-transitions" title="Version transitions">
            <ul>
                <li>
                    A stable release can advance to the next patch, stable minor, minor alpha, or
                    minor beta.
                </li>
                <li>
                    An alpha can advance to the next alpha, first beta, or stable version of the
                    same version line.
                </li>
                <li>
                    A beta can advance to the next beta or stable version of the same version line.
                </li>
                <li>A prerelease line must become stable before another patch or minor begins.</li>
                <li>A major increment requires the matching new major branch.</li>
            </ul>
            <p>
                In Maintainer 1.14.0 and later, when the baseline is stable, the provider under
                <code>ai.providers.release_type_suggestion</code> recommends a version and explains
                its choice and the other versions in the picker. The recommendation sets the initial
                selection. You can select any version the branch allows. Maintainer opens the picker
                directly for a first release or when a prerelease line must finish.
            </p>
            <p>
                If the report identifies a breaking change that requires a new major version, review
                the warning before proceeding on the current branch. Patch remains the picker's
                default when the report finds no suitable version or the analysis fails.
            </p>
            <p>
                Routine documentation, GitHub Actions, test, and development-environment changes
                support a patch when they leave public behavior unchanged. A new compatible
                capability must be backed by a changed line in the supplied diff to support a minor
                recommendation. For reusable packages, the public contract includes capabilities
                shipped for developers. Maintainer omits conventional AI-assistant files for Laravel
                applications and uses patch if the available diff cannot support a higher
                recommendation.
            </p>
            <p>
                Maintainer 1.14.0 uses <code>ai.local_feedback_locale</code> for explanations in the
                terminal. Set it to <code>pt_BR</code>, for example, or leave it
                <code>null</code> to detect the language. When the terminal supplies no language or
                reports a generic locale such as <code>C.UTF-8</code>, Maintainer 1.14.1 uses the
                first preferred language on macOS. Use <code>ai.project_locale</code> for generated
                commit messages, release notes, and changelog text. It defaults to <code>en</code>.
            </p>
        </ProseSection>
    </div>
</template>
