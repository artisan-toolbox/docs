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
            the frontend dependencies.
        </p>
        <CodeExample label="Develop Front Awesome example 1" language="sh" :code="example1" />
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
        <DocsTable caption="Validate a checkout reference 1"
            ><thead>
                <tr>
                    <th scope="col">Command</th>
                    <th scope="col">Purpose</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <code>php vendor/bin/maintainer quality:check --no-interaction</code>
                    </td>
                    <td>Runs the configured PHP and frontend checks.</td>
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
            Native and Vue parity examples must both fit in the same viewport. The side-by-side
            suite uses a 1600-by-1000 viewport and checks horizontal visibility. Tab groups
            initialize through an IntersectionObserver, so the suite also waits for the public
            active panel before comparing state, colors, and dimensions.
        </p>
        <p>
            For changes to Tailwind, Web Awesome, or the optional PrimeVue integration, also follow
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/theme-maintenance').href"
                >Maintain the shared theme</DocsLink
            >. A successful build alone does not prove that theme tokens resolve in the browser.
        </p>
        <p>
            CI runs both execution coverage commands in the Ubuntu job with stable dependencies.
            Download the
            <code>coverage-reports</code> artifact from that job to browse the PHP and frontend HTML
            reports. PHP type coverage runs across the support matrix.
        </p>
        <p>
            PHPStan loads the package service provider during bootstrap so it checks registered
            command signatures consistently across platforms. CI lets all matrix jobs finish after
            another job fails. Review both dependency lanes on Ubuntu and Windows.
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
            <code>php vendor/bin/maintainer readme:update --no-interaction</code>. The beta badge in
            <code>FrontAwesome::readmeHead()</code> describes package stability separately from the
            version managed by Maintainer.
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
