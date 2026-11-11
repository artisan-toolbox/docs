<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `resources/js/index.ts             Public exports and shared QzTray instance
resources/js/QzTray.ts            Public facade and singleton ownership
resources/js/QzTrayConnection.ts  Internal socket lifecycle manager
resources/js/QzTraySecurity.ts    Internal certificate and signing callbacks
resources/js/QzTrayPrinters.ts    Internal discovery and printing manager
resources/js/QzTrayConnector.ts   Deprecated class alias
resources/js/renderZpl.ts         Local ZPL previews with an internal WASM asset import
resources/js/renderEscpos.ts      Local ESC/POS previews with lazy renderer loading
resources/js/escposImage.ts       Internal QZ raw image validation and ESC/POS conversion
resources/js/renderPdf.ts         PDF source loading, page selection, rendering, and cleanup
resources/js/pdfAssets.ts         Internal bundled PDF font, CMap, and WASM resolution
tests/Frontend/                  Frontend tests and helpers
vite.config.ts                   Library build, formatting, linting, and test configuration
tsconfig.json                    Strict TypeScript configuration
dist/                            Compiled frontend shipped in Composer releases`;
const example2 = `npm ci
npm run check
npm run build`;
const example3 = `npm ci
npm run release:build
git add dist
npm run check:dist`;
const example4 = `npm run build -- --watch`;
const example5 = `import { fileURLToPath } from "node:url";
import { defineConfig, searchForWorkspaceRoot } from "vite";

export default defineConfig({
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(import.meta.dirname),
        fileURLToPath(
          new URL(".", import.meta.resolve("@artisan-toolbox/qztray")),
        ),
      ],
    },
  },
  // Keep the application's existing plugins and other options.
});`;
</script>

<template>
    <ProseSection>
        <h2
            id="frontend-tooling"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Frontend tooling
        </h2>
        <p>
            The package is maintained on the <code>1.x</code> branch. GitHub Actions tests version
            branches and pull requests. For local package changes, use your workspace's Composer
            path repository and the
            <DocsLink href="#continuous-builds-during-local-development"
                >continuous library build</DocsLink
            >.
        </p>
        <p>
            The frontend package is named <code>@artisan-toolbox/qztray</code>. It follows the
            Mosaicast library tooling pattern using Vite Plus and strict TypeScript. It exports the
            public <code>QzTray</code> class, a shared instance, a compatibility alias, typed print
            requests, and standalone ZPL, ESC/POS, and PDF preview functions.
        </p>
        <p>
            Building and testing package sources requires Node.js 22.18+ within 22.x, 24.11+ within
            24.x, or 26 and later. Installing the compiled package in a consuming application
            retains the existing Node.js 20.19+ compatibility. The declared package manager is npm
            11.17.0.
        </p>
        <p>The frontend layout is:</p>
        <CodeExample label="Frontend tooling example 1" language="text" :code="example1" />
        <p>From the package repository, install dependencies and validate the frontend:</p>
        <CodeExample label="Frontend tooling example 2" language="bash" :code="example2" />
        <p>
            The build produces <code>dist/index.js</code> (ESM),
            <code>dist/index.cjs</code> (CommonJS), <code>dist/qztray.iife.js</code> (IIFE), and
            <code>dist/index.d.ts</code> (TypeScript declarations). The IIFE library name is
            <code>QzTrayConnector</code>. These outputs expose the public class and shared instance
            described below. The CommonJS output uses <code>.cjs</code> because the package declares
            <code>type: module</code>.
        </p>
        <p>
            <code>npm run dev</code> starts Vite's development server. This library does not include
            an HTML demo page. <code>npm run check:fix</code> applies frontend formatting and lint
            fixes, and <code>npm run typecheck</code> checks TypeScript separately.
            <code>npm run test</code> discovers tests matching
            <code>tests/Frontend/**/*.test.ts</code> and verifies that the public exports and
            repeated imports share the same connector instance.
        </p>
        <p>
            The frontend package is private and is not published to the npm registry. Composer
            releases include the tracked
            <code>dist/</code> directory with renderer chunks, WASM, the PDF worker and auxiliary
            assets, declarations, and license notices. The local npm package exposes those compiled
            files through its package exports. The base connector is independent of Vue and Inertia.
        </p>
        <h3
            id="preparing-the-composer-distribution"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Preparing the Composer distribution
        </h3>
        <p>Maintainers regenerate and validate the frontend before creating a release tag:</p>
        <CodeExample
            label="Preparing the Composer distribution example 3"
            language="bash"
            :code="example3" />
        <p>
            When using Maintainer versioning,
            <code>QzTrayConnector::beforeVersioning($current, $next)</code>
            automatically runs <code>npm run build</code> from the QZ Tray package root,
            independently of the Maintainer application base path. Install the package development
            dependencies with <code>npm ci</code> before invoking versioning. The callback waits for
            completion without a process timeout and throws on a failed build, interrupting release
            creation. Maintainer stages the generated files afterward as part of its release flow;
            the callback does not run during a consumer Composer install.
        </p>
        <p>
            Include the generated <code>dist/</code> files, source changes, and package metadata in
            the release commit before tagging it. GitHub/Composer archives contain files tracked at
            the tagged commit; a build performed only in CI does not add files to that archive. Keep
            every emitted asset and license notice. The distribution CI job rebuilds with Node 24
            and rejects missing, modified, deleted, or untracked build files. The packaging
            integration test exercises a Git archive and verifies that compiled entries and renderer
            assets are included while tests are excluded. Composer consumers receive this
            ready-to-use distribution without running the library build.
        </p>
        <p>
            Maintainer refreshes the README header during release creation. After editing the logo
            or badges, run
            <code>php vendor/bin/maintainer readme:update</code> from the package checkout to
            regenerate the header.
        </p>
        <h3
            id="continuous-builds-during-local-development"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Continuous builds during local development
        </h3>
        <p>
            To rebuild the frontend library when its source files change, run this command from the
            package repository and leave it running:
        </p>
        <CodeExample
            label="Continuous builds during local development example 4"
            language="bash"
            :code="example4" />
        <p>
            This updates <code>dist/</code>; run the consuming application's Vite development server
            separately to test the library in the application. The package's
            <code>npm run dev</code> command starts its own Vite server and does not replace the
            library build watcher.
        </p>
        <p>
            When the consuming application links a local package outside its own workspace, the Vite
            development server may reject the renderer WASM request with HTTP <code>403</code>. Add
            the linked package's distribution directory to the <strong>application's</strong
            >{{ ' ' }} <code>vite.config.ts</code> (or <code>.js</code>), preserving the normal
            workspace allowance:
        </p>
        <CodeExample
            label="Continuous builds during local development example 5"
            language="ts"
            :code="example5" />
        <p>
            Merge these entries into an existing
            <code>server.fs.allow</code> list rather than replacing unrelated allowances. The
            resolved package entry points to <code>dist/</code>, including its WASM and renderer
            chunks, so the rule works with local symlinks without hardcoding a machine-specific
            path. Keep <code>server.fs.strict</code> enabled. This allowance applies to local
            development; normal production asset bundling remains automatic. See
            <DocsLink href="https://vite.dev/config/server-options#server-fs-allow"
                >Vite's filesystem access configuration</DocsLink
            >.
        </p>
        <p>
            Restart the application Vite server if it has not reloaded the configuration, then
            reload the browser page. The browser reload recreates a renderer whose initialization
            previously failed. A
            <code>WebAssembly.instantiate()</code> error that reports HTML bytes instead of the WASM
            magic bytes can be a secondary symptom of a denied request: inspect the network response
            status first.
        </p>
        <p>
            Vite Plus and the <code>vite</code> alias to
            <code>@voidzero-dev/vite-plus-core</code> must use the same version. Both are pinned to
            <code>1.6.0</code> in <code>package.json</code>. Vite Plus supplies the matching Vitest
            5.1.0 packages. Remove older Vitest overrides when upgrading so the runner, browser
            integration, mocker, and UI stay aligned. Update the Vite Plus and Vite alias entries
            together and refresh the lockfile. If a build reports an expected/found core version
            mismatch, check these entries and run <code>npm ci</code> once the manifest and lockfile
            are aligned.
        </p>
    </ProseSection>
</template>
