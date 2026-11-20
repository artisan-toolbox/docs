<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `composer install
npm ci`;
</script>

<template>
    <ProseSection>
        <p>
            Clone the
            <DocsLink href="https://github.com/artisan-toolbox/front-awesome"
                >Front Awesome repository</DocsLink
            >
            and switch to <code>1.x</code>. From the checkout, install the PHP dependencies before
            the frontend dependencies. Use the Node.js version in <code>.nvmrc</code>. Both install
            commands use the lockfiles from the checkout.
        </p>
        <CodeExample label="Develop Front Awesome example 1" language="sh" :code="example1" />
        <p>
            Larastan <code>^3.12.1</code> and Pest Type Coverage <code>^5.1.1</code> resolve PHPStan
            <code>^2.3.5</code> for development. The updated coverage plugin supports the
            collected-data API used by PHPStan 2.3.6 and later.
        </p>
        <p>
            Run <code>composer test:types</code> from the package checkout. It runs without cached
            analysis and requires <code>100</code> percent type coverage and a report with every
            eligible source file. After updating PHP quality tools, run
            <code>composer test</code> with newly resolved dependencies before changing either CI
            dependency lane.
        </p>
        <p>
            The source checkout uses Vite Plus <code>1.6.0</code> and bundled Vitest
            <code>5.1.0</code>. Keep the <code>vite</code> override at
            <code>npm:@voidzero-dev/vite-plus-core@1.6.0</code> and both
            <code>@vitest/browser-playwright</code> and <code>@vitest/coverage-v8</code> at
            <code>5.1.0</code>. Let Vite Plus select its runner. An older <code>vitest</code>
            override can prevent tests from starting even after an audit fix.
        </p>
        <p>
            When updating this toolchain, follow the
            <DocsLink href="https://viteplus.dev/guide/upgrade-project"
                >Vite Plus update guide</DocsLink
            >
            and review the manifest and lockfile together. Run <code>npm ci</code>,
            <code>npm audit</code>, and the checks below. A compatible installation reports no
            conflicting peer dependencies and starts both test projects.
        </p>
        <p>
            The checkout explicitly denies install scripts for <code>fsevents</code> through
            <code>allowScripts</code>. Its macOS package ships the native watcher binary and needs
            no installation step. This resolves npm's pending-script warning while keeping unrelated
            dependency scripts subject to npm's policy.
        </p>
        <h2
            id="validate-a-checkout"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Validate a checkout
        </h2>
        <p>
            Run <code>npm run typecheck</code> from the package checkout to check the Vue sources
            and invalid DataView examples. The negative checker launches the installed
            <code>vue-tsc</code> JavaScript entry with the current Node executable on Windows and
            Unix. It verifies rejected owner props, missing row fields and keys, invalid filter
            values, and invalid action operands. Success prints
            <code>DataView negative Vue fixtures rejected</code> followed by the checked contracts.
            A missing compiler or process-launch failure fails the check with its original error.
            Temporary Vue fixtures are removed after success or failure.
        </p>
        <DocsTable caption="Validate a checkout reference 1"
            ><thead>
                <tr>
                    <th scope="col">Command</th>
                    <th scope="col">Purpose</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>composer ci:check</code></td>
                    <td>Runs the Linux quality checks and builds the consumer fixture.</td>
                </tr>
                <tr>
                    <td><code>composer quality:check</code></td>
                    <td>Runs the configured Maintainer checks in strict mode.</td>
                </tr>
                <tr>
                    <td><code>composer test</code></td>
                    <td>Runs PHPStan, Pint, Pest, and PHP type coverage.</td>
                </tr>
                <tr>
                    <td><code>npm run build</code></td>
                    <td>
                        Builds the Vite consumer fixture. It uses Pro when Pro is installed and Core
                        otherwise.
                    </td>
                </tr>
                <tr>
                    <td><code>npm run test:browser</code></td>
                    <td>Exercises the theme selector and both styling systems in Chromium.</td>
                </tr>
                <tr>
                    <td><code>npm run theme:check</code></td>
                    <td>
                        Checks generated shared-theme CSS and the upstream compatibility inventory.
                    </td>
                </tr>
                <tr>
                    <td><code>npm run test:theme</code></td>
                    <td>
                        Builds and checks public base and optional PrimeVue theme consumers in
                        Chromium.
                    </td>
                </tr>
                <tr>
                    <td><code>npm run test:coverage</code></td>
                    <td>
                        Reports combined Node and Chromium coverage in
                        <code>build/coverage/frontend/</code>.
                    </td>
                </tr>
                <tr>
                    <td><code>composer test:coverage</code></td>
                    <td>Reports PHP execution coverage. The command requires Xdebug or PCOV.</td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            Before running the browser or frontend coverage command locally, install Chromium with
            <code>npx playwright install chromium --only-shell</code>.
        </p>
        <p>
            The Playwright test context grants <code>clipboard-read</code> and
            <code>clipboard-write</code> permissions. The copy-button test clicks the real control,
            checks its success event and status, and reads the copied text through the Clipboard
            API. Keep these permissions when changing the browser configuration: Chromium headless
            shell can reject clipboard access even after a trusted click.
        </p>
        <p>
            Wrapper property bindings initialize after the upstream module loads and the native
            element completes its first update. Browser readiness helpers use
            <code>await vi.dynamicImportSettled()</code> to wait for module loading. Wait for the
            expected public property and form-data values with
            <code>await expect.poll(...)</code> before interacting. Custom-element registration,
            <code>nextTick()</code>, or one animation frame alone does not confirm that the wrapper
            has applied those bindings. Keep delayed-loader coverage alongside the normal
            public-wrapper scenario.
        </p>
        <p>
            Keep tests that require an unregistered custom element in their own browser test files.
            Registration lasts for the document. Run
            <code>npm test -- localization-vite</code> to run the localization build, configuration
            watcher, and exporter lifecycle tests. Each case creates a temporary application, and
            Vitest runs the files in parallel.
        </p>
        <p>
            Native and Vue parity examples must both fit in the same viewport. The side-by-side
            suite uses a 1600-by-1000 viewport and checks horizontal visibility. Move the pointer
            outside both examples before comparing their resting styles. The Option scenario
            exercises this step by hovering the native option first. Tab groups initialize through
            an IntersectionObserver, so the suite also waits for the public active panel before
            comparing state, colors, and dimensions.
        </p>
        <p>
            The reset inventory runs the light and dark cases in separate browser files. Each
            fixture starts in its target theme. The tests settle animations inside the document and
            the sampled shadow roots before comparing computed styles.
        </p>
        <p>
            For changes to Tailwind, Web Awesome, or the optional PrimeVue integration, also follow
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/theme-maintenance').href"
                >Maintain the shared theme</DocsLink
            >. A successful build alone does not prove that theme tokens resolve in the browser.
        </p>
        <p>
            A documentation-only Markdown change runs the workflow's <code>CI</code> check without
            installing project dependencies. Other changes run the locked Linux quality checks and
            consumer build, plus the Windows runtime suites and DataView compiler launcher check.
            Both platforms test PHP 8.5 and 8.6. The Linux job uses Maintainer for manifest
            validation, Pest, Pint, PHPStan, and the frontend checks. The package runs its PHP type
            coverage gate and consumer build separately. Vue type checking runs within
            <code>npm run check</code>. Windows selects Pest and Vitest through Maintainer and runs
            Pest in serial mode.
        </p>
        <p>
            Changes to Composer dependencies or <code>.nvmrc</code> also exercise the lowest and
            latest compatible dependencies on each PHP version. The Maintainer setup action installs
            Node.js from <code>.nvmrc</code> for translation export checks. These jobs skip
            <code>npm ci</code>. The browser and coverage job uses PHP 8.5.
        </p>
        <p>
            Runtime and frontend tests select Chromium when they can affect browser behavior.
            Frontend source, theme and scrollbar fixtures, and dependency or tooling changes also
            run theme consumer checks and scrollbar checks on Firefox and WebKit. Release
            preparation, manual runs, workflow changes, and scheduled runs select all platform and
            browser checks. The browser job uses the Playwright image that matches
            <code>package-lock.json</code>. It sets <code>HOME</code> to the container user's home
            only for browser commands so Firefox can start. The Maintainer setup uses the runner's
            default home. The workflow registers the mounted checkout as a Git safe directory before
            Composer runs. Download the <code>coverage-reports</code>
            artifact from the scheduled run for PHP and frontend execution coverage. The type
            coverage requirement also runs in the normal Linux quality job.
        </p>
        <p>
            The localization tests compare browser choices with the installed Laravel selector.
            Laravel releases differ in their handling of whitespace around plural conditions. The
            exporter records that behavior in the generated catalog. Keep coverage for both
            behaviors and for older catalogs without the metadata when updating dependencies.
        </p>
        <h2
            id="follow-the-package-conventions"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Follow the package conventions
        </h2>
        <p>
            Write Vue single-file components with the Composition API and
            <code>&lt;script setup lang="ts"&gt;</code>. Put the template before the script block.
            Group related frontend integrations under the library they wrap. For example, the Web
            Awesome toast initializer lives at <code>resources/js/WebAwesome/flashToast.ts</code>.
        </p>
        <p>
            Maintainer manages releases on <code>1.x</code> and generates the README header. To
            regenerate the header after changing the logo or badges, run
            <code>php vendor/bin/maintainer readme:update --no-interaction</code>. The version badge
            links to GitHub Releases. The Packagist badge links to the package registry.
        </p>
        <p>
            The release configuration requires a successful <code>tests.yml</code> push run for the
            prepared commit. Use a Maintainer build that supports
            <code>release:create --resume</code>. Until that build is released, run
            <code>php ../maintainer/maintainer release:create</code> from Front Awesome with the
            sibling Maintainer source checkout and its Composer dependencies installed.
        </p>
        <h2
            id="use-the-frontend-agent-skills"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Use the frontend agent skills
        </h2>
        <p>
            The checkout keeps its skills in <code>.agents/skills/</code>. Claude Code can access
            the same directory through <code>.claude/skills/</code>. Composer and npm install the
            dependencies that supply the Inertia and Web Awesome references.
        </p>
        <ul>
            <li>
                <p>
                    Use <code>vue-best-practices</code> and
                    <code>vue-testing-best-practices</code> for Vue components, composables, and
                    tests.
                    <DocsLink href="https://github.com/vuejs-ai/skills">Vue AI Skills</DocsLink>
                </p>
            </li>
            <li>
                <p>
                    Use <code>vueuse-functions</code> to choose VueUse composables. The checkout
                    includes a snapshot for VueUse 14.4.0.
                    <DocsLink href="https://vueuse.org/guide/work-with-ai">VueUse skills</DocsLink>
                </p>
            </li>
            <li>
                <p>
                    Use <code>inertia-vue-development</code> for Inertia forms, navigation, shared
                    props, and SSR.
                    <DocsLink
                        href="https://github.com/inertiajs/inertia/tree/3.x/packages/vue3/resources/boost/skills/inertia-vue-development"
                        >Inertia Vue skill</DocsLink
                    >
                </p>
            </li>
            <li>
                <p>
                    Use <code>frontend-design</code> to choose the visual direction for a new or
                    redesigned interface.
                    <DocsLink
                        href="https://github.com/anthropics/skills/tree/41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f/skills/frontend-design"
                        >Frontend design skill</DocsLink
                    >
                </p>
            </li>
            <li>
                <p>
                    Use <code>webawesome</code> for component APIs and
                    <code>webawesome-design</code> for layouts, themes, and design tokens.
                    <DocsLink href="https://webawesome.com/docs/ai/agent-skills"
                        >Web Awesome agent skills</DocsLink
                    >
                </p>
            </li>
        </ul>
    </ProseSection>
</template>
