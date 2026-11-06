<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `import { renderZpl } from "@artisan-toolbox/qztray";

const zpl = "^XA^FO20,20^A0N,30,30^FDHello^FS^XZ";
const previewUrl = await renderZpl(zpl, {
  widthMm: 100,
  heightMm: 150,
  dpmm: 8,
});

// Bind previewUrl to an <img> element's src in your component.`;
const example2 = `const previewUrls = await renderZpl(zpl, {
  renderAll: true,
  widthMm: 100,
  heightMm: 150,
  dpmm: 8,
});

// Bind each URL to an image, or use previewUrls[pageIndex] for pagination.`;
const example3 = `<script setup lang="ts">
import { ref } from "vue";
import { renderZpl } from "@artisan-toolbox/qztray";

const previewUrl = ref("");

async function preview() {
  previewUrl.value = await renderZpl("^XA^FO20,20^A0N,30,30^FDHello^FS^XZ", {
    widthMm: 100,
    heightMm: 150,
  });
}
\x3C/script>

<template>
  <button type="button" @click="preview">Preview label</button>
  <img v-if="previewUrl" :src="previewUrl" alt="Label preview" />
</template>`;
</script>

<template>
    <ProseSection>
        <h2
            id="zpl-previews"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            ZPL previews
        </h2>
        <p>
            <code>renderZpl(zpl, options?)</code> renders ZPL locally as PNG
            data URLs (<code>data:image/png;base64,...</code>), ready for image
            elements. With the default <code>renderAll: false</code>, it returns
            <code>Promise&lt;string&gt;</code> for the first label. With
            <code>renderAll: true</code>, it returns
            <code>Promise&lt;string[]&gt;</code> containing every label in its
            original order, including a one-item array for a single-label
            document. TypeScript infers these return types from the literal
            flag; a dynamic boolean produces
            <code>Promise&lt;string | string[]&gt;</code>. It is a standalone
            function rather than a method on <code>QzTray</code>: rendering does
            not connect to QZ Tray, sign a payload, require Laravel credentials,
            or need an installed printer.
        </p>
        <CodeExample
            label="ZPL previews example 1"
            language="ts"
            :code="example1"
        />
        <p>To preview all labels in a multi-label ZPL document:</p>
        <CodeExample
            label="ZPL previews example 2"
            language="ts"
            :code="example2"
        />
        <p>
            The renderer parses the complete document, including label
            templates; the package does not split the ZPL manually. Dimensions
            and rendering flags apply to every returned image. The
            <code>renderAll</code> option applies only to that call and does not
            affect later previews or printing.
        </p>
        <p>For example, in a Vue component:</p>
        <CodeExample
            label="ZPL previews example 3"
            language="vue"
            :code="example3"
        />
        <h3
            id="renderer-and-asset-loading"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Renderer and asset loading
        </h3>
        <p>
            The implementation uses
            <DocsLink href="https://github.com/Fabrizz/zpl-renderer-js"
                ><code>zpl-renderer-js</code> 4.x</DocsLink
            >, an MIT-licensed JavaScript wrapper around Zebrash. It renders
            locally in WebAssembly; label contents are not sent to a rendering
            service. This local browser approach was chosen over an HTTP service
            such as
            <DocsLink href="https://labelary.com/service.html"
                >Labelary</DocsLink
            >.
        </p>
        <p>
            The library imports
            <code>zpl-renderer-js/wasm?url&amp;no-inline</code> internally and
            uses the external renderer build. The <code>no-inline</code> query
            keeps the approximately 7 MB WASM binary separate even in library
            mode, where Vite otherwise inlines assets. The package build emits
            <code>dist/zebrash.wasm</code> and a URL relative to the JavaScript
            module. A consuming Vite application recognizes that asset
            reference, emits the WASM with its own asset hash and base path, and
            requires no application-level WASM import or URL configuration. See
            <DocsLink href="https://vite.dev/guide/assets.html"
                >Vite's asset handling</DocsLink
            >.
        </p>
        <p>
            The WASM is fetched and initialized on the first valid preview
            request. Concurrent calls share initialization, and later calls
            reuse the engine while rendering a fresh image. Importing the
            package does not initialize the engine or fetch WASM. The ESM and
            CommonJS library builds contain a separate lazily loaded renderer
            chunk; the IIFE includes the renderer JavaScript but still loads
            WASM separately. When serving the IIFE directly, keep
            <code>zebrash.wasm</code> beside the script. Publish all files in
            <code>dist/</code>, including renderer chunks and WASM, rather than
            copying only the main JavaScript file.
        </p>
        <p>
            The automatic asset workflow is validated with Vite. Other bundlers
            must preserve or process the module-relative asset URL. For a custom
            asset deployment, pass <code>wasmUrl</code> in the options. Use the
            same URL on every call within a loaded module instance: switching
            assets after initialization is rejected because the upstream engine
            initializes once. Avoid initializing another copy of the upstream
            renderer in the same browser context; its Go runtime and ZPL API use
            global objects.
        </p>
        <h3
            id="preview-options-and-errors"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Preview options and errors
        </h3>
        <p>
            The exported <code>QzTrayRenderZplOptions</code> type describes
            per-call options:
        </p>
        <DocsTable caption="Preview options and errors reference 1"
            ><thead>
                <tr>
                    <th scope="col">Option</th>
                    <th scope="col">Default</th>
                    <th scope="col">Behavior</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>renderAll</code></td>
                    <td><code>false</code></td>
                    <td>
                        Return every label as an array of PNG data URLs instead
                        of only the first as a string.
                    </td>
                </tr>
                <tr>
                    <td><code>widthMm</code></td>
                    <td><code>101.6</code></td>
                    <td>
                        Label width in millimeters; must be finite and positive.
                    </td>
                </tr>
                <tr>
                    <td><code>heightMm</code></td>
                    <td><code>203.2</code></td>
                    <td>
                        Label height in millimeters; must be finite and
                        positive.
                    </td>
                </tr>
                <tr>
                    <td><code>dpmm</code></td>
                    <td><code>8</code></td>
                    <td>
                        Positive integer dots per millimeter; 8 is approximately
                        203 DPI, 12 approximately 305 DPI, and 24 approximately
                        610 DPI.
                    </td>
                </tr>
                <tr>
                    <td><code>grayscaleOutput</code></td>
                    <td><code>false</code></td>
                    <td>Preserve anti-aliasing in an 8-bit grayscale PNG.</td>
                </tr>
                <tr>
                    <td><code>enableInvertedLabels</code></td>
                    <td><code>false</code></td>
                    <td>
                        Honor inverted orientation when the ZPL requests
                        <code>^POI</code>.
                    </td>
                </tr>
                <tr>
                    <td><code>wasmUrl</code></td>
                    <td>Internally resolved asset URL</td>
                    <td>
                        Optional URL override for custom hosting; it must remain
                        consistent within the module instance.
                    </td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            Options do not change printing presets or future preview calls.
            Input ZPL is passed unchanged. Empty or non-string input, invalid
            URL overrides, and non-boolean flags reject with
            <code>TypeError</code>; invalid dimensions or resolution reject with
            <code>RangeError</code>, before loading the renderer. Asset
            download, WebAssembly initialization, parsing, and rendering
            failures propagate as rejected promises. Initialization failures
            remain associated with that engine instance; reload the page or
            worker to initialize again. A rendering failure does not discard a
            successfully initialized engine, so a later valid label can still
            render.
        </p>
        <p>
            A ZPL string containing multiple labels produces a preview of the
            first label by default; pass <code>renderAll: true</code> to render
            all labels. Rendering all labels uses more processing time and
            memory, and preview images are not cached. The underlying engine
            supports a subset of printer behavior; the preview does not
            guarantee identical output on physical hardware. Continue sending
            the original ZPL with <code>qztray.printZpl()</code> for printing.
            The PNG preview does not add image printing support to the package.
            For frequent or complex renders, consider running the preview code
            in an application worker to keep processing off the UI thread, as
            recommended by the upstream project.
        </p>
        <p>
            Automated tests cover validation, option forwarding, shared
            initialization across single-label and multi-label calls,
            return-type inference, failures, and real single-label and
            multi-label PNG generation using the shipped WASM. A packaging test
            builds the library and a consuming Vite application under a nested
            base path, checking that WASM is emitted as a separate asset without
            production application configuration. It also verifies that an
            externally linked WASM file requires an explicit development-server
            allowance, and that unrelated files remain restricted. The test
            resolves its temporary directory with Node's native
            <code>realpath</code> before building or checking permissions. This
            avoids Windows CI temporary paths containing 8.3 aliases such as
            <code>RUNNER~1</code>, which Vite rejects even when allowlisted, and
            keeps the same filesystem restrictions on every platform. This
            real-build integration test has a two-minute timeout for shared CI
            runners; ordinary unit tests retain their existing timeouts. Asset
            and connection assertions are unchanged.
        </p>
    </ProseSection>
</template>
