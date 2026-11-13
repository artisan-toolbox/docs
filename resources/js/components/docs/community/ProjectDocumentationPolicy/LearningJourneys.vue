<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="beginner-learning-journeys"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Beginner learning journeys
        </h2>
        <p>
            Every package has an overview quickstart and a dedicated Installation page. Open the
            overview with the package's purpose, stability, and documented version. Follow with
            requirements, installation, a first working example, configuration, task guides,
            advanced explanations, reference, and development. Put configuration before the first
            example when that example requires it.
        </p>
        <p>
            List packages alphabetically by displayed title in catalogs and top-level navigation.
            Within each package, order the sidebar by what readers need next. Prerequisites precede
            dependent guides, and lookup material follows guided use. Declare sibling order and
            editorial parents in
            <code>PageSlug</code>. Use a registered URL prefix as the default parent. An explicit
            parent can group an existing guide while preserving its public URL. Navigation, active
            ancestors, and breadcrumbs share that relationship. Do not alphabetize guide pages or
            maintain another list in Vue.
        </p>
        <p>
            State the starting environment and the directory where each command runs. Install the
            backend before its frontend dependency. Explain required sessions, authentication,
            broadcasters, workers, or hardware before using them. Mark optional integrations
            explicitly.
        </p>
        <p>
            Each quickstart includes public API code with defined inputs and an observable expected
            result. Keep a short installation command in the overview and link to the complete
            procedure. A beginner must be able to reach the first result without discovering missing
            setup in an advanced guide.
        </p>
        <p>
            Reserve the large package identity header for the overview. Child pages keep their task
            title and compact shared package tags. Documented compatibility and stability remain
            separate from the Composer version installed in the documentation application. Label
            local branches and unpublished APIs as previews.
        </p>
        <h3
            id="audit-a-package-journey"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Audit a package journey
        </h3>
        <p>
            Before completing a documentation task, check every affected package in the canonical
            <code>docs</code> application:
        </p>
        <ol class="list-decimal pl-5">
            <li>
                <p>
                    Confirm the purpose, stability, documented version, requirements, and preview
                    status against the package.
                </p>
            </li>
            <li>
                <p>
                    Follow the dedicated installation from its stated starting environment, with
                    backend steps before frontend steps.
                </p>
            </li>
            <li>
                <p>
                    Run the first example with its documented inputs and compare the actual result
                    with the expected result.
                </p>
            </li>
            <li>
                <p>
                    Follow the next guide and confirm that sidebar order places its prerequisites
                    first.
                </p>
            </li>
            <li>
                <p>
                    Check that shared components own repeated presentation and that the task
                    preserves existing examples, anchors, links, and advanced content.
                </p>
            </li>
            <li>
                <p>
                    Record the dependency refresh outcome and the checks that passed or remain
                    blocked.
                </p>
            </li>
        </ol>
        <h3
            id="use-established-writing-guidance"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Use established writing guidance
        </h3>
        <p>
            Use the versioned <code>atb-documentation</code> skill and its bundled writing and prose
            review guidance. Separate tutorials, task guides, reference, and explanations. The
            project follows
            <DocsLink href="https://diataxis.fr/tutorials/">Diataxis tutorial guidance</DocsLink>
            for achievable first results and
            <DocsLink href="https://developers.google.com/style/procedures"
                >Google's procedure guidance</DocsLink
            >
            for ordered actions and expected outcomes. Follow
            <DocsLink href="https://developers.google.com/style/code-samples"
                >Google's code sample guidance</DocsLink
            >
            with the project's language-specific formatting conventions.
        </p>
        <p>
            An additional skill needs a concrete missing capability and a reviewed source. Reuse
            installed guidance rather than installing unknown external skill code that duplicates
            it.
        </p>
        <h2
            id="reliable-documentation-changes"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Reliable documentation changes
        </h2>
        <p>
            Fix a defect at its owning source, whether that is a prerequisite, registry, public
            package API, or shared component. Do not hide defects with page-specific CSS patches,
            duplicated metadata, copied package internals, forced versions, weakened tests, or
            fixture refreshes that conceal missing content.
        </p>
        <p>
            Use specialized shared components with explicit inputs for headers, requirements, prose,
            examples, callouts, and navigation. Inspect package exports before adding documentation
            behavior, then record the public export used or the concrete reason that the application
            owns it.
        </p>
        <h3
            id="refresh-dependencies-honestly"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Refresh dependencies honestly
        </h3>
        <p>
            Each documentation task attempts compatible updates for installed Artisan Toolbox
            packages and the main runtime and test dependencies. Inspect the resolved versions, run
            Composer before npm, refresh Composer-delivered frontend copies, and run the affected
            checks. Record the commands, actual version changes, already-current results, conflicts,
            and unavailable registries or other blockers.
        </p>
        <p>
            Stay within the declared compatibility constraints. Do not fabricate a version bump,
            force an unpublished preview into a stable requirement, or relax compatibility to claim
            that the refresh succeeded. An installed checkout is runtime evidence, not proof of a
            public release.
        </p>
        <h3
            id="keep-demos-reproducible"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Keep demos reproducible
        </h3>
        <p>
            Documentation demos consume public package APIs. Vue demos belong under
            <code>resources/js/components/demo/&lt;package&gt;/&lt;section&gt;/</code>, and backend
            helpers belong under <code>app/Demo/&lt;Package&gt;/&lt;Section&gt;/</code>. Active
            connections, queues, jobs, and printing start only after the reader acts. Each demo
            provides loading, failure, reset, and source behavior. Private credentials remain on the
            server.
        </p>
        <p>
            Comparisons between native Laravel or Inertia and Mosaicast use the same inputs,
            payloads, event counts, timing, session, and queue conditions. Show the observed
            delivery behavior and its limits. Do not invent performance claims or add infrastructure
            that the requested example does not need.
        </p>
    </ProseSection>
</template>
