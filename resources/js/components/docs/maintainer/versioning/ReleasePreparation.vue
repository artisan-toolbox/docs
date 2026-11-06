<script setup>
import { computed } from 'vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const props = defineProps({
    navigation: { type: Array, required: true },
});

const integrationHref = computed(
    () =>
        findNavigationItem(
            props.navigation,
            'maintainer/versioning/project-integration',
        ).href,
);
</script>

<template>
    <div class="contents">
        <ProseSection id="requirements" title="Requirements">
            <p>Before starting, Maintainer requires:</p>
            <ul>
                <li>a completely clean Git working tree;</li>
                <li>
                    a major branch named <code>0.x</code>, <code>1.x</code>,
                    <code>2.x</code>, and so on;
                </li>
                <li>
                    a class exposed by the production Composer PSR-4 or classmap
                    autoloader that implements <code>Versionable</code>;
                </li>
                <li>authenticated GitHub CLI access;</li>
                <li>
                    a supported semantic version when the version constant
                    already exists;
                </li>
                <li>
                    configured AI providers and credentials for release
                    recommendations and generated content.
                </li>
            </ul>
            <p>
                See
                <DocsLink :href="integrationHref">Project Integration</DocsLink>
                for the version class, lifecycle hooks, and managed README
                header.
            </p>
        </ProseSection>
        <ProseSection
            id="find-the-release-baseline"
            title="Find the release baseline"
        >
            <p>
                Maintainer reads published GitHub releases, ignores drafts and
                unsupported tags, and selects the highest valid version for the
                branch major. A missing local release tag is fetched explicitly
                from <code>origin</code>, supporting shallow and
                <code>--no-tags</code> clones.
            </p>
            <p>
                When <code>0.x</code> has no release, initial choices are
                <code>0.1.0</code>, <code>0.1.0-alpha.1</code>, and
                <code>0.1.0-beta.1</code>. Other majors begin at
                <code>MAJOR.0.0</code> with equivalent prerelease choices.
            </p>
        </ProseSection>
        <ProseSection id="version-transitions" title="Version transitions">
            <ul>
                <li>
                    A stable release can advance to the next patch, stable
                    minor, minor alpha, or minor beta.
                </li>
                <li>
                    An alpha can advance to the next alpha, first beta, or
                    stable version of the same version line.
                </li>
                <li>
                    A beta can advance to the next beta or stable version of the
                    same version line.
                </li>
                <li>
                    A prerelease line must become stable before another patch or
                    minor begins.
                </li>
                <li>
                    A major increment requires the matching new major branch.
                </li>
            </ul>
            <p>
                For a stable baseline, the provider under
                <code>ai.providers.release_type_suggestion</code> recommends
                patch or minor. Any analyzed fragment recommending minor makes
                minor the consolidated default; otherwise patch remains the
                default. AI is not consulted when no baseline exists or a
                prerelease line must finish.
            </p>
            <p>
                Package recommendations include development AI instructions and
                MCP configuration because those files can be part of the
                package's reusable developer experience. Laravel applications
                omit conventional AI-assistant instructions, rules, prompts,
                skills, and MCP configuration from the SemVer recommendation
                because they do not change the delivered site or application.
                Development-only AI or MCP dependencies that remain visible in
                shared manifests are explicitly treated as internal maintenance
                rather than evidence for a minor release. When only omitted
                development files or other normally omitted artifacts changed in
                an application, Maintainer defaults to patch without asking AI.
            </p>
        </ProseSection>
    </div>
</template>
