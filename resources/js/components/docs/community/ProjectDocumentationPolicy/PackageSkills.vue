<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="package-usage-skills"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Package usage skills
        </h2>
        <p>
            Each package owns agent guidance for using its public APIs in consuming applications.
            Keep its source under
            <code>resources/boost/skills/&lt;skill-name&gt;/SKILL.md</code>. Keep repository
            contribution rules in <code>AGENTS.md</code>.
        </p>
        <p>
            Reuse an existing skill when the task fits. Match its directory and YAML
            <code>name</code>, and write a precise <code>description</code> for discovery. Teach
            supported prerequisites, installation, public API usage, expected results, and relevant
            limitations. Link to the canonical guides instead of copying complete reference
            material.
        </p>
        <p>
            Keep the entry point focused. Add linked references or scripts only when a real workflow
            needs them. Verify that the supported Boost version distributes every required resource.
            Keep skills in the Composer archive and check discovery in a consuming Laravel
            application. Boost remains optional development tooling for consumers.
        </p>
        <p>
            Consumers install the package through Composer before running
            <code>php artisan boost:install</code> and selecting skills for their agent. After
            package updates, <code>php artisan boost:update</code> refreshes selected resources.
            Verify new skill selection interactively when needed. Edit package sources and
            regenerate consumer copies.
        </p>
        <p>
            Follow
            <DocsLink
                href="https://github.com/artisan-toolbox/docs/blob/1.x/documentation/package-skills.md"
                >Add and maintain a package usage skill</DocsLink
            >
            for an example, distribution checks, and consumer verification. The format and
            installation behavior follow
            <DocsLink href="https://laravel.com/docs/13.x/boost#third-party-package-skills"
                >Laravel Boost's third-party package skill guidance</DocsLink
            >
            and
            <DocsLink href="https://developers.openai.com/codex/skills/"
                >OpenAI's skill authoring guidance</DocsLink
            >.
        </p>
        <h3
            id="shared-contributor-standards"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Shared contributor standards
        </h3>
        <p>
            The documentation repository owns a versioned bundle of
            <code>atb-documentation</code> and <code>atb-package-development</code> skills under
            <code>documentation/agent-standards/</code>. The bundle includes writing guidance and
            page patterns so contributors share a maintained standard without requiring personal
            skill installations. Repository-specific instructions and specialized package skills
            continue to govern their respective areas.
        </p>
        <p>
            The documentation application is the first consumer. Its synchronizer installs the
            selected version into
            <code>.ai/skills/</code> for Laravel Boost and <code>.agents/skills/</code> for Codex,
            together with a lock and standalone checker. CI runs
            <code>npm run standards:check</code> before dependency installation. Other adopting
            projects can run <code>node .ai/sync.mjs --check</code> without a sibling documentation
            checkout.
        </p>
        <p>
            Follow
            <DocsLink
                href="https://github.com/artisan-toolbox/docs/blob/1.x/documentation/agent-standards.md"
                >shared agent standards</DocsLink
            >
            for installation and upgrades. Change the owning source, seal a higher version,
            synchronize the selected consumers, and review their diffs. Record projects still using
            older versions. Package usage skills under <code>resources/boost/skills/</code> continue
            to serve developers adopting public package APIs.
        </p>
        <h3
            id="review-skills-with-package-changes"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Review skills with package changes
        </h3>
        <p>
            Review affected skills whenever APIs, commands, configuration defaults, compatibility,
            prerequisites, failure behavior, or recommended usage change. Update instructions and
            examples in the same task as the implementation, tests, canonical guides in
            <code>docs</code>, and changelog. Record why a reviewed skill needs no edit when its
            guidance remains accurate.
        </p>
        <p>
            Validate metadata, links, resources, and executable examples. Check discovery and a
            realistic consumer task when adding or changing a skill. Include a request outside its
            scope to check the description. Record actual results and blockers. Passing a syntax
            check alone does not prove that the instructions work.
        </p>
        <h2
            id="review-documentation-with-every-change"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Review documentation with every change
        </h2>
        <p>
            Use the versioned <code>atb-documentation</code> skill and its bundled writing and prose
            review guidance. Choose one Diataxis mode per guide, write clear English with active
            voice, and use exact public API names. Define example inputs, place prerequisites before
            use, show expected results, and preserve working links and anchors.
        </p>
        <p>Before completing a change, review the following items:</p>
        <ol class="list-decimal pl-5">
            <li>
                <p>
                    Identify affected public contracts, supported versions, dependent packages,
                    guides, and skills.
                </p>
            </li>
            <li>
                <p>
                    Update implementation, behavior tests, skills, canonical documentation in
                    <code>docs</code>, and changelogs together where affected.
                </p>
            </li>
            <li>
                <p>
                    Keep package READMEs concise. Update their installation command, minimal
                    example, or compatibility statement only when affected.
                </p>
            </li>
            <li>
                <p>
                    Run relevant checks, executable examples, content regression tests, and the
                    required validation suites. Record checks that could not run and their exact
                    manual follow-up.
                </p>
            </li>
            <li>
                <p>
                    Report affected repositories, compatibility implications, unchanged guidance,
                    dependency refresh results, and remaining blockers for review.
                </p>
            </li>
        </ol>
    </ProseSection>
</template>
